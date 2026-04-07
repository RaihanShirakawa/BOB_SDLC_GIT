/**
 * Calculate Debt Service Coverage Ratio (DSCR)
 * DSCR = Net Operating Income / Total Debt Service
 */
export const calculateDSCR = (monthlyRevenue, monthlyExpenses, monthlyDebtPayment, loanAmount, tenorMonths, interestRate = 0.12) => {
  // Net operating income (monthly)
  const noi = monthlyRevenue - monthlyExpenses;
  
  // Calculate monthly loan payment (annuity formula)
  const monthlyRate = interestRate / 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) / (Math.pow(1 + monthlyRate, tenorMonths) - 1);
  
  // Total debt service
  const totalDebtService = monthlyDebtPayment + monthlyPayment;
  
  // DSCR
  const dscr = totalDebtService > 0 ? noi / totalDebtService : 0;
  
  return {
    dscr: parseFloat(dscr.toFixed(2)),
    monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    noi: parseFloat(noi.toFixed(2)),
    totalDebtService: parseFloat(totalDebtService.toFixed(2))
  };
};

/**
 * Calculate Net Operating Cashflow
 */
export const calculateNetCashflow = (monthlyRevenue, monthlyExpenses) => {
  return parseFloat((monthlyRevenue - monthlyExpenses).toFixed(2));
};

/**
 * Calculate Collateral Coverage Ratio
 * Coverage = Collateral Value / Loan Amount
 */
export const calculateCollateralCoverage = (collateralValue, loanAmount) => {
  return loanAmount > 0 ? parseFloat((collateralValue / loanAmount).toFixed(2)) : 0;
};

/**
 * Calculate Risk Score (0-100, higher is better)
 */
export const calculateRiskScore = (dscr, collateralCoverage, creditScore, yearsInBusiness, policyConfig) => {
  const weights = policyConfig.risk_weights;
  const thresholds = policyConfig.thresholds;
  
  // Normalize each factor to 0-100 scale
  const dscrScore = Math.min(100, (dscr / thresholds.min_dscr) * 100);
  const collateralScore = Math.min(100, (collateralCoverage / thresholds.min_collateral_coverage) * 100);
  const creditScoreNormalized = (creditScore / 850) * 100; // Assuming max credit score 850
  const yearsScore = Math.min(100, (yearsInBusiness / thresholds.min_years_in_business) * 100);
  
  // Weighted average
  const riskScore = (
    dscrScore * weights.dscr +
    collateralScore * weights.collateral_coverage +
    creditScoreNormalized * weights.credit_score +
    yearsScore * weights.years_in_business
  );
  
  return Math.round(riskScore);
};

/**
 * Generate risk flags based on policy thresholds
 */
export const generateRiskFlags = (application, analysis, policyConfig) => {
  const flags = [];
  const thresholds = policyConfig.thresholds;
  
  // Check DSCR
  if (analysis.dscr < thresholds.min_dscr) {
    flags.push({
      flag: 'Low DSCR',
      severity: 'High',
      description: `DSCR ${analysis.dscr} is below minimum threshold of ${thresholds.min_dscr}`
    });
  }
  
  // Check credit score
  if (application.owner_info.credit_score < thresholds.min_credit_score) {
    flags.push({
      flag: 'Low Credit Score',
      severity: 'High',
      description: `Credit score ${application.owner_info.credit_score} is below minimum threshold of ${thresholds.min_credit_score}`
    });
  }
  
  // Check years in business
  if (application.applicant.years_in_business < thresholds.min_years_in_business) {
    flags.push({
      flag: 'Insufficient Business History',
      severity: 'Medium',
      description: `Only ${application.applicant.years_in_business} years in business, minimum required is ${thresholds.min_years_in_business}`
    });
  }
  
  // Check collateral coverage
  if (analysis.collateral_coverage < thresholds.min_collateral_coverage) {
    flags.push({
      flag: 'Insufficient Collateral',
      severity: 'Medium',
      description: `Collateral coverage ${analysis.collateral_coverage} is below minimum threshold of ${thresholds.min_collateral_coverage}`
    });
  }
  
  // Check loan amount
  if (application.loan_request.amount > thresholds.max_loan_amount) {
    flags.push({
      flag: 'Loan Amount Exceeds Limit',
      severity: 'High',
      description: `Loan amount ${application.loan_request.amount.toLocaleString()} exceeds maximum of ${thresholds.max_loan_amount.toLocaleString()}`
    });
  }
  
  // Check negative cashflow
  if (analysis.net_cashflow < 0) {
    flags.push({
      flag: 'Negative Cashflow',
      severity: 'High',
      description: `Monthly cashflow is negative: ${analysis.net_cashflow.toLocaleString()}`
    });
  }
  
  return flags;
};

/**
 * Determine recommendation based on risk flags
 */
export const determineRecommendation = (riskFlags) => {
  const highSeverityCount = riskFlags.filter(f => f.severity === 'High').length;
  const totalFlags = riskFlags.length;
  
  if (highSeverityCount >= 2) {
    return 'Reject';
  } else if (highSeverityCount === 1 || totalFlags > 2) {
    return 'Review';
  } else if (totalFlags > 0) {
    return 'Review';
  } else {
    return 'Approve';
  }
};

/**
 * Generate standard approval conditions
 */
export const generateApprovalConditions = (application, analysis, riskFlags) => {
  const conditions = [];
  
  // Standard conditions
  conditions.push({
    condition: 'Quarterly financial reporting required',
    type: 'Subsequent'
  });
  
  // Collateral-related conditions
  if (analysis.collateral_coverage < 1.5) {
    conditions.push({
      condition: 'Insurance on collateral required',
      type: 'Precedent'
    });
  }
  
  // DSCR-related conditions
  if (analysis.dscr < 1.5) {
    conditions.push({
      condition: 'Monthly cashflow monitoring required',
      type: 'Subsequent'
    });
  }
  
  // Business age conditions
  if (application.applicant.years_in_business < 3) {
    conditions.push({
      condition: 'Personal guarantee from owner required',
      type: 'Precedent'
    });
  }
  
  return conditions;
};

/**
 * Format currency (IDR)
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

// Made with Bob
