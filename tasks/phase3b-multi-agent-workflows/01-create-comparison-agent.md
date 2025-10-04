# Task 01: Create ComparisonAgent

## Description
Build a specialized agent that handles product comparison queries with structured analysis.

## File Location
`agentic/agents/specialized/comparison_agent.py` (new file)

## Implementation Checklist

- [ ] Create `agentic/agents/specialized/` directory
- [ ] Create `comparison_agent.py`
- [ ] Implement `ComparisonAgent` class
- [ ] Add `compare_products()` method
- [ ] Implement comparison data structure
- [ ] Extract comparable attributes
- [ ] Identify unique features per product
- [ ] Determine winners by category
- [ ] Generate overall recommendation
- [ ] Test with 2-3 product comparisons

## Implementation
```python
# agentic/agents/specialized/comparison_agent.py

from typing import List, Dict, Any
import json
from agentic.factory.llm_model import LLMModel
from agentic.database.connection import get_db
from agentic.database.models import Product

class ComparisonAgent:
    """Specialized agent for product comparisons"""

    def __init__(self):
        self.llm = LLMModel.get_model()

    def compare_products(self, product_ids: List[int]) -> Dict[str, Any]:
        """
        Generate structured comparison of products.

        Args:
            product_ids: List of product IDs to compare

        Returns:
            Dict with comparison data including:
            - common_attributes
            - unique_features
            - winner_by_category
            - recommendations
            - pros_cons for each product
        """

        # Fetch products from database
        products = self._fetch_products(product_ids)

        if not products:
            return {"error": "No products found for comparison"}

        if len(products) < 2:
            return {"error": "Need at least 2 products to compare"}

        # Build comparison structure
        comparison = {
            "products": products,
            "common_attributes": self._extract_common_attributes(products),
            "unique_features": self._extract_unique_features(products),
            "comparison_table": self._build_comparison_table(products),
            "winner_by_category": self._determine_winners(products),
            "recommendations": self._generate_recommendations(products),
            "detailed_analysis": {}
        }

        # Generate pros/cons for each product
        for product in products:
            analysis = self._generate_pros_cons(product, products)
            comparison["detailed_analysis"][product["id"]] = analysis

        return comparison

    def _fetch_products(self, product_ids: List[int]) -> List[Dict]:
        """Fetch product data from database"""
        db = next(get_db())

        products = db.query(Product).filter(Product.id.in_(product_ids)).all()

        return [
            {
                "id": p.id,
                "name": p.name,
                "brand": p.brand,
                "category": p.category,
                "description": p.description,
                "price": float(p.price),
                "usage": p.usage,
                "imageUrl": p.imageUrl
            }
            for p in products
        ]

    def _extract_common_attributes(self, products: List[Dict]) -> List[str]:
        """Find attributes present in all products"""

        # Basic common attributes
        common = ["name", "brand", "category", "price"]

        # Check if all have descriptions
        if all(p.get("description") for p in products):
            common.append("description")

        if all(p.get("usage") for p in products):
            common.append("usage")

        return common

    def _extract_unique_features(self, products: List[Dict]) -> Dict[int, List[str]]:
        """
        Identify unique features for each product using LLM.

        Returns:
            Dict mapping product_id to list of unique features
        """

        unique_features = {}

        for product in products:
            # Get other products for comparison
            others = [p for p in products if p["id"] != product["id"]]

            prompt = f"""
Compare this product to the alternatives and identify 3-5 unique features or advantages:

Product: {product['name']}
Description: {product.get('description', 'N/A')}
Price: ${product['price']}
Brand: {product['brand']}

Alternatives:
{json.dumps([{"name": p['name'], "price": p['price'], "brand": p['brand']} for p in others], indent=2)}

Return ONLY a JSON array of unique features/advantages:
["feature 1", "feature 2", "feature 3"]
"""

            response = self.llm.invoke(prompt)

            try:
                features = json.loads(response.content)
                unique_features[product["id"]] = features
            except:
                unique_features[product["id"]] = ["Unable to extract features"]

        return unique_features

    def _build_comparison_table(self, products: List[Dict]) -> Dict[str, List[Any]]:
        """Build attribute comparison table"""

        table = {
            "Product": [p["name"] for p in products],
            "Brand": [p["brand"] for p in products],
            "Price": [f"${p['price']}" for p in products],
            "Category": [p["category"] for p in products]
        }

        return table

    def _determine_winners(self, products: List[Dict]) -> Dict[str, Dict]:
        """Determine which product wins in each category"""

        winners = {}

        # Price winner (cheapest)
        cheapest = min(products, key=lambda p: p["price"])
        winners["best_value"] = {
            "product_id": cheapest["id"],
            "product_name": cheapest["name"],
            "reason": f"Lowest price at ${cheapest['price']}"
        }

        # Most expensive (premium)
        most_expensive = max(products, key=lambda p: p["price"])
        winners["premium_option"] = {
            "product_id": most_expensive["id"],
            "product_name": most_expensive["name"],
            "reason": f"Premium option at ${most_expensive['price']}"
        }

        return winners

    def _generate_recommendations(self, products: List[Dict]) -> Dict[str, Any]:
        """Generate overall recommendations using LLM"""

        prompt = f"""
Analyze these products and provide recommendations:

Products:
{json.dumps(products, indent=2)}

Return JSON with:
{{
  "best_overall": {{"product_id": int, "reason": "why"}},
  "best_for_budget": {{"product_id": int, "reason": "why"}},
  "best_for_quality": {{"product_id": int, "reason": "why"}}
}}
"""

        response = self.llm.invoke(prompt)

        try:
            return json.loads(response.content)
        except:
            return {"error": "Unable to generate recommendations"}

    def _generate_pros_cons(self, product: Dict,
                           all_products: List[Dict]) -> Dict[str, Any]:
        """Generate pros/cons for a product (implemented in next task)"""
        # Placeholder - will implement in task 02
        return {
            "pros": [],
            "cons": [],
            "best_for": "",
            "avoid_if": ""
        }
```

## Testing
```python
# Test the comparison agent
if __name__ == "__main__":
    agent = ComparisonAgent()

    # Compare products with IDs 1, 2, 3
    result = agent.compare_products([1, 2, 3])

    print(json.dumps(result, indent=2))
```

## Expected Outcome
Functional comparison agent that structures product comparisons.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
