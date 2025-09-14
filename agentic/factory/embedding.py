"""
Embedding Factory
"""
from typing import List
from enum import Enum
from langchain_ollama import OllamaEmbeddings
from agentic.factory.types import Model, Provider

class EmbeddingModel:
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
