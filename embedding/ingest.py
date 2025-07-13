"""
Embedding Service - Generate and store product embeddings
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from embedding.model_factory import create_embedding_model

load_dotenv(dotenv_path='../.env')

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_document_text(product) -> str:
    """Create unified text document for embedding"""
    return f"Product: {product[1]}. Brand: {product[2]}. Category: {product[3]}. Description: {product[4]}. Ideal for: {product[5]}. Price: ${product[6]}"

# Initialize embedding model
embedding_model = create_embedding_model()

def get_embedding(text: str) -> list:
    """Generate embedding using configured model"""
    return embedding_model.get_embedding(text)

def ingest_products():
    """Main ingestion function"""
    db = SessionLocal()
    try:
        # Get all products
        result = db.execute(text("SELECT * FROM products"))
        products = result.fetchall()
        print(f"Found {len(products)} products to process")
        
        for product in products:
            # Check if embedding already exists
            existing = db.execute(text(
                "SELECT id FROM product_embeddings WHERE product_id = :product_id"
            ), {"product_id": product[0]}).fetchone()
            
            if existing:
                print(f"Embedding already exists for product {product[0]}: {product[1]}")
                continue
            
            # Create document text
            doc_text = create_document_text(product)
            print(f"Processing: {product[1]}")
            
            # Generate embedding
            try:
                embedding = get_embedding(doc_text)
                
                # Store embedding as text representation
                embedding_text = str(embedding)
                
                # Insert embedding
                db.execute(text("""
                    INSERT INTO product_embeddings (product_id, embedding, document_text)
                    VALUES (:product_id, :embedding, :document_text)
                """), {
                    "product_id": product[0],
                    "embedding": embedding_text,
                    "document_text": doc_text
                })
                
                db.commit()
                print(f"✓ Embedded: {product[1]}")
                
            except Exception as e:
                print(f"✗ Failed to embed {product[1]}: {e}")
                db.rollback()
        
        print("Ingestion completed!")
        
    finally:
        db.close()

if __name__ == "__main__":
    ingest_products()