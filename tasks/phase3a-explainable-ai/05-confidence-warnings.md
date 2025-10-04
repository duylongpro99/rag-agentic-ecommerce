# Task 05: Add Confidence Warnings for Low-Quality Results

## Description
Implement intelligent warnings and suggestions when search results have low confidence or poor quality.

## File Location
`agentic/agents/orchestrator.py`

## Implementation Checklist

- [ ] Calculate aggregate result quality metrics
- [ ] Detect low confidence scenarios
- [ ] Generate helpful warning messages
- [ ] Suggest query improvements
- [ ] Provide alternative search strategies
- [ ] Test with various quality levels

## Implementation
```python
def _add_confidence_warnings(self, products: List[Dict], query: str) -> str:
    """Generate warnings and suggestions for low-quality results"""

    if not products:
        return self._generate_no_results_guidance(query)

    # Calculate aggregate metrics
    avg_confidence = sum(p.get("confidence_score", 0) for p in products) / len(products)
    max_confidence = max(p.get("confidence_score", 0) for p in products)
    low_confidence_count = sum(1 for p in products if p.get("confidence_score", 0) < 0.4)

    warnings = []

    # Scenario 1: All results have low confidence
    if avg_confidence < 0.4:
        warnings.append(
            "⚠️ **Low confidence matches.** These results may not closely match your query."
        )
        warnings.extend(self._suggest_query_improvements(query, products))

    # Scenario 2: No high-confidence results
    elif max_confidence < 0.6:
        warnings.append(
            "⚠️ **Moderate matches found.** Consider refining your search."
        )
        warnings.extend(self._suggest_alternatives(query))

    # Scenario 3: Mixed results with many low-confidence
    elif low_confidence_count > len(products) / 2:
        warnings.append(
            "💡 **Tip:** Top results are most relevant. Lower results may not match well."
        )

    return "\n".join(warnings) + "\n" if warnings else ""

def _generate_no_results_guidance(self, query: str) -> str:
    """Guidance when no results found"""

    suggestions = [
        "❌ **No matches found.** Try:",
        "  • Using more general terms",
        "  • Checking for typos",
        "  • Describing your use case instead of specific products",
        "  • Browsing by category"
    ]

    # Detect potential issues
    if len(query.split()) > 10:
        suggestions.append("  • Simplifying your query (it's quite long)")

    if any(char in query for char in ['!', '?', '@', '#']):
        suggestions.append("  • Removing special characters")

    return "\n".join(suggestions) + "\n"

def _suggest_query_improvements(self, query: str,
                               products: List[Dict]) -> List[str]:
    """Suggest how to improve query based on what didn't match"""

    suggestions = []

    # Analyze why confidence is low
    query_words = set(query.lower().split())

    # Check if category is mentioned
    categories = set(p.get("category", "").lower() for p in products)
    if not any(cat_word in query_words for cat_word in
               [w for cat in categories for w in cat.split()]):
        common_category = max(categories, key=lambda c:
                             sum(1 for p in products if p.get("category", "").lower() == c))
        suggestions.append(
            f"  • Try adding category: '{common_category}'"
        )

    # Check if query is too generic
    if len(query_words) <= 2:
        suggestions.append(
            "  • Add more specific details (brand, features, use case)"
        )

    # Check for very specific terms that might not exist
    rare_words = [word for word in query_words if len(word) > 12]
    if rare_words:
        suggestions.append(
            f"  • Try simpler alternatives to: {', '.join(rare_words)}"
        )

    if suggestions:
        suggestions.insert(0, "💡 **Suggestions:**")

    return suggestions

def _suggest_alternatives(self, query: str) -> List[str]:
    """Suggest alternative search strategies"""

    suggestions = ["💡 **Try:**"]

    # Suggest browsing by category
    suggestions.append("  • Browse by category instead")

    # Suggest using filters
    if any(word in query.lower() for word in ['under', 'below', '$', 'cheap', 'expensive']):
        suggestions.append("  • Use price filters for better results")

    # Suggest describing use case
    if not any(word in query.lower() for word in ['for', 'to', 'use']):
        suggestions.append("  • Describe what you'll use it for")

    return suggestions
```

## Integration into Response Generation
```python
def _generate_response(self, state: AgentState) -> AgentState:
    """Generate response with warnings"""
    query = state["user_query"]
    products = json.loads(state["search_results"])

    response_parts = []

    # Add warnings/suggestions at the top
    warning = self._add_confidence_warnings(products, query)
    if warning:
        response_parts.append(warning)

    # ... rest of response generation

    state["final_response"] = "\n".join(response_parts)
    return state
```

## Example Warnings

### Low Confidence
```
⚠️ Low confidence matches. These results may not closely match your query.
💡 Suggestions:
  • Try adding category: 'electronics'
  • Add more specific details (brand, features, use case)
```

### No Results
```
❌ No matches found. Try:
  • Using more general terms
  • Checking for typos
  • Describing your use case instead of specific products
  • Browsing by category
  • Simplifying your query (it's quite long)
```

### Mixed Quality
```
💡 Tip: Top results are most relevant. Lower results may not match well.
```

## Testing Scenarios
- [ ] Query with no results
- [ ] Query with all low confidence results
- [ ] Query with mixed confidence
- [ ] Very long query (>10 words)
- [ ] Very short query (<2 words)
- [ ] Query with typos
- [ ] Query with rare technical terms

## Expected Outcome
Helpful guidance that improves user search success rate.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
