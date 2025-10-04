# Task 02: Create and Apply Intelligence Tables Migration

## Description
Generate and apply database migration for ProductInventory, PriceHistory, and ProductTrends tables.

## Implementation Checklist

### Migration Creation
- [ ] Navigate to `database/` directory
- [ ] Run `npm run migrate:create`
- [ ] Name migration "add_product_intelligence_tables"
- [ ] Review generated SQL
- [ ] Verify foreign keys are correct
- [ ] Check indexes are created
- [ ] Verify cascade deletes

### Migration Application
- [ ] Backup current database
- [ ] Apply migration: `npm run migrate`
- [ ] Verify tables created successfully
- [ ] Regenerate Prisma client: `npm run generate`
- [ ] Test table access in Prisma Studio

### Post-Migration
- [ ] Create SQLAlchemy models in `agentic/database/models.py`
- [ ] Test insert/select operations
- [ ] Seed initial data (optional)

## Commands
```bash
cd database

# Create migration
npm run migrate:create

# Apply migration
npm run migrate

# Verify
npm run studio

# Regenerate client
npm run generate
```

## SQLAlchemy Models
```python
# Add to agentic/database/models.py

class ProductInventory(Base):
    __tablename__ = "product_inventory"

    id = Column(Integer, primary_key=True)
    productId = Column(Integer, ForeignKey("products.id"), unique=True)
    stock_count = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    last_restocked = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True)
    productId = Column(Integer, ForeignKey("products.id"))
    price = Column(Numeric(10, 2))
    source = Column(String(50))
    recorded_at = Column(DateTime, default=datetime.utcnow)

class ProductTrends(Base):
    __tablename__ = "product_trends"

    id = Column(Integer, primary_key=True)
    productId = Column(Integer, ForeignKey("products.id"))
    search_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    click_count = Column(Integer, default=0)
    period = Column(String(20))
    date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Verification
```sql
-- Check tables exist
\dt product_inventory
\dt price_history
\dt product_trends

-- Test insert
INSERT INTO product_inventory (product_id, stock_count, is_available)
VALUES (1, 50, true);

SELECT * FROM product_inventory;
```

## Expected Outcome
Intelligence tables successfully created and accessible.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
