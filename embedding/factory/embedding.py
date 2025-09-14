"""
Embedding Factory
"""
from typing import List
from langchain_ollama import OllamaEmbeddings
from factory.types import Model, Provider
import google.generativeai as genai
import os

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
        self.client = voyageai.Client(api_key=os.getenv("VOYAGE_AI_SECRET"))
    
    def get_embedding(self, text: str) -> List[float]:
        
        result = self.client.embed([text], model="voyage-large-2")
        return result.embeddings[0]

class JinaEmbedding(EmbeddingModel):
    def __init__(self):
        self.api_key = os.getenv("JINA_AI_SECRET")
        self.url = "https://api.jina.ai/v1/embeddings"
    
    def get_embedding(self, text: str) -> List[float]:
        import requests
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


class OllamaEmbeddingModel(EmbeddingModel):
    def __init__(self, provider: Provider = Provider.OLLAMA, model: Model = Model.QWEN3_8B):
        self.provider = Provider.OLLAMA if provider is None else provider
        self.model = Model.QWEN3_8B if model is None else model
        self.embedding = self.get()

    def get(self) -> OllamaEmbeddings:
        if self.provider == Provider.OLLAMA:
            return OllamaEmbeddings(
                model=self.model,
            )

        return None
    
    def get_embedding(self, text):
        vector = self.embedding.embed_query(text)
        return vector

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
        print("Init Ollama model embedding")
        return OllamaEmbeddingModel()