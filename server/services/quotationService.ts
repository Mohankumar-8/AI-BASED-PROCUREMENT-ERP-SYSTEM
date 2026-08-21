import { db } from '../db/database';
import { VendorQuote, VendorProfile, RFQ } from '../types/backendTypes';
import { QuotationExtractionService } from './quotationExtractionService';
import { TrueCostEngine } from './trueCostEngine';
import { RiskEngine } from './riskEngine';
import { VendorScoringEngine } from './vendorScoringEngine';
import { RecommendationEngine } from './recommendationEngine';

export class QuotationService {
  /**
   * Complete Quotation Processing Pipeline:
   * Upload -> Extract -> Normalize -> Validate -> Calculate True Cost -> Analyze Risk -> Score Vendor
   */
  public static async processQuotationPipeline(
    rfqId: string,
    rawText: string,
    fileName?: string,
    vendorIdOverride?: string
  ): Promise<VendorQuote> {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) {
      throw new Error(`RFQ with ID '${rfqId}' not found`);
    }

    // Step 1 & 2: Extract & Normalize structured fields
    const extraction = await QuotationExtractionService.extract(rawText, fileName);

    // Resolve or match Vendor Profile
    const vendors = db.getVendors();
    let matchedVendor: VendorProfile | undefined;

    if (vendorIdOverride) {
      matchedVendor = db.getVendorById(vendorIdOverride);
    } else {
      matchedVendor = vendors.find(
        (v) =>
          v.name.toLowerCase().includes(extraction.vendor.toLowerCase()) ||
          extraction.vendor.toLowerCase().includes(v.name.toLowerCase())
      );
    }

    if (!matchedVendor) {
      matchedVendor = {
        id: `v-${Date.now()}`,
        name: extraction.vendor,
        legalEntity: `${extraction.vendor} Enterprises Ltd`,
        category: [rfq.category],
        country: 'India',
        headquarters: 'Bengaluru, India',
        rating: 4.5,
        tier: 'Standard',
        reliabilityScore: 85,
        historicalOnTimeDeliveryPct: 90.0,
        historicalDefectRatePct: 1.0,
        qualityScore: 88,
        averagePriceTier: 'Competitive',
        totalSpendYTD: 0,
        completedOrdersCount: 0,
        riskLevel: 'LOW',
        certifications: ['ISO 9001'],
        contactName: 'Operations Lead',
        contactEmail: 'sales@vendor.internal',
        contactPhone: '+91 80 0000 0000',
        paymentTermsStandard: extraction.paymentTerms || 'Net 30 Days',
        tags: ['New Ingested Vendor'],
        performanceHistory: [],
      };
      db.createVendor(matchedVendor);
    }

    // Step 3: Validate & compute commercial totals
    const quantity = extraction.quantity || rfq.items[0]?.requiredQuantity || 100;
    const unitPrice = extraction.unitPrice || 48000;
    const basePrice = unitPrice * quantity;
    const taxAmount = extraction.tax || Math.round(basePrice * 0.18);
    const shippingCost = extraction.shipping || 0;
    const installationCost = extraction.installation || 0;
    const maintenanceCost = extraction.maintenance || 0;
    const discountAmount = extraction.discount || 0;
    const quotedTotal = basePrice + taxAmount + shippingCost + installationCost + maintenanceCost - discountAmount;

    // Delivery & Warranty parameters
    const deliveryLeadTimeDays = extraction.deliveryDays || 7;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryLeadTimeDays);
    const promisedDeliveryDate = deliveryDate.toISOString().split('T')[0];

    const warrantyPeriodMonths =
      typeof extraction.warranty === 'number'
        ? extraction.warranty
        : parseInt(String(extraction.warranty), 10) || 36;

    // Payment Days
    let paymentDays = 30;
    const terms = (extraction.paymentTerms || '').toLowerCase();
    if (terms.includes('net 60')) paymentDays = 60;
    else if (terms.includes('net 45')) paymentDays = 45;
    else if (terms.includes('net 30')) paymentDays = 30;
    else if (terms.includes('advance')) paymentDays = -15; // advance penalty

    // Step 4: Calculate True Cost
    const trueCost = TrueCostEngine.calculate({
      basePrice,
      taxAmount,
      shippingCost,
      installationCost,
      maintenanceCost,
      discountAmount,
      quantity,
      targetBudget: rfq.targetBudget,
      incoterms: extraction.incoterms,
      paymentDays,
      defectRatePct: matchedVendor.historicalDefectRatePct,
    });

    // Step 5: Analyze Risk
    const riskAnalysis = RiskEngine.analyzeRisk(
      {
        basePrice,
        quotedTotal,
        trueCost,
        shippingCost,
        incoterms: extraction.incoterms || 'DDP',
        paymentTerms: extraction.paymentTerms,
        paymentDays,
        deliveryLeadTimeDays,
        warrantyPeriodMonths,
      },
      matchedVendor,
      10,
      rfq.targetBudget
    );

    // Construct Draft Quote
    const quoteId = `q-${matchedVendor.id}-${Date.now().toString().slice(-4)}`;
    const vendorQuote: VendorQuote = {
      id: quoteId,
      rfqId,
      vendorId: matchedVendor.id,
      vendorName: matchedVendor.name,
      vendorCountry: matchedVendor.country,
      vendorTier: matchedVendor.tier,
      quoteReference: extraction.quotationNumber || `QT-${Date.now().toString().slice(-6)}`,
      submissionDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      currency: rfq.budgetCurrency || 'INR',
      fileName: fileName || 'Uploaded_Quotation.pdf',
      fileSize: '1.5 MB',
      rawQuoteText: rawText,
      extractionConfidence: extraction.extractionConfidence || 97.0,
      extractedAt: new Date().toLocaleString(),
      lineItems: extraction.lineItems || [
        {
          id: `li-${Date.now()}`,
          itemCode: rfq.items[0]?.itemCode || 'ITEM-001',
          description: extraction.product,
          quantity,
          unit: 'Units',
          unitPrice,
          totalPrice: basePrice,
          leadTimeDays: deliveryLeadTimeDays,
          warrantyMonths: warrantyPeriodMonths,
        },
      ],
      basePrice,
      taxAmount,
      shippingCost,
      installationCost,
      maintenanceCost,
      discountAmount,
      quotedTotal,
      paymentTerms: extraction.paymentTerms || matchedVendor.paymentTermsStandard,
      paymentDays,
      incoterms: extraction.incoterms || 'DDP',
      deliveryLeadTimeDays,
      promisedDeliveryDate,
      warrantyPeriodMonths,
      warrantyText: `${warrantyPeriodMonths} Months Comprehensive SLA`,
      slaUptimeCommitment: '99.9% Availability with on-site replacement',
      historicalReliabilityPct: matchedVendor.reliabilityScore,
      riskLevel: riskAnalysis.riskLevel,
      trueCost,
      vendorScore: {
        overallScore: 85,
        priceScore: 85,
        qualityScore: matchedVendor.qualityScore,
        deliveryScore: 85,
        reliabilityScore: matchedVendor.reliabilityScore,
        warrantyScore: 85,
        paymentTermsScore: 85,
        strengths: [],
        weaknesses: [],
      },
      anomalies: riskAnalysis.anomalies,
      aiNotes: riskAnalysis.explanations.join(' '),
      isRecommendedWinner: false,
    };

    // Step 6: Score Quote within Cohort & Update RFQ
    const updatedRfq = db.addQuoteToRfq(rfqId, vendorQuote);
    if (updatedRfq) {
      const vendorsMap = new Map(db.getVendors().map((v) => [v.id, v]));
      const rankedQuotes = VendorScoringEngine.rankQuotes(updatedRfq.quotes, vendorsMap);
      db.updateRfq(rfqId, { quotes: rankedQuotes });
      return rankedQuotes.find((q) => q.id === vendorQuote.id) || vendorQuote;
    }

    return vendorQuote;
  }

  public static getQuotationById(id: string): VendorQuote | undefined {
    const rfqs = db.getRfqs();
    for (const rfq of rfqs) {
      const quote = rfq.quotes.find((q) => q.id === id);
      if (quote) return quote;
    }
    return undefined;
  }

  public static getQuotationsByRfq(rfqId: string): VendorQuote[] {
    const rfq = db.getRfqById(rfqId);
    return rfq ? rfq.quotes : [];
  }

  public static analyzeQuotations(rfqId: string) {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) throw new Error(`RFQ '${rfqId}' not found`);

    const vendorsMap = new Map(db.getVendors().map((v) => [v.id, v]));
    const rankedQuotes = VendorScoringEngine.rankQuotes(rfq.quotes, vendorsMap);
    db.updateRfq(rfqId, { quotes: rankedQuotes });

    const recommendation = RecommendationEngine.generateRecommendation(rfq, rankedQuotes, vendorsMap);
    return {
      rfqId,
      quotesCount: rankedQuotes.length,
      rankedQuotes,
      recommendation,
    };
  }
}
