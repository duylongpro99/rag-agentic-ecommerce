# Task 03: Apply Database Migration

## Description
Execute the migration to add ProductEmbeddingV2 table to the production database.

## Implementation Checklist

### Pre-Migration
- [ ] Backup current database
- [ ] Test migration on development environment
- [ ] Verify no conflicts with existing tables
- [ ] Check disk space for new table
- [ ] Review migration SQL one final time
- [ ] Notify team of migration (if applicable)

### Migration Execution
- [ ] Navigate to `database/` directory
- [ ] Run `npm run migrate`
- [ ] Monitor migration output for errors
- [ ] Verify migration completed successfully
- [ ] Check migration history in `_prisma_migrations` table
- [ ] Verify table structure in database

### Post-Migration Verification
- [ ] Run Prisma Studio to inspect new table
- [ ] Test SELECT query on new table
- [ ] Verify foreign key constraints work
- [ ] Check that Product relation is correct
- [ ] Generate new Prisma client: `npm run generate`
- [ ] Test TypeScript types are generated

## Commands
```bash
cd database

# Backup database first
pg_dump -U postgres ecommerce > backup_before_embeddings_v2.sql

# Apply migration
npm run migrate

# Verify
npm run studio

# Regenerate Prisma client
npm run generate
```

## Verification Queries
```sql
-- Check table exists
SELECT * FROM product_embeddings_v2 LIMIT 1;

-- Check foreign key
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name='product_embeddings_v2' AND tc.constraint_type = 'FOREIGN KEY';
```

## Rollback (if needed)
```bash
# If migration fails
npm run migrate:reset  # WARNING: Deletes all data

# Or manual rollback
psql -U postgres ecommerce < backup_before_embeddings_v2.sql
```

## Expected Outcome
ProductEmbeddingV2 table exists in database and is ready for use.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
