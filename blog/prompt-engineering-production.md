Prompt engineering in production is fundamentally different from playground experimentation. When your prompt runs 10,000 times a day, small improvements in reliability matter more than clever tricks. Here's what I've learned building LLM-powered features that need to work consistently.

## The Reliability Problem

A prompt that works 95% of the time in testing will fail 500 times a day at 10,000 requests. Those 500 failures generate support tickets, bad user experiences, and eroded trust. Production prompt engineering is about pushing that 95% to 99%+.

## Structured Output: The Foundation

The single most impactful change for production prompts: demand structured output.

### Bad: Open-ended generation

```
Analyze this customer review and tell me the sentiment.

Review: "The product arrived late but works great"
```

Response varies wildly: "Mixed", "Positive overall", "The sentiment is generally positive but with some negative aspects regarding delivery..."

### Good: Constrained output

```
Analyze this customer review. Respond with ONLY a JSON object:
{
    "sentiment": "positive" | "negative" | "mixed",
    "confidence": 0.0 to 1.0,
    "aspects": [{"topic": string, "sentiment": "positive" | "negative"}]
}

Review: "The product arrived late but works great"
```

Even better — use the model's native JSON mode or function calling when available.

## Prompt Templates for Consistency

Production prompts are parameterized templates, not ad-hoc strings:

```python
class PromptTemplate:
    def __init__(self, template, validators=None):
        self.template = template
        self.validators = validators or []
        self.version = "1.0"

    def render(self, **kwargs):
        prompt = self.template.format(**kwargs)
        return prompt

    def validate_output(self, output):
        for validator in self.validators:
            if not validator(output):
                return False
        return True

# Define once, use everywhere
CLASSIFICATION_PROMPT = PromptTemplate(
    template="""Classify the following support ticket into exactly one category.

Categories: {categories}

Ticket: {ticket_text}

Respond with ONLY the category name, nothing else.""",
    validators=[
        lambda x: x.strip() in VALID_CATEGORIES,
        lambda x: len(x.split()) <= 5,
    ]
)
```

## Few-Shot Examples: Quality Over Quantity

Few-shot examples are the most reliable way to steer model behavior. But example selection matters:

```python
EXTRACTION_PROMPT = """Extract structured information from medical records.

Example 1 (standard case):
Input: "Patient John D., 45M, presents with chest pain for 2 days. BP 140/90."
Output: {"name": "John D.", "age": 45, "gender": "M", "chief_complaint": "chest pain", "duration": "2 days", "vitals": {"bp": "140/90"}}

Example 2 (missing fields):
Input: "Follow-up visit for diabetes management. A1C improved to 6.8."
Output: {"name": null, "age": null, "gender": null, "chief_complaint": "diabetes management", "duration": null, "vitals": {"a1c": "6.8"}}

Example 3 (ambiguous input):
Input: "Pt c/o SOB and bilateral LE edema x 1 week"
Output: {"name": null, "age": null, "gender": null, "chief_complaint": "shortness of breath and bilateral lower extremity edema", "duration": "1 week", "vitals": {}}

Now extract from this record:
Input: "{record_text}"
Output:"""
```

Key principles:
- **Include edge cases** — missing data, abbreviations, ambiguous inputs
- **Show the exact format** you expect, including null handling
- **3-5 examples** is usually sufficient; more can actually hurt if they're repetitive

## Error Handling and Retries

Production prompts fail. Plan for it:

```python
class LLMClient:
    def __init__(self, model, max_retries=3):
        self.model = model
        self.max_retries = max_retries

    async def generate(self, prompt, validators=None):
        for attempt in range(self.max_retries):
            try:
                response = await self.model.generate(prompt)
                parsed = self.parse_response(response)

                # Validate output
                if validators:
                    for validator in validators:
                        if not validator(parsed):
                            raise ValidationError(f"Output failed validation: {parsed}")

                return parsed

            except (ValidationError, JSONDecodeError) as e:
                if attempt < self.max_retries - 1:
                    # Retry with more explicit instructions
                    prompt = self.add_correction_hint(prompt, str(e))
                    continue
                else:
                    return self.fallback(prompt)

    def add_correction_hint(self, prompt, error):
        return prompt + f"\n\nIMPORTANT: Your previous response was invalid ({error}). Please follow the format exactly."

    def fallback(self, prompt):
        # Log for analysis, return safe default
        logger.warning(f"All retries failed for prompt: {prompt[:100]}...")
        return {"error": "extraction_failed", "requires_review": True}
```

## Prompt Versioning and A/B Testing

Treat prompts like code — version them and test changes:

```python
class PromptRegistry:
    def __init__(self):
        self.prompts = {}
        self.active_experiments = {}

    def register(self, name, version, template, weight=100):
        key = f"{name}:v{version}"
        self.prompts[key] = template

    def get(self, name, experiment_id=None):
        if experiment_id and name in self.active_experiments:
            # A/B test: route based on experiment_id hash
            variants = self.active_experiments[name]
            bucket = hash(experiment_id) % 100
            cumulative = 0
            for version, weight in variants:
                cumulative += weight
                if bucket < cumulative:
                    return self.prompts[f"{name}:v{version}"]

        return self.prompts[f"{name}:v{self.latest_version(name)}"]

# Usage
registry = PromptRegistry()
registry.register("classify", 1, old_template)
registry.register("classify", 2, new_template)
registry.set_experiment("classify", [("1", 50), ("2", 50)])  # 50/50 split
```

## Cost Optimization

At scale, token costs add up fast:

**Minimize input tokens:**
- Strip unnecessary whitespace and formatting
- Use abbreviations in system prompts (the model understands them)
- Cache common prefixes using the provider's prompt caching

**Minimize output tokens:**
- Request terse output ("respond with ONLY...")
- Use shorter field names in JSON schemas
- Set appropriate max_tokens limits

**Model routing:**
```python
def select_model(task_complexity):
    if task_complexity == "simple":
        return "haiku"       # Simple classification, extraction
    elif task_complexity == "medium":
        return "sonnet"      # Summarization, moderate reasoning
    else:
        return "opus"        # Complex analysis, multi-step reasoning
```

Route simple tasks to cheaper models. In our pipeline, 70% of requests could be handled by the smallest model, reducing costs by 60%.

## Testing Prompts

```python
class PromptTestSuite:
    def __init__(self, prompt_template):
        self.template = prompt_template
        self.test_cases = []

    def add_case(self, input_data, expected_output, description=""):
        self.test_cases.append({
            "input": input_data,
            "expected": expected_output,
            "description": description
        })

    async def run(self, model, n_runs=3):
        results = []
        for case in self.test_cases:
            successes = 0
            for _ in range(n_runs):
                output = await model.generate(self.template.render(**case["input"]))
                if self.matches(output, case["expected"]):
                    successes += 1
            results.append({
                "description": case["description"],
                "pass_rate": successes / n_runs
            })
        return results
```

Run each test case multiple times (temperature > 0 means non-deterministic output). A prompt that passes 2/3 runs is unreliable in production.

---

*Further reading: [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview), [OpenAI Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)*