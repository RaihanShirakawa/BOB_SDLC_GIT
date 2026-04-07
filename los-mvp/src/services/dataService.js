import { DATA_PATHS, AUDIT_ACTIONS, ENTITY_TYPES, APPLICATION_STATUS } from '../utils/constants';
import { logAuditAction } from './auditService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Data Service
 * Handles CRUD operations for applications, documents, analyses, and decisions
 */

// ============= APPLICATIONS =============

/**
 * Get all applications
 */
export const getAllApplications = async () => {
  try {
    // Try localStorage first
    const cached = localStorage.getItem('applications_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    
    const response = await fetch(DATA_PATHS.APPLICATIONS);
    const applications = await response.json();
    localStorage.setItem('applications_cache', JSON.stringify(applications));
    return applications;
  } catch (error) {
    console.error('Get applications error:', error);
    return [];
  }
};

/**
 * Get application by ID
 */
export const getApplicationById = async (id) => {
  try {
    const applications = await getAllApplications();
    return applications.find(app => app.id === id);
  } catch (error) {
    console.error('Get application by ID error:', error);
    return null;
  }
};

/**
 * Create new application
 */
export const createApplication = async (applicationData, userId) => {
  try {
    const applications = await getAllApplications();
    
    const newApplication = {
      id: uuidv4(),
      owner_user_id: userId,
      status: APPLICATION_STATUS.DRAFT,
      ...applicationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      submitted_at: null
    };
    
    applications.push(newApplication);
    localStorage.setItem('applications_cache', JSON.stringify(applications));
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.CREATE,
      ENTITY_TYPES.APPLICATION,
      newApplication.id,
      null,
      newApplication
    );
    
    return newApplication;
  } catch (error) {
    console.error('Create application error:', error);
    throw error;
  }
};

/**
 * Update application
 */
export const updateApplication = async (id, updates, userId) => {
  try {
    const applications = await getAllApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    const oldApplication = { ...applications[index] };
    const updatedApplication = {
      ...applications[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    applications[index] = updatedApplication;
    localStorage.setItem('applications_cache', JSON.stringify(applications));
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.UPDATE,
      ENTITY_TYPES.APPLICATION,
      id,
      oldApplication,
      updatedApplication
    );
    
    return updatedApplication;
  } catch (error) {
    console.error('Update application error:', error);
    throw error;
  }
};

/**
 * Delete application
 */
export const deleteApplication = async (id, userId) => {
  try {
    const applications = await getAllApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index === -1) {
      throw new Error('Application not found');
    }
    
    const deletedApplication = applications[index];
    applications.splice(index, 1);
    localStorage.setItem('applications_cache', JSON.stringify(applications));
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.DELETE,
      ENTITY_TYPES.APPLICATION,
      id,
      deletedApplication,
      null
    );
    
    return true;
  } catch (error) {
    console.error('Delete application error:', error);
    throw error;
  }
};

/**
 * Submit application
 */
export const submitApplication = async (id, userId) => {
  try {
    const updatedApplication = await updateApplication(
      id,
      {
        status: APPLICATION_STATUS.SUBMITTED,
        submitted_at: new Date().toISOString()
      },
      userId
    );
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.SUBMIT,
      ENTITY_TYPES.APPLICATION,
      id,
      { status: APPLICATION_STATUS.DRAFT },
      { status: APPLICATION_STATUS.SUBMITTED }
    );
    
    return updatedApplication;
  } catch (error) {
    console.error('Submit application error:', error);
    throw error;
  }
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (id, status, userId) => {
  try {
    return await updateApplication(id, { status }, userId);
  } catch (error) {
    console.error('Update application status error:', error);
    throw error;
  }
};

/**
 * Get applications by status
 */
export const getApplicationsByStatus = async (status) => {
  try {
    const applications = await getAllApplications();
    return applications.filter(app => app.status === status);
  } catch (error) {
    console.error('Get applications by status error:', error);
    return [];
  }
};

/**
 * Get applications by owner
 */
export const getApplicationsByOwner = async (ownerId) => {
  try {
    const applications = await getAllApplications();
    return applications.filter(app => app.owner_user_id === ownerId);
  } catch (error) {
    console.error('Get applications by owner error:', error);
    return [];
  }
};

// ============= DOCUMENTS =============

/**
 * Get all documents
 */
export const getAllDocuments = async () => {
  try {
    const cached = localStorage.getItem('documents_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    
    const response = await fetch(DATA_PATHS.DOCUMENTS);
    const documents = await response.json();
    localStorage.setItem('documents_cache', JSON.stringify(documents));
    return documents;
  } catch (error) {
    console.error('Get documents error:', error);
    return [];
  }
};

/**
 * Get documents by application ID
 */
export const getDocumentsByApplicationId = async (applicationId) => {
  try {
    const documents = await getAllDocuments();
    return documents.filter(doc => doc.application_id === applicationId);
  } catch (error) {
    console.error('Get documents by application ID error:', error);
    return [];
  }
};

/**
 * Add document metadata
 */
export const addDocument = async (documentData, userId) => {
  try {
    const documents = await getAllDocuments();
    
    const newDocument = {
      id: uuidv4(),
      ...documentData,
      uploaded_by: userId,
      uploaded_at: new Date().toISOString()
    };
    
    documents.push(newDocument);
    localStorage.setItem('documents_cache', JSON.stringify(documents));
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.UPLOAD,
      ENTITY_TYPES.DOCUMENT,
      newDocument.id,
      null,
      newDocument
    );
    
    return newDocument;
  } catch (error) {
    console.error('Add document error:', error);
    throw error;
  }
};

/**
 * Delete document
 */
export const deleteDocument = async (id, userId) => {
  try {
    const documents = await getAllDocuments();
    const index = documents.findIndex(doc => doc.id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const deletedDocument = documents[index];
    documents.splice(index, 1);
    localStorage.setItem('documents_cache', JSON.stringify(documents));
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.DELETE,
      ENTITY_TYPES.DOCUMENT,
      id,
      deletedDocument,
      null
    );
    
    return true;
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

// ============= ANALYSES =============

/**
 * Get all analyses
 */
export const getAllAnalyses = async () => {
  try {
    const cached = localStorage.getItem('analyses_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    
    const response = await fetch(DATA_PATHS.ANALYSES);
    const analyses = await response.json();
    localStorage.setItem('analyses_cache', JSON.stringify(analyses));
    return analyses;
  } catch (error) {
    console.error('Get analyses error:', error);
    return [];
  }
};

/**
 * Get analysis by application ID
 */
export const getAnalysisByApplicationId = async (applicationId) => {
  try {
    const analyses = await getAllAnalyses();
    return analyses.find(analysis => analysis.application_id === applicationId);
  } catch (error) {
    console.error('Get analysis by application ID error:', error);
    return null;
  }
};

/**
 * Create or update analysis
 */
export const saveAnalysis = async (analysisData, userId) => {
  try {
    const analyses = await getAllAnalyses();
    const existingIndex = analyses.findIndex(a => a.application_id === analysisData.application_id);
    
    if (existingIndex !== -1) {
      // Update existing
      const oldAnalysis = { ...analyses[existingIndex] };
      const updatedAnalysis = {
        ...analyses[existingIndex],
        ...analysisData,
        updated_at: new Date().toISOString()
      };
      
      analyses[existingIndex] = updatedAnalysis;
      localStorage.setItem('analyses_cache', JSON.stringify(analyses));
      
      // Log audit
      await logAuditAction(
        userId,
        AUDIT_ACTIONS.UPDATE,
        ENTITY_TYPES.ANALYSIS,
        updatedAnalysis.id,
        oldAnalysis,
        updatedAnalysis
      );
      
      return updatedAnalysis;
    } else {
      // Create new
      const newAnalysis = {
        id: uuidv4(),
        ...analysisData,
        created_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      analyses.push(newAnalysis);
      localStorage.setItem('analyses_cache', JSON.stringify(analyses));
      
      // Log audit
      await logAuditAction(
        userId,
        AUDIT_ACTIONS.CREATE,
        ENTITY_TYPES.ANALYSIS,
        newAnalysis.id,
        null,
        newAnalysis
      );
      
      return newAnalysis;
    }
  } catch (error) {
    console.error('Save analysis error:', error);
    throw error;
  }
};

// ============= DECISIONS =============

/**
 * Get all decisions
 */
export const getAllDecisions = async () => {
  try {
    const cached = localStorage.getItem('decisions_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    
    const response = await fetch(DATA_PATHS.DECISIONS);
    const decisions = await response.json();
    localStorage.setItem('decisions_cache', JSON.stringify(decisions));
    return decisions;
  } catch (error) {
    console.error('Get decisions error:', error);
    return [];
  }
};

/**
 * Get decision by application ID
 */
export const getDecisionByApplicationId = async (applicationId) => {
  try {
    const decisions = await getAllDecisions();
    return decisions.find(decision => decision.application_id === applicationId);
  } catch (error) {
    console.error('Get decision by application ID error:', error);
    return null;
  }
};

/**
 * Submit recommendation
 */
export const submitRecommendation = async (applicationId, recommendation, userId) => {
  try {
    const decisions = await getAllDecisions();
    const existingIndex = decisions.findIndex(d => d.application_id === applicationId);
    
    const decisionData = {
      application_id: applicationId,
      recommended_by: userId,
      recommended_decision: recommendation.decision,
      recommendation_notes: recommendation.notes,
      recommended_at: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
      // Update existing
      const oldDecision = { ...decisions[existingIndex] };
      decisions[existingIndex] = {
        ...decisions[existingIndex],
        ...decisionData
      };
      
      localStorage.setItem('decisions_cache', JSON.stringify(decisions));
      
      // Log audit
      await logAuditAction(
        userId,
        AUDIT_ACTIONS.UPDATE,
        ENTITY_TYPES.DECISION,
        decisions[existingIndex].id,
        oldDecision,
        decisions[existingIndex]
      );
      
      return decisions[existingIndex];
    } else {
      // Create new
      const newDecision = {
        id: uuidv4(),
        ...decisionData,
        approver_id: null,
        final_decision: null,
        approval_conditions: [],
        rejection_reason: null,
        decided_at: null
      };
      
      decisions.push(newDecision);
      localStorage.setItem('decisions_cache', JSON.stringify(decisions));
      
      // Log audit
      await logAuditAction(
        userId,
        AUDIT_ACTIONS.CREATE,
        ENTITY_TYPES.DECISION,
        newDecision.id,
        null,
        newDecision
      );
      
      return newDecision;
    }
  } catch (error) {
    console.error('Submit recommendation error:', error);
    throw error;
  }
};

/**
 * Approve application
 */
export const approveApplication = async (applicationId, conditions, userId) => {
  try {
    const decisions = await getAllDecisions();
    const decision = decisions.find(d => d.application_id === applicationId);
    
    if (!decision) {
      throw new Error('Decision not found');
    }
    
    const oldDecision = { ...decision };
    decision.approver_id = userId;
    decision.final_decision = 'Approved';
    decision.approval_conditions = conditions;
    decision.decided_at = new Date().toISOString();
    
    localStorage.setItem('decisions_cache', JSON.stringify(decisions));
    
    // Update application status
    await updateApplicationStatus(applicationId, APPLICATION_STATUS.APPROVED, userId);
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.APPROVE,
      ENTITY_TYPES.DECISION,
      decision.id,
      oldDecision,
      decision
    );
    
    return decision;
  } catch (error) {
    console.error('Approve application error:', error);
    throw error;
  }
};

/**
 * Reject application
 */
export const rejectApplication = async (applicationId, reason, userId) => {
  try {
    const decisions = await getAllDecisions();
    const decision = decisions.find(d => d.application_id === applicationId);
    
    if (!decision) {
      throw new Error('Decision not found');
    }
    
    const oldDecision = { ...decision };
    decision.approver_id = userId;
    decision.final_decision = 'Rejected';
    decision.rejection_reason = reason;
    decision.decided_at = new Date().toISOString();
    
    localStorage.setItem('decisions_cache', JSON.stringify(decisions));
    
    // Update application status
    await updateApplicationStatus(applicationId, APPLICATION_STATUS.REJECTED, userId);
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.REJECT,
      ENTITY_TYPES.DECISION,
      decision.id,
      oldDecision,
      decision
    );
    
    return decision;
  } catch (error) {
    console.error('Reject application error:', error);
    throw error;
  }
};

// ============= POLICY CONFIG =============

/**
 * Get policy configuration
 */
export const getPolicyConfig = async () => {
  try {
    const cached = localStorage.getItem('policy_config_cache');
    if (cached) {
      return JSON.parse(cached);
    }
    
    const response = await fetch(DATA_PATHS.POLICY_CONFIG);
    const config = await response.json();
    localStorage.setItem('policy_config_cache', JSON.stringify(config));
    return config;
  } catch (error) {
    console.error('Get policy config error:', error);
    return null;
  }
};

/**
 * Update policy configuration
 */
export const updatePolicyConfig = async (config, userId) => {
  try {
    localStorage.setItem('policy_config_cache', JSON.stringify(config));
    
    // Log audit
    await logAuditAction(
      userId,
      AUDIT_ACTIONS.UPDATE,
      'PolicyConfig',
      'policy_config',
      null,
      config
    );
    
    return config;
  } catch (error) {
    console.error('Update policy config error:', error);
    throw error;
  }
};

// Made with Bob
