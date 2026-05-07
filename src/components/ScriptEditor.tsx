import React from 'react';

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "Write your script or code here..." 
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] font-bold text-slate-500 dark:text-dark-muted uppercase tracking-wider pl-1">{label}</label>}
      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[300px] p-6 bg-slate-900 border border-slate-800 rounded-2xl text-emerald-400 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y shadow-inner leading-relaxed"
          placeholder={placeholder}
          spellCheck={false}
        />
        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-700 uppercase pointer-events-none group-hover:text-slate-600 transition-colors">
          Mono Script Mode
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;
