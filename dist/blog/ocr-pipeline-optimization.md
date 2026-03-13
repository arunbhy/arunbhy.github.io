Running OCR at scale teaches you things that benchmarks don't. After two years optimizing a document processing pipeline at UnitedHealth Group — handling **45,000+ forms per month** — here are the lessons that made the biggest difference.

## 1. Batch Smartly, Not Greedily

The naive approach: maximize GPU batch size for throughput. The reality: document images vary wildly in resolution and page count.

A single 4000×6000 pixel scan in a batch of 300×400 thumbnails causes an OOM crash. We solved this with **dynamic batching** — grouping documents by resolution bucket before inference:

```python
def create_batches(documents, max_pixels=4_000_000):
    buckets = defaultdict(list)
    for doc in documents:
        bucket_key = (doc.width // 500, doc.height // 500)
        buckets[bucket_key].append(doc)

    for bucket in buckets.values():
        batch = []
        total_pixels = 0
        for doc in bucket:
            pixels = doc.width * doc.height
            if total_pixels + pixels > max_pixels and batch:
                yield batch
                batch, total_pixels = [], 0
            batch.append(doc)
            total_pixels += pixels
        if batch:
            yield batch
```

This eliminated OOM errors entirely and improved throughput by 25%.

## 2. Pre-Processing Is Half the Battle

Before touching any ML model, invest heavily in image pre-processing. These "boring" steps gave us a **12% accuracy improvement** with zero model changes:

- **Deskewing** — Most scanned documents are slightly rotated. Even 2° of skew degrades OCR significantly. We used Hough line detection to estimate and correct skew angle.
- **Binarization** — Adaptive thresholding (Otsu's method) converts grayscale scans to clean black-on-white, removing background noise.
- **Noise removal** — Morphological operations (opening/closing) clean up salt-and-pepper noise from low-quality scans.
- **Border removal** — Dark borders from scanning often confuse layout detection. Simple contour detection removes them.

> Rule of thumb: if you can't read it easily as a human after pre-processing, the model won't either.

## 3. Cache Template Matches

For templated forms (insurance claims, tax documents, medical records), the same layout appears thousands of times. We implemented a **template cache**:

1. First encounter: run full layout classification → cache the result keyed by a perceptual hash of the form header
2. Subsequent encounters: hash the header → cache lookup → skip classification entirely

This cut per-document inference time by **40%** for high-repetition templates. The cache hit rate in production averaged 78%.

## 4. Monitor Drift Continuously

Models degrade silently. We built real-time dashboards tracking:

- **Confidence score distributions** per model per week
- **Character-level error rates** on a sampled validation set
- **Template distribution shifts** (new form types appearing)
- **Processing time percentiles** (p50, p95, p99)

When mean confidence dropped below a threshold, it triggered a Slack alert and auto-queued a retraining job. This caught two major degradation events before they impacted downstream systems.

## 5. Concurrency Beats Bigger Models

We tested two approaches:
- **Vertical scaling**: 1× large model on an A100
- **Horizontal scaling**: 4× medium models on T4s

The horizontal approach won on every metric:

| Metric | 1× Large (A100) | 4× Medium (T4) |
|--------|-----------------|-----------------|
| Throughput | 24 docs/min | 38 docs/min |
| p95 latency | 4.2s | 2.8s |
| Cost/month | $3,200 | $1,800 |
| Fault tolerance | Single point | Graceful degradation |

The medium models were 92% as accurate as the large one. For production document processing, that tradeoff is almost always worth it.

## 6. Design for Failure

At scale, every edge case happens daily:
- Corrupted PDFs that crash the parser
- 200-page documents that timeout
- Handwritten notes mixed with printed text
- Documents in unexpected languages

We built a **dead letter queue** for failures — documents that error out get routed to a separate queue for manual review and later analysis. This prevented one bad document from blocking the entire pipeline.

---

*These patterns aren't specific to OCR — they apply to any ML pipeline processing heterogeneous data at scale. The theme: invest in engineering around the model, not just the model itself.*
