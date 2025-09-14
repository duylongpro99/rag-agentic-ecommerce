"""
LLM/SLM Models Factory
"""
from typing import List
from enum import Enum
from langchain_ollama import ChatOllama
from agentic.factory.types import Model, Provider 

class LLMModel:
    def __init__(self, provider: Provider = Provider.OLLAMA, model: Model = Model.QWEN3_8B):
        self.provider = Provider.OLLAMA if provider is None else provider
        self.model = Model.QWEN3_8B if model is None else model

    def get(self) -> List[float]:
        if self.provider == Provider.OLLAMA:
            return ChatOllama(
                model=self.model,
            )

        return None
