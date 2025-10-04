# Task 08: Add Comparison and Research Nodes to Orchestrator

## Description
Integrate the ComparisonAgent and ResearchAgent as nodes in the orchestrator workflow.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Import ComparisonAgent and ResearchAgent
- [ ] Initialize agents in `__init__`
- [ ] Create `_comparison_mode()` node
- [ ] Create `_research_mode()` node
- [ ] Add nodes to workflow graph
- [ ] Test end-to-end comparison queries
- [ ] Test end-to-end research queries

## Implementation
```python
from agentic.agents.specialized.comparison_agent import ComparisonAgent
from agentic.agents.specialized.research_agent import ResearchAgent

class OrchestratorAgent:
    def __init__(self):
        self.llm = LLMModel.get_model()

        # Existing tools
        self.semantic_search = SemanticSearchTool()
        self.structured_filter = StructuredFilterTool()
        self.query_classifier = QueryIntentClassifier()
        self.intelligence_tool = ProductIntelligenceTool()

        # Specialized agents
        self.comparison_agent = ComparisonAgent()      # NEW
        self.research_agent = ResearchAgent()          # NEW

        self.graph = self._build_graph()

    def _comparison_mode(self, state: AgentState) -> AgentState:
        """Handle product comparison queries"""
        query = state["user_query"]

        state["thinks"].append("Entering comparison mode")

        # Extract product names to compare
        extraction_prompt = f"""
Extract product names to compare from this query:
"{query}"

Return JSON: {{"product_names": ["product1", "product2", ...]}}

Examples:
"compare iPhone 15 vs Samsung S24" → {{"product_names": ["iPhone 15", "Samsung S24"]}}
"Nike vs Adidas running shoes" → {{"product_names": ["Nike running shoes", "Adidas running shoes"]}}
"""

        response = self.llm.invoke(extraction_prompt)

        try:
            import json
            import re
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            data = json.loads(json_match.group(0))
            product_names = data.get("product_names", [])

        except:
            # Fallback: simple split on "vs"
            product_names = [p.strip() for p in query.replace(" vs ", "|").split("|")]

        state["thinks"].append(f"Comparing: {', '.join(product_names)}")

        # Search for each product
        product_ids = []
        for name in product_names:
            results = self.semantic_search.search_products(name, top_k=1)
            if results:
                product_ids.append(results[0]["id"])

        if len(product_ids) < 2:
            state["search_results"] = json.dumps({
                "error": "Could not find enough products to compare"
            })
            return state

        # Run comparison
        comparison = self.comparison_agent.compare_products(product_ids)
        state["search_results"] = json.dumps(comparison, default=str)
        state["thinks"].append(f"Comparison complete for {len(product_ids)} products")

        return state

    def _research_mode(self, state: AgentState) -> AgentState:
        """Handle multi-step research queries"""
        query = state["user_query"]

        state["thinks"].append("Entering research mode")

        # Execute research workflow
        research_results = self.research_agent.research_workflow(query)

        state["search_results"] = json.dumps(research_results, default=str)
        state["thinks"].append(
            f"Research complete: {len(research_results.get('step_results', {}))} steps executed"
        )

        return state

    def _build_graph(self):
        """Updated workflow with specialized modes"""
        workflow = StateGraph(AgentState)

        # Add all nodes
        workflow.add_node("extract_preferences", self._extract_preferences)
        workflow.add_node("analyze_query", self._analyze_query)
        workflow.add_node("semantic_search", self._semantic_search)
        workflow.add_node("structured_filter", self._structured_filter)
        workflow.add_node("rerank_with_context", self._rerank_with_context)
        workflow.add_node("enrich_intelligence", self._enrich_intelligence)
        workflow.add_node("comparison_mode", self._comparison_mode)       # NEW
        workflow.add_node("research_mode", self._research_mode)           # NEW
        workflow.add_node("generate_response", self._generate_response)

        # Set entry point
        workflow.set_entry_point("extract_preferences")

        # Basic flow
        workflow.add_edge("extract_preferences", "analyze_query")

        # Conditional routing based on query type
        workflow.add_conditional_edges(
            "analyze_query",
            self._route_query,
            {
                "semantic": "semantic_search",
                "structured": "structured_filter",
                "comparison": "comparison_mode",     # NEW
                "research": "research_mode",         # NEW
                "both": "semantic_search"
            }
        )

        # Standard search paths
        workflow.add_edge("semantic_search", "rerank_with_context")
        workflow.add_edge("structured_filter", "rerank_with_context")
        workflow.add_edge("rerank_with_context", "enrich_intelligence")
        workflow.add_edge("enrich_intelligence", "generate_response")

        # Specialized paths go directly to response
        # (already have processed results)
        workflow.add_edge("comparison_mode", "generate_response")
        workflow.add_edge("research_mode", "generate_response")

        workflow.add_edge("generate_response", END)

        return workflow.compile()
```

## Workflow Diagram
```
extract_preferences → analyze_query → [routing]
                                         ├── semantic_search → rerank → enrich → response
                                         ├── structured_filter → rerank → enrich → response
                                         ├── comparison_mode → response
                                         └── research_mode → response
```

## Testing
```bash
# Test comparison mode
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "compare iPhone 15 vs Samsung S24", "user_id": 1}'

# Test research mode
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "find best laptop for video editing under $1500, compare top 3", "user_id": 1}'
```

## Expected Outcome
Comparison and research queries route to specialized agents.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
