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

      // Table of Contents Heading (Actual TOC in Word is hard with this library but we list headings)
      new Paragraph({ text: "Table of Contents", heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
      new Paragraph({ text: "1. Introduction", spacing: { after: 100 } }),
      new Paragraph({ text: "2. Business Need", spacing: { after: 100 } }),
      new Paragraph({ text: "3. Scope", spacing: { after: 100 } }),
      new Paragraph({ text: "4. Assumptions & Constraints", spacing: { after: 100 } }),
      new Paragraph({ text: "5. Solution Overview", spacing: { after: 100 } }),
      new Paragraph({ text: "6. Technical Specifications", spacing: { after: 100 } }),
      new Paragraph({ text: "7. Test Strategy", spacing: { after: 100 } }),
      new Paragraph({ text: "8. Database Master Schema", spacing: { after: 100 } }),
      new PageBreak(),

      // Section 1
      new Paragraph({ text: "1. Introduction", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: data.introduction }),
      new PageBreak(),

      // Section 2
      new Paragraph({ text: "2. Business Need", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: data.businessNeed }),
      new PageBreak(),

      // Section 3
      new Paragraph({ text: "3. Scope", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: "3.1 In Scope", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.scopeIn }),
      new Paragraph({ text: "3.2 Out of Scope", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.scopeOut }),
      new PageBreak(),

      // Section 4
      new Paragraph({ text: "4. Assumptions & Constraints", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: "4.1 Assumptions", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.assumptions }),
      new Paragraph({ text: "4.2 Constraints", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: data.constraints }),
      new PageBreak(),

      // Section 5
      new Paragraph({ text: "5. Technical Specifications", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: data.technicalApproach }),
      new PageBreak(),

      // Section 6
      new Paragraph({ text: "6. Addendum", heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } }),
      new Paragraph({ text: data.addendum })
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
