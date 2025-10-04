# Task 03: Create ResearchAgent

## Description
Build a research agent that decomposes complex multi-step queries into executable plans.

## File Location
`agentic/agents/specialized/research_agent.py` (new file)

## Implementation Checklist

- [ ] Create `research_agent.py`
- [ ] Implement `ResearchAgent` class
- [ ] Add `research_workflow()` method for orchestration
- [ ] Implement query planning
- [ ] Execute multi-step research plans
- [ ] Synthesize final results
- [ ] Test with complex queries

## Implementation
```python
# agentic/agents/specialized/research_agent.py

from typing import List, Dict, Any
import json
from agentic.factory.llm_model import LLMModel
from agentic.tools.semantic_search import SemanticSearchTool
from agentic.tools.structured_filter import StructuredFilterTool
from agentic.agents.specialized.comparison_agent import ComparisonAgent

class ResearchAgent:
    """Multi-step product research workflow agent"""

    def __init__(self):
        self.llm = LLMModel.get_model()
        self.search_tool = SemanticSearchTool()
        self.filter_tool = StructuredFilterTool()
        self.comparison_agent = ComparisonAgent()

    def research_workflow(self, query: str) -> Dict[str, Any]:
        """
        Execute multi-step research plan for complex queries.

        Example queries:
        - "Find best laptop for video editing under $1500, compare top 3"
        - "I need running shoes, show me options, then filter waterproof, sort by price"
        - "Compare iPhone 15 vs Samsung S24 vs Pixel 8"

        Returns:
            Comprehensive research results with plan and findings
        """

        print(f"🔬 Starting research for: {query}")

        # Step 1: Create research plan
        plan = self._create_research_plan(query)
        print(f"📋 Research plan: {len(plan['steps'])} steps")

        # Step 2: Execute plan
        results = self._execute_plan(plan)

        # Step 3: Synthesize findings
        synthesis = self._synthesize_research(results, query, plan)

        return {
            "query": query,
            "plan": plan,
            "step_results": results,
            "synthesis": synthesis
        }

    def _create_research_plan(self, query: str) -> Dict[str, Any]:
        """Decompose query into executable research steps"""

        prompt = f"""
Analyze this product research query and create a step-by-step plan:

Query: "{query}"

Available actions:
- search: Semantic product search
- filter: Apply filters (price, brand, category)
- compare: Compare specific products
- analyze: Analyze specs or features
- summarize: Synthesize findings

Create a JSON research plan:
{{
  "intent": "What the user wants to accomplish",
  "steps": [
    {{
      "id": "step1",
      "type": "search|filter|compare|analyze|summarize",
      "action": "Specific action to take",
      "parameters": {{"query": "...", "filters": {{...}} }},
      "rationale": "Why this step is needed"
    }}
  ]
}}

Examples:

Query: "Find best laptop for video editing under $1500, compare top 3"
Plan:
{{
  "intent": "Find and compare video editing laptops within budget",
  "steps": [
    {{"id": "step1", "type": "search", "action": "Search for video editing laptops", "parameters": {{"query": "laptop for video editing"}}, "rationale": "Find relevant laptops"}},
    {{"id": "step2", "type": "filter", "action": "Filter by price", "parameters": {{"max_price": 1500}}, "rationale": "Apply budget constraint"}},
    {{"id": "step3", "type": "compare", "action": "Compare top 3 results", "parameters": {{"top_k": 3}}, "rationale": "Detailed comparison of finalists"}},
    {{"id": "step4", "type": "summarize", "action": "Generate recommendation", "parameters": {{}}, "rationale": "Synthesize findings"}}
  ]
}}

Now create a plan for the query above. Return ONLY valid JSON.
"""

        response = self.llm.invoke(prompt)

        try:
            import re
            json_match = re.search(r'\{.*\}', response.content, re.DOTALL)
            if json_match:
                plan = json.loads(json_match.group(0))
                return plan
        except Exception as e:
            print(f"Plan generation error: {e}")

        # Fallback: simple search plan
        return {
            "intent": "Search for products",
            "steps": [
                {
                    "id": "step1",
                    "type": "search",
                    "action": "Search products",
                    "parameters": {"query": query},
                    "rationale": "Direct search"
                }
            ]
        }

    def _execute_plan(self, plan: Dict) -> Dict[str, Any]:
        """Execute each step in the research plan"""

        results = {}
        accumulated_data = {}  # Data passed between steps

        for step in plan["steps"]:
            step_id = step["id"]
            step_type = step["type"]
            params = step.get("parameters", {})

            print(f"  Executing {step_id}: {step_type} - {step['action']}")

            try:
                if step_type == "search":
                    query = params.get("query", "")
                    top_k = params.get("top_k", 5)
                    step_result = self.search_tool.search_products(query, top_k)
                    accumulated_data["products"] = step_result

                elif step_type == "filter":
                    # Filter existing results
                    products = accumulated_data.get("products", [])
                    step_result = self._apply_filters(products, params)
                    accumulated_data["products"] = step_result

                elif step_type == "compare":
                    products = accumulated_data.get("products", [])
                    top_k = params.get("top_k", 3)
                    product_ids = [p["id"] for p in products[:top_k]]
                    step_result = self.comparison_agent.compare_products(product_ids)

                elif step_type == "analyze":
                    products = accumulated_data.get("products", [])
                    step_result = self._analyze_specs(products)

                elif step_type == "summarize":
                    step_result = {"note": "Summarization happens in synthesis"}

                else:
                    step_result = {"error": f"Unknown step type: {step_type}"}

                results[step_id] = {
                    "step": step,
                    "result": step_result,
                    "status": "success"
                }

            except Exception as e:
                results[step_id] = {
                    "step": step,
                    "error": str(e),
                    "status": "failed"
                }

        results["final_data"] = accumulated_data
        return results

    def _apply_filters(self, products: List[Dict],
                      filters: Dict[str, Any]) -> List[Dict]:
        """Apply filters to product list"""

        filtered = products

        # Price filter
        if "max_price" in filters:
            filtered = [p for p in filtered if p["price"] <= filters["max_price"]]

        if "min_price" in filters:
            filtered = [p for p in filtered if p["price"] >= filters["min_price"]]

        # Brand filter
        if "brand" in filters:
            filtered = [p for p in filtered
                       if p["brand"].lower() == filters["brand"].lower()]

        # Category filter
        if "category" in filters:
            filtered = [p for p in filtered
                       if filters["category"].lower() in p["category"].lower()]

        return filtered

    def _analyze_specs(self, products: List[Dict]) -> Dict[str, Any]:
        """Analyze product specifications (placeholder for SpecExtractor)"""
        # Will be enhanced with SpecExtractorTool in later task
        return {
            "analyzed_products": len(products),
            "note": "Spec extraction not yet implemented"
        }

    def _synthesize_research(self, results: Dict, query: str,
                            plan: Dict) -> str:
        """Synthesize research findings into final answer"""

        prompt = f"""
Synthesize these research findings into a comprehensive answer:

Original Query: "{query}"
Research Intent: {plan.get('intent', 'N/A')}

Research Results:
{json.dumps(results, indent=2, default=str)}

Provide:
1. Summary of findings
2. Key insights
3. Specific recommendation
4. Reasoning for recommendation

Write a clear, concise synthesis (max 300 words).
"""

        response = self.llm.invoke(prompt)
        return response.content
```

## Testing
```python
# Test research agent
if __name__ == "__main__":
    agent = ResearchAgent()

    # Complex query
    result = agent.research_workflow(
        "Find best laptop for video editing under $1500, compare top 3"
    )

    print("\n" + "="*50)
    print("RESEARCH RESULTS")
    print("="*50)
    print(f"\nQuery: {result['query']}")
    print(f"\nPlan: {json.dumps(result['plan'], indent=2)}")
    print(f"\nSynthesis:\n{result['synthesis']}")
```

## Expected Outcome
Working research agent that handles multi-step queries.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
