# Task 04: Implement Product Enrichment Logic

## Description
Complete the intelligence enrichment implementation with robust error handling and edge case management.

## File Location
`agentic/tools/product_intelligence.py`

## Implementation Checklist

### Error Handling
- [ ] Handle missing inventory records
- [ ] Handle missing price history
- [ ] Handle missing trend data
- [ ] Handle database connection errors
- [ ] Add try-except blocks around database queries
- [ ] Log errors without breaking enrichment flow

### Edge Cases
- [ ] Product with no inventory record
- [ ] Product with price history but < 2 entries
- [ ] Product with zero price
- [ ] Product with negative stock count
- [ ] Trends with missing periods
- [ ] Future-dated trend records (data quality issue)

### Performance Optimization
- [ ] Batch database queries instead of one per product
- [ ] Cache intelligence data for short duration (5 minutes)
- [ ] Use database joins to reduce queries
- [ ] Add query result limit for large histories

### Enhanced Features
- [ ] Price drop alerts (price dropped > 20% from avg)
- [ ] Stock alerts (low stock + high trend = urgency)
- [ ] Seasonal trend detection
- [ ] Price prediction (optional, ML-based)

## Optimized Batch Query
```python
def enrich_products_batch(self, products: List[Dict]) -> List[Dict]:
    """Optimized batch enrichment"""
    db = next(get_db())
    product_ids = [p["id"] for p in products]

    # Fetch all data in 3 queries instead of N×3
    inventories = {
        inv.productId: inv
        for inv in db.query(ProductInventory).filter(
            ProductInventory.productId.in_(product_ids)
        ).all()
    }

    # Fetch all price histories
    ninety_days_ago = datetime.now() - timedelta(days=90)
    price_histories = {}
    for ph in db.query(PriceHistory).filter(
        PriceHistory.productId.in_(product_ids),
        PriceHistory.recorded_at > ninety_days_ago
    ).all():
        if ph.productId not in price_histories:
            price_histories[ph.productId] = []
        price_histories[ph.productId].append(ph)

    # Fetch all trends
    four_weeks_ago = datetime.now() - timedelta(weeks=4)
    trends_data = {}
    for trend in db.query(ProductTrends).filter(
        ProductTrends.productId.in_(product_ids),
        ProductTrends.period == "week",
        ProductTrends.date > four_weeks_ago
    ).order_by(ProductTrends.date).all():
        if trend.productId not in trends_data:
            trends_data[trend.productId] = []
        trends_data[trend.productId].append(trend)

    # Now enrich each product using cached data
    for product in products:
        pid = product["id"]

        inventory = inventories.get(pid)
        if inventory:
            product.update({
                "in_stock": inventory.is_available,
                "stock_level": self._get_stock_level(inventory.stock_count),
                "stock_count": inventory.stock_count
            })

        price_hist = price_histories.get(pid, [])
        if price_hist:
            product.update(self._calculate_price_stats(price_hist, product["price"]))

        trends = trends_data.get(pid, [])
        if trends:
            product.update(self._calculate_trend_stats(trends))

    return products
```

## Caching Implementation
```python
from functools import lru_cache
from time import time

class ProductIntelligenceTool:
    def __init__(self):
        self._cache = {}
        self._cache_ttl = 300  # 5 minutes

    def _get_cached_or_fetch(self, key: str, fetch_func):
        """Simple cache with TTL"""
        now = time()
        if key in self._cache:
            data, timestamp = self._cache[key]
            if now - timestamp < self._cache_ttl:
                return data

        # Fetch fresh data
        data = fetch_func()
        self._cache[key] = (data, now)
        return data
```

## Expected Outcome
Robust, performant intelligence enrichment system.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
