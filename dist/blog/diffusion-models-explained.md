Diffusion models power Stable Diffusion, DALL-E, and Midjourney. The core idea is surprisingly simple: gradually add noise to an image until it's pure static, then train a neural network to reverse that process. Here's how it actually works, step by step.

## The Forward Process: Destroying Information

Start with a clean image `x_0`. At each timestep `t`, add a small amount of Gaussian noise:

```
x_t = √(α_t) · x_{t-1} + √(1 - α_t) · ε
```

where `ε ~ N(0, I)` and `α_t` controls how much noise to add at step `t`.

After enough steps (typically T=1000), the image becomes indistinguishable from pure Gaussian noise. The key insight: because we use Gaussian noise, we can skip directly to any timestep:

```
x_t = √(ᾱ_t) · x_0 + √(1 - ᾱ_t) · ε
```

where `ᾱ_t = α_1 · α_2 · ... · α_t` is the cumulative product. This means during training, we don't need to iterate through all 1000 steps — we can jump directly to any noise level.

## The Reverse Process: Learning to Denoise

The model learns to predict the noise `ε` that was added to a clean image:

```python
def training_step(model, x_0):
    # Sample random timestep
    t = torch.randint(0, T, (batch_size,))

    # Sample noise
    epsilon = torch.randn_like(x_0)

    # Create noisy image
    alpha_bar = get_alpha_bar(t)
    x_t = torch.sqrt(alpha_bar) * x_0 + torch.sqrt(1 - alpha_bar) * epsilon

    # Predict the noise
    epsilon_pred = model(x_t, t)

    # Simple MSE loss
    loss = F.mse_loss(epsilon_pred, epsilon)
    return loss
```

That's the entire training objective — predict what noise was added. The simplicity is deceptive; this loss function has deep connections to variational inference and score matching.

## The U-Net Architecture

The denoising model is typically a U-Net — an encoder-decoder with skip connections:

```
Input (noisy image + timestep embedding)
    ↓
[Encoder blocks] — progressively downsample
    ↓               with self-attention at lower resolutions
[Bottleneck] — lowest resolution, heavy attention
    ↑
[Decoder blocks] — progressively upsample
    ↑               with skip connections from encoder
Output (predicted noise, same shape as input)
```

Key components:

- **Timestep embedding:** The model needs to know the noise level. The timestep `t` is embedded using sinusoidal positional encodings (borrowed from transformers) and injected into each residual block.
- **Self-attention layers:** Added at lower resolutions (16x16, 8x8) where they're computationally feasible. These let the model reason about global image structure.
- **Cross-attention for conditioning:** For text-to-image, text embeddings from CLIP are injected via cross-attention layers.

## Sampling: Generating Images

To generate an image, start from pure noise and iteratively denoise:

```python
def sample(model, image_shape):
    x = torch.randn(image_shape)  # Start from pure noise

    for t in reversed(range(T)):
        # Predict noise at current step
        epsilon_pred = model(x, t)

        # Compute denoised estimate
        alpha = get_alpha(t)
        alpha_bar = get_alpha_bar(t)

        # DDPM update rule
        mean = (1 / torch.sqrt(alpha)) * (
            x - (1 - alpha) / torch.sqrt(1 - alpha_bar) * epsilon_pred
        )

        if t > 0:
            noise = torch.randn_like(x)
            sigma = get_sigma(t)
            x = mean + sigma * noise
        else:
            x = mean  # No noise at final step

    return x
```

### Faster Sampling with DDIM

DDPM requires ~1000 steps for good results. DDIM (Denoising Diffusion Implicit Models) achieves comparable quality in 20-50 steps by using a deterministic sampling process:

```python
def ddim_sample(model, image_shape, steps=50):
    timesteps = np.linspace(T-1, 0, steps).astype(int)
    x = torch.randn(image_shape)

    for i in range(len(timesteps) - 1):
        t = timesteps[i]
        t_next = timesteps[i + 1]

        epsilon_pred = model(x, t)

        # DDIM deterministic update
        alpha_bar_t = get_alpha_bar(t)
        alpha_bar_next = get_alpha_bar(t_next)

        x0_pred = (x - torch.sqrt(1 - alpha_bar_t) * epsilon_pred) / torch.sqrt(alpha_bar_t)
        x = (torch.sqrt(alpha_bar_next) * x0_pred +
             torch.sqrt(1 - alpha_bar_next) * epsilon_pred)

    return x
```

## Latent Diffusion (Stable Diffusion)

Running diffusion in pixel space is expensive — a 512x512 image has 786,432 dimensions. Stable Diffusion's key innovation: run diffusion in a compressed **latent space**.

```
Image (512x512x3) → VAE Encoder → Latent (64x64x4) → Diffusion → VAE Decoder → Image
```

The VAE compresses images by 48x while preserving perceptual quality. Diffusion then operates on the 64x64x4 latent, which is orders of magnitude cheaper.

## Classifier-Free Guidance

To improve text-image alignment, Stable Diffusion uses **classifier-free guidance (CFG)**:

```python
def guided_sampling(model, x_t, t, text_embedding, guidance_scale=7.5):
    # Unconditional prediction (no text)
    eps_uncond = model(x_t, t, text_embedding=null_embedding)

    # Conditional prediction (with text)
    eps_cond = model(x_t, t, text_embedding=text_embedding)

    # Guided prediction — amplify the difference
    eps = eps_uncond + guidance_scale * (eps_cond - eps_uncond)
    return eps
```

Higher guidance scales produce images that match the text prompt more closely but with less diversity. The sweet spot is usually 7-12.

## Applications Beyond Image Generation

- **Inpainting** — mask a region, add noise only there, denoise conditioned on the surrounding context
- **Image-to-image** — start from a noisy version of an input image instead of pure noise
- **Super-resolution** — condition on a low-res image, generate high-res details
- **Video generation** — extend the U-Net to 3D (add temporal attention)
- **3D generation** — use multi-view diffusion to generate consistent 3D assets

## Key Takeaways

- Diffusion = forward noise process + learned reverse denoising
- The training objective is simple MSE on noise prediction
- Latent diffusion makes it computationally tractable
- Classifier-free guidance controls the quality-diversity tradeoff
- The same framework generalizes to video, 3D, audio, and more

The mathematical elegance of diffusion models is that destruction (adding noise) is easy and doesn't require learning, while creation (removing noise) requires a powerful neural network. By breaking generation into many small denoising steps, each step is simple enough for a neural network to handle.

---

*Further reading: [The Annotated Diffusion Model](https://huggingface.co/blog/annotated-diffusion), [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)*