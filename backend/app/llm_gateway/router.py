from enum import Enum

class ModelProvider(str, Enum):
    LOCAL = "local"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

def route_model(prompt: str) -> ModelProvider:
    length = len(prompt)
    
    if length < 300:
        return ModelProvider.LOCAL
    if length < 1000:
        return ModelProvider.OPENAI
    
    return ModelProvider.ANTHROPIC

def generate_with_llm(model: ModelProvider, prompt: str) -> str:
    # TODO: Actual LLM calls
    # For now, it returns a mock JSON response as string to simulate LLM completion
    return '{"project_name": "Mock Circuit", "components": [], "connections": []}'
