"""
Embedding Model Factory
"""
import os
import google.generativeai as genai
from typing import List

class EmbeddingModel:
    def get_embedding(self, text: str) -> List[float]:
        raise NotImplementedError

class GeminiEmbedding(EmbeddingModel):
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    
    def get_embedding(self, text: str) -> List[float]:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']

class VoyageEmbedding(EmbeddingModel):
    def __init__(self):
        import voyageai
        self.client = voyageai.Client(api_key=os.getenv("VOYAGE_API_KEY"))
    
    def get_embedding(self, text: str) -> List[float]:
        result = self.client.embed([text], model="voyage-large-2")
        return result.embeddings[0]

class JinaEmbedding(EmbeddingModel):
    def __init__(self):
        import requests
        self.api_key = os.getenv("JINA_API_KEY")
        self.url = "https://api.jina.ai/v1/embeddings"
    
    def get_embedding(self, text: str) -> List[float]:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        data = {
            "model": "jina-embeddings-v2-base-en",
            "input": [text]
        }
        response = requests.post(self.url, headers=headers, json=data)
        return response.json()["data"][0]["embedding"]

def create_embedding_model() -> EmbeddingModel:
    """Factory function to create embedding model based on EMBEDDING_MODEL env var"""
    model_type = os.getenv("EMBEDDING_MODEL", "gemini").lower()
    
    if model_type == "gemini":
        return GeminiEmbedding()
    elif model_type == "voyage":
        return VoyageEmbedding()
    elif model_type == "jina":
        return JinaEmbedding()
    else:
        raise ValueError(f"Unsupported embedding model: {model_type}")