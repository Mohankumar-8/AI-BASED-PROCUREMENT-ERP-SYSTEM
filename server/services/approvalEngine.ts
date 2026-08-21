import { db } from '../db/database';
import { RFQ, VendorQuote, ApprovalEvaluation, RiskLevel } from '../types/backendTypes';

export class ApprovalEngine {
  public static AUTO_APPROVAL_LIMIT_INR = 5000000; // ₹50 Lakhs
  public static MIN_SCORE_FOR_AUTO_APPROVAL = 90;

  /**
   * Evaluates the corporate approval tier based on procurement amount, risk profile, and score.
   */
  public static evaluatePolicy(
    totalAmount: number,
    riskLevel: RiskLevel,
    vendorScore: number
  ): ApprovalEvaluation {
    // 1. Low-value + low-risk + high performance -> Zero-Touch Auto Approval
    if (
      totalAmount <= this.AUTO_APPROVAL_LIMIT_INR &&
      riskLevel === 'LOW' &&
      vendorScore >= this.MIN_SCORE_FOR_AUTO_APPROVAL
    ) {
      return {
        approvalRequired: false,
        tier: 'auto_approved',
        policyMatched: `Policy Tier 1 (Zero-Touch): Total amount (₹${(totalAmount / 100000).toFixed(1)}L) <= ₹50L + Low Risk + Score (${vendorScore}) >= 90 qualifies for autonomous approval.`,
        isAutoApproved: true,
        requiresFinanceSignOff: false,
        reason: 'Optimal commercial terms, zero hidden fees, and preferred tier-1 vendor reliability.',
        riskLevel,
        totalAmount,
      };
    }

    // 2. High-value OR High-Risk -> Manager + Finance dual sign-off
    if (totalAmount > 10000000 || riskLevel === 'HIGH') {
      return {
        approvalRequired: true,
        tier: 'manager_and_finance',
        policyMatched: `Policy Tier 3 (Dual Sign-off): Amount > ₹1 Cr OR High Risk Level (${riskLevel}) requires Procurement VP + Chief Financial Officer approval.`,
        isAutoApproved: false,
        requiresFinanceSignOff: true,
        reason: riskLevel === 'HIGH'
          ? 'Quotation contains critical risk anomalies (e.g., hidden FOB charges, upfront cash advance requirement).'
          : 'High transaction value requires corporate treasury authorization.',
        riskLevel,
        totalAmount,
      };
    }

    // 3. Medium-value -> Standard Procurement Manager approval
    return {
      approvalRequired: true,
      tier: 'procurement_manager',
      policyMatched: `Policy Tier 2 (Manager Sign-off): Amount between ₹50L and ₹1 Cr with Low/Medium risk requires Procurement Lead authorization.`,
      isAutoApproved: false,
      requiresFinanceSignOff: false,
      reason: 'Standard managerial verification required before PO release.',
      riskLevel,
      totalAmount,
    };
  }

  /**
   * Evaluates an RFQ and selected quotation for approval
   */
  public static evaluateRfqApproval(rfqId: string, quoteId?: string): ApprovalEvaluation {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) throw new Error(`RFQ '${rfqId}' not found`);

    let quote = rfq.quotes.find((q) => q.id === (quoteId || rfq.selectedQuoteId));
    if (!quote && rfq.quotes.length > 0) {
      quote = rfq.quotes[0];
    }

    const totalAmount = quote?.trueCost?.totalTrueCost || rfq.targetBudget;
    const riskLevel = quote?.riskLevel || 'LOW';
    const score = quote?.vendorScore?.overallScore || 85;

    return this.evaluatePolicy(totalAmount, riskLevel, score);
  }

  /**
   * Approves an RFQ and updates state
   */
  public static approveRfq(rfqId: string, approverName: string = 'Procurement Committee', notes?: string): RFQ {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) throw new Error(`RFQ '${rfqId}' not found`);

    const evaluation = this.evaluateRfqApproval(rfqId);
    const updated = db.updateRfq(rfqId, {
      approvalStatus: evaluation.isAutoApproved ? 'auto_approved' : 'approved',
      approvalNotes: notes || evaluation.reason,
      approvedBy: approverName,
      approvedAt: new Date().toISOString(),
      approvalRulesMatched: [evaluation.policyMatched],
      status: 'awarded',
    });

    return updated!;
  }

  /**
   * Rejects an RFQ approval request
   */
  public static rejectRfq(rfqId: string, rejectorName: string, reason: string): RFQ {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) throw new Error(`RFQ '${rfqId}' not found`);

    const updated = db.updateRfq(rfqId, {
      approvalStatus: 'rejected',
      approvalNotes: reason || 'Rejected by procurement reviewer',
      approvedBy: rejectorName,
      approvedAt: new Date().toISOString(),
      status: 'decision_ready',
    });

    return updated!;
  }
}
