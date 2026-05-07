/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VersionEntry {
  id: string;
  version: string;
  date: string;
  author: string;
  comments: string;
}

export interface PersonItem {
  id: string;
  name: string;
  designation: string;
  team?: string;
  date?: string;
  comments?: string;
}

export interface ProcessInput {
  id: string;
  criteria: string;
  source: string;
  processStep: string;
}

export interface ExpectedResult {
  id: string;
  consideration: string;
  criteria: string;
  reference: string;
}

export interface ImpactingArea {
  id: string;
  layer: string;
  objectName: string;
  componentId: string;
  status: string;
  purpose: string;
}

export interface TestCaseItem {
  id: string;
  stage: 'Functional' | 'Integration' | 'Regression';
  scenario: string;
  testData: string;
  expectedResult: string;
}

export interface DbChangeItem {
  id: string;
  type: 'DDL' | 'DML' | 'Index' | 'Sequence';
  action: string;
  tableName: string;
  description: string;
}

export interface OperationalSupportItem {
  id: string;
  component: string;
  changeType: string;
  description: string;
  owner: string;
}

export interface OpenIssue {
  id: string;
  issue: string;
  resolution: string;
  responsibility: string;
  targetDate: string;
}

export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  data: SpecData;
  createdAt?: string;
  updatedAt?: string;
  version?: string;
}

export type SubSectionType = 'markdown' | 'table' | 'script';

export interface TableRow {
  id: string;
  [key: string]: string;
}

export interface TableMetaData {
  columns: string[];
  rows: TableRow[];
}

export interface SubSection {
  id: string;
  title: string;
  type: SubSectionType;
  content: string;
  tableData?: TableMetaData;
  order: number;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  subSections: SubSection[];
  order: number;
}

export interface SpecData {
  specType: string;
  templateName?: string;
  projectTitle: string;
  companyName: string;
  documentSubtitle: string;
  versions: VersionEntry[];
  reviewers: PersonItem[];
  approvals: PersonItem[];
  introduction: string;
  businessNeed: string;
  currentSituation: string; // For Enhancements/Fixes
  proposedChanges: string;  // For Enhancements/Fixes
  scopeIn: string;
  scopeOut: string;
  assumptions: string;
  constraints: string;
  processInputs: ProcessInput[];
  expectedResults: ExpectedResult[];
  impactingAreas: ImpactingArea[];
  technicalApproach: string;
  operationalSupport: OperationalSupportItem[];
  dbChanges: DbChangeItem[];
  dbScripts: string;
  dbPackageChanges: string;
  testCasesList: TestCaseItem[];
  securityCompliance: string;
  openIssues: OpenIssue[];
  addendum: string;
  customSections: CustomSection[];
}

export const DEFAULT_SPEC: SpecData = {
  specType: 'new',
  projectTitle: "NEW PROJECT SPECIFICATION",
  companyName: "",
  documentSubtitle: "",
  versions: [
    { id: '1', version: '1.0', date: new Date().toLocaleDateString(), author: '', comments: 'Initial Draft' }
  ],
  reviewers: [],
  approvals: [],
  introduction: "",
  businessNeed: "",
  currentSituation: "",
  proposedChanges: "",
  scopeIn: "",
  scopeOut: "",
  assumptions: "",
  constraints: "",
  processInputs: [],
  expectedResults: [],
  impactingAreas: [],
  technicalApproach: "",
  operationalSupport: [],
  dbChanges: [],
  dbScripts: "",
  dbPackageChanges: "",
  testCasesList: [],
  securityCompliance: "",
  openIssues: [],
  addendum: "",
  customSections: []
};
