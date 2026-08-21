import {
  RFQ,
  VendorProfile,
  PurchaseOrder,
  InventoryItem,
  InventoryMovement,
  FinanceInvoiceRecord,
  PurchaseRequest,
  VendorQuote
} from '../types/backendTypes';

class VendraxDatabase {
  private purchaseRequests: Map<string, PurchaseRequest> = new Map();
  private rfqs: Map<string, RFQ> = new Map();
  private vendors: Map<string, VendorProfile> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private inventoryMovements: InventoryMovement[] = [];
  private financeInvoices: Map<string, FinanceInvoiceRecord> = new Map();

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Vendors
    const vendorsList: VendorProfile[] = [
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
        totalSpendYTD: 24500000,
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
        rating: 4.2,
        tier: 'Certified',
        reliabilityScore: 88,
        historicalOnTimeDeliveryPct: 91.0,
        historicalDefectRatePct: 1.1,
        qualityScore: 90,
        averagePriceTier: 'Budget',
        totalSpendYTD: 14200000,
        completedOrdersCount: 42,
        riskLevel: 'LOW',
        certifications: ['ISO 9001:2015', 'BIS Certified'],
        contactName: 'Vikram Mehta',
        contactEmail: 'v.mehta@apexsystems.co.in',
        contactPhone: '+91 22 6788 1234',
        paymentTermsStandard: 'Net 30 Days',
        tags: ['Standard Partner', 'Fast Response'],
        performanceHistory: [
          { period: 'Q1 2026', onTimePct: 92.0, qualityPct: 91.0, spendAmount: 3800000 },
          { period: 'Q4 2025', onTimePct: 89.5, qualityPct: 89.0, spendAmount: 4500000 },
        ]
      },
      {
        id: 'v-vendor-b',
        name: 'Vendor B (Nexus Global Hardware)',
        legalEntity: 'Nexus Global Logistics & Technology Trading Pte Ltd',
        category: ['IT Hardware', 'Component Distribution'],
        country: 'Singapore',
        headquarters: 'Jurong East, Singapore / Shenzhen',
        rating: 3.4,
        tier: 'Under Review',
        reliabilityScore: 71,
        historicalOnTimeDeliveryPct: 78.4,
        historicalDefectRatePct: 3.8,
        qualityScore: 78,
        averagePriceTier: 'Budget',
        totalSpendYTD: 5800000,
        completedOrdersCount: 14,
        riskLevel: 'HIGH',
        certifications: ['CE Mark'],
        contactName: 'David Chen',
        contactEmail: 'david.c@nexusglobal-trade.sg',
        contactPhone: '+65 6744 9921',
        paymentTermsStandard: '30% Advance, 70% Against BL',
        tags: ['High Risk', 'Hidden FOB Freight', 'Advance Payment Demand'],
        performanceHistory: [
          { period: 'Q1 2026', onTimePct: 76.0, qualityPct: 77.0, spendAmount: 1800000 },
          { period: 'Q4 2025', onTimePct: 80.0, qualityPct: 79.0, spendAmount: 2200000 },
        ]
      },
      {
        id: 'v-vendor-d',
        name: 'Vendor D (Datacenter Pulse)',
        legalEntity: 'Datacenter Pulse Infotech LLC',
        category: ['Servers & Storage', 'Networking'],
        country: 'India',
        headquarters: 'Hyderabad, Telangana',
        rating: 4.6,
        tier: 'Preferred',
        reliabilityScore: 93,
        historicalOnTimeDeliveryPct: 94.5,
        historicalDefectRatePct: 0.5,
        qualityScore: 94,
        averagePriceTier: 'Premium',
        totalSpendYTD: 18900000,
        completedOrdersCount: 37,
        riskLevel: 'LOW',
        certifications: ['ISO 9001', 'ISO 27001', 'Cisco Gold Certified'],
        contactName: 'Ananya Reddy',
        contactEmail: 'a.reddy@dcpulse.in',
        contactPhone: '+91 40 2311 4455',
        paymentTermsStandard: 'Net 60 Days',
        tags: ['Data Center Specialist', 'Zero Defect'],
        performanceHistory: [
          { period: 'Q1 2026', onTimePct: 95.0, qualityPct: 94.0, spendAmount: 5100000 },
        ]
      }
    ];

    vendorsList.forEach((v) => this.vendors.set(v.id, v));

    // 2. Seed Sample Quotes for Laptop RFQ
    const sampleQuotes: VendorQuote[] = [
      {
        id: 'q-vendor-c',
        rfqId: 'rfq-2026-089',
        vendorId: 'v-vendor-c',
        vendorName: 'Vendor C (CloudTech & CyberCore)',
        vendorCountry: 'India',
        vendorTier: 'Preferred',
        quoteReference: 'CTC-2026-QT-9912',
        submissionDate: '2026-08-20',
        validUntil: '2026-09-30',
        currency: 'INR',
        fileName: 'CloudTech_VendorC_FormalQuotation_Aug2026.pdf',
        fileSize: '1.8 MB',
        rawQuoteText: 'Official quotation for 100x Enterprise Laptops i7 16GB 512GB SSD. Unit price: ₹48,000 all inclusive of 3-yr on-site SLA, DDP Bengaluru freight and insurance. Payment terms: Net 45 days. 5 days delivery.',
        extractionConfidence: 99.4,
        extractedAt: '2026-08-20 14:15',
        lineItems: [
          {
            id: 'li-c-1',
            itemCode: 'LAP-i7-16-512',
            description: 'Enterprise Laptops i7 13th Gen, 16GB DDR5, 512GB NVMe SSD, Win 11 Pro',
            quantity: 100,
            unit: 'Units',
            unitPrice: 48000,
            totalPrice: 4800000,
            leadTimeDays: 5,
            warrantyMonths: 36,
          }
        ],
        basePrice: 4800000,
        taxAmount: 864000, // 18% GST
        shippingCost: 0,   // DDP Delivered Duty Paid
        installationCost: 0, // Free Enterprise OS Imaging
        maintenanceCost: 0,  // Included 3-Year On-Site SLA
        discountAmount: 764000, // Strategic Volume Rebate
        quotedTotal: 4900000, // Total Landed cost ₹49,00,000
        paymentTerms: 'Net 45 Days',
        paymentDays: 45,
        incoterms: 'DDP',
        deliveryLeadTimeDays: 5,
        promisedDeliveryDate: '2026-08-27',
        warrantyPeriodMonths: 36,
        warrantyText: '3 Years On-Site 24x7 Enterprise SLA + Zero Dead-Pixel Guarantee',
        slaUptimeCommitment: '99.9% Hardware Availability & 4-Hour Onsite Replacement',
        historicalReliabilityPct: 96.2,
        riskLevel: 'LOW',
        trueCost: {
          basePrice: 4800000,
          taxAmount: 864000,
          shippingAndLogistics: 0,
          installationCost: 0,
          maintenanceAndSupport: 0,
          discountAmount: 764000,
          totalTrueCost: 4900000,
          savingsVsBudget: 100000,
          savingsPercentage: 2.0,
          unitTrueCost: 49000,
          paymentTermCarryCost: -45000,
          defectAndRiskBuffer: 10000,
          riskAdjustedCost: 4865000
        },
        vendorScore: {
          overallScore: 94.2,
          priceScore: 92.5,
          qualityScore: 96.0,
          deliveryScore: 97.0,
          reliabilityScore: 96.0,
          warrantyScore: 98.0,
          paymentTermsScore: 90.0,
          rank: 1,
          strengths: [
            'True Landed Cost is lowest (₹49L all-inclusive, saving ₹1L vs budget)',
            'Fastest lead time: 5 days vs 10 days requirement',
            'Full 3-Year On-Site SLA with zero additional maintenance charge',
            'Favorable Net 45 payment terms and DDP delivered terms'
          ],
          weaknesses: [
            'Requires advance purchase requisition approval for expedited batch run'
          ]
        },
        anomalies: [],
        aiNotes: 'Optimal selection. Lowest True Cost, highest SLA uptime, and zero hidden logistics charges.',
        isRecommendedWinner: true,
      },
      {
        id: 'q-vendor-a',
        rfqId: 'rfq-2026-089',
        vendorId: 'v-vendor-a',
        vendorName: 'Vendor A (Apex Systems Ltd)',
        vendorCountry: 'India',
        vendorTier: 'Certified',
        quoteReference: 'APX-QT-2026-8841',
        submissionDate: '2026-08-20',
        validUntil: '2026-09-25',
        currency: 'INR',
        fileName: 'ApexSystems_RFQ_Quotation_Laptops.pdf',
        fileSize: '1.2 MB',
        rawQuoteText: 'Quotation for 100x Enterprise Laptops i7. Unit price ₹45,000 + 18% GST + Standard freight ₹50,000. 1-year warranty standard. 2-year extended warranty optional at ₹3,00,000.',
        extractionConfidence: 98.0,
        extractedAt: '2026-08-20 11:30',
        lineItems: [
          {
            id: 'li-a-1',
            itemCode: 'LAP-i7-16-512',
            description: 'Core i7 13th Gen, 16GB, 512GB NVMe SSD Laptops',
            quantity: 100,
            unit: 'Units',
            unitPrice: 45000,
            totalPrice: 4500000,
            leadTimeDays: 8,
            warrantyMonths: 12,
          }
        ],
        basePrice: 4500000,
        taxAmount: 810000,
        shippingCost: 50000,
        installationCost: 40000,
        maintenanceCost: 300000, // Extra for 36mo warranty parity
        discountAmount: 0,
        quotedTotal: 5360000,
        paymentTerms: 'Net 30 Days',
        paymentDays: 30,
        incoterms: 'DAP',
        deliveryLeadTimeDays: 8,
        promisedDeliveryDate: '2026-08-30',
        warrantyPeriodMonths: 12,
        warrantyText: '1 Year Standard Carry-In Warranty (Extended SLA +₹3L)',
        slaUptimeCommitment: 'Standard depot repair (5-7 business days)',
        historicalReliabilityPct: 91.0,
        riskLevel: 'LOW',
        trueCost: {
          basePrice: 4500000,
          taxAmount: 810000,
          shippingAndLogistics: 50000,
          installationCost: 40000,
          maintenanceAndSupport: 300000,
          discountAmount: 0,
          totalTrueCost: 5700000,
          savingsVsBudget: -700000,
          savingsPercentage: -14.0,
          unitTrueCost: 57000,
          paymentTermCarryCost: -15000,
          defectAndRiskBuffer: 60000,
          riskAdjustedCost: 5745000
        },
        vendorScore: {
          overallScore: 81.5,
          priceScore: 84.0,
          qualityScore: 86.0,
          deliveryScore: 82.0,
          reliabilityScore: 88.0,
          warrantyScore: 65.0,
          paymentTermsScore: 80.0,
          rank: 2,
          strengths: [
            'Low upfront base price (₹45,000 per unit sticker price)',
            'Reputable domestic tier-2 supplier with good track record'
          ],
          weaknesses: [
            'True Cost is ₹57L (₹7L over budget) once 3-yr warranty parity, freight and setup are factored',
            'Only 1-year standard warranty vs 3-year requirement'
          ]
        },
        anomalies: [
          {
            id: 'anom-a-1',
            severity: 'warning',
            category: 'clause_ambiguity',
            title: 'Warranty Period Mismatch',
            description: 'Quoted 12-month carry-in warranty instead of the mandated 36-month on-site requirement.',
            impactScore: 4.5,
            suggestedAction: 'Require vendor to include 36-month on-site coverage in base price.'
          }
        ],
        aiNotes: 'Initial base quote appears cheap (₹45,000), but true cost escalates to ₹57,00,000 due to omitted warranty extension and freight.',
        isRecommendedWinner: false,
      },
      {
        id: 'q-vendor-b',
        rfqId: 'rfq-2026-089',
        vendorId: 'v-vendor-b',
        vendorName: 'Vendor B (Nexus Global Hardware)',
        vendorCountry: 'Singapore',
        vendorTier: 'Under Review',
        quoteReference: 'NX-SG-99402',
        submissionDate: '2026-08-20',
        validUntil: '2026-09-15',
        currency: 'INR',
        fileName: 'NexusGlobal_B2B_Laptop_Export_Quotation.pdf',
        fileSize: '950 KB',
        rawQuoteText: 'Export quote for 100x units Core i7 Laptops. FOB Shenzhen. Unit price ₹40,000. 30% advance payment required. Ocean/Air freight & Customs clearance customer responsibility. Delivery: 22 days.',
        extractionConfidence: 94.2,
        extractedAt: '2026-08-20 09:45',
        lineItems: [
          {
            id: 'li-b-1',
            itemCode: 'LAP-i7-16-512',
            description: 'Core i7 OEM Laptops (FOB Shenzhen Port)',
            quantity: 100,
            unit: 'Units',
            unitPrice: 40000,
            totalPrice: 4000000,
            leadTimeDays: 22,
            warrantyMonths: 12,
          }
        ],
        basePrice: 4000000,
        taxAmount: 720000, // 18% GST
        shippingCost: 480000, // FOB Air Freight & Port Forwarding
        installationCost: 120000, // Customs handling & clearance
        maintenanceCost: 400000, // Overseas warranty support cost
        discountAmount: 0,
        quotedTotal: 5720000,
        paymentTerms: '30% Advance, 70% on BL Copy',
        paymentDays: 0,
        incoterms: 'FOB',
        deliveryLeadTimeDays: 22,
        promisedDeliveryDate: '2026-09-12',
        warrantyPeriodMonths: 12,
        warrantyText: '12 Months Factory Parts Replacement (Return to Shenzhen)',
        slaUptimeCommitment: 'No local on-site SLA commitment',
        historicalReliabilityPct: 78.4,
        riskLevel: 'HIGH',
        trueCost: {
          basePrice: 4000000,
          taxAmount: 720000,
          shippingAndLogistics: 480000,
          installationCost: 120000,
          maintenanceAndSupport: 400000,
          discountAmount: 0,
          totalTrueCost: 5720000,
          savingsVsBudget: -720000,
          savingsPercentage: -14.4,
          unitTrueCost: 57200,
          paymentTermCarryCost: 90000,
          defectAndRiskBuffer: 250000,
          riskAdjustedCost: 6060000
        },
        vendorScore: {
          overallScore: 61.8,
          priceScore: 88.0,
          qualityScore: 72.0,
          deliveryScore: 48.0,
          reliabilityScore: 60.0,
          warrantyScore: 50.0,
          paymentTermsScore: 30.0,
          rank: 3,
          strengths: [
            'Lowest baseline sticker price (₹40,000 per unit)'
          ],
          weaknesses: [
            'Extreme hidden costs: FOB terms shift ₹4.8L freight + ₹1.2L port clearance onto buyer',
            'Unfavorable payment terms: 30% upfront capital advance risk',
            '22-day delivery exceeds the 10-day requirement by 12 days',
            'High defect risk (historical 3.8% defect rate) and overseas warranty return friction'
          ]
        },
        anomalies: [
          {
            id: 'anom-b-1',
            severity: 'critical',
            category: 'shipping_surcharge',
            title: 'FOB Incoterm Hidden Logistics Burden',
            description: 'Quotation is FOB Shenzhen. Enterprise absorbs all international air/ocean freight, marine insurance, and customs clearance charges (+₹4,80,000).',
            impactScore: 9.0,
            suggestedAction: 'Reject FOB or insist on DDP Bengaluru Delivered Terms.'
          },
          {
            id: 'anom-b-2',
            severity: 'critical',
            category: 'payment_risk',
            title: 'Unfavorable 30% Advance Payment Demand',
            description: 'Vendor requires 30% uncollateralized upfront advance, carrying high treasury risk.',
            impactScore: 8.5,
            suggestedAction: 'Require Net 30 or Bank Guarantee against advance.'
          },
          {
            id: 'anom-b-3',
            severity: 'warning',
            category: 'lead_time_risk',
            title: 'Severe Delivery Timeline Breach',
            description: 'Promised 22 days delivery violates the strict 10-day procurement deadline.',
            impactScore: 7.0,
            suggestedAction: 'Disqualify on timeline non-compliance.'
          }
        ],
        aiNotes: 'High Risk / Bait-and-Switch Pricing: ₹40L sticker price is deceptive. Real landed cost is ₹57.2L with high treasury risk and 22-day delay.',
        isRecommendedWinner: false,
      }
    ];

    // 3. Seed RFQs
    const initialRFQs: RFQ[] = [
      {
        id: 'rfq-2026-089',
        rfqNumber: 'RFQ-2026-089',
        title: '100x Enterprise High-Performance Laptops (Core i7 / 16GB / 512GB SSD)',
        department: 'IT & Digital Engineering',
        requesterName: 'Aditya Sen',
        requesterEmail: 'aditya.sen@vendrax.internal',
        category: 'IT Hardware',
        priority: 'urgent',
        status: 'decision_ready',
        createdAt: '2026-08-18',
        deadlineDate: '2026-08-25',
        targetBudget: 5000000, // ₹50,00,000 (₹50 Lakhs)
        budgetCurrency: 'INR',
        deliveryLocation: 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
        requiredDeliveryDate: '2026-09-02',
        description: 'Urgent procurement of 100 enterprise laptops for the new AI Engineering cohort. Mandatory requirements: Intel Core i7 13th Gen, 16GB DDR5, 512GB NVMe SSD, 14" FHD IPS display, TPM 2.0, Windows 11 Pro, and 3-Year On-Site OEM SLA.',
        items: [
          {
            id: 'item-101',
            itemCode: 'LAP-i7-16-512',
            name: 'Enterprise Laptop Core i7 13th Gen',
            category: 'IT Hardware',
            requiredQuantity: 100,
            unit: 'Units',
            targetUnitPrice: 50000,
            technicalSpecs: {
              'Processor': 'Intel Core i7-13700H (14-Core, up to 5.0 GHz)',
              'Memory': '16GB DDR5-5200MHz',
              'Storage': '512GB M.2 PCIe 4.0 NVMe SSD',
              'Display': '14.0-inch FHD+ (1920x1200) Anti-Glare 400 nits',
              'Security': 'Hardware TPM 2.0 & Fingerprint Reader',
              'OS': 'Windows 11 Pro 64-bit National OEM License'
            },
            complianceRequired: ['ISO 9001:2015', 'RoHS Compliant', 'BIS Certified', 'Energy Star 8.0']
          }
        ],
        invitedVendorIds: ['v-vendor-c', 'v-vendor-a', 'v-vendor-b'],
        quotes: sampleQuotes,
        selectedQuoteId: 'q-vendor-c',
        approvalStatus: 'pending',
        approvalRulesMatched: ['Tier 1 Policy: < ₹50L + Low Risk + Score > 90 qualifies for Zero-Touch Auto Approval']
      },
      {
        id: 'rfq-2026-092',
        rfqNumber: 'RFQ-2026-092',
        title: '500x Enterprise Wi-Fi 7 Tri-Band Access Points',
        department: 'Corporate Infrastructure',
        requesterName: 'Sneha Roy',
        requesterEmail: 'sneha.roy@vendrax.internal',
        category: 'IT Hardware',
        priority: 'high',
        status: 'open_for_quotes',
        createdAt: '2026-08-19',
        deadlineDate: '2026-08-28',
        targetBudget: 15000000, // ₹1.5 Cr
        budgetCurrency: 'INR',
        deliveryLocation: 'VendraX Campus 2, Electronics City, Bengaluru',
        requiredDeliveryDate: '2026-09-15',
        description: 'Tri-band Wi-Fi 7 PoE+ Access Points with cloud management licensing for 3 years.',
        items: [
          {
            id: 'item-201',
            itemCode: 'AP-WIFI7-POE',
            name: 'Wi-Fi 7 Enterprise Access Point',
            category: 'Networking',
            requiredQuantity: 500,
            unit: 'Units',
            targetUnitPrice: 30000,
            technicalSpecs: {
              'Standard': 'IEEE 802.11be (Wi-Fi 7)',
              'Throughput': '9.3 Gbps aggregate',
              'Power': '802.3at PoE+',
              'Cloud Management': '3-Year License included'
            },
            complianceRequired: ['WPA3 Enterprise', 'FCC/CE', 'TEC India Approved']
          }
        ],
        invitedVendorIds: ['v-vendor-c', 'v-vendor-a', 'v-vendor-d'],
        quotes: [],
        approvalStatus: 'pending',
        approvalRulesMatched: []
      }
    ];

    initialRFQs.forEach((r) => this.rfqs.set(r.id, r));

    // 4. Seed Purchase Requests
    const initialPRs: PurchaseRequest[] = [
      {
        id: 'pr-2026-001',
        prNumber: 'PR-2026-1044',
        title: '100x Enterprise Laptops for AI Engineering Cohort',
        product: 'Enterprise High-Performance Laptops',
        quantity: 100,
        unit: 'Units',
        specifications: {
          'Processor': 'Intel Core i7 13th Gen',
          'Memory': '16GB DDR5',
          'Storage': '512GB SSD NVMe',
          'Display': '14-inch FHD IPS',
          'Warranty': '3-Year On-Site SLA'
        },
        specificationsText: 'Intel Core i7 13th Gen, 16GB DDR5, 512GB NVMe SSD, 14" FHD IPS, TPM 2.0, Windows 11 Pro, 3-Yr Onsite Warranty',
        budget: 5000000,
        currency: 'INR',
        requiredDeliveryDate: '2026-09-02',
        priority: 'Urgent',
        department: 'IT & Digital Engineering',
        requesterName: 'Aditya Sen',
        requesterEmail: 'aditya.sen@vendrax.internal',
        status: 'Converted to RFQ',
        createdDate: '2026-08-18',
        rawNaturalLanguage: 'We need 100 laptops with i7, 16GB RAM and 512GB SSD under ₹50,000 per unit within 10 days.',
        rfqId: 'rfq-2026-089'
      },
      {
        id: 'pr-2026-002',
        prNumber: 'PR-2026-1045',
        title: '500x Wi-Fi 7 Enterprise Access Points for Campus Expansion',
        product: 'Tri-Band Wi-Fi 7 PoE+ Access Points',
        quantity: 500,
        unit: 'Units',
        specifications: {
          'Standard': 'Wi-Fi 7 (802.11be)',
          'Port': '2.5GbE PoE+',
          'Management': 'Cloud Managed 3-Yr'
        },
        specificationsText: 'Tri-band Wi-Fi 7, 2.5GbE PoE+, 3-year cloud controller license, wall/ceiling mount brackets included',
        budget: 15000000,
        currency: 'INR',
        requiredDeliveryDate: '2026-09-15',
        priority: 'High',
        department: 'Corporate Infrastructure',
        requesterName: 'Sneha Roy',
        requesterEmail: 'sneha.roy@vendrax.internal',
        status: 'Converted to RFQ',
        createdDate: '2026-08-19',
        rawNaturalLanguage: 'Procure 500 enterprise Tri-Band Wi-Fi 7 access points with 2.5GbE PoE+ and 36-month warranty under ₹30,000 per unit for Bangalore campus by Sept 15.',
        rfqId: 'rfq-2026-092'
      },
      {
        id: 'pr-2026-003',
        prNumber: 'PR-2026-1046',
        title: '150x Dual-Motor Ergonomic Sit-Stand Desks',
        product: 'Electric Height-Adjustable Workstations',
        quantity: 150,
        unit: 'Units',
        specifications: {
          'Mechanism': 'Dual Motor Electric',
          'Range': '65cm to 125cm',
          'Top': 'Solid engineered wood 140x70cm'
        },
        specificationsText: 'Dual-motor electric sit-stand desks with anti-collision sensors, digital keypad memory presets, cable spine management, 5-year frame warranty',
        budget: 6000000,
        currency: 'INR',
        requiredDeliveryDate: '2026-09-20',
        priority: 'Medium',
        department: 'Facility & Workplace Experience',
        requesterName: 'Vikram Deshmukh',
        requesterEmail: 'vikram.d@vendrax.internal',
        status: 'Under Review',
        createdDate: '2026-08-20',
        rawNaturalLanguage: 'Requesting 150 dual-motor electric sit-stand desks with anti-collision sensors, max budget ₹40,000 each, delivery in 3 weeks.'
      }
    ];

    initialPRs.forEach((pr) => this.purchaseRequests.set(pr.id, pr));

    // 5. Seed Purchase Orders
    const initialPOs: PurchaseOrder[] = [
      {
        id: 'po-2026-7841',
        poNumber: 'PO-2026-7841-VENDRAX',
        rfqId: 'rfq-2026-074',
        rfqTitle: '200x 4K UHD 27-inch Developer Monitors',
        vendorId: 'v-vendor-c',
        vendorName: 'Vendor C (CloudTech & CyberCore)',
        issueDate: '2026-08-10',
        deliveryDueDate: '2026-08-25',
        items: '27-inch 4K UHD IPS USB-C 90W PD Monitors',
        quantity: 200,
        unitPrice: 28500,
        taxAmount: 1026000,
        totalAmount: 6726000,
        currency: 'INR',
        status: 'in_transit',
        paymentTerms: 'Net 45 Days',
        incoterms: 'DDP Bengaluru Destination',
        deliveryAddress: 'VendraX Central Warehouse, Whitefield Hub, Bengaluru 560066',
        warrantyTerms: '3-Year Zero Bright Dot On-Site Replacement',
        trueLandingCostCalculated: 6726000,
        lineItems: [
          {
            id: 'po-li-1',
            itemCode: 'MON-4K-27-USBC',
            description: '27" 4K IPS USB-C 90W Power Delivery Monitor',
            quantity: 200,
            unit: 'Units',
            unitPrice: 28500,
            totalPrice: 5700000,
            leadTimeDays: 7,
            warrantyMonths: 36
          }
        ],
        milestones: [
          { title: 'Electronic PO Transmitted via EDI', date: '2026-08-10', completed: true },
          { title: 'Factory Imaging & Packing Dispatch', date: '2026-08-14', completed: true },
          { title: 'Inbound Warehouse Transit Hub', date: '2026-08-19', completed: true },
          { title: 'GRN Barcode Scan & QC Inspection', date: '2026-08-25', completed: false },
        ]
      }
    ];

    initialPOs.forEach((po) => this.purchaseOrders.set(po.id, po));

    // 6. Seed Inventory
    const initialInventoryItems: InventoryItem[] = [
      {
        id: 'inv-101',
        sku: 'LAP-i7-16-512',
        name: 'Enterprise Laptop Core i7 16GB/512GB',
        category: 'IT Hardware',
        currentStock: 14,
        incomingStock: 0,
        reorderLevel: 25,
        safetyStock: 10,
        unit: 'Units',
        unitCost: 48000,
        warehouseLocation: 'Bay 4A - Secure IT Cage',
        status: 'reorder_required',
        lastReorderDate: '2026-06-12',
        pendingPoQuantity: 0,
      },
      {
        id: 'inv-102',
        sku: 'MON-4K-27-USBC',
        name: '27" 4K UHD Developer Monitor (USB-C 90W)',
        category: 'IT Hardware',
        currentStock: 48,
        incomingStock: 200,
        reorderLevel: 30,
        safetyStock: 15,
        unit: 'Units',
        unitCost: 28500,
        warehouseLocation: 'Bay 2C - Peripherals Rack',
        status: 'optimal',
        lastReorderDate: '2026-08-10',
        pendingPoQuantity: 200,
      },
      {
        id: 'inv-103',
        sku: 'AP-WIFI7-POE',
        name: 'Wi-Fi 7 Enterprise Tri-Band Access Point',
        category: 'Networking',
        currentStock: 8,
        incomingStock: 0,
        reorderLevel: 50,
        safetyStock: 20,
        unit: 'Units',
        unitCost: 30000,
        warehouseLocation: 'Bay 1D - Network Hardware',
        status: 'low_stock',
        lastReorderDate: '2026-05-04',
        pendingPoQuantity: 0,
      },
      {
        id: 'inv-104',
        sku: 'DESK-ELEC-SITSTAND',
        name: 'Dual-Motor Electric Ergonomic Desk 140x70',
        category: 'Facility & Office',
        currentStock: 35,
        incomingStock: 0,
        reorderLevel: 40,
        safetyStock: 15,
        unit: 'Units',
        unitCost: 36000,
        warehouseLocation: 'Warehouse East - Furniture Staging',
        status: 'low_stock',
        lastReorderDate: '2026-07-01',
        pendingPoQuantity: 0,
      }
    ];

    initialInventoryItems.forEach((item) => this.inventory.set(item.id, item));

    // 7. Seed Inventory Movements
    this.inventoryMovements = [
      {
        id: 'mov-001',
        itemId: 'inv-102',
        itemName: '27" 4K UHD Developer Monitor',
        sku: 'MON-4K-27-USBC',
        date: '2026-08-15 10:20',
        type: 'Inbound Receipt',
        quantity: 50,
        unit: 'Units',
        referencePo: 'PO-2026-7841-VENDRAX',
        warehouseLocation: 'Bay 2C - Whitefield Hub',
        actor: 'Suresh Kumar (Warehouse Incharge)'
      },
      {
        id: 'mov-002',
        itemId: 'inv-101',
        itemName: 'Enterprise Laptop Core i7',
        sku: 'LAP-i7-16-512',
        date: '2026-08-17 14:00',
        type: 'Production Dispatch',
        quantity: 12,
        unit: 'Units',
        warehouseLocation: 'Bay 4A',
        actor: 'Aditya Sen (IT Admin)'
      }
    ];

    // 8. Seed Finance Invoices
    const initialInvoices: FinanceInvoiceRecord[] = [
      {
        id: 'fin-inv-001',
        invoiceNumber: 'INV-CTC-88912',
        poNumber: 'PO-2026-7841-VENDRAX',
        poValue: 5700000,
        tax: 1026000,
        amountPayable: 6726000,
        paidAmount: 0,
        pendingAmount: 6726000,
        vendorName: 'Vendor C (CloudTech & CyberCore)',
        invoiceDate: '2026-08-12',
        dueDate: '2026-09-26',
        status: 'matched_3way',
        poMatchedAmount: 6726000,
        grnMatchedQuantity: 200,
        varianceAmount: 0,
        capturedSavingsAmount: 480000
      }
    ];

    initialInvoices.forEach((inv) => this.financeInvoices.set(inv.id, inv));
  }

  // --- Purchase Requests ---
  public getPurchaseRequests(): PurchaseRequest[] {
    return Array.from(this.purchaseRequests.values()).sort(
      (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );
  }

  public getPurchaseRequestById(id: string): PurchaseRequest | undefined {
    return this.purchaseRequests.get(id);
  }

  public createPurchaseRequest(pr: PurchaseRequest): PurchaseRequest {
    this.purchaseRequests.set(pr.id, pr);
    return pr;
  }

  public updatePurchaseRequest(id: string, updates: Partial<PurchaseRequest>): PurchaseRequest | undefined {
    const existing = this.purchaseRequests.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.purchaseRequests.set(id, updated);
    return updated;
  }

  // --- RFQs ---
  public getRfqs(): RFQ[] {
    return Array.from(this.rfqs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getRfqById(id: string): RFQ | undefined {
    return this.rfqs.get(id);
  }

  public createRfq(rfq: RFQ): RFQ {
    this.rfqs.set(rfq.id, rfq);
    return rfq;
  }

  public updateRfq(id: string, updates: Partial<RFQ>): RFQ | undefined {
    const existing = this.rfqs.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.rfqs.set(id, updated);
    return updated;
  }

  public addQuoteToRfq(rfqId: string, quote: VendorQuote): RFQ | undefined {
    const rfq = this.rfqs.get(rfqId);
    if (!rfq) return undefined;
    const existingIndex = rfq.quotes.findIndex((q) => q.id === quote.id);
    let updatedQuotes = [...rfq.quotes];
    if (existingIndex >= 0) {
      updatedQuotes[existingIndex] = quote;
    } else {
      updatedQuotes.push(quote);
    }
    rfq.quotes = updatedQuotes;
    rfq.status = 'decision_ready';
    this.rfqs.set(rfqId, rfq);
    return rfq;
  }

  // --- Vendors ---
  public getVendors(): VendorProfile[] {
    return Array.from(this.vendors.values());
  }

  public getVendorById(id: string): VendorProfile | undefined {
    return this.vendors.get(id);
  }

  public createVendor(vendor: VendorProfile): VendorProfile {
    this.vendors.set(vendor.id, vendor);
    return vendor;
  }

  public updateVendor(id: string, updates: Partial<VendorProfile>): VendorProfile | undefined {
    const existing = this.vendors.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.vendors.set(id, updated);
    return updated;
  }

  // --- Purchase Orders ---
  public getPurchaseOrders(): PurchaseOrder[] {
    return Array.from(this.purchaseOrders.values()).sort(
      (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
    );
  }

  public getPurchaseOrderById(id: string): PurchaseOrder | undefined {
    return this.purchaseOrders.get(id);
  }

  public createPurchaseOrder(po: PurchaseOrder): PurchaseOrder {
    this.purchaseOrders.set(po.id, po);
    return po;
  }

  public updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | undefined {
    const existing = this.purchaseOrders.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.purchaseOrders.set(id, updated);
    return updated;
  }

  // --- Inventory ---
  public getInventory(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }

  public getInventoryItemById(id: string): InventoryItem | undefined {
    return this.inventory.get(id);
  }

  public getInventoryItemBySku(sku: string): InventoryItem | undefined {
    return Array.from(this.inventory.values()).find((item) => item.sku === sku);
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | undefined {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.inventory.set(id, updated);
    return updated;
  }

  public addInventoryMovement(movement: InventoryMovement): void {
    this.inventoryMovements.unshift(movement);
  }

  public getInventoryMovements(): InventoryMovement[] {
    return this.inventoryMovements;
  }

  // --- Finance Invoices ---
  public getFinanceInvoices(): FinanceInvoiceRecord[] {
    return Array.from(this.financeInvoices.values()).sort(
      (a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
    );
  }

  public getFinanceInvoiceById(id: string): FinanceInvoiceRecord | undefined {
    return this.financeInvoices.get(id);
  }

  public createFinanceInvoice(inv: FinanceInvoiceRecord): FinanceInvoiceRecord {
    this.financeInvoices.set(inv.id, inv);
    return inv;
  }

  public updateFinanceInvoice(id: string, updates: Partial<FinanceInvoiceRecord>): FinanceInvoiceRecord | undefined {
    const existing = this.financeInvoices.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.financeInvoices.set(id, updated);
    return updated;
  }
}

export const db = new VendraxDatabase();
