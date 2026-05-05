/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, BorderStyle, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { SpecData } from '../types';

export async function exportToWord(data: SpecData) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Cover
          new Paragraph({
            text: data.projectTitle,
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: data.companyName,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: data.documentSubtitle,
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
          }),
          
          new Paragraph({ text: "", spacing: { before: 1000 } }),
          
          // Introduction
          new Paragraph({
            text: "1. Introduction",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({
            text: data.introduction.replace(/#/g, ''), // Basic markdown strip for now
            spacing: { before: 200 },
          }),

          // Business Need
          new Paragraph({
            text: "2. Basic Business Need",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: data.businessNeed }),

          ...(data.specType === 'enhancement' ? [
            new Paragraph({ text: "2.1 Current Situation", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
            new Paragraph({ text: data.currentSituation }),
            new Paragraph({ text: "2.2 Proposed Changes / Fix", heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }),
            new Paragraph({ text: data.proposedChanges }),
          ] : []),

          // Scope
          new Paragraph({
            text: "3. Scope",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: "3.1 In-Scope", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.scopeIn }),
          new Paragraph({ text: "3.2 Out-of-Scope", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.scopeOut }),

          // Technical
          new Paragraph({
            text: "6. Technical Solution Approach",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: data.technicalApproach }),

          // Test Cases
          new Paragraph({
            text: "7. Test Cases",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: "See document tables for detailed test case scenarios across Functional, SIT and Regression stages." }),
          
          // Open Issues
          new Paragraph({
            text: "10. Open Issues",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400 },
          }),
          new Paragraph({ text: `Total Open Issues: ${data.openIssues.length}` }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.projectTitle.replace(/\s+/g, '_')}_Spec.docx`);
}
