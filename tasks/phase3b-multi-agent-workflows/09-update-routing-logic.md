# Task 09: Update Orchestrator Routing Logic

## Description
Refine the routing logic to handle all query modes efficiently with proper error handling.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Add routing validation
- [ ] Handle routing errors gracefully
- [ ] Add logging for routing decisions
- [ ] Optimize routing performance
- [ ] Test edge cases

## Enhanced Routing
```python
def _route_query(self, state: AgentState) -> str:
    """
    Route query to appropriate handler with validation.

    Returns:
        Next node name
    """
    strategy = state.get("search_strategy", "semantic")

    # Routing map
    routing_map = {
        "semantic": "semantic_search",
        "structured": "structured_filter",
        "comparison": "comparison_mode",
        "research": "research_mode",
        "both": "semantic_search"
    }

    next_node = routing_map.get(strategy)

    if not next_node:
        # Invalid strategy, default to semantic
        print(f"⚠️ Invalid strategy: {strategy}, defaulting to semantic")
        state["thinks"].append(f"Warning: Invalid strategy {strategy}")
        return "semantic_search"

    # Log routing decision
    print(f"🔀 Routing: {strategy} → {next_node}")
    state["thinks"].append(f"Routing to {next_node}")

    return next_node

def _handle_routing_error(self, state: AgentState, error: Exception) -> AgentState:
    """Handle errors during routing"""

    error_msg = f"Routing error: {str(error)}"
    print(f"❌ {error_msg}")

    state["thinks"].append(error_msg)
    state["search_results"] = json.dumps({
        "error": "Unable to process query",
        "details": str(error)
    })

    return state
```

## Routing Decision Matrix
```python
ROUTING_DECISION_MATRIX = {
    # Format: (patterns, mode)
    "comparison": {
        "patterns": [
            r"compare .* (vs|versus) .*",
            r"difference between .* and .*",
            r".* or .*\?$",  # "iPhone or Samsung?"
            r"which is better.*"
        ],
        "requires": ["multiple_products"]
    },
    "research": {
        "patterns": [
            r"find .* compare",
            r"best .* compare top \d+",
            r"find .* then .*",
            r"show .* filter .* sort"
        ],
        "requires": ["multi_step_intent"]
    },
    "structured": {
        "patterns": [
            r"under \$\d+",
            r"below \$\d+",
            r"from .* brand",
            r"in .* category",
            r"price range.*"
        ],
        "requires": ["filter_criteria"]
    }
}

def _classify_with_patterns(self, query: str) -> str:
    """Pattern-based routing classification"""
    import re

    query_lower = query.lower()

    # Check each mode's patterns
    for mode, config in self.ROUTING_DECISION_MATRIX.items():
        for pattern in config["patterns"]:
            if re.search(pattern, query_lower):
                # Verify requirements
                if self._verify_requirements(query, config["requires"]):
                    return mode

    # Default to semantic
    return "semantic"

def _verify_requirements(self, query: str, requirements: List[str]) -> bool:
    """Verify query meets mode requirements"""

    for req in requirements:
        if req == "multiple_products":
            # Check for at least 2 product references
            if not self._has_multiple_products(query):
                return False

        elif req == "multi_step_intent":
            # Check for sequential keywords
            if not any(word in query.lower() for word in ["then", "after", "first", "next"]):
                return False

        elif req == "filter_criteria":
            # Check for filter keywords
            if not any(word in query.lower() for word in ["under", "from", "category", "brand"]):
                return False

    return True
```

## Routing Optimization
```python
from functools import lru_cache

@lru_cache(maxsize=200)
def _route_query_cached(self, query: str, strategy: str) -> str:
    """Cached routing for repeated queries"""
    return self._routing_map.get(strategy, "semantic_search")

def _should_use_specialized_agent(self, state: AgentState) -> bool:
    """Determine if query warrants specialized agent"""

    query = state["user_query"]

    # Check complexity
    if len(query.split()) > 10:  # Long query = might need research
        return True

    # Check for comparison keywords
    if any(kw in query.lower() for kw in ["compare", "vs", "versus"]):
        return True

    # Check for multi-step indicators
    if any(kw in query.lower() for kw in ["then", "after", "top 3", "top 5"]):
        return True

    return False
```

## Error Recovery
```python
def _fallback_routing(self, state: AgentState) -> str:
    """Fallback routing when primary routing fails"""

    query = state["user_query"]

    # Simple heuristic fallback
    if "compare" in query.lower():
        return "comparison_mode"

    if any(word in query.lower() for word in ["under $", "below $"]):
        return "structured_filter"

    # Default
    return "semantic_search"
```

## Testing
```python
# Test routing logic
test_queries = [
    ("compare iPhone vs Samsung", "comparison"),
    ("find laptops, filter under $1000, compare top 3", "research"),
    ("Nike shoes under $100", "structured"),
    ("comfortable running shoes", "semantic"),
    ("waterproof headphones with ANC", "both")
]

for query, expected in test_queries:
    state = {"user_query": query, "search_strategy": expected, "thinks": []}
    routed = orchestrator._route_query(state)
    print(f"{query} → {routed}")
```

## Expected Outcome
Robust routing that handles all query types reliably.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
