export type ProcurementStage = 
  | 'dashboard'
  | 'purchase_requests'
  | 'rfqs'
  | 'quotations'
  | 'ai_analysis'
  | 'vendor_intelligence'
  | 'purchase_orders'
  | 'inventory'
  | 'finance'
  | 'copilot'
  | 'settings';

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
  basePrice: number;         // Base / Sticker Price
  taxAmount: number;         // + Tax
  shippingAndLogistics: number; // + Shipping
  installationCost: number;  // + Installation
  maintenanceAndSupport: number; // + Maintenance
  discountAmount: number;    // - Discount
  totalTrueCost: number;     // = True Procurement Cost
  savingsVsBudget: number;
  savingsPercentage: number;
  unitTrueCost: number;
  paymentTermCarryCost: number; // Financing / credit period value
  defectAndRiskBuffer: number;  // Statistical defect cost
}

export interface VendorScoreBreakdown {
  overallScore: number; // 0-100
  priceScore: number;    // Weight ~30%
  qualityScore: number;  // Weight ~25%
  deliveryScore: number; // Weight ~20%
  riskScore: number;     // Weight ~15%
  esgScore: number;      // Weight ~10%
  strengths: string[];
  weaknesses: string[];
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
  
  // Extraction metadata
  fileName?: string;
  fileSize?: string;
  rawQuoteText?: string;
  extractionConfidence: number; // 0-100%
  extractedAt: string;
  
  // Commercial Terms
  lineItems: QuoteLineItem[];
  basePrice: number;
  taxAmount: number;
  shippingCost: number;
  installationCost: number;
  maintenanceCost: number;
  discountAmount: number;
  quotedTotal: number;
  
  paymentTerms: string; // e.g. "Net 60", "30% Advance, 70% on BL", "Net 30"
  paymentDays: number;
  incoterms: 'DDP' | 'FOB' | 'CIF' | 'EXW' | 'DAP';
  deliveryLeadTimeDays: number;
  promisedDeliveryDate: string;
  warrantyPeriodMonths: number;
  warrantyText: string;
  slaUptimeCommitment: string;
  historicalReliabilityPct: number;
  riskLevel: RiskLevel;
  
  // AI Derived Analytics
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
  
  // Decision & Approval state
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
  rating: number; // 1.0 to 5.0
  tier: 'Preferred' | 'Certified' | 'Standard' | 'Under Review';
  reliabilityScore: number; // 0-100%
  historicalOnTimeDeliveryPct: number;
  historicalDefectRatePct: number;
  qualityScore: number; // 0-100%
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

export interface ExplainableDecisionBrief {
  winnerVendorId: string;
  winnerVendorName: string;
  winnerScore: number;
  executiveSummary: string;
  keySelectionDrivers: {
    driver: string;
    impact: string;
    advantageVsNextBest: string;
  }[];
  expectedSavingsINR: number;
  expectedSavingsUSD: number;
  confidenceScorePct: number;
  riskMitigationPlan: string[];
  negotiationPoints: string[];
  whatIfSensitivityAnalysis: {
    scenario: string;
    outcome: string;
  }[];
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  contextRfqId?: string;
  actionSuggestions?: {
    label: string;
    actionType: 'run_simulation' | 'draft_negotiation' | 'generate_rfq' | 'check_anomalies' | 'switch_rfq' | 'generate_po';
    payload?: any;
  }[];
}

export interface EnterpriseSettings {
  autoApprovalThreshold: number; // e.g. 5000000 (50L)
  minVendorScoreForAutoApproval: number; // e.g. 90
  maxRiskAllowedForAutoApproval: RiskLevel;
  defaultCurrency: 'INR' | 'USD';
  enableZeroTouchPoGeneration: boolean;
  enableAnomalyRiskScans: boolean;
  aiConfidenceThreshold: number; // e.g. 85
  emailNotifications: boolean;
}
