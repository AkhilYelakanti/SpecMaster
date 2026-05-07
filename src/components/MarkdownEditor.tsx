/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Eye, 
  Code, 
  Sparkles, 
  Loader2, 
  Wand2, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Heading3,
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Table as TableIcon,
  Undo,
  Redo
} from 'lucide-react';
import { suggestContent, improveContent, isAiConfigured } from '../services/geminiService';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // History management
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isInternalChange, setIsInternalChange] = useState(false);

  // Track history
  React.useEffect(() => {
    if (isInternalChange) {
      setIsInternalChange(false);
      return;
    }

    // Only push if content actually changed
    if (value === history[historyIndex]) return;

    const timer = setTimeout(() => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      // Keep last 50 states
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, history, historyIndex, isInternalChange]);

  const undo = () => {
    if (historyIndex > 0) {
      setIsInternalChange(true);
      const newValue = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onChange(newValue);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setIsInternalChange(true);
      const newValue = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onChange(newValue);
    }
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newValue = before + prefix + selectedText + suffix + after;
    onChange(newValue);

    // Re-focus and set selection
    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + selectedText.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 10);
  };

  const insertTable = () => {
    const tableTemplate = `
| Feature | Description | Status | Priority |
| :--- | :--- | :---: | :--- |
| **Auth** | OAuth2 logic | ✅ | High |
| **API** | GraphQL Layer | ⏳ | Medium |
| **UI** | React Components | 🚀 | High |
`;
    insertFormat('\n' + tableTemplate + '\n');
  };

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
      {label && <label className="block text-[10px] font-bold text-blue-600 dark:text-brand-cyan uppercase tracking-wider">{label}</label>}
      <div className="border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden bg-white dark:bg-dark-surface shadow-sm ring-1 ring-slate-200 dark:ring-dark-border focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-brand-cyan transition-all">
        <div className="bg-slate-50/80 dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-slate-200/50 dark:bg-dark-bg p-1 rounded-lg">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                mode === 'edit' ? 'bg-white dark:bg-dark-surface text-blue-600 dark:text-brand-cyan shadow-sm' : 'text-slate-500 dark:text-dark-muted hover:text-slate-800 dark:hover:text-white'
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
                mode === 'preview' ? 'bg-white dark:bg-dark-surface text-blue-600 dark:text-brand-cyan shadow-sm' : 'text-slate-500 dark:text-dark-muted hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Eye size={14} />
                Preview
              </div>
            </button>
          </div>

          {mode === 'edit' && (
            <div className="flex items-center border-l border-slate-300 dark:border-dark-border pl-4 h-6 gap-1">
              <button 
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors disabled:opacity-30" 
                title="Undo (Ctrl+Z)"
              >
                <Undo size={14} />
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex === history.length - 1}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors disabled:opacity-30" 
                title="Redo (Ctrl+Y)"
              >
                <Redo size={14} />
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-dark-border mx-1"></div>
              <button 
                onClick={() => insertFormat('**', '**')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="Bold"
              >
                <Bold size={14} />
              </button>
              <button 
                onClick={() => insertFormat('*', '*')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="Italic"
              >
                <Italic size={14} />
              </button>
              <button 
                onClick={() => insertFormat('# ')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="H1"
              >
                <Heading1 size={14} />
              </button>
              <button 
                onClick={() => insertFormat('## ')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="H2"
              >
                <Heading2 size={14} />
              </button>
              <button 
                onClick={() => insertFormat('### ')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="H3"
              >
                <Heading3 size={14} />
              </button>
              <button 
                onClick={insertTable} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="Insert Table"
              >
                <TableIcon size={14} />
              </button>
              <button 
                onClick={() => insertFormat('- ')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="Bullet List"
              >
                <List size={14} />
              </button>
              <button 
                onClick={() => insertFormat('1. ')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="Numbered List"
              >
                <ListOrdered size={14} />
              </button>
              <button 
                onClick={() => insertFormat('[', '](url)')} 
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-dark-bg rounded text-slate-600 dark:text-dark-muted transition-colors" 
                title="Link"
              >
                <LinkIcon size={14} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {context && (
              <button
                onClick={handleAiSuggest}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-brand-cyan dark:to-cyan-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-sm"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Suggest
                {!isAiConfigured() && <span className="ml-1 px-1 bg-white/20 rounded text-[8px]">Demo</span>}
              </button>
            )}
            {value && (
              <button
                onClick={handleAiImprove}
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-brand-cyan bg-blue-50 dark:bg-dark-bg border border-blue-100 dark:border-dark-border rounded-lg hover:bg-blue-100 dark:hover:bg-dark-border disabled:opacity-50 transition-all"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                Rewrite
                {!isAiConfigured() && <span className="ml-1 px-1 bg-blue-100 dark:bg-dark-surface rounded text-[8px]">Demo</span>}
              </button>
            )}
            <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-dark-muted font-bold hidden sm:inline">Standardized Formatting • Paste Images</span>
          </div>
        </div>

        {mode === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={(e) => {
              if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                  if (e.shiftKey) {
                    e.preventDefault();
                    redo();
                  } else {
                    e.preventDefault();
                    undo();
                  }
                } else if (e.key === 'y') {
                  e.preventDefault();
                  redo();
                }
              }
            }}
            className="w-full min-h-[300px] p-6 text-sm font-mono text-slate-700 dark:text-dark-text leading-relaxed focus:outline-none resize-y bg-slate-50/30 dark:bg-dark-bg transition-colors"
            placeholder="Start typing specification content... (Tip: Paste images directly!)"
          />
        ) : (
          <div className="p-8 min-h-[300px] markdown-body bg-white dark:bg-dark-surface transition-colors">
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
