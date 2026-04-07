import { format } from 'date-fns';
import { formatCurrency } from '../utils/calculations';
import { getApplicationById, getAnalysisByApplicationId, getDecisionByApplicationId } from './dataService';
import { getApplicationAuditLogs } from './auditService';

/**
 * Memo Service
 * Handles credit memo generation
 */

/**
 * Generate credit memo HTML
 */
export const generateCreditMemoHTML = async (applicationId) => {
  try {
    // Fetch all required data
    const application = await getApplicationById(applicationId);
    const analysis = await getAnalysisByApplicationId(applicationId);
    const decision = await getDecisionByApplicationId(applicationId);
    const auditLogs = await getApplicationAuditLogs(applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }
    
    // Generate HTML
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Credit Memo - ${application.applicant.legal_name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            background: white;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
        }
        .header .subtitle {
            color: #7f8c8d;
            font-size: 14px;
            margin-top: 5px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background: #34495e;
            color: white;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
        }
        .info-value {
            color: #333;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }
        .metric-box {
            border: 2px solid #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            background: #f8f9fa;
        }
        .metric-label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        .risk-flag {
            padding: 8px 12px;
            margin: 5px 0;
            border-left: 4px solid;
            background: #f8f9fa;
        }
        .risk-high {
            border-color: #e74c3c;
            background: #fadbd8;
        }
        .risk-medium {
            border-color: #f39c12;
            background: #fef5e7;
        }
        .risk-low {
            border-color: #3498db;
            background: #d6eaf8;
        }
        .condition-item {
            padding: 10px;
            margin: 5px 0;
            background: #e8f8f5;
            border-left: 3px solid #27ae60;
        }
        .decision-box {
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }
        .decision-approved {
            background: #d5f4e6;
            border: 2px solid #27ae60;
            color: #27ae60;
        }
        .decision-rejected {
            background: #fadbd8;
            border: 2px solid #e74c3c;
            color: #e74c3c;
        }
        .audit-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 12px;
        }
        .audit-table th {
            background: #34495e;
            color: white;
            padding: 8px;
            text-align: left;
        }
        .audit-table td {
            padding: 8px;
            border-bottom: 1px solid #ecf0f1;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
        }
        @media print {
            body {
                padding: 0;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>CREDIT MEMORANDUM</h1>
        <div class="subtitle">Loan Origination System - SME Credit</div>
        <div class="subtitle">Application ID: ${application.id}</div>
        <div class="subtitle">Generated: ${format(new Date(), 'dd MMMM yyyy HH:mm')}</div>
    </div>

    <!-- Applicant Information -->
    <div class="section">
        <div class="section-title">1. APPLICANT INFORMATION</div>
        <div class="info-grid">
            <div class="info-label">Legal Name:</div>
            <div class="info-value">${application.applicant.legal_name}</div>
            
            <div class="info-label">Business Type:</div>
            <div class="info-value">${application.applicant.business_type}</div>
            
            <div class="info-label">Industry:</div>
            <div class="info-value">${application.applicant.industry}</div>
            
            <div class="info-label">Years in Business:</div>
            <div class="info-value">${application.applicant.years_in_business} years</div>
            
            <div class="info-label">Owner Name:</div>
            <div class="info-value">${application.owner_info.name}</div>
            
            <div class="info-label">Owner ID:</div>
            <div class="info-value">${application.owner_info.id_number}</div>
            
            <div class="info-label">Credit Score:</div>
            <div class="info-value">${application.owner_info.credit_score}</div>
        </div>
    </div>

    <!-- Loan Request -->
    <div class="section">
        <div class="section-title">2. LOAN REQUEST</div>
        <div class="info-grid">
            <div class="info-label">Loan Amount:</div>
            <div class="info-value">${formatCurrency(application.loan_request.amount)}</div>
            
            <div class="info-label">Tenor:</div>
            <div class="info-value">${application.loan_request.tenor_months} months</div>
            
            <div class="info-label">Purpose:</div>
            <div class="info-value">${application.loan_request.purpose}</div>
            
            <div class="info-label">Repayment Type:</div>
            <div class="info-value">${application.loan_request.repayment_type}</div>
        </div>
    </div>

    <!-- Financial Analysis -->
    ${analysis ? `
    <div class="section">
        <div class="section-title">3. FINANCIAL ANALYSIS</div>
        
        <div class="metrics-grid">
            <div class="metric-box">
                <div class="metric-label">DSCR</div>
                <div class="metric-value">${analysis.dscr}</div>
            </div>
            
            <div class="metric-box">
                <div class="metric-label">Net Cashflow</div>
                <div class="metric-value">${formatCurrency(analysis.net_cashflow)}</div>
            </div>
            
            <div class="metric-box">
                <div class="metric-label">Collateral Coverage</div>
                <div class="metric-value">${analysis.collateral_coverage}x</div>
            </div>
            
            <div class="metric-box">
                <div class="metric-label">Risk Score</div>
                <div class="metric-value">${analysis.risk_score}/100</div>
            </div>
        </div>

        <div style="margin-top: 20px;">
            <div class="info-grid">
                <div class="info-label">Monthly Revenue:</div>
                <div class="info-value">${formatCurrency(application.financial_snapshot.monthly_revenue)}</div>
                
                <div class="info-label">Monthly Expenses:</div>
                <div class="info-value">${formatCurrency(application.financial_snapshot.monthly_expenses)}</div>
                
                <div class="info-label">Existing Debt Payment:</div>
                <div class="info-value">${formatCurrency(application.financial_snapshot.monthly_debt_payment)}</div>
                
                <div class="info-label">Collateral Type:</div>
                <div class="info-value">${application.collateral.type}</div>
                
                <div class="info-label">Collateral Value:</div>
                <div class="info-value">${formatCurrency(application.collateral.estimated_value)}</div>
            </div>
        </div>

        ${analysis.risk_flags && analysis.risk_flags.length > 0 ? `
        <div style="margin-top: 20px;">
            <h4>Risk Flags:</h4>
            ${analysis.risk_flags.map(flag => `
                <div class="risk-flag risk-${flag.severity.toLowerCase()}">
                    <strong>[${flag.severity}] ${flag.flag}</strong><br>
                    ${flag.description}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${analysis.analyst_notes ? `
        <div style="margin-top: 20px;">
            <h4>Analyst Notes:</h4>
            <p>${analysis.analyst_notes}</p>
        </div>
        ` : ''}
    </div>
    ` : ''}

    <!-- Decision -->
    ${decision ? `
    <div class="section">
        <div class="section-title">4. CREDIT DECISION</div>
        
        <div class="decision-box decision-${decision.final_decision === 'Approved' ? 'approved' : 'rejected'}">
            ${decision.final_decision === 'Approved' ? '✓ APPROVED' : '✗ REJECTED'}
        </div>

        ${decision.recommended_decision ? `
        <div class="info-grid">
            <div class="info-label">Analyst Recommendation:</div>
            <div class="info-value">${decision.recommended_decision}</div>
            
            ${decision.recommendation_notes ? `
            <div class="info-label">Recommendation Notes:</div>
            <div class="info-value">${decision.recommendation_notes}</div>
            ` : ''}
            
            <div class="info-label">Final Decision:</div>
            <div class="info-value">${decision.final_decision}</div>
            
            <div class="info-label">Decision Date:</div>
            <div class="info-value">${format(new Date(decision.decided_at), 'dd MMMM yyyy')}</div>
        </div>
        ` : ''}

        ${decision.approval_conditions && decision.approval_conditions.length > 0 ? `
        <div style="margin-top: 20px;">
            <h4>Approval Conditions:</h4>
            ${decision.approval_conditions.map((condition, index) => `
                <div class="condition-item">
                    <strong>${index + 1}. [${condition.type}]</strong> ${condition.condition}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${decision.rejection_reason ? `
        <div style="margin-top: 20px;">
            <h4>Rejection Reason:</h4>
            <p>${decision.rejection_reason}</p>
        </div>
        ` : ''}
    </div>
    ` : ''}

    <!-- Audit Trail -->
    <div class="section">
        <div class="section-title">5. AUDIT TRAIL</div>
        <table class="audit-table">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Actor</th>
                </tr>
            </thead>
            <tbody>
                ${auditLogs.slice(0, 10).map(log => `
                    <tr>
                        <td>${format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm')}</td>
                        <td>${log.action}</td>
                        <td>${log.actor_id}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p><strong>This is a system-generated document</strong></p>
        <p>Loan Origination System © 2024</p>
    </div>
</body>
</html>
    `;
    
    return html;
  } catch (error) {
    console.error('Generate credit memo HTML error:', error);
    throw error;
  }
};

/**
 * Download credit memo as HTML
 */
export const downloadCreditMemoHTML = async (applicationId) => {
  try {
    const html = await generateCreditMemoHTML(applicationId);
    const application = await getApplicationById(applicationId);
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Credit_Memo_${application.applicant.legal_name.replace(/\s+/g, '_')}_${applicationId}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Download credit memo HTML error:', error);
    throw error;
  }
};

/**
 * Print credit memo
 */
export const printCreditMemo = async (applicationId) => {
  try {
    const html = await generateCreditMemoHTML(applicationId);
    
    // Open in new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
    
    return true;
  } catch (error) {
    console.error('Print credit memo error:', error);
    throw error;
  }
};

// Made with Bob
