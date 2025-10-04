# Task 06: Update Response Generation with Intelligence Insights

## Description
Modify the response generation to include intelligence insights like price alerts, stock warnings, and trending badges.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Update `_generate_response()` method
- [ ] Add intelligence badges to product descriptions
- [ ] Include price drop alerts
- [ ] Add stock urgency warnings
- [ ] Show trending indicators
- [ ] Format intelligence data user-friendly
- [ ] Add smart insights section
- [ ] Test with various intelligence scenarios
- [ ] Ensure intelligence data doesn't overwhelm response

## Enhanced Response Generation
```python
def _generate_response(self, state: AgentState) -> AgentState:
    """Generate response with intelligence insights"""
    query = state["user_query"]
    products = json.loads(state["search_results"])

    if not products:
        state["final_response"] = "No products found matching your query."
        return state

    # Collect smart insights
    insights = self._generate_smart_insights(products)

    # Build response with intelligence
    response_parts = []

    # Add insights header if any
    if insights:
        response_parts.append("💡 **Smart Insights:**")
        for insight in insights[:3]:  # Top 3 insights
            response_parts.append(f"   {insight}")
        response_parts.append("")

    # Add product results
    response_parts.append(f"Found {len(products)} products:\n")

    for i, product in enumerate(products, 1):
        # Product name with intelligence badges
        badges = self._get_intelligence_badges(product)
        product_line = f"{i}. **{product['name']}** {badges}"
        response_parts.append(product_line)

        # Price with intelligence
        price_info = f"   ${product['price']}"
        if product.get("is_good_deal"):
            price_vs_avg = product.get("price_vs_avg", 0)
            price_info += f" 💰 **Great deal!** ({abs(price_vs_avg):.0f}% below average)"
        response_parts.append(price_info)

        # Stock info
        stock_level = product.get("stock_level", "unknown")
        if stock_level == "low":
            response_parts.append("   ⚠️ **Low stock** - Order soon!")
        elif stock_level == "out_of_stock":
            response_parts.append("   ❌ Out of stock")

        # Category and brand
        response_parts.append(f"   {product['brand']} | {product['category']}")
        response_parts.append("")

    state["final_response"] = "\n".join(response_parts)
    return state

def _generate_smart_insights(self, products: List[Dict]) -> List[str]:
    """Generate actionable insights from intelligence data"""
    insights = []

    for product in products:
        # Price drop insight
        if product.get("is_good_deal"):
            insights.append(
                f"💰 {product['name']} is {abs(product['price_vs_avg']):.0f}% "
                f"below its average price"
            )

        # Trending insight
        if product.get("is_trending"):
            popularity = product.get("popularity_score", 0)
            insights.append(
                f"🔥 {product['name']} is trending with {popularity} recent views"
            )

        # Urgency insight (low stock + trending)
        if (product.get("stock_level") == "low" and
            product.get("is_trending")):
            insights.append(
                f"⚡ {product['name']} has limited stock and high demand - act fast!"
            )

        # Price history insight
        if product.get("lowest_price_90d"):
            current = product["price"]
            lowest = product["lowest_price_90d"]
            if current == lowest:
                insights.append(
                    f"📉 {product['name']} is at its lowest price in 90 days"
                )

    return insights

def _get_intelligence_badges(self, product: Dict) -> str:
    """Get emoji badges for product"""
    badges = []

    if product.get("is_trending"):
        badges.append("🔥")

    if product.get("is_good_deal"):
        badges.append("💰")

    stock_level = product.get("stock_level")
    if stock_level == "low":
        badges.append("⚠️")
    elif stock_level == "out_of_stock":
        badges.append("❌")

    return " ".join(badges)
```

## Example Response
```
💡 Smart Insights:
   💰 Nike Air Zoom Pegasus is 25% below its average price
   🔥 Adidas Ultraboost is trending with 245 recent views
   ⚡ New Balance 990v5 has limited stock and high demand - act fast!

Found 3 products:

1. **Nike Air Zoom Pegasus** 🔥 💰
   $89.99 💰 **Great deal!** (25% below average)
   Nike | Running Shoes

2. **Adidas Ultraboost** 🔥
   $129.99
   ⚠️ **Low stock** - Order soon!
   Adidas | Running Shoes

3. **New Balance 990v5**
   $174.99
   New Balance | Running Shoes
```

## Testing
- [ ] Test with good deal products
- [ ] Test with trending products
- [ ] Test with low stock products
- [ ] Test with combination of intelligence flags
- [ ] Verify insights are relevant and helpful

## Expected Outcome
Responses include actionable intelligence insights that help users make purchase decisions.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
