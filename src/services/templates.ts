/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SpecData, DEFAULT_SPEC } from '../types';

export const STANDARD_TEMPLATES: { id: string; name: string; description: string; data: SpecData }[] = [
  {
    id: 'tpl-api',
    name: 'API Specification',
    description: 'Perfect for documenting REST/GraphQL endpoints, payloads, and auth protocols.',
    data: {
      ...DEFAULT_SPEC,
      projectTitle: 'SERVICE API SPECIFICATION',
      introduction: 'This document defines the interface and behaviors for the [Service Name] API.',
      businessNeed: 'Enable seamless integration for internal and external consumers while ensuring data integrity and security.',
      technicalApproach: '### Architecture Overview\n- **Runtime:** Node.js / Go / Python\n- **Protocol:** REST over HTTPS\n- **Auth:** OAuth2 / JWT\n\n### Endpoint Design Guidelines\n1. Use plural nouns for resources.\n2. Version all endpoints via URL path (e.g., /v1/).\n3. Consistent error response format.',
      securityCompliance: '### Auth & Identity\n- All requests require a valid Bearer token.\n- Rate limiting enforced at 1000 req/min/IP.',
    }
  },
  {
    id: 'tpl-db',
    name: 'DB Migration Spec',
    description: 'Detailed schema changes, indexing strategies, and rollback procedures.',
    data: {
      ...DEFAULT_SPEC,
      projectTitle: 'DATABASE SCHEMA MIGRATION',
      introduction: 'Technical blueprint for introducing changes to the [Database Name] production schema.',
      businessNeed: 'Scale storage capacity and improve query performance for high-growth data sets.',
      technicalApproach: '### Migration Strategy\n- **Zero-Downtime Approach:** Expand-Contract pattern.\n- **Validation:** Pre-deployment staging sync.',
      dbScripts: '-- Migration v1.0\nALTER TABLE users ADD COLUMN last_login_at TIMESTAMPTZ;\nCREATE INDEX idx_users_email ON users(email);',
    }
  },
  {
    id: 'tpl-cloud',
    name: 'Cloud Infrastructure',
    description: 'AWS/GCP/Azure resource allocation, VPC networking, and IAM policies.',
    data: {
      ...DEFAULT_SPEC,
      projectTitle: 'CLOUD INFRASTRUCTURE BLUEPRINT',
      introduction: 'Defines the environment topology and resource provisioning for [Project Name].',
      businessNeed: 'Provide a resilient, high-availability hosting environment with automated scaling.',
      technicalApproach: '### Infrastructure as Code\n- **Tooling:** Terraform / CloudFormation\n- **Region:** us-east-1 (Primary) / us-west-2 (DR)\n\n### Networking\n- Private Subnets for App Tier\n- Public Subnets for LB/Bastion',
    }
  },
  {
    id: 'tpl-project-doc',
    name: 'Project Documentation',
    description: 'General purpose project overview including objectives, stakeholders, and high-level milestones.',
    data: {
      ...DEFAULT_SPEC,
      projectTitle: 'PROJECT STATUS & OVERVIEW',
      introduction: 'This project aims to [Business Goal]. This document serves as the central source of truth for scope and progress.',
      businessNeed: 'Executive alignment and cross-functional visibility into the project lifecycle.',
      technicalApproach: '### Project Governance\n- **Methodology:** Agile / Scrum\n- **Reporting Frequency:** Bi-weekly pulse checks\n- **Communication:** Slack / MS Teams',
    }
  },
  {
    id: 'tpl-sop',
    name: 'SOP Documentation',
    description: 'Standard Operating Procedures for deployment, troubleshooting, and daily maintenance.',
    data: {
      ...DEFAULT_SPEC,
      projectTitle: 'STANDARD OPERATING PROCEDURES',
      introduction: 'Step-by-step instructions for executing recurring technical tasks within the [System Name] environment.',
      technicalApproach: '### Procedure Guidelines\n- Document every manual command exactly.\n- Include expected output for verification.\n- Note all required permissions (RBAC).',
      operationalSupport: [
        { id: 'sop-1', component: 'Logs', changeType: 'Monitor', description: 'Check error logs in Datadog/Splunk.', owner: 'Ops' },
        { id: 'sop-2', component: 'Backup', changeType: 'Verify', description: 'Verify backup completion status.', owner: 'Storage' },
      ],
    }
  },
  {
    id: 'tpl-ops-guide',
    name: 'Operation Guide',
    description: 'Comprehensive guide for SRE and Ops teams to manage production uptime and incidents.',
    data: {
      ...DEFAULT_SPEC,
      projectTitle: 'SERVICE OPERATIONS GUIDE',
      introduction: 'Critical information for the on-call engineer to maintain 99.9% availability.',
      technicalApproach: '### Monitoring & Alerts\n- **P0 Alerts:** Service down, data corruption.\n- **P1 Alerts:** Latency > 500ms, 5% error rate spike.',
      operationalSupport: [
        { id: 'ops-1', component: 'Escalation', changeType: 'Process', description: 'L1 -> On-call -> EM', owner: 'SRE' }
      ],
      securityCompliance: '### Access Control\n- Least privilege enforced via Just-In-Time (JIT) access.'
    }
  }
];
