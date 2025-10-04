# Task 05: Re-ingest Products with Multi-Aspect Embeddings

## Description
Run the updated embedding generation script to create multi-aspect embeddings for all products in the database.

## Implementation Checklist

### Pre-Ingestion
- [ ] Verify embedding API quota/limits
- [ ] Check database connection
- [ ] Estimate total products to process
- [ ] Calculate estimated time (products × 3 aspects × API latency)
- [ ] Ensure sufficient disk space
- [ ] Test with 5 products first

### Ingestion Execution
- [ ] Navigate to `embedding/` directory
- [ ] Run `python ingest.py` (or new script name)
- [ ] Monitor progress output
- [ ] Watch for API errors or rate limits
- [ ] Check memory usage during batch processing
- [ ] Verify embeddings are being saved to database

### Progress Monitoring
- [ ] Track completion percentage
- [ ] Monitor embedding API costs
- [ ] Check for failed products
- [ ] Log any errors or warnings
- [ ] Estimate remaining time

### Post-Ingestion Verification
- [ ] Count total embeddings in ProductEmbeddingV2 table
- [ ] Verify all products have embeddings
- [ ] Check for null vector values
- [ ] Spot-check embedding dimensions (768, 768, 384)
- [ ] Run test query to ensure vectors are searchable
- [ ] Compare v1 vs v2 embedding counts

## Commands
```bash
cd embedding

# Test with a few products first
python ingest.py --limit 5

# Full ingestion
python ingest.py

# Monitor progress
watch -n 5 'psql -U postgres ecommerce -c "SELECT COUNT(*) FROM product_embeddings_v2"'
```

## Verification Queries
```sql
-- Total products with v2 embeddings
SELECT COUNT(*) FROM product_embeddings_v2;

-- Compare with v1
SELECT
  (SELECT COUNT(*) FROM product_embeddings) as v1_count,
  (SELECT COUNT(*) FROM product_embeddings_v2) as v2_count;

-- Check for null embeddings
SELECT COUNT(*)
FROM product_embeddings_v2
WHERE description_embedding IS NULL
   OR usage_embedding IS NULL
   OR feature_embedding IS NULL;

-- Sample embedding to verify format
SELECT
  p.name,
  array_length(pe.description_embedding, 1) as desc_dims,
  array_length(pe.usage_embedding, 1) as usage_dims,
  array_length(pe.feature_embedding, 1) as feature_dims
FROM product_embeddings_v2 pe
JOIN products p ON p.id = pe."productId"
LIMIT 5;
```

## Troubleshooting
- [ ] If rate limited: Add sleep between requests
- [ ] If API fails: Resume from last successful product
- [ ] If disk full: Clear old logs or temporary files
- [ ] If memory issues: Reduce batch size

## Performance Metrics
- [ ] Record total time taken
- [ ] Calculate embeddings/second rate
- [ ] Note API costs incurred
- [ ] Document any optimizations made

## Expected Outcome
All products have multi-aspect embeddings stored in ProductEmbeddingV2 table.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
