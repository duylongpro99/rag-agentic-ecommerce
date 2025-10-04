# Task 05: Add Intelligence Enrichment to Orchestrator

## Description
Integrate the ProductIntelligenceTool into the orchestrator workflow to enrich search results before response generation.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Import ProductIntelligenceTool
- [ ] Initialize tool in `__init__`
- [ ] Add `enrich_intelligence` node to workflow
- [ ] Implement `_enrich_intelligence()` method
- [ ] Update state with enriched products
- [ ] Add edge from search nodes to enrichment node
- [ ] Add edge from enrichment to response generation
- [ ] Test workflow compilation
- [ ] Verify enrichment runs for all searches

## Code Updates
```python
from agentic.tools.product_intelligence import ProductIntelligenceTool

class OrchestratorAgent:
    def __init__(self):
        self.llm = LLMModel.get_model()
        self.semantic_search = SemanticSearchTool()
        self.structured_filter = StructuredFilterTool()
        self.query_classifier = QueryIntentClassifier()
        self.intelligence_tool = ProductIntelligenceTool()  # NEW
        self.graph = self._build_graph()

    def _enrich_intelligence(self, state: AgentState) -> AgentState:
        """Enrich products with real-time intelligence"""
        try:
            products = json.loads(state["search_results"])

            # Enrich with intelligence data
            enriched = self.intelligence_tool.enrich_products(products)

            state["search_results"] = json.dumps(enriched, default=str)
            state["thinks"].append(
                f"Enriched {len(enriched)} products with intelligence data"
            )
        except Exception as e:
            print(f"Intelligence enrichment error: {e}")
            # Continue without enrichment on error

        return state

    def _build_graph(self):
        workflow = StateGraph(AgentState)

        # Add nodes
        workflow.add_node("extract_preferences", self._extract_preferences)
        workflow.add_node("analyze_query", self._analyze_query)
        workflow.add_node("semantic_search", self._semantic_search)
        workflow.add_node("structured_filter", self._structured_filter)
        workflow.add_node("rerank_with_context", self._rerank_with_context)
        workflow.add_node("enrich_intelligence", self._enrich_intelligence)  # NEW
        workflow.add_node("generate_response", self._generate_response)

        # Set entry and edges
        workflow.set_entry_point("extract_preferences")
        workflow.add_edge("extract_preferences", "analyze_query")

        workflow.add_conditional_edges(
            "analyze_query",
            self._route_query,
            {
                "semantic": "semantic_search",
                "structured": "structured_filter",
                "both": "semantic_search"
            }
        )

        workflow.add_edge("semantic_search", "rerank_with_context")
        workflow.add_edge("structured_filter", "rerank_with_context")
        workflow.add_edge("rerank_with_context", "enrich_intelligence")  # NEW
        workflow.add_edge("enrich_intelligence", "generate_response")   # NEW
        workflow.add_edge("generate_response", END)

        return workflow.compile()
```

## Workflow Diagram
```
extract_preferences → analyze_query → [semantic_search / structured_filter]
                                              ↓
                                      rerank_with_context
                                              ↓
                                      enrich_intelligence  ← NEW
                                              ↓
                                      generate_response
```

## Testing
```bash
# Start server
python -m uvicorn agentic.api.main:app --reload

# Test query
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show me laptops", "user_id": 1}'

# Check response for intelligence data
# Should include: in_stock, stock_level, is_good_deal, is_trending, etc.
```

## Expected Outcome
All search results are enriched with intelligence data before being sent to user.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
