import type { CircuitDesign, LLMResponse } from '../types/circuit';

const API_BASE_URL = 'http://localhost:8000/api';

export const generateCircuit = async (idea: string): Promise<LLMResponse | CircuitDesign> => {
  try {
    const response = await fetch(`${API_BASE_URL}/circuits/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idea }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate circuit');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating circuit:', error);
    throw error;
  }
};

export const modifyCircuit = async (currentCircuit: CircuitDesign, instruction: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/circuits/modify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        current_circuit: currentCircuit,
        user_instruction: instruction
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to modify circuit');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error modifying circuit:', error);
    throw error;
  }
};
