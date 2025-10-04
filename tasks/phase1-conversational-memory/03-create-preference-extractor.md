# Task 03: Create PreferenceExtractor Tool

## Description
Build a new tool that analyzes conversation history to extract cumulative user preferences (brands, price range, categories, features).

## File Location
`agentic/tools/preference_extractor.py` (new file)

## Implementation Checklist

- [ ] Create `agentic/tools/preference_extractor.py`
- [ ] Import necessary dependencies (LLM factory, typing)
- [ ] Create `PreferenceExtractorTool` class
- [ ] Implement `__init__` method with LLM initialization
- [ ] Implement `extract()` method accepting conversation history
- [ ] Design extraction prompt for LLM
- [ ] Parse LLM response into structured preferences dict
- [ ] Handle JSON parsing errors gracefully
- [ ] Add preference categories:
  - [ ] preferred_brands (list)
  - [ ] avoided_brands (list)
  - [ ] max_price (float or None)
  - [ ] min_price (float or None)
  - [ ] required_features (list)
  - [ ] rejected_product_ids (list)
  - [ ] category_focus (string or None)
- [ ] Add unit tests for preference extraction
- [ ] Test with sample conversation histories

## Code Structure
```python
from typing import List, Dict, Any
from agentic.factory.llm_model import LLMModel

class PreferenceExtractorTool:
    """Extracts cumulative user preferences from conversation history"""

    def __init__(self):
        self.llm = LLMModel.get_model()

    def extract(self, conversation_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Analyzes conversation and extracts user preferences.

        Args:
            conversation_history: List of {"role": "user/assistant", "content": "..."}

        Returns:
            Dict with preference categories
        """
        # Implementation here
        pass
```

## Expected Outcome
Tool successfully extracts structured preferences from conversation history.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
