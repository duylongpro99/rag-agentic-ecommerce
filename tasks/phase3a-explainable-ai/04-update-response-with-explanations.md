# Task 04: Update Response Generation with Explanations

## Description
Modify response generation to include confidence indicators, match explanations, and supporting evidence.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Update `_generate_response()` to use provenance data
- [ ] Add confidence emoji indicators
- [ ] Include match reasons in product descriptions
- [ ] Show supporting quotes when available
- [ ] Format explanations user-friendly
- [ ] Test with various confidence levels
- [ ] Ensure explanations don't overwhelm response

## Enhanced Response Generation
```python
def _generate_response(self, state: AgentState) -> AgentState:
    """Generate response with explanations and confidence"""
    query = state["user_query"]
    products = json.loads(state["search_results"])

    if not products:
        state["final_response"] = "No products found matching your query."
        return state

    # Build response with explanations
    response_parts = []

    # Add overall search quality warning if needed
    avg_confidence = sum(p.get("confidence_score", 0) for p in products) / len(products)
    if avg_confidence < 0.5:
        response_parts.append(
            "⚠️ **Low confidence results.** Try refining your query with more specific details.\n"
        )

    response_parts.append(f"Found {len(products)} products:\n")

    for i, product in enumerate(products, 1):
        # Confidence indicator
        confidence = product.get("confidence_score", 0)
        confidence_emoji = product.get("confidence_emoji", "")
        tier = product.get("confidence_tier", "unknown")

        # Product header with confidence
        response_parts.append(
            f"\n{i}. {confidence_emoji} **{product['name']}** by {product['brand']}"
        )
        response_parts.append(
            f"   Price: ${product['price']} | Confidence: {confidence:.0%} ({tier})"
        )

        # Add match reasons (provenance)
        provenance = product.get("provenance", {})
        match_reasons = provenance.get("match_reasons", [])

        if match_reasons and len(match_reasons) > 0:
            response_parts.append("   ✓ **Why recommended:**")
            for reason in match_reasons[:3]:  # Show top 3 reasons
                response_parts.append(f"     • {reason}")

        # Add supporting evidence (quotes)
        evidence = provenance.get("supporting_evidence", [])
        if evidence and len(evidence) > 0:
            response_parts.append(f'   📝 *"{evidence[0]}"*')

        # Intelligence insights (if available)
        if product.get("is_good_deal"):
            response_parts.append(
                f"   💰 Great deal! {abs(product['price_vs_avg']):.0f}% below average"
            )

        if product.get("stock_level") == "low":
            response_parts.append("   ⚠️ Low stock - order soon!")

        # Category
        response_parts.append(f"   Category: {product['category']}\n")

    state["final_response"] = "\n".join(response_parts)
    return state
```

## Example Output
```
Found 3 products:

1. 🟢 **Nike Air Zoom Pegasus** by Nike
   Price: $119.99 | Confidence: 87% (high)
   ✓ Why recommended:
     • Strong semantic match (similarity: 0.85)
     • Matches keywords: running, shoes, comfortable
     • Category match: Running Shoes
   📝 "Designed for marathon training with responsive cushioning"
   Category: Running Shoes

2. 🟡 **Adidas Ultraboost** by Adidas
   Price: $180.00 | Confidence: 62% (medium)
   ✓ Why recommended:
     • Moderate semantic match (similarity: 0.68)
     • Category match: Running Shoes
   💰 Great deal! 15% below average
   ⚠️ Low stock - order soon!
   Category: Running Shoes

3. 🔴 **Puma RS-X** by Puma
   Price: $110.00 | Confidence: 35% (low)
   ✓ Why recommended:
     • Matches keywords: shoes
   Category: Sneakers
```

## Confidence-Based Filtering
```python
def _filter_low_confidence_results(self, products: List[Dict],
                                   min_confidence: float = 0.3) -> List[Dict]:
    """Remove very low confidence results"""
    return [p for p in products if p.get("confidence_score", 0) >= min_confidence]
```

## User Feedback Integration (Optional)
```python
# Add feedback mechanism to improve confidence calibration
def record_user_feedback(self, product_id: int, query: str,
                        was_relevant: bool, confidence: float):
    """Track if high confidence matched user perception"""
    # Store in SearchAudit table for analysis
    pass
```

## Testing
- [ ] Test with high confidence results
- [ ] Test with low confidence results
- [ ] Test with mixed confidence levels
- [ ] Verify explanations are helpful
- [ ] Check response length is reasonable

## Expected Outcome
Transparent, explainable search results that build user trust.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
