from enum import Enum

class Provider(Enum):
    OLLAMA = 'ollama'


class Model(Enum):
    DEEPSEEK_R1_8B = "deepseek-r1:8b"
    LLAMA3_1_8B = "llama3.1:latest"
    QWEN3_8B = "qwen3:8b"

