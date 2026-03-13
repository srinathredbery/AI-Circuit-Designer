import os
import json
from enum import Enum
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI
from anthropic import Anthropic

# Load environment variables
load_dotenv()

class ModelProvider(str, Enum):
    LOCAL = "local"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

def get_client(provider: ModelProvider):
    if provider == ModelProvider.OPENAI:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        return OpenAI(api_key=api_key)
    elif provider == ModelProvider.ANTHROPIC:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            return None
        return Anthropic(api_key=api_key)
    return None

def route_model(prompt: str) -> ModelProvider:
    # Check for override
    force = os.getenv("FORCE_PROVIDER")
    if force in [p.value for p in ModelProvider]:
        return ModelProvider(force)

    length = len(prompt)
    if length < 300:
        return ModelProvider.OPENAI  # Default to OpenAI for short prompts
    
    return ModelProvider.ANTHROPIC

def generate_with_llm(model: ModelProvider, system_prompt: str, user_prompt: str) -> str:
    client = get_client(model)
    
    if not client:
        print(f"LLM Gateway: No API key found for {model}. Falling back to mock data.")
        return '{"project_name": "Circuit Error", "schematic": {"name": "Empty", "components": [], "connections": []}}'

    try:
        if model == ModelProvider.OPENAI:
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={ "type": "json_object" }
            )
            return response.choices[0].message.content
        
        elif model == ModelProvider.ANTHROPIC:
            message = client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=4096,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_prompt}
                ]
            )
            # Extract JSON from block if necessary
            content = message.content[0].text
            return content
            
    except Exception as e:
        print(f"LLM Gateway Error ({model}): {str(e)}")
        # Fallback or re-throw
        return '{"error": "LLM failed", "details": "' + str(e).replace('"', "'") + '"}'
    
    return '{"error": "Unsupported provider"}'
