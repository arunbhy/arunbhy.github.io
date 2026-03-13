How do you know if your LLM application is actually working? Traditional ML metrics (accuracy, F1) don't capture what matters for generative AI. After building evaluation pipelines for multiple LLM features, here are the metrics and approaches that actually work.

## The Evaluation Challenge

LLM outputs are open-ended text. There's no single "correct" answer for most tasks. "Summarize this document" can have dozens of valid summaries. This makes evaluation fundamentally harder than classification or regression.

## Reference-Based Metrics (When You Have Ground Truth)

### ROUGE — Summarization

Measures overlap between generated and reference summaries:

```python
from rouge_score import rouge_scorer

scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)

reference = "The cat sat on the mat near the window."
generated = "A cat was sitting on a mat by the window."

scores = scorer.score(reference, generated)
# rouge1: precision=0.78, recall=0.78, f1=0.78
# rouge2: precision=0.43, recall=0.43, f1=0.43
# rougeL: precision=0.67, recall=0.67, f1=0.67
```

**ROUGE-1** measures unigram overlap, **ROUGE-2** bigram overlap, and **ROUGE-L** the longest common subsequence. ROUGE-L is usually the most informative.

**Limitation:** ROUGE penalizes valid paraphrases. "The feline rested on the rug" scores poorly against "The cat sat on the mat" despite conveying the same meaning.

### BERTScore — Semantic Similarity

Uses contextual embeddings to measure meaning overlap, not just word overlap:

```python
from bert_score import score

references = ["The cat sat on the mat near the window."]
candidates = ["A feline was resting on a rug by the window."]

P, R, F1 = score(candidates, references, lang="en", model_type="microsoft/deberta-xlarge-mnli")
# F1 ≈ 0.92 (much higher than ROUGE because it captures semantic similarity)
```

BERTScore correlates better with human judgment than ROUGE for most tasks.

## LLM-as-Judge

The most practical approach for production evaluation: use a strong LLM to evaluate outputs from your application LLM.

```python
JUDGE_PROMPT = """You are evaluating the quality of an AI assistant's response.

Task: {task_description}
User Query: {query}
AI Response: {response}
Reference Answer (if available): {reference}

Rate the response on these dimensions (1-5 scale):

1. **Relevance** — Does the response address the user's query?
2. **Accuracy** — Is the information factually correct?
3. **Completeness** — Does it cover all important aspects?
4. **Clarity** — Is it well-organized and easy to understand?
5. **Conciseness** — Is it appropriately brief without sacrificing quality?

Respond in JSON format:
{{
    "relevance": {{"score": int, "reason": string}},
    "accuracy": {{"score": int, "reason": string}},
    "completeness": {{"score": int, "reason": string}},
    "clarity": {{"score": int, "reason": string}},
    "conciseness": {{"score": int, "reason": string}},
    "overall": {{"score": int, "reason": string}}
}}"""

async def evaluate_response(query, response, reference=None):
    judge_response = await judge_model.generate(
        JUDGE_PROMPT.format(
            task_description="Answer user questions about our product",
            query=query,
            response=response,
            reference=reference or "Not available"
        )
    )
    return json.loads(judge_response)
```

### Mitigating Judge Bias

LLM judges have known biases:
- **Position bias** — prefer the first option in comparisons
- **Verbosity bias** — prefer longer responses
- **Self-preference** — GPT-4 rates GPT-4 outputs higher

Countermeasures:

```python
async def unbiased_comparison(query, response_a, response_b):
    # Run comparison in both orders
    result_ab = await judge.compare(query, response_a, response_b)
    result_ba = await judge.compare(query, response_b, response_a)

    # Only count if both orders agree
    if result_ab["winner"] == "A" and result_ba["winner"] == "B":
        return "A wins"
    elif result_ab["winner"] == "B" and result_ba["winner"] == "A":
        return "B wins"
    else:
        return "Tie"
```

## RAG-Specific Metrics

For RAG systems, you need to evaluate both retrieval and generation:

### Retrieval Metrics

```python
def evaluate_retrieval(retrieved_docs, relevant_docs, k=5):
    retrieved_set = set(retrieved_docs[:k])
    relevant_set = set(relevant_docs)

    return {
        "recall_at_k": len(retrieved_set & relevant_set) / len(relevant_set),
        "precision_at_k": len(retrieved_set & relevant_set) / k,
        "mrr": mean_reciprocal_rank(retrieved_docs, relevant_docs),
    }
```

### Faithfulness (Groundedness)

Does the generated answer stay faithful to the retrieved context? This catches hallucinations:

```python
FAITHFULNESS_PROMPT = """Given the following context and answer, determine if every claim
in the answer is supported by the context.

Context: {context}
Answer: {answer}

For each sentence in the answer, state whether it is:
- SUPPORTED: directly supported by the context
- NOT_SUPPORTED: makes a claim not found in the context
- IRRELEVANT: not a factual claim

Respond in JSON format:
{{"sentences": [{{"text": string, "verdict": string, "evidence": string}}],
 "faithfulness_score": float}}"""
```

### Answer Relevance

Does the answer actually address the question?

```python
RELEVANCE_PROMPT = """Given the question and answer below, generate 3 questions that
the answer would be a good response to. Then compare these generated questions
to the original question.

Original Question: {question}
Answer: {answer}

If the generated questions are semantically similar to the original,
the answer is relevant. Score from 0.0 to 1.0."""
```

## Building an Evaluation Pipeline

```python
class EvalPipeline:
    def __init__(self, test_cases, metrics):
        self.test_cases = test_cases
        self.metrics = metrics

    async def run(self, model):
        results = []
        for case in self.test_cases:
            # Generate response
            response = await model.generate(case["query"])

            # Compute all metrics
            scores = {}
            for metric in self.metrics:
                scores[metric.name] = await metric.compute(
                    query=case["query"],
                    response=response,
                    reference=case.get("reference"),
                    context=case.get("context")
                )

            results.append({
                "query": case["query"],
                "response": response,
                "scores": scores
            })

        return self.aggregate(results)

    def aggregate(self, results):
        summary = {}
        for metric in self.metrics:
            scores = [r["scores"][metric.name] for r in results]
            summary[metric.name] = {
                "mean": np.mean(scores),
                "std": np.std(scores),
                "min": np.min(scores),
                "p25": np.percentile(scores, 25),
            }
        return summary

# Usage
pipeline = EvalPipeline(
    test_cases=load_test_cases("eval_dataset.json"),
    metrics=[
        BERTScoreMetric(),
        FaithfulnessMetric(judge_model),
        RelevanceMetric(judge_model),
        LatencyMetric(),
    ]
)

results = await pipeline.run(my_rag_system)
```

## Evaluation Anti-Patterns

**Don't evaluate on your few-shot examples.** Your prompt already contains these examples — of course the model will handle them well. Use a separate held-out test set.

**Don't rely on a single metric.** A summary can score high on ROUGE (word overlap) but be factually wrong. Always use multiple metrics that capture different quality dimensions.

**Don't skip human evaluation.** Automated metrics are proxies. Periodically review a sample of outputs manually, especially after prompt changes.

**Don't evaluate once and forget.** Model behavior changes with updates, data shifts, and prompt modifications. Run evaluations continuously, not just at launch.

## Practical Framework

For any LLM application, set up these three evaluation layers:

1. **Offline eval** — run your test suite before deploying prompt changes
2. **Online monitoring** — track confidence scores, output length, and latency in production
3. **Periodic human review** — sample 50-100 outputs weekly for manual quality assessment

---

*Further reading: [RAGAS](https://docs.ragas.io/), [DeepEval](https://docs.confident-ai.com/), [LLM Evaluation Survey](https://arxiv.org/abs/2307.03025)*