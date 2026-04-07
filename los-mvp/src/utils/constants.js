// Application Status
export const APPLICATION_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_REVIEW: 'In_Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed'
};

// User Roles
export const USER_ROLES = {
  RM: 'RM',
  CREDIT_ANALYST: 'Credit_Analyst',
  APPROVER: 'Approver',
  ADMIN: 'Admin'
};

// Document Types
export const DOCUMENT_TYPES = {
  BANK_STATEMENT: 'Bank_Statement',
  FINANCIAL_STATEMENT: 'Financial_Statement',
  ID_KYC: 'ID_KYC',
  COLLATERAL_PROOF: 'Collateral_Proof',
  OTHER: 'Other'
};

// Business Types
export const BUSINESS_TYPES = {
  PT: 'PT',
  CV: 'CV',
  UD: 'UD',
  PERORANGAN: 'Perorangan'
};

// Collateral Types
export const COLLATERAL_TYPES = {
  PROPERTY: 'Property',
  VEHICLE: 'Vehicle',
  EQUIPMENT: 'Equipment',
  INVENTORY: 'Inventory',
  OTHER: 'Other'
};

// Repayment Types
export const REPAYMENT_TYPES = {
  ANUITAS: 'Anuitas',
  EFEKTIF: 'Efektif',
  BULLET: 'Bullet'
};

// Decision Types
export const DECISION_TYPES = {
  APPROVE: 'Approve',
  REJECT: 'Reject',
  NEED_MORE_INFO: 'Need_More_Info',
  REVIEW: 'Review'
};

// Risk Severity
export const RISK_SEVERITY = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
};

// Audit Actions
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SUBMIT: 'SUBMIT',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  UPLOAD: 'UPLOAD',
  REVIEW: 'REVIEW',
  GENERATE_MEMO: 'GENERATE_MEMO',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
};

// Entity Types
export const ENTITY_TYPES = {
  APPLICATION: 'Application',
  DOCUMENT: 'Document',
  ANALYSIS: 'Analysis',
  DECISION: 'Decision',
  USER: 'User'
};

// File size limit (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Data file paths
export const DATA_PATHS = {
  USERS: '/data/users.json',
  APPLICATIONS: '/data/applications.json',
  DOCUMENTS: '/data/documents.json',
  ANALYSES: '/data/analyses.json',
  DECISIONS: '/data/decisions.json',
  AUDIT_LOGS: '/data/audit_logs.json',
  POLICY_CONFIG: '/config/policy_config.json'
};

// Session storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'los_current_user',
  SESSION_TOKEN: 'los_session_token'
};

// Made with Bob
