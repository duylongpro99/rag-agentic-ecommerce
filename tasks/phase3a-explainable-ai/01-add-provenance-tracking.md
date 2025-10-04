# Task 01: Add Provenance Metadata to Search Results

## Description
Update SemanticSearchTool to return provenance metadata explaining WHY each product was recommended.

## File Location
`agentic/tools/semantic_search.py`

## Implementation Checklist

- [ ] Create `search_products_with_provenance()` method
- [ ] Calculate match reasons for each product
- [ ] Track semantic similarity contribution
- [ ] Track keyword overlap contribution
- [ ] Track category/brand match contribution
- [ ] Store provenance in result dictionary
- [ ] Add supporting evidence extraction
- [ ] Test with various query types

## Implementation
```python
def search_products_with_provenance(self, query: str, top_k: int = 5) -> List[Dict]:
    """Search with explainability metadata"""

    # Get base results from multi-aspect search
    products = self.multi_aspect_search(query, top_k)

    # Add provenance for each product
    for product in products:
        provenance = self._build_provenance(query, product)
        product["provenance"] = provenance

    return products

def _build_provenance(self, query: str, product: Dict) -> Dict:
    """Build explainability data for a product match"""

    provenance = {
        "match_reasons": [],
        "confidence_breakdown": {},
        "supporting_evidence": []
    }

    # Semantic match strength
    similarity = product.get("similarity_score", 0)
    if similarity > 0.8:
        provenance["match_reasons"].append(
            f"Strong semantic match (similarity: {similarity:.2f})"
        )
    elif similarity > 0.6:
        provenance["match_reasons"].append(
            f"Moderate semantic match (similarity: {similarity:.2f})"
        )

    provenance["confidence_breakdown"]["semantic"] = similarity

    # Keyword overlap analysis
    query_tokens = set(query.lower().split())
    product_text = f"{product['name']} {product.get('description', '')}"
    product_tokens = set(product_text.lower().split())

    overlap = query_tokens & product_tokens
    if overlap:
        provenance["match_reasons"].append(
            f"Matches keywords: {', '.join(list(overlap)[:3])}"
        )
        keyword_score = len(overlap) / max(len(query_tokens), 1)
        provenance["confidence_breakdown"]["keyword"] = keyword_score

    # Category match
    if any(token in product.get('category', '').lower()
           for token in query_tokens):
        provenance["match_reasons"].append(
            f"Category match: {product['category']}"
        )
        provenance["confidence_breakdown"]["category"] = 1.0

    # Brand match
    if any(token in product.get('brand', '').lower()
           for token in query_tokens):
        provenance["match_reasons"].append(
            f"Brand match: {product['brand']}"
        )
        provenance["confidence_breakdown"]["brand"] = 1.0

    # Aspect-specific scores (from multi-aspect search)
    if "aspect_scores" in product:
        asp_scores = product["aspect_scores"]
        if asp_scores.get("usage", 0) > 0.7:
            provenance["match_reasons"].append(
                f"Strong usage match (score: {asp_scores['usage']:.2f})"
            )
        if asp_scores.get("features", 0) > 0.7:
            provenance["match_reasons"].append(
                f"Strong feature match (score: {asp_scores['features']:.2f})"
            )

    # Extract supporting quotes
    provenance["supporting_evidence"] = self._extract_supporting_quotes(
        query, product.get("description", "")
    )

    return provenance

def _extract_supporting_quotes(self, query: str, description: str) -> List[str]:
    """Extract relevant quotes from description"""

    if not description or len(description) < 20:
        return []

    # Simple extraction: sentences containing query words
    import re
    sentences = re.split(r'[.!?]+', description)
    query_words = set(query.lower().split())

    relevant_sentences = []
    for sentence in sentences:
        sentence = sentence.strip()
        if len(sentence) < 10:
            continue

        sentence_words = set(sentence.lower().split())
        if query_words & sentence_words:  # Has overlap
            # Truncate if too long
            if len(sentence) > 100:
                sentence = sentence[:97] + "..."
            relevant_sentences.append(sentence)

    return relevant_sentences[:2]  # Return max 2 quotes
```

## Testing
```python
# Test provenance
tool = SemanticSearchTool()
results = tool.search_products_with_provenance("waterproof running shoes", top_k=3)

for product in results:
    print(f"\n{product['name']}")
    print(f"Provenance: {product['provenance']}")
```

## Expected Outcome
Each product has detailed provenance explaining why it matched.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
