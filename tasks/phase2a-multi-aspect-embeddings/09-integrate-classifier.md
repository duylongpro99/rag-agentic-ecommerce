# Task 09: Integrate QueryIntentClassifier into Orchestrator

## Description
Update the orchestrator to use the QueryIntentClassifier and pass aspect weights to the semantic search tool.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Import QueryIntentClassifier
- [ ] Initialize classifier in `__init__`
- [ ] Update `_semantic_search` node to use multi-aspect search
- [ ] Pass query classification results through state
- [ ] Add aspect weights to AgentState (optional, for debugging)
- [ ] Update state after classification
- [ ] Ensure semantic search uses the new multi_aspect_search method
- [ ] Add logging for aspect weights used
- [ ] Test end-to-end workflow
- [ ] Verify results improve with weighted search

## Code Updates
```python
from agentic.tools.query_classifier import QueryIntentClassifier

class OrchestratorAgent:
    def __init__(self):
        self.llm = LLMModel.get_model()
        self.semantic_search = SemanticSearchTool()
        self.structured_filter = StructuredFilterTool()
        self.query_classifier = QueryIntentClassifier()  # NEW
        self.graph = self._build_graph()

    def _semantic_search(self, state: AgentState) -> AgentState:
        """Perform semantic search with aspect classification"""
        query = state["user_query"]

        # Classification happens inside SemanticSearchTool.search_products()
        # but we can also track it here for debugging
        aspect_weights = self.query_classifier.classify(query)
        print(f"🎯 Query intent weights: {aspect_weights}")

        # Search with multi-aspect embeddings
        results = self.semantic_search.search_products(query, top_k=5)

        # Update state
        state["search_results"] = json.dumps(results, default=str)
        state["thinks"].append(
            f"Found {len(results)} products using multi-aspect search "
            f"(desc: {aspect_weights['description_weight']:.2f}, "
            f"usage: {aspect_weights['usage_weight']:.2f}, "
            f"feat: {aspect_weights['feature_weight']:.2f})"
        )

        return state
```

## Optional: Add to AgentState
```python
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str
    conversation_history: List[Dict[str, str]]
    extracted_preferences: Dict[str, Any]
    aspect_weights: Dict[str, float]  # NEW (optional for debugging)
    search_results: str
    final_response: str
    thinks: List[str]
```

## Response Enhancement
- [ ] Update `_generate_response` to mention search strategy
- [ ] Include aspect weights in thinks/logs
- [ ] Optionally show user which aspects were weighted

## Testing Checklist
- [ ] Test usage-focused query end-to-end
- [ ] Test feature-focused query end-to-end
- [ ] Test description-focused query end-to-end
- [ ] Verify aspect weights are logged
- [ ] Compare results quality with v1
- [ ] Measure latency increase (should be minimal)

## Verification
```bash
# Start server
python -m uvicorn agentic.api.main:app --reload

# Test query
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "comfortable running shoes for marathons", "user_id": 1}'

# Check logs for aspect weights
# Should see: "🎯 Query intent weights: {'description_weight': 0.2, 'usage_weight': 0.6, 'feature_weight': 0.2}"
```

## Expected Outcome
Orchestrator seamlessly uses multi-aspect search with query classification.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
