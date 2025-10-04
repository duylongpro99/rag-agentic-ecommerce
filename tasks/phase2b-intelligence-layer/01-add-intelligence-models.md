# Task 01: Add Intelligence Models to Schema

## Description
Add ProductInventory, PriceHistory, and ProductTrends models to support real-time product intelligence.

## File Location
`database/schema.prisma`

## Implementation Checklist

- [ ] Open `database/schema.prisma`
- [ ] Create `ProductInventory` model
- [ ] Add stock_count field
- [ ] Add is_available boolean
- [ ] Add last_restocked timestamp
- [ ] Create `PriceHistory` model
- [ ] Add price tracking fields
- [ ] Add source field (website, api, scraper)
- [ ] Add recorded_at timestamp
- [ ] Create `ProductTrends` model
- [ ] Add search_count, view_count, click_count
- [ ] Add period field (day, week, month)
- [ ] Add date field
- [ ] Configure proper indexes for time-series queries
- [ ] Add foreign key relationships to Product

## Schema Implementation
```prisma
model ProductInventory {
  id            Int      @id @default(autoincrement())
  productId     Int      @unique @map("product_id")
  stock_count   Int      @default(0)
  is_available  Boolean  @default(true)
  last_restocked DateTime?
  updated_at    DateTime @updatedAt
  created_at    DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_inventory")
}

model PriceHistory {
  id          Int      @id @default(autoincrement())
  productId   Int      @map("product_id")
  price       Decimal  @db.Decimal(10, 2)
  source      String   @db.VarChar(50)  // "website", "scraper", "api"
  recorded_at DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId, recorded_at])
  @@map("price_history")
}

model ProductTrends {
  id           Int      @id @default(autoincrement())
  productId    Int      @map("product_id")
  search_count Int      @default(0)
  view_count   Int      @default(0)
  click_count  Int      @default(0)
  period       String   @db.VarChar(20)  // "day", "week", "month"
  date         DateTime
  created_at   DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, period, date])
  @@index([productId, period])
  @@map("product_trends")
}

// Update Product model
model Product {
  // ... existing fields
  inventory    ProductInventory?
  priceHistory PriceHistory[]
  trends       ProductTrends[]
}
```

## Validation
- [ ] Check all field types are appropriate
- [ ] Verify cascade deletes are configured
- [ ] Ensure indexes are on frequently queried columns
- [ ] Document the purpose of each table

## Expected Outcome
Schema ready for intelligence data storage.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
