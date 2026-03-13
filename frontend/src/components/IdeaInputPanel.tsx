import React, { useState } from 'react';
import { Send, Cpu, Zap } from 'lucide-react';

interface IdeaInputPanelProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export const IdeaInputPanel: React.FC<IdeaInputPanelProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      onSubmit(idea);
    }
  };

  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg border border-secondary/20">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="text-primary w-6 h-6" />
        <h2 className="text-xl font-bold text-text">AI Circuit Designer</h2>
      </div>
      <p className="text-muted text-sm mb-4">
        Describe the electronic circuit you want to build, and our AI will generate a structured design for you.
      </p>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. Create a simple LED blinking circuit using a 555 timer powered by a 9V battery."
          className="w-full bg-background border border-secondary/30 rounded-lg p-4 text-text placeholder-muted/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-32"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 text-white p-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Cpu className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span>Generate</span>
        </button>
      </form>
    </div>
  );
};
