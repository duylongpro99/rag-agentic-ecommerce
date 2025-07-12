"""
ETL Pipeline for embedding product data into vector database
"""
import os
import google.generativeai as genai
from sqlalchemy.orm import Session
from src.database.connection import SessionLocal, engine
from src.database.models import Product, ProductEmbedding, Base
from dotenv import load_dotenv

load_dotenv()

def create_document_text(product: Product) -> str:
    """Create unified text document for embedding"""
    return f"Product: {product.name}. Brand: {product.brand}. Category: {product.category}. Description: {product.description}. Ideal for: {product.usage}. Price: ${product.price}"

def get_embedding(text: str) -> list:
    """Generate embedding using Gemini"""
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_document"
    )
    return result['embedding']

def ingest_products():
    """Main ingestion function"""
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Get all products
        products = db.query(Product).all()
        print(f"Found {len(products)} products to process")
        
        for product in products:
            # Check if embedding already exists
            existing = db.query(ProductEmbedding).filter(
                ProductEmbedding.product_id == product.id
            ).first()
            
            if existing:
                print(f"Embedding already exists for product {product.id}: {product.name}")
                continue
            
            # Create document text
            doc_text = create_document_text(product)
            print(f"Processing: {product.name}")
            
            # Generate embedding
            try:
                embedding = get_embedding(doc_text)
                
                # Store embedding
                product_embedding = ProductEmbedding(
                    product_id=product.id,
                    embedding=embedding,
                    document_text=doc_text
                )
                
                db.add(product_embedding)
                db.commit()
                print(f"✓ Embedded: {product.name}")
                
            except Exception as e:
                print(f"✗ Failed to embed {product.name}: {e}")
                db.rollback()
        
        print("Ingestion completed!")
        
    finally:
        db.close()

if __name__ == "__main__":
    ingest_products()