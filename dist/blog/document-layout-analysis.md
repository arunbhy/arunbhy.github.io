Before you can extract text from a document, you need to understand its structure. Where are the tables? Where are the headers? What's a caption vs body text? Document layout analysis solves this — and modern deep learning approaches have made it dramatically more accurate than rule-based methods.

## Why Layout Analysis Matters

OCR engines extract text, but they don't understand structure. Running Tesseract on a two-column academic paper gives you interleaved text from both columns. Running it on a form gives you labels and values jumbled together. Layout analysis provides the spatial understanding that makes extracted text useful.

## The Modern Approach: Object Detection for Documents

Document layout analysis is essentially object detection — but instead of detecting cars and people, you're detecting text blocks, tables, figures, and headers.

### LayoutParser + Detectron2

```python
import layoutparser as lp

# Load a pre-trained model
model = lp.Detectron2LayoutModel(
    config_path="lp://PubLayNet/faster_rcnn_R_50_FPN_3x/config",
    extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.5],
    label_map={0: "Text", 1: "Title", 2: "List", 3: "Table", 4: "Figure"}
)

# Detect layout elements
image = cv2.imread("document.png")
layout = model.detect(image)

# Filter and sort
text_blocks = lp.Layout([b for b in layout if b.type == "Text"])
text_blocks.sort(key=lambda b: (b.block.y_1, b.block.x_1))  # Reading order
```

### Available Pre-trained Models

| Model | Dataset | Classes | mAP |
|-------|---------|---------|-----|
| Faster R-CNN (PubLayNet) | Scientific papers | 5 | 91.0 |
| Mask R-CNN (PubLayNet) | Scientific papers | 5 | 91.6 |
| Faster R-CNN (TableBank) | Tables only | 2 | 96.2 |
| DiT (Document Image Transformer) | DocLayNet | 11 | 79.5 |

For general documents, **DiT** trained on DocLayNet covers the most categories (caption, footnote, formula, list-item, page-footer, page-header, picture, section-header, table, text, title).

## Table Detection and Extraction

Tables are the hardest layout element to handle. Detection is just the start — you also need to understand rows, columns, and cell boundaries.

```python
from transformers import TableTransformerForObjectDetection, DetrFeatureExtractor
from PIL import Image

# Step 1: Detect tables in the document
table_detector = TableTransformerForObjectDetection.from_pretrained(
    "microsoft/table-transformer-detection"
)

image = Image.open("document.png")
feature_extractor = DetrFeatureExtractor()
inputs = feature_extractor(images=image, return_tensors="pt")
outputs = table_detector(**inputs)

# Step 2: For each detected table, extract structure
structure_model = TableTransformerForObjectDetection.from_pretrained(
    "microsoft/table-transformer-structure-recognition"
)

for table_bbox in detected_tables:
    table_image = image.crop(table_bbox)
    inputs = feature_extractor(images=table_image, return_tensors="pt")
    structure = structure_model(**inputs)
    # Returns: rows, columns, spanning cells
```

### Handling Complex Tables

Real-world tables have:
- **Merged cells** spanning multiple rows/columns
- **Nested headers** with hierarchical structure
- **Missing borders** (borderless tables)
- **Rotated text** in column headers

For merged cells, we use an adjacency-based approach:

```python
def resolve_spanning_cells(cells, rows, columns):
    """Match cells to their row/column spans"""
    cell_assignments = []
    for cell in cells:
        # Find which rows and columns this cell overlaps
        row_spans = [r for r in rows if iou_1d(cell.y1, cell.y2, r.y1, r.y2) > 0.5]
        col_spans = [c for c in columns if iou_1d(cell.x1, cell.x2, c.x1, c.x2) > 0.5]

        cell_assignments.append({
            "text": ocr_extract(cell),
            "row_start": min(r.index for r in row_spans),
            "row_end": max(r.index for r in row_spans),
            "col_start": min(c.index for c in col_spans),
            "col_end": max(c.index for c in col_spans),
        })
    return cell_assignments
```

## Reading Order Detection

Humans read documents in a specific order that isn't always top-to-bottom, left-to-right. Multi-column layouts, sidebars, and footnotes all complicate things.

```python
def determine_reading_order(layout_blocks):
    """Sort blocks into human reading order"""
    # Step 1: Detect columns
    columns = detect_columns(layout_blocks)

    if len(columns) == 1:
        # Single column: simple top-to-bottom
        return sorted(layout_blocks, key=lambda b: b.y_center)

    # Multi-column: process column by column, left to right
    ordered = []
    for col in sorted(columns, key=lambda c: c.x_center):
        col_blocks = [b for b in layout_blocks if overlaps(b, col)]
        col_blocks.sort(key=lambda b: b.y_center)
        ordered.extend(col_blocks)

    return ordered

def detect_columns(blocks):
    """Cluster blocks into columns using x-coordinate"""
    from sklearn.cluster import DBSCAN

    x_centers = np.array([[b.x_center] for b in blocks])
    clustering = DBSCAN(eps=50, min_samples=3).fit(x_centers)

    columns = []
    for label in set(clustering.labels_):
        if label == -1:
            continue
        col_blocks = [blocks[i] for i, l in enumerate(clustering.labels_) if l == label]
        columns.append(Column(col_blocks))

    return columns
```

## Azure Document Intelligence

For production use, managed services often beat custom models:

```python
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

client = DocumentAnalysisClient(
    endpoint="https://your-resource.cognitiveservices.azure.com/",
    credential=AzureKeyCredential("your-key")
)

with open("document.pdf", "rb") as f:
    poller = client.begin_analyze_document("prebuilt-layout", f)
    result = poller.result()

# Structured output with paragraphs, tables, and reading order
for paragraph in result.paragraphs:
    print(f"[{paragraph.role}] {paragraph.content}")

for table in result.tables:
    for cell in table.cells:
        print(f"Row {cell.row_index}, Col {cell.column_index}: {cell.content}")
```

Azure Document Intelligence handles:
- Automatic language detection
- Table extraction with spanning cells
- Reading order determination
- Form field extraction (key-value pairs)
- Handwriting recognition

## Performance Comparison

On our internal benchmark of 500 diverse documents:

| Approach | Layout mAP | Table F1 | Processing Speed |
|----------|-----------|----------|-----------------|
| Rule-based (heuristics) | 62% | 54% | 0.3s/page |
| LayoutParser (Faster R-CNN) | 86% | 78% | 1.2s/page |
| DiT (Transformer) | 89% | 83% | 2.1s/page |
| Azure Document Intelligence | 91% | 89% | 1.5s/page |

The managed service wins on accuracy, but the open-source options are competitive and don't require sending documents to an external service — important for sensitive documents.

## Practical Tips

**Pre-process before layout analysis.** Deskew, remove borders, and normalize DPI (300 DPI is the sweet spot). These simple steps improve detection accuracy by 5-10%.

**Post-process aggressively.** Layout models make errors. Add rules: tables must have at least 2 rows and 2 columns, titles should be at the top of the page, footnotes at the bottom. Simple heuristics catch many model mistakes.

**Cache layout results.** For templated documents (same layout, different content), detect the layout once and reuse it. This is especially powerful for form processing.

---

*Further reading: [LayoutParser](https://layout-parser.github.io/), [Table Transformer](https://github.com/microsoft/table-transformer), [DocLayNet dataset](https://github.com/DS4SD/DocLayNet)*