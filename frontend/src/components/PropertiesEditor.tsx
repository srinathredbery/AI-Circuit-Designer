import React from 'react';
import type { CircuitComponent } from '../types/circuit';
import { Settings, PenTool } from 'lucide-react';

interface PropertiesEditorProps {
  selectedComponent: CircuitComponent | null;
  onUpdate: (updated: CircuitComponent) => void;
}

export const PropertiesEditor: React.FC<PropertiesEditorProps> = ({ selectedComponent, onUpdate }) => {
  if (!selectedComponent) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-lg border border-secondary/20 h-full flex flex-col items-center justify-center text-center opacity-70">
        <Settings className="w-12 h-12 text-muted mb-4 opacity-50" />
        <p className="text-muted">Select a component on the canvas to edit its properties.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg border border-secondary/20 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-secondary/20 pb-4">
        <PenTool className="text-primary w-5 h-5" />
        <h3 className="font-semibold text-text text-lg">Properties</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-1">ID (RefDes)</label>
          <input 
            type="text" 
            value={selectedComponent.id} 
            disabled
            className="w-full bg-background border border-secondary/30 rounded-lg p-2.5 text-text opacity-70 cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted mb-1">Type</label>
          <input 
            type="text" 
            value={selectedComponent.type}
            disabled
            className="w-full bg-background border border-secondary/30 rounded-lg p-2.5 text-text opacity-70 cursor-not-allowed uppercase"
          />
        </div>

        {selectedComponent.value !== undefined && (
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Value</label>
            <input 
              type="text" 
              value={selectedComponent.value}
              onChange={(e) => onUpdate({...selectedComponent, value: e.target.value})}
              className="w-full bg-background border border-secondary/30 outline-none focus:border-primary rounded-lg p-2.5 text-text transition-colors"
            />
          </div>
        )}

        {selectedComponent.color !== undefined && (
          <div>
            <label className="block text-sm font-medium text-muted mb-1">Color</label>
            <input 
              type="text" 
              value={selectedComponent.color}
              onChange={(e) => onUpdate({...selectedComponent, color: e.target.value})}
              className="w-full bg-background border border-secondary/30 outline-none focus:border-primary rounded-lg p-2.5 text-text transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
};
