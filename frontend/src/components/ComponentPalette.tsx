import React from 'react';
import { PlusCircle } from 'lucide-react';

export const ComponentPalette: React.FC = () => {
  const components = [
    { type: 'resistor', label: 'Resistor' },
    { type: 'capacitor', label: 'Capacitor' },
    { type: 'led', label: 'LED' },
    { type: '555_timer', label: '555 Timer IC' },
    { type: 'battery', label: 'Battery' },
  ];

  return (
    <div className="bg-surface p-4 rounded-xl shadow-lg border border-secondary/20 h-full">
      <h3 className="font-semibold text-text text-lg mb-4">Palette</h3>
      <div className="grid grid-cols-2 gap-2">
        {components.map(comp => (
          <button 
            key={comp.type}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-secondary/30 bg-background hover:border-primary/50 hover:bg-primary/5 transition-all group"
            title="Drag to canvas (Feature coming soon)"
          >
            <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
              <PlusCircle className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs text-muted group-hover:text-text">{comp.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
