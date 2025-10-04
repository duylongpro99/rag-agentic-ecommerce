# Task 11: Test Comparison Queries

## Description
Comprehensive testing of the comparison workflow with various product types and query patterns.

## Implementation Checklist

### Basic Comparison Tests
- [ ] Test 2-product comparison
- [ ] Test 3-product comparison
- [ ] Test 4+ product comparison
- [ ] Test same-brand comparison
- [ ] Test cross-brand comparison

### Query Patterns
- [ ] "compare X vs Y"
- [ ] "X or Y?"
- [ ] "difference between X and Y"
- [ ] "which is better: X or Y?"
- [ ] "X versus Y versus Z"

### Product Categories
- [ ] Compare smartphones
- [ ] Compare laptops
- [ ] Compare headphones
- [ ] Compare monitors
- [ ] Compare shoes

### Edge Cases
- [ ] Product not found
- [ ] Only 1 product found
- [ ] Identical products
- [ ] Products in different categories

## Test Cases
```python
comparison_test_cases = [
    # Basic 2-product comparisons
    {
        "query": "compare iPhone 15 vs Samsung S24",
        "expected_products": 2,
        "expected_mode": "comparison",
        "description": "Standard comparison query"
    },

    # 3-product comparison
    {
        "query": "compare iPhone 15 vs Samsung S24 vs Pixel 8",
        "expected_products": 3,
        "expected_mode": "comparison",
        "description": "Three-way comparison"
    },

    # Alternative phrasing
    {
        "query": "iPhone 15 or Samsung S24?",
        "expected_products": 2,
        "expected_mode": "comparison",
        "description": "Question format"
    },

    # Different category
    {
        "query": "compare MacBook Pro vs Dell XPS",
        "expected_products": 2,
        "expected_mode": "comparison",
        "description": "Laptop comparison"
    },

    # Edge case: product not found
    {
        "query": "compare XYZ123 vs ABC456",
        "expected_products": 0,
        "expected_mode": "comparison",
        "description": "Non-existent products",
        "should_error": True
    }
]

def run_comparison_tests():
    """Execute all comparison test cases"""
    orchestrator = OrchestratorAgent()

    results = {
        "passed": 0,
        "failed": 0,
        "errors": []
    }

    for i, test in enumerate(comparison_test_cases, 1):
        print(f"\n{'='*60}")
        print(f"Test {i}: {test['description']}")
        print(f"Query: {test['query']}")
        print(f"{'='*60}")

        try:
            # Run query through orchestrator
            state = {
                "user_query": test["query"],
                "thinks": [],
                "messages": []
            }

            # Execute workflow
            final_state = orchestrator.graph.invoke(state)

            # Parse results
            search_results = json.loads(final_state.get("search_results", "{}"))

            # Validate
            if test.get("should_error"):
                if "error" in search_results:
                    print("✅ PASS: Error handled correctly")
                    results["passed"] += 1
                else:
                    print("❌ FAIL: Should have errored but didn't")
                    results["failed"] += 1

            else:
                products = search_results.get("products", [])
                product_count = len(products)

                if product_count == test["expected_products"]:
                    print(f"✅ PASS: Found {product_count} products as expected")
                    results["passed"] += 1

                    # Print comparison summary
                    response = final_state.get("final_response", "")
                    print(f"\nResponse preview:\n{response[:300]}...")

                else:
                    print(f"❌ FAIL: Expected {test['expected_products']} products, got {product_count}")
                    results["failed"] += 1
                    results["errors"].append({
                        "test": test["description"],
                        "error": f"Product count mismatch"
                    })

        except Exception as e:
            print(f"❌ ERROR: {str(e)}")
            results["failed"] += 1
            results["errors"].append({
                "test": test["description"],
                "error": str(e)
            })

    # Summary
    print(f"\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Passed: {results['passed']}/{len(comparison_test_cases)}")
    print(f"Failed: {results['failed']}/{len(comparison_test_cases)}")

    if results["errors"]:
        print("\nErrors:")
        for error in results["errors"]:
            print(f"  - {error['test']}: {error['error']}")

    return results

if __name__ == "__main__":
    results = run_comparison_tests()
```

## Manual Testing
```bash
# Test via API
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "compare iPhone 15 vs Samsung S24", "user_id": 1}'

# Expected response should include:
# - Comparison table
# - Pros/cons for each
# - Category winners
# - Recommendations
```

## Validation Criteria
- [ ] All products found and compared
- [ ] Comparison table displays correctly
- [ ] Pros/cons are relevant and specific
- [ ] Winners make logical sense
- [ ] Recommendations are actionable
- [ ] Response is well-formatted
- [ ] Response time < 5 seconds

## Expected Outcome
All comparison queries work reliably across product categories.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
