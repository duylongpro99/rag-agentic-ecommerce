# Task 03: Create ProductIntelligenceTool

## Description
Build a tool that enriches product search results with real-time intelligence (stock, pricing, trends).

## File Location
`agentic/tools/product_intelligence.py` (new file)

## Implementation Checklist

- [ ] Create `agentic/tools/product_intelligence.py`
- [ ] Import database models and dependencies
- [ ] Create `ProductIntelligenceTool` class
- [ ] Implement `enrich_products()` method
- [ ] Add stock status enrichment
- [ ] Add price intelligence calculation
- [ ] Add trending status detection
- [ ] Implement helper methods:
  - [ ] `_get_stock_level()`
  - [ ] `_calculate_price_stats()`
  - [ ] `_check_trending_status()`
  - [ ] `_get_popularity_score()`
- [ ] Handle missing intelligence data gracefully
- [ ] Add logging for debugging
- [ ] Test with sample products

## Code Implementation
```python
from typing import List, Dict, Any
from datetime import datetime, timedelta
from agentic.database.models import ProductInventory, PriceHistory, ProductTrends
from agentic.database.connection import get_db

class ProductIntelligenceTool:
    """Enriches product results with real-time intelligence"""

    def enrich_products(self, products: List[Dict]) -> List[Dict]:
        """
        Add intelligence metadata to product results.

        Args:
            products: List of product dictionaries from search

        Returns:
            Same products with added intelligence fields
        """
        db = next(get_db())

        for product in products:
            product_id = product["id"]

            # Stock intelligence
            stock_data = self._get_stock_intelligence(db, product_id)
            product.update(stock_data)

            # Price intelligence
            price_data = self._get_price_intelligence(db, product_id, product["price"])
            product.update(price_data)

            # Trend intelligence
            trend_data = self._get_trend_intelligence(db, product_id)
            product.update(trend_data)

        return products

    def _get_stock_intelligence(self, db, product_id: int) -> Dict[str, Any]:
        """Get inventory status"""
        inventory = db.query(ProductInventory).filter(
            ProductInventory.productId == product_id
        ).first()

        if not inventory:
            return {
                "in_stock": True,  # Default to available
                "stock_level": "unknown",
                "stock_count": None
            }

        return {
            "in_stock": inventory.is_available,
            "stock_level": self._get_stock_level(inventory.stock_count),
            "stock_count": inventory.stock_count,
            "last_restocked": inventory.last_restocked.isoformat() if inventory.last_restocked else None
        }

    def _get_price_intelligence(self, db, product_id: int, current_price: float) -> Dict[str, Any]:
        """Calculate price statistics"""
        # Get 90-day price history
        ninety_days_ago = datetime.now() - timedelta(days=90)
        price_history = db.query(PriceHistory).filter(
            PriceHistory.productId == product_id,
            PriceHistory.recorded_at > ninety_days_ago
        ).all()

        if not price_history:
            return {
                "is_good_deal": False,
                "price_vs_avg": 0,
                "lowest_price_90d": current_price,
                "highest_price_90d": current_price
            }

        prices = [float(p.price) for p in price_history]
        avg_price = sum(prices) / len(prices)
        min_price = min(prices)
        max_price = max(prices)

        price_vs_avg = ((current_price - avg_price) / avg_price * 100) if avg_price > 0 else 0
        is_good_deal = current_price <= min_price * 1.05  # Within 5% of lowest

        return {
            "is_good_deal": is_good_deal,
            "price_vs_avg": round(price_vs_avg, 1),
            "lowest_price_90d": min_price,
            "highest_price_90d": max_price,
            "avg_price_90d": round(avg_price, 2)
        }

    def _get_trend_intelligence(self, db, product_id: int) -> Dict[str, Any]:
        """Determine trending status"""
        four_weeks_ago = datetime.now() - timedelta(weeks=4)
        trends = db.query(ProductTrends).filter(
            ProductTrends.productId == product_id,
            ProductTrends.period == "week",
            ProductTrends.date > four_weeks_ago
        ).order_by(ProductTrends.date).all()

        if len(trends) < 2:
            return {
                "is_trending": False,
                "popularity_score": 0,
                "trend_direction": "stable"
            }

        # Compare recent activity to older activity
        recent_searches = sum(t.search_count for t in trends[-2:])
        older_searches = sum(t.search_count for t in trends[:-2]) if len(trends) > 2 else 1

        is_trending = recent_searches > older_searches * 1.5
        popularity_score = sum(t.click_count for t in trends)

        trend_direction = "up" if recent_searches > older_searches else "down" if recent_searches < older_searches else "stable"

        return {
            "is_trending": is_trending,
            "popularity_score": popularity_score,
            "trend_direction": trend_direction,
            "recent_views": sum(t.view_count for t in trends[-2:])
        }

    def _get_stock_level(self, count: int) -> str:
        """Categorize stock level"""
        if count > 50:
            return "high"
        elif count > 10:
            return "medium"
        elif count > 0:
            return "low"
        else:
            return "out_of_stock"
```

## Test Script
```python
# Test the intelligence tool
if __name__ == "__main__":
    tool = ProductIntelligenceTool()

    # Sample products
    products = [
        {"id": 1, "name": "Test Product", "price": 99.99}
    ]

    enriched = tool.enrich_products(products)
    print(enriched)
```

## Expected Outcome
Products enriched with stock, price, and trend intelligence.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
