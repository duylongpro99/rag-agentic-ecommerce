# Task 06: Update LangGraph Workflow

## Description
Integrate the preference extraction and context re-ranking nodes into the LangGraph StateGraph workflow.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Locate the `_build_graph()` method
- [ ] Add `extract_preferences` node
- [ ] Add `rerank_with_context` node
- [ ] Update workflow entry point to start with preference extraction
- [ ] Add edge from `extract_preferences` to `analyze_query`
- [ ] Add edges from search nodes to `rerank_with_context`:
  - [ ] `semantic_search` → `rerank_with_context`
  - [ ] `structured_filter` → `rerank_with_context`
- [ ] Add edge from `rerank_with_context` to `generate_response`
- [ ] Update conditional routing if needed
- [ ] Test workflow compilation without errors
- [ ] Visualize workflow graph (optional)
- [ ] Verify all nodes are reachable
- [ ] Test end-to-end workflow execution

## Code Template
```python
def _build_graph(self):
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("extract_preferences", self._extract_preferences)
    workflow.add_node("analyze_query", self._analyze_query)
    workflow.add_node("semantic_search", self._semantic_search)
    workflow.add_node("structured_filter", self._structured_filter)
    workflow.add_node("rerank_with_context", self._rerank_with_context)  # NEW
    workflow.add_node("generate_response", self._generate_response)

    # Set entry point
    workflow.set_entry_point("extract_preferences")  # UPDATED

    # Add edges
    workflow.add_edge("extract_preferences", "analyze_query")  # NEW

    workflow.add_conditional_edges(
        "analyze_query",
        self._route_query,
        {
            "semantic": "semantic_search",
            "structured": "structured_filter",
            "both": "semantic_search"
        }
    )

    workflow.add_edge("semantic_search", "rerank_with_context")   # NEW
    workflow.add_edge("structured_filter", "rerank_with_context")  # NEW
    workflow.add_edge("rerank_with_context", "generate_response")  # NEW
    workflow.add_edge("generate_response", END)

    return workflow.compile()
```

## Expected Outcome
LangGraph workflow seamlessly integrates conversational memory.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
