# Loan Origination System (LOS) - MVP

A client-side web application for processing SME loan applications with automated credit analysis, document management, and decision workflow.

## 🎯 Project Status

**Current Phase:** Foundation & Services Implementation (In Progress)

### ✅ Completed
- ✅ React + Vite project initialization
- ✅ Folder structure setup
- ✅ JSON data files configuration
- ✅ Core utility functions (constants, calculations)
- ✅ Authentication service (session-based)
- ✅ Data service (applications, documents, analyses, decisions)
- ✅ File service (document upload/download)
- ✅ Audit service (comprehensive logging)
- ✅ Agent review service (automated analysis)
- ✅ Credit memo generator service

### 🚧 In Progress
- Redux store and state management
- React Router setup
- UI components and pages
- Integration and testing

### 📋 Pending
- Demo data generator
- Comprehensive testing
- UI polish and refinements
- Deployment documentation

## 🏗️ Architecture

This is a **pure client-side application** with no backend API. All data is stored in JSON files and browser localStorage.

### Technology Stack
- **Frontend:** React 18 + Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** CSS (to be added)
- **Storage:** JSON files + localStorage
- **File Handling:** Browser File API

### Key Features
- 🔐 Role-based access control (RM, Analyst, Approver, Admin)
- 📝 Complete loan application workflow
- 📄 Document upload and management
- 🤖 Automated agent review and risk assessment
- 📊 Financial analysis (DSCR, cashflow, collateral coverage)
- ✅ Decision workflow with approval conditions
- 📋 Credit memo generation (HTML)
- 📜 Comprehensive audit logging

## 📁 Project Structure

```
los-mvp/
├── public/
│   ├── data/                    # JSON data files
│   │   ├── users.json
│   │   ├── applications.json
│   │   ├── documents.json
│   │   ├── analyses.json
│   │   ├── decisions.json
│   │   └── audit_logs.json
│   ├── uploads/                 # Document storage
│   └── config/
│       └── policy_config.json   # Business rules
│
├── src/
│   ├── services/                # Client-side services
│   │   ├── authService.js       # Authentication
│   │   ├── dataService.js       # Data operations
│   │   ├── fileService.js       # File handling
│   │   ├── auditService.js      # Audit logging
│   │   ├── agentService.js      # Agent review
│   │   └── memoService.js       # Memo generation
│   │
│   ├── utils/                   # Utilities
│   │   ├── constants.js         # Constants & enums
│   │   └── calculations.js      # Financial formulas
│   │
│   ├── store/                   # Redux store (TBD)
│   ├── components/              # React components (TBD)
│   ├── pages/                   # Page components (TBD)
│   └── templates/               # HTML templates (TBD)
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd Demo_BRI/los-mvp

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Default Users

| Username | Password | Role |
|----------|----------|------|
| john.rm | password123 | RM (Relationship Manager) |
| sarah.analyst | password123 | Credit Analyst |
| michael.approver | password123 | Approver |
| admin | admin123 | Admin |

## 📊 Data Models

### Application
```javascript
{
  id: "uuid",
  owner_user_id: "uuid",
  status: "Draft | Submitted | In_Review | Approved | Rejected | Completed",
  applicant: {
    legal_name: "string",
    business_type: "PT | CV | UD | Perorangan",
    industry: "string",
    years_in_business: number
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
    estimated_value: number
  },
  owner_info: {
    name: "string",
    id_number: "string",
    credit_score: number
  },
  created_at: "ISO datetime",
  updated_at: "ISO datetime"
}
```

### Analysis
```javascript
{
  id: "uuid",
  application_id: "uuid",
  dscr: number,
  net_cashflow: number,
  collateral_coverage: number,
  risk_score: number (0-100),
  risk_flags: [
    {
      flag: "string",
      severity: "High | Medium | Low",
      description: "string"
    }
  ],
  analyst_notes: "string",
  created_by: "uuid",
  created_at: "ISO datetime"
}
```

## 🔧 Services API

### Authentication Service
```javascript
import { login, logout, getCurrentUser, canPerformAction } from './services/authService';

// Login
const session = await login('username', 'password');

// Check permissions
const canEdit = canPerformAction('edit_application', application, application.owner_user_id);
```

### Data Service
```javascript
import { 
  getAllApplications, 
  createApplication, 
  updateApplication,
  submitApplication 
} from './services/dataService';

// Create application
const app = await createApplication(applicationData, userId);

// Submit for review
await submitApplication(applicationId, userId);
```

### Agent Service
```javascript
import { runAgentReview } from './services/agentService';

// Run automated review
const reviewResult = await runAgentReview(application);
// Returns: document check, extracted fields, risk flags, recommendation
```

### File Service
```javascript
import { uploadFile, downloadFile } from './services/fileService';

// Upload document
const fileData = await uploadFile(file, applicationId, docType);

// Download document
await downloadFile(storageKey, filename);
```

## 📈 Business Rules

### Policy Configuration
Located in `public/config/policy_config.json`:

```json
{
  "thresholds": {
    "min_dscr": 1.2,
    "min_collateral_coverage": 1.0,
    "max_loan_amount": 2000000000,
    "min_years_in_business": 2,
    "min_credit_score": 650
  },
  "required_documents": [
    "Bank_Statement",
    "Financial_Statement",
    "ID_KYC",
    "Collateral_Proof"
  ]
}
```

### Financial Calculations

**DSCR (Debt Service Coverage Ratio)**
```
DSCR = Net Operating Income / Total Debt Service
```

**Collateral Coverage**
```
Coverage = Collateral Value / Loan Amount
```

**Risk Score (0-100)**
```
Weighted average of:
- DSCR score (30%)
- Collateral coverage (25%)
- Credit score (25%)
- Years in business (20%)
```

## 🔐 Role-Based Access Control

| Action | RM | Analyst | Approver | Admin |
|--------|----|---------| ---------|-------|
| Create Application | ✅ | ❌ | ❌ | ✅ |
| Edit Draft | ✅ (owner) | ❌ | ❌ | ✅ |
| Upload Documents | ✅ | ✅ | ❌ | ✅ |
| Run Agent Review | ✅ | ✅ | ❌ | ✅ |
| Edit Analysis | ❌ | ✅ | ❌ | ✅ |
| Submit Recommendation | ❌ | ✅ | ❌ | ✅ |
| Approve/Reject | ❌ | ❌ | ✅ | ✅ |
| View Audit Logs | ❌ | ❌ | ✅ | ✅ |

## 🔄 Application Workflow

```
Draft → Submitted → In Review → Approved/Rejected → Completed
```

### Status Transitions
- **Draft → Submitted:** RM submits application
- **Submitted → In Review:** Analyst starts review
- **In Review → Approved:** Approver approves
- **In Review → Rejected:** Approver rejects
- **Approved → Completed:** Simulated disbursement

## 📝 Next Steps

### Immediate Tasks
1. **Create Redux Store**
   - Setup store configuration
   - Create slices for auth, applications, documents
   - Implement async thunks

2. **Build UI Components**
   - Login page
   - Dashboard
   - Application list and forms
   - Document upload interface
   - Analysis and decision pages

3. **Implement Routing**
   - Setup React Router
   - Protected routes
   - Role-based route guards

4. **Generate Demo Data**
   - Create script to populate sample applications
   - Generate varied scenarios (approve, reject, review)

5. **Testing & Polish**
   - Integration testing
   - UI/UX refinements
   - Error handling improvements

## 🐛 Known Limitations

- **No Backend:** All data stored client-side (localStorage)
- **No Real-time Sync:** Changes not synchronized across tabs/devices
- **File Size Limits:** Browser storage limitations (~10MB per file)
- **No Concurrent Access:** Last-write-wins for data conflicts
- **Mock Document Extraction:** Simplified document parsing for demo

## 📚 Documentation

- [Requirements](../Requirements.md)
- [Implementation Plan](../LOS_MVP_Plan.md)
- [Plan Phase Guide](../Plan_phase_guide.md)

## 🤝 Contributing

This is a demo/MVP project. For production use, consider:
- Implementing a proper backend API
- Using a real database
- Adding authentication with JWT/OAuth
- Implementing real document OCR
- Adding comprehensive testing
- Enhancing security measures

## 📄 License

Internal demo project - Not for production use

## 📞 Support

For questions or issues, refer to the project documentation or contact the development team.

---

**Last Updated:** March 4, 2026
**Version:** 0.1.0 (Foundation Phase)
**Status:** In Development
