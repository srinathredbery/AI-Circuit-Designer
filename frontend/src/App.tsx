import React, { useState } from 'react';
import { IdeaInputPanel } from './components/IdeaInputPanel';
import { CircuitCanvas } from './components/CircuitCanvas';
import { ComponentPalette } from './components/ComponentPalette';
import { PropertiesEditor } from './components/PropertiesEditor';
import { AIStatusPanel } from './components/AIStatusPanel';
import type { CircuitDesign, CircuitComponent, LLMResponse, APIResponse } from './types/circuit';
import { generateCircuit, modifyCircuit } from './services/api';
import { KiCanvasViewer } from './components/KiCanvasViewer';
import { convertToKicadSch } from './services/kicad_utils';

function App() {
  const [design, setDesign] = useState<CircuitDesign | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [status, setStatus] = useState<'idle' | 'generating' | 'validating' | 'error' | 'success'>('idle');
  const [statusMessage, setStatusMessage] = useState('Ready for your ideas');
  const [modificationInput, setModificationInput] = useState('');
  const [schContent, setSchContent] = useState<string>('');
  const [schUrl, setSchUrl] = useState<string>('');

  const handleGenerate = async (idea: string) => {
    setStatus('generating');
    setStatusMessage('AI is designing your circuit...');
    setSelectedComponent(null);
    setSchUrl('');
    try {
      const data = await generateCircuit(idea) as APIResponse;
      const result = data.circuit;
      
      if (result.schematic) {
        if (data.schematic_url) {
          setSchUrl(data.schematic_url);
        } else {
          const sch = convertToKicadSch(result);
          setSchContent(sch);
        }
        
        setDesign({
          project_name: result.schematic.name,
          components: [],
          connections: [],
          raw_llm_response: result
        });
      } else {
        // Handle unexpected format if necessary
        setDesign(null);
      }
      
      setStatus('success');
      setStatusMessage('Circuit generated successfully!');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('Ready for modifications or new ideas');
      }, 3000);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setStatusMessage('Failed to generate circuit. Please try again.');
    }
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationInput.trim() || !design) return;

    setStatus('validating');
    setStatusMessage('AI is modifying the circuit...');
    try {
      const data = await modifyCircuit(design, modificationInput) as APIResponse;
      const result = data.circuit;
      
      if (result.schematic) {
        if (data.schematic_url) {
          setSchUrl(data.schematic_url);
        } else {
          const sch = convertToKicadSch(result);
          setSchContent(sch);
        }
        setDesign({
          ...design,
          project_name: result.schematic.name,
          raw_llm_response: result
        });
      }

      setModificationInput('');
      setStatus('success');
      setStatusMessage('Circuit updated successfully!');
      
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('Ready for modifications or new ideas');
      }, 3000);
    } catch (e) {
      console.error(e);
      setStatus('error');
      setStatusMessage('Failed to modify circuit.');
    }
  };

  const handleUpdateComponent = (updated: CircuitComponent) => {
    if (!design) return;
    const newComponents = design.components.map(c => 
      c.id === updated.id ? updated : c
    );
    setDesign({ ...design, components: newComponents });
    setSelectedComponent(updated);
  };

  const isLoading = status === 'generating' || status === 'validating';

  return (
    <div className="min-h-screen flex flex-col p-4 gap-4 max-w-[1600px] mx-auto">
      {/* Header Area */}
      <header className="flex gap-4 min-h-[200px]">
        <div className="flex-1">
          <IdeaInputPanel 
            onSubmit={handleGenerate} 
            isLoading={isLoading} 
          />
        </div>
        <div className="w-[300px] hidden md:block">
          <AIStatusPanel status={status} message={statusMessage} />
          
          {design && (
            <div className="mt-4 bg-surface p-4 rounded-xl border border-secondary/20 shadow-lg">
              <h3 className="text-sm font-semibold text-text mb-2">Modify Design</h3>
              <form onSubmit={handleModify} className="flex gap-2">
                <input 
                  type="text" 
                  value={modificationInput}
                  onChange={(e) => setModificationInput(e.target.value)}
                  placeholder="e.g. Add a capacitor..."
                  className="w-full bg-background border border-secondary/30 rounded p-2 text-sm text-text focus:border-primary outline-none"
                  disabled={status === 'validating'}
                />
                <button 
                   type="submit"
                   disabled={status === 'validating' || !modificationInput.trim()}
                   className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
                >
                  Update
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex gap-4 min-h-[500px]">
        {/* Left Sidebar: Palette */}
        <aside className="w-[250px] flex-shrink-0">
          <ComponentPalette />
        </aside>

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-background rounded-xl border border-secondary/20">
          {isLoading && (
            <div className="absolute inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-secondary text-sm font-medium animate-pulse">{statusMessage}</p>
            </div>
          )}
          
          {(schUrl || schContent) ? (
            <KiCanvasViewer schContent={schContent} src={schUrl} />
          ) : (
            <CircuitCanvas 
              design={design} 
              selectedId={selectedComponent?.id}
              onSelectComponent={setSelectedComponent}
            />
          )}
        </div>

        {/* Right Sidebar: Properties */}
        <aside className="w-[300px] flex-shrink-0">
          <PropertiesEditor 
            selectedComponent={selectedComponent}
            onUpdate={handleUpdateComponent}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
