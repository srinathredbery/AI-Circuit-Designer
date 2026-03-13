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

@router.post("/generate")
def generate_circuit(data: IdeaInput, request: Request):
    # Dummy response in the new format
    mock_circuit = {
        "version": 1,
        "schematic": {
            "name": f"AI Generated Circuit: {data.idea[:15]}",
            "components": [
                {
                    "ref": "R1",
                    "value": "1KΩ",
                    "type": "Resistor",
                    "pins": ["1", "2"]
                },
                {
                    "ref": "LED1",
                    "value": "Red LED",
                    "type": "LED",
                    "pins": ["A", "K"]
                }
            ],
            "connections": [
                { "from": "R1.2", "to": "LED1.A" }
            ]
        }
    }
    sch_url = save_schematic(mock_circuit)
    # Get base URL from request
    base_url = str(request.base_url).rstrip("/")
    return {
        "status": "success", 
        "circuit": mock_circuit,
        "schematic_url": f"{base_url}{sch_url}"
    }

@router.post("/modify")
def modify_circuit(data: CircuitModificationRequest, request: Request):
    mock_circuit = data.current_circuit
    if "schematic" in mock_circuit and "components" in mock_circuit["schematic"]:
         mock_circuit["schematic"]["components"].append(
             {
                 "ref": f"C{len(mock_circuit['schematic']['components'])}",
                 "value": "10µF",
                 "type": "Capacitor",
                 "pins": ["1", "2"]
             }
         )
    sch_url = save_schematic(mock_circuit)
    base_url = str(request.base_url).rstrip("/")
    return {
        "status": "success", 
        "circuit": mock_circuit,
        "schematic_url": f"{base_url}{sch_url}"
    }
