import { VendorScoreBreakdown, VendorScoreWeights, VendorQuote, VendorProfile } from '../types/backendTypes';

export const DEFAULT_WEIGHTS: VendorScoreWeights = {
  price: 35,
  quality: 20,
  delivery: 15,
  reliability: 15,
  warranty: 10,
  paymentTerms: 5,
};

export class VendorScoringEngine {
  /**
   * Scores a single quotation based on multi-factor attributes and cohort benchmarking.
   */
  public static scoreQuote(
    quote: Partial<VendorQuote>,
    vendorProfile?: VendorProfile,
    allQuotesCohort?: Partial<VendorQuote>[],
    customWeights?: Partial<VendorScoreWeights>
  ): VendorScoreBreakdown {
    const weights: VendorScoreWeights = { ...DEFAULT_WEIGHTS, ...customWeights };

    // 1. Price Score (35% weight)
    // Benchmark against cohort or target budget
    const quoteTrueCost = quote.trueCost?.totalTrueCost || quote.quotedTotal || 5000000;
    let minCostInCohort = quoteTrueCost;
    let maxCostInCohort = quoteTrueCost;

    if (allQuotesCohort && allQuotesCohort.length > 0) {
      const costs = allQuotesCohort.map((q) => q.trueCost?.totalTrueCost || q.quotedTotal || quoteTrueCost);
      minCostInCohort = Math.min(...costs);
      maxCostInCohort = Math.max(...costs);
    }

    let priceScore = 85;
    if (maxCostInCohort > minCostInCohort) {
      // Relative normalization: Lowest cost gets ~98, Highest gets ~70
      const costSpread = maxCostInCohort - minCostInCohort;
      const normalizedRatio = 1 - (quoteTrueCost - minCostInCohort) / costSpread;
      priceScore = Math.round(70 + normalizedRatio * 28);
    } else {
      priceScore = quote.trueCost && quote.trueCost.savingsVsBudget >= 0 ? 92 : 80;
    }

    // 2. Quality Score (20% weight)
    let qualityScore = vendorProfile?.qualityScore ?? 85;
    if (quote.vendorTier === 'Preferred') qualityScore = Math.max(qualityScore, 95);
    else if (quote.vendorTier === 'Under Review') qualityScore = Math.min(qualityScore, 75);

    // 3. Delivery Score (15% weight)
    const leadTime = quote.deliveryLeadTimeDays ?? 10;
    let deliveryScore = 80;
    if (leadTime <= 5) deliveryScore = 98;
    else if (leadTime <= 10) deliveryScore = 90;
    else if (leadTime <= 15) deliveryScore = 78;
    else if (leadTime <= 20) deliveryScore = 65;
    else deliveryScore = 48; // Severe lead time penalty

    // Factor in vendor's historical on-time delivery rate
    if (vendorProfile?.historicalOnTimeDeliveryPct) {
      const histWeight = vendorProfile.historicalOnTimeDeliveryPct;
      deliveryScore = Math.round(deliveryScore * 0.6 + histWeight * 0.4);
    }

    // 4. Reliability Score (15% weight)
    let reliabilityScore = vendorProfile?.reliabilityScore ?? quote.historicalReliabilityPct ?? 85;
    if (quote.riskLevel === 'HIGH') reliabilityScore = Math.min(reliabilityScore, 65);
    else if (quote.riskLevel === 'LOW') reliabilityScore = Math.max(reliabilityScore, 92);

    // 5. Warranty Score (10% weight)
    const warrantyMonths = quote.warrantyPeriodMonths ?? 12;
    let warrantyScore = 70;
    if (warrantyMonths >= 36) warrantyScore = 98;
    else if (warrantyMonths >= 24) warrantyScore = 88;
    else if (warrantyMonths >= 12) warrantyScore = 70;
    else warrantyScore = 50;

    // 6. Payment Terms Score (5% weight)
    const terms = (quote.paymentTerms || '').toLowerCase();
    let paymentTermsScore = 75;
    if (terms.includes('net 60')) paymentTermsScore = 98;
    else if (terms.includes('net 45')) paymentTermsScore = 92;
    else if (terms.includes('net 30')) paymentTermsScore = 85;
    else if (terms.includes('advance')) paymentTermsScore = 35; // Advance payment penalty

    // Normalize weights if custom total != 100
    const totalWeight =
      weights.price +
      weights.quality +
      weights.delivery +
      weights.reliability +
      weights.warranty +
      weights.paymentTerms;

    const weightedSum =
      priceScore * weights.price +
      qualityScore * weights.quality +
      deliveryScore * weights.delivery +
      reliabilityScore * weights.reliability +
      warrantyScore * weights.warranty +
      paymentTermsScore * weights.paymentTerms;

    const overallScore = Number((weightedSum / totalWeight).toFixed(1));

    // Strengths and Weaknesses derivation
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (priceScore >= 90) strengths.push('Highly competitive True Procurement Cost');
    if (deliveryScore >= 90) strengths.push(`Expedited delivery commitment (${leadTime} days)`);
    if (warrantyScore >= 90) strengths.push(`Comprehensive ${warrantyMonths}-month warranty coverage`);
    if (qualityScore >= 92) strengths.push('Excellent product quality rating & certifications');
    if (paymentTermsScore >= 90) strengths.push(`Favorable credit terms (${quote.paymentTerms || 'Net 45+'})`);

    if (priceScore < 75) weaknesses.push('High total landed cost compared to alternative quotations');
    if (deliveryScore < 70) weaknesses.push(`Extended delivery lead time (${leadTime} days exceeds target)`);
    if (warrantyScore < 75) weaknesses.push(`Shorter warranty period (${warrantyMonths} months vs 36m target)`);
    if (paymentTermsScore < 60) weaknesses.push('Unfavorable cash flow terms (upfront advance requirement)');
    if (reliabilityScore < 75) weaknesses.push('Historical delivery delays or elevated defect rate');

    return {
      overallScore,
      priceScore,
      qualityScore,
      deliveryScore,
      reliabilityScore,
      warrantyScore,
      paymentTermsScore,
      strengths,
      weaknesses,
    };
  }

  /**
   * Scores and ranks an entire cohort of quotes for an RFQ.
   */
  public static rankQuotes(
    quotes: VendorQuote[],
    vendorsMap: Map<string, VendorProfile>,
    customWeights?: Partial<VendorScoreWeights>
  ): VendorQuote[] {
    const scored = quotes.map((q) => {
      const vendor = vendorsMap.get(q.vendorId);
      const score = this.scoreQuote(q, vendor, quotes, customWeights);
      return {
        ...q,
        vendorScore: score,
      };
    });

    // Sort descending by overallScore
    scored.sort((a, b) => b.vendorScore.overallScore - a.vendorScore.overallScore);

    // Assign ranks & mark winner
    return scored.map((q, idx) => ({
      ...q,
      vendorScore: {
        ...q.vendorScore,
        rank: idx + 1,
      },
      isRecommendedWinner: idx === 0 && q.riskLevel !== 'HIGH',
    }));
  }
}
