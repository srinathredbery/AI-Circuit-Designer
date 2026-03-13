from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import uuid
from app.services.kicad_converter import convert_to_kicad_sch

router = APIRouter()

class IdeaInput(BaseModel):
    idea: str

class CircuitModificationRequest(BaseModel):
    current_circuit: Dict[str, Any]
    user_instruction: str

def save_schematic(circuit_json: Dict[str, Any]) -> str:
    sch_content = convert_to_kicad_sch(circuit_json)
    filename = f"schematic_{uuid.uuid4().hex}.kicad_sch"
    filepath = os.path.join("static", "schematics", filename)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(sch_content)
    return f"/static/schematics/{filename}"

import json
from app.llm_gateway.router import route_model, generate_with_llm, ModelProvider
from app.llm_gateway.prompts import SYSTEM_PROMPT_GENERATION, SYSTEM_PROMPT_MODIFICATION

def clean_json_response(raw_response: str) -> Dict[str, Any]:
    # Remove markdown code blocks if the LLM adds them
    cleaned = raw_response.strip()
    if cleaned.startswith("```"):
        # Remove first line
        lines = cleaned.split("\n")
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].startswith("```"):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
    
    try:
        return json.loads(cleaned)
    except Exception as e:
        print(f"Error parsing LLM response: {e}")
        print(f"Raw response: {raw_response}")
        # Return a shell if parsing fails
        return {"version": 1, "schematic": {"name": "Error", "components": [], "connections": []}}

@router.post("/generate")
def generate_circuit(data: IdeaInput, request: Request):
    provider = route_model(data.idea)
    raw_response = generate_with_llm(provider, SYSTEM_PROMPT_GENERATION, data.idea)
    circuit_json = clean_json_response(raw_response)
    
    sch_url = save_schematic(circuit_json)
    base_url = str(request.base_url).rstrip("/")
    return {
        "status": "success", 
        "circuit": circuit_json,
        "schematic_url": f"{base_url}{sch_url}",
        "provider": provider
    }

@router.post("/modify")
def modify_circuit(data: CircuitModificationRequest, request: Request):
    prompt_with_context = SYSTEM_PROMPT_MODIFICATION.format(
        circuit_json=json.dumps(data.current_circuit, indent=2),
        user_instruction=data.user_instruction
    )
    
    provider = route_model(data.user_instruction)
    raw_response = generate_with_llm(provider, "You are a circuit design assistant.", prompt_with_context)
    circuit_json = clean_json_response(raw_response)
    
    sch_url = save_schematic(circuit_json)
    base_url = str(request.base_url).rstrip("/")
    return {
        "status": "success", 
        "circuit": circuit_json,
        "schematic_url": f"{base_url}{sch_url}",
        "provider": provider
    }
