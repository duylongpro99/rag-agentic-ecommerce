# Task 02: Implement Pros/Cons Generation

## Description
Complete the pros/cons generation method with LLM-based analysis relative to competing products.

## File Location
`agentic/agents/specialized/comparison_agent.py`

## Implementation Checklist

- [ ] Design pros/cons prompt template
- [ ] Implement comparative analysis logic
- [ ] Generate context-aware pros/cons
- [ ] Add "best_for" recommendations
- [ ] Add "avoid_if" warnings
- [ ] Handle edge cases (single product, similar products)
- [ ] Test output quality

## Implementation
```python
def _generate_pros_cons(self, product: Dict,
                       all_products: List[Dict]) -> Dict[str, Any]:
    """
    Generate contextual pros/cons by comparing to alternatives.

    Args:
        product: Product to analyze
        all_products: All products in comparison (for context)

    Returns:
        Dict with pros, cons, best_for, avoid_if
    """

    # Get competitors (other products)
    competitors = [p for p in all_products if p["id"] != product["id"]]

    prompt = f"""
Analyze this product in comparison to its alternatives:

**Product to Analyze:**
Name: {product['name']}
Brand: {product['brand']}
Price: ${product['price']}
Category: {product['category']}
Description: {product.get('description', 'N/A')}
Usage: {product.get('usage', 'N/A')}

**Competing Products:**
{json.dumps([
    {
        "name": p['name'],
        "brand": p['brand'],
        "price": p['price']
    }
    for p in competitors
], indent=2)}

Generate a comparative analysis in JSON format:

{{
  "pros": [
    "Specific advantage 1 (compared to alternatives)",
    "Specific advantage 2",
    "Specific advantage 3"
  ],
  "cons": [
    "Specific limitation 1 (compared to alternatives)",
    "Specific limitation 2"
  ],
  "best_for": "User profile or use case this product excels at",
  "avoid_if": "User profile or use case where alternatives are better"
}}

Focus on:
- Price/value comparison
- Feature differences
- Brand reputation
- Use case fit

Return ONLY valid JSON.
"""

    try:
        response = self.llm.invoke(prompt)

        # Extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', response.content, re.DOTALL)

        if json_match:
            analysis = json.loads(json_match.group(0))

            # Validate structure
            required_keys = ["pros", "cons", "best_for", "avoid_if"]
            if all(key in analysis for key in required_keys):
                return analysis

    except Exception as e:
        print(f"Pros/cons generation failed: {e}")

    # Fallback to simple analysis
    return self._fallback_pros_cons(product, competitors)

def _fallback_pros_cons(self, product: Dict,
                       competitors: List[Dict]) -> Dict[str, Any]:
    """Simple rule-based pros/cons when LLM fails"""

    pros = []
    cons = []

    # Price comparison
    avg_price = sum(p["price"] for p in competitors) / len(competitors) if competitors else product["price"]

    if product["price"] < avg_price * 0.9:
        pros.append(f"More affordable than alternatives (${product['price']} vs avg ${avg_price:.2f})")
    elif product["price"] > avg_price * 1.1:
        cons.append(f"Higher priced than alternatives (${product['price']} vs avg ${avg_price:.2f})")

    # Brand
    pros.append(f"From trusted brand: {product['brand']}")

    # Generic
    if product.get("description"):
        pros.append("Detailed product information available")

    return {
        "pros": pros,
        "cons": cons if cons else ["Limited comparison data available"],
        "best_for": f"Users looking for {product['category'].lower()}",
        "avoid_if": "Specific requirements not met by this product"
    }
```

## Enhanced Prompt (Alternative)
```python
# More structured prompt with examples

PROS_CONS_PROMPT_TEMPLATE = """
Compare the target product to alternatives and provide analysis:

TARGET: {target_product}
ALTERNATIVES: {alternatives}

Example output format:
{{
  "pros": [
    "30% cheaper than Brand X alternative",
    "Longer battery life (10hr vs 6hr average)",
    "Premium build quality with aluminum body"
  ],
  "cons": [
    "Heavier than competitors (1.5kg vs 1.2kg avg)",
    "Limited color options"
  ],
  "best_for": "Budget-conscious users who prioritize battery life",
  "avoid_if": "You need the lightest option for travel"
}}

Provide specific, quantitative comparisons when possible.
Return ONLY valid JSON matching the format above.
"""
```

## Testing
```python
# Test pros/cons generation
agent = ComparisonAgent()

product = {
    "id": 1,
    "name": "iPhone 15",
    "brand": "Apple",
    "price": 799,
    "category": "Smartphones",
    "description": "Latest iPhone with A17 chip"
}

competitors = [
    {"id": 2, "name": "Samsung S24", "brand": "Samsung", "price": 749},
    {"id": 3, "name": "Pixel 8", "brand": "Google", "price": 699}
]

analysis = agent._generate_pros_cons(product, [product] + competitors)
print(json.dumps(analysis, indent=2))
```

## Quality Criteria
- [ ] Pros are specific, not generic
- [ ] Cons are honest and comparative
- [ ] "Best for" is actionable
- [ ] "Avoid if" provides clear guidance
- [ ] Comparisons are quantitative when possible

## Expected Outcome
High-quality, contextual product analysis that helps users decide.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
