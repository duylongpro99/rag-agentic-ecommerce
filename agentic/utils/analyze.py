from agentic.factory.types import Model


class AnalyzeResponse:
    def __init__(self, content, message='', reasoning=''):
        self.content = content
        self.message = message
        self.reasoning = reasoning

    def refine(self, llm_model: Model):
        if llm_model == Model.QWEN3_8B.value:
            if "</think>" in self.content:
                parts = self.content.split("</think>")
                self.reasoning = parts[0].split("<think>")[1].strip()
                self.message = parts[1].strip()
            else:
                self.message = self.content.strip()
                self.reasoning = ''
        else:
            self.message = self.content
