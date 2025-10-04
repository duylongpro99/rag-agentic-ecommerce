# Task 07: Update Orchestrator Query Analysis

## Description
Enhance the orchestrator to detect comparison and research mode queries.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Update `_analyze_query()` method
- [ ] Add comparison query detection
- [ ] Add research query detection
- [ ] Update routing logic
- [ ] Test with various query types

## Implementation
```python
def _analyze_query(self, state: AgentState) -> AgentState:
    """Enhanced query analysis with comparison/research detection"""
    query = state["user_query"]

    analysis_prompt = f"""
Analyze this e-commerce query and determine the search mode:

Query: "{query}"

Available modes:
1. "semantic": Natural language search (e.g., "comfortable running shoes")
2. "structured": Filter-based (e.g., "Nike shoes under $100")
3. "comparison": Explicit product comparison (e.g., "compare iPhone 15 vs Samsung S24")
4. "research": Multi-step research task (e.g., "find best laptop for video editing, compare top 3")
5. "both": Mixed semantic + filters

Detection rules:
- comparison: Contains "compare", "vs", "versus", "difference between" + product names
- research: Contains multi-step intent like "find X, then Y", "compare top N", budget + comparison
- structured: Contains specific filters (brand, price, category)
- semantic: General descriptive search
- both: Descriptive query with filters

Return ONLY the mode name (one word).
"""

    response = self.llm.invoke(analysis_prompt)
    mode = response.content.strip().lower()

    # Validate mode
    valid_modes = ["semantic", "structured", "comparison", "research", "both"]
    if mode not in valid_modes:
        mode = "semantic"  # Default

    state["search_strategy"] = mode
    state["thinks"].append(f"Query analyzed as: {mode}")

    return state

def _route_query(self, state: AgentState) -> str:
    """Enhanced routing with comparison and research modes"""
    strategy = state.get("search_strategy", "semantic")

    # Map strategy to next node
    routing = {
        "semantic": "semantic_search",
        "structured": "structured_filter",
        "comparison": "comparison_mode",    # NEW
        "research": "research_mode",         # NEW
        "both": "semantic_search"
    }

    return routing.get(strategy, "semantic_search")
```

## Pattern-Based Detection (Alternative)
```python
def _detect_query_mode_fast(self, query: str) -> str:
    """Fast pattern-based mode detection (no LLM)"""

    query_lower = query.lower()

    # Comparison patterns
    comparison_keywords = ["compare", "vs", "versus", "difference between", "or"]
    if any(kw in query_lower for kw in comparison_keywords):
        # Check if product names mentioned
        if self._has_multiple_product_names(query):
            return "comparison"

    # Research patterns
    research_patterns = [
        "find.*compare",
        "best.*compare",
        "show.*then",
        "find.*top \d+",
        "compare top"
    ]
    import re
    if any(re.search(pattern, query_lower) for pattern in research_patterns):
        return "research"

    # Structured filter patterns
    if any(word in query_lower for word in ["under $", "below $", "max $", "from brand"]):
        return "structured"

    # Default to semantic
    return "semantic"

def _has_multiple_product_names(self, query: str) -> bool:
    """Check if query mentions multiple specific products"""
    # Simple heuristic: check for brand names
    known_brands = ["iphone", "samsung", "pixel", "nike", "adidas", "sony", "lg"]
    brand_count = sum(1 for brand in known_brands if brand in query.lower())
    return brand_count >= 2
```

## Testing
```python
# Test query analysis
test_cases = [
    ("comfortable running shoes", "semantic"),
    ("Nike shoes under $100", "structured"),
    ("compare iPhone 15 vs Samsung S24", "comparison"),
    ("find best laptop for video editing, compare top 3", "research"),
    ("waterproof headphones under $200", "both")
]

for query, expected_mode in test_cases:
    state = {"user_query": query, "thinks": []}
    state = orchestrator._analyze_query(state)
    actual_mode = state["search_strategy"]
    print(f"Query: {query}")
    print(f"Expected: {expected_mode}, Got: {actual_mode}")
    print(f"Match: {'✓' if actual_mode == expected_mode else '✗'}\n")
```

## Expected Outcome
Accurate detection of comparison and research queries.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
