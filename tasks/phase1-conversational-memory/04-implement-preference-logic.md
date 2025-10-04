# Task 04: Implement Preference Extraction Logic

## Description
Implement the core LLM-based logic for analyzing conversation history and extracting user preferences with high accuracy.

## File Location
`agentic/tools/preference_extractor.py`

## Implementation Checklist

- [ ] Design comprehensive extraction prompt
- [ ] Include example conversations in prompt for few-shot learning
- [ ] Handle empty conversation history (return empty preferences)
- [ ] Extract price mentions (e.g., "under $100", "around $50")
- [ ] Extract brand preferences (positive: "I like Nike", negative: "not Adidas")
- [ ] Extract category interests from context
- [ ] Extract feature requirements (e.g., "needs to be waterproof")
- [ ] Track rejected products from conversation
- [ ] Parse numeric price ranges correctly
- [ ] Handle ambiguous statements gracefully
- [ ] Add confidence scoring for extracted preferences (optional)
- [ ] Implement caching for repeated preference extractions
- [ ] Add logging for debugging preference extraction
- [ ] Test with edge cases:
  - [ ] Very short conversations (1 turn)
  - [ ] Long conversations (10+ turns)
  - [ ] Contradictory preferences
  - [ ] Implicit preferences

## Prompt Template Example
```python
prompt = f"""
Analyze this e-commerce conversation and extract user preferences:

Conversation History:
{formatted_history}

Extract the following in JSON format:
{{
  "preferred_brands": ["brand1", "brand2"],
  "avoided_brands": ["brand3"],
  "max_price": 150.0,
  "min_price": null,
  "required_features": ["waterproof", "GPS"],
  "rejected_product_ids": [123, 456],
  "category_focus": "running shoes"
}}

Rules:
- Only extract explicitly mentioned preferences
- Use null for unmentioned fields
- Infer category from context
- Track products user said "no" to
"""
```

## Expected Outcome
Accurate preference extraction from diverse conversation patterns.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
