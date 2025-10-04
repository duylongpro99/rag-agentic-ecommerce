# Task 07: Create Background Worker for Price Tracking (Optional)

## Description
Implement a background worker that periodically collects price data, updates inventory, and aggregates trend statistics.

## File Location
`agentic/workers/price_tracker.py` (new file)

## Implementation Checklist

- [ ] Create `agentic/workers/` directory
- [ ] Create `price_tracker.py`
- [ ] Choose worker framework (Celery, APScheduler, or simple cron)
- [ ] Implement price collection task
- [ ] Implement inventory update task
- [ ] Implement trend aggregation task
- [ ] Add error handling and retries
- [ ] Add logging
- [ ] Configure task scheduling (daily, hourly, etc.)
- [ ] Test worker execution
- [ ] Document deployment process

## Implementation (APScheduler)
```python
# agentic/workers/price_tracker.py
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from agentic.database.models import Product, PriceHistory, ProductInventory, ProductTrends
from agentic.database.connection import get_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PriceTracker:
    """Background worker for price and inventory tracking"""

    def __init__(self):
        self.scheduler = BackgroundScheduler()

    def start(self):
        """Start the background tasks"""
        # Record prices daily at 2 AM
        self.scheduler.add_job(
            self.record_prices,
            'cron',
            hour=2,
            minute=0,
            id='record_prices'
        )

        # Update inventory every 6 hours
        self.scheduler.add_job(
            self.update_inventory,
            'interval',
            hours=6,
            id='update_inventory'
        )

        # Aggregate trends daily at 3 AM
        self.scheduler.add_job(
            self.aggregate_trends,
            'cron',
            hour=3,
            minute=0,
            id='aggregate_trends'
        )

        self.scheduler.start()
        logger.info("Price tracker worker started")

    def record_prices(self):
        """Record current prices for all products"""
        logger.info("Recording prices...")
        db = next(get_db())

        try:
            products = db.query(Product).all()

            for product in products:
                price_record = PriceHistory(
                    productId=product.id,
                    price=product.price,
                    source="internal",  # or "api" if fetched externally
                    recorded_at=datetime.now()
                )
                db.add(price_record)

            db.commit()
            logger.info(f"Recorded prices for {len(products)} products")

        except Exception as e:
            logger.error(f"Error recording prices: {e}")
            db.rollback()

    def update_inventory(self):
        """Update inventory data (simulated or from external API)"""
        logger.info("Updating inventory...")
        db = next(get_db())

        try:
            # In production, this would fetch from warehouse API
            # For now, simulate random stock changes
            import random

            inventories = db.query(ProductInventory).all()

            for inv in inventories:
                # Simulate stock changes (random for demo)
                change = random.randint(-5, 10)
                inv.stock_count = max(0, inv.stock_count + change)
                inv.is_available = inv.stock_count > 0
                inv.updated_at = datetime.now()

            db.commit()
            logger.info(f"Updated inventory for {len(inventories)} products")

        except Exception as e:
            logger.error(f"Error updating inventory: {e}")
            db.rollback()

    def aggregate_trends(self):
        """Aggregate search/view/click data into daily trends"""
        logger.info("Aggregating trends...")
        db = next(get_db())

        try:
            # This would normally aggregate from event logs
            # For now, create placeholder trend records

            products = db.query(Product).all()
            today = datetime.now().date()

            for product in products:
                # Check if trend exists for today
                existing = db.query(ProductTrends).filter(
                    ProductTrends.productId == product.id,
                    ProductTrends.period == "day",
                    ProductTrends.date == today
                ).first()

                if not existing:
                    # Create new trend record
                    # In production, these counts come from event logs
                    import random
                    trend = ProductTrends(
                        productId=product.id,
                        search_count=random.randint(0, 50),
                        view_count=random.randint(0, 200),
                        click_count=random.randint(0, 30),
                        period="day",
                        date=today
                    )
                    db.add(trend)

            db.commit()
            logger.info(f"Aggregated trends for {len(products)} products")

        except Exception as e:
            logger.error(f"Error aggregating trends: {e}")
            db.rollback()

    def stop(self):
        """Stop the scheduler"""
        self.scheduler.shutdown()
        logger.info("Price tracker worker stopped")


# Start worker when module is run
if __name__ == "__main__":
    tracker = PriceTracker()
    tracker.start()

    # Keep running
    try:
        while True:
            import time
            time.sleep(60)
    except (KeyboardInterrupt, SystemExit):
        tracker.stop()
```

## Alternative: Celery Implementation
```python
# agentic/workers/celery_app.py
from celery import Celery
from celery.schedules import crontab

app = Celery('ecommerce', broker='redis://localhost:6379/0')

app.conf.beat_schedule = {
    'record-prices-daily': {
        'task': 'workers.tasks.record_prices',
        'schedule': crontab(hour=2, minute=0),
    },
    'update-inventory': {
        'task': 'workers.tasks.update_inventory',
        'schedule': crontab(hour='*/6'),  # Every 6 hours
    },
}

# agentic/workers/tasks.py
from .celery_app import app
# ... task implementations
```

## Deployment
```bash
# Install dependencies
pip install apscheduler  # or celery redis

# Run worker
python agentic/workers/price_tracker.py &

# Or with Celery
celery -A agentic.workers.celery_app worker --loglevel=info &
celery -A agentic.workers.celery_app beat --loglevel=info &
```

## Monitoring
- [ ] Add health check endpoint
- [ ] Monitor task execution logs
- [ ] Set up alerts for failed tasks
- [ ] Track task execution time

## Expected Outcome
Automated background tasks keep intelligence data fresh and up-to-date.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
