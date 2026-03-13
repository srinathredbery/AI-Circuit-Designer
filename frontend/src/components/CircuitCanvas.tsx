import React from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Group } from 'react-konva';
import type { CircuitDesign, CircuitComponent, Connection } from '../types/circuit';

interface CircuitCanvasProps {
  design: CircuitDesign | null;
  onSelectComponent: (component: CircuitComponent | null) => void;
  selectedId: string | undefined;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({ design, onSelectComponent, selectedId }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 600 });

  React.useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  if (!design) {
    return (
      <div className="w-full h-full bg-[#0f172a] rounded-xl border border-secondary/20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
        <p className="text-secondary font-medium">Generate a circuit to see the visualization.</p>
        <style>{`
          .grid-bg { background-image: radial-gradient(#334155 1px, transparent 1px); background-size: 20px 20px; }
        `}</style>
      </div>
    );
  }

  const renderComponent = (comp: CircuitComponent) => {
    const isSelected = comp.id === selectedId;
    const strokeColor = isSelected ? '#3b82f6' : '#94a3b8';
    
    let shape = null;
    if (comp.type === 'resistor') {
      shape = <Rect x={comp.position.x - 20} y={comp.position.y - 10} width={40} height={20} stroke={strokeColor} strokeWidth={2} fill="#1e293b" />;
    } else if (comp.type === 'led') {
      const color = comp.color || 'red';
      shape = <Circle x={comp.position.x} y={comp.position.y} radius={15} stroke={strokeColor} strokeWidth={2} fill={color} opacity={isSelected ? 1 : 0.8} />;
    } else if (comp.type === 'capacitor') {
      shape = (
        <Group x={comp.position.x} y={comp.position.y}>
           <Line points={[-15, -10, -15, 10]} stroke={strokeColor} strokeWidth={3} />
           <Line points={[15, -10, 15, 10]} stroke={strokeColor} strokeWidth={3} />
        </Group>
      );
    } else {
      shape = <Rect x={comp.position.x - 25} y={comp.position.y - 25} width={50} height={50} stroke={strokeColor} strokeWidth={2} fill="#1e293b" />;
    }

    return (
      <Group 
        key={comp.id} 
        draggable 
        onClick={() => onSelectComponent(comp)}
        onDragEnd={(e) => {
          // Note: Full implementation would lift state up to update coordinates
          console.log(`Dragged ${comp.id} to ${e.target.x()}, ${e.target.y()}`);
        }}
      >
        {shape}
        <Text 
          text={comp.id} 
          x={comp.position.x - 15} 
          y={comp.position.y + 25} 
          fill="#f8fafc" 
          fontSize={12} 
        />
        {comp.value && (
          <Text text={comp.value} x={comp.position.x - 15} y={comp.position.y - 35} fill="#94a3b8" fontSize={10} />
        )}
      </Group>
    );
  };

  const renderConnection = (conn: Connection, index: number) => {
    // In a real app we would compute exact port coordinates. 
    // Here we approximate based on component centers.
    const fromComp = design.components.find(c => conn.from.startsWith(c.id));
    const toComp = design.components.find(c => conn.to.startsWith(c.id));

    if (!fromComp || !toComp) return null;

    return (
      <Line
        key={`conn-${index}`}
        points={[fromComp.position.x, fromComp.position.y, toComp.position.x, toComp.position.y]}
        stroke="#475569"
        strokeWidth={2}
      />
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0f172a] rounded-xl border border-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {design.connections.map(renderConnection)}
          {design.components.map(renderComponent)}
        </Layer>
      </Stage>
      <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-secondary/20">
        <h3 className="text-primary font-bold">{design.project_name}</h3>
      </div>
      <style>{`
        .grid-bg { background-image: radial-gradient(#334155 1px, transparent 1px); background-size: 20px 20px; }
      `}</style>
    </div>
  );
};
