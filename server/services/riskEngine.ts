import { AnomalyFlag, RiskLevel, VendorQuote, VendorProfile } from '../types/backendTypes';

export interface RiskAnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number; // 0 (safest) to 100 (highest risk)
  anomalies: AnomalyFlag[];
  explanations: string[];
}

export class RiskEngine {
  /**
   * Performs deep multi-vector risk analysis across commercial terms, vendor track record,
   * delivery timelines, incoterms, and payment structures.
   */
  public static analyzeRisk(
    quote: Partial<VendorQuote>,
    vendorProfile?: VendorProfile,
    rfqDeadlineDays: number = 10,
    targetBudget: number = 5000000
  ): RiskAnalysisResult {
    const anomalies: AnomalyFlag[] = [];
    const explanations: string[] = [];
    let riskPoints = 0;

    // 1. Incoterms / Hidden Freight Vector
    const incoterm = (quote.incoterms || 'DDP').toUpperCase();
    if (incoterm === 'FOB' || incoterm === 'EXW') {
      const isCritical = incoterm === 'FOB';
      anomalies.push({
        id: `anom-${Date.now()}-fob`,
        severity: 'critical',
        category: 'shipping_surcharge',
        title: `${incoterm} Hidden Logistics Burden`,
        description: `Quotation is provided under ${incoterm} terms. Enterprise absorbs all international freight, port forwarding, and customs clearance charges.`,
        impactScore: 9.0,
        suggestedAction: 'Insist on DDP Delivered Duty Paid destination terms or add freight equalizer.',
      });
      explanations.push(`Hidden logistics exposure due to ${incoterm} trade terms.`);
      riskPoints += 35;
    } else if (quote.shippingCost && quote.shippingCost > 0.05 * (quote.basePrice || 1)) {
      anomalies.push({
        id: `anom-${Date.now()}-ship`,
        severity: 'warning',
        category: 'shipping_surcharge',
        title: 'Elevated Freight & Handling Surcharge',
        description: `Quoted shipping charge exceeds 5% of base product value.`,
        impactScore: 5.0,
        suggestedAction: 'Request breakdown or consolidated fleet delivery.',
      });
      riskPoints += 15;
    }

    // 2. Payment Terms Risk Vector
    const paymentTerms = (quote.paymentTerms || '').toLowerCase();
    if (paymentTerms.includes('advance') || paymentTerms.includes('upfront') || paymentTerms.includes('cbd')) {
      anomalies.push({
        id: `anom-${Date.now()}-pay`,
        severity: 'critical',
        category: 'payment_risk',
        title: 'Unfavorable Upfront Advance Payment Risk',
        description: `Vendor requires upfront advance payment (${quote.paymentTerms}) before delivery, creating working capital & non-fulfillment risk.`,
        impactScore: 8.5,
        suggestedAction: 'Require Net 30/45 milestone settlement or Irrevocable Letter of Credit.',
      });
      explanations.push('Unfavorable cash-flow risk from required upfront advance.');
      riskPoints += 30;
    } else if (quote.paymentDays !== undefined && quote.paymentDays < 15) {
      anomalies.push({
        id: `anom-${Date.now()}-pay-short`,
        severity: 'warning',
        category: 'payment_risk',
        title: 'Short Payment Window',
        description: 'Payment terms require settlement in under 15 days.',
        impactScore: 4.0,
        suggestedAction: 'Negotiate standard enterprise Net 30 or Net 45.',
      });
      riskPoints += 10;
    }

    // 3. Delivery Lead Time Risk Vector
    const leadTime = quote.deliveryLeadTimeDays ?? 10;
    if (leadTime > rfqDeadlineDays * 1.5) {
      anomalies.push({
        id: `anom-${Date.now()}-lead`,
        severity: 'critical',
        category: 'lead_time_risk',
        title: 'Severe Delivery Timeline Breach',
        description: `Promised delivery of ${leadTime} days exceeds procurement deadline of ${rfqDeadlineDays} days by ${leadTime - rfqDeadlineDays} days.`,
        impactScore: 8.0,
        suggestedAction: 'Impose liquidated damages SLA clause or disqualify if critical path.',
      });
      explanations.push(`Lead time (${leadTime} days) violates required schedule (${rfqDeadlineDays} days).`);
      riskPoints += 25;
    } else if (leadTime > rfqDeadlineDays) {
      anomalies.push({
        id: `anom-${Date.now()}-lead-warn`,
        severity: 'warning',
        category: 'lead_time_risk',
        title: 'Tight Delivery Schedule',
        description: `Lead time of ${leadTime} days slightly exceeds target of ${rfqDeadlineDays} days.`,
        impactScore: 4.5,
        suggestedAction: 'Request expedited freight or staged dispatch.',
      });
      riskPoints += 12;
    }

    // 4. Vendor Track Record & Reliability Vector
    if (vendorProfile) {
      if (vendorProfile.historicalOnTimeDeliveryPct < 85) {
        anomalies.push({
          id: `anom-${Date.now()}-hist-del`,
          severity: 'warning',
          category: 'lead_time_risk',
          title: 'Poor Historical On-Time Delivery Record',
          description: `Vendor historical on-time fulfillment rate is ${vendorProfile.historicalOnTimeDeliveryPct}% (<85% enterprise benchmark).`,
          impactScore: 6.0,
          suggestedAction: 'Set strict milestone check-ins with delivery penalties.',
        });
        explanations.push(`Sub-par historical on-time delivery record (${vendorProfile.historicalOnTimeDeliveryPct}%).`);
        riskPoints += 20;
      }

      if (vendorProfile.historicalDefectRatePct > 2.0) {
        anomalies.push({
          id: `anom-${Date.now()}-hist-defect`,
          severity: 'warning',
          category: 'compliance_gap',
          title: 'Elevated Historical Defect Rate',
          description: `Vendor historical defect rate is ${vendorProfile.historicalDefectRatePct}% (>2.0% enterprise tolerance).`,
          impactScore: 6.5,
          suggestedAction: 'Mandate pre-shipment Quality Assurance testing and GRN inspection.',
        });
        explanations.push(`Elevated defect rate history (${vendorProfile.historicalDefectRatePct}%).`);
        riskPoints += 20;
      }

      if (vendorProfile.tier === 'Under Review') {
        riskPoints += 15;
      }
    }

    // 5. Price Deviation / Bait-and-Switch Detection
    const quotedBase = quote.basePrice || quote.quotedTotal || 0;
    const trueCostTotal = quote.trueCost?.totalTrueCost || quotedBase;
    if (quotedBase > 0 && trueCostTotal > quotedBase * 1.25) {
      anomalies.push({
        id: `anom-${Date.now()}-escalation`,
        severity: 'critical',
        category: 'price_escalation',
        title: 'Substantial Hidden Cost Escalation',
        description: `True Landed Cost (₹${(trueCostTotal / 100000).toFixed(1)}L) is over 25% higher than nominal sticker price (₹${(quotedBase / 100000).toFixed(1)}L) due to auxiliary surcharges.`,
        impactScore: 8.0,
        suggestedAction: 'Standardize quote to all-inclusive DDP package.',
      });
      explanations.push('High disparity between nominal base price and full landed cost.');
      riskPoints += 25;
    }

    // 6. Warranty Discrepancy Vector
    const warranty = quote.warrantyPeriodMonths ?? 12;
    if (warranty < 24) {
      anomalies.push({
        id: `anom-${Date.now()}-warr`,
        severity: 'info',
        category: 'clause_ambiguity',
        title: 'Short Warranty Coverage',
        description: `Vendor provides ${warranty}-month warranty vs standard 36-month enterprise coverage.`,
        impactScore: 3.0,
        suggestedAction: 'Add extended warranty addendum to quotation.',
      });
      riskPoints += 8;
    }

    // Determine Final Risk Level
    let riskLevel: RiskLevel = 'LOW';
    if (riskPoints >= 45 || anomalies.some((a) => a.severity === 'critical')) {
      riskLevel = 'HIGH';
    } else if (riskPoints >= 20 || anomalies.some((a) => a.severity === 'warning')) {
      riskLevel = 'MEDIUM';
    }

    if (explanations.length === 0) {
      explanations.push('Full compliance with enterprise commercial standards, DDP terms, and SLA benchmarks.');
    }

    return {
      riskLevel,
      riskScore: Math.min(100, riskPoints),
      anomalies,
      explanations,
    };
  }
}
