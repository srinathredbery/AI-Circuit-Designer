export interface Position {
  x: number;
  y: number;
}

export interface CircuitComponent {
  id: string;
  type: 'resistor' | 'capacitor' | 'led' | '555_timer' | 'battery' | 'wire' | string;
  value?: string;
  color?: string;
  position: Position;
}

export interface Connection {
  from: string;
  to: string;
}

export interface LLMComponent {
  ref: string;
  value: string;
  type: string;
  pins: string[];
}

export interface LLMConnection {
  from: string;
  to: string;
}

export interface LLMSchematic {
  name: string;
  components: LLMComponent[];
  connections: LLMConnection[];
}

export interface LLMResponse {
  version: number;
  schematic: LLMSchematic;
}

export interface APIResponse {
  status: string;
  circuit: LLMResponse;
  schematic_url?: string;
}

export interface CircuitDesign {
  project_name: string;
  components: CircuitComponent[];
  connections: Connection[];
  raw_llm_response?: LLMResponse;
}
