Your model works great on launch day. Three months later, accuracy has quietly dropped 15% and nobody noticed. Model drift is the silent killer of ML systems in production — here's how to detect and handle it before your users do.

## Types of Drift

### Data Drift (Covariate Shift)

The distribution of input features changes over time. Your model was trained on data from 2023, but the world in 2025 looks different.

**Example:** An OCR model trained on printed forms starts receiving more handwritten documents. The input distribution has shifted, but the relationship between features and labels hasn't necessarily changed.

### Concept Drift

The relationship between inputs and outputs changes. The same input should now produce a different output.

**Example:** A fraud detection model trained before contactless payments became common. The patterns that indicate fraud have fundamentally changed — not just the data distribution.

### Label Drift

The distribution of target labels changes. Your 5% default rate becomes 8% due to economic conditions.

## Detection Methods

### Statistical Tests for Data Drift

```python
from scipy import stats
import numpy as np

class DriftDetector:
    def __init__(self, reference_data, window_size=1000):
        self.reference = reference_data
        self.window_size = window_size

    def detect_univariate_drift(self, current_data, feature_name):
        """KS test for continuous features, chi-squared for categorical"""
        ref = self.reference[feature_name]
        cur = current_data[feature_name]

        if ref.dtype in ['float64', 'float32', 'int64']:
            stat, p_value = stats.ks_2samp(ref, cur)
        else:
            stat, p_value = self.chi_squared_test(ref, cur)

        return {
            "feature": feature_name,
            "statistic": stat,
            "p_value": p_value,
            "drifted": p_value < 0.05
        }

    def detect_multivariate_drift(self, current_data):
        """MMD (Maximum Mean Discrepancy) for high-dimensional drift"""
        from sklearn.metrics.pairwise import rbf_kernel

        ref_sample = self.reference.sample(min(500, len(self.reference)))
        cur_sample = current_data.sample(min(500, len(current_data)))

        K_xx = rbf_kernel(ref_sample, ref_sample)
        K_yy = rbf_kernel(cur_sample, cur_sample)
        K_xy = rbf_kernel(ref_sample, cur_sample)

        mmd = K_xx.mean() + K_yy.mean() - 2 * K_xy.mean()
        return {"mmd": mmd, "drifted": mmd > self.mmd_threshold}
```

### Prediction Drift Monitoring

Often the most practical approach — monitor model outputs rather than inputs:

```python
class PredictionMonitor:
    def __init__(self, baseline_predictions):
        self.baseline_dist = np.histogram(baseline_predictions, bins=50)
        self.alert_threshold = 0.1  # PSI threshold

    def compute_psi(self, current_predictions):
        """Population Stability Index"""
        current_dist = np.histogram(current_predictions,
                                     bins=self.baseline_dist[1])

        baseline_pct = self.baseline_dist[0] / sum(self.baseline_dist[0])
        current_pct = current_dist[0] / sum(current_dist[0])

        # Avoid division by zero
        baseline_pct = np.clip(baseline_pct, 0.001, None)
        current_pct = np.clip(current_pct, 0.001, None)

        psi = np.sum(
            (current_pct - baseline_pct) *
            np.log(current_pct / baseline_pct)
        )

        return {
            "psi": psi,
            "status": "stable" if psi < 0.1 else
                      "moderate_drift" if psi < 0.25 else
                      "significant_drift"
        }
```

PSI thresholds:
- **< 0.1** — no significant drift
- **0.1 - 0.25** — moderate drift, investigate
- **> 0.25** — significant drift, action required

### Confidence Score Monitoring

The simplest and often most effective approach:

```python
class ConfidenceMonitor:
    def __init__(self, window_days=7):
        self.window_days = window_days
        self.history = []

    def log_prediction(self, confidence, timestamp):
        self.history.append({"confidence": confidence, "timestamp": timestamp})

    def check_health(self):
        recent = [h for h in self.history
                  if h["timestamp"] > datetime.now() - timedelta(days=self.window_days)]

        confidences = [h["confidence"] for h in recent]

        return {
            "mean_confidence": np.mean(confidences),
            "p10_confidence": np.percentile(confidences, 10),
            "low_confidence_rate": sum(1 for c in confidences if c < 0.5) / len(confidences),
            "alert": np.mean(confidences) < self.alert_threshold
        }
```

When mean confidence drops, it usually means the model is seeing inputs it wasn't trained for.

## Building a Monitoring Dashboard

The metrics above need to be visualized and alerted on. A practical setup:

```python
# Metrics to track per model, per time window
dashboard_metrics = {
    # Performance (requires ground truth, often delayed)
    "accuracy": compute_accuracy(predictions, labels),
    "precision_recall": compute_pr(predictions, labels),
    "auc_roc": compute_auc(predictions, labels),

    # Operational (available immediately)
    "prediction_latency_p95": np.percentile(latencies, 95),
    "throughput_per_minute": len(predictions) / minutes_elapsed,
    "error_rate": errors / total_requests,

    # Drift (computed on windows)
    "psi": prediction_monitor.compute_psi(window_predictions),
    "mean_confidence": np.mean(window_confidences),
    "feature_drift_count": sum(1 for f in features if detector.detect(f)["drifted"]),
}
```

## Response Strategies

### Automated Retraining

For models where fresh data is continuously available:

```python
class RetrainingTrigger:
    def __init__(self, model, retrain_pipeline):
        self.model = model
        self.pipeline = retrain_pipeline

    def evaluate_and_retrain(self, metrics):
        if metrics["psi"] > 0.25 or metrics["accuracy"] < self.min_accuracy:
            # Stage 1: Retrain on recent data
            new_model = self.pipeline.train(
                data=self.get_recent_training_data(days=90)
            )

            # Stage 2: Validate before deployment
            val_metrics = self.pipeline.evaluate(new_model, self.validation_set)

            if val_metrics["accuracy"] > metrics["accuracy"] * 0.95:
                # Stage 3: Shadow deploy
                self.pipeline.shadow_deploy(new_model, duration_hours=24)
            else:
                self.alert("Retrained model failed validation", val_metrics)
```

### Fallback Mechanisms

When drift is detected but retraining isn't immediate:

1. **Confidence thresholding** — route low-confidence predictions to human review
2. **Model ensemble** — fall back to a simpler, more robust model
3. **Rule-based fallback** — hard-coded rules for critical edge cases

## Practical Tips

**Log everything from day one.** You can't detect drift if you don't have baseline distributions. Log all inputs, outputs, confidence scores, and latencies from the moment your model goes live.

**Set up alerts before you need them.** Don't wait for the first incident. Configure PagerDuty/Slack alerts for PSI > 0.1, confidence drops, and latency spikes at deployment time.

**Ground truth delay is real.** In many applications (credit risk, medical diagnosis), you don't know if the prediction was correct for weeks or months. Design your monitoring to work with both immediate signals (confidence, drift) and delayed signals (accuracy).

**Retrain on a schedule AND on triggers.** Monthly retraining catches gradual drift. Trigger-based retraining catches sudden shifts. Use both.

---

*Further reading: [Evidently AI](https://www.evidentlyai.com/), [NannyML](https://www.nannyml.com/), [Monitoring ML Models in Production](https://christophergs.com/machine%20learning/2020/03/14/how-to-monitor-machine-learning-models/)*