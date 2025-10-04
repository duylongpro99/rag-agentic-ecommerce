# Task 04: Implement Research Plan Generation

## Description
Enhance the research planning logic with better query decomposition and step generation.

## File Location
`agentic/agents/specialized/research_agent.py`

## Implementation Checklist

- [ ] Improve plan generation prompt
- [ ] Add more example plans for few-shot learning
- [ ] Handle different query patterns
- [ ] Validate generated plans
- [ ] Add plan optimization
- [ ] Test with diverse queries

## Enhanced Planning
```python
def _create_research_plan(self, query: str) -> Dict[str, Any]:
    """Enhanced research planning with better decomposition"""

    # Query pattern analysis
    query_lower = query.lower()

    # Detect explicit comparison requests
    is_comparison = any(word in query_lower for word in
                       ['compare', 'vs', 'versus', 'difference between'])

    # Detect budget constraints
    has_budget = any(word in query_lower for word in
                    ['under', 'below', 'less than', 'max', '$'])

    # Detect multi-step intent
    has_steps = any(word in query_lower for word in
                   ['then', 'after', 'first', 'next'])

    # Use appropriate template
    if is_comparison:
        return self._create_comparison_plan(query)
    elif has_budget and 'compare' in query_lower:
        return self._create_budget_comparison_plan(query)
    elif has_steps:
        return self._create_sequential_plan(query)
    else:
        return self._create_search_plan(query)

def _create_comparison_plan(self, query: str) -> Dict:
    """Plan for comparison queries"""

    prompt = f"""
Create a plan for this comparison query:
Query: "{query}"

Extract product names to compare and create steps:
1. Search for each product
2. Compare the products
3. Summarize findings

Return JSON plan.
"""

    # ... LLM call and parsing
    pass

def _create_budget_comparison_plan(self, query: str) -> Dict:
    """Plan for queries with budget + comparison"""

    # Parse budget from query
    import re
    price_match = re.search(r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)', query)
    budget = float(price_match.group(1).replace(',', '')) if price_match else None

    return {
        "intent": f"Find and compare products within ${budget} budget",
        "steps": [
            {
                "id": "step1",
                "type": "search",
                "action": "Search for products",
                "parameters": {"query": self._extract_product_type(query)},
                "rationale": "Find relevant products"
            },
            {
                "id": "step2",
                "type": "filter",
                "action": "Apply budget filter",
                "parameters": {"max_price": budget} if budget else {},
                "rationale": f"Filter to budget: ${budget}"
            },
            {
                "id": "step3",
                "type": "compare",
                "action": "Compare top results",
                "parameters": {"top_k": 3},
                "rationale": "Detailed comparison"
            },
            {
                "id": "step4",
                "type": "summarize",
                "action": "Generate recommendation",
                "parameters": {},
                "rationale": "Final recommendation"
            }
        ]
    }

def _extract_product_type(self, query: str) -> str:
    """Extract what user is looking for"""

    # Use LLM to extract core product type
    prompt = f"""
Extract the product type from this query:
"{query}"

Examples:
"Find best laptop for video editing under $1500" → "laptop for video editing"
"Compare iPhone 15 vs Samsung S24" → "smartphones"
"I need running shoes" → "running shoes"

Return ONLY the product type, nothing else.
"""

    response = self.llm.invoke(prompt)
    return response.content.strip()

def _validate_plan(self, plan: Dict) -> bool:
    """Validate plan structure"""

    required_keys = ["intent", "steps"]
    if not all(key in plan for key in required_keys):
        return False

    for step in plan["steps"]:
        if "id" not in step or "type" not in step:
            return False

        if step["type"] not in ["search", "filter", "compare", "analyze", "summarize"]:
            return False

    return True

def _optimize_plan(self, plan: Dict) -> Dict:
    """Optimize plan by removing redundant steps"""

    # Remove duplicate searches
    seen_queries = set()
    optimized_steps = []

    for step in plan["steps"]:
        if step["type"] == "search":
            query = step.get("parameters", {}).get("query", "")
            if query in seen_queries:
                continue  # Skip duplicate
            seen_queries.add(query)

        optimized_steps.append(step)

    plan["steps"] = optimized_steps
    return plan
```

## Few-Shot Examples for Prompt
```python
FEW_SHOT_EXAMPLES = """
Query: "Find laptops for students under $800"
Plan:
{
  "intent": "Find affordable laptops suitable for students",
  "steps": [
    {"id": "step1", "type": "search", "action": "Search student laptops",
     "parameters": {"query": "laptop for students"}, "rationale": "Find relevant laptops"},
    {"id": "step2", "type": "filter", "action": "Apply price filter",
     "parameters": {"max_price": 800}, "rationale": "Budget constraint"},
    {"id": "step3", "type": "summarize", "action": "List options",
     "parameters": {}, "rationale": "Present results"}
  ]
}

Query: "Compare Sony WH-1000XM5 vs Bose QC45"
Plan:
{
  "intent": "Compare two specific headphone models",
  "steps": [
    {"id": "step1", "type": "search", "action": "Find Sony WH-1000XM5",
     "parameters": {"query": "Sony WH-1000XM5"}, "rationale": "Get product 1"},
    {"id": "step2", "type": "search", "action": "Find Bose QC45",
     "parameters": {"query": "Bose QC45"}, "rationale": "Get product 2"},
    {"id": "step3", "type": "compare", "action": "Compare both",
     "parameters": {"product_ids": "from previous steps"}, "rationale": "Side-by-side comparison"}
  ]
}
"""
```

## Testing Different Query Types
```python
test_queries = [
    "Find running shoes under $100",
    "Compare iPhone 15 vs Samsung S24 vs Pixel 8",
    "I need a laptop, first show me options, then filter for gaming, sort by price",
    "Best waterproof headphones for swimming",
    "Gaming monitor with 144Hz, compare top 3 under $400"
]

for query in test_queries:
    plan = agent._create_research_plan(query)
    print(f"\nQuery: {query}")
    print(f"Steps: {len(plan['steps'])}")
    print(json.dumps(plan, indent=2))
```

## Expected Outcome
Robust plan generation that handles diverse query types.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
