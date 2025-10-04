# Task 12: Test Multi-Step Research Queries

## Description
Comprehensive testing of the research workflow with complex multi-step queries.

## Implementation Checklist

### Basic Research Tests
- [ ] Test "find + compare top N" queries
- [ ] Test "find + filter + compare" queries
- [ ] Test sequential step queries
- [ ] Test budget-constrained research

### Research Patterns
- [ ] "find X, compare top 3"
- [ ] "best X for Y under $Z"
- [ ] "show me X, then filter for Y, sort by price"
- [ ] "I need X, first show options, then compare"

### Complexity Levels
- [ ] 2-step research
- [ ] 3-step research
- [ ] 4+ step research

### Error Handling
- [ ] No results found in step 1
- [ ] Filter eliminates all results
- [ ] Invalid step in plan

## Test Cases
```python
research_test_cases = [
    # Basic 2-step research
    {
        "query": "find laptops for video editing, compare top 3",
        "expected_steps": 2,
        "description": "Find and compare",
        "expected_actions": ["search", "compare"]
    },

    # 3-step with filter
    {
        "query": "find gaming laptops under $1500, compare top 3",
        "expected_steps": 3,
        "description": "Find, filter by price, compare",
        "expected_actions": ["search", "filter", "compare"]
    },

    # 4-step complex
    {
        "query": "find running shoes, filter for waterproof, sort by price, show me top 5",
        "expected_steps": 4,
        "description": "Multi-step with sort",
        "expected_actions": ["search", "filter", "analyze", "summarize"]
    },

    # Use case research
    {
        "query": "best headphones for swimming under $200",
        "expected_steps": 3,
        "description": "Use case + budget constraint",
        "expected_actions": ["search", "filter", "summarize"]
    },

    # Edge case: very complex
    {
        "query": "I need a laptop, first show me options for video editing, then filter for 16GB RAM minimum, under $2000, compare the top 3",
        "expected_steps": 4,
        "description": "Complex multi-step",
        "expected_actions": ["search", "filter", "filter", "compare"]
    }
]

def run_research_tests():
    """Execute all research test cases"""
    orchestrator = OrchestratorAgent()

    results = {
        "passed": 0,
        "failed": 0,
        "errors": [],
        "step_details": []
    }

    for i, test in enumerate(research_test_cases, 1):
        print(f"\n{'='*60}")
        print(f"Test {i}: {test['description']}")
        print(f"Query: {test['query']}")
        print(f"{'='*60}")

        try:
            # Run query
            state = {
                "user_query": test["query"],
                "thinks": [],
                "messages": []
            }

            final_state = orchestrator.graph.invoke(state)
            search_results = json.loads(final_state.get("search_results", "{}"))

            # Validate plan
            plan = search_results.get("plan", {})
            steps = plan.get("steps", [])

            print(f"\n📋 Research Plan: {len(steps)} steps")
            for step in steps:
                print(f"  {step['id']}: {step['type']} - {step['action']}")

            # Check step count
            step_count_match = len(steps) >= test["expected_steps"] - 1  # Allow ±1
            if step_count_match:
                print(f"✅ Step count OK: {len(steps)} steps")
            else:
                print(f"⚠️ Step count off: Expected ~{test['expected_steps']}, got {len(steps)}")

            # Check step types
            step_types = [s["type"] for s in steps]
            has_expected_actions = all(
                action in step_types for action in test["expected_actions"][:2]  # At least first 2
            )

            if has_expected_actions:
                print(f"✅ Step types OK: {step_types}")
            else:
                print(f"⚠️ Missing expected actions. Got: {step_types}")

            # Check final synthesis
            synthesis = search_results.get("synthesis", "")
            if synthesis and len(synthesis) > 50:
                print(f"✅ Synthesis generated ({len(synthesis)} chars)")
                print(f"\nSynthesis preview:\n{synthesis[:200]}...")
            else:
                print(f"⚠️ Synthesis missing or too short")

            # Overall pass/fail
            if step_count_match and has_expected_actions and synthesis:
                print(f"\n✅ PASS: Research workflow completed successfully")
                results["passed"] += 1
            else:
                print(f"\n❌ FAIL: Research workflow incomplete")
                results["failed"] += 1

            # Store step details
            results["step_details"].append({
                "query": test["query"],
                "plan": plan,
                "steps_executed": len(steps),
                "synthesis_length": len(synthesis)
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
    print("RESEARCH TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Passed: {results['passed']}/{len(research_test_cases)}")
    print(f"Failed: {results['failed']}/{len(research_test_cases)}")

    # Average steps
    avg_steps = sum(
        d["steps_executed"] for d in results["step_details"]
    ) / len(results["step_details"]) if results["step_details"] else 0
    print(f"Average steps per query: {avg_steps:.1f}")

    if results["errors"]:
        print("\nErrors:")
        for error in results["errors"]:
            print(f"  - {error['test']}: {error['error']}")

    return results

if __name__ == "__main__":
    results = run_research_tests()
```

## Manual Testing
```bash
# Test complex research query
curl -X POST http://localhost:8010/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "find best laptop for video editing under $1500, compare top 3", "user_id": 1}'

# Expected response should include:
# - Research plan (3-4 steps)
# - Step execution results
# - Final synthesis with recommendation
# - Comparison of top products
```

## Validation Criteria
- [ ] Plan generated correctly
- [ ] All steps execute successfully
- [ ] Filters applied correctly
- [ ] Top-N selection works
- [ ] Comparison triggered when requested
- [ ] Synthesis is comprehensive and actionable
- [ ] Total response time < 10 seconds

## Performance Benchmarks
- [ ] 2-step research: < 3 seconds
- [ ] 3-step research: < 5 seconds
- [ ] 4+ step research: < 10 seconds

## Expected Outcome
Complex multi-step research queries execute reliably and produce useful results.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
