/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Code, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { suggestContent, improveContent } from '../services/geminiService';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  context?: {
    projectTitle: string;
    projectSubtitle: string;
    sectionName: string;
  };
}

export default function MarkdownEditor({ value, onChange, label, id, context }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiSuggest = async () => {
    if (!context) return;
    setIsGenerating(true);
    try {
      const suggestion = await suggestContent(context.sectionName, context.projectTitle, context.projectSubtitle, value);
      if (suggestion) {
        onChange(suggestion);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAiImprove = async () => {
    if (!value) return;
    setIsGenerating(true);
    try {
      const improved = await improveContent(value);
      if (improved) {
        onChange(improved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const imageTag = `\n\n![Pasted Image](${base64})\n\n`;
          onChange(value + imageTag);
          setMode('edit');
        };
        reader.readAsDataURL(file);
        e.preventDefault();
      }
    }
  };

  return (
    <div id={id} className="space-y-3">
      {label && <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-wider">{label}</label>}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <div className="bg-slate-50/80 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                mode === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Code size={14} />
                Markdown
              </div>
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                mode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Eye size={14} />
                Preview
              </div>
            </button>
          </div>
          <div className="flex items-center gap-2">
            {context && (
              <button
                onClick={handleAiSuggest}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Suggest
              </button>
            )}
            {value && (
              <button
                onClick={handleAiImprove}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                Rewrite
              </button>
            )}
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold hidden sm:inline">Standardized Formatting • Paste Images</span>
          </div>
        </div>

        {mode === 'edit' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            className="w-full min-h-[300px] p-6 text-sm font-mono text-slate-700 leading-relaxed focus:outline-none resize-y bg-slate-50/30"
            placeholder="Start typing specification content... (Tip: Paste images directly!)"
          />
        ) : (
          <div className="p-8 min-h-[300px] markdown-body bg-white">
            <ReactMarkdown
              urlTransform={(url) => url.startsWith('data:') ? url : url}
            >
              {value || '*Start typing to see the live preview...*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
