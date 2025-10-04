# Task 07: Implement Aspect Weight Classification Logic

## Description
Complete the implementation of aspect weight classification with comprehensive pattern matching and LLM fallback.

## File Location
`agentic/tools/query_classifier.py`

## Implementation Checklist

### Pattern Enhancement
- [ ] Expand usage-focused patterns
- [ ] Add more feature-focused keywords
- [ ] Add aesthetic/description patterns
- [ ] Add price/value patterns
- [ ] Test pattern coverage on sample queries

### LLM Prompt Optimization
- [ ] Add more few-shot examples
- [ ] Include edge case examples
- [ ] Test prompt with various LLM models
- [ ] Optimize for response speed
- [ ] Handle non-JSON responses gracefully

### Weight Validation
- [ ] Ensure weights sum to 1.0 (±0.01 tolerance)
- [ ] Check all required keys present
- [ ] Validate weight ranges (0.0 to 1.0)
- [ ] Handle negative weights
- [ ] Handle weights > 1.0

### Caching Implementation
- [ ] Add in-memory cache for query classifications
- [ ] Use LRU cache with reasonable size (1000 entries)
- [ ] Cache key: lowercase, trimmed query
- [ ] Implement cache hit rate logging
- [ ] Add cache clear method

### Error Handling
- [ ] Handle LLM API failures
- [ ] Handle malformed JSON responses
- [ ] Handle missing weight keys
- [ ] Log classification errors
- [ ] Always return valid weights (fallback to default)

### Testing
- [ ] Unit tests for pattern matching
- [ ] Unit tests for LLM classification
- [ ] Unit tests for weight validation
- [ ] Test with 50+ diverse queries
- [ ] Measure classification accuracy
- [ ] Measure average latency

## Enhanced Code
```python
from functools import lru_cache
import re

class QueryIntentClassifier:
    # ... (previous code)

    @lru_cache(maxsize=1000)
    def classify(self, query: str) -> Dict[str, float]:
        """Classify query with caching"""
        query_normalized = query.lower().strip()

        # Try pattern matching first
        weights = self._pattern_based_classification(query_normalized)
        if weights:
            print(f"Pattern match: {query_normalized[:50]}...")
            return weights

        # Fallback to LLM
        print(f"LLM classification: {query_normalized[:50]}...")
        return self._llm_based_classification(query_normalized)

    def _pattern_based_classification(self, query: str) -> Dict[str, float] | None:
        """Enhanced pattern matching"""

        # Expanded patterns
        patterns = {
            "usage": [
                r"for (running|gaming|travel|work|gym|office)",
                r"(ideal|best|perfect) for",
                r"to (run|game|travel|work)",
            ],
            "feature": [
                r"with (gps|bluetooth|wifi|anc|noise)",
                r"(waterproof|wireless|portable|rechargeable)",
                r"\d+gb|\d+mp|\d+mah",  # Specs like "16GB", "12MP"
            ],
            "description": [
                r"(stylish|elegant|modern|beautiful|sleek|premium)",
                r"(comfortable|soft|lightweight|durable)",
            ],
            "value": [
                r"(cheap|affordable|budget|under \$\d+)",
                r"best (value|deal|price)",
            ]
        }

        # Score each category
        scores = {cat: 0 for cat in patterns}
        for category, pattern_list in patterns.items():
            for pattern in pattern_list:
                if re.search(pattern, query):
                    scores[category] += 1

        total_score = sum(scores.values())
        if total_score == 0:
            return None  # No clear pattern

        # Convert to weights
        if scores["usage"] > scores["feature"] and scores["usage"] > scores["description"]:
            return {"description_weight": 0.2, "usage_weight": 0.6, "feature_weight": 0.2}
        elif scores["feature"] > scores["usage"]:
            return {"description_weight": 0.2, "usage_weight": 0.2, "feature_weight": 0.6}
        elif scores["description"] > 0:
            return {"description_weight": 0.6, "usage_weight": 0.3, "feature_weight": 0.1}

        return None
```

## Test Suite
```python
def test_query_classifier():
    classifier = QueryIntentClassifier()

    test_cases = [
        ("running shoes", "usage"),
        ("waterproof watch with GPS", "feature"),
        ("elegant evening dress", "description"),
        ("laptop for video editing under $1000", "usage+value"),
        ("16GB RAM gaming laptop", "feature"),
    ]

    for query, expected_focus in test_cases:
        weights = classifier.classify(query)
        print(f"{query}: {weights}")
        # Assert dominant aspect matches expected
```

## Expected Outcome
Robust classification that handles diverse query patterns with high accuracy.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
