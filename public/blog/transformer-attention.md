Transformers have revolutionized NLP since the "Attention Is All You Need" paper in 2017. At their core is the **self-attention mechanism**, which allows every token in a sequence to attend to every other token — enabling the model to capture long-range dependencies without recurrence.

## The Core Idea

Traditional sequence models (RNNs, LSTMs) process tokens one at a time, left to right. This creates a bottleneck: information from early tokens must survive through many steps to influence later predictions. Attention sidesteps this entirely by computing direct relationships between all token pairs simultaneously.

## Scaled Dot-Product Attention

The key computation is:

```
Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

Where:
- **Q** (queries) — "what am I looking for?"
- **K** (keys) — "what do I contain?"
- **V** (values) — "what information do I provide?"

All three are linear projections of the input embeddings. The dot product `QK^T` measures compatibility between queries and keys. The scaling factor `√d_k` is critical — without it, large dot products push softmax into regions with vanishing gradients.

### Why scaling matters

For high-dimensional vectors, dot products tend to grow proportionally with dimension `d_k`. If `d_k = 512`, unscaled dot products can easily reach values of 20-30, causing softmax to produce near-one-hot distributions. The `√d_k` normalization keeps gradients healthy.

## Multi-Head Attention

Instead of a single attention function, transformers run `h` attention heads in parallel:

```
MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
```

Each head learns different projection matrices, allowing the model to **jointly attend to information from different representation subspaces**. In practice:

- Some heads learn syntactic relationships (subject-verb agreement)
- Others learn positional patterns (attending to the previous token)
- Some capture semantic similarity across long distances

The original transformer uses 8 heads with `d_k = d_v = d_model / h = 64`.

## Positional Encodings

Since attention is **permutation-invariant** (shuffling the input tokens gives the same attention weights, just reordered), the model needs explicit position information. The original paper used sinusoidal encodings:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

The intuition: each dimension oscillates at a different frequency, creating a unique "fingerprint" for each position. The sinusoidal form was chosen because it allows the model to easily learn to attend to relative positions (since `PE(pos+k)` can be expressed as a linear function of `PE(pos)`).

### Modern alternatives

- **Learned positional embeddings** — simply trained as parameters. Used in BERT and GPT-2.
- **Rotary Position Embeddings (RoPE)** — encodes position by rotating the query and key vectors. Used in LLaMA, Mistral.
- **ALiBi** — adds a linear bias to attention scores based on distance. No learned parameters needed.

## Putting It Together

A transformer block combines:

1. Multi-head self-attention
2. Layer normalization
3. Feed-forward network (two linear layers with ReLU/GELU)
4. Residual connections around both sub-layers

```
output = LayerNorm(x + MultiHeadAttention(x))
output = LayerNorm(output + FFN(output))
```

Stack 6-96 of these blocks and you have a transformer. The elegance is in the simplicity — no convolutions, no recurrence, just attention and feed-forward layers.

## Key Takeaways

- Self-attention computes **all pairwise relationships** in O(n²) time — powerful but expensive for long sequences
- Multi-head attention lets the model learn **diverse relationship types** simultaneously
- Positional encodings are the "duct tape" that gives attention a sense of order
- The architecture's simplicity and parallelizability are why transformers scale so well with data and compute

---

*Further reading: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/), [The Annotated Transformer](https://nlp.seas.harvard.edu/2018/04/03/attention.html)*
