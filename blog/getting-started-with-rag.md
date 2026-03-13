Retrieval-Augmented Generation (RAG) combines the knowledge retrieval capabilities of search systems with the generative power of LLMs. Instead of relying solely on what a model memorized during training, RAG lets it **look things up** — grounding responses in actual documents.

Here's what I've learned building RAG systems from scratch.

## The Pipeline

The architecture is deceptively simple:

1. **Chunk** your documents into passages
2. **Embed** each chunk into a vector
3. **Store** vectors in a database
4. At query time, **retrieve** relevant chunks
5. **Feed** them as context to an LLM

Each step has pitfalls. Let's walk through them.

## Chunking: Where Most People Go Wrong

Chunking strategy is the single biggest lever on RAG quality, yet it gets the least attention.

### Size matters

- **Too small** (50-100 tokens) — loses context. "The patient was prescribed 500mg" means nothing without knowing which patient, which medication.
- **Too large** (1000+ tokens) — dilutes relevance. When you retrieve a 2000-token chunk because one sentence matches, you're feeding the LLM 1900 tokens of noise.

**Sweet spot: 300-500 tokens with 50-token overlap** works for most use cases.

### But context matters more

Different content needs different chunking:

```python
# Bad: fixed-size chunking ignores document structure
chunks = [text[i:i+500] for i in range(0, len(text), 450)]

# Better: respect document boundaries
def smart_chunk(text, max_tokens=500):
    sections = split_by_headers(text)
    chunks = []
    for section in sections:
        if count_tokens(section) <= max_tokens:
            chunks.append(section)
        else:
            # Split long sections at paragraph boundaries
            chunks.extend(split_at_paragraphs(section, max_tokens))
    return chunks
```

**Legal documents** need larger chunks (preserve clause context). **FAQs** can use smaller chunks (each Q&A is self-contained). **Code documentation** should chunk by function/class.

## Embedding Models

Your embedding model determines retrieval quality. The query "how do I fix a memory leak" needs to match a document about "garbage collection optimization" — that requires semantic understanding, not keyword matching.

### Recommendations

| Use Case | Model | Dimensions | Speed |
|----------|-------|-----------|-------|
| General purpose | `all-MiniLM-L6-v2` | 384 | Fast |
| Higher quality | `bge-large-en-v1.5` | 1024 | Medium |
| Multilingual | `multilingual-e5-large` | 1024 | Medium |
| Domain-specific | Fine-tuned on your data | Varies | Varies |

**Fine-tuning matters enormously** for domain-specific content. A general embedding model doesn't know that "MI" means "myocardial infarction" in medical contexts or "Michigan" in geographic ones. Even light fine-tuning (1000 labeled pairs) on domain data can improve retrieval by 15-20%.

## Vector Stores

For prototyping, use FAISS or ChromaDB. For production, consider:

- **Pinecone** — managed, scales well, expensive
- **Weaviate** — open source, hybrid search (vector + keyword)
- **pgvector** — if you're already using PostgreSQL

> Don't overthink this choice early. The retrieval quality depends far more on your chunks and embeddings than your vector store.

## The Retrieval Step

### How many chunks to retrieve?

- **Too few** (1-2) — might miss relevant context
- **Too many** (10+) — floods the LLM context with noise, increases cost and latency

Start with **3-5 chunks** and tune based on evaluation.

### Hybrid search

Pure vector search misses exact matches. "Error code E-4012" might not be semantically close to anything, but keyword search finds it instantly. **Combine both**:

```python
def hybrid_search(query, k=5, alpha=0.7):
    vector_results = vector_store.search(embed(query), k=k*2)
    keyword_results = bm25_index.search(query, k=k*2)

    # Reciprocal rank fusion
    scores = defaultdict(float)
    for rank, doc in enumerate(vector_results):
        scores[doc.id] += alpha * (1 / (rank + 60))
    for rank, doc in enumerate(keyword_results):
        scores[doc.id] += (1 - alpha) * (1 / (rank + 60))

    return sorted(scores.items(), key=lambda x: -x[1])[:k]
```

### Metadata filtering

Don't rely solely on semantic similarity. Filter by:
- **Date** — for time-sensitive content
- **Source** — for multi-source systems
- **Category** — to narrow the search space
- **Access level** — for permission-aware retrieval

## Common Pitfalls

**1. Not handling document boundaries**
A chunk spanning the end of one document and the start of another creates nonsensical context. Always respect document boundaries when chunking.

**2. Ignoring retrieval quality**
Most people evaluate end-to-end (does the final answer look good?) without checking intermediate retrieval. If the right document isn't in the top-k results, no amount of LLM prompting will help.

**3. Stuffing the prompt**
Retrieving 10 chunks and cramming them all into the prompt is wasteful. Re-rank retrieved results and only include the top 3-5.

**4. Not versioning your index**
When documents change, your index must update. Build pipelines that detect document changes and re-embed only the affected chunks.

## Start Simple

1. Chunk your documents with overlap
2. Embed with `all-MiniLM-L6-v2`
3. Store in ChromaDB
4. Retrieve top 3 chunks
5. Feed to an LLM with a simple prompt

Measure everything. Then iterate.

---

*Resources: [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/), [LlamaIndex Documentation](https://docs.llamaindex.ai/), [Pinecone Learning Center](https://www.pinecone.io/learn/)*
