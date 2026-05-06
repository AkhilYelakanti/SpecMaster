/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Layout, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  Copy, 
  Calendar, 
  Tag, 
  ArrowLeft,
  ChevronRight,
  Plus,
  History,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomTemplate, SpecData } from '../types';
import { cn } from '../lib/utils';

interface TemplateManagerProps {
  templates: CustomTemplate[];
  onUpdateTemplate: (id: string, updates: Partial<CustomTemplate>) => void;
  onDeleteTemplate: (id: string) => void;
  onDuplicateTemplate: (template: CustomTemplate) => void;
  onBack: () => void;
  onSelect: (template: CustomTemplate) => void;
}

export default function TemplateManager({ 
  templates, 
  onUpdateTemplate, 
  onDeleteTemplate, 
  onDuplicateTemplate,
  onBack,
  onSelect
}: TemplateManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', version: '' });

  const handleStartEdit = (tpl: CustomTemplate) => {
    setEditingId(tpl.id);
    setEditForm({ 
      name: tpl.name, 
      description: tpl.description, 
      version: tpl.version || '1.0' 
    });
  };

  const handleSaveEdit = (id: string) => {
    onUpdateTemplate(id, { 
      name: editForm.name, 
      description: editForm.description, 
      version: editForm.version,
      updatedAt: new Date().toISOString()
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg p-8 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 bg-white shadow-sm border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-brand-teal transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-brand-dark uppercase">Template Repository</h1>
              <p className="text-slate-500 font-medium">Manage and organize your custom specification blueprints</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 rounded-xl border border-brand-cyan/20">
            <Tag size={14} className="text-brand-cyan" />
            <span className="text-xs font-bold text-brand-dark">{templates.length} Active Blueprints</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats / Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-brand-cyan/10 shadow-xl shadow-brand-cyan/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Template Health</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center text-brand-teal">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total Spec Types</p>
                      <p className="text-xl font-black text-brand-dark">{templates.length}</p>
                    </div>
                  </div>
                </div>
                <div className="h-px bg-slate-50" />
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization Tips</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-500 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1" />
                      Use clear naming for different project phases
                    </li>
                    <li className="flex items-start gap-2 text-xs font-medium text-slate-500 italic">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1" />
                      Keep reusable descriptions for consistent indexing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Template List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2 px-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</h3>
              <div className="text-[10px] font-black text-slate-400">Sort by: Date Modified</div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {templates.map((tpl) => (
                  <motion.div 
                    layout
                    key={tpl.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-brand-cyan/20 transition-all duration-300 group"
                  >
                    {editingId === tpl.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</label>
                            <input 
                              type="text" 
                              value={editForm.name}
                              onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all font-bold"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</label>
                            <input 
                              type="text" 
                              value={editForm.version}
                              onChange={(e) => setEditForm(p => ({ ...p, version: e.target.value }))}
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                          <textarea 
                            value={editForm.description}
                            onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-cyan outline-none transition-all min-h-[60px]"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleSaveEdit(tpl.id)} className="flex-1 py-3 bg-brand-cyan text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-teal transition-all">
                            <Save size={16} /> Save Changes
                          </button>
                          <button onClick={() => setEditingId(null)} className="w-[120px] py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-brand-bg text-brand-teal rounded-2xl flex items-center justify-center shrink-0">
                            <Layout size={24} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xl font-black text-brand-dark group-hover:text-brand-cyan transition-colors truncate">
                              {tpl.name}
                            </h4>
                            <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">
                              {tpl.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase">v{tpl.version || '1.0'}</span>
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 tracking-tight">
                                <Calendar size={12} /> Updated: {tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : 'Original'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-100">
                          <button 
                            onClick={() => handleStartEdit(tpl)}
                            title="Edit Metadata"
                            className="p-3 text-slate-500 hover:text-brand-cyan hover:bg-white rounded-xl transition-all"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => onDuplicateTemplate(tpl)}
                            title="Duplicate"
                            className="p-3 text-slate-500 hover:text-brand-cyan hover:bg-white rounded-xl transition-all"
                          >
                            <Copy size={18} />
                          </button>
                          <div className="w-px h-6 bg-slate-200 mx-1" />
                          <button 
                            onClick={() => onSelect(tpl)}
                            className="px-6 py-3 bg-brand-cyan text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-teal transition-all shadow-lg shadow-brand-cyan/20"
                          >
                            Initialize
                          </button>
                          <div className="w-px h-6 bg-slate-200 mx-1" />
                          <button 
                            onClick={() => onDeleteTemplate(tpl.id)}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {templates.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                      <Layout size={40} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-400 tracking-tight">No Templates Found</h3>
                      <p className="text-sm font-medium text-slate-500">Save your drafts as templates to see them here.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
