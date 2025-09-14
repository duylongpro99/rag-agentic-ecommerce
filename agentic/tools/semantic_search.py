from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
import google.generativeai as genai
import os
from agentic.database.models import Product, ProductEmbedding
from agentic.database.connection import get_db
from agentic.factory.embedding import EmbeddingModel


class SemanticSearchTool:
    def __init__(self):
        self.embedding = EmbeddingModel().embedding

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding for given text using Embedding"""
        result = self.embedding.embed_query(text)
        return result

    def search_products(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for products using semantic similarity"""
        db = next(get_db())
        try:
            # Get query embedding
            search_vector = self.get_embedding(query)
            search_vector_text = '[' + ','.join(map(str, search_vector)) + ']'

            # Perform vector similarity search
            sql_query = text("""
                SELECT p.*, pe.document_text,
                       (pe.embedding <=> cast(:query_embedding as vector)) as distance
                FROM products p
                JOIN product_embeddings pe ON p.id = pe.product_id
                ORDER BY pe.embedding <=> cast(:query_embedding as vector)
                LIMIT :limit
            """)

            result = db.execute(sql_query, {
                "query_embedding": search_vector_text,
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

        except Exception as err:
            print(f"Error during semantic search: {err}")
            return []

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
