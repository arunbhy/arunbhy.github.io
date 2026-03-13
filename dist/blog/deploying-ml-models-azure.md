Getting a model to work in a notebook is 20% of the job. Deploying it as a reliable, scalable service is the other 80%. After deploying multiple ML models on Azure at UnitedHealth Group, here's the practical guide I wish I had when starting out.

## Choosing a Deployment Strategy

Azure offers multiple paths. The right choice depends on your latency, scale, and complexity requirements:

| Approach | Best For | Cold Start | Scale |
|----------|----------|------------|-------|
| Azure Container Apps | Most ML APIs | ~2s | Auto, 0 to many |
| Azure Functions | Lightweight inference | ~5s | Serverless |
| Azure ML Managed Endpoints | Full MLOps lifecycle | None (always-on) | Manual/auto |
| Azure Kubernetes Service | Complex multi-model | None | Full control |

For most teams, **Azure Container Apps** hits the sweet spot — container-based, auto-scaling, and doesn't require Kubernetes expertise.

## Containerizing Your Model

Start with a well-structured Docker image:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cache layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model artifacts
COPY model/ ./model/

# Copy application code
COPY app/ ./app/

# Health check
HEALTHCHECK --interval=30s --timeout=10s \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### The FastAPI Serving Layer

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import logging

app = FastAPI()
logger = logging.getLogger(__name__)

# Load model once at startup
model = None

@app.on_event("startup")
async def load_model():
    global model
    logger.info("Loading model...")
    model = torch.load("model/model.pt", map_location="cpu")
    model.eval()
    logger.info("Model loaded successfully")

class PredictionRequest(BaseModel):
    text: str
    max_length: int = 128

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    latency_ms: float

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    import time
    start = time.perf_counter()

    try:
        with torch.no_grad():
            result = model.predict(request.text)

        latency = (time.perf_counter() - start) * 1000

        return PredictionResponse(
            prediction=result["label"],
            confidence=result["score"],
            latency_ms=round(latency, 2)
        )
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed")

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model is not None}
```

## Deploying to Azure Container Apps

```bash
# Create resource group
az group create --name ml-prod --location eastus

# Create container registry
az acr create --resource-group ml-prod --name mlmodels --sku Basic

# Build and push
az acr build --registry mlmodels --image ocr-model:v1 .

# Create Container App environment
az containerapp env create \
    --name ml-env \
    --resource-group ml-prod \
    --location eastus

# Deploy
az containerapp create \
    --name ocr-service \
    --resource-group ml-prod \
    --environment ml-env \
    --image mlmodels.azurecr.io/ocr-model:v1 \
    --target-port 8000 \
    --ingress external \
    --min-replicas 1 \
    --max-replicas 10 \
    --cpu 2 --memory 4Gi \
    --registry-server mlmodels.azurecr.io
```

### Auto-Scaling Configuration

```bash
az containerapp update \
    --name ocr-service \
    --resource-group ml-prod \
    --scale-rule-name cpu-scaling \
    --scale-rule-type cpu \
    --scale-rule-metadata "type=Utilization" "value=70"
```

Scale based on CPU utilization — when average CPU exceeds 70%, add replicas. For GPU workloads, scale based on queue length instead.

## Model Versioning and Blue-Green Deployment

Never update a model in-place. Use revisions for zero-downtime deployments:

```bash
# Deploy new version as a new revision
az containerapp update \
    --name ocr-service \
    --resource-group ml-prod \
    --image mlmodels.azurecr.io/ocr-model:v2 \
    --revision-suffix v2

# Split traffic: 90% to v1, 10% to v2 (canary)
az containerapp ingress traffic set \
    --name ocr-service \
    --resource-group ml-prod \
    --revision-weight ocr-service--v1=90 ocr-service--v2=10

# After validation, shift all traffic to v2
az containerapp ingress traffic set \
    --name ocr-service \
    --resource-group ml-prod \
    --revision-weight ocr-service--v2=100
```

## Performance Optimization

### Model Optimization Before Deployment

```python
# ONNX conversion for faster inference
import torch.onnx

torch.onnx.export(
    model,
    dummy_input,
    "model.onnx",
    opset_version=14,
    dynamic_axes={"input": {0: "batch_size"}}
)

# Quantization for CPU deployment
import onnxruntime as ort
from onnxruntime.quantization import quantize_dynamic, QuantType

quantize_dynamic(
    "model.onnx",
    "model_quantized.onnx",
    weight_type=QuantType.QInt8
)
```

ONNX + quantization typically gives a **2-4x speedup** on CPU with minimal accuracy loss.

### Batch Processing for Throughput

```python
import asyncio
from collections import deque

class BatchPredictor:
    def __init__(self, model, max_batch_size=32, max_wait_ms=50):
        self.model = model
        self.max_batch_size = max_batch_size
        self.max_wait_ms = max_wait_ms
        self.queue = deque()

    async def predict(self, input_data):
        future = asyncio.get_event_loop().create_future()
        self.queue.append((input_data, future))

        if len(self.queue) >= self.max_batch_size:
            await self._process_batch()
        else:
            await asyncio.sleep(self.max_wait_ms / 1000)
            if not future.done():
                await self._process_batch()

        return await future

    async def _process_batch(self):
        batch_items = []
        while self.queue and len(batch_items) < self.max_batch_size:
            batch_items.append(self.queue.popleft())

        inputs = [item[0] for item in batch_items]
        results = self.model.batch_predict(inputs)

        for (_, future), result in zip(batch_items, results):
            future.set_result(result)
```

## Monitoring in Production

```python
from opencensus.ext.azure import metrics_exporter
from opencensus.stats import aggregation, measure, stats, view

# Custom metrics
prediction_latency = measure.MeasureFloat(
    "prediction_latency", "Prediction latency in ms", "ms"
)
prediction_count = measure.MeasureInt(
    "prediction_count", "Number of predictions", "1"
)

# Export to Azure Application Insights
exporter = metrics_exporter.new_metrics_exporter(
    connection_string="InstrumentationKey=your-key"
)
```

Track these metrics from day one:
- **p50, p95, p99 latency** — catch performance regressions
- **Error rate** — by error type
- **Throughput** — requests per second
- **Model confidence distribution** — catch drift early
- **Input/output sizes** — catch unexpected payloads

## Common Pitfalls

**Cold starts kill latency.** If your model takes 30 seconds to load, keep at least one replica always running (`min-replicas 1`). For GPU models, pre-warm the CUDA context.

**Memory leaks from model inference.** PyTorch can leak memory if you forget `torch.no_grad()` or don't detach tensors. Monitor RSS memory over time.

**Large model files bloat container images.** Store model artifacts in Azure Blob Storage and download at startup, rather than baking them into the Docker image. This keeps your CI/CD pipeline fast.

**Don't forget authentication.** ML APIs often get deployed without auth because "it's internal." Use Azure AD or API keys at minimum.

---

*Further reading: [Azure Container Apps docs](https://learn.microsoft.com/en-us/azure/container-apps/), [ONNX Runtime](https://onnxruntime.ai/), [ML deployment patterns](https://ml-ops.org/content/mlops-principles)*