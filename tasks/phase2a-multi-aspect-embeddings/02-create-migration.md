# Task 02: Create Database Migration

## Description
Generate Prisma migration for the ProductEmbeddingV2 table with vector support.

## Implementation Checklist

- [ ] Ensure PostgreSQL is running
- [ ] Navigate to `database/` directory
- [ ] Run `npm run migrate:create` to generate migration
- [ ] Name migration appropriately (e.g., "add_multi_aspect_embeddings")
- [ ] Review generated SQL migration file
- [ ] Verify vector type syntax is correct
- [ ] Check foreign key constraints
- [ ] Verify indexes are created
- [ ] Add migration documentation comment
- [ ] Ensure pgvector extension is enabled
- [ ] Test migration on development database first
- [ ] Create rollback plan if needed

## Migration Commands
```bash
cd database

# Generate migration (without applying)
npm run migrate:create

# Review the SQL file in prisma/migrations/

# Apply migration
npm run migrate

# Verify in database
npm run studio
```

## SQL Verification
```sql
-- Check table exists
\d product_embeddings_v2

-- Check vector types
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'product_embeddings_v2';

-- Check indexes
\di product_embeddings_v2*
```

## Rollback Plan
- [ ] Document current schema state
- [ ] Create backup of existing embeddings
- [ ] Test rollback on dev database
- [ ] Prepare rollback SQL script

## Expected Outcome
Migration successfully creates ProductEmbeddingV2 table with vector columns.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
