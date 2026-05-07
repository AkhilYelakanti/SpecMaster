/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SpecData, SubSection } from '../types';

interface DocumentLayoutProps {
  data: SpecData;
}

export default function DocumentLayout({ data }: DocumentLayoutProps) {
  // Helper to render a page footer
  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-dark-border flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-dark-muted uppercase tracking-widest transition-colors">
      <span>{data.companyName} | {data.projectTitle}</span>
      <span>Page {pageNum}</span>
    </div>
  );

  return (
    <div id="document-preview" className="bg-slate-200 dark:bg-dark-bg p-8 flex flex-col items-center gap-12 print:bg-white print:p-0 no-print-gap shrink-0 transition-colors">
      
      {/* Page 1: Cover Page */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col justify-between p-[2cm] bg-white dark:bg-dark-surface shadow-2xl relative overflow-hidden print:shadow-none print:m-0 border border-transparent dark:border-dark-border transition-colors">
        <div className="pt-20">
          <div className="border-l-8 border-corporate-blue dark:border-brand-cyan pl-12 py-10 space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl font-black font-sans text-corporate-accent dark:text-white tracking-tighter uppercase leading-tight">
                {data.projectTitle || "PROJECT TITLE"}
              </h1>
              <div className="h-1 w-24 bg-corporate-blue dark:bg-brand-cyan"></div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-slate-500 dark:text-dark-muted tracking-wide">
                {data.companyName || "COMPANY NAME"}
              </h2>
              <div className="text-sm font-bold text-slate-400 dark:text-dark-muted/60 uppercase tracking-widest">
                Technical Specification Document
              </div>
            </div>
            
            <div className="pt-24 max-w-lg">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white leading-relaxed italic border-l-2 border-slate-200 dark:border-dark-border pl-6">
                {data.documentSubtitle || "Document subtitle or short description goes here."}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-right">
          <div className="text-sm font-bold text-slate-400 dark:text-dark-muted uppercase">Version 1.0</div>
          <div className="text-xs text-slate-400 dark:text-dark-muted font-medium">Confidential - For Internal Use Only</div>
        </div>
        <PageFooter pageNum={1} />
      </div>

      {/* Page 2: Control Tables Page */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="space-y-12 flex-1">
          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b-2 border-corporate-accent dark:border-brand-cyan pb-2 mb-8">
              <span className="bg-corporate-accent dark:bg-brand-cyan text-white w-10 h-10 flex items-center justify-center font-black rounded">C</span>
              <h2 className="text-2xl font-black text-corporate-accent dark:text-white uppercase tracking-tight">Document Control</h2>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 dark:text-dark-muted uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-brand-cyan"></div> Version History
                </h3>
                <table className="w-full border-collapse text-xs text-slate-700 dark:text-dark-text transition-colors">
                  <thead className="bg-slate-50 dark:bg-dark-bg border-y border-slate-200 dark:border-dark-border">
                    <tr>
                      <th className="p-3 text-left font-bold uppercase tracking-wider text-slate-400 dark:text-dark-muted">Ver.</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider text-slate-400 dark:text-dark-muted">Date</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider text-slate-400 dark:text-dark-muted">Author</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider text-slate-400 dark:text-dark-muted">Major Changes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                    {data.versions.map((v) => (
                      <tr key={v.id}>
                        <td className="p-3 font-bold text-corporate-blue dark:text-brand-cyan bg-blue-50/20 dark:bg-brand-cyan/5">{v.version}</td>
                        <td className="p-3">{v.date}</td>
                        <td className="p-3">{v.author}</td>
                        <td className="p-3 italic">{v.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Reviewers
                </h3>
                <table className="w-full border-collapse text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="p-3 text-left font-bold uppercase tracking-wider">Name</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider">Functional Role</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider">Review Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.reviewers.map((r) => (
                      <tr key={r.id}>
                        <td className="p-3 font-bold">{r.name}</td>
                        <td className="p-3 text-slate-600">{r.team} / {r.designation}</td>
                        <td className="p-3 italic text-slate-500">{r.date || 'Pending'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Formal Approvals
                </h3>
                <table className="w-full border-collapse text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200">
                    <tr>
                      <th className="p-3 text-left font-bold uppercase tracking-wider">Name</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider">Title</th>
                      <th className="p-3 text-left font-bold uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.approvals.map((a) => (
                      <tr key={a.id}>
                        <td className="p-3 font-bold">{a.name}</td>
                        <td className="p-3 text-slate-600">{a.designation}</td>
                        <td className="p-3 font-bold text-green-600 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div> Approved
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
        <PageFooter pageNum={2} />
      </div>

      {/* Page 3: Table of Contents */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white shadow-2xl print:shadow-none border-t border-slate-50">
        <div className="flex-1">
          <div className="flex items-center gap-4 border-b-2 border-corporate-accent pb-2 mb-12">
            <span className="bg-corporate-accent text-white w-10 h-10 flex items-center justify-center font-black rounded">T</span>
            <h2 className="text-2xl font-black text-corporate-accent uppercase tracking-tight">Table of Contents</h2>
          </div>
          
          <div className="space-y-3 pt-4">
            {(() => {
              const standardItems = data.specType === 'blank' ? [] : [
                { label: 'Introduction', page: 4 },
                { label: 'Business Need', page: 5 },
                { label: 'Current vs. Proposed state', page: 6 },
                { label: 'Scope (In/Out)', page: 7 },
                { label: 'Assumptions & Constraints', page: 8 },
                { label: 'Solution Overview', page: 9 },
                { label: 'Technical Specifications', page: 10 },
                { label: 'Test Strategy & Scenarios', page: 11 },
                { label: 'Operational Support', page: 12 },
                { label: 'Database Master Schema', page: 13 },
                { label: 'Security & Integrity', page: 14 },
                { label: 'Open Review Points', page: 15 },
              ];

              const customItems = (data.customSections || []).sort((a, b) => a.order - b.order).map((s, idx) => ({
                label: s.title,
                page: (data.specType === 'blank' ? 4 : 16) + idx
              }));

              const allItems = [
                ...standardItems,
                ...customItems,
                { label: 'Addendum', page: (data.specType === 'blank' ? 4 : 16) + customItems.length }
              ];

              return allItems.map((item, idx) => (
                <div key={idx} className="flex items-end gap-2 group cursor-pointer">
                  <span className="font-bold text-slate-700 whitespace-nowrap">{idx + 1}. {item.label}</span>
                  <div className="flex-1 border-b border-dotted border-slate-200 mb-1"></div>
                  <span className="font-bold text-corporate-blue shrink-0 bg-blue-50 px-2 rounded-sm">{item.page}</span>
                </div>
              ));
            })()}
          </div>
        </div>
        <PageFooter pageNum={3} />
      </div>

      {/* Standard Sections (Skip if Blank) */}
      {data.specType !== 'blank' && (
        <>
          {/* Section 1: Introduction */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-1">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">1. Introduction</h1>
            <div className="prose-p:text-slate-600 dark:prose-p:text-dark-muted prose-p:leading-relaxed">
              <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                {data.introduction || '*No introduction provided.*'}
              </ReactMarkdown>
            </div>
          </section>
        </div>
        <PageFooter pageNum={4} />
      </div>

      {/* Section 2: Business Need */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-2">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">2. Business Need</h1>
            <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
              {data.businessNeed || '*No business need provided.*'}
            </ReactMarkdown>
          </section>
        </div>
        <PageFooter pageNum={5} />
      </div>

      {/* Section 3: Current vs Proposed */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-3">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">3. Current vs. Proposed</h1>
            <div className="grid grid-cols-1 gap-12 mt-10">
              <div className="bg-slate-50 dark:bg-dark-bg border-l-4 border-slate-400 dark:border-dark-muted p-8 rounded-r-xl">
                <h3 className="!mt-0 text-slate-800 dark:text-white font-black uppercase text-sm tracking-widest mb-4">A. Current Situation (As-Is)</h3>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.currentSituation || '*Not specified.*'}
                </ReactMarkdown>
              </div>
              <div className="bg-blue-50 dark:bg-brand-cyan/5 border-l-4 border-corporate-blue dark:border-brand-cyan p-8 rounded-r-xl">
                <h3 className="!mt-0 text-corporate-blue dark:text-brand-cyan font-black uppercase text-sm tracking-widest mb-4">B. Proposed Solution (To-Be)</h3>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.proposedChanges || '*Not specified.*'}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        </div>
        <PageFooter pageNum={6} />
      </div>

      {/* Section 4: Scope */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-4">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">4. Scope</h1>
            <div className="space-y-12">
              <div className="bg-green-50/30 dark:bg-green-900/10 p-6 rounded-xl border border-green-100 dark:border-green-900/30">
                <h2 className="!mt-0 text-green-700 dark:text-green-400 border-b border-green-200 dark:border-green-900/50 pb-2">4.1 In-scope</h2>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.scopeIn || '*No in-scope items listed.*'}
                </ReactMarkdown>
              </div>
              <div className="bg-rose-50/30 dark:bg-rose-900/10 p-6 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <h2 className="!mt-0 text-rose-700 dark:text-rose-400 border-b border-rose-200 dark:border-rose-900/50 pb-2">4.2 Out-of-Scope</h2>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.scopeOut || '*No out-of-scope items listed.*'}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        </div>
        <PageFooter pageNum={7} />
      </div>

      {/* Section 5: Assumptions */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-5">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">5. Assumptions & Constraints</h1>
            <div className="space-y-12">
              <div>
                <h2 className="dark:text-white">5.1 Assumptions</h2>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.assumptions || '*No assumptions listed.*'}
                </ReactMarkdown>
              </div>
              <div>
                <h2 className="dark:text-white">5.2 Constraints</h2>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.constraints || '*No constraints listed.*'}
                </ReactMarkdown>
              </div>
            </div>
          </section>
        </div>
        <PageFooter pageNum={8} />
      </div>

      {/* Section 6: Solution Overview */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-6">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">6. Solution Overview</h1>
            <div className="space-y-10">
              <div className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl">
                 <div className="bg-slate-50 dark:bg-dark-bg p-4 font-bold border-b border-slate-200 dark:border-dark-border dark:text-white">6.1 Process Inputs</div>
                 <table className="w-full border-collapse text-xs !m-0 transition-colors">
                  <thead className="bg-slate-50/50 dark:bg-dark-bg/50">
                    <tr>
                      <th className="p-3 border-r border-slate-200 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Criteria</th>
                      <th className="p-3 border-r border-slate-200 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Source</th>
                      <th className="p-3 text-left text-slate-400 dark:text-dark-muted">Process Step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                    {data.processInputs.map(item => (
                      <tr key={item.id}>
                        <td className="p-3 border-r border-slate-200 dark:border-dark-border dark:text-dark-text">{item.criteria}</td>
                        <td className="p-3 border-r border-slate-200 dark:border-dark-border uppercase font-bold text-slate-400 dark:text-dark-muted">{item.source}</td>
                        <td className="p-3 dark:text-dark-text">{item.processStep}</td>
                      </tr>
                    ))}
                  </tbody>
                 </table>
              </div>

              <div className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl">
                 <div className="bg-slate-50 dark:bg-dark-bg p-4 font-bold border-b border-slate-200 dark:border-dark-border dark:text-white">6.2 Expected Results</div>
                 <table className="w-full border-collapse text-xs !m-0 transition-colors">
                  <thead className="bg-slate-50/50 dark:bg-dark-bg/50">
                    <tr>
                      <th className="p-3 border-r border-slate-200 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Primary Consideration</th>
                      <th className="p-3 border-r border-slate-200 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Output Criteria</th>
                      <th className="p-3 text-left text-slate-400 dark:text-dark-muted">Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                    {data.expectedResults.map(item => (
                      <tr key={item.id}>
                        <td className="p-3 border-r border-slate-200 dark:border-dark-border font-bold dark:text-dark-text">{item.consideration}</td>
                        <td className="p-3 border-r border-slate-200 dark:border-dark-border dark:text-dark-text">{item.criteria}</td>
                        <td className="p-3 italic text-slate-400 dark:text-dark-muted">{item.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                 </table>
              </div>
            </div>
          </section>
        </div>
        <PageFooter pageNum={9} />
      </div>

      {/* Section 7: Technical Specifications */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-7">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">7. Technical Specifications</h1>
            <div className="space-y-12">
              <div>
                <h2 className="dark:text-white">7.1 Solution Approach</h2>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.technicalApproach || '*Technical strategy not provided.*'}
                </ReactMarkdown>
              </div>
              <div className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl">
                 <div className="bg-slate-50 dark:bg-dark-bg p-4 font-bold border-b border-slate-200 dark:border-dark-border dark:text-white">7.2 Component Impact Analysis</div>
                 <table className="w-full border-collapse text-xs !m-0 transition-colors">
                  <thead className="bg-slate-50/50 dark:bg-dark-bg/50">
                    <tr>
                      <th className="p-3 border-r border-slate-200 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Architecture Layer</th>
                      <th className="p-3 border-r border-slate-200 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Object Impacted</th>
                      <th className="p-3 text-left text-slate-400 dark:text-dark-muted">UID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                    {data.impactingAreas.map(item => (
                      <tr key={item.id}>
                        <td className="p-3 border-r border-slate-200 dark:border-dark-border font-bold uppercase dark:text-dark-text">{item.layer}</td>
                        <td className="p-3 border-r border-slate-200 dark:border-dark-border text-corporate-blue dark:text-brand-cyan">{item.objectName}</td>
                        <td className="p-3 font-mono text-[10px] text-slate-400 dark:text-dark-muted">{item.componentId}</td>
                      </tr>
                    ))}
                  </tbody>
                 </table>
              </div>
            </div>
          </section>
        </div>
        <PageFooter pageNum={10} />
      </div>

      {/* Section 8: Test Strategy */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-8">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">8. Test Strategy</h1>
            <div className="space-y-10">
              {['Functional', 'Integration', 'Regression'].map((stage) => (
                <div key={stage} className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl">
                  <div className="bg-blue-900 dark:bg-brand-dark text-white p-3 font-black text-xs uppercase tracking-[0.2em]">{stage} Testing Suite</div>
                  <table className="w-full border-collapse text-xs !m-0 transition-colors">
                    <thead className="bg-slate-50 dark:bg-dark-bg">
                      <tr>
                        <th className="p-3 border-r border-slate-100 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Scenario / Goal</th>
                        <th className="p-3 border-r border-slate-100 dark:border-dark-border text-left text-slate-400 dark:text-dark-muted">Success Criteria</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                      {data.testCasesList.filter(tc => tc.stage === stage).length > 0 ? 
                       data.testCasesList.filter(tc => tc.stage === stage).map(item => (
                        <tr key={item.id}>
                          <td className="p-3 border-r border-slate-100 dark:border-dark-border font-medium dark:text-dark-text">{item.scenario}</td>
                          <td className="p-3 text-slate-600 dark:text-dark-muted italic">{item.expectedResult}</td>
                        </tr>
                       )) : <tr><td colSpan={2} className="p-10 text-center text-slate-300 dark:text-dark-muted/30 italic">No scenarios defined for this stage</td></tr>}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        </div>
        <PageFooter pageNum={11} />
      </div>

      {/* Section 9-10-11-12-13 (Combined for brevity if small, but let's separate for "Each main section on new page" requirement) */}
      
      {/* Section 9: Operational Support */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none text-center flex flex-col justify-center">
            <section id="section-9" className="text-left w-full h-full">
              <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-12 dark:text-white">9. Operational Support</h1>
              <div className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl">
                <table className="w-full border-collapse text-xs !m-0 transition-colors">
                  <thead className="bg-slate-50 dark:bg-dark-bg font-bold uppercase text-[10px] tracking-widest text-slate-500 dark:text-dark-muted">
                    <tr>
                      <th className="p-4 border-r border-slate-200 dark:border-dark-border text-left">Affected Component</th>
                      <th className="p-4 border-r border-slate-200 dark:border-dark-border text-left">Support Owner</th>
                      <th className="p-4 text-left">Resolution Process</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                    {data.operationalSupport.map(item => (
                      <tr key={item.id}>
                        <td className="p-4 border-r border-slate-200 dark:border-dark-border font-bold dark:text-dark-text">{item.component}</td>
                        <td className="p-4 border-r border-slate-200 dark:border-dark-border dark:text-dark-text">{item.owner}</td>
                        <td className="p-4 italic text-slate-400 dark:text-dark-muted">{item.description || 'Standard resolution protocol applies.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
        </div>
        <PageFooter pageNum={12} />
      </div>

      {/* Section 10: Database Changes */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-10">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">10. Database Master Schema</h1>
            <div className="space-y-8">
              <div className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl">
                <table className="w-full border-collapse text-xs !m-0 transition-colors">
                  <thead className="bg-corporate-accent dark:bg-brand-cyan text-white uppercase text-[10px] tracking-widest">
                    <tr>
                      <th className="p-3 text-left">Obj Type</th>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Action Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                    {data.dbChanges.map(item => (
                      <tr key={item.id}>
                        <td className="p-3 font-bold dark:text-dark-text">{item.type}</td>
                        <td className="p-3 font-mono text-corporate-blue dark:text-brand-cyan">{item.tableName}</td>
                        <td className="p-3 italic dark:text-dark-muted">{item.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {data.dbScripts && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 dark:text-dark-muted uppercase tracking-widest">Execution Script</h3>
                  <div className="bg-slate-900 dark:bg-black text-blue-300 dark:text-brand-cyan p-6 rounded-xl font-mono text-[10px] whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800 dark:border-dark-border">
                    {data.dbScripts}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
        <PageFooter pageNum={13} />
      </div>

      {/* Section 11: Security & Compliance */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-11">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">11. Security & Compliance</h1>
            <div className="bg-blue-50/50 dark:bg-brand-cyan/5 p-10 rounded-2xl border border-blue-100 dark:border-dark-border">
               <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                 {data.securityCompliance || '*Identity & Access Management protocols not specified.*'}
               </ReactMarkdown>
            </div>
          </section>
        </div>
        <PageFooter pageNum={14} />
      </div>

      {/* Section 12-13: Open Issues & Addendum */}
      <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
        <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
          <section id="section-12">
            <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">12. Open Review Points</h1>
            <div className="border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden mb-20">
               <table className="w-full border-collapse text-xs !m-0 transition-colors">
                  <thead className="bg-slate-50 dark:bg-dark-bg border-b border-slate-200 dark:border-dark-border font-black text-slate-500 dark:text-dark-muted uppercase text-[9px] tracking-[0.2em]">
                   <tr>
                     <th className="p-4 text-left">Issue / Risk</th>
                     <th className="p-4 text-left">Owner</th>
                     <th className="p-4 text-left">Target Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                   {data.openIssues.map(item => (
                     <tr key={item.id}>
                        <td className="p-4 font-bold text-slate-700 dark:text-dark-text">{item.issue}</td>
                        <td className="p-4 text-slate-500 dark:text-dark-muted">{item.responsibility}</td>
                        <td className="p-4 italic text-rose-500 dark:text-rose-400">{item.targetDate || 'TBD'}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </section>
        </div>
        <PageFooter pageNum={15} />
      </div>
    </>
  )}

  {/* Section List for Custom Pages */}
          {(data.customSections || []).sort((a, b) => a.order - b.order).map((section, idx) => {
            const pageNum = (data.specType === 'blank' ? 4 : 16) + idx;
            const sectionNum = (data.specType === 'blank' ? 1 : 13) + idx;
            return (
              <div key={section.id} className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
                <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
                  <section id={`custom-${section.id}`}>
                    <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">
                      {sectionNum}. {section.title}
                    </h1>
                    
                    <div className="space-y-12">
                      {section.content && (
                        <div className="mb-8">
                          <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                            {section.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {(section.subSections || []).sort((a, b) => a.order - b.order).map((sub, sIdx) => (
                        <div key={sub.id} className="space-y-4">
                          <h3 className="text-xl font-bold dark:text-white mt-8 mb-4 border-b border-slate-100 dark:border-dark-border pb-2">{sectionNum}.{sIdx + 1} {sub.title}</h3>
                          
                          {sub.type === 'markdown' && (
                            <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                              {sub.content || '*No content provided.*'}
                            </ReactMarkdown>
                          )}
                          
                          {sub.type === 'table' && sub.tableData && (
                            <div className="overflow-hidden border border-slate-200 dark:border-dark-border rounded-xl my-6">
                               <table className="w-full border-collapse text-xs !m-0 transition-colors">
                                <thead className="bg-slate-50/50 dark:bg-dark-bg/50 font-bold border-b border-slate-200 dark:border-dark-border">
                                  <tr>
                                    {sub.tableData.columns.map(col => (
                                      <th key={col} className="p-3 border-r border-slate-200 dark:border-dark-border text-left uppercase tracking-wider text-[10px] text-slate-400">
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                                  {sub.tableData.rows.map(row => (
                                    <tr key={row.id}>
                                      {sub.tableData!.columns.map(col => (
                                        <td key={col} className="p-3 border-r border-slate-200 dark:border-dark-border dark:text-dark-text">
                                          {row[col]}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                               </table>
                            </div>
                          )}
                          
                          {sub.type === 'script' && (
                            <div className="bg-slate-900 dark:bg-black text-emerald-400 dark:text-emerald-500 p-8 rounded-2xl font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800 dark:border-dark-border my-6">
                              {sub.content || '-- No script content --'}
                            </div>
                          )}
                        </div>
                      ))}

                      {!section.content && (!section.subSections || section.subSections.length === 0) && (
                        <p className="italic text-slate-400">*No content provided for this section.*</p>
                      )}
                    </div>
                  </section>
                </div>
                <PageFooter pageNum={pageNum} />
              </div>
            );
          })}

          {/* Final Page: Addendum */}
          <div className="w-full max-w-[850px] min-h-[1100px] flex flex-col p-[2cm] bg-white dark:bg-dark-surface shadow-2xl print:shadow-none border-t border-slate-50 dark:border-dark-border transition-colors">
            <div className="flex-1 markdown-body prose prose-slate dark:prose-invert max-w-none">
              <section id="section-13">
                <h1 className="text-3xl font-black border-l-4 border-corporate-blue dark:border-brand-cyan pl-4 mb-8 dark:text-white">
                  {(data.specType === 'blank' ? 1 : 13) + data.customSections.length}. Addendum
                </h1>
                <ReactMarkdown urlTransform={(url) => url.startsWith('data:') ? url : url}>
                  {data.addendum || '*No additional information cited.*'}
                </ReactMarkdown>
              </section>
            </div>
            <PageFooter pageNum={(data.specType === 'blank' ? 4 : 16) + data.customSections.length} />
          </div>
    </div>
  );
}
