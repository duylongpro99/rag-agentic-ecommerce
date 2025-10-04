# Task 03: Create Supporting Quotes Extraction Method

## Description
Implement intelligent extraction of supporting evidence from product descriptions using LLM-based analysis.

## File Location
`agentic/tools/semantic_search.py`

## Implementation Checklist

- [ ] Implement LLM-based quote extraction
- [ ] Add fallback to rule-based extraction
- [ ] Extract 1-2 most relevant quotes per product
- [ ] Highlight matching keywords in quotes
- [ ] Handle empty/short descriptions
- [ ] Cache extraction results
- [ ] Test with various product types

## LLM-Based Implementation
```python
from agentic.factory.llm_model import LLMModel

def _extract_supporting_quotes(self, query: str, description: str) -> List[str]:
    """Extract supporting quotes using LLM"""

    if not description or len(description) < 20:
        return []

    # Try LLM extraction first (more accurate)
    try:
        quotes = self._llm_extract_quotes(query, description)
        if quotes:
            return quotes
    except Exception as e:
        print(f"LLM quote extraction failed: {e}")

    # Fallback to rule-based extraction
    return self._rule_based_extract_quotes(query, description)

def _llm_extract_quotes(self, query: str, description: str) -> List[str]:
    """LLM-powered quote extraction"""

    prompt = f"""
Extract 1-2 short quotes (max 15 words each) from the product description
that directly support why this product matches the query.

Query: "{query}"
Description: "{description}"

Return ONLY the quotes as a JSON array: ["quote1", "quote2"]
If no relevant quotes, return empty array: []
"""

    llm = LLMModel.get_model()
    response = llm.invoke(prompt)

    # Parse JSON response
    import json
    import re

    # Extract JSON from response
    json_match = re.search(r'\[.*\]', response.content, re.DOTALL)
    if json_match:
        quotes = json.loads(json_match.group(0))
        return [q.strip() for q in quotes if q.strip()]

    return []

def _rule_based_extract_quotes(self, query: str, description: str) -> List[str]:
    """Rule-based quote extraction (fallback)"""

    import re

    # Split into sentences
    sentences = re.split(r'[.!?]+', description)
    query_words = set(word.lower() for word in query.split()
                      if len(word) > 2)  # Skip short words

    scored_sentences = []

    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 10 or len(sentence) > 150:
            continue

        # Score sentence by query word overlap
        sentence_words = set(word.lower() for word in sentence.split())
        overlap = query_words & sentence_words
        score = len(overlap)

        if score > 0:
            scored_sentences.append((score, sentence))

    # Sort by score and take top 2
    scored_sentences.sort(reverse=True, key=lambda x: x[0])
    quotes = [sent for score, sent in scored_sentences[:2]]

    # Truncate long quotes
    quotes = [q[:97] + "..." if len(q) > 100 else q for q in quotes]

    return quotes

def _highlight_keywords(self, quote: str, query: str) -> str:
    """Highlight matching keywords in quote (for rich text display)"""

    query_words = set(word.lower() for word in query.split() if len(word) > 2)

    for word in query_words:
        # Case-insensitive replacement with bold markdown
        import re
        pattern = re.compile(re.escape(word), re.IGNORECASE)
        quote = pattern.sub(f"**{word}**", quote)

    return quote
```

## Caching for Performance
```python
from functools import lru_cache

@lru_cache(maxsize=500)
def _extract_supporting_quotes_cached(self, query: str, description: str) -> tuple:
    """Cached version for repeated queries"""
    quotes = self._extract_supporting_quotes(query, description)
    return tuple(quotes)  # Cache requires hashable return type
```

## Testing
```python
# Test quote extraction
tool = SemanticSearchTool()

query = "waterproof bluetooth headphones"
description = """
Premium wireless headphones with active noise cancellation.
Features IPX7 waterproof rating for swimming and workouts.
Bluetooth 5.0 connectivity with 30-hour battery life.
Comfortable over-ear design with memory foam cushions.
"""

quotes = tool._extract_supporting_quotes(query, description)
print(f"Extracted quotes: {quotes}")

# Expected output might include:
# ["IPX7 waterproof rating for swimming and workouts",
#  "Bluetooth 5.0 connectivity with 30-hour battery life"]
```

## Performance Considerations
- [ ] LLM extraction adds ~200-500ms per product
- [ ] Cache results to avoid re-extraction
- [ ] Consider async extraction for multiple products
- [ ] Use rule-based for latency-sensitive queries

## Expected Outcome
Relevant quotes that provide evidence for product matches.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
