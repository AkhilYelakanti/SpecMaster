/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Layout, 
  Download, 
  Printer, 
  Settings, 
  ChevronRight,
  Plus,
  Trash2,
  FileDown,
  Info,
  Eye,
  CheckCircle2,
  Users,
  Target,
  ShieldCheck,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_SPEC, SpecData, PersonItem, VersionEntry } from './types';
import MarkdownEditor from './components/MarkdownEditor';
import DocumentLayout from './components/DocumentLayout';
import { exportToWord } from './lib/exportUtils';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [data, setData] = useState<SpecData>(DEFAULT_SPEC);
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState('cover');
  const [showTypeSelector, setShowTypeSelector] = useState(true);

  const updateField = (field: keyof SpecData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const selectSpecType = (type: 'new' | 'enhancement') => {
    setData(prev => ({ 
      ...prev, 
      specType: type,
      projectTitle: type === 'new' ? 'NEW PROJECT SPECIFICATION' : 'FIX / ENHANCEMENT SPECIFICATION'
    }));
    setShowTypeSelector(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    await exportToWord(data);
  };

  const addListItem = (field: keyof SpecData) => {
    let newItem: any;
    if (field === 'versions') newItem = { id: crypto.randomUUID(), version: '', date: '', author: '', comments: '' };
    else if (field === 'reviewers' || field === 'approvals') newItem = { id: crypto.randomUUID(), name: '', designation: '', team: '', date: '', comments: '' };
    else if (field === 'processInputs') newItem = { id: crypto.randomUUID(), criteria: '', source: '', processStep: '' };
    else if (field === 'expectedResults') newItem = { id: crypto.randomUUID(), consideration: '', criteria: '', reference: '' };
    else if (field === 'impactingAreas') newItem = { id: crypto.randomUUID(), layer: '', objectName: '', componentId: '', status: '', purpose: '' };
    else if (field === 'dbChanges') newItem = { id: crypto.randomUUID(), type: 'DDL', action: '', tableName: '', description: '' };
    else if (field === 'operationalSupport') newItem = { id: crypto.randomUUID(), component: '', changeType: '', description: '', owner: '' };
    else if (field === 'testCasesList') newItem = { id: crypto.randomUUID(), stage: 'Functional', scenario: '', testData: '', expectedResult: '' };
    else if (field === 'openIssues') newItem = { id: crypto.randomUUID(), issue: '', resolution: '', responsibility: '', targetDate: '' };

    if (newItem) {
      setData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), newItem] }));
    }
  };

  const removeListItem = (field: keyof SpecData, id: string) => {
    setData(prev => ({ ...prev, [field]: (prev[field] as any[]).filter((item: any) => item.id !== id) }));
  };

  const updateListItem = (field: keyof SpecData, id: string, key: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item: any) => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  const sidebarItems = [
    { id: 'cover', label: 'Cover Page', icon: <FileText size={18} /> },
    { id: 'control', label: 'Control & Approvals', icon: <Users size={18} /> },
    { id: 'business', label: 'Business Need', icon: <Target size={18} /> },
    ...(data.specType === 'enhancement' ? [
      { id: 'situation', label: 'Current vs Proposed', icon: <Target size={18} /> }
    ] : []),
    { id: 'scope', label: 'Scope', icon: <ClipboardList size={18} /> },
    { id: 'solution', label: 'Solution Overview', icon: <Layout size={18} /> },
    { id: 'tech', label: 'Technical Solution', icon: <Settings size={18} /> },
    { id: 'db_master', label: 'Database Master', icon: <Settings size={18} /> },
    { id: 'test', label: 'Test Strategy', icon: <CheckCircle2 size={18} /> },
    { id: 'support', label: 'Operational Support', icon: <ShieldCheck size={18} /> },
    { id: 'issues', label: 'Open Issues', icon: <ClipboardList size={18} /> },
    { id: 'addendum', label: 'Addendum', icon: <FileText size={18} /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Type Selector Overlay */}
      {showTypeSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-12 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <FileText size={32} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">What are you building?</h1>
                <p className="text-slate-500 font-medium">Select a template to initialize your technical specification</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <button 
                  onClick={() => selectSpecType('new')}
                  className="group flex flex-col items-center p-8 bg-slate-50 hover:bg-blue-600 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 text-blue-600 group-hover:text-white transition-colors shadow-sm">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">New Project</h3>
                  <p className="text-sm text-slate-500 group-hover:text-blue-100 transition-colors text-center">Complete specification for a brand new system or standalone asset.</p>
                </button>
                
                <button 
                  onClick={() => selectSpecType('enhancement')}
                  className="group flex flex-col items-center p-8 bg-slate-50 hover:bg-orange-600 rounded-3xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 text-orange-600 group-hover:text-white transition-colors shadow-sm">
                    <Settings size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">Fix / Enhancement</h3>
                  <p className="text-sm text-slate-500 group-hover:text-orange-100 transition-colors text-center">Focus on modifications, existing system fixes, or functional upgrades.</p>
                </button>
              </div>
              
              <div className="pt-6">
                <button onClick={() => setShowTypeSelector(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                  Skip for now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Top Navigation - Sleek Pro Style */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10 no-print">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">SpecMaster Pro</span>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-400">Project:</span>
            <span className="text-slate-800 font-bold">{data.projectTitle}</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-slate-600">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Draft Active
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors"
          >
            {view === 'edit' ? 'Full Preview' : 'Back to Editor'}
          </button>
          <button 
            onClick={handleExportWord}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <FileDown size={16} />
            Share Word
          </button>
        </div>
      </nav>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Precise theme style */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 no-print">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-3">Document Structure</h3>
          <div className="space-y-1 overflow-y-auto flex-1">
            {sidebarItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => { setView('edit'); setActiveSection(item.id); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200",
                  activeSection === item.id && view === 'edit'
                    ? "bg-blue-50 text-blue-700 font-bold shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 font-medium"
                )}
              >
                <span className={cn("text-[10px] font-bold", activeSection === item.id && view === 'edit' ? "text-blue-500" : "text-slate-400")}>
                  0{idx + 1}
                </span>
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-tight">Specification Completion</div>
              <div className="w-full h-2 bg-slate-200 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(sidebarItems.findIndex(i => i.id === activeSection) + 1) / sidebarItems.length * 100}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
              <div className="text-[10px] text-slate-400 text-right font-bold">Progress Tracking</div>
            </div>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-white no-print">
          {view === 'edit' ? (
            <>
              <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="hover:text-blue-600 cursor-pointer">Spec Editor</span>
                  <span>/</span>
                  <span className="text-slate-800 font-bold capitalize">{activeSection.replace('-', ' ')}</span>
                </div>
                <div className="flex gap-1">
                  {['B', 'I', 'U', 'H1', '#', '🔗'].map(tool => (
                    <button key={tool} className="p-2 hover:bg-slate-200 rounded text-slate-500 font-mono text-xs transition-colors">
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <AnimatePresence mode="wait">
                  {view === 'edit' ? (
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="max-w-3xl mx-auto pb-20"
                    >
                      {activeSection === 'cover' && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Project Title</label>
                              <input 
                                type="text" 
                                value={data.projectTitle} 
                                onChange={(e) => updateField('projectTitle', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800 shadow-sm"
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                              <input 
                                type="text" 
                                value={data.companyName} 
                                onChange={(e) => updateField('companyName', e.target.value)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Document Subtitle</label>
                            <textarea 
                              rows={4}
                              value={data.documentSubtitle} 
                              onChange={(e) => updateField('documentSubtitle', e.target.value)}
                              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all leading-relaxed text-slate-700 shadow-sm"
                            />
                          </div>
                        </div>
                      )}

                      {activeSection === 'control' && (
                        <div className="space-y-12">
                          <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">Document Versions</h3>
                              <button onClick={() => addListItem('versions')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Versioin
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600">Ver.</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Date</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Author</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Comments</th>
                                    <th className="p-3 text-center"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.versions.map(v => (
                                    <tr key={v.id}>
                                      <td className="p-2 w-16"><input value={v.version} onChange={e => updateListItem('versions', v.id, 'version', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2 w-32"><input value={v.date} onChange={e => updateListItem('versions', v.id, 'date', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2 w-32"><input value={v.author} onChange={e => updateListItem('versions', v.id, 'author', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2"><input value={v.comments} onChange={e => updateListItem('versions', v.id, 'comments', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2 text-center text-red-500 hover:text-red-700 cursor-pointer" onClick={() => removeListItem('versions', v.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>

                          <section className="space-y-4">
                             {/* Repeat for reviewers and approvals - simplified for now */}
                             <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">Document Reviewers</h3>
                              <button onClick={() => addListItem('reviewers')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Reviewer
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600">Name</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Designation</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Team</th>
                                    <th className="p-3 text-center"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.reviewers.map(r => (
                                    <tr key={r.id}>
                                      <td className="p-2"><input value={r.name} onChange={e => updateListItem('reviewers', r.id, 'name', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2"><input value={r.designation} onChange={e => updateListItem('reviewers', r.id, 'designation', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2"><input value={r.team || ''} onChange={e => updateListItem('reviewers', r.id, 'team', e.target.value)} className="w-full p-2 border-none focus:ring-1 focus:ring-blue-500 rounded" /></td>
                                      <td className="p-2 text-center text-red-500 hover:text-red-700 cursor-pointer" onClick={() => removeListItem('reviewers', r.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>
                        </div>
                      )}

                      {activeSection === 'intro' && (
                        <MarkdownEditor value={data.introduction} onChange={(v) => updateField('introduction', v)} label="1. Introduction" />
                      )}

                      {activeSection === 'situation' && (
                        <div className="space-y-8">
                          <MarkdownEditor value={data.currentSituation} onChange={(v) => updateField('currentSituation', v)} label="Current Situation (Existing State)" />
                          <MarkdownEditor value={data.proposedChanges} onChange={(v) => updateField('proposedChanges', v)} label="Proposed Changes (Fix / Enhancement)" />
                        </div>
                      )}

                      {activeSection === 'business' && (
                        <MarkdownEditor value={data.businessNeed} onChange={(v) => updateField('businessNeed', v)} label="2. Basic Business Need" />
                      )}

                      {activeSection === 'scope' && (
                        <div className="space-y-6">
                          <MarkdownEditor value={data.scopeIn} onChange={(v) => updateField('scopeIn', v)} label="3.1 In-scope Content" />
                          <MarkdownEditor value={data.scopeOut} onChange={(v) => updateField('scopeOut', v)} label="3.2 Out-of-scope Content" />
                        </div>
                      )}

                      {activeSection === 'solution' && (
                        <div className="space-y-12">
                           <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">5.1 Process Inputs</h3>
                              <button onClick={() => addListItem('processInputs')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Input
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600">Criteria</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Source</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Step</th>
                                    <th className="p-3"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.processInputs.map(item => (
                                    <tr key={item.id}>
                                      <td className="p-2"><input value={item.criteria} onChange={e => updateListItem('processInputs', item.id, 'criteria', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 w-48"><input value={item.source} onChange={e => updateListItem('processInputs', item.id, 'source', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2"><input value={item.processStep} onChange={e => updateListItem('processInputs', item.id, 'processStep', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeListItem('processInputs', item.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>

                          <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">5.2 Expected Results</h3>
                              <button onClick={() => addListItem('expectedResults')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Result
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600">Consideration</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Criteria</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Reference</th>
                                    <th className="p-3"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.expectedResults.map(item => (
                                    <tr key={item.id}>
                                      <td className="p-2"><input value={item.consideration} onChange={e => updateListItem('expectedResults', item.id, 'consideration', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2"><input value={item.criteria} onChange={e => updateListItem('expectedResults', item.id, 'criteria', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 w-40"><input value={item.reference} onChange={e => updateListItem('expectedResults', item.id, 'reference', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeListItem('expectedResults', item.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>
                        </div>
                      )}

                      {activeSection === 'tech' && (
                        <div className="space-y-12">
                          <MarkdownEditor value={data.technicalApproach} onChange={(v) => updateField('technicalApproach', v)} label="6.1 Technical Specification" />
                          
                          <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">6.2 Impacting Areas</h3>
                              <button onClick={() => addListItem('impactingAreas')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Area
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600">Layer</th>
                                    <th className="p-3 text-left font-bold text-slate-600">ObjectName</th>
                                    <th className="p-3 text-left font-bold text-slate-600">CompID</th>
                                    <th className="p-3"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.impactingAreas.map(item => (
                                    <tr key={item.id}>
                                      <td className="p-2 w-24"><input value={item.layer} onChange={e => updateListItem('impactingAreas', item.id, 'layer', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2"><input value={item.objectName} onChange={e => updateListItem('impactingAreas', item.id, 'objectName', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 w-32"><input value={item.componentId} onChange={e => updateListItem('impactingAreas', item.id, 'componentId', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeListItem('impactingAreas', item.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>

                      {activeSection === 'db_master' && (
                        <div className="space-y-12">
                          <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">Database Changes (DDL/DML)</h3>
                              <button onClick={() => addListItem('dbChanges')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Entry
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600 w-24">Type</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Table/Object</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Action/Field</th>
                                    <th className="p-3"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.dbChanges.map(item => (
                                    <tr key={item.id}>
                                      <td className="p-2">
                                        <select 
                                          value={item.type} 
                                          onChange={e => updateListItem('dbChanges', item.id, 'type', e.target.value)}
                                          className="w-full p-2 bg-slate-50 rounded border-none focus:ring-1 focus:ring-blue-500 text-xs font-bold"
                                        >
                                          <option value="DDL">DDL</option>
                                          <option value="DML">DML</option>
                                          <option value="Index">Index</option>
                                          <option value="Sequence">Sequence</option>
                                        </select>
                                      </td>
                                      <td className="p-2"><input value={item.tableName} onChange={e => updateListItem('dbChanges', item.id, 'tableName', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" placeholder="Table Name..." /></td>
                                      <td className="p-2"><input value={item.action} onChange={e => updateListItem('dbChanges', item.id, 'action', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" placeholder="Action taken..." /></td>
                                      <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeListItem('dbChanges', item.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>

                          <div className="space-y-6">
                            <label className="text-lg font-bold block">Table Scripts (Complete Scripts)</label>
                            <div className="p-4 bg-slate-900 rounded-xl">
                              <textarea
                                value={data.dbScripts}
                                onChange={(e) => updateField('dbScripts', e.target.value)}
                                className="w-full bg-transparent text-blue-300 font-mono text-sm border-none focus:ring-0 min-h-[200px]"
                                placeholder="-- Paste complete table creation scripts here..."
                              />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <label className="text-lg font-bold block">Package / Procedure Changes</label>
                            <div className="p-4 bg-slate-900 rounded-xl">
                              <textarea
                                value={data.dbPackageChanges}
                                onChange={(e) => updateField('dbPackageChanges', e.target.value)}
                                className="w-full bg-transparent text-emerald-400 font-mono text-sm border-none focus:ring-0 min-h-[200px]"
                                placeholder="-- Paste package body or procedure changes here..."
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSection === 'addendum' && (
                        <MarkdownEditor value={data.addendum} onChange={(v) => updateField('addendum', v)} label="Addendum (Additional Information)" />
                      )}
                        </div>
                      )}

                      {activeSection === 'test' && (
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">7. Test Case Specification</h3>
                            <button onClick={() => addListItem('testCasesList')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                              <Plus size={16} /> Add Test Case
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            {data.testCasesList.map(item => (
                              <div key={item.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group">
                                <button onClick={() => removeListItem('testCasesList', item.id)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Testing Stage</label>
                                    <select 
                                      value={item.stage} 
                                      onChange={e => updateListItem('testCasesList', item.id, 'stage', e.target.value)}
                                      className="w-full p-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                                    >
                                      <option value="Functional">Functional</option>
                                      <option value="Integration">Integration (SIT)</option>
                                      <option value="Regression">Regression</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Test Data</label>
                                    <input value={item.testData} onChange={e => updateListItem('testCasesList', item.id, 'testData', e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Scenario ID or simple data..." />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Test Scenario</label>
                                  <textarea value={item.scenario} onChange={e => updateListItem('testCasesList', item.id, 'scenario', e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[60px]" placeholder="Describe the test case..." />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expected Result</label>
                                  <textarea value={item.expectedResult} onChange={e => updateListItem('testCasesList', item.id, 'expectedResult', e.target.value)} className="w-full p-2 bg-slate-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[60px]" placeholder="What should happen?" />
                                </div>
                              </div>
                            ))}
                            {data.testCasesList.length === 0 && (
                              <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
                                No test cases added yet. Click "Add Test Case" to begin.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {activeSection === 'support' && (
                        <div className="space-y-12">
                           <section className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold">8. Operational Support Changes</h3>
                              <button onClick={() => addListItem('operationalSupport')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Component
                              </button>
                            </div>
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                  <tr>
                                    <th className="p-3 text-left font-bold text-slate-600">Component</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Type</th>
                                    <th className="p-3 text-left font-bold text-slate-600">Owner</th>
                                    <th className="p-3"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {data.operationalSupport.map(item => (
                                    <tr key={item.id}>
                                      <td className="p-2"><input value={item.component} onChange={e => updateListItem('operationalSupport', item.id, 'component', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 w-32"><input value={item.changeType} onChange={e => updateListItem('operationalSupport', item.id, 'changeType', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 w-48"><input value={item.owner} onChange={e => updateListItem('operationalSupport', item.id, 'owner', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                      <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeListItem('operationalSupport', item.id)}><Trash2 size={16} /></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </section>
                          <MarkdownEditor value={data.securityCompliance} onChange={(v) => updateField('securityCompliance', v)} label="9. Security & Compliance (Additional Notes)" />
                        </div>
                      )}

                      {activeSection === 'issues' && (
                         <section className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">9. Open Issues</h3>
                            <button onClick={() => addListItem('openIssues')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                              <Plus size={16} /> Add Issue
                            </button>
                          </div>
                          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50 border-b">
                                <tr>
                                  <th className="p-3 text-left font-bold text-slate-600">Issue</th>
                                  <th className="p-3 text-left font-bold text-slate-600">Responsibility</th>
                                  <th className="p-3 text-left font-bold text-slate-600">Date</th>
                                  <th className="p-3"></th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {data.openIssues.map(item => (
                                  <tr key={item.id}>
                                    <td className="p-2"><input value={item.issue} onChange={e => updateListItem('openIssues', item.id, 'issue', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                    <td className="p-2 w-48"><input value={item.responsibility} onChange={e => updateListItem('openIssues', item.id, 'responsibility', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                    <td className="p-2 w-32"><input value={item.targetDate} onChange={e => updateListItem('openIssues', item.id, 'targetDate', e.target.value)} className="w-full p-2 focus:ring-1 focus:ring-blue-500 rounded border-none" /></td>
                                    <td className="p-2 text-red-500 cursor-pointer" onClick={() => removeListItem('openIssues', item.id)}><Trash2 size={16} /></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </section>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="pb-20 pt-4 flex flex-col items-center gap-8 w-full"
                    >
                     <div className="flex gap-4 no-print">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all">
                          <Printer size={18} /> Print as PDF
                        </button>
                        <button onClick={handleExportWord} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold shadow-sm hover:border-blue-500 hover:text-blue-600 transition-all">
                          <FileDown size={18} /> Download Word
                        </button>
                      </div>
                      <div className="w-full flex justify-center bg-slate-200/30 p-12 rounded-3xl border border-slate-100 shadow-inner">
                        <DocumentLayout data={data} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
 </>
          ) : (
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-12 flex justify-center">
               <DocumentLayout data={data} />
            </div>
          )}
        </main>
      </div>

      {/* Print View Wrapper */}
      <div className="hidden print:block absolute inset-0 bg-white z-[100]">
        <DocumentLayout data={data} />
      </div>
    </div>
  );
}
