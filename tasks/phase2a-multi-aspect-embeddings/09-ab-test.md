# Task 09: A/B Test Multi-Aspect Search

## Description
Conduct comprehensive A/B testing to measure the improvement of multi-aspect search over single-vector baseline.

## Implementation Checklist

### Test Setup
- [ ] Create test query dataset (30-50 diverse queries)
- [ ] Categorize queries by type (usage, feature, description, mixed)
- [ ] Define relevance criteria for each query
- [ ] Prepare ground truth for evaluation
- [ ] Set up metrics tracking

### Test Queries Dataset
```python
test_queries = [
    # Usage-focused
    {"query": "running shoes for marathon training", "expected_category": "shoes", "focus": "usage"},
    {"query": "laptop for video editing", "expected_category": "electronics", "focus": "usage"},
    {"query": "headphones for noisy commute", "expected_category": "audio", "focus": "usage"},

    # Feature-focused
    {"query": "waterproof watch with GPS", "expected_category": "watches", "focus": "feature"},
    {"query": "phone with 128GB storage", "expected_category": "phones", "focus": "feature"},
    {"query": "noise cancelling wireless headphones", "expected_category": "audio", "focus": "feature"},

    # Description-focused
    {"query": "elegant evening dress", "expected_category": "clothing", "focus": "description"},
    {"query": "modern minimalist furniture", "expected_category": "furniture", "focus": "description"},
    {"query": "stylish casual sneakers", "expected_category": "shoes", "focus": "description"},

    # Mixed
    {"query": "comfortable waterproof hiking boots", "expected_category": "shoes", "focus": "mixed"},
    {"query": "affordable laptop for students", "expected_category": "electronics", "focus": "mixed"},
]
```

### Metrics to Track
- [ ] Precision@5 (relevant products in top 5)
- [ ] Mean Reciprocal Rank (MRR)
- [ ] NDCG@5 (normalized discounted cumulative gain)
- [ ] Average query latency
- [ ] Aspect weight distribution
- [ ] User satisfaction (if manual evaluation)

### Testing Script
- [ ] Create `tests/ab_test_embeddings.py`
- [ ] Implement v1 search function (baseline)
- [ ] Implement v2 search function (multi-aspect)
- [ ] Run both on same query set
- [ ] Calculate metrics for each
- [ ] Generate comparison report

## Implementation
```python
# tests/ab_test_embeddings.py
import time
from typing import List, Dict
from agentic.tools.semantic_search import SemanticSearchTool

class EmbeddingABTest:
    def __init__(self):
        self.search_tool = SemanticSearchTool()

    def run_test(self, test_queries: List[Dict]) -> Dict:
        """Run A/B test comparing v1 vs v2 embeddings"""

        results = {
            "v1": {"latencies": [], "relevance_scores": []},
            "v2": {"latencies": [], "relevance_scores": []}
        }

        for test_case in test_queries:
            query = test_case["query"]
            expected_category = test_case["expected_category"]

            # Test v1 (single-vector)
            start = time.time()
            v1_results = self.search_tool._legacy_search(query, top_k=5)
            v1_latency = time.time() - start
            v1_relevance = self._calculate_relevance(v1_results, expected_category)

            # Test v2 (multi-aspect)
            start = time.time()
            v2_results = self.search_tool.multi_aspect_search(query, top_k=5)
            v2_latency = time.time() - start
            v2_relevance = self._calculate_relevance(v2_results, expected_category)

            results["v1"]["latencies"].append(v1_latency)
            results["v1"]["relevance_scores"].append(v1_relevance)
            results["v2"]["latencies"].append(v2_latency)
            results["v2"]["relevance_scores"].append(v2_relevance)

            print(f"\nQuery: {query}")
            print(f"V1: {v1_relevance:.2f} relevance, {v1_latency*1000:.0f}ms")
            print(f"V2: {v2_relevance:.2f} relevance, {v2_latency*1000:.0f}ms")

        return self._generate_report(results)

    def _calculate_relevance(self, results: List[Dict], expected_category: str) -> float:
        """Calculate relevance score (precision@5)"""
        if not results:
            return 0.0

        relevant_count = sum(
            1 for r in results
            if expected_category.lower() in r.get("category", "").lower()
        )
        return relevant_count / len(results)

    def _generate_report(self, results: Dict) -> Dict:
        """Generate comparison report"""
        import statistics

        report = {
            "v1": {
                "avg_latency_ms": statistics.mean(results["v1"]["latencies"]) * 1000,
                "avg_relevance": statistics.mean(results["v1"]["relevance_scores"]),
                "p50_latency_ms": statistics.median(results["v1"]["latencies"]) * 1000,
            },
            "v2": {
                "avg_latency_ms": statistics.mean(results["v2"]["latencies"]) * 1000,
                "avg_relevance": statistics.mean(results["v2"]["relevance_scores"]),
                "p50_latency_ms": statistics.median(results["v2"]["latencies"]) * 1000,
            }
        }

        # Calculate improvement
        relevance_improvement = (
            (report["v2"]["avg_relevance"] - report["v1"]["avg_relevance"])
            / report["v1"]["avg_relevance"] * 100
        )

        latency_change = (
            (report["v2"]["avg_latency_ms"] - report["v1"]["avg_latency_ms"])
            / report["v1"]["avg_latency_ms"] * 100
        )

        report["improvement"] = {
            "relevance_pct": relevance_improvement,
            "latency_pct": latency_change
        }

        return report

if __name__ == "__main__":
    test = EmbeddingABTest()
    report = test.run_test(test_queries)

    print("\n" + "="*50)
    print("A/B TEST RESULTS")
    print("="*50)
    print(f"\nV1 (Single-Vector):")
    print(f"  Avg Relevance: {report['v1']['avg_relevance']:.2%}")
    print(f"  Avg Latency: {report['v1']['avg_latency_ms']:.0f}ms")

    print(f"\nV2 (Multi-Aspect):")
    print(f"  Avg Relevance: {report['v2']['avg_relevance']:.2%}")
    print(f"  Avg Latency: {report['v2']['avg_latency_ms']:.0f}ms")

    print(f"\nImprovement:")
    print(f"  Relevance: {report['improvement']['relevance_pct']:+.1f}%")
    print(f"  Latency: {report['improvement']['latency_pct']:+.1f}%")
```

## Manual Evaluation (Optional)
- [ ] Show top 5 results to human evaluators
- [ ] Blind test (don't reveal v1 vs v2)
- [ ] Collect satisfaction ratings (1-5 scale)
- [ ] Calculate inter-rater agreement

## Success Criteria
- [ ] V2 relevance improvement > 20%
- [ ] V2 latency increase < 50ms
- [ ] Aspect weights correlate with query type
- [ ] No regression on any query category

## Documentation
- [ ] Record test results
- [ ] Document findings
- [ ] Note any unexpected behaviors
- [ ] Recommend optimizations if needed

## Expected Outcome
Clear evidence that multi-aspect embeddings improve search relevance.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
