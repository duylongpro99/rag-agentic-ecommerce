# Task 06: Create QueryIntentClassifier

## Description
Build a classifier that analyzes user queries to determine which aspect embeddings to weight more heavily (usage vs description vs features).

## File Location
`agentic/tools/query_classifier.py` (new file)

## Implementation Checklist

- [ ] Create `agentic/tools/query_classifier.py`
- [ ] Import necessary dependencies (LLM, typing, json)
- [ ] Create `QueryIntentClassifier` class
- [ ] Define query pattern constants for rule-based classification
- [ ] Implement `__init__` with LLM initialization
- [ ] Implement `classify()` method
- [ ] Design LLM prompt for aspect weight classification
- [ ] Parse JSON response with aspect weights
- [ ] Validate weights sum to 1.0
- [ ] Add default weights fallback
- [ ] Implement pattern matching for common query types:
  - [ ] Usage-focused: "for running", "for gaming", "for travel"
  - [ ] Feature-focused: "with GPS", "waterproof", "noise cancelling"
  - [ ] Description-focused: "stylish", "modern", "comfortable"
  - [ ] Value-focused: "cheap", "budget", "affordable"
- [ ] Add confidence scoring for classification
- [ ] Implement caching for repeated query patterns
- [ ] Add unit tests for various query types
- [ ] Test edge cases (empty query, very long query)

## Code Template
```python
from typing import Dict
import json
from agentic.factory.llm_model import LLMModel

class QueryIntentClassifier:
    """Determines which aspect embeddings to weight for a given query"""

    # Pattern-based classification rules
    QUERY_PATTERNS = {
        "usage_focused": ["for running", "for gaming", "for travel", "ideal for", "best for"],
        "feature_focused": ["with", "waterproof", "wireless", "noise cancelling", "GPS"],
        "aesthetic_focused": ["stylish", "modern design", "sleek", "beautiful", "elegant"],
        "value_focused": ["cheap", "budget", "affordable", "best value", "under $"]
    }

    DEFAULT_WEIGHTS = {
        "description_weight": 0.4,
        "usage_weight": 0.35,
        "feature_weight": 0.25
    }

    def __init__(self):
        self.llm = LLMModel.get_model()

    def classify(self, query: str) -> Dict[str, float]:
        """
        Classify query and return aspect weights.

        Args:
            query: User's search query

        Returns:
            Dict with description_weight, usage_weight, feature_weight (sum=1.0)
        """
        # Try pattern matching first (faster)
        weights = self._pattern_based_classification(query)
        if weights:
            return weights

        # Fallback to LLM-based classification
        return self._llm_based_classification(query)

    def _pattern_based_classification(self, query: str) -> Dict[str, float] | None:
        """Fast pattern matching for common query types"""
        query_lower = query.lower()

        # Check for usage-focused patterns
        if any(pattern in query_lower for pattern in self.QUERY_PATTERNS["usage_focused"]):
            return {"description_weight": 0.2, "usage_weight": 0.6, "feature_weight": 0.2}

        # Check for feature-focused patterns
        if any(pattern in query_lower for pattern in self.QUERY_PATTERNS["feature_focused"]):
            return {"description_weight": 0.2, "usage_weight": 0.2, "feature_weight": 0.6}

        # No clear pattern, use LLM
        return None

    def _llm_based_classification(self, query: str) -> Dict[str, float]:
        """LLM-based classification for complex queries"""

        prompt = f"""
Classify this product search query into aspect weights.

Query: "{query}"

Determine how much to weight each aspect (must sum to 1.0):
- description_weight: Semantic product description match
- usage_weight: Use-case and scenario matching
- feature_weight: Technical specs and features

Examples:
"comfortable running shoes" → {{"description_weight": 0.2, "usage_weight": 0.7, "feature_weight": 0.1}}
"wireless headphones with ANC" → {{"description_weight": 0.3, "usage_weight": 0.1, "feature_weight": 0.6}}
"stylish laptop for students" → {{"description_weight": 0.5, "usage_weight": 0.4, "feature_weight": 0.1}}

Return ONLY valid JSON with the three weights.
"""

        try:
            response = self.llm.invoke(prompt)
            weights = json.loads(response.content)

            # Validate weights
            if self._validate_weights(weights):
                return weights
            else:
                return self.DEFAULT_WEIGHTS

        except Exception as e:
            print(f"Classification error: {e}")
            return self.DEFAULT_WEIGHTS

    def _validate_weights(self, weights: Dict[str, float]) -> bool:
        """Ensure weights are valid"""
        required_keys = ["description_weight", "usage_weight", "feature_weight"]

        if not all(key in weights for key in required_keys):
            return False

        total = sum(weights.values())
        if not (0.99 <= total <= 1.01):  # Allow small float errors
            return False

        return True
```

## Test Cases
- [ ] "running shoes" → usage-focused
- [ ] "waterproof watch with GPS" → feature-focused
- [ ] "elegant evening dress" → description-focused
- [ ] "laptop for video editing" → balanced usage + features
- [ ] "" (empty query) → default weights

## Expected Outcome
Accurate query classification that improves multi-aspect search relevance.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
