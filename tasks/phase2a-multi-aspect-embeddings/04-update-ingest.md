# Task 04: Update Embedding Generation Logic

## Description
Modify the embedding ingest script to generate separate embeddings for description, usage, and features aspects.

## File Location
`embedding/ingest.py`

## Implementation Checklist

- [ ] Open `embedding/ingest.py`
- [ ] Create `generate_multi_aspect_embeddings()` function
- [ ] Define aspect text templates:
  - [ ] Description: "Product: {name}. {description}"
  - [ ] Usage: "Best for: {usage}. Category: {category}"
  - [ ] Features: "Brand: {brand}. Price: ${price}"
- [ ] Update embedding generation to create 3 separate vectors
- [ ] Consider using smaller models for sub-embeddings (efficiency)
- [ ] Update database insertion to use ProductEmbeddingV2 table
- [ ] Add SQLAlchemy model for ProductEmbeddingV2
- [ ] Handle products without usage or category fields
- [ ] Add progress tracking for multi-aspect generation
- [ ] Implement batch processing for efficiency
- [ ] Add error handling for embedding API failures
- [ ] Skip products that already have v2 embeddings
- [ ] Add logging for each aspect generated
- [ ] Test with single product first

## Code Template
```python
def generate_multi_aspect_embeddings(product: Dict) -> Dict[str, List[float]]:
    """Generate separate embeddings for each product aspect"""

    aspects = {
        "description": f"Product: {product['name']}. {product.get('description', '')}",
        "usage": f"Best for: {product.get('usage', 'general use')}. Category: {product.get('category', 'general')}",
        "features": f"Brand: {product['brand']}. Price: ${product['price']}"
    }

    embeddings = {}
    for aspect_name, text in aspects.items():
        # Generate embedding for this aspect
        embedding = embedding_model.embed_query(text)
        embeddings[aspect_name] = embedding
        print(f"  Generated {aspect_name} embedding ({len(embedding)} dims)")

    return embeddings

def ingest_multi_aspect():
    """Main ingestion function for multi-aspect embeddings"""
    products = fetch_all_products()

    for product in products:
        # Check if v2 embedding already exists
        existing = session.query(ProductEmbeddingV2).filter_by(
            productId=product.id
        ).first()

        if existing:
            print(f"Skipping {product.name} - already has v2 embeddings")
            continue

        print(f"Processing: {product.name}")
        embeddings = generate_multi_aspect_embeddings(product.__dict__)

        # Save to database
        embedding_v2 = ProductEmbeddingV2(
            productId=product.id,
            description_embedding=embeddings["description"],
            usage_embedding=embeddings["usage"],
            feature_embedding=embeddings["features"],
            embedding_version="v2"
        )

        session.add(embedding_v2)
        session.commit()
        print(f"  ✓ Saved multi-aspect embeddings for {product.name}")
```

## SQLAlchemy Model
- [ ] Create model in `agentic/database/models.py`:
```python
class ProductEmbeddingV2(Base):
    __tablename__ = "product_embeddings_v2"

    id = Column(Integer, primary_key=True)
    productId = Column(Integer, ForeignKey("products.id"), unique=True)
    description_embedding = Column(Vector(768))
    usage_embedding = Column(Vector(768))
    feature_embedding = Column(Vector(384))
    embedding_version = Column(String(10), default="v2")
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Expected Outcome
Script generates and stores multi-aspect embeddings for products.

## Status
- [ ] Implemented
- [ ] Tested
- [ ] Verified in production
