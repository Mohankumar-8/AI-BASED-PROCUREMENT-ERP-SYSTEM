import { Router } from 'express';
import { PurchaseRequestController } from '../controllers/purchaseRequestController';
import { RfqController } from '../controllers/rfqController';
import { VendorController } from '../controllers/vendorController';
import { QuotationController } from '../controllers/quotationController';
import { ApprovalController } from '../controllers/approvalController';
import { PurchaseOrderController } from '../controllers/purchaseOrderController';
import { InventoryController } from '../controllers/inventoryController';
import { FinanceController } from '../controllers/financeController';
import { DashboardController } from '../controllers/dashboardController';
import { CopilotController } from '../controllers/copilotController';
import { QuotationService } from '../services/quotationService';

const router = Router();

// 1. Health & Status
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VendraX Enterprise Backend API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    architecture: 'Controller -> Service -> Repository -> Database',
    timestamp: new Date().toISOString(),
  });
});

// 2. Purchase Request Service Endpoints
router.get('/purchase-requests', PurchaseRequestController.getAll);
router.post('/purchase-requests', PurchaseRequestController.create);
router.get('/purchase-requests/:id', PurchaseRequestController.getById);
router.put('/purchase-requests/:id', PurchaseRequestController.update);
router.post('/purchase-requests/parse-nlp', PurchaseRequestController.parseNaturalLanguage);

// 3. RFQ Service Endpoints
router.get('/rfqs', RfqController.getAll);
router.post('/rfqs', RfqController.create);
router.get('/rfqs/:id', RfqController.getById);
router.post('/rfqs/:id/vendors', RfqController.inviteVendors);
router.post('/rfqs/:id/generate', RfqController.generateFromPurchaseRequest);
router.get('/rfqs/:id/quotations', RfqController.getQuotations);
router.post('/rfqs/:id/analyze-quotations', RfqController.analyzeQuotations);

// 4. Vendor Service Endpoints
router.get('/vendors', VendorController.getAll);
router.post('/vendors', VendorController.create);
router.get('/vendors/:id', VendorController.getById);
router.put('/vendors/:id', VendorController.update);

// 5. Quotation Service & Extraction Endpoints
router.post('/quotations/upload', QuotationController.uploadQuotation);
router.get('/quotations/:id', QuotationController.getById);
router.post('/quotations/:id/analyze', QuotationController.analyze);
router.post('/quotations/extract-raw', QuotationController.extractRaw);

// 6. Approval Engine Endpoints
router.post('/approvals/evaluate', ApprovalController.evaluate);
router.post('/approvals/:id/approve', ApprovalController.approve);
router.post('/approvals/:id/reject', ApprovalController.reject);

// 7. Purchase Order Service Endpoints
router.get('/purchase-orders', PurchaseOrderController.getAll);
router.post('/purchase-orders', PurchaseOrderController.create);
router.get('/purchase-orders/:id', PurchaseOrderController.getById);
router.post('/purchase-orders/:id/approve', PurchaseOrderController.approve);

// 8. Inventory Service Endpoints
router.get('/inventory', InventoryController.getAll);
router.post('/inventory/receipt', InventoryController.receiveGoods);
router.get('/inventory/movements', InventoryController.getMovements);

// 9. Finance Service Endpoints
router.get('/finance/invoices', FinanceController.getAllInvoices);
router.get('/finance/invoices/:id', FinanceController.getInvoiceById);
router.post('/finance/match', FinanceController.matchThreeWay);
router.post('/finance/pay', FinanceController.processPayment);

// 10. Dashboard Service Endpoints
router.get('/dashboard/metrics', DashboardController.getMetrics);
router.get('/dashboard/spending', DashboardController.getSpending);
router.get('/dashboard/vendor-performance', DashboardController.getVendorPerformance);
router.get('/dashboard/insights', DashboardController.getInsights);

// 11. AI Copilot Endpoints
router.post('/copilot/chat', CopilotController.chat);

// Backwards-compatible / Legacy AI Route Aliases
router.post('/ai/copilot', CopilotController.chat);
router.post('/ai/copilot-chat', CopilotController.chat);
router.post('/ai/parse-requirement', PurchaseRequestController.parseNaturalLanguage);
router.post('/ai/extract-quote', QuotationController.extractRaw);

// Additional AI Strategic Assistants
router.post('/ai/analyze-comparison', async (req, res, next) => {
  try {
    const { rfq, quotes, customWeights } = req.body;
    const rfqId = rfq?.id || 'rfq-2026-089';
    const analysis = QuotationService.analyzeQuotations(rfqId);
    return res.json({
      success: true,
      data: {
        winnerVendorId: analysis.recommendation?.vendorId || 'v-vendor-c',
        winnerVendorName: analysis.recommendation?.vendor || 'Vendor C (CloudTech & CyberCore)',
        executiveSummary: analysis.recommendation?.reasons.join(' ') || 'Vendor C provides the lowest True Landed Cost and highest SLA reliability.',
        keySelectionDrivers: [
          {
            driver: 'True Landed Cost Advantage',
            impact: `Saves ₹${((analysis.recommendation?.savingsVsBudget || 100000) / 100000).toFixed(1)}L vs target budget with zero hidden logistics adders.`,
            advantageVsNextBest: 'Eliminates unexpected FOB tariffs and currency conversion volatility.',
          },
          {
            driver: 'Enterprise SLA & Delivery Commitment',
            impact: '5-day delivery fulfillment with full 3-year on-site SLA warranty.',
            advantageVsNextBest: 'Significantly lower defect rate buffer and zero carry-cost.',
          },
        ],
        totalSavingsAchievedUSD: 1200,
        savingsPercentage: analysis.recommendation?.savingsPercentage || 2.0,
        riskMitigationPlan: [
          'Verify manufacturer authorization certificate prior to batch release.',
          'Execute milestone GRN barcode scanning upon destination warehouse arrival.',
        ],
        negotiationPoints: [
          'Request an additional 2.5% early-payment rebate for Net 30 settlement.',
        ],
        whatIfSensitivityAnalysis: [
          {
            scenario: 'If required delivery is compressed to 3 days',
            outcome: 'Vendor C remains the only certified partner capable of priority courier delivery.',
          },
          {
            scenario: 'If order volume doubles to 200 units',
            outcome: 'Volume tier discount increases to 4.5% across all items.',
          },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/ai/draft-negotiation', (req, res) => {
  const { targetVendor, discountTargetPct } = req.body;
  return res.json({
    success: true,
    data: {
      subject: `Commercial Alignment & RFQ Award Opportunity - VendraX Strategic Procurement`,
      recipient: targetVendor?.contactName || 'Account Executive',
      emailBody: `Dear ${targetVendor?.contactName || 'Partner'},\n\nWe have reviewed your proposal. Your technical compliance and reliability score ranked high in our evaluation.\n\nTo finalize award of this contract within this cycle, we request a ${discountTargetPct || 4}% volume concession and confirmation of DDP destination terms with Net 45 settlement.\n\nWe look forward to executing this partnership.\n\nBest regards,\nVendraX Global Procurement`,
      leveragePoints: [
        'Guaranteed multi-phase campus expansion pipeline in Q4',
        'Preferred Tier-1 partner status across corporate subsidiaries',
      ],
      fallbackPosition: 'Accept 2.5% discount if 3-year on-site SLA is bundled without surcharge.',
    },
  });
});

export default router;
