from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
import google.generativeai as genai
import os
from ..database.models import Product, ProductEmbedding
from ..database.connection import get_db

class SemanticSearchTool:
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        
    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for given text using Gemini"""
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']
    
    def search_products(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for products using semantic similarity"""
        db = next(get_db())
        try:
            # Get query embedding
            query_embedding = self.get_embedding(query)
            
            # Perform vector similarity search
            sql_query = text("""
                SELECT p.*, pe.document_text,
                       (pe.embedding <=> :query_embedding::vector) as distance
                FROM products p
                JOIN product_embeddings pe ON p.id = pe.product_id
                ORDER BY pe.embedding <=> :query_embedding::vector
                LIMIT :limit
            """)
            
            result = db.execute(sql_query, {
                "query_embedding": query_embedding,
                "limit": top_k
            })
            
            products = []
            for row in result:
                products.append({
                    "id": row.id,
                    "name": row.name,
                    "brand": row.brand,
                    "category": row.category,
                    "description": row.description,
                    "usage": row.usage,
                    "price": float(row.price) if row.price else None,
                    "image_url": row.image_url,
                    "similarity_score": 1 - row.distance  # Convert distance to similarity
                })
            
            return products
            
        finally:
            db.close()
    
    def __call__(self, query: str) -> str:
        """Tool interface for LangGraph agent"""
        products = self.search_products(query)
        
        if not products:
            return "No products found matching your query."
        
        result = f"Found {len(products)} products matching '{query}':\n\n"
        for product in products:
            result += f"• {product['name']} by {product['brand']}\n"
            result += f"  Category: {product['category']}\n"
            result += f"  Price: ${product['price']}\n"
            result += f"  Description: {product['description']}\n"
            result += f"  Similarity: {product['similarity_score']:.2f}\n\n"
        
        return result