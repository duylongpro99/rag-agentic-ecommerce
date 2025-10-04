# Task 10: Design Comparison Response Templates

## Description
Create formatted response templates for product comparison results with tables and structured analysis.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Design comparison table format
- [ ] Create pros/cons template
- [ ] Add winner badges
- [ ] Format recommendations
- [ ] Test with various product counts (2, 3, 4+)

## Comparison Response Template
```python
def _format_comparison_response(self, comparison: Dict) -> str:
    """Format comparison results for user display"""

    if "error" in comparison:
        return f"❌ {comparison['error']}"

    products = comparison.get("products", [])

    if len(products) < 2:
        return "Not enough products to compare."

    response_parts = []

    # Header
    response_parts.append(f"📊 **Product Comparison** ({len(products)} products)\n")

    # Comparison table
    response_parts.append(self._build_comparison_table_text(comparison))

    # Winners section
    winners = comparison.get("winner_by_category", {})
    if winners:
        response_parts.append("\n🏆 **Category Winners:**")
        for category, winner in winners.items():
            response_parts.append(
                f"  • **{category.replace('_', ' ').title()}**: "
                f"{winner['product_name']} - {winner['reason']}"
            )

    # Detailed analysis for each product
    response_parts.append("\n📝 **Detailed Analysis:**\n")

    for i, product in enumerate(products, 1):
        product_id = product["id"]
        analysis = comparison.get("detailed_analysis", {}).get(product_id, {})

        response_parts.append(f"**{i}. {product['name']}** (${product['price']})")

        # Pros
        pros = analysis.get("pros", [])
        if pros:
            response_parts.append("  ✅ **Pros:**")
            for pro in pros[:3]:  # Top 3 pros
                response_parts.append(f"    • {pro}")

        # Cons
        cons = analysis.get("cons", [])
        if cons:
            response_parts.append("  ❌ **Cons:**")
            for con in cons[:2]:  # Top 2 cons
                response_parts.append(f"    • {con}")

        # Best for
        best_for = analysis.get("best_for", "")
        if best_for:
            response_parts.append(f"  💡 **Best for:** {best_for}")

        response_parts.append("")  # Blank line

    # Final recommendation
    recommendations = comparison.get("recommendations", {})
    if recommendations:
        response_parts.append("🎯 **Recommendations:**")

        if "best_overall" in recommendations:
            best = recommendations["best_overall"]
            product_name = next(
                (p["name"] for p in products if p["id"] == best.get("product_id")),
                "Unknown"
            )
            response_parts.append(
                f"  • **Best Overall**: {product_name} - {best.get('reason', '')}"
            )

        if "best_for_budget" in recommendations:
            budget = recommendations["best_for_budget"]
            product_name = next(
                (p["name"] for p in products if p["id"] == budget.get("product_id")),
                "Unknown"
            )
            response_parts.append(
                f"  • **Best Value**: {product_name} - {budget.get('reason', '')}"
            )

    return "\n".join(response_parts)

def _build_comparison_table_text(self, comparison: Dict) -> str:
    """Build text-based comparison table"""

    table = comparison.get("comparison_table", {})
    products = comparison.get("products", [])

    if not table:
        return ""

    lines = []
    lines.append("```")
    lines.append("Specification  | " + " | ".join(p["name"][:15] for p in products))
    lines.append("-" * 80)

    # Add table rows
    for spec, values in table.items():
        if spec != "Product":  # Skip product row
            row = f"{spec:14} | " + " | ".join(str(v)[:15] for v in values)
            lines.append(row)

    lines.append("```\n")

    return "\n".join(lines)
```

## Example Output
```
📊 **Product Comparison** (3 products)

```
Specification  | iPhone 15       | Samsung S24     | Pixel 8
--------------------------------------------------------------------------------
Brand          | Apple           | Samsung         | Google
Price          | $799            | $799            | $699
Category       | Smartphones     | Smartphones     | Smartphones
```

🏆 **Category Winners:**
  • **Best Value**: Pixel 8 - Lowest price at $699
  • **Premium Option**: iPhone 15 - Premium option at $799

📝 **Detailed Analysis:**

**1. iPhone 15** ($799)
  ✅ **Pros:**
    • Latest A17 chip offers superior performance
    • Best-in-class camera system
    • Seamless ecosystem integration for Apple users
  ❌ **Cons:**
    • Higher price point than Pixel
    • Limited customization compared to Android
  💡 **Best for:** Users invested in Apple ecosystem who prioritize camera quality

**2. Samsung S24** ($799)
  ✅ **Pros:**
    • Versatile camera with telephoto lens
    • Larger battery capacity (5000mAh)
    • S Pen support for productivity
  ❌ **Cons:**
    • Bloatware pre-installed
    • One UI can feel heavy
  💡 **Best for:** Power users who want maximum features and battery life

**3. Pixel 8** ($699)
  ✅ **Pros:**
    • Best value for money ($100 cheaper)
    • Stock Android experience
    • Excellent AI features (Magic Eraser, Call Screening)
  ❌ **Cons:**
    • Smaller battery than Samsung
    • Tensor chip lags behind Snapdragon in benchmarks
  💡 **Best for:** Budget-conscious users who want pure Android and AI features

🎯 **Recommendations:**
  • **Best Overall**: iPhone 15 - Superior performance and camera quality
  • **Best Value**: Pixel 8 - Excellent features at lowest price
```

## Testing
```python
# Test comparison formatting
comparison_data = {
    "products": [
        {"id": 1, "name": "iPhone 15", "price": 799, "brand": "Apple"},
        {"id": 2, "name": "Samsung S24", "price": 799, "brand": "Samsung"},
        {"id": 3, "name": "Pixel 8", "price": 699, "brand": "Google"}
    ],
    "comparison_table": {
        "Product": ["iPhone 15", "Samsung S24", "Pixel 8"],
        "Price": ["$799", "$799", "$699"],
        "Brand": ["Apple", "Samsung", "Google"]
    },
    # ... rest of comparison data
}

formatted = orchestrator._format_comparison_response(comparison_data)
print(formatted)
```

## Expected Outcome
Clear, structured comparison responses that help users decide.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
