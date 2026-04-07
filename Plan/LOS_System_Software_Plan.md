# Loan Origination System (LOS) - Complete Software Development Plan

## 📋 Executive Summary

This document provides a comprehensive software development plan for building a **Loan Origination System (LOS)** similar to the los-mvp project. The system is a client-side web application for processing SME loan applications with automated credit analysis, document management, and decision workflow.

**Project Type:** Client-side Web Application (No Backend)  
**Target Users:** Banks, Financial Institutions, Lending Organizations  
**Primary Use Case:** SME Loan Application Processing & Approval Workflow

---

## 🎯 System Overview

### Core Purpose
A complete loan origination system that handles the entire lifecycle of SME loan applications from initial submission through approval/rejection, with automated risk assessment and comprehensive audit trails.

### Key Capabilities
- **Multi-role Access Control** (RM, Analyst, Approver, Admin)
- **Complete Application Workflow** (Draft → Submitted → Review → Decision)
- **Document Management** with upload/download capabilities
- **Automated Agent Review** with AI-powered risk assessment
- **Financial Analysis** (DSCR, cashflow, collateral coverage)
- **Decision Workflow** with approval conditions
- **Credit Memo Generation** (HTML format)
- **Comprehensive Audit Logging**

---

## 🏗️ Architecture Design

### Technology Stack

#### Frontend Framework
```
- React 18+ (UI Library)
- Vite (Build Tool & Dev Server)
- React Router v6 (Client-side Routing)
```

#### State Management
```
- Redux Toolkit (Global State)
- React Hooks (Local State)
```

#### Data Storage
```
- JSON Files (Static Data)
- localStorage (Runtime Cache)
- sessionStorage (User Session)
- Browser File API (Document Storage)
```

#### Styling
```
- CSS Modules or Styled Components
- Responsive Design (Mobile-first)
```

#### Utilities
```
- date-fns (Date Formatting)
- uuid (ID Generation)
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│  React Application                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Services   │      │
│  │  - Login     │  │  - Forms     │  │  - Auth      │      │
│  │  - Dashboard │  │  - Tables    │  │  - Data      │      │
│  │  - Apps      │  │  - Modals    │  │  - Agent     │      │
│  │  - Analysis  │  │  - Cards     │  │  - File      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Redux Store (State Management)              │   │
│  │  - Auth State    - Application State                 │   │
│  │  - Document State - Analysis State                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Layer                               │   │
│  │  localStorage Cache ←→ JSON Files ←→ sessionStorage  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Models

### 1. User Model
```javascript
{
  id: "uuid",
  username: "string",
  password: "string", // Plain text for demo (use hashing in production)
  name: "string",
  role: "RM | Credit_Analyst | Approver | Admin",
  email: "string",
  created_at: "ISO datetime",
  is_active: boolean
}
```

### 2. Application Model
```javascript
{
  id: "uuid",
  owner_user_id: "uuid",
  status: "Draft | Submitted | In_Review | Approved | Rejected | Completed",
  
  applicant: {
    legal_name: "string",
    business_type: "PT | CV | UD | Perorangan",
    industry: "string",
    years_in_business: number,
    address: "string",
    phone: "string"
  },
  
  loan_request: {
    amount: number,
    tenor_months: number,
    purpose: "string",
    repayment_type: "Anuitas | Efektif | Bullet"
  },
  
  financial_snapshot: {
    monthly_revenue: number,
    monthly_expenses: number,
    monthly_debt_payment: number
  },
  
  collateral: {
    type: "Property | Vehicle | Equipment | Inventory | Other",
    estimated_value: number,
    description: "string"
  },
  
  owner_info: {
    name: "string",
    id_number: "string",
    credit_score: number
  },
  
  created_at: "ISO datetime",
  updated_at: "ISO datetime",
  submitted_at: "ISO datetime"
}
```

### 3. Document Model
```javascript
{
  id: "uuid",
  application_id: "uuid",
  doc_type: "Bank_Statement | Financial_Statement | ID_KYC | Collateral_Proof | Other",
  filename: "string",
  file_size: number,
  storage_key: "string", // localStorage key
  uploaded_by: "uuid",
  uploaded_at: "ISO datetime"
}
```

### 4. Analysis Model
```javascript
{
  id: "uuid",
  application_id: "uuid",
  
  // Financial Metrics
  dscr: number,
  net_cashflow: number,
  collateral_coverage: number,
  risk_score: number, // 0-100
  
  // Risk Assessment
  risk_flags: [
    {
      flag: "string",
      severity: "High | Medium | Low",
      description: "string"
    }
  ],
  
  // Agent Review Results
  document_check: {
    required_documents: ["string"],
    uploaded_documents: ["string"],
    missing_documents: ["string"],
    completion_percentage: number,
    is_complete: boolean
  },
  
  analyst_notes: "string",
  created_by: "uuid",
  created_at: "ISO datetime",
  updated_at: "ISO datetime"
}
```

### 5. Decision Model
```javascript
{
  id: "uuid",
  application_id: "uuid",
  
  // Analyst Recommendation
  recommended_by: "uuid",
  recommended_decision: "Approve | Reject | Review",
  recommendation_notes: "string",
  recommended_at: "ISO datetime",
  
  // Final Decision
  approver_id: "uuid",
  final_decision: "Approved | Rejected",
  approval_conditions: [
    {
      condition: "string",
      type: "Precedent | Subsequent"
    }
  ],
  rejection_reason: "string",
  decided_at: "ISO datetime"
}
```

### 6. Audit Log Model
```javascript
{
  id: "uuid",
  user_id: "uuid",
  action: "CREATE | UPDATE | DELETE | SUBMIT | APPROVE | REJECT | UPLOAD | LOGIN | LOGOUT",
  entity_type: "Application | Document | Analysis | Decision | User",
  entity_id: "uuid",
  old_value: object,
  new_value: object,
  metadata: object,
  timestamp: "ISO datetime"
}
```

### 7. Policy Configuration Model
```javascript
{
  thresholds: {
    min_dscr: number,
    min_collateral_coverage: number,
    max_loan_amount: number,
    min_years_in_business: number,
    min_credit_score: number
  },
  
  required_documents: ["string"],
  
  risk_weights: {
    dscr: number,
    collateral_coverage: number,
    credit_score: number,
    years_in_business: number
  },
  
  interest_rate_default: number
}
```

---

## 🔐 Role-Based Access Control (RBAC)

### User Roles

#### 1. Relationship Manager (RM)
**Responsibilities:**
- Create new loan applications
- Edit draft applications (own only)
- Upload documents
- Submit applications for review
- View own applications

**Permissions:**
```javascript
- create_application: true
- edit_application: true (own drafts only)
- delete_application: true (own drafts only)
- submit_application: true (own only)
- upload_document: true
- run_agent_review: true
- view_applications: true (own only)
```

#### 2. Credit Analyst
**Responsibilities:**
- Review submitted applications
- Upload additional documents
- Run automated agent reviews
- Perform financial analysis
- Edit analysis results
- Submit recommendations

**Permissions:**
```javascript
- view_applications: true (all submitted)
- upload_document: true
- run_agent_review: true
- edit_analysis: true
- submit_recommendation: true
- generate_memo: true
```

#### 3. Approver
**Responsibilities:**
- Review analyst recommendations
- Approve or reject applications
- Set approval conditions
- View audit logs

**Permissions:**
```javascript
- view_applications: true (all in review)
- approve_reject: true
- view_audit_logs: true
- generate_memo: true
```

#### 4. Admin
**Responsibilities:**
- Full system access
- Manage users
- Edit policy configuration
- View all audit logs
- Override any action

**Permissions:**
```javascript
- all_permissions: true
```

---

## 🔄 Application Workflow

### Status Flow Diagram
```
┌─────────┐
│  Draft  │ ← RM creates application
└────┬────┘
     │ RM submits
     ↓
┌──────────┐
│Submitted │ ← Waiting for analyst
└────┬─────┘
     │ Analyst starts review
     ↓
┌──────────┐
│In Review │ ← Analyst performs analysis
└────┬─────┘
     │ Approver makes decision
     ↓
┌──────────┐     ┌──────────┐
│ Approved │  or │ Rejected │
└────┬─────┘     └──────────┘
     │ Simulated disbursement
     ↓
┌───────────┐
│ Completed │
└───────────┘
```

### Workflow Rules

#### Draft → Submitted
- **Trigger:** RM clicks "Submit Application"
- **Validations:**
  - All required fields completed
  - At least one document uploaded
  - Owner is current user
- **Actions:**
  - Update status to "Submitted"
  - Set submitted_at timestamp
  - Log audit action

#### Submitted → In_Review
- **Trigger:** Analyst opens application
- **Validations:**
  - User has Credit_Analyst role
- **Actions:**
  - Update status to "In_Review"
  - Log audit action

#### In_Review → Approved/Rejected
- **Trigger:** Approver makes decision
- **Validations:**
  - User has Approver role
  - Analysis exists
  - Recommendation exists
- **Actions:**
  - Update status to "Approved" or "Rejected"
  - Create decision record
  - Set decided_at timestamp
  - Log audit action

#### Approved → Completed
- **Trigger:** Simulated disbursement (manual or automated)
- **Actions:**
  - Update status to "Completed"
  - Log audit action

---

## 🧮 Financial Calculations

### 1. Debt Service Coverage Ratio (DSCR)

**Formula:**
```
DSCR = Net Operating Income / Total Debt Service

Where:
- Net Operating Income = Monthly Revenue - Monthly Expenses
- Total Debt Service = Existing Debt Payment + New Loan Payment
- New Loan Payment = Calculated using annuity formula
```

**Implementation:**
```javascript
export const calculateDSCR = (
  monthlyRevenue, 
  monthlyExpenses, 
  monthlyDebtPayment, 
  loanAmount, 
  tenorMonths, 
  interestRate = 0.12
) => {
  const noi = monthlyRevenue - monthlyExpenses;
  const monthlyRate = interestRate / 12;
  
  // Annuity formula
  const monthlyPayment = loanAmount * 
    (monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) / 
    (Math.pow(1 + monthlyRate, tenorMonths) - 1);
  
  const totalDebtService = monthlyDebtPayment + monthlyPayment;
  const dscr = totalDebtService > 0 ? noi / totalDebtService : 0;
  
  return {
    dscr: parseFloat(dscr.toFixed(2)),
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    noi: parseFloat(noi.toFixed(2)),
    totalDebtService: parseFloat(totalDebtService.toFixed(2))
  };
};
```

**Interpretation:**
- DSCR > 1.5: Strong ability to service debt
- DSCR 1.2-1.5: Adequate debt coverage
- DSCR < 1.2: Insufficient debt coverage (high risk)

### 2. Collateral Coverage Ratio

**Formula:**
```
Coverage = Collateral Value / Loan Amount
```

**Implementation:**
```javascript
export const calculateCollateralCoverage = (collateralValue, loanAmount) => {
  return loanAmount > 0 ? 
    parseFloat((collateralValue / loanAmount).toFixed(2)) : 0;
};
```

**Interpretation:**
- Coverage > 1.5: Strong collateral protection
- Coverage 1.0-1.5: Adequate collateral
- Coverage < 1.0: Insufficient collateral (high risk)

### 3. Risk Score (0-100)

**Formula:**
```
Risk Score = Weighted Average of:
- DSCR Score (30%)
- Collateral Coverage Score (25%)
- Credit Score (25%)
- Years in Business Score (20%)
```

**Implementation:**
```javascript
export const calculateRiskScore = (
  dscr, 
  collateralCoverage, 
  creditScore, 
  yearsInBusiness, 
  policyConfig
) => {
  const weights = policyConfig.risk_weights;
  const thresholds = policyConfig.thresholds;
  
  // Normalize to 0-100 scale
  const dscrScore = Math.min(100, (dscr / thresholds.min_dscr) * 100);
  const collateralScore = Math.min(100, 
    (collateralCoverage / thresholds.min_collateral_coverage) * 100);
  const creditScoreNormalized = (creditScore / 850) * 100;
  const yearsScore = Math.min(100, 
    (yearsInBusiness / thresholds.min_years_in_business) * 100);
  
  // Weighted average
  const riskScore = (
    dscrScore * weights.dscr +
    collateralScore * weights.collateral_coverage +
    creditScoreNormalized * weights.credit_score +
    yearsScore * weights.years_in_business
  );
  
  return Math.round(riskScore);
};
```

**Interpretation:**
- Score 80-100: Low risk (strong approval candidate)
- Score 60-79: Medium risk (review required)
- Score < 60: High risk (likely rejection)

---

## 🤖 Automated Agent Review

### Agent Review Process

The agent review service performs automated analysis of loan applications:

#### 1. Document Completeness Check
```javascript
- Verify all required documents uploaded
- Calculate completion percentage
- Identify missing documents
- Flag incomplete applications
```

#### 2. Document Field Extraction (Mock)
```javascript
- Bank Statement: Extract account info, balances, cashflow
- Financial Statement: Extract revenue, expenses, assets, liabilities
- ID/KYC: Verify identity information
- Collateral Proof: Extract collateral details
```

#### 3. Data Quality Validation
```javascript
- Check for negative values
- Identify unrealistic values
- Validate data consistency
- Generate warnings
```

#### 4. Financial Analysis
```javascript
- Calculate DSCR
- Calculate net cashflow
- Calculate collateral coverage
- Calculate risk score
```

#### 5. Risk Flag Generation
```javascript
- Low DSCR (< threshold)
- Low credit score (< threshold)
- Insufficient business history
- Insufficient collateral
- Loan amount exceeds limit
- Negative cashflow
```

#### 6. Recommendation Generation
```javascript
Logic:
- If high severity flags >= 2: Recommend "Reject"
- If high severity flags == 1 OR total flags > 2: Recommend "Review"
- If total flags > 0: Recommend "Review"
- If no flags: Recommend "Approve"
```

#### 7. Approval Conditions (if Approve)
```javascript
Standard Conditions:
- Quarterly financial reporting
- Insurance on collateral (if coverage < 1.5)
- Monthly cashflow monitoring (if DSCR < 1.5)
- Personal guarantee (if business age < 3 years)
```

---

## 📁 Project Structure

```
los-system/
├── public/
│   ├── data/                      # JSON data files
│   │   ├── users.json
│   │   ├── applications.json
│   │   ├── documents.json
│   │   ├── analyses.json
│   │   ├── decisions.json
│   │   └── audit_logs.json
│   ├── config/
│   │   └── policy_config.json     # Business rules
│   ├── uploads/                   # Document storage (simulated)
│   └── index.html
│
├── src/
│   ├── services/                  # Business logic layer
│   │   ├── authService.js         # Authentication & authorization
│   │   ├── dataService.js         # CRUD operations
│   │   ├── fileService.js         # File upload/download
│   │   ├── auditService.js        # Audit logging
│   │   ├── agentService.js        # Automated review
│   │   └── memoService.js         # Credit memo generation
│   │
│   ├── store/                     # Redux state management
│   │   ├── store.js               # Store configuration
│   │   └── slices/
│   │       ├── authSlice.js       # Auth state
│   │       ├── applicationSlice.js # Application state
│   │       ├── documentSlice.js   # Document state
│   │       └── analysisSlice.js   # Analysis state
│   │
│   ├── components/                # Reusable UI components
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── applications/
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── ApplicationList.jsx
│   │   │   ├── ApplicationCard.jsx
│   │   │   └── ApplicationDetails.jsx
│   │   │
│   │   ├── documents/
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── DocumentList.jsx
│   │   │   └── DocumentViewer.jsx
│   │   │
│   │   ├── analysis/
│   │   │   ├── AnalysisForm.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   ├── RiskFlags.jsx
│   │   │   └── FinancialMetrics.jsx
│   │   │
│   │   └── decision/
│   │       ├── DecisionForm.jsx
│   │       ├── RecommendationView.jsx
│   │       └── ApprovalConditions.jsx
│   │
│   ├── pages/                     # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Applications.jsx
│   │   ├── ApplicationDetail.jsx
│   │   ├── Analysis.jsx
│   │   ├── Decision.jsx
│   │   ├── AuditLogs.jsx
│   │   └── Settings.jsx
│   │
│   ├── utils/                     # Utility functions
│   │   ├── constants.js           # Constants & enums
│   │   ├── calculations.js        # Financial formulas
│   │   ├── validators.js          # Form validation
│   │   └── formatters.js          # Data formatting
│   │
│   ├── templates/                 # HTML templates
│   │   └── creditMemoTemplate.js  # Credit memo HTML
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useApplications.js
│   │   └── useDocuments.js
│   │
│   ├── styles/                    # CSS files
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── components/
│   │
│   ├── App.jsx                    # Root component
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Global styles
│
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🛠️ Implementation Plan

### Phase 1: Foundation Setup (Week 1)

#### 1.1 Project Initialization
```bash
# Create Vite + React project
npm create vite@latest los-system -- --template react

# Install dependencies
npm install @reduxjs/toolkit react-redux react-router-dom uuid date-fns

# Install dev dependencies
npm install -D eslint eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### 1.2 Folder Structure
- Create all directories as per project structure
- Setup basic file templates
- Configure Vite and ESLint

#### 1.3 Constants & Utilities
- Create [`constants.js`](src/utils/constants.js:1-111) with all enums
- Implement [`calculations.js`](src/utils/calculations.js:1-206) with financial formulas
- Create validators and formatters

#### 1.4 Data Files
- Create JSON files in [`public/data/`](public/data/)
- Setup [`policy_config.json`](public/config/policy_config.json:1-22)
- Initialize with sample data

**Deliverables:**
- ✅ Project initialized
- ✅ Folder structure complete
- ✅ Constants and utilities ready
- ✅ Sample data files created

---

### Phase 2: Services Layer (Week 2)

#### 2.1 Authentication Service
Implement [`authService.js`](src/services/authService.js:1-204):
```javascript
- login(username, password)
- logout()
- getCurrentUser()
- isAuthenticated()
- hasRole(role)
- canPerformAction(action, resource, ownerId)
```

#### 2.2 Data Service
Implement [`dataService.js`](src/services/dataService.js:1-654):
```javascript
// Applications
- getAllApplications()
- getApplicationById(id)
- createApplication(data, userId)
- updateApplication(id, updates, userId)
- submitApplication(id, userId)

// Documents
- getAllDocuments()
- getDocumentsByApplicationId(appId)
- addDocument(data, userId)
- deleteDocument(id, userId)

// Analyses
- getAllAnalyses()
- getAnalysisByApplicationId(appId)
- saveAnalysis(data, userId)

// Decisions
- getAllDecisions()
- submitRecommendation(appId, recommendation, userId)
- approveApplication(appId, conditions, userId)
- rejectApplication(appId, reason, userId)

// Policy Config
- getPolicyConfig()
- updatePolicyConfig(config, userId)
```

#### 2.3 File Service
Implement file handling:
```javascript
- uploadFile(file, applicationId, docType)
- downloadFile(storageKey, filename)
- deleteFile(storageKey)
- getFileSize(storageKey)
```

#### 2.4 Audit Service
Implement comprehensive logging:
```javascript
- logAuditAction(userId, action, entityType, entityId, oldValue, newValue)
- getAuditLogs(filters)
- exportAuditLogs(format)
```

#### 2.5 Agent Service
Implement [`agentService.js`](src/services/agentService.js:1-340):
```javascript
- runAgentReview(application)
- checkDocumentCompleteness(documents, policy)
- extractDocumentFields(documents)
- validateDataQuality(application)
- performFinancialAnalysis(application, policy)
- generateReviewSummary(reviewResult, application)
```

#### 2.6 Memo Service
Implement credit memo generation:
```javascript
- generateCreditMemo(application, analysis, decision)
- exportMemoAsHTML(memo)
- exportMemoAsPDF(memo)
```

**Deliverables:**
- ✅ All services implemented
- ✅ Unit tests for critical functions
- ✅ Service integration tested

---

### Phase 3: State Management (Week 3)

#### 3.1 Redux Store Setup
Create [`store.js`](src/store/store.js:1-12):
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import applicationReducer from './slices/applicationSlice';
import documentReducer from './slices/documentSlice';
import analysisReducer from './slices/analysisSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    applications: applicationReducer,
    documents: documentReducer,
    analyses: analysisReducer,
  },
});
```

#### 3.2 Auth Slice
Implement [`authSlice.js`](src/store/slices/authSlice.js:1-72):
```javascript
- State: user, isAuthenticated, loading, error
- Thunks: loginUser, logoutUser
- Reducers: clearError
```

#### 3.3 Application Slice
```javascript
- State: applications, currentApplication, loading, error
- Thunks: 
  - fetchApplications
  - fetchApplicationById
  - createApplication
  - updateApplication
  - submitApplication
  - deleteApplication
- Reducers: setCurrentApplication, clearError
```

#### 3.4 Document Slice
```javascript
- State: documents, loading, error
- Thunks:
  - fetchDocuments
  - uploadDocument
  - deleteDocument
- Reducers: clearError
```

#### 3.5 Analysis Slice
```javascript
- State: analyses, currentAnalysis, loading, error
- Thunks:
  - fetchAnalysis
  - runAgentReview
  - saveAnalysis
- Reducers: setCurrentAnalysis, clearError
```

**Deliverables:**
- ✅ Redux store configured
- ✅ All slices implemented
- ✅ Async thunks working
- ✅ State management tested

---

### Phase 4: UI Components (Week 4-5)

#### 4.1 Common Components
```javascript
// Basic UI elements
- Button (primary, secondary, danger, disabled states)
- Input (text, number, email, password, textarea)
- Select (dropdown with search)
- Modal (confirmation, form, info)
- Card (container with header, body, footer)
- Table (sortable, filterable, paginated)
- Badge (status indicators)
- Loader (spinner, skeleton)
- Alert (success, error, warning, info)
```

#### 4.2 Layout Components
```javascript
- Header (logo, user menu, notifications)
- Sidebar (navigation menu, role-based)
- Footer (copyright, links)
- Layout (combines header, sidebar, content, footer)
```

#### 4.3 Application Components
```javascript
- ApplicationForm (multi-step form)
  - Step 1: Applicant Information
  - Step 2: Loan Request Details
  - Step 3: Financial Snapshot
  - Step 4: Collateral Information
  - Step 5: Owner Information
  
- ApplicationList (table with filters, search, pagination)
- ApplicationCard (summary card view)
- ApplicationDetails (full view with tabs)
- StatusBadge (visual status indicator)
```

#### 4.4 Document Components
```javascript
- DocumentUpload (drag-drop, file picker)
- DocumentList (table with download, delete)
- DocumentViewer (preview for images/PDFs)
- DocumentProgress (checklist with completion %)
```

#### 4.5 Analysis Components
```javascript
- AnalysisForm (analyst notes, manual adjustments)
- AnalysisResults (metrics display)
- RiskFlags (list with severity indicators)
- FinancialMetrics (DSCR, cashflow, coverage charts)
- AgentReviewResults (comprehensive review display)
```

#### 4.6 Decision Components
```javascript
- DecisionForm (approve/reject with conditions)
- RecommendationView (analyst recommendation display)
- ApprovalConditions (list of precedent/subsequent conditions)
- DecisionHistory (timeline of decisions)
```

**Deliverables:**
- ✅ All components implemented
- ✅ Components styled and responsive
- ✅ Component documentation
- ✅ Storybook (optional)

---

### Phase 5: Pages & Routing (Week 6)

#### 5.1 Authentication Pages
```javascript
// Login.jsx
- Login form
- Role selection (for demo)
- Error handling
- Redirect after login
```

#### 5.2 Dashboard Page
```javascript
// Dashboard.jsx
- Role-based dashboard
- Statistics cards (total apps, pending, approved, rejected)
- Recent applications table
- Quick actions
- Charts (status distribution, monthly trends)
```

#### 5.3 Application Pages
```javascript
// Applications.jsx
- Application list with filters
- Search functionality
- Status filters
- Create new button (RM only)

// ApplicationDetail.jsx
- Application information tabs
  - Overview
  - Documents
  - Analysis
  - Decision
  - Audit Trail
- Action buttons (role-based)
```

#### 5.4 Analysis Page
```javascript
// Analysis.jsx
- Financial metrics display
- Agent review results
- Risk flags
- Analyst notes form
- Submit recommendation
```

#### 5.5 Decision Page
```javascript
// Decision.jsx
- Recommendation review
- Approve/Reject form
- Approval conditions
- Rejection reason
- Decision history
```

#### 5.6 Admin Pages
```javascript
// AuditLogs.jsx
- Audit log table
- Filters (user, action, entity, date range)
- Export functionality

// Settings.jsx
- Policy configuration editor
- User management (future)
- System settings
```

#### 5.7 Routing Setup
Implement [`App.jsx`](src/App.jsx:1-66):
```javascript
<Router>
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    
    {/* Protected Routes */}
    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="applications" element={<Applications />} />
      <Route path="applications/:id" element={<ApplicationDetail />} />
      <Route path="analysis/:id" element={<Analysis />} />
      <Route path="decision/:id" element={<Decision />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="settings" element={<Settings />} />
    </Route>
    
    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
</Router>
```

**Deliverables:**
- ✅ All pages implemented
- ✅ Routing configured
- ✅ Protected routes working
- ✅ Navigation tested

---

### Phase 6: Integration & Testing (Week 7)

#### 6.1 Service Integration
- Connect components to Redux store
- Implement data fetching on mount
- Handle loading and error states
- Implement optimistic updates

#### 6.2 Workflow Testing
Test complete workflows:
```
1. RM creates application → submits
2. Analyst reviews → runs agent → submits recommendation
3. Approver reviews → approves/rejects
4. Verify status transitions
5. Check audit logs
```

#### 6.3 Role-Based Testing
Test each role's permissions:
```
- RM: Can create, edit own drafts, submit
- Analyst: Can review, analyze, recommend
- Approver: Can approve/reject
- Admin: Can do everything
```

#### 6.4 Edge Cases
```
- Empty states (no applications, no documents)
- Error handling (network errors, validation errors)
- Large datasets (pagination, performance)
- File upload limits
- Concurrent edits
```

#### 6.5 Browser Testing
```
- Chrome, Firefox, Safari, Edge
- Mobile responsive
- localStorage limits
- Session persistence
```

**Deliverables:**
- ✅ All workflows tested
- ✅ Role permissions verified
- ✅ Edge cases handled
- ✅ Cross-browser tested

---

### Phase 7: Polish & Documentation (Week 8)

#### 7.1 UI/UX Polish
```
- Consistent styling
- Loading indicators
- Success/error messages
- Smooth transitions
- Accessibility (ARIA labels, keyboard navigation)
```

#### 7.2 Performance Optimization
```
- Code splitting
- Lazy loading
- Memoization
- Virtual scrolling (large lists)
- Image optimization
```

#### 7.3 Documentation
```
- README.md (setup, usage)
- API documentation (services)
- Component documentation
- User guide
- Developer guide
```

#### 7.4 Demo Data Generator
```javascript
// Create script to generate sample data
- 50+ applications (various statuses)
- Documents for each application
- Analyses and decisions
- Audit logs
- Realistic data variations
```

**Deliverables:**
- ✅ UI polished
- ✅ Performance optimized
- ✅ Documentation complete
- ✅ Demo data ready

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Options

#### 1. Static Hosting (Recommended)
```
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
```

#### 2. Self-Hosted
```
- Nginx
- Apache
- Docker container
```

### Deployment Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/', // Change for subdirectory deployment
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  }
});
```

---

## 🔒 Security Considerations

### Current Implementation (Demo)
```
⚠️ NOT PRODUCTION READY
- Plain text passwords
- No encryption
- Client-side only
- No real authentication
- localStorage for sensitive data
```

### Production Requirements
```
✅ Must Implement:
1. Backend API with proper authentication
2. JWT or OAuth tokens
3. Password hashing (bcrypt)
4. HTTPS only
5. CSRF protection
6. XSS prevention
7. Input sanitization
8. Rate limiting
9. Secure file storage
10. Database with encryption
```

---

## 📊 Testing Strategy

### Unit Tests
```javascript
// Services
- authService: login, logout, permissions
- dataService: CRUD operations
- calculations: financial formulas
- agentService: review logic

// Components
- Forms: validation, submission
- Tables: sorting, filtering
- Modals: open, close, actions
```

### Integration Tests
```javascript
// Workflows
- Complete application lifecycle
- Document upload and review
- Agent review execution
- Decision workflow
```

### E2E Tests (Optional)
```javascript
// Using Cypress or Playwright
- User login
- Create application
- Upload documents
- Submit for review
- Approve application
```

---

## 🎯 Success Criteria

### Functional Requirements
- ✅ All user roles can perform their designated actions
- ✅ Application workflow completes successfully
- ✅ Document upload/download works
- ✅ Agent review generates accurate results
- ✅ Financial calculations are correct
- ✅ Audit logs capture all actions
- ✅ Role-based access control enforced

### Non-Functional Requirements
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Fast load times (< 3 seconds)
- ✅ Intuitive user interface
- ✅ Accessible (WCAG 2.1 Level AA)
- ✅ Browser compatible (Chrome, Firefox, Safari, Edge)
- ✅ Handles 100+ applications smoothly

---

## 🔮 Future Enhancements

### Backend Integration
```
- RESTful API
- Real database (PostgreSQL, MongoDB)
- File storage (S3, Azure Blob)
- Real-time updates (WebSockets)
```

### Advanced Features
```
- Email notifications
- SMS alerts
- Document OCR (real extraction)
- AI-powered risk assessment
- Predictive analytics
- Reporting dashboard
- Export to Excel/PDF
- Bulk operations
- Advanced search
- Workflow automation
```

### Mobile App
```
- React Native app
- Offline support
- Push notifications
- Camera document capture
```

---

## 📚 Resources & References

### Documentation
- [React Documentation](https://react.dev)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [React Router](https://reactrouter.com)
- [Vite Guide](https://vitejs.dev)

### Financial Formulas
- DSCR Calculation Standards
- Loan Amortization Formulas
- Risk Assessment Models

### Design Patterns
- Repository Pattern (Data Service)
- Observer Pattern (Redux)
- Factory Pattern (Component Creation)
- Strategy Pattern (Role-Based Access)

---

## 📝 Conclusion

This comprehensive plan provides a complete roadmap for building a Loan Origination System similar to the los-mvp project. The system is designed as a client-side application for demonstration purposes, with clear paths for production enhancement.

**Key Takeaways:**
1. **Modular Architecture**: Services, state management, and UI are clearly separated
2. **Role-Based Access**: Four distinct user roles with specific permissions
3. **Automated Analysis**: Agent review service provides intelligent risk assessment
4. **Complete Workflow**: From application creation to final decision
5. **Audit Trail**: Comprehensive logging of all actions
6. **Scalable Design**: Easy to extend with new features

**Next Steps:**
1. Review and approve this plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular progress reviews
5. Iterative testing and refinement

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-07  
**Author:** Bob (AI Software Architect)  
**Status:** Ready for Implementation
