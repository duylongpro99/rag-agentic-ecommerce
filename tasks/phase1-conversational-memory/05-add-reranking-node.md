# Task 05: Add Context Re-ranking Node

## Description
Create a new orchestrator node that re-ranks search results based on extracted user preferences from conversation history.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Add `_rerank_with_context()` method to OrchestratorAgent class
- [ ] Parse search results from state
- [ ] Retrieve extracted preferences from state
- [ ] Implement scoring algorithm:
  - [ ] Boost preferred brands (+20% score)
  - [ ] Demote avoided brands (-30% score)
  - [ ] Filter out rejected product IDs
  - [ ] Boost products within price range (+15% score)
  - [ ] Boost products with required features (+25% score)
  - [ ] Prefer category match (+10% score)
- [ ] Handle missing preference data gracefully
- [ ] Sort results by adjusted score
- [ ] Update state with re-ranked results
- [ ] Add logging for re-ranking decisions
- [ ] Preserve original similarity scores for reference
- [ ] Test with various preference combinations
- [ ] Validate re-ranking improves relevance

## Code Template
```python
def _rerank_with_context(self, state: AgentState) -> AgentState:
    """Re-rank search results using conversation context"""
    products = json.loads(state["search_results"])
    preferences = state.get("extracted_preferences", {})

    if not preferences:
        return state  # No re-ranking needed

    # Apply contextual scoring
    for product in products:
        original_score = product.get("similarity_score", 0.5)
        adjusted_score = original_score

        # Brand preference
        if product["brand"] in preferences.get("preferred_brands", []):
            adjusted_score += 0.20
        if product["brand"] in preferences.get("avoided_brands", []):
            adjusted_score -= 0.30

        # Price range
        max_price = preferences.get("max_price")
        if max_price and product["price"] <= max_price:
            adjusted_score += 0.15

        # TODO: Feature matching, category matching

        product["adjusted_score"] = adjusted_score
        product["original_score"] = original_score

    # Filter rejected products
    rejected_ids = set(preferences.get("rejected_product_ids", []))
    products = [p for p in products if p["id"] not in rejected_ids]

    # Sort by adjusted score
    products.sort(key=lambda p: p["adjusted_score"], reverse=True)

    state["search_results"] = json.dumps(products)
    return state
```

## Expected Outcome
Search results are intelligently re-ranked based on user's conversation history.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
