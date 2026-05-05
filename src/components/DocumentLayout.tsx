/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SpecData } from '../types';

interface DocumentLayoutProps {
  data: SpecData;
}

export default function DocumentLayout({ data }: DocumentLayoutProps) {
  return (
    <div id="document-preview" className="bg-white shadow-2xl mx-auto w-full max-w-[850px] min-h-[1100px] p-[2cm] print:p-0 print:shadow-none print:max-w-none">
      {/* Cover Page */}
      <div className="min-h-[1000px] flex flex-col justify-between border-t-[30px] border-corporate-blue pb-10">
        <div className="pt-20">
          <div className="flex border-x-4 border-slate-200 min-h-[600px] relative">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-slate-200"></div>
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-slate-200"></div>
            
            <div className="p-12 space-y-8 w-full">
              <h1 className="text-4xl font-bold font-serif text-corporate-accent tracking-wide uppercase">
                {data.projectTitle}
              </h1>
              <h2 className="text-2xl font-medium text-slate-700">
                {data.companyName}
              </h2>
              
              <div className="pt-32">
                <h3 className="text-xl font-bold text-corporate-blue tracking-wider uppercase max-w-lg leading-relaxed">
                  {data.documentSubtitle}
                </h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b-[30px] border-corporate-blue pt-10">
          <div className="flex justify-between items-end pb-4">
             <span className="text-slate-500 font-bold">{data.companyName}</span>
             <span className="text-slate-500 font-bold text-sm">Page 1</span>
          </div>
        </div>
      </div>

      <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>

      {/* Control Tables Page */}
      <div className="py-8 space-y-12">
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-slate-200 pb-2">Document Versions</h2>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Version No.</th>
                <th className="border border-slate-300 p-2 text-left">Date</th>
                <th className="border border-slate-300 p-2 text-left">Author</th>
                <th className="border border-slate-300 p-2 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.versions.map((v) => (
                <tr key={v.id}>
                  <td className="border border-slate-300 p-2">{v.version}</td>
                  <td className="border border-slate-300 p-2">{v.date}</td>
                  <td className="border border-slate-300 p-2">{v.author}</td>
                  <td className="border border-slate-300 p-2">{v.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-slate-200 pb-2">Document Reviewers</h2>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Name</th>
                <th className="border border-slate-300 p-2 text-left">Designation</th>
                <th className="border border-slate-300 p-2 text-left">Team</th>
                <th className="border border-slate-300 p-2 text-left">Date Reviewed</th>
                <th className="border border-slate-300 p-2 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.reviewers.map((r) => (
                <tr key={r.id}>
                  <td className="border border-slate-300 p-2">{r.name}</td>
                  <td className="border border-slate-300 p-2">{r.designation}</td>
                  <td className="border border-slate-300 p-2">{r.team}</td>
                  <td className="border border-slate-300 p-2">{r.date}</td>
                  <td className="border border-slate-300 p-2">{r.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-slate-200 pb-2">Document Approval</h2>
          <table className="w-full border-collapse border border-slate-300 text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-left">Name</th>
                <th className="border border-slate-300 p-2 text-left">Designation</th>
                <th className="border border-slate-300 p-2 text-left">Date Approved</th>
                <th className="border border-slate-300 p-2 text-left">Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.approvals.map((a) => (
                <tr key={a.id}>
                  <td className="border border-slate-300 p-2">{a.name}</td>
                  <td className="border border-slate-300 p-2">{a.designation}</td>
                  <td className="border border-slate-300 p-2">{a.date}</td>
                  <td className="border border-slate-300 p-2">{a.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>

      {/* Table of Contents Placeholder */}
      <div className="py-8 space-y-4">
        <h2 className="text-xl font-bold border-b border-slate-200 pb-2">Table of Contents</h2>
        <div className="space-y-1 text-sm text-slate-600 italic">
          <p>1. Introduction</p>
          <p>2. Basic Business Need</p>
          <p>3. Scope</p>
          <p>4. Assumptions/Constraints</p>
          <p>5. Solution Overview / Expected Result</p>
          <p>6. Technical Solution Approach</p>
          <p>7. Test Strategy</p>
          <p>8. Operational Support Component Changes</p>
          <p>9. Database Changes Master</p>
          <p className="pl-4">9.1 DDL / DML Specification</p>
          <p className="pl-4">9.2 Table Creation Scripts</p>
          <p className="pl-4">9.3 Package / Procedure Changes</p>
          <p>10. Security & Compliance</p>
          <p>11. Open Issues</p>
          <p>12. Addendum</p>
        </div>
      </div>

      <div className="page-break" style={{ pageBreakBefore: 'always' }}></div>

      {/* Content Sections */}
      <div className="py-8 space-y-12 markdown-body">
        <section id="section-1">
          <h1>1. Introduction</h1>
          <ReactMarkdown>{data.introduction}</ReactMarkdown>
        </section>

        <section id="section-2">
          <h1>2. Basic Business Need</h1>
          <ReactMarkdown>{data.businessNeed}</ReactMarkdown>
          
          {data.specType === 'enhancement' && (
            <div className="mt-8 space-y-8 no-print-break">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <h2 className="text-orange-700 !mt-0">Current Situation (Existing State)</h2>
                <div className="prose prose-slate prose-sm max-w-none">
                   <ReactMarkdown>{data.currentSituation || '*No existing state described.*'}</ReactMarkdown>
                </div>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h2 className="text-blue-700 !mt-0">Proposed Changes / Fix</h2>
                <div className="prose prose-slate prose-sm max-w-none">
                   <ReactMarkdown>{data.proposedChanges || '*No proposed changes described.*'}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </section>

        <section id="section-3">
          <h1>3. Scope</h1>
          <h2>3.1 In-scope</h2>
          <ReactMarkdown>{data.scopeIn}</ReactMarkdown>
          <h2>3.2 Out-of-Scope</h2>
          <ReactMarkdown>{data.scopeOut}</ReactMarkdown>
        </section>

        <section id="section-4">
          <h1>4. Assumptions/Constraints</h1>
          <h2>4.1 Assumptions</h2>
          <ReactMarkdown>{data.assumptions}</ReactMarkdown>
          <h2>4.2 Constraints</h2>
          <ReactMarkdown>{data.constraints}</ReactMarkdown>
        </section>

        <section id="section-5">
           <h1>5. Solution Overview / Expected Result</h1>
           <h2>5.1 Process Inputs</h2>
           <table className="w-full border-collapse border border-slate-300 text-sm">
             <thead>
               <tr className="bg-slate-50">
                 <th className="border border-slate-300 p-2 text-left">Criteria</th>
                 <th className="border border-slate-300 p-2 text-left">Source</th>
                 <th className="border border-slate-300 p-2 text-left">Process Step</th>
               </tr>
             </thead>
             <tbody>
               {data.processInputs.length > 0 ? data.processInputs.map((item) => (
                 <tr key={item.id}>
                   <td className="border border-slate-300 p-2">{item.criteria}</td>
                   <td className="border border-slate-300 p-2">{item.source}</td>
                   <td className="border border-slate-300 p-2">{item.processStep}</td>
                 </tr>
               )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No process inputs provided</td></tr>}
             </tbody>
           </table>

           <h2 className="mt-8">5.2 Expected Results</h2>
           <table className="w-full border-collapse border border-slate-300 text-sm">
             <thead>
               <tr className="bg-slate-50">
                 <th className="border border-slate-300 p-2 text-left">Primary Process Considerations</th>
                 <th className="border border-slate-300 p-2 text-left">Criteria</th>
                 <th className="border border-slate-300 p-2 text-left">Reference</th>
               </tr>
             </thead>
             <tbody>
               {data.expectedResults.length > 0 ? data.expectedResults.map((item) => (
                 <tr key={item.id}>
                   <td className="border border-slate-300 p-2">{item.consideration}</td>
                   <td className="border border-slate-300 p-2">{item.criteria}</td>
                   <td className="border border-slate-300 p-2">{item.reference}</td>
                 </tr>
               )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No expected results provided</td></tr>}
             </tbody>
           </table>
        </section>

        <section id="section-6">
           <h1>6. Technical Solution Approach / Specifications</h1>
           <h2>6.1 Specifications</h2>
           <ReactMarkdown>{data.technicalApproach}</ReactMarkdown>
           
           <h2 className="mt-8">6.2 Impacting Areas</h2>
           <table className="w-full border-collapse border border-slate-300 text-sm">
             <thead>
               <tr className="bg-slate-50">
                 <th className="border border-slate-300 p-2 text-left">Layer</th>
                 <th className="border border-slate-300 p-2 text-left">Object Name</th>
                 <th className="border border-slate-300 p-2 text-left">Component ID</th>
               </tr>
             </thead>
             <tbody>
               {data.impactingAreas.length > 0 ? data.impactingAreas.map((item) => (
                 <tr key={item.id}>
                   <td className="border border-slate-300 p-2">{item.layer}</td>
                   <td className="border border-slate-300 p-2">{item.objectName}</td>
                   <td className="border border-slate-300 p-2">{item.componentId}</td>
                 </tr>
               )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No impacting areas listed</td></tr>}
             </tbody>
           </table>
        </section>

        <section id="section-7">
           <h1>7. Test Strategy</h1>
           {['Functional', 'Integration', 'Regression'].map((stage) => (
             <div key={stage} className="mt-6">
               <h2 className="capitalize">{stage} Testing</h2>
               <table className="w-full border-collapse border border-slate-300 text-sm">
                 <thead>
                   <tr className="bg-slate-50">
                     <th className="border border-slate-300 p-2 text-left">Scenario</th>
                     <th className="border border-slate-300 p-2 text-left">Test Data</th>
                     <th className="border border-slate-300 p-2 text-left">Expected Result</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.testCasesList.filter(tc => tc.stage === stage).length > 0 ? 
                    data.testCasesList.filter(tc => tc.stage === stage).map((item) => (
                     <tr key={item.id}>
                       <td className="border border-slate-300 p-2">{item.scenario}</td>
                       <td className="border border-slate-300 p-2">{item.testData}</td>
                       <td className="border border-slate-300 p-2">{item.expectedResult}</td>
                     </tr>
                    )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No {stage} test cases listed</td></tr>
                   }
                 </tbody>
               </table>
             </div>
           ))}
        </section>

        <section id="section-8">
           <h1>8. Operational Support Component Changes</h1>
           <table className="w-full border-collapse border border-slate-300 text-sm">
             <thead>
               <tr className="bg-slate-50">
                 <th className="border border-slate-300 p-2 text-left">Component</th>
                 <th className="border border-slate-300 p-2 text-left">Type</th>
                 <th className="border border-slate-300 p-2 text-left">Owner</th>
               </tr>
             </thead>
             <tbody>
               {data.operationalSupport.length > 0 ? data.operationalSupport.map((item) => (
                 <tr key={item.id}>
                   <td className="border border-slate-300 p-2">{item.component}</td>
                   <td className="border border-slate-300 p-2">{item.changeType}</td>
                   <td className="border border-slate-300 p-2">{item.owner}</td>
                 </tr>
               )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No operational component changes listed</td></tr>}
             </tbody>
           </table>
        </section>

        <section id="section-9">
           <h1>9. Database Changes Master</h1>
           <h2>9.1 DDL / DML Specification</h2>
           <table className="w-full border-collapse border border-slate-300 text-sm">
             <thead>
               <tr className="bg-slate-50">
                 <th className="border border-slate-300 p-2 text-left w-20">Type</th>
                 <th className="border border-slate-300 p-2 text-left">Table / Object</th>
                 <th className="border border-slate-300 p-2 text-left">Action / Changes</th>
               </tr>
             </thead>
             <tbody>
               {data.dbChanges.length > 0 ? data.dbChanges.map((item) => (
                 <tr key={item.id}>
                   <td className="border border-slate-300 p-2 font-bold">{item.type}</td>
                   <td className="border border-slate-300 p-2">{item.tableName}</td>
                   <td className="border border-slate-300 p-2">{item.action}</td>
                 </tr>
               )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No specific DDL/DML entries listed</td></tr>}
             </tbody>
           </table>

           <h2 className="mt-8">9.2 Table Creation Scripts</h2>
           {data.dbScripts ? (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap overflow-x-auto text-slate-700">
                {data.dbScripts}
              </div>
           ) : <p className="text-slate-400 italic">No creation scripts provided</p>}

           <h2 className="mt-8">9.3 Package / Procedure Changes</h2>
           {data.dbPackageChanges ? (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap overflow-x-auto text-slate-700">
                {data.dbPackageChanges}
              </div>
           ) : <p className="text-slate-400 italic">No package changes provided</p>}
        </section>

        <section id="section-10">
           <h1>10. Security & Compliance</h1>
           <ReactMarkdown>{data.securityCompliance}</ReactMarkdown>
        </section>

        <section id="section-11">
           <h1>11. Open Issues</h1>
           <table className="w-full border-collapse border border-slate-300 text-sm">
             <thead>
               <tr className="bg-slate-50">
                 <th className="border border-slate-300 p-2 text-left">Issue</th>
                 <th className="border border-slate-300 p-2 text-left">Responsibility</th>
                 <th className="border border-slate-300 p-2 text-left">Target Date</th>
               </tr>
             </thead>
             <tbody>
               {data.openIssues.length > 0 ? data.openIssues.map((item) => (
                 <tr key={item.id}>
                   <td className="border border-slate-300 p-2">{item.issue}</td>
                   <td className="border border-slate-300 p-2">{item.responsibility}</td>
                   <td className="border border-slate-300 p-2">{item.targetDate}</td>
                 </tr>
               )) : <tr><td colSpan={3} className="border border-slate-300 p-4 text-center text-slate-400 italic">No open issues listed</td></tr>}
             </tbody>
           </table>
        </section>

        <section id="section-12">
           <h1>12. Addendum</h1>
           <div className="markdown-body">
             <ReactMarkdown>{data.addendum}</ReactMarkdown>
           </div>
        </section>
      </div>
    </div>
  );
}
