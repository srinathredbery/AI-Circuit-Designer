import json
import os
from typing import Dict, Any, List

DATASET_FILE = "ml_dataset.json"

def save_interaction(idea: str, generated_design: Dict[str, Any], user_modifications: List[Any], final_design: Dict[str, Any]):
    """
    Saves an interaction for future ML model training.
    """
    record = {
        "idea": idea,
        "generated_design": generated_design,
        "user_modifications": user_modifications,
        "final_design": final_design
    }
    
    data = []
    if os.path.exists(DATASET_FILE):
        with open(DATASET_FILE, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                pass
                
    data.append(record)
    
    with open(DATASET_FILE, "w") as f:
        json.dump(data, f, indent=2)
