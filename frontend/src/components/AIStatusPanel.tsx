import React from 'react';
import { Mic, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIStatusPanelProps {
  status: 'idle' | 'generating' | 'validating' | 'error' | 'success';
  message: string;
}

export const AIStatusPanel: React.FC<AIStatusPanelProps> = ({ status, message }) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'generating': return { icon: <Activity className="w-5 h-5 animate-pulse text-primary"/>, bg: 'bg-primary/10', border: 'border-primary/30', color: 'text-primary' };
      case 'validating': return { icon: <Activity className="w-5 h-5 animate-spin text-yellow-500"/>, bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', color: 'text-yellow-500' };
      case 'success': return { icon: <CheckCircle className="w-5 h-5 text-green-500"/>, bg: 'bg-green-500/10', border: 'border-green-500/30', color: 'text-green-500' };
      case 'error': return { icon: <AlertTriangle className="w-5 h-5 text-red-500"/>, bg: 'bg-red-500/10', border: 'border-red-500/30', color: 'text-red-500' };
      default: return { icon: <Mic className="w-5 h-5 text-muted"/>, bg: 'bg-surface', border: 'border-secondary/20', color: 'text-muted' };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${config.bg} ${config.border}`}>
      {config.icon}
      <span className={`text-sm font-medium ${config.color}`}>{message}</span>
    </div>
  );
}
