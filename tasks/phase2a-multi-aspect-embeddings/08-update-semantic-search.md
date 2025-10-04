# Task 08: Update Semantic Search with Weighted Fusion

## Description
Enhance the semantic search tool to perform multi-aspect vector search with dynamic weight fusion based on query classification.

## File Location
`agentic/tools/semantic_search.py`

## Implementation Checklist

- [ ] Import QueryIntentClassifier
- [ ] Add multi-aspect embedding generation for queries
- [ ] Implement `multi_aspect_search()` method
- [ ] Generate separate query embeddings for each aspect
- [ ] Build SQL query with weighted vector distance
- [ ] Use pgvector's `<=>` operator for each aspect
- [ ] Combine distances with classification weights
- [ ] Sort by weighted combined distance
- [ ] Return products with similarity scores
- [ ] Add backward compatibility with v1 embeddings
- [ ] Implement fallback to single-vector search if v2 not available
- [ ] Add performance logging (query time)
- [ ] Test with various weight combinations
- [ ] Validate results are better than v1

## Code Implementation
```python
from sqlalchemy import text
from agentic.tools.query_classifier import QueryIntentClassifier

class SemanticSearchTool:
    def __init__(self):
        self.embedding_model = EmbeddingModel.get_model()
        self.query_classifier = QueryIntentClassifier()
        # ... existing code

    def search_products(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Search with multi-aspect embeddings if available,
        fallback to v1 if needed.
        """
        # Check if v2 embeddings exist
        has_v2 = self._check_v2_embeddings()

        if has_v2:
            return self.multi_aspect_search(query, top_k)
        else:
            return self._legacy_search(query, top_k)  # Original v1 search

    def multi_aspect_search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Perform weighted multi-aspect vector search"""

        # Step 1: Classify query to get weights
        aspect_weights = self.query_classifier.classify(query)
        print(f"Aspect weights: {aspect_weights}")

        # Step 2: Generate query embeddings for each aspect
        query_embeddings = self._generate_query_aspects(query)

        # Step 3: Weighted vector search
        sql_query = text("""
            SELECT
                p.*,
                (
                    (pe.description_embedding <=> :desc_vec::vector) * :desc_weight +
                    (pe.usage_embedding <=> :usage_vec::vector) * :usage_weight +
                    (pe.feature_embedding <=> :feat_vec::vector) * :feat_weight
                ) as weighted_distance,
                (pe.description_embedding <=> :desc_vec::vector) as desc_similarity,
                (pe.usage_embedding <=> :usage_vec::vector) as usage_similarity,
                (pe.feature_embedding <=> :feat_vec::vector) as feat_similarity
            FROM products p
            JOIN product_embeddings_v2 pe ON p.id = pe."productId"
            ORDER BY weighted_distance ASC
            LIMIT :limit
        """)

        db = next(get_db())
        result = db.execute(sql_query, {
            "desc_vec": query_embeddings["description"],
            "usage_vec": query_embeddings["usage"],
            "feat_vec": query_embeddings["features"],
            "desc_weight": aspect_weights["description_weight"],
            "usage_weight": aspect_weights["usage_weight"],
            "feat_weight": aspect_weights["feature_weight"],
            "limit": top_k
        })

        products = []
        for row in result:
            product = {
                "id": row.id,
                "name": row.name,
                "brand": row.brand,
                "category": row.category,
                "description": row.description,
                "price": float(row.price),
                "imageUrl": row.imageUrl,
                "usage": row.usage,
                "weighted_distance": float(row.weighted_distance),
                "similarity_score": 1 - float(row.weighted_distance),  # Convert distance to similarity
                "aspect_scores": {
                    "description": 1 - float(row.desc_similarity),
                    "usage": 1 - float(row.usage_similarity),
                    "features": 1 - float(row.feat_similarity)
                },
                "weights_used": aspect_weights
            }
            products.append(product)

        return products

    def _generate_query_aspects(self, query: str) -> Dict[str, List[float]]:
        """Generate aspect-specific query embeddings"""

        # Create aspect-specific query texts
        aspect_queries = {
            "description": query,  # Full query for description
            "usage": f"Use case: {query}",  # Emphasize usage context
            "features": f"Product with: {query}"  # Emphasize features
        }

        embeddings = {}
        for aspect, text in aspect_queries.items():
            embeddings[aspect] = self.embedding_model.embed_query(text)

        return embeddings

    def _check_v2_embeddings(self) -> bool:
        """Check if ProductEmbeddingV2 table has data"""
        try:
            db = next(get_db())
            result = db.execute(text("SELECT COUNT(*) FROM product_embeddings_v2"))
            count = result.scalar()
            return count > 0
        except:
            return False

    def _legacy_search(self, query: str, top_k: int) -> List[Dict]:
        """Original single-vector search (v1)"""
        # ... existing search_products implementation
        pass
```

## SQL Optimization
- [ ] Add EXPLAIN ANALYZE to check query plan
- [ ] Consider GIN or HNSW indexes for vectors
- [ ] Test query performance with 10k+ products
- [ ] Optimize batch queries if needed

## Testing
- [ ] Test with usage-focused query ("running shoes")
- [ ] Test with feature-focused query ("laptop with 16GB RAM")
- [ ] Test with description-focused query ("elegant dress")
- [ ] Compare results with v1 search
- [ ] Measure query latency (should be <500ms)
- [ ] Test with no v2 embeddings (fallback)

## Expected Outcome
Multi-aspect search returns more relevant results based on query intent.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
