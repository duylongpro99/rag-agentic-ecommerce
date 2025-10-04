# Task 02: Implement Confidence Scoring Algorithm

## Description
Create a comprehensive confidence scoring system that combines semantic, keyword, category, and contextual signals.

## File Location
`agentic/tools/semantic_search.py`

## Implementation Checklist

- [ ] Design confidence scoring formula
- [ ] Weight different signal types appropriately
- [ ] Calculate overall confidence per product
- [ ] Add confidence tiers (high/medium/low)
- [ ] Normalize scores to 0-1 range
- [ ] Test scoring accuracy
- [ ] Validate against manual relevance judgments

## Scoring Algorithm
```python
def _calculate_confidence_score(self, provenance: Dict, product: Dict) -> float:
    """
    Calculate overall confidence score from multiple signals.

    Weights:
    - Semantic similarity: 50%
    - Keyword overlap: 25%
    - Category/brand match: 15%
    - Aspect-specific scores: 10%
    """

    confidence_breakdown = provenance["confidence_breakdown"]

    # Base semantic score
    semantic_score = confidence_breakdown.get("semantic", 0) * 0.50

    # Keyword overlap score
    keyword_score = confidence_breakdown.get("keyword", 0) * 0.25

    # Category/brand boost
    category_score = confidence_breakdown.get("category", 0) * 0.10
    brand_score = confidence_breakdown.get("brand", 0) * 0.05

    # Aspect-specific boost (if available)
    aspect_boost = 0
    if "aspect_scores" in product:
        asp = product["aspect_scores"]
        # Take max aspect score as indicator
        max_aspect = max(asp.values()) if asp else 0
        aspect_boost = max_aspect * 0.10

    # Combine all scores
    total_confidence = (
        semantic_score +
        keyword_score +
        category_score +
        brand_score +
        aspect_boost
    )

    # Normalize to [0, 1]
    return min(1.0, max(0.0, total_confidence))

def _get_confidence_tier(self, confidence: float) -> str:
    """Categorize confidence into tiers"""
    if confidence >= 0.7:
        return "high"
    elif confidence >= 0.4:
        return "medium"
    else:
        return "low"

def _get_confidence_emoji(self, confidence: float) -> str:
    """Visual confidence indicator"""
    if confidence >= 0.7:
        return "🟢"  # High confidence
    elif confidence >= 0.4:
        return "🟡"  # Medium confidence
    else:
        return "🔴"  # Low confidence
```

## Update search_products_with_provenance
```python
def search_products_with_provenance(self, query: str, top_k: int = 5) -> List[Dict]:
    """Search with explainability and confidence"""

    products = self.multi_aspect_search(query, top_k)

    for product in products:
        # Build provenance
        provenance = self._build_provenance(query, product)
        product["provenance"] = provenance

        # Calculate confidence
        confidence = self._calculate_confidence_score(provenance, product)
        product["confidence_score"] = confidence
        product["confidence_tier"] = self._get_confidence_tier(confidence)
        product["confidence_emoji"] = self._get_confidence_emoji(confidence)

    # Sort by confidence
    products.sort(key=lambda p: p["confidence_score"], reverse=True)

    return products
```

## Confidence Calibration
- [ ] Collect manual relevance judgments for 100 queries
- [ ] Calculate correlation between confidence and relevance
- [ ] Adjust weights to maximize correlation
- [ ] Validate on holdout test set

## Testing
```python
# Test confidence scoring
results = tool.search_products_with_provenance("laptop for gaming", top_k=5)

for product in results:
    conf = product["confidence_score"]
    tier = product["confidence_tier"]
    print(f"{product['name']}: {conf:.2%} ({tier})")
```

## Expected Outcome
Reliable confidence scores that correlate with actual relevance.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
