import React from 'react';
import { Layers } from 'lucide-react';

export const Logo = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute -top-1.5 -right-1.5 w-full h-full bg-brand-cyan/20 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
    <div className="absolute -top-1 -right-1 w-full h-full bg-brand-cyan/40 rounded-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    <div className="relative w-full h-full bg-gradient-to-br from-brand-cyan to-brand-teal rounded-lg flex items-center justify-center shadow-lg shadow-brand-cyan/20">
      <Layers className="text-white" size={size} strokeWidth={2.5} />
    </div>
  </div>
);
import { 
  Plus, 
  Settings, 
  Upload, 
  FileText, 
  Clock, 
  Layout, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Trash2,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomTemplate, SpecData } from '../types';
import { cn } from '../lib/utils';
import { STANDARD_TEMPLATES } from '../services/templates';

interface DashboardProps {
  onStartNew: (type: string, template?: { data: SpecData }) => void;
  onImport: () => void;
  recentDrafts: { id: string, title: string, date: string, data: SpecData }[];
  customTemplates: CustomTemplate[];
  onDeleteTemplate: (id: string) => void;
  onContinueDraft: (data: SpecData) => void;
  onManageTemplates: () => void;
}

export default function Dashboard({ 
  onStartNew, 
  onImport, 
  recentDrafts, 
  customTemplates, 
  onDeleteTemplate,
  onContinueDraft,
  onManageTemplates
}: DashboardProps) {
  const [showSettings, setShowSettings] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(localStorage.getItem('gemini_api_key') || '');
  const [isSaved, setIsSaved] = React.useState(false);

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setShowSettings(false);
      window.location.reload(); // Reload to refresh AI service state
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark font-sans">
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/40 backdrop-blur-md p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-white"
            >
              <div className="p-10 space-y-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-brand-cyan/10 rounded-2xl flex items-center justify-center text-brand-cyan">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-brand-dark">AI Configuration</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">Connect Gemini AI to supercharge your technical drafting and reviews.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gemini API Key</label>
                    <input 
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Paste your API key here..."
                      className="w-full px-5 py-4 bg-brand-bg/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-cyan/10 focus:border-brand-cyan outline-none transition-all font-mono text-sm"
                    />
                    <div className="bg-slate-50 p-4 rounded-xl text-[10px] text-slate-500 leading-relaxed border border-slate-100 italic">
                      Security Note: Your key is stored ONLY in your local browser. 
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-brand-teal font-bold hover:underline block mt-1">
                        Get a Free Key from Google AI Studio &rarr;
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveApiKey}
                    className="flex-1 py-4 px-6 bg-brand-cyan hover:bg-brand-teal text-white rounded-2xl font-black transition-all shadow-lg shadow-brand-cyan/20 flex items-center justify-center gap-2"
                  >
                    {isSaved ? <CheckCircle2 size={20} /> : 'Save Config'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.location.reload()}>
            <Logo className="w-10 h-10" size={20} />
            <div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5 text-brand-dark">
                SPEC MASTER <span className="text-brand-cyan">PRO</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                const guide = document.getElementById('full-documentation');
                guide?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              How it works
            </button>
            <button 
              onClick={() => {
                const templates = document.getElementById('template-library');
                templates?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Templates
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2"
            >
              <Settings size={16} />
              AI Setup
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="group relative">
              <button 
                onClick={onImport}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
              >
                <Upload size={16} />
                Import JSON
              </button>
              <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[60]">
                <p className="text-[10px] text-slate-500 leading-tight">Upload a previously saved SpecMaster JSON draft to resume editing.</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-24">
        
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
          <div className="absolute top-0 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-8 max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 ring-1 ring-blue-50"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Enhanced with Gemini AI</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black tracking-tight leading-[0.95] text-brand-dark"
            >
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-teal">Technical Specs.</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl"
            >
              SpecMaster Pro helps you create standardized, professional technical specifications. Use pre-defined blueprints or build your own organization-wide templates.
            </motion.p>
          </div>
        </section>

        {/* Standard Library */}
        <section id="template-library" className="space-y-8">
          <div className="flex items-end justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Library</h3>
              <p className="text-2xl font-black tracking-tight">Standard Blueprints</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {STANDARD_TEMPLATES.map((tpl, idx) => (
              <motion.button 
                key={tpl.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => onStartNew('custom', tpl)}
                className="group relative flex flex-col p-6 bg-white border border-slate-100 rounded-[2rem] text-left hover:border-brand-cyan/50 hover:shadow-2xl hover:shadow-brand-cyan/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-brand-bg text-brand-teal rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-cyan group-hover:text-white transition-all duration-500 shadow-sm">
                  <Layout size={28} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-black mb-2 text-brand-dark group-hover:text-brand-teal transition-colors">{tpl.name}</h4>
                <p className="text-slate-500 text-sm font-medium mb-4 leading-relaxed line-clamp-2">{tpl.description}</p>
                <div className="mt-auto flex items-center gap-2 text-brand-cyan font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Generate Specification <ArrowRight size={14} />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Documentation Section */}
        <section id="full-documentation" className="space-y-16 py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="text-4xl font-black tracking-tight">Platform Guide</h2>
              <p className="text-slate-500 text-lg">Everything you need to know about SpecMaster Pro architectural standards.</p>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  What is a Technical Specification?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  A technical specification (tech spec) describes how you’re going to solve a problem. It’s a blueprint for a solution, including the technical design, the business context, and the expected outcomes.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-indigo-600" size={24} />
                  AI-Powered Generation
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Our integration with Gemini allows you to generate content based on your project title and business need. If you find a section difficult to write, use "AI Suggest" to get a high-quality draft that follows technical best practices.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Upload className="text-emerald-600" size={24} />
                  Managing JSON Drafts
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  The "Import JSON" feature allows you to resume work on a document you previously saved. Simply download your draft as JSON, and later upload it to the dashboard to continue editing exactly where you left off.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Grid (Standard Options) */}
        <section className="space-y-8">
          <div className="flex items-end justify-between border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Quick Start</h3>
              <p className="text-2xl font-black tracking-tight">Create Document</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {/* Blank Doc Card */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => onStartNew('blank')}
              className="group relative flex flex-col p-8 bg-white border border-slate-200 rounded-[2.5rem] text-left hover:border-slate-800 hover:shadow-2xl transition-all duration-500"
            >
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                  <Plus size={28} />
                </div>
                <h4 className="text-2xl font-black mb-3 text-brand-dark">Blank Spec</h4>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Start with a clean slate. Build your document structure from scratch.</p>
                <div className="mt-auto flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 group-hover:text-slate-900 transition-transform">
                  Design Template <ArrowRight size={16} />
                </div>
            </motion.button>

            {/* New Project Card */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => onStartNew('new')}
              className="group relative flex flex-col p-8 bg-blue-50/30 border border-blue-100 rounded-[2.5rem] text-left hover:border-blue-500 hover:shadow-2xl transition-all duration-500"
            >
                <div className="w-14 h-14 bg-brand-cyan/10 text-brand-cyan rounded-2xl flex items-center justify-center mb-10 group-hover:bg-brand-cyan group-hover:text-white transition-all duration-300">
                  <FileText size={28} />
                </div>
                <h4 className="text-2xl font-black mb-3 text-brand-dark">Standard Spec</h4>
                <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">System architecture, data models, and complex service logic frameworks.</p>
                <div className="mt-auto flex items-center gap-2 text-brand-cyan font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Start Building <ArrowRight size={16} />
                </div>
            </motion.button>

            {/* Project Overview Card */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => {
                const docTemplate = STANDARD_TEMPLATES.find(t => t.id === 'tpl-project-doc');
                onStartNew('custom', docTemplate);
              }}
              className="group relative flex flex-col p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] text-left hover:border-emerald-500 hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <BookOpen size={28} />
              </div>
              <h4 className="text-2xl font-black mb-3">Project Overview</h4>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">High-level project goals, stakeholders, and strategic milestones.</p>
              <div className="mt-auto flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Create Doc <ArrowRight size={16} />
              </div>
            </motion.button>

            {/* Enhancement Card */}
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => onStartNew('enhancement')}
              className="group relative flex flex-col p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] text-left hover:border-blue-500 hover:shadow-2xl transition-all duration-500 text-white"
            >
              <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-all duration-300">
                <Layout size={28} />
              </div>
              <h4 className="text-2xl font-black mb-3 text-white">Fix / Enhancement</h4>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Document specific changes to existing systems or bug fix architectures.</p>
              <div className="mt-auto flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Start Spec <ArrowRight size={16} />
              </div>
            </motion.button>
          </div>
        </section>

        {/* Guide Section */}
        <section id="guide-section" className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Knowledge Base</h3>
                <h2 className="text-4xl font-black tracking-tight leading-tight">Standardizing Quality Across the Organization.</h2>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed">
                SpecMaster Pro was built to solve the "fragmented documentation" problem. Whether you are a lone architect or part of a global team, every document follows a rigorous, industry-grade standard.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-2xl font-black text-blue-400 font-mono">01.</div>
                  <h5 className="font-bold">Consistency</h5>
                  <p className="text-xs text-slate-500">Universal formatting ensures every developer knows exactly where to find info.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-indigo-400 font-mono">02.</div>
                  <h5 className="font-bold">AI Assistance</h5>
                  <p className="text-xs text-slate-500">Gemini-powered suggestions help you fill out complex sections in seconds.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-emerald-400 font-mono">03.</div>
                  <h5 className="font-bold">Portability</h5>
                  <p className="text-xs text-slate-500">Export to PDF or Word, or save as JSON to share the draft with peers.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-rose-400 font-mono">04.</div>
                  <h5 className="font-bold">Blueprints</h5>
                  <p className="text-xs text-slate-500">Save your best specs as templates for future projects.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="text-blue-400" size={20} />
                How to use
              </h4>
              <ul className="space-y-4">
                {[
                  "Select a starting point (New Project or Blueprint)",
                  "Fill out the critical sections using the lateral navigation",
                  "Use 'AI Suggest' in any markdown field for inspiration",
                  "Save your work locally or export for official review"
                ].map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</span>
                    <span className="text-slate-300 text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Two Column Layout: Recent & Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 overflow-hidden">
          
          {/* Recent Drafts */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-end justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Resume</h3>
                <p className="text-2xl font-black tracking-tight">Recent Sessions</p>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
            </div>

            <div className="space-y-3">
              {recentDrafts.length > 0 ? (
                recentDrafts.map((draft, idx) => (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={draft.id}
                    onClick={() => onContinueDraft(draft.data)}
                    className="w-full flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-brand-cyan/30 hover:shadow-xl hover:shadow-brand-cyan/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-bg text-brand-teal rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h5 className="font-black text-brand-dark group-hover:text-brand-cyan transition-colors">{draft.title || 'Untitled Specification'}</h5>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                            {draft.date}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">
                            {draft.data.specType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-brand-cyan group-hover:translate-x-1 transition-all" size={20} />
                  </motion.button>
                ))
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} />
                  </div>
                  <p className="text-slate-400 font-bold">No active drafts found</p>
                  <p className="text-xs text-slate-300 mt-1">Start a new project to see them here</p>
                </div>
              )}
            </div>
          </div>

          {/* Templates Sidebar */}
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Reusable</h3>
                <p className="text-2xl font-black tracking-tight">Your Blueprints</p>
              </div>
              <button 
                onClick={onManageTemplates}
                className="p-2 text-brand-cyan hover:text-brand-teal transition-colors"
                title="Manage All Templates"
              >
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {customTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="group p-5 bg-white border border-slate-100 rounded-2xl hover:border-brand-cyan/20 hover:shadow-lg transition-all cursor-pointer relative"
                  onClick={() => onStartNew('custom', template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-brand-bg text-brand-teal rounded-xl flex items-center justify-center group-hover:bg-brand-cyan group-hover:text-white transition-all">
                      <Layout size={18} />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteTemplate(template.id); }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h6 className="font-black text-brand-dark line-clamp-1 group-hover:text-brand-cyan transition-colors">{template.name}</h6>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              ))}

              <button 
                onClick={onImport}
                className="w-full p-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold text-sm hover:border-slate-200 hover:text-slate-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Blueprint
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-40 grayscale">
            <FileText size={18} />
            <span className="font-black tracking-tight">SpecMaster Pro</span>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <button className="hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button className="hover:text-slate-900 transition-colors">Architecture Best Practices</button>
            <button className="hover:text-slate-900 transition-colors">Contact Support</button>
          </div>
          <p className="text-[10px] font-bold text-slate-400">© 2026 SpecMaster Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
