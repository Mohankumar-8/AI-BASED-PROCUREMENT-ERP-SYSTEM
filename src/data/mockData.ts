import { 
  RFQ, 
  VendorProfile, 
  PurchaseOrder, 
  InventoryItem, 
  InventoryMovement,
  FinanceInvoiceRecord, 
  VendorQuote,
  PurchaseRequest,
  EnterpriseSettings,
  ExplainableDecisionBrief
} from '../types';

export const initialSettings: EnterpriseSettings = {
  autoApprovalThreshold: 5000000, // ₹50,00,000 (₹50 Lakhs)
  minVendorScoreForAutoApproval: 90,
  maxRiskAllowedForAutoApproval: 'LOW',
  defaultCurrency: 'INR',
  enableZeroTouchPoGeneration: true,
  enableAnomalyRiskScans: true,
  aiConfidenceThreshold: 85,
  emailNotifications: true,
};

export const initialVendors: VendorProfile[] = [
  {
    id: 'v-vendor-c',
    name: 'Vendor C (CloudTech & CyberCore)',
    legalEntity: 'CloudTech CyberCore Enterprise Solutions Pvt Ltd',
    category: ['IT Hardware', 'Laptops & Workstations', 'Cloud Infrastructure'],
    country: 'India',
    headquarters: 'Bengaluru, Karnataka / Munich',
    rating: 4.9,
    tier: 'Preferred',
    reliabilityScore: 96,
    historicalOnTimeDeliveryPct: 96.2,
    historicalDefectRatePct: 0.2,
    qualityScore: 97,
    averagePriceTier: 'Competitive',
    totalSpendYTD: 24500000, // ₹2.45 Cr
    completedOrdersCount: 68,
    riskLevel: 'LOW',
    certifications: ['ISO 9001:2015', 'ISO 27001', 'RoHS Compliant', 'BIS Certified', 'OEM Gold Partner'],
    contactName: 'Rohan Sharma',
    contactEmail: 'rohan.sharma@cloudtech-cybercore.in',
    contactPhone: '+91 80 4122 8899',
    paymentTermsStandard: 'Net 45 Days',
    tags: ['AI Recommended', 'Tier-1 Partner', '3-Yr On-Site SLA', 'Zero Failure Record'],
    performanceHistory: [
      { period: 'Q1 2026', onTimePct: 97.0, qualityPct: 98.0, spendAmount: 6200000 },
      { period: 'Q4 2025', onTimePct: 95.8, qualityPct: 96.5, spendAmount: 8100000 },
      { period: 'Q3 2025', onTimePct: 96.5, qualityPct: 97.0, spendAmount: 5400000 },
      { period: 'Q2 2025', onTimePct: 95.5, qualityPct: 96.0, spendAmount: 4800000 },
    ]
  },
  {
    id: 'v-vendor-a',
    name: 'Vendor A (Apex Systems Ltd)',
    legalEntity: 'Apex Systems & Hardware Networks India Pvt Ltd',
    category: ['IT Hardware', 'Enterprise Compute', 'Networking'],
    country: 'India',
    headquarters: 'Mumbai, Maharashtra',
    rating: 4.6,
    tier: 'Preferred',
    reliabilityScore: 91,
    historicalOnTimeDeliveryPct: 91.4,
    historicalDefectRatePct: 0.8,
    qualityScore: 92,
    averagePriceTier: 'Competitive',
    totalSpendYTD: 18500000, // ₹1.85 Cr
    completedOrdersCount: 42,
    riskLevel: 'LOW',
    certifications: ['ISO 9001:2015', 'RoHS Compliant', 'BIS Certified'],
    contactName: 'Priya Iyer',
    contactEmail: 'priya.iyer@apexsystems.in',
    contactPhone: '+91 22 6789 1100',
    paymentTermsStandard: 'Net 30 Days',
    tags: ['Established Supplier', 'Local Hub Mumbai', 'Good Technical Support'],
    performanceHistory: [
      { period: 'Q1 2026', onTimePct: 92.0, qualityPct: 93.0, spendAmount: 4500000 },
      { period: 'Q4 2025', onTimePct: 91.0, qualityPct: 92.0, spendAmount: 6200000 },
      { period: 'Q3 2025', onTimePct: 90.5, qualityPct: 91.0, spendAmount: 3800000 },
      { period: 'Q2 2025', onTimePct: 92.0, qualityPct: 92.5, spendAmount: 4000000 },
    ]
  },
  {
    id: 'v-vendor-b',
    name: 'Vendor B (Nexus Global Hardware)',
    legalEntity: 'Nexus Global Logistics & Trading Corp',
    category: ['IT Hardware', 'Commodity Electronics'],
    country: 'Taiwan / India Branch',
    headquarters: 'Taipei / New Delhi',
    rating: 3.8,
    tier: 'Standard',
    reliabilityScore: 74,
    historicalOnTimeDeliveryPct: 74.0,
    historicalDefectRatePct: 3.4,
    qualityScore: 78,
    averagePriceTier: 'Budget',
    totalSpendYTD: 9200000, // ₹92 Lakhs
    completedOrdersCount: 19,
    riskLevel: 'HIGH',
    certifications: ['ISO 9001'],
    contactName: 'Kevin Chen',
    contactEmail: 'k.chen@nexus-global.tw',
    contactPhone: '+886 2 2345 8899',
    paymentTermsStandard: '30% Advance, 70% against B/L',
    tags: ['Low Nominal Price', 'Hidden Freight Trap', 'Higher Defect Rate', 'Slow Support'],
    performanceHistory: [
      { period: 'Q1 2026', onTimePct: 72.0, qualityPct: 76.0, spendAmount: 2200000 },
      { period: 'Q4 2025', onTimePct: 75.0, qualityPct: 79.0, spendAmount: 3100000 },
      { period: 'Q3 2025', onTimePct: 73.5, qualityPct: 77.0, spendAmount: 1900000 },
      { period: 'Q2 2025', onTimePct: 76.0, qualityPct: 80.0, spendAmount: 2000000 },
    ]
  },
  {
    id: 'v-ergoflex',
    name: 'ErgoFlex Workspace Innovations',
    legalEntity: 'ErgoFlex Global Furniture Corp',
    category: ['Facility & Office', 'Ergonomic Furniture'],
    country: 'India / USA',
    headquarters: 'Bengaluru / Grand Rapids, MI',
    rating: 4.8,
    tier: 'Preferred',
    reliabilityScore: 95,
    historicalOnTimeDeliveryPct: 95.8,
    historicalDefectRatePct: 0.5,
    qualityScore: 96,
    averagePriceTier: 'Premium',
    totalSpendYTD: 11200000,
    completedOrdersCount: 29,
    riskLevel: 'LOW',
    certifications: ['BIFMA Level 3', 'GREENGUARD Gold', 'ISO 9001'],
    contactName: 'Sarah Jenkins',
    contactEmail: 'sjenkins@ergoflex-workspace.com',
    contactPhone: '+91 80 5550 0192',
    paymentTermsStandard: 'Net 30 Days',
    tags: ['10-Yr Frame Warranty', 'Ergonomic Certified', 'LEED Compliant'],
    performanceHistory: [
      { period: 'Q1 2026', onTimePct: 96.0, qualityPct: 97.0, spendAmount: 3200000 },
      { period: 'Q4 2025', onTimePct: 95.0, qualityPct: 96.0, spendAmount: 4100000 },
      { period: 'Q3 2025', onTimePct: 96.5, qualityPct: 95.5, spendAmount: 2000000 },
      { period: 'Q2 2025', onTimePct: 95.0, qualityPct: 96.0, spendAmount: 1900000 },
    ]
  }
];

export const initialPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr-2026-101',
    prNumber: 'PR-2026-101',
    title: '100x Enterprise Laptops (i7, 16GB, 512GB SSD)',
    product: 'Enterprise High-Performance Laptops',
    quantity: 100,
    unit: 'Units',
    specifications: {
      'Processor': 'Intel Core i7 13th Gen / Ultra 7',
      'Memory': '16GB DDR5 5600MHz',
      'Storage': '512GB NVMe Gen4 SSD',
      'Display': '14-inch FHD+ Anti-Glare IPS (400 nits)',
      'Security': 'TPM 2.0, Fingerprint Reader, FHD IR Camera',
      'OS': 'Windows 11 Pro Enterprise OEM'
    },
    specificationsText: 'Intel Core i7 13th Gen, 16GB DDR5, 512GB NVMe SSD, 14" FHD IPS, TPM 2.0, Win 11 Pro',
    budget: 5000000, // ₹50,00,000 (₹50,000/unit)
    currency: 'INR',
    requiredDeliveryDate: '2026-09-02',
    priority: 'High',
    department: 'IT & Digital Engineering',
    requesterName: 'Aditya Verma',
    requesterEmail: 'aditya.verma@vendrax.ai',
    status: 'Approved',
    createdDate: '2026-08-18',
    rawNaturalLanguage: 'We need 100 laptops with i7, 16GB RAM and 512GB SSD under ₹50,000 per unit within 10 days.',
    rfqId: 'rfq-2026-089'
  },
  {
    id: 'pr-2026-102',
    prNumber: 'PR-2026-102',
    title: '500x Enterprise Wi-Fi 7 Access Points',
    product: 'Wi-Fi 7 Enterprise Tri-Band APs',
    quantity: 500,
    unit: 'Units',
    specifications: {
      'Wireless Standard': 'IEEE 802.11be (Wi-Fi 7) Tri-Band',
      'Throughput': 'Up to 9.3 Gbps aggregate throughput',
      'Ethernet Ports': '2x 2.5GbE PoE+ (802.3at)',
      'Management': 'Cloud Managed & Zero-Trust Controller',
      'Warranty': '36 Months Advance Hardware Replacement'
    },
    specificationsText: 'Tri-Band Wi-Fi 7 APs, 2x 2.5GbE PoE+, Cloud Management, 36 Months Warranty',
    budget: 15000000, // ₹1.5 Cr
    currency: 'INR',
    requiredDeliveryDate: '2026-09-15',
    priority: 'High',
    department: 'Network & Cloud Infrastructure',
    requesterName: 'Elena Rostova',
    requesterEmail: 'elena.rostova@vendrax.ai',
    status: 'Converted to RFQ',
    createdDate: '2026-08-14',
    rawNaturalLanguage: 'Need 500 Tri-band Wi-Fi 7 Access points with PoE+ and 3-year warranty for Bangalore campus.',
    rfqId: 'rfq-2026-074'
  },
  {
    id: 'pr-2026-103',
    prNumber: 'PR-2026-103',
    title: '150x Dual-Motor Ergonomic Sit-Stand Desks',
    product: 'Electric Dual-Motor Height Adjustable Desks',
    quantity: 150,
    unit: 'Sets',
    specifications: {
      'Motor': 'Silent Dual Motor (<45 dB)',
      'Load Capacity': '125 kg static & dynamic',
      'Height Range': '62cm to 128cm with 4 memory presets',
      'Tabletop': 'FSC Certified Oak / Birch 150x75cm with anti-collision sensor'
    },
    specificationsText: 'Dual motor, 125kg capacity, 62-128cm height, anti-collision, 5-year motor warranty',
    budget: 6000000, // ₹60 Lakhs
    currency: 'INR',
    requiredDeliveryDate: '2026-09-20',
    priority: 'Medium',
    department: 'Facility & Employee Experience',
    requesterName: 'Marcus Vance',
    requesterEmail: 'marcus.vance@vendrax.ai',
    status: 'Under Review',
    createdDate: '2026-08-19',
    rawNaturalLanguage: 'Need 150 dual motor height adjustable standing desks for new engineering floor by next month.'
  }
];

export const sampleQuotesLaptopRfq: VendorQuote[] = [
  {
    id: 'quote-vendor-c-laptop',
    rfqId: 'rfq-2026-089',
    vendorId: 'v-vendor-c',
    vendorName: 'Vendor C',
    vendorCountry: 'India',
    vendorTier: 'Preferred',
    quoteReference: 'CC-QT-2026-9901',
    submissionDate: '2026-08-20',
    validUntil: '2026-09-20',
    currency: 'INR',
    fileName: 'Vendor_C_Official_Quotation_Laptops.pdf',
    fileSize: '2.4 MB',
    extractionConfidence: 98.6,
    extractedAt: '2026-08-20 14:32',
    rawQuoteText: `VENDOR C (CloudTech & CyberCore Enterprise)\nQuotation Ref: CC-QT-2026-9901\nCustomer: VendraX Enterprise India\nItem: 100x Enterprise Laptops (i7, 16GB DDR5, 512GB NVMe SSD, Win 11 Pro)\nBase Unit Price: ₹49,000 / unit\nBase Subtotal: ₹49,00,000 (₹49L)\nInclusive of 18% GST input credit, Free DDP Destination delivery to Bengaluru Hub.\nZero installation & free on-site imaging.\nWarranty: 3 Years On-Site 24x7 Enterprise Support.\nPayment Terms: Net 45 Days. Delivery Time: 5 Business Days.`,
    lineItems: [
      {
        id: 'li-c-1',
        itemCode: 'LAP-i7-16-512',
        description: 'Enterprise 14" Laptop (i7-1365U, 16GB RAM, 512GB SSD, Win 11 Pro)',
        quantity: 100,
        unit: 'Units',
        unitPrice: 49000,
        totalPrice: 4900000,
        leadTimeDays: 5,
        warrantyMonths: 36
      }
    ],
    basePrice: 4900000, // ₹49L
    taxAmount: 0, // Fully inclusive / credited in DDP
    shippingCost: 0, // Free DDP Destination delivery
    installationCost: 0, // Free enterprise imaging included
    maintenanceCost: 0, // 3-year full enterprise warranty included
    discountAmount: 0,
    quotedTotal: 4900000, // ₹49L
    paymentTerms: 'Net 45 Days',
    paymentDays: 45,
    incoterms: 'DDP',
    deliveryLeadTimeDays: 5, // 5 days
    promisedDeliveryDate: '2026-08-26',
    warrantyPeriodMonths: 36, // 3 years
    warrantyText: '3 Years Comprehensive On-Site 24x7 SLA',
    slaUptimeCommitment: '99.8% Hardware Availability + 4hr On-Site Replacement',
    historicalReliabilityPct: 96, // 96%
    riskLevel: 'LOW',
    trueCost: {
      basePrice: 4900000,
      taxAmount: 0,
      shippingAndLogistics: 0,
      installationCost: 0,
      maintenanceAndSupport: 0,
      discountAmount: 0,
      totalTrueCost: 4900000, // ₹49L
      savingsVsBudget: 100000, // ₹1,00,000 under ₹50L budget
      savingsPercentage: 2.0,
      unitTrueCost: 49000,
      paymentTermCarryCost: -15000, // 45-day credit benefit
      defectAndRiskBuffer: 2000, // <0.2% defect probability
    },
    vendorScore: {
      overallScore: 94, // 94 / 100
      priceScore: 92,
      qualityScore: 98,
      deliveryScore: 97,
      riskScore: 95,
      esgScore: 92,
      strengths: [
        'Optimal True Cost with zero hidden logistics or warranty costs',
        'Industry leading 5-day delivery fulfillment',
        '3 Years Comprehensive On-Site replacement warranty',
        '96% historical reliability with 0.2% defect rate'
      ],
      weaknesses: [
        'Fixed volume pricing with limited further discount on <200 units'
      ]
    },
    anomalies: [],
    aiNotes: 'Vendor C delivers the single best total value: exactly matching ₹49L true landed cost with 5-day delivery and 3-year enterprise warranty.',
    isRecommendedWinner: true
  },
  {
    id: 'quote-vendor-a-laptop',
    rfqId: 'rfq-2026-089',
    vendorId: 'v-vendor-a',
    vendorName: 'Vendor A',
    vendorCountry: 'India',
    vendorTier: 'Preferred',
    quoteReference: 'APX-QT-2026-7811',
    submissionDate: '2026-08-19',
    validUntil: '2026-09-19',
    currency: 'INR',
    fileName: 'Vendor_A_Apex_Laptops_Commercial.pdf',
    fileSize: '1.8 MB',
    extractionConfidence: 97.2,
    extractedAt: '2026-08-19 16:10',
    rawQuoteText: `VENDOR A (Apex Systems Ltd)\nQuotation Ref: APX-QT-2026-7811\nCustomer: VendraX Enterprise India\nItem: 100x Enterprise Laptops (i7, 16GB, 512GB SSD)\nBase Price: ₹48,000 / unit = ₹48,00,000 (₹48L)\nLocal Delivery Freight: ₹1,20,000\nMandatory Pre-deployment Imaging & Setup: ₹80,000\nWarranty: 2 Years Standard Depot Warranty.\nPayment Terms: Net 30 Days. Lead Time: 7 Days.`,
    lineItems: [
      {
        id: 'li-a-1',
        itemCode: 'LAP-i7-16-512',
        description: 'Enterprise 14" Laptop (i7-1365U, 16GB RAM, 512GB SSD)',
        quantity: 100,
        unit: 'Units',
        unitPrice: 48000,
        totalPrice: 4800000,
        leadTimeDays: 7,
        warrantyMonths: 24
      }
    ],
    basePrice: 4800000, // ₹48L
    taxAmount: 0,
    shippingCost: 120000, // + ₹1.2L shipping
    installationCost: 80000, // + ₹0.8L setup
    maintenanceCost: 0,
    discountAmount: 0,
    quotedTotal: 5000000, // ₹50L
    paymentTerms: 'Net 30 Days',
    paymentDays: 30,
    incoterms: 'DAP',
    deliveryLeadTimeDays: 7, // 7 days
    promisedDeliveryDate: '2026-08-28',
    warrantyPeriodMonths: 24, // 2 years
    warrantyText: '2 Years Standard Depot Warranty',
    slaUptimeCommitment: 'Next Business Day Depot Response',
    historicalReliabilityPct: 91, // 91%
    riskLevel: 'LOW',
    trueCost: {
      basePrice: 4800000, // ₹48L
      taxAmount: 0,
      shippingAndLogistics: 120000, // ₹1.2L
      installationCost: 80000, // ₹80k
      maintenanceAndSupport: 0,
      discountAmount: 0,
      totalTrueCost: 5000000, // ₹50L (₹48L + ₹1.2L + ₹0.8L)
      savingsVsBudget: 0,
      savingsPercentage: 0,
      unitTrueCost: 50000,
      paymentTermCarryCost: 0,
      defectAndRiskBuffer: 8000,
    },
    vendorScore: {
      overallScore: 87, // 87 / 100
      priceScore: 88,
      qualityScore: 89,
      deliveryScore: 88,
      riskScore: 90,
      esgScore: 86,
      strengths: [
        'Reputable domestic tier-1 partner',
        '7-day fast delivery window',
        'Reliable 91% on-time track record'
      ],
      weaknesses: [
        '₹2.0L in separate freight and setup fees brings True Cost to ₹50L',
        '2-year depot warranty vs 3-year on-site from Vendor C'
      ]
    },
    anomalies: [
      {
        id: 'anom-a-1',
        severity: 'info',
        category: 'shipping_surcharge',
        title: 'Separate Freight & Setup Line Items',
        description: 'Quote unbundles ₹1.2L freight and ₹80k OS deployment, increasing effective price from ₹48L to ₹50L.',
        impactScore: 3,
        suggestedAction: 'Request bundled all-inclusive DDP pricing at ₹48L flat.'
      }
    ],
    aiNotes: 'Solid alternative from Vendor A; however, unbundled logistics and shorter 2-year warranty make it ₹1L more expensive in True Cost than Vendor C.',
    isRecommendedWinner: false
  },
  {
    id: 'quote-vendor-b-laptop',
    rfqId: 'rfq-2026-089',
    vendorId: 'v-vendor-b',
    vendorName: 'Vendor B',
    vendorCountry: 'Taiwan / India',
    vendorTier: 'Standard',
    quoteReference: 'NX-QT-2026-4402',
    submissionDate: '2026-08-19',
    validUntil: '2026-09-10',
    currency: 'INR',
    fileName: 'Vendor_B_Nexus_Laptops_LowBid.xlsx',
    fileSize: '950 KB',
    extractionConfidence: 94.8,
    extractedAt: '2026-08-19 18:20',
    rawQuoteText: `VENDOR B (Nexus Global Hardware Corp)\nQuotation Ref: NX-QT-2026-4402\nItem: 100x Business Laptops\nBase Unit Price: ₹44,000 / unit = ₹44,00,000 (₹44L)\nIncoterms: FOB Kaohsiung / CIF Port (Freight & customs to be borne by buyer: ~₹4,50,000)\nImport Tariff & Port Clearance: ₹1,50,000\nMandatory Extended Warranty Surcharge (to reach 2 yrs): ₹1,00,000\nPayment Terms: 30% Advance, 70% against B/L (Net 15 Days)\nDelivery Lead Time: 18 Business Days.`,
    lineItems: [
      {
        id: 'li-b-1',
        itemCode: 'LAP-i7-16-512',
        description: 'Business Laptop (i7 equiv, 16GB, 512GB SSD)',
        quantity: 100,
        unit: 'Units',
        unitPrice: 44000,
        totalPrice: 4400000,
        leadTimeDays: 18,
        warrantyMonths: 12
      }
    ],
    basePrice: 4400000, // ₹44L (Sticker Price Trap!)
    taxAmount: 150000, // Import tariff / duties
    shippingCost: 450000, // + ₹4.5L ocean/air freight & port handling
    installationCost: 0,
    maintenanceCost: 100000, // + ₹1.0L warranty equalizer
    discountAmount: 0,
    quotedTotal: 5100000, // ₹51L True Landed Cost!
    paymentTerms: '30% Advance, 70% on BL',
    paymentDays: 15,
    incoterms: 'FOB',
    deliveryLeadTimeDays: 18, // 18 days (Breaches 10-day deadline!)
    promisedDeliveryDate: '2026-09-09',
    warrantyPeriodMonths: 12, // 1 year only
    warrantyText: '1 Year Return-to-Bench Overseas Warranty',
    slaUptimeCommitment: 'Best effort email ticketing',
    historicalReliabilityPct: 74, // 74%
    riskLevel: 'HIGH',
    trueCost: {
      basePrice: 4400000, // ₹44L
      taxAmount: 150000, // + ₹1.5L
      shippingAndLogistics: 450000, // + ₹4.5L
      installationCost: 0,
      maintenanceAndSupport: 100000, // + ₹1.0L
      discountAmount: 0,
      totalTrueCost: 5100000, // ₹51L (₹7L higher than base price!)
      savingsVsBudget: -100000, // Over budget by ₹1L
      savingsPercentage: -2.0,
      unitTrueCost: 51000,
      paymentTermCarryCost: 35000, // Advance payment financing cost
      defectAndRiskBuffer: 45000, // 3.4% defect rate risk
    },
    vendorScore: {
      overallScore: 72, // 72 / 100
      priceScore: 75,
      qualityScore: 70,
      deliveryScore: 62,
      riskScore: 58,
      esgScore: 68,
      strengths: [
        'Lowest nominal sticker price (₹44L base quote)'
      ],
      weaknesses: [
        'FALSE ECONOMY TRAP: ₹7L in hidden freight, customs, and warranty adders pushes True Cost to ₹51L',
        '18-day lead time violates the 10-day mandatory delivery SLA',
        'High commercial risk: 30% upfront cash advance with no bank guarantee',
        'Only 1-year overseas return-to-bench warranty'
      ]
    },
    anomalies: [
      {
        id: 'anom-b-1',
        severity: 'critical',
        category: 'shipping_surcharge',
        title: 'FOB Origin Terms - Hidden Shipping & Duties',
        description: 'Vendor quotes ₹44L under FOB terms, offloading ~₹4.5L in international air/sea freight and ₹1.5L in port clearance to VendraX.',
        impactScore: 8,
        suggestedAction: 'Reject FOB terms or demand full DDP destination quotation.'
      },
      {
        id: 'anom-b-2',
        severity: 'critical',
        category: 'lead_time_risk',
        title: 'Delivery Deadline Violation (18 Days vs 10 Required)',
        description: 'Promised delivery is 18 business days, causing a severe operational delay against project go-live.',
        impactScore: 7,
        suggestedAction: 'Impose liquidated damages clause for delays beyond Day 10.'
      },
      {
        id: 'anom-b-3',
        severity: 'warning',
        category: 'payment_risk',
        title: '30% Upfront Advance Cash Required',
        description: 'Vendor demands 30% advance cash prior to shipment, exposing VendraX to credit and delivery risks.',
        impactScore: 5,
        suggestedAction: 'Negotiate Net 30 or require an Irrevocable Letter of Credit.'
      }
    ],
    aiNotes: 'HIGH RISK FALSE ECONOMY: Vendor B looks ₹5L cheaper on paper, but after adding hidden freight, import duties, and warranty gap, it is actually the most expensive option at ₹51L landed.',
    isRecommendedWinner: false
  }
];

export const initialDecisionBrief: ExplainableDecisionBrief = {
  winnerVendorId: 'v-vendor-c',
  winnerVendorName: 'Vendor C (CloudTech & CyberCore)',
  winnerScore: 94,
  executiveSummary: 'Vendor C is unequivocally recommended as the winning supplier for the 100x Enterprise Laptops RFQ. While Vendor B presented a lower nominal base price (₹44L), automated True Landed Cost modeling reveals Vendor B incurs ₹7.0L in hidden freight, tariffs, and warranty adders, resulting in a ₹51L true cost. In contrast, Vendor C delivers at ₹49L all-inclusive DDP with zero hidden fees, fastest delivery (5 days vs 18 days for Vendor B), a 3-year on-site 24x7 SLA, and a 96% historical reliability score.',
  keySelectionDrivers: [
    {
      driver: 'True Procurement Cost Efficiency',
      impact: '₹49,00,000 flat landed cost (₹2,00,000 cheaper landed than Vendor B; ₹1,00,000 cheaper landed than Vendor A).',
      advantageVsNextBest: 'Neutralizes ₹7L in hidden freight and duties present in Vendor B\'s FOB quote.'
    },
    {
      driver: 'Rapid 5-Day Delivery SLA',
      impact: 'Fulfills urgent project timeline within 5 days (vs 7 days for Vendor A, 18 days for Vendor B).',
      advantageVsNextBest: 'Guarantees on-time project rollout without schedule slip.'
    },
    {
      driver: '3-Year Enterprise On-Site Warranty',
      impact: '36 months comprehensive on-site coverage with 4-hour SLA included free.',
      advantageVsNextBest: 'Vendor A offers 2-year depot only; Vendor B offers 1-year overseas return-to-bench.'
    },
    {
      driver: 'Favorable Net 45 Payment Terms',
      impact: 'Zero upfront advance cash required; 45-day working capital preservation.',
      advantageVsNextBest: 'Avoids 30% advance payment risk demanded by Vendor B.'
    }
  ],
  expectedSavingsINR: 200000, // ₹2.0 Lakhs vs next-best landed cost & ₹1.0L under budget
  expectedSavingsUSD: 2400,
  confidenceScorePct: 98.4,
  riskMitigationPlan: [
    'Confirm automated DDP delivery schedule directly with Bangalore logistics hub.',
    'Enable automated 3-way matching on PO-2026-089-APX upon GRN barcode scan.',
    'Enroll serial numbers into 3-year automated asset management tracking.'
  ],
  negotiationPoints: [
    'Request 2 complimentary spare units or free laptop sleeves for future batch orders.',
    'Lock in ₹49,000 unit price for subsequent 50-unit expansion batch in Q4.'
  ],
  whatIfSensitivityAnalysis: [
    {
      scenario: 'If required delivery date is compressed to 3 business days',
      outcome: 'Vendor C has regional hub stock in Bangalore and can expedite for nominal ₹20k courier fee; Vendors A & B cannot fulfill.'
    },
    {
      scenario: 'If order quantity is expanded to 200 units',
      outcome: 'Vendor C will trigger an additional 3.5% tier discount, dropping unit price to ₹47,285.'
    }
  ]
};

export const initialRFQs: RFQ[] = [
  {
    id: 'rfq-2026-089',
    rfqNumber: 'RFQ-2026-089',
    title: '100x Enterprise Laptops (i7, 16GB, 512GB SSD)',
    department: 'IT & Digital Engineering',
    requesterName: 'Aditya Verma',
    requesterEmail: 'aditya.verma@vendrax.ai',
    category: 'IT Hardware',
    priority: 'high',
    status: 'decision_ready',
    createdAt: '2026-08-18',
    deadlineDate: '2026-08-25',
    targetBudget: 5000000, // ₹50,00,000 (₹50L)
    budgetCurrency: 'INR',
    deliveryLocation: 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
    requiredDeliveryDate: '2026-09-02',
    description: 'Procurement of 100 enterprise laptops with Intel Core i7 13th Gen, 16GB DDR5 RAM, 512GB NVMe SSD, Windows 11 Pro, and 3-year warranty for software engineering teams.',
    items: [
      {
        id: 'rfq-it-1',
        itemCode: 'LAP-i7-16-512',
        name: 'Enterprise 14" Laptop (i7, 16GB, 512GB)',
        category: 'IT Hardware',
        requiredQuantity: 100,
        unit: 'Units',
        targetUnitPrice: 50000,
        technicalSpecs: {
          'Processor': 'Intel Core i7 13th Gen / Ultra 7',
          'Memory': '16GB DDR5 RAM',
          'Storage': '512GB PCIe Gen4 SSD',
          'Display': '14-inch FHD+ IPS (400 nits)',
          'OS': 'Windows 11 Pro Enterprise'
        },
        complianceRequired: ['ISO 9001', 'RoHS Compliant', 'BIS Certified', 'Energy Star 8.0']
      }
    ],
    invitedVendorIds: ['v-vendor-a', 'v-vendor-b', 'v-vendor-c'],
    quotes: sampleQuotesLaptopRfq,
    selectedQuoteId: 'quote-vendor-c-laptop',
    approvalStatus: 'auto_approved',
    approvalRulesMatched: [
      'RULE-01: True Procurement Cost within ₹50,00,000 budget cap (₹49,00,000)',
      'RULE-02: Vendor AI Reliability Score >= 90 (Score: 94)',
      'RULE-03: Zero Critical Anomalies or Contract Clauses Flagged',
      'RULE-04: Delivery SLA matches within required schedule (5 days <= 10 days)'
    ],
    approvalNotes: 'Auto-approved by VendraX Zero-Touch Policy Engine. Vendor C provides optimal True Landed Cost and risk profile.',
    approvedBy: 'VendraX Autonomous Policy Agent (ID: AGT-992)',
    approvedAt: '2026-08-20 14:35',
    poNumber: 'PO-2026-089-VENDRAX'
  },
  {
    id: 'rfq-2026-074',
    rfqNumber: 'RFQ-2026-074',
    title: '500x Enterprise Wi-Fi 7 Access Points',
    department: 'Network & Cloud Infrastructure',
    requesterName: 'Elena Rostova',
    requesterEmail: 'elena.rostova@vendrax.ai',
    category: 'IT Hardware',
    priority: 'urgent',
    status: 'open_for_quotes',
    createdAt: '2026-08-14',
    deadlineDate: '2026-08-28',
    targetBudget: 15000000, // ₹1.5 Cr
    budgetCurrency: 'INR',
    deliveryLocation: 'VendraX Technology Hub, Whitefield, Bengaluru',
    requiredDeliveryDate: '2026-09-15',
    description: 'Enterprise Tri-Band Wi-Fi 7 APs for campus wide network upgrade with 2.5GbE PoE+ ports and centralized cloud controller.',
    items: [
      {
        id: 'rfq-it-2',
        itemCode: 'AP-WIFI7-ENT',
        name: 'Enterprise Wi-Fi 7 Tri-Band AP',
        category: 'IT Hardware',
        requiredQuantity: 500,
        unit: 'Units',
        targetUnitPrice: 30000,
        technicalSpecs: {
          'Radio Standard': 'IEEE 802.11be (Wi-Fi 7)',
          'Antenna': '4x4 MU-MIMO Tri-Band',
          'Ports': '2x 2.5GbE PoE+',
          'Management': 'Zero-Trust Cloud Managed'
        },
        complianceRequired: ['WFA Certified', 'RoHS', 'WPC India Approved']
      }
    ],
    invitedVendorIds: ['v-vendor-a', 'v-vendor-c'],
    quotes: [],
    approvalStatus: 'pending',
    approvalRulesMatched: []
  }
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-2026-089-c',
    poNumber: 'PO-2026-089-VENDRAX',
    rfqId: 'rfq-2026-089',
    rfqTitle: '100x Enterprise Laptops (i7, 16GB, 512GB SSD)',
    vendorId: 'v-vendor-c',
    vendorName: 'Vendor C (CloudTech & CyberCore)',
    issueDate: '2026-08-20',
    deliveryDueDate: '2026-08-26',
    items: 'Enterprise 14" Laptop (i7-1365U, 16GB RAM, 512GB SSD)',
    quantity: 100,
    unitPrice: 49000,
    taxAmount: 0,
    totalAmount: 4900000, // ₹49,00,000
    currency: 'INR',
    status: 'issued',
    paymentTerms: 'Net 45 Days',
    incoterms: 'DDP Destination',
    deliveryAddress: 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
    warrantyTerms: '3 Years Comprehensive On-Site 24x7 SLA',
    trueLandingCostCalculated: 4900000,
    lineItems: [
      {
        id: 'li-po-1',
        itemCode: 'LAP-i7-16-512',
        description: 'Enterprise 14" Laptop (i7-1365U, 16GB RAM, 512GB SSD, Win 11 Pro)',
        quantity: 100,
        unit: 'Units',
        unitPrice: 49000,
        totalPrice: 4900000,
        leadTimeDays: 5,
        warrantyMonths: 36
      }
    ],
    milestones: [
      { title: 'Electronic PO Transmitted via EDI', date: '2026-08-20', completed: true },
      { title: 'Factory Imaging & Packing Dispatch', date: '2026-08-22', completed: false },
      { title: 'Inbound Warehouse Transit Hub', date: '2026-08-24', completed: false },
      { title: 'GRN Barcode Scan & QC Inspection', date: '2026-08-26', completed: false },
    ]
  },
  {
    id: 'po-2026-061-a',
    poNumber: 'PO-2026-061-APX',
    rfqId: 'rfq-2026-061',
    rfqTitle: 'Campus Core Fiber Switching Infrastructure',
    vendorId: 'v-vendor-a',
    vendorName: 'Vendor A (Apex Systems Ltd)',
    issueDate: '2026-08-05',
    deliveryDueDate: '2026-08-16',
    items: '48-Port 100GbE Core Optical Switches',
    quantity: 12,
    unitPrice: 320000,
    taxAmount: 414720,
    totalAmount: 4254720,
    currency: 'INR',
    status: 'completed',
    paymentTerms: 'Net 30 Days',
    incoterms: 'DDP Destination',
    deliveryAddress: 'VendraX Technology Hub, Whitefield, Bengaluru',
    warrantyTerms: '3 Years Next Business Day Replacement',
    trueLandingCostCalculated: 4254720,
    lineItems: [
      {
        id: 'li-po-2',
        itemCode: 'SW-100G-48',
        description: '48-Port 100GbE QSFP28 Enterprise Core Switch',
        quantity: 12,
        unit: 'Units',
        unitPrice: 320000,
        totalPrice: 3840000,
        leadTimeDays: 10,
        warrantyMonths: 36
      }
    ],
    milestones: [
      { title: 'Electronic PO Transmitted', date: '2026-08-05', completed: true },
      { title: 'Factory Dispatch', date: '2026-08-08', completed: true },
      { title: 'Inbound Logistics Received', date: '2026-08-12', completed: true },
      { title: 'GRN Passed & Reconciled', date: '2026-08-15', completed: true },
    ]
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'LAP-i7-16-512',
    name: 'Enterprise 14" Laptop (i7, 16GB, 512GB SSD)',
    category: 'IT Hardware',
    currentStock: 14,
    incomingStock: 100, // From active PO
    reorderLevel: 25,
    safetyStock: 15,
    unit: 'Units',
    unitCost: 49000,
    warehouseLocation: 'Bengaluru Central Hub - Floor 2',
    status: 'low_stock',
    lastReorderDate: '2026-08-20',
    pendingPoQuantity: 100
  },
  {
    id: 'inv-2',
    sku: 'AP-WIFI7-ENT',
    name: 'Enterprise Wi-Fi 7 Access Point',
    category: 'IT Hardware',
    currentStock: 68,
    incomingStock: 500,
    reorderLevel: 50,
    safetyStock: 30,
    unit: 'Units',
    unitCost: 28000,
    warehouseLocation: 'Bengaluru Central Hub - Network Bay',
    status: 'optimal',
    lastReorderDate: '2026-08-14',
    pendingPoQuantity: 500
  },
  {
    id: 'inv-3',
    sku: 'DESK-ERGO-DUAL',
    name: 'Dual-Motor Sit-Stand Ergonomic Desk',
    category: 'Facility & Office',
    currentStock: 8,
    incomingStock: 0,
    reorderLevel: 20,
    safetyStock: 10,
    unit: 'Sets',
    unitCost: 38000,
    warehouseLocation: 'Mumbai Logistics Depot',
    status: 'reorder_required',
    lastReorderDate: '2026-07-10',
    pendingPoQuantity: 0
  },
  {
    id: 'inv-4',
    sku: 'SW-100G-48',
    name: '48-Port 100GbE Core Optical Switch',
    category: 'IT Hardware',
    currentStock: 16,
    incomingStock: 0,
    reorderLevel: 10,
    safetyStock: 5,
    unit: 'Units',
    unitCost: 320000,
    warehouseLocation: 'Bengaluru Central Hub - Data Center Lab',
    status: 'optimal',
    lastReorderDate: '2026-08-05',
    pendingPoQuantity: 0
  }
];

export const initialInventoryMovements: InventoryMovement[] = [
  {
    id: 'mov-1',
    itemId: 'inv-4',
    itemName: '48-Port 100GbE Core Optical Switch',
    sku: 'SW-100G-48',
    date: '2026-08-15 11:20',
    type: 'Inbound Receipt',
    quantity: 12,
    unit: 'Units',
    referencePo: 'PO-2026-061-APX',
    warehouseLocation: 'Bengaluru Central Hub',
    actor: 'Ramesh K. (Warehouse Lead)'
  },
  {
    id: 'mov-2',
    itemId: 'inv-1',
    itemName: 'Enterprise 14" Laptop',
    sku: 'LAP-i7-16-512',
    date: '2026-08-18 14:05',
    type: 'Production Dispatch',
    quantity: -15,
    unit: 'Units',
    warehouseLocation: 'Bengaluru Central Hub',
    actor: 'Pooja M. (IT Assets Admin)'
  },
  {
    id: 'mov-3',
    itemId: 'inv-3',
    itemName: 'Dual-Motor Sit-Stand Desk',
    sku: 'DESK-ERGO-DUAL',
    date: '2026-08-19 09:30',
    type: 'Production Dispatch',
    quantity: -12,
    unit: 'Sets',
    warehouseLocation: 'Mumbai Logistics Depot',
    actor: 'Vikram S. (Facility Ops)'
  }
];

export const initialFinanceRecords: FinanceInvoiceRecord[] = [
  {
    id: 'inv-rec-1',
    invoiceNumber: 'INV-2026-CC-8821',
    poNumber: 'PO-2026-089-VENDRAX',
    poValue: 4900000, // ₹49,00,000
    tax: 0,
    amountPayable: 4900000,
    paidAmount: 0,
    pendingAmount: 4900000,
    vendorName: 'Vendor C (CloudTech & CyberCore)',
    invoiceDate: '2026-08-20',
    dueDate: '2026-10-04',
    status: 'scheduled_payment',
    poMatchedAmount: 4900000,
    grnMatchedQuantity: 100,
    varianceAmount: 0,
    varianceNotes: '3-Way Match Verified: Electronic PO, GRN Barcode Scan, and Tax Invoice match 100% with ₹0.00 variance.',
    capturedSavingsAmount: 200000 // ₹2.0L realized savings
  },
  {
    id: 'inv-rec-2',
    invoiceNumber: 'INV-2026-APX-4419',
    poNumber: 'PO-2026-061-APX',
    poValue: 4254720,
    tax: 414720,
    amountPayable: 4254720,
    paidAmount: 4254720,
    pendingAmount: 0,
    vendorName: 'Vendor A (Apex Systems Ltd)',
    invoiceDate: '2026-08-15',
    dueDate: '2026-09-14',
    status: 'paid',
    poMatchedAmount: 4254720,
    grnMatchedQuantity: 12,
    varianceAmount: 0,
    varianceNotes: 'Full 3-way match verified. Payment cleared via automated RTGS/NEFT batch.',
    capturedSavingsAmount: 180000
  }
];
