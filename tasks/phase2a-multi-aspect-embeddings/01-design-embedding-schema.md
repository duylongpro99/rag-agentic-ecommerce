# Task 01: Design Multi-Aspect Embedding Schema

## Description
Design the database schema for ProductEmbeddingV2 with separate vector columns for different product aspects.

## File Location
`database/schema.prisma`

## Implementation Checklist

- [ ] Open `database/schema.prisma`
- [ ] Create `ProductEmbeddingV2` model
- [ ] Add `id` field (Int, autoincrement)
- [ ] Add `productId` field with relation to Product
- [ ] Add `description_embedding` vector field (768 dimensions)
- [ ] Add `usage_embedding` vector field (768 dimensions)
- [ ] Add `feature_embedding` vector field (384 dimensions)
- [ ] Add `review_embedding` vector field (384 dimensions, optional for future)
- [ ] Add `embedding_version` field (String, default "v2")
- [ ] Add `created_at` timestamp
- [ ] Add `updated_at` timestamp
- [ ] Configure proper indexes for vector searches
- [ ] Add foreign key constraint to Product table
- [ ] Add unique constraint on productId (one embedding set per product)
- [ ] Update Product model to include relation

## Schema Template
```prisma
model ProductEmbeddingV2 {
  id                    Int      @id @default(autoincrement())
  productId             Int      @unique @map("product_id")

  // Multi-aspect embeddings
  description_embedding Unsupported("vector(768)")
  usage_embedding       Unsupported("vector(768)")
  feature_embedding     Unsupported("vector(384)")
  review_embedding      Unsupported("vector(384)")  // Future use

  // Metadata
  embedding_version     String   @default("v2") @db.VarChar(10)
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_embeddings_v2")
}

// Update Product model
model Product {
  // ... existing fields
  embeddingsV2 ProductEmbeddingV2?
}
```

## Design Considerations
- [ ] Choose appropriate vector dimensions (768 vs 384)
- [ ] Consider storage implications
- [ ] Plan for backward compatibility with v1 embeddings
- [ ] Document aspect separation rationale

## Expected Outcome
Well-designed schema for multi-aspect vector storage.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
