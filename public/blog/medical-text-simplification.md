Medical text is hard to read. A typical clinical document reads at a college graduate level, but nearly half of US adults read below a 6th-grade level. Text simplification using NLP can make healthcare information accessible without losing clinical accuracy — but getting the safety part right is the real challenge.

## The Problem

Consider this clinical text:

> *"Patient presents with paroxysmal nocturnal dyspnea and bilateral pedal edema, suggestive of decompensated congestive heart failure. Recommend initiation of loop diuretic therapy."*

A simplified version:

> *"The patient has trouble breathing at night and swelling in both feet. This suggests their heart is not pumping well enough. The doctor recommends starting a water pill to reduce fluid buildup."*

Both convey the same information, but the second is understandable by a much wider audience. The challenge: simplification must never introduce medical inaccuracies.

## Architecture

Our approach uses a two-stage pipeline: **simplification** followed by **safety validation**.

```
Clinical Text → Simplification Model → Candidate Output → Safety Validator → Final Output
                                                              ↓ (if unsafe)
                                                         Fallback / Flag
```

### Stage 1: Simplification

We fine-tuned a T5-large model on pairs of complex/simple medical text:

```python
from transformers import T5ForConditionalGeneration, T5Tokenizer

model = T5ForConditionalGeneration.from_pretrained("t5-large")
tokenizer = T5Tokenizer.from_pretrained("t5-large")

def simplify(text, max_length=256):
    input_text = f"simplify medical: {text}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)

    outputs = model.generate(
        inputs.input_ids,
        max_length=max_length,
        num_beams=4,
        length_penalty=1.0,
        no_repeat_ngram_size=3
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)
```

Training data came from three sources:
- **Cochrane Plain Language Summaries** — expert-written simple versions of medical reviews
- **MedlinePlus** — NIH consumer health articles paired with clinical descriptions
- **Manual annotations** — clinicians simplified 2,000 clinical notes

### Stage 2: Safety Validation

This is the critical part. A simplification that changes the meaning is worse than no simplification at all.

```python
class SafetyValidator:
    def __init__(self):
        self.nli_model = load_nli_model()  # Natural Language Inference
        self.medical_ner = load_medical_ner()  # Entity extraction

    def validate(self, original, simplified):
        checks = [
            self.check_entailment(original, simplified),
            self.check_entity_preservation(original, simplified),
            self.check_negation_consistency(original, simplified),
            self.check_dosage_preservation(original, simplified),
        ]
        return all(checks)

    def check_entailment(self, original, simplified):
        """Verify simplified text is entailed by the original"""
        result = self.nli_model.predict(original, simplified)
        return result.label == "entailment" and result.score > 0.85

    def check_entity_preservation(self, original, simplified):
        """Ensure critical medical entities are preserved"""
        orig_entities = self.medical_ner.extract(original)
        simp_entities = self.medical_ner.extract(simplified)

        critical_types = {"MEDICATION", "DOSAGE", "CONDITION", "PROCEDURE"}
        orig_critical = {e for e in orig_entities if e.type in critical_types}
        simp_critical = {e for e in simp_entities if e.type in critical_types}

        # All critical entities must be preserved (or their synonyms)
        return self.entities_preserved(orig_critical, simp_critical)

    def check_negation_consistency(self, original, simplified):
        """Catch dangerous negation flips"""
        # "no signs of infection" → "signs of infection" is catastrophic
        orig_negations = self.extract_negated_concepts(original)
        simp_negations = self.extract_negated_concepts(simplified)
        return orig_negations == simp_negations
```

## The Hardest Cases

### Negation Flips

The most dangerous error in medical text simplification:

- Original: "No evidence of **malignancy**"
- Bad simplification: "Evidence of **cancer**"
- Correct: "Tests show **no cancer**"

We added specific negation detection using NegEx patterns and a custom rule-based checker as a safety net on top of the NLI model.

### Dosage and Measurement

Numbers must be preserved exactly:

- Original: "Metformin 500mg BID"
- Bad: "Take metformin twice daily" (missing dosage)
- Correct: "Take metformin **500mg** twice daily"

```python
def check_dosage_preservation(original, simplified):
    dosage_pattern = r'\d+\s*(?:mg|ml|mcg|units|tablets?|capsules?)'
    orig_dosages = set(re.findall(dosage_pattern, original, re.IGNORECASE))
    simp_dosages = set(re.findall(dosage_pattern, simplified, re.IGNORECASE))
    return orig_dosages.issubset(simp_dosages)
```

### Hedging and Uncertainty

Clinical text uses careful hedging that simplification can accidentally remove:

- Original: "Findings are **suggestive of** pneumonia"
- Bad: "The patient **has** pneumonia"
- Correct: "The test results **may indicate** a lung infection called pneumonia"

## Evaluation Metrics

Standard NLP metrics (BLEU, ROUGE) don't capture what matters for medical simplification. We used:

1. **SARI** — measures simplification quality (additions, deletions, kept words)
2. **Flesch-Kincaid Grade Level** — target: 6th grade or below
3. **Medical accuracy** — clinician review on a 1-5 scale
4. **Entity preservation rate** — percentage of critical entities retained
5. **Safety violation rate** — percentage of outputs that change clinical meaning

| Metric | Our Model | GPT-4 (zero-shot) | T5 (no safety) |
|--------|-----------|-------------------|-----------------|
| SARI | 42.3 | 39.1 | 43.8 |
| FK Grade | 5.8 | 7.2 | 5.4 |
| Medical Accuracy | 4.6/5 | 4.2/5 | 3.8/5 |
| Safety Violations | 1.2% | 3.8% | 8.4% |

The key finding: T5 without safety validation produces the most readable text but has an unacceptable safety violation rate. The safety validator catches most issues at the cost of occasionally falling back to the original text.

## Lessons Learned

**Safety > readability.** An unsafe simplification is worse than an unreadable original. Always default to preserving the original when in doubt.

**Clinician-in-the-loop is essential.** No automated system should be the final authority on medical text. Our system flags low-confidence simplifications for human review.

**Domain-specific fine-tuning is mandatory.** General-purpose LLMs are surprisingly bad at medical simplification because they tend to "hallucinate" medical facts. Fine-tuning on verified pairs is non-negotiable.

**Readability scores lie.** A text can score at a 5th-grade reading level and still be incomprehensible if the concepts themselves are complex. Readability metrics measure word/sentence complexity, not conceptual difficulty.

---

*Further reading: [MedSimQA Dataset](https://arxiv.org/abs/2305.14730), [NegEx Algorithm](https://www.sciencedirect.com/science/article/pii/S1532046401910299)*