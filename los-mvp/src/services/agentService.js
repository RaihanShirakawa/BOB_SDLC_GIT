import { getDocumentsByApplicationId } from './dataService';
import { getPolicyConfig } from './dataService';
import { 
  calculateDSCR, 
  calculateNetCashflow, 
  calculateCollateralCoverage,
  calculateRiskScore,
  generateRiskFlags,
  determineRecommendation,
  generateApprovalConditions
} from '../utils/calculations';
import { DOCUMENT_TYPES } from '../utils/constants';

/**
 * Agent Review Service
 * Handles automated document review and risk assessment
 */

/**
 * Run agent review on application
 */
export const runAgentReview = async (application) => {
  try {
    // Get policy configuration
    const policyConfig = await getPolicyConfig();
    
    // Get documents
    const documents = await getDocumentsByApplicationId(application.id);
    
    // 1. Check document completeness
    const documentCheck = checkDocumentCompleteness(documents, policyConfig);
    
    // 2. Extract fields from documents (mock for demo)
    const extractedFields = extractDocumentFields(documents);
    
    // 3. Validate data quality
    const dataQualityWarnings = validateDataQuality(application);
    
    // 4. Perform financial analysis
    const financialAnalysis = performFinancialAnalysis(application, policyConfig);
    
    // 5. Generate risk flags
    const riskFlags = generateRiskFlags(application, financialAnalysis, policyConfig);
    
    // 6. Determine recommendation
    const recommendation = determineRecommendation(riskFlags);
    
    // 7. Generate conditions if approve
    const conditions = recommendation === 'Approve' 
      ? generateApprovalConditions(application, financialAnalysis, riskFlags)
      : [];
    
    return {
      document_check: documentCheck,
      extracted_fields: extractedFields,
      data_quality_warnings: dataQualityWarnings,
      financial_analysis: financialAnalysis,
      risk_flags: riskFlags,
      recommendation: recommendation,
      recommended_conditions: conditions,
      review_timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Run agent review error:', error);
    throw error;
  }
};

/**
 * Check document completeness
 */
const checkDocumentCompleteness = (documents, policyConfig) => {
  const requiredDocs = policyConfig.required_documents;
  const uploadedDocTypes = documents.map(doc => doc.doc_type);
  
  const missingDocs = requiredDocs.filter(docType => !uploadedDocTypes.includes(docType));
  const completionPercentage = ((requiredDocs.length - missingDocs.length) / requiredDocs.length) * 100;
  
  return {
    required_documents: requiredDocs,
    uploaded_documents: uploadedDocTypes,
    missing_documents: missingDocs,
    completion_percentage: Math.round(completionPercentage),
    is_complete: missingDocs.length === 0
  };
};

/**
 * Extract fields from documents (mock for demo)
 */
const extractDocumentFields = (documents) => {
  const extracted = {};
  
  documents.forEach(doc => {
    switch (doc.doc_type) {
      case DOCUMENT_TYPES.BANK_STATEMENT:
        extracted.bank_statement = {
          account_number: '1234567890',
          period: '2024-01 to 2024-03',
          average_balance: 150000000,
          total_credits: 500000000,
          total_debits: 350000000,
          net_cashflow: 150000000
        };
        break;
        
      case DOCUMENT_TYPES.FINANCIAL_STATEMENT:
        extracted.financial_statement = {
          revenue: 2400000000,
          expenses: 1800000000,
          net_income: 600000000,
          assets: 5000000000,
          liabilities: 2000000000,
          equity: 3000000000
        };
        break;
        
      case DOCUMENT_TYPES.ID_KYC:
        extracted.kyc = {
          id_verified: true,
          name_match: true,
          address_verified: true
        };
        break;
        
      case DOCUMENT_TYPES.COLLATERAL_PROOF:
        extracted.collateral = {
          type: 'Property',
          location: 'Jakarta',
          estimated_value: 800000000,
          ownership_verified: true
        };
        break;
        
      default:
        break;
    }
  });
  
  return extracted;
};

/**
 * Validate data quality
 */
const validateDataQuality = (application) => {
  const warnings = [];
  
  // Check for negative values
  if (application.financial_snapshot.monthly_revenue < 0) {
    warnings.push({
      field: 'monthly_revenue',
      warning: 'Negative revenue value',
      severity: 'High'
    });
  }
  
  if (application.financial_snapshot.monthly_expenses < 0) {
    warnings.push({
      field: 'monthly_expenses',
      warning: 'Negative expenses value',
      severity: 'High'
    });
  }
  
  // Check for unrealistic values
  if (application.financial_snapshot.monthly_revenue > 10000000000) {
    warnings.push({
      field: 'monthly_revenue',
      warning: 'Unusually high revenue - please verify',
      severity: 'Medium'
    });
  }
  
  // Check collateral value vs loan amount
  if (application.collateral.estimated_value < application.loan_request.amount) {
    warnings.push({
      field: 'collateral_value',
      warning: 'Collateral value is less than loan amount',
      severity: 'Medium'
    });
  }
  
  // Check business age
  if (application.applicant.years_in_business < 1) {
    warnings.push({
      field: 'years_in_business',
      warning: 'Very new business - higher risk',
      severity: 'Medium'
    });
  }
  
  // Check credit score
  if (application.owner_info.credit_score < 600) {
    warnings.push({
      field: 'credit_score',
      warning: 'Low credit score',
      severity: 'High'
    });
  }
  
  // Check loan tenor
  if (application.loan_request.tenor_months > 60) {
    warnings.push({
      field: 'tenor_months',
      warning: 'Long loan tenor - increased risk',
      severity: 'Low'
    });
  }
  
  return warnings;
};

/**
 * Perform financial analysis
 */
const performFinancialAnalysis = (application, policyConfig) => {
  const { monthly_revenue, monthly_expenses, monthly_debt_payment } = application.financial_snapshot;
  const { amount, tenor_months } = application.loan_request;
  const { estimated_value } = application.collateral;
  const { credit_score } = application.owner_info;
  const { years_in_business } = application.applicant;
  
  // Calculate DSCR
  const dscrResult = calculateDSCR(
    monthly_revenue,
    monthly_expenses,
    monthly_debt_payment,
    amount,
    tenor_months,
    policyConfig.interest_rate_default
  );
  
  // Calculate net cashflow
  const netCashflow = calculateNetCashflow(monthly_revenue, monthly_expenses);
  
  // Calculate collateral coverage
  const collateralCoverage = calculateCollateralCoverage(estimated_value, amount);
  
  // Calculate risk score
  const riskScore = calculateRiskScore(
    dscrResult.dscr,
    collateralCoverage,
    credit_score,
    years_in_business,
    policyConfig
  );
  
  return {
    dscr: dscrResult.dscr,
    monthly_payment: dscrResult.monthlyPayment,
    net_cashflow: netCashflow,
    total_debt_service: dscrResult.totalDebtService,
    collateral_coverage: collateralCoverage,
    risk_score: riskScore,
    interest_rate: policyConfig.interest_rate_default
  };
};

/**
 * Generate summary text
 */
export const generateReviewSummary = (reviewResult, application) => {
  const { recommendation, risk_flags, financial_analysis, document_check } = reviewResult;
  
  let summary = `Agent Review Summary for ${application.applicant.legal_name}\n\n`;
  
  // Document completeness
  summary += `Document Completeness: ${document_check.completion_percentage}%\n`;
  if (document_check.missing_documents.length > 0) {
    summary += `Missing Documents: ${document_check.missing_documents.join(', ')}\n`;
  }
  summary += '\n';
  
  // Financial metrics
  summary += `Financial Analysis:\n`;
  summary += `- DSCR: ${financial_analysis.dscr}\n`;
  summary += `- Net Cashflow: ${financial_analysis.net_cashflow.toLocaleString()}\n`;
  summary += `- Collateral Coverage: ${financial_analysis.collateral_coverage}\n`;
  summary += `- Risk Score: ${financial_analysis.risk_score}/100\n`;
  summary += '\n';
  
  // Risk flags
  if (risk_flags.length > 0) {
    summary += `Risk Flags (${risk_flags.length}):\n`;
    risk_flags.forEach((flag, index) => {
      summary += `${index + 1}. [${flag.severity}] ${flag.flag}: ${flag.description}\n`;
    });
    summary += '\n';
  }
  
  // Recommendation
  summary += `Recommendation: ${recommendation}\n`;
  
  if (recommendation === 'Approve' && reviewResult.recommended_conditions.length > 0) {
    summary += `\nRecommended Conditions:\n`;
    reviewResult.recommended_conditions.forEach((condition, index) => {
      summary += `${index + 1}. [${condition.type}] ${condition.condition}\n`;
    });
  }
  
  return summary;
};

/**
 * Calculate document checklist progress
 */
export const calculateDocumentProgress = async (applicationId, policyConfig) => {
  try {
    const documents = await getDocumentsByApplicationId(applicationId);
    const requiredDocs = policyConfig.required_documents;
    const uploadedDocTypes = [...new Set(documents.map(doc => doc.doc_type))];
    
    const checklist = requiredDocs.map(docType => ({
      doc_type: docType,
      required: true,
      uploaded: uploadedDocTypes.includes(docType),
      count: documents.filter(doc => doc.doc_type === docType).length
    }));
    
    const completionPercentage = (uploadedDocTypes.filter(type => requiredDocs.includes(type)).length / requiredDocs.length) * 100;
    
    return {
      checklist,
      completion_percentage: Math.round(completionPercentage),
      total_required: requiredDocs.length,
      total_uploaded: uploadedDocTypes.filter(type => requiredDocs.includes(type)).length
    };
  } catch (error) {
    console.error('Calculate document progress error:', error);
    return {
      checklist: [],
      completion_percentage: 0,
      total_required: 0,
      total_uploaded: 0
    };
  }
};

// Made with Bob
