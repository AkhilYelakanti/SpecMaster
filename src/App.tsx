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
  ClipboardList,
  Sparkles, 
  Wand2, 
  Loader2,
  Upload,
  CheckCircle,
  Save,
  Layers,
  Bookmark
} from 'lucide-react';
import { generateTestCases, isAiConfigured } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef } from 'react';
import { DEFAULT_SPEC, SpecData, PersonItem, VersionEntry, CustomTemplate } from './types';
import MarkdownEditor from './components/MarkdownEditor';
import DocumentLayout from './components/DocumentLayout';
import Dashboard, { Logo } from './components/Dashboard';
import { exportToWord, exportToPDF } from './lib/exportUtils';
import { cn } from './lib/utils';


export default function App() {
  const [data, setData] = useState<SpecData>(() => {
    const saved = localStorage.getItem('specmaster_draft');
    if (!saved) return DEFAULT_SPEC;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SPEC,
        ...parsed,
        customSections: parsed.customSections || []
      };
    } catch (e) {
      return DEFAULT_SPEC;
    }
  });
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>(() => {
    const saved = localStorage.getItem('specmaster_templates');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentDrafts, setRecentDrafts] = useState<{ id: string, title: string, date: string, data: SpecData }[]>(() => {
    const saved = localStorage.getItem('specmaster_recent_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [page, setPage] = useState<'dashboard' | 'editor'>('dashboard');
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [activeSection, setActiveSection] = useState('cover');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showTemplateSaver, setShowTemplateSaver] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', description: '' });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to top when changing page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    localStorage.setItem('specmaster_draft', JSON.stringify(data));
    setLastSaved(new Date());

    // Update or add to recent drafts
    if (data.projectTitle && data.projectTitle !== DEFAULT_SPEC.projectTitle) {
      setRecentDrafts(prev => {
        const existing = prev.find(d => d.title === data.projectTitle);
        const entry = {
          id: existing?.id || crypto.randomUUID(),
          title: data.projectTitle,
          date: new Date().toLocaleDateString(),
          data: data
        };
        const updated = existing 
          ? prev.map(d => d.id === existing.id ? entry : d)
          : [entry, ...prev].slice(0, 5);
        
        localStorage.setItem('specmaster_recent_sessions', JSON.stringify(updated));
        return updated;
      });
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('specmaster_templates', JSON.stringify(customTemplates));
  }, [customTemplates]);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.projectTitle.replace(/\s+/g, '_')}_Spec_Draft.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement> | string) => {
    let content = "";
    const processContent = (jsonString: string) => {
      try {
        const importedData = JSON.parse(jsonString);
        // Robust merge with default spec to handle missing fields in older versions
        const mergedData = {
          ...DEFAULT_SPEC,
          ...importedData,
          // Deep merge simple arrays if needed, or just ensure they exist
          customSections: importedData.customSections || [],
          versions: importedData.versions || DEFAULT_SPEC.versions,
          reviewers: importedData.reviewers || [],
          approvals: importedData.approvals || [],
          processInputs: importedData.processInputs || [],
          expectedResults: importedData.expectedResults || [],
          impactingAreas: importedData.impactingAreas || [],
          dbChanges: importedData.dbChanges || [],
          testCasesList: importedData.testCasesList || [],
          operationalSupport: importedData.operationalSupport || [],
          openIssues: importedData.openIssues || []
        };
        setData(mergedData);
        setPage('editor');
        setShowTypeSelector(false);
      } catch (err) {
        alert("Invalid Spec JSON file: " + (err instanceof Error ? err.message : "Parsing error"));
      }
    };

    if (typeof e === 'string') {
      processContent(e);
    } else {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        processContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const isSectionComplete = (sectionId: string): boolean => {
    switch (sectionId) {
      case 'cover': return !!data.projectTitle && !!data.documentSubtitle;
      case 'control': return data.versions.length > 0 || data.reviewers.length > 0;
      case 'intro': return !!data.introduction && data.introduction.length > 20;
      case 'business': return !!data.businessNeed && data.businessNeed.length > 20;
      case 'situation': return !!data.currentSituation && !!data.proposedChanges;
      case 'scope': return !!data.scopeIn;
      case 'solution': return data.processInputs.length > 0 || data.expectedResults.length > 0;
      case 'tech': return !!data.technicalApproach || data.impactingAreas.length > 0;
      case 'db_master': return data.dbChanges.length > 0 || !!data.dbScripts;
      case 'test': return data.testCasesList.length > 0;
      case 'support': return data.operationalSupport.length > 0 || !!data.securityCompliance;
      case 'issues': return data.openIssues.length > 0;
      case 'addendum': return !!data.addendum;
      default: return false;
    }
  };

  const [isGeneratingTests, setIsGeneratingTests] = useState(false);

  const getAiContext = (sectionName: string) => ({
    projectTitle: data.projectTitle,
    projectSubtitle: data.documentSubtitle,
    sectionName
  });

  const handleAiGenerateTests = async () => {
    setIsGeneratingTests(true);
    try {
      const scenarios = await generateTestCases(data.businessNeed, data.proposedChanges || data.introduction);
      if (scenarios && Array.isArray(scenarios)) {
        const newTests = scenarios.map((s: any) => ({
          id: crypto.randomUUID(),
          stage: s.stage || 'Functional',
          scenario: s.scenario || '',
          testData: '',
          expectedResult: s.expectedResult || ''
        }));
        setData(prev => ({ ...prev, testCasesList: [...prev.testCasesList, ...newTests] }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingTests(false);
    }
  };

  const updateField = (field: keyof SpecData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const saveAsTemplate = (name: string, description: string) => {
    const newTemplate: CustomTemplate = {
      id: crypto.randomUUID(),
      name,
      description,
      data: { ...data, projectTitle: name }
    };
    setCustomTemplates(prev => [...prev, newTemplate]);
  };

  const deleteTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomTemplates(prev => prev.filter(t => t.id !== id));
  };

  const selectSpecType = (type: string, template?: { data: SpecData }) => {
    if (template) {
      setData({ ...template.data });
    } else if (type === 'blank') {
      setData({
        ...DEFAULT_SPEC,
        specType: 'blank',
        projectTitle: 'NEW CUSTOM SPECIFICATION',
        introduction: '',
        businessNeed: '',
        currentSituation: '',
        proposedChanges: '',
        scopeIn: '',
        scopeOut: '',
        technicalApproach: '',
        addendum: '',
        securityCompliance: '',
        versions: [{ id: '1', version: '1.0', date: new Date().toLocaleDateString(), author: '', comments: 'Initial Draft' }],
        reviewers: [],
        approvals: [],
        processInputs: [],
        expectedResults: [],
        impactingAreas: [],
        dbChanges: [],
        testCasesList: [],
        operationalSupport: [],
        openIssues: [],
        customSections: []
      });
    } else {
      setData({
        ...DEFAULT_SPEC,
        specType: type,
        projectTitle: type === 'new' ? 'NEW PROJECT SPECIFICATION' : 'FIX / ENHANCEMENT SPECIFICATION',
        // Reset fields for fresh start
        introduction: '',
        businessNeed: '',
        currentSituation: '',
        proposedChanges: '',
        scopeIn: '',
        scopeOut: '',
        technicalApproach: '',
        addendum: '',
        securityCompliance: '',
        versions: [],
        reviewers: [],
        approvals: [],
        processInputs: [],
        expectedResults: [],
        impactingAreas: [],
        dbChanges: [],
        testCasesList: [],
        operationalSupport: [],
        openIssues: []
      });
    }
    setPage('editor');
    setActiveSection('cover');
    setShowTypeSelector(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = async () => {
    await exportToWord(data);
  };

  const handleExportPDF = async () => {
    await exportToPDF('document-preview', data.projectTitle || 'Specification');
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
    ...(data.specType !== 'blank' ? [
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
    ] : []),
    ...(data.customSections || []).sort((a, b) => a.order - b.order).map(s => ({
      id: `custom-${s.id}`,
      label: s.title,
      icon: <FileText size={18} />,
      isCustom: true
    })),
    { id: 'addendum', label: 'Addendum', icon: <FileText size={18} /> },
  ];

  const addCustomSection = () => {
    const sections = data.customSections || [];
    const newSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      content: '',
      order: sections.length
    };
    setData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection]
    }));
    setActiveSection(`custom-${newSection.id}`);
  };

  const removeCustomSection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter(s => s.id !== id)
    }));
    if (activeSection === `custom-${id}`) {
      setActiveSection('cover');
    }
  };

  const updateCustomSection = (id: string, key: 'title' | 'content', value: string) => {
    setData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, [key]: value } : s)
    }));
  };

  return (
    <div className={cn(
      "bg-brand-bg font-sans text-brand-dark min-h-screen",
      page === 'editor' && "h-screen overflow-hidden flex flex-col"
    )}>
      {/* Shared Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportJSON} 
        accept=".json" 
        className="hidden" 
      />

      {page === 'dashboard' ? (
        <Dashboard 
          onStartNew={selectSpecType}
          onImport={() => fileInputRef.current?.click()}
          recentDrafts={recentDrafts}
          customTemplates={customTemplates}
          onDeleteTemplate={(id) => setCustomTemplates(prev => prev.filter(t => t.id !== id))}
          onContinueDraft={(d) => { 
            // Ensure we merge defaults to handle legacy data
            const normalizedData = {
              ...DEFAULT_SPEC,
              ...d,
              customSections: d.customSections || [],
              versions: d.versions || DEFAULT_SPEC.versions,
              reviewers: d.reviewers || [],
              approvals: d.approvals || [],
              processInputs: d.processInputs || [],
              expectedResults: d.expectedResults || [],
              impactingAreas: d.impactingAreas || [],
              dbChanges: d.dbChanges || [],
              testCasesList: d.testCasesList || [],
              operationalSupport: d.operationalSupport || [],
              openIssues: d.openIssues || []
            };
            setData(normalizedData); 
            setPage('editor'); 
          }}
        />
      ) : (
        <>
          {/* Save Template Overlay */}
      {showTemplateSaver && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Layout size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-slate-900">Save as Template</h2>
                  <p className="text-xs text-slate-500 font-medium">Create a reusable blueprint from this draft</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Template Name</label>
                  <input 
                    type="text" 
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., API Microservice Spec"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Description</label>
                  <textarea 
                    value={templateForm.description}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Briefly describe what this template is for..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[80px]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowTemplateSaver(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={!templateForm.name}
                  onClick={() => {
                    saveAsTemplate(templateForm.name, templateForm.description);
                    setShowTemplateSaver(false);
                    setTemplateForm({ name: '', description: '' });
                  }}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-200"
                >
                  Save Template
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Type Selector Overlay */}
      {showTypeSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-12 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-brand-cyan/10 text-brand-teal rounded-2xl flex items-center justify-center shadow-inner ring-1 ring-brand-cyan/20">
                <FileText size={32} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight text-brand-dark uppercase">What are you building?</h1>
                <p className="text-slate-500 font-medium tracking-tight">Select a template to initialize your technical specification</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <button 
                  onClick={() => selectSpecType('new')}
                  className="group flex flex-col items-center p-6 bg-brand-bg hover:bg-brand-teal rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left border border-brand-cyan/10"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-cyan text-brand-teal group-hover:text-white transition-colors shadow-sm">
                    <Plus size={20} />
                  </div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">New Project</h3>
                  <p className="text-[11px] text-slate-500 group-hover:text-cyan-50 transition-colors text-center leading-tight">Complete specification for a brand new system or standalone asset.</p>
                </button>
                
                <button 
                  onClick={() => selectSpecType('enhancement')}
                  className="group flex flex-col items-center p-6 bg-brand-bg hover:bg-brand-dark rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left border border-brand-cyan/10"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-700 text-brand-dark group-hover:text-white transition-colors shadow-sm">
                    <Settings size={20} />
                  </div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors">Fix / Enhancement</h3>
                  <p className="text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors text-center leading-tight">Focus on modifications, existing system fixes, or functional upgrades.</p>
                </button>

                {customTemplates.map(template => (
                  <button 
                    key={template.id}
                    onClick={() => selectSpecType('custom', template)}
                    className="group relative flex flex-col items-center p-6 bg-slate-50 hover:bg-emerald-600 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-left border border-slate-100"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white transition-colors shadow-sm">
                      <Layout size={20} />
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-white transition-colors truncate w-full text-center">{template.name}</h3>
                    <p className="text-[11px] text-slate-500 group-hover:text-emerald-100 transition-colors text-center leading-tight line-clamp-2">{template.description}</p>
                    
                    <button 
                      onClick={(e) => deleteTemplate(template.id, e)}
                      className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </button>
                ))}
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

      {/* Top Navigation - Professional Specification Editor Style */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-50 no-print">
        <div className="flex items-center gap-4 cursor-pointer group hover:opacity-80 transition-opacity" onClick={() => setPage('dashboard')}>
          <Logo className="w-9 h-9" size={18} />
          <div className="hidden lg:block border-l border-slate-200 pl-4">
            <h1 className="text-lg font-black tracking-tight leading-none text-brand-dark flex items-center gap-1.5">
              SPEC MASTER <span className="text-brand-cyan">PRO</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Editor Environment</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-2 rounded-2xl border border-slate-200 shadow-inner group transition-all hover:bg-white hover:border-brand-cyan/30">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,188,212,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spec Status:</span>
              <span className="text-sm font-black text-brand-dark truncate max-w-[200px] md:max-w-[400px]">
                {data.projectTitle || "Untitled Specification"}
              </span>
            </div>
            <div className="h-3 w-px bg-slate-300"></div>
            <div className="flex items-center gap-1.5">
              <Save size={12} className="text-brand-teal" />
              <span className="text-[9px] font-bold text-slate-400 uppercase">Live Sync</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Action Toolbar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 mr-2 shadow-sm">
            <button 
              onClick={() => setShowTemplateSaver(true)}
              title="Save as Template"
              className="p-2 text-slate-500 hover:text-brand-teal hover:bg-white rounded-lg transition-all"
            >
              <Bookmark size={18} />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              title="Import Draft"
              className="p-2 text-slate-500 hover:text-brand-teal hover:bg-white rounded-lg transition-all"
            >
              <Upload size={18} />
            </button>
            <button 
              onClick={handleExportJSON}
              title="Export Draft"
              className="p-2 text-slate-500 hover:text-brand-teal hover:bg-white rounded-lg transition-all"
            >
              <Download size={18} />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
            <button 
              onClick={() => {
                setPage('dashboard');
                setTimeout(() => {
                  const settings = document.querySelector('nav');
                  settings?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              title="AI Settings"
              className="p-2 text-slate-500 hover:text-brand-teal hover:bg-white rounded-lg transition-all"
            >
              <Settings size={18} />
            </button>
          </div>

          <button 
            onClick={() => setView(view === 'edit' ? 'preview' : 'edit')}
            className={cn(
              "px-5 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 shadow-md hover:-translate-y-0.5 active:translate-y-0",
              view === 'edit' 
                ? "bg-brand-dark text-white shadow-brand-dark/20 hover:bg-slate-800" 
                : "bg-white text-brand-dark border border-slate-200 hover:bg-slate-50"
            )}
          >
            {view === 'edit' ? <Eye size={18} /> : <FileText size={18} />}
            <span className="hidden sm:inline">{view === 'edit' ? 'Full Preview' : 'Back to Editor'}</span>
          </button>

          <button 
            onClick={handleExportWord}
            className="flex px-5 py-2.5 bg-gradient-to-r from-brand-cyan to-brand-teal text-white font-bold rounded-xl shadow-lg shadow-brand-cyan/25 hover:shadow-brand-teal/40 hover:-translate-y-0.5 active:translate-y-0 transition-all items-center gap-2"
          >
            <FileDown size={18} />
            <span className="hidden md:inline">Export Word</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Precise theme style */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 no-print">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-3">Document Structure</h3>
            <div className="space-y-1 overflow-y-auto flex-1">
              {sidebarItems.map((item, idx) => {
                const complete = item.id.startsWith('custom-') ? !!(data.customSections || []).find(s => `custom-${s.id}` === item.id)?.content : isSectionComplete(item.id);
                const isCustom = item.id.startsWith('custom-');
                
                return (
                  <button
                    key={item.id}
                    onClick={() => { setView('edit'); setActiveSection(item.id); }}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                      activeSection === item.id && view === 'edit'
                        ? "bg-blue-50 text-blue-700 font-bold shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[10px] font-bold", activeSection === item.id && view === 'edit' ? "text-blue-500" : "text-slate-400")}>
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="truncate max-w-[140px] text-left">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isCustom && (
                        <Trash2 
                          size={12} 
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all" 
                          onClick={(e) => removeCustomSection(item.id.replace('custom-', ''), e)}
                        />
                      )}
                      {complete && (
                        <CheckCircle className="text-green-500 shrink-0" size={14} />
                      )}
                    </div>
                  </button>
                );
              })}
              
              <button 
                onClick={addCustomSection}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-xs font-bold text-slate-500 border border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all"
              >
                <Plus size={14} />
                Add Custom Section
              </button>
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
                        <MarkdownEditor 
                          value={data.introduction} 
                          onChange={(v) => updateField('introduction', v)} 
                          label="1. Introduction" 
                          context={getAiContext('Introduction')}
                        />
                      )}

                      {activeSection === 'situation' && (
                        <div className="space-y-8">
                          <MarkdownEditor 
                            value={data.currentSituation} 
                            onChange={(v) => updateField('currentSituation', v)} 
                            label="Current Situation (Existing State)" 
                            context={getAiContext('Current Situation (As-Is)')}
                          />
                          <MarkdownEditor 
                            value={data.proposedChanges} 
                            onChange={(v) => updateField('proposedChanges', v)} 
                            label="Proposed Changes (Fix / Enhancement)" 
                            context={getAiContext('Proposed Solution (To-Be)')}
                          />
                        </div>
                      )}

                      {activeSection === 'business' && (
                        <MarkdownEditor 
                          value={data.businessNeed} 
                          onChange={(v) => updateField('businessNeed', v)} 
                          label="2. Basic Business Need" 
                          context={getAiContext('Business Need')}
                        />
                      )}

                      {activeSection === 'scope' && (
                        <div className="space-y-6">
                          <MarkdownEditor 
                            value={data.scopeIn} 
                            onChange={(v) => updateField('scopeIn', v)} 
                            label="3.1 In-scope Content" 
                            context={getAiContext('In-Scope Items')}
                          />
                          <MarkdownEditor 
                            value={data.scopeOut} 
                            onChange={(v) => updateField('scopeOut', v)} 
                            label="3.2 Out-of-scope Content" 
                            context={getAiContext('Out-of-Scope Items')}
                          />
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
                          <MarkdownEditor 
                            value={data.technicalApproach} 
                            onChange={(v) => updateField('technicalApproach', v)} 
                            label="6.1 Technical Specification" 
                            context={getAiContext('Technical Solution / Implementation Details')}
                          />
                          
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
                        </div>
                      )}

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
                        <MarkdownEditor 
                          value={data.addendum} 
                          onChange={(v) => updateField('addendum', v)} 
                          label="Addendum (Additional Information)" 
                          context={getAiContext('Addendum')}
                        />
                      )}

                      {activeSection === 'test' && (
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">7. Test Case Specification</h3>
                            <div className="flex gap-3">
                              <button 
                                onClick={handleAiGenerateTests} 
                                disabled={isGeneratingTests}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:shadow-xl transition-all disabled:opacity-50"
                              >
                                {isGeneratingTests ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                AI Generate Scenarios
                                {!isAiConfigured() && <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-md text-[9px] border border-white/10 uppercase">Demo</span>}
                              </button>
                              <button onClick={() => addListItem('testCasesList')} className="flex items-center gap-1 text-sm text-blue-600 font-bold hover:text-blue-700">
                                <Plus size={16} /> Add Test Case
                              </button>
                            </div>
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
                          <MarkdownEditor 
                            value={data.securityCompliance} 
                            onChange={(v) => updateField('securityCompliance', v)} 
                            label="9. Security & Compliance (Additional Notes)" 
                            context={getAiContext('Security and Compliance Considerations')}
                          />
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

                      {activeSection.startsWith('custom-') && (() => {
                        const sectionId = activeSection.replace('custom-', '');
                        const section = data.customSections.find(s => s.id === sectionId);
                        if (!section) return null;
                        return (
                          <div className="space-y-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Section Title</label>
                              <input 
                                type="text"
                                value={section.title}
                                onChange={(e) => updateCustomSection(sectionId, 'title', e.target.value)}
                                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-xl text-slate-900 shadow-sm"
                                placeholder="Enter section title..."
                              />
                            </div>
                            <MarkdownEditor 
                              value={section.content} 
                              onChange={(v) => updateCustomSection(sectionId, 'content', v)} 
                              label={`${section.title} Content`} 
                              context={getAiContext(section.title)}
                            />
                          </div>
                        );
                      })()}
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
                        <button onClick={handleExportPDF} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-all">
                          <Download size={18} /> Download PDF
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
            <motion.div
              key="preview-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col min-h-0 bg-slate-50/50"
            >
              <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-center gap-4 shrink-0 no-print">
                <button 
                  onClick={handlePrint} 
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all text-sm"
                >
                  <Printer size={16} /> System Print
                </button>
                <button 
                  onClick={handleExportPDF} 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all text-sm shadow-md"
                >
                  <Download size={16} /> Download PDF
                </button>
                <button 
                  onClick={handleExportWord} 
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all text-sm shadow-md"
                >
                  <FileDown size={16} /> Download Word
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 flex justify-center">
                <DocumentLayout data={data} />
              </div>
            </motion.div>
          )}
        </main>
      </div>
      </>
      )}

      {/* Print View Wrapper */}
      <div className="hidden print:block absolute inset-0 bg-white z-[100]">
        <DocumentLayout data={data} />
      </div>
    </div>
  );
}
