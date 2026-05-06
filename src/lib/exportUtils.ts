/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Document, 
  Packer, 
  Paragraph, 
  HeadingLevel, 
  AlignmentType, 
  PageBreak, 
  Footer, 
  TextRun, 
  PageNumber, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType,
  BorderStyle,
  VerticalAlign
} from 'docx';
import { saveAs } from 'file-saver';
import { SpecData } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helper for horizontal line in docx
const createHorizontalLine = () => new Paragraph({
  border: {
    bottom: {
      color: "333333",
      space: 1,
      style: BorderStyle.SINGLE,
      size: 6,
    },
  },
  spacing: { before: 100, after: 300 }
});

export async function exportToWord(data: SpecData) {
  const sections = [];

  // 1. Cover Page
  sections.push({
    properties: {
      page: {
        pageNumbers: { start: 1 }
      }
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${data.companyName} | Page `, size: 18 }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18 }),
            ],
          }),
        ],
      }),
    },
    children: [
      new Paragraph({
        text: data.projectTitle.toUpperCase(),
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { before: 3000, after: 400 }
      }),
      new Paragraph({
        text: data.companyName,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: "Technical Specification Document",
        alignment: AlignmentType.CENTER,
        spacing: { after: 1200 }
      }),
      new Paragraph({
        text: data.documentSubtitle,
        alignment: AlignmentType.CENTER,
        spacing: { before: 1000 }
      }),
      new PageBreak(),

      // Section TOC List
      new Paragraph({ text: "Table of Contents", heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
      ...(data.specType !== 'blank' ? [
        new Paragraph({ text: "1. Introduction", spacing: { after: 100 } }),
        new Paragraph({ text: "2. Business Need", spacing: { after: 100 } }),
        new Paragraph({ text: "3. Scope", spacing: { after: 100 } }),
        new Paragraph({ text: "4. Assumptions & Constraints", spacing: { after: 100 } }),
        new Paragraph({ text: "5. Solution Overview", spacing: { after: 100 } }),
        new Paragraph({ text: "6. Technical Specifications", spacing: { after: 100 } }),
        new Paragraph({ text: "7. Test Strategy", spacing: { after: 100 } }),
        new Paragraph({ text: "8. Database Master Schema", spacing: { after: 100 } }),
        new Paragraph({ text: "9. Operational Support", spacing: { after: 100 } }),
        new Paragraph({ text: "10. Security & Compliance", spacing: { after: 100 } }),
        new Paragraph({ text: "11. Open Review Points", spacing: { after: 100 } }),
      ] : []),
      ...(data.customSections || []).sort((a, b) => a.order - b.order).map((s, idx) => 
        new Paragraph({ 
          text: `${(data.specType === 'blank' ? 1 : 12) + idx}. ${s.title}`, 
          spacing: { after: 100 } 
        })
      ),
      new Paragraph({ 
        text: `${(data.specType === 'blank' ? 1 : 12) + (data.customSections || []).length}. Addendum`, 
        spacing: { after: 100 } 
      }),
      new PageBreak(),

      // Section Content
      ...(data.specType !== 'blank' ? [
        // Section 1
        new Paragraph({ text: "1. Introduction", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: data.introduction || '' }),
        new PageBreak(),

        // Section 2
        new Paragraph({ text: "2. Business Need", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: data.businessNeed || '' }),
        new PageBreak(),

        // Section 3: Current vs Proposed
        new Paragraph({ text: "3. Current vs Proposed", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "3.1 Current Situation", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.currentSituation || '' }),
        new Paragraph({ text: "3.2 Proposed Changes", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.proposedChanges || '' }),
        new PageBreak(),

        // Section 4
        new Paragraph({ text: "4. Scope", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "4.1 In Scope", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.scopeIn || '' }),
        new Paragraph({ text: "4.2 Out of Scope", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.scopeOut || '' }),
        new PageBreak(),

        // Section 5
        new Paragraph({ text: "5. Assumptions & Constraints", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "5.1 Assumptions", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.assumptions || '' }),
        new Paragraph({ text: "5.2 Constraints", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.constraints || '' }),
        new PageBreak(),

        // Section 6
        new Paragraph({ text: "6. Solution Overview", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "6.1 Process Inputs", heading: HeadingLevel.HEADING_2 }),
        ...data.processInputs.map(item => new Paragraph({ text: `- ${item.criteria} (Source: ${item.source})` })),
        new Paragraph({ text: "6.2 Expected Results", heading: HeadingLevel.HEADING_2 }),
        ...data.expectedResults.map(item => new Paragraph({ text: `- ${item.consideration}: ${item.criteria}` })),
        new PageBreak(),

        // Section 7
        new Paragraph({ text: "7. Technical Specifications", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: "7.1 Solution Approach", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: data.technicalApproach || '' }),
        new Paragraph({ text: "7.2 Object Impact Analysis", heading: HeadingLevel.HEADING_2 }),
        ...data.impactingAreas.map(item => new Paragraph({ text: `- ${item.objectName} [${item.layer}]` })),
        new PageBreak(),

        // Section 8
        new Paragraph({ text: "8. Test Strategy", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...data.testCasesList.map(item => new Paragraph({ text: `- [${item.stage}] ${item.scenario}: ${item.expectedResult}` })),
        new PageBreak(),

        // Section 9
        new Paragraph({ text: "9. Operational Support", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...data.operationalSupport.map(item => new Paragraph({ text: `- ${item.component} (Owner: ${item.owner})` })),
        new PageBreak(),

        // Section 10
        new Paragraph({ text: "10. Database Master Schema", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...data.dbChanges.map(item => new Paragraph({ text: `- ${item.type} ${item.tableName}: ${item.action}` })),
        new PageBreak(),

        // Section 11
        new Paragraph({ text: "11. Security & Compliance", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: data.securityCompliance || '' }),
        new PageBreak(),

        // Section 12
        new Paragraph({ text: "12. Open Review Points", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        ...data.openIssues.map(item => new Paragraph({ text: `- ${item.issue} (Owner: ${item.responsibility})` })),
        new PageBreak(),
      ] : []),

      // Custom Sections
      ...(data.customSections || []).sort((a, b) => a.order - b.order).flatMap((s, idx) => [
        new Paragraph({ text: `${(data.specType === 'blank' ? 1 : 12) + idx}. ${s.title}`, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
        new Paragraph({ text: s.content || '' }),
        new PageBreak()
      ]),

      // Addendum
      new Paragraph({ text: `${(data.specType === 'blank' ? 1 : 12) + (data.customSections || []).length}. Addendum`, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: data.addendum || '' })
    ]
  });

  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.projectTitle.replace(/\s+/g, '_')}_Spec.docx`);
}

export async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Generate a higher-res image of the entire container
    const canvas = await html2canvas(element, {
      scale: 1.5, // 1.5x scale for balance between quality and file size
      useCORS: true,
      logging: false,
      backgroundColor: '#f1f5f9', // Slate-100 background to match app
      scrollX: 0,
      scrollY: -window.scrollY // Reset scroll offset
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Create PDF with A4 sizing
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate aspect ratio
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgHeight / imgWidth;
    
    const totalPdfHeight = pdfWidth * ratio;
    let heightLeft = totalPdfHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - totalPdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${filename.replace(/\s+/g, '_')}_Spec.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
