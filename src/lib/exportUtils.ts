/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { SpecData } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportToWord(data: SpecData) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: data.projectTitle,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }
          }),
          new Paragraph({
            text: data.companyName,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 }
          }),
          new Paragraph({
            text: data.documentSubtitle,
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 }
          }),
          
          new Paragraph({
            text: "1. Introduction",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ text: data.introduction }),

          new Paragraph({
            text: "2. Business Need",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ text: data.businessNeed }),

          new Paragraph({
            text: "3. Scope",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ text: "3.1 In Scope", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.scopeIn }),
          new Paragraph({ text: "3.2 Out of Scope", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.scopeOut }),

          new Paragraph({
            text: "4. Technical Approach",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({ text: data.technicalApproach })
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.projectTitle.replace(/\s+/g, '_')}_Spec.docx`);
}

export async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 850 // Match DocumentLayout max-width
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2]
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}
