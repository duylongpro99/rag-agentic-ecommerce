# Task 06: Create SearchAudit Model (Optional)

## Description
Add a SearchAudit table to track search quality metrics, user feedback, and enable continuous improvement.

## File Location
`database/schema.prisma`

## Implementation Checklist

- [ ] Design SearchAudit schema
- [ ] Add to schema.prisma
- [ ] Create and apply migration
- [ ] Implement audit logging in orchestrator
- [ ] Track key metrics (confidence, clicks, user satisfaction)
- [ ] Create analytics queries
- [ ] Build simple dashboard (optional)

## Schema Design
```prisma
model SearchAudit {
  id               Int      @id @default(autoincrement())

  // Query info
  query            String   @db.Text
  user_id          Int?
  conversation_id  Int?

  // Results quality
  results_count    Int
  avg_confidence   Float
  max_confidence   Float
  min_confidence   Float

  // User behavior
  top_result_id    Int?
  user_clicked_id  Int?      // Which product did user click
  clicked_rank     Int?      // Position of clicked product
  was_satisfied    Boolean?  // Optional user feedback

  // Search metadata
  search_strategy  String    @db.VarChar(50)  // "semantic", "structured", "both"
  had_warnings     Boolean   @default(false)
  execution_time_ms Int?

  // Intelligence flags
  had_price_alerts Boolean   @default(false)
  had_stock_warnings Boolean @default(false)

  timestamp        DateTime  @default(now())

  @@index([query])
  @@index([user_id, timestamp])
  @@index([avg_confidence])
  @@map("search_audits")
}
```

## Audit Logging Implementation
```python
# agentic/agents/orchestrator.py

def _log_search_audit(self, state: AgentState, products: List[Dict],
                     execution_time_ms: int):
    """Log search metrics for analysis"""

    try:
        from agentic.database.models import SearchAudit
        from agentic.database.connection import get_db

        db = next(get_db())

        # Calculate metrics
        confidences = [p.get("confidence_score", 0) for p in products]
        avg_conf = sum(confidences) / len(confidences) if confidences else 0
        max_conf = max(confidences) if confidences else 0
        min_conf = min(confidences) if confidences else 0

        # Check for warnings/alerts
        had_warnings = avg_conf < 0.5
        had_price_alerts = any(p.get("is_good_deal") for p in products)
        had_stock_warnings = any(
            p.get("stock_level") in ["low", "out_of_stock"]
            for p in products
        )

        audit = SearchAudit(
            query=state["user_query"],
            user_id=state.get("user_id"),  # From API request
            conversation_id=state.get("conversation_id"),
            results_count=len(products),
            avg_confidence=avg_conf,
            max_confidence=max_conf,
            min_confidence=min_conf,
            top_result_id=products[0]["id"] if products else None,
            search_strategy=state.get("search_strategy", "semantic"),
            had_warnings=had_warnings,
            execution_time_ms=execution_time_ms,
            had_price_alerts=had_price_alerts,
            had_stock_warnings=had_stock_warnings
        )

        db.add(audit)
        db.commit()

    except Exception as e:
        print(f"Search audit logging failed: {e}")

# Call in workflow
def run_search(self, query: str, user_id: int, conversation_id: int):
    import time
    start = time.time()

    # ... run search

    execution_time = int((time.time() - start) * 1000)
    self._log_search_audit(state, products, execution_time)
```

## User Feedback Collection
```python
# agentic/api/main.py

@app.post("/feedback")
def record_feedback(
    audit_id: int,
    clicked_product_id: int,
    was_satisfied: bool
):
    """Record user feedback on search results"""

    db = next(get_db())

    audit = db.query(SearchAudit).filter(SearchAudit.id == audit_id).first()
    if audit:
        # Find rank of clicked product
        # (would need to store full results or recalculate)

        audit.user_clicked_id = clicked_product_id
        audit.was_satisfied = was_satisfied
        db.commit()

    return {"status": "success"}
```

## Analytics Queries
```sql
-- Average confidence over time
SELECT DATE(timestamp) as date,
       AVG(avg_confidence) as avg_conf,
       AVG(max_confidence) as max_conf,
       COUNT(*) as search_count
FROM search_audits
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE(timestamp)
ORDER BY date;

-- Top failing queries (low confidence)
SELECT query,
       AVG(avg_confidence) as avg_conf,
       COUNT(*) as frequency
FROM search_audits
WHERE avg_confidence < 0.4
GROUP BY query
ORDER BY frequency DESC
LIMIT 20;

-- Click-through rate (CTR)
SELECT
  COUNT(*) as total_searches,
  SUM(CASE WHEN user_clicked_id IS NOT NULL THEN 1 ELSE 0 END) as clicked,
  (SUM(CASE WHEN user_clicked_id IS NOT NULL THEN 1 ELSE 0 END)::float / COUNT(*)) as ctr
FROM search_audits
WHERE timestamp > NOW() - INTERVAL '7 days';

-- Confidence vs satisfaction correlation
SELECT
  CASE
    WHEN avg_confidence >= 0.7 THEN 'high'
    WHEN avg_confidence >= 0.4 THEN 'medium'
    ELSE 'low'
  END as confidence_tier,
  AVG(CASE WHEN was_satisfied THEN 1.0 ELSE 0.0 END) as satisfaction_rate,
  COUNT(*) as sample_size
FROM search_audits
WHERE was_satisfied IS NOT NULL
GROUP BY confidence_tier;
```

## Dashboard (Optional)
- [ ] Create simple analytics endpoint
- [ ] Visualize confidence trends
- [ ] Show top queries
- [ ] Display CTR metrics
- [ ] Monitor search quality

## Expected Outcome
Data-driven insights for continuous search improvement.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
