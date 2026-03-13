# How to Blog on This Portfolio

## Quick Start

1. Write a `.md` file in `public/blog/`
2. Add an entry to `public/blog/posts.json`
3. Deploy — that's it

---

## Step 1: Write Your Post

Create a new markdown file in `public/blog/`. The filename becomes the URL slug.

**Example:** `public/blog/my-new-post.md` becomes `/#/blog/my-new-post`

Write using standard markdown. GitHub Flavored Markdown (GFM) is fully supported.

---

## Step 2: Register in posts.json

Add an entry to `public/blog/posts.json`:

```json
{
    "slug": "my-new-post",
    "title": "My New Post Title",
    "date": "2026-03-13",
    "tags": ["Machine Learning", "Python"],
    "excerpt": "A one-liner that appears on the blog listing page.",
    "readTime": 5
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `slug` | Yes | Must match the `.md` filename (without extension) |
| `title` | Yes | Displayed on the listing page and post header |
| `date` | Yes | Format: `YYYY-MM-DD`. Posts are sorted newest first |
| `tags` | Yes | Array of strings. Used for filtering on the listing page |
| `excerpt` | Yes | Short summary shown on the blog listing card |
| `readTime` | Yes | Estimated minutes to read (integer) |

---

## Supported Markdown Features

### Text Formatting

```markdown
**bold**, *italic*, ~~strikethrough~~, `inline code`
```

### Headings

Use `##` for main sections and `###` for subsections. Avoid `#` (h1) — the post title is already an h1.

### Links

```markdown
[link text](https://example.com)
```

### Images

Place images in `public/blog/images/` and reference them with absolute paths:

```markdown
![Description of the image](/blog/images/my-diagram.webp)
```

External images also work:

```markdown
![Description](https://example.com/image.png)
```

Images are automatically responsive (max-width: 100%) with rounded corners.

### Code Blocks

Fenced code blocks with language hints get full syntax highlighting (powered by highlight.js):

````markdown
```python
def hello():
    print("Hello, world!")
```
````

Supported languages include: `python`, `javascript`, `typescript`, `bash`, `sql`, `json`, `html`, `css`, `yaml`, `rust`, `go`, `java`, `r`, and many more.

### Tables

```markdown
| Model | Accuracy | Speed |
|-------|----------|-------|
| BERT  | 92%      | 45ms  |
| GPT-4 | 96%      | 200ms |
```

### Blockquotes

```markdown
> This is a blockquote. It renders with a left border accent.
```

### Lists

```markdown
- Unordered item
- Another item

1. Ordered item
2. Another item
```

### Horizontal Rules

```markdown
---
```

---

## Tips

- **Keep slugs short and URL-friendly** — use hyphens, lowercase, no spaces (e.g., `fine-tuning-embeddings`)
- **Use WebP for images** — keeps file sizes small. Convert with: `magick input.png -quality 80 output.webp`
- **Tags are filterable** — readers can filter by tag on the listing page, so reuse existing tags when possible
- **Excerpt length** — aim for 1-2 sentences. It's truncated on mobile if too long
- **No frontmatter needed** — metadata lives in `posts.json`, not in the markdown file itself

## File Structure

```
public/blog/
  posts.json              # Post metadata (title, date, tags, etc.)
  blogging.md             # This guide
  my-post-slug.md         # A blog post
  another-post.md         # Another blog post
  images/                 # Blog images (create this folder as needed)
    diagram.webp
    screenshot.png
```
