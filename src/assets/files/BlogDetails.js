const posts = [
    {
        title: "Understanding Transformer Attention Mechanisms",
        date: "2025-02-15",
        tags: ["NLP", "Deep Learning", "Transformers"],
        summary: "A deep dive into how self-attention works in transformer architectures — from scaled dot-product attention to multi-head attention and positional encodings.",
        link: null, // null = expandable inline, or a URL string for external
        content: `Transformers have revolutionized NLP since the "Attention Is All You Need" paper in 2017. At their core is the self-attention mechanism, which allows every token in a sequence to attend to every other token.

The key insight is computing attention as: Attention(Q, K, V) = softmax(QK^T / √d_k)V

Where Q (queries), K (keys), and V (values) are linear projections of the input. The scaling factor √d_k prevents the dot products from growing too large, which would push softmax into regions with extremely small gradients.

Multi-head attention extends this by running multiple attention functions in parallel, each with different learned projections. This allows the model to jointly attend to information from different representation subspaces at different positions.

Positional encodings are added to give the model information about token order, since attention itself is permutation-invariant. The original paper used sinusoidal encodings, but learned positional embeddings and relative position encodings (like RoPE) have since become popular alternatives.`,
    },
    {
        title: "OCR Pipeline Optimization: Lessons from Production",
        date: "2024-11-20",
        tags: ["Computer Vision", "OCR", "MLOps"],
        summary: "Practical lessons learned from optimizing a document processing pipeline handling 45,000+ forms per month — from batching strategies to model serving patterns.",
        link: null,
        content: `Running OCR at scale teaches you things that benchmarks don't. Here are key lessons from optimizing a production pipeline at UnitedHealth Group.

1. Batch smartly, not greedily — Grouping documents by page count before inference dramatically reduced GPU memory spikes. A naive approach of maximizing batch size led to OOM errors on outlier documents.

2. Pre-processing is half the battle — Deskewing, binarization, and noise removal before feeding images to the model improved accuracy by 12% with zero model changes. Tesseract and EasyOCR both benefit enormously from clean input.

3. Cache template matches — For templated forms, caching the layout classification result and reusing it for similar documents cut inference time by 40%. Most real-world document streams have high template repetition.

4. Monitor drift continuously — We built dashboards tracking confidence score distributions per model. When the mean confidence dropped below a threshold, it triggered retraining alerts before accuracy visibly degraded.

5. Concurrency > bigger models — Horizontal scaling with lighter models often beats vertical scaling with heavier ones. We achieved better throughput with 4 concurrent medium models than 1 large model on a bigger GPU.`,
    },
    {
        title: "Getting Started with RAG: Retrieval-Augmented Generation",
        date: "2025-01-10",
        tags: ["LLM", "RAG", "NLP"],
        summary: "A practical guide to building retrieval-augmented generation systems — chunking strategies, embedding models, vector stores, and common pitfalls.",
        link: null,
        content: `Retrieval-Augmented Generation (RAG) combines the knowledge retrieval capabilities of search systems with the generative power of LLMs. Here's what I've learned building RAG systems.

The pipeline is straightforward: chunk your documents → embed them → store in a vector database → at query time, retrieve relevant chunks → feed them as context to an LLM.

Chunking matters more than you think. Too small and you lose context. Too large and you dilute relevance. I've found 300-500 token chunks with 50-token overlap works well for most use cases. But always experiment — legal documents need larger chunks than FAQs.

Embedding model choice is critical. For most cases, sentence-transformers models (like all-MiniLM-L6-v2) offer a great speed/quality tradeoff. For domain-specific content, fine-tuning the embedding model on your corpus significantly improves retrieval quality.

Common pitfalls:
- Not handling document boundaries (chunks spanning two unrelated sections)
- Retrieving too many chunks (flooding the LLM context with noise)
- Ignoring metadata filtering (date, source, category) alongside semantic search
- Not evaluating retrieval quality separately from generation quality

Start simple, measure everything, and iterate.`,
    },
];

export default posts;
