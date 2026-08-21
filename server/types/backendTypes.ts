export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskSeverity = 'critical' | 'warning' | 'info';

export interface AnomalyFlag {
  id: string;
  severity: RiskSeverity;
  category: 'price_escalation' | 'shipping_surcharge' | 'payment_risk' | 'lead_time_risk' | 'compliance_gap' | 'clause_ambiguity';
  title: string;
  description: string;
  impactScore: number; // 0-10 penalty points
  suggestedAction: string;
}

export interface QuoteLineItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  leadTimeDays: number;
  warrantyMonths: number;
}

export interface TrueCostBreakdown {
  basePrice: number;            // Base / Quoted Sticker Price
  taxAmount: number;            // + Tax
  shippingAndLogistics: number; // + Shipping & Freight
  installationCost: number;     // + Installation & Setup
  maintenanceAndSupport: number;// + Maintenance & SLA
  discountAmount: number;       // - Discount
  totalTrueCost: number;        // = True Procurement Cost
  savingsVsBudget: number;
  savingsPercentage: number;
  unitTrueCost: number;
  paymentTermCarryCost: number; // Financing / credit period value
  defectAndRiskBuffer: number;  // Statistical defect cost
  riskAdjustedCost?: number;    // True Cost + Risk Buffer + Carry Cost
}

export interface VendorScoreWeights {
  price: number;        // Default 35
  quality: number;      // Default 20
  delivery: number;     // Default 15
  reliability: number;  // Default 15
  warranty: number;     // Default 10
  paymentTerms: number; // Default 5
}

export interface VendorScoreBreakdown {
  overallScore: number;        // 0-100
  priceScore: number;          // Weight 35%
  qualityScore: number;        // Weight 20%
  deliveryScore: number;       // Weight 15%
  reliabilityScore: number;    // Weight 15%
  warrantyScore: number;       // Weight 10%
  paymentTermsScore: number;   // Weight 5%
  rank?: number;
  strengths: string[];
  weaknesses: string[];
}

export interface RawQuotationExtraction {
  vendor: string;
  quotationNumber: string;
  product: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  shipping: number;
  installation: number;
  maintenance: number;
  deliveryDays: number;
  warranty: number | string;
  paymentTerms: string;
  incoterms?: 'DDP' | 'FOB' | 'CIF' | 'EXW' | 'DAP';
  lineItems?: QuoteLineItem[];
  rawText?: string;
  extractionConfidence?: number;
}

export interface VendorQuote {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  vendorCountry: string;
  vendorTier: 'Preferred' | 'Certified' | 'Standard' | 'Under Review';
  quoteReference: string;
  submissionDate: string;
  validUntil: string;
  currency: string;
  
  fileName?: string;
  fileSize?: string;
  rawQuoteText?: string;
  extractionConfidence: number;
  extractedAt: string;
  
  lineItems: QuoteLineItem[];
  basePrice: number;
  taxAmount: number;
  shippingCost: number;
  installationCost: number;
  maintenanceCost: number;
  discountAmount: number;
  quotedTotal: number;
  
  paymentTerms: string;
  paymentDays: number;
  incoterms: 'DDP' | 'FOB' | 'CIF' | 'EXW' | 'DAP';
  deliveryLeadTimeDays: number;
  promisedDeliveryDate: string;
  warrantyPeriodMonths: number;
  warrantyText: string;
  slaUptimeCommitment: string;
  historicalReliabilityPct: number;
  riskLevel: RiskLevel;
  
  trueCost: TrueCostBreakdown;
  vendorScore: VendorScoreBreakdown;
  anomalies: AnomalyFlag[];
  aiNotes: string;
  isRecommendedWinner?: boolean;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  title: string;
  product: string;
  quantity: number;
  unit: string;
  specifications: Record<string, string>;
  specificationsText: string;
  budget: number;
  currency: string;
  requiredDeliveryDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  department: string;
  requesterName: string;
  requesterEmail: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Converted to RFQ';
  createdDate: string;
  rawNaturalLanguage?: string;
  rfqId?: string;
}

export interface RfqItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  requiredQuantity: number;
  unit: string;
  targetUnitPrice: number;
  technicalSpecs: Record<string, string>;
  complianceRequired: string[];
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  department: string;
  requesterName: string;
  requesterEmail: string;
  category: 'IT Hardware' | 'Industrial & Machinery' | 'Facility & Office' | 'Raw Materials' | 'Logistics & Services';
  priority: 'urgent' | 'high' | 'medium' | 'standard';
  status: 'draft' | 'open_for_quotes' | 'analyzing' | 'decision_ready' | 'awarded' | 'cancelled';
  createdAt: string;
  deadlineDate: string;
  targetBudget: number;
  budgetCurrency: string;
  deliveryLocation: string;
  requiredDeliveryDate: string;
  description: string;
  items: RfqItem[];
  invitedVendorIds: string[];
  quotes: VendorQuote[];
  
  selectedQuoteId?: string;
  approvalStatus: 'pending' | 'auto_approved' | 'approved' | 'rejected';
  approvalRulesMatched: string[];
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  poNumber?: string;
}

export interface VendorProfile {
  id: string;
  name: string;
  legalEntity: string;
  category: string[];
  country: string;
  headquarters: string;
  rating: number;
  tier: 'Preferred' | 'Certified' | 'Standard' | 'Under Review';
  reliabilityScore: number;
  historicalOnTimeDeliveryPct: number;
  historicalDefectRatePct: number;
  qualityScore: number;
  averagePriceTier: 'Budget' | 'Competitive' | 'Premium' | 'Strategic';
  totalSpendYTD: number;
  completedOrdersCount: number;
  riskLevel: RiskLevel;
  certifications: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentTermsStandard: string;
  tags: string[];
  performanceHistory: {
    period: string;
    onTimePct: number;
    qualityPct: number;
    spendAmount: number;
  }[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  rfqId: string;
  rfqTitle: string;
  vendorId: string;
  vendorName: string;
  issueDate: string;
  deliveryDueDate: string;
  items: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'issued' | 'acknowledged' | 'in_transit' | 'partially_received' | 'completed' | 'cancelled';
  paymentTerms: string;
  incoterms: string;
  deliveryAddress: string;
  warrantyTerms: string;
  lineItems: QuoteLineItem[];
  trueLandingCostCalculated: number;
  milestones: {
    title: string;
    date: string;
    completed: boolean;
  }[];
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  date: string;
  type: 'Inbound Receipt' | 'Production Dispatch' | 'Transfer' | 'Stock Adjustment';
  quantity: number;
  unit: string;
  referencePo?: string;
  warehouseLocation: string;
  actor: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  incomingStock: number;
  reorderLevel: number;
  safetyStock: number;
  unit: string;
  unitCost: number;
  warehouseLocation: string;
  status: 'optimal' | 'low_stock' | 'reorder_required' | 'excess';
  lastReorderDate?: string;
  pendingPoQuantity: number;
}

export interface FinanceInvoiceRecord {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  poValue: number;
  tax: number;
  amountPayable: number;
  paidAmount: number;
  pendingAmount: number;
  vendorName: string;
  invoiceDate: string;
  dueDate: string;
  status: 'matched_3way' | 'variance_flagged' | 'scheduled_payment' | 'paid';
  poMatchedAmount: number;
  grnMatchedQuantity: number;
  varianceAmount: number;
  varianceNotes?: string;
  capturedSavingsAmount: number;
}

export interface RecommendationResult {
  vendor: string;
  vendorId: string;
  quoteId: string;
  finalScore: number;
  trueCost: number;
  riskLevel: RiskLevel;
  confidence: number;
  reasons: string[];
  warnings: string[];
  rankings: {
    vendor: string;
    vendorId: string;
    finalScore: number;
    trueCost: number;
    rank: number;
    riskLevel: RiskLevel;
  }[];
  savingsVsBudget: number;
  savingsPercentage: number;
}

export interface ApprovalEvaluation {
  approvalRequired: boolean;
  tier: 'auto_approved' | 'procurement_manager' | 'manager_and_finance';
  policyMatched: string;
  isAutoApproved: boolean;
  requiresFinanceSignOff: boolean;
  reason: string;
  riskLevel: RiskLevel;
  totalAmount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: Record<string, any>;
}
