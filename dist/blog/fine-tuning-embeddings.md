Off-the-shelf embedding models work well for general text. But when your domain has specialized vocabulary — medical forms, legal contracts, financial filings — generic embeddings leave performance on the table. Fine-tuning your embedding model for domain-specific retrieval can dramatically improve recall in RAG pipelines.

## Why Generic Embeddings Fall Short

Models like `all-MiniLM-L6-v2` or OpenAI's `text-embedding-3-small` are trained on broad internet text. They understand that "dog" and "puppy" are similar, but they don't know that "HbA1c" and "glycated hemoglobin" are the same thing, or that "Form 1040-SR" relates to "senior tax filing."

In practice, this means:
- Relevant documents rank lower in retrieval
- The LLM gets noisy context and produces worse answers
- You compensate by retrieving more chunks, increasing cost and latency

## The Fine-Tuning Approach

The idea is simple: train the embedding model on your domain data so that semantically related content maps to nearby vectors.

### Step 1: Create Training Pairs

You need pairs of (query, relevant_passage). Three ways to get them:

**From existing data:**
```python
# If you have a search log or FAQ
pairs = [
    ("What is the copay for specialist visits?",
     "Members pay a $40 copayment for in-network specialist office visits..."),
    ("How do I file a grievance?",
     "To file a formal grievance, submit Form GR-100 within 60 days...")
]
```

**LLM-generated queries:**
```python
def generate_queries(passage, n=3):
    prompt = f"""Generate {n} natural questions that this passage answers:

    {passage}

    Return only the questions, one per line."""
    return llm.generate(prompt).strip().split("\n")
```

**Hard negatives mining:**
```python
# Find passages that are similar but NOT relevant
def mine_hard_negatives(query, corpus, model, k=10):
    embeddings = model.encode(corpus)
    query_emb = model.encode(query)
    scores = cosine_similarity([query_emb], embeddings)[0]
    # Top-k similar but irrelevant passages
    candidates = np.argsort(scores)[-k:]
    return [corpus[i] for i in candidates if not is_relevant(query, corpus[i])]
```

Hard negatives are critical — they teach the model to distinguish between "looks similar" and "actually relevant."

### Step 2: Fine-Tune with Sentence Transformers

```python
from sentence_transformers import SentenceTransformer, InputExample, losses
from torch.utils.data import DataLoader

model = SentenceTransformer("all-MiniLM-L6-v2")

train_examples = [
    InputExample(texts=[query, positive_passage], label=1.0)
    for query, positive_passage in pairs
]

train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
train_loss = losses.MultipleNegativesRankingLoss(model)

model.fit(
    train_objectives=[(train_dataloader, train_loss)],
    epochs=3,
    warmup_steps=100,
    show_progress_bar=True
)

model.save("fine-tuned-embeddings")
```

### Step 3: Evaluate

Always compare against the base model on a held-out test set:

```python
from sentence_transformers import evaluation

evaluator = evaluation.InformationRetrievalEvaluator(
    queries=test_queries,
    corpus=test_corpus,
    relevant_docs=test_relevance,
    name="domain-eval"
)

# Compare
base_results = evaluator(base_model)
fine_tuned_results = evaluator(fine_tuned_model)
```

Key metrics to track: **Recall@5**, **MRR@10**, and **NDCG@10**.

## Practical Tips

**How much data do you need?** In my experience, 1,000-5,000 high-quality pairs are enough for meaningful improvement. Beyond 10,000, returns diminish unless your domain is very specialized.

**Which base model?** Start with `all-MiniLM-L6-v2` for speed or `all-mpnet-base-v2` for quality. If you need multilingual support, `paraphrase-multilingual-MiniLM-L12-v2` is solid.

**Don't overfit.** Fine-tuning for too long degrades general understanding. Use early stopping based on validation recall, and always test on out-of-domain queries to ensure the model hasn't lost its general capabilities.

**Matryoshka embeddings.** Some newer models support variable-dimension embeddings. Fine-tune at full dimension, then truncate at inference time for a speed/quality tradeoff.

## When NOT to Fine-Tune

- Your retrieval is already good (recall@5 > 90%)
- You have fewer than 200 training pairs
- Your domain vocabulary is standard English
- You can solve the problem with better chunking or hybrid search

Fine-tuning embeddings is a powerful lever, but it's not the first thing to try. Fix your chunking strategy, add keyword search, and tune your retrieval parameters first. Only fine-tune when you've hit the ceiling with those approaches.

---

*Further reading: [Sentence Transformers documentation](https://www.sbert.net/docs/training/overview.html), [Matryoshka Representation Learning](https://arxiv.org/abs/2205.13147)*