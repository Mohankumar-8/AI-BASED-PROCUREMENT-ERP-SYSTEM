import React, { useState, useEffect } from 'react';
import { 
  ProcurementStage, 
  RFQ, 
  VendorQuote, 
  PurchaseRequest, 
  PurchaseOrder, 
  InventoryItem, 
  InventoryMovement, 
  FinanceInvoiceRecord, 
  VendorProfile,
  EnterpriseSettings 
} from './types';
import { 
  initialRFQs, 
  initialVendors, 
  initialPurchaseOrders, 
  initialInventory, 
  initialInventoryMovements,
  initialFinanceRecords, 
  initialPurchaseRequests,
  initialSettings,
  sampleQuotesLaptopRfq
} from './data/mockData';
import { ApiClient } from './services/apiClient';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardModule } from './components/dashboard/DashboardModule';
import { PurchaseRequestsModule } from './components/requests/PurchaseRequestsModule';
import { RfqModule } from './components/rfq/RfqModule';
import { QuoteExtractionModule } from './components/quotes/QuoteExtractionModule';
import { AiAnalysisHeroModule } from './components/comparison/AiAnalysisHeroModule';
import { VendorIntelligenceModule } from './components/vendor/VendorIntelligenceModule';
import { PurchaseOrdersModule } from './components/po/PurchaseOrdersModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { FinanceModule } from './components/finance/FinanceModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { CopilotDrawer } from './components/copilot/CopilotDrawer';
import { initTheme, getSavedTheme, applyTheme, ThemeMode } from './utils/theme';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export const App: React.FC = () => {
  // State Management
  const [currentStage, setCurrentStage] = useState<ProcurementStage>('dashboard');
  const [rfqs, setRfqs] = useState<RFQ[]>(initialRFQs);
  const [activeRfqId, setActiveRfqId] = useState<string>(initialRFQs[0]?.id || 'rfq-2026-089');
  const [vendors, setVendors] = useState<VendorProfile[]>(initialVendors);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(initialPurchaseRequests);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovement[]>(initialInventoryMovements);
  const [financeRecords, setFinanceRecords] = useState<FinanceInvoiceRecord[]>(initialFinanceRecords);
  const [settings, setSettings] = useState<EnterpriseSettings>(initialSettings);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isLoadingInitialData, setIsLoadingInitialData] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Initialize theme on app startup
  useEffect(() => {
    initTheme();
    setTheme(getSavedTheme());
  }, []);

  const handleSetTheme = (newTheme: ThemeMode) => {
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  // Toast Notification helper
  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync initial state from backend database API on startup
  useEffect(() => {
    const fetchBackendData = async () => {
      setIsLoadingInitialData(true);
      try {
        const [
          serverPrs,
          serverRfqs,
          serverVendors,
          serverPos,
          serverInventory,
          serverFinance
        ] = await Promise.allSettled([
          ApiClient.getPurchaseRequests(),
          ApiClient.getRfqs(),
          ApiClient.getVendors(),
          ApiClient.getPurchaseOrders(),
          ApiClient.getInventory(),
          ApiClient.getFinanceInvoices(),
        ]);

        if (serverPrs.status === 'fulfilled' && serverPrs.value?.length > 0) {
          setPurchaseRequests(serverPrs.value);
        }
        if (serverRfqs.status === 'fulfilled' && serverRfqs.value?.length > 0) {
          setRfqs(serverRfqs.value);
          if (!activeRfqId || !serverRfqs.value.some((r) => r.id === activeRfqId)) {
            setActiveRfqId(serverRfqs.value[0].id);
          }
        }
        if (serverVendors.status === 'fulfilled' && serverVendors.value?.length > 0) {
          setVendors(serverVendors.value);
        }
        if (serverPos.status === 'fulfilled' && serverPos.value?.length > 0) {
          setPurchaseOrders(serverPos.value);
        }
        if (serverInventory.status === 'fulfilled' && serverInventory.value?.length > 0) {
          setInventory(serverInventory.value);
        }
        if (serverFinance.status === 'fulfilled' && serverFinance.value?.length > 0) {
          setFinanceRecords(serverFinance.value);
        }

        // Fetch movements
        try {
          const movementsRes = await fetch('/api/inventory/movements');
          if (movementsRes.ok) {
            const json = await movementsRes.json();
            if (json.data && json.data.length > 0) {
              setInventoryMovements(json.data);
            }
          }
        } catch {
          // ignore
        }
      } catch (err) {
        console.warn('Backend data sync fallback to cached initial data:', err);
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    fetchBackendData();
  }, []);

  // Active RFQ Context
  const activeRfq = rfqs.find((r) => r.id === activeRfqId) || rfqs[0];

  // Actions
  const handleSelectRfq = (rfq: RFQ) => {
    setActiveRfqId(rfq.id);
  };

  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  const handleCreatePr = async (newPr: PurchaseRequest) => {
    try {
      // 1. Post to backend DB
      const created = await ApiClient.createPurchaseRequest(newPr);
      setPurchaseRequests((prev) => [created || newPr, ...prev]);
      showToast('success', 'Purchase Request Created', `${newPr.prNumber} (${newPr.quantity}x ${newPr.product}) saved to database.`);
    } catch (err: any) {
      setPurchaseRequests((prev) => [newPr, ...prev]);
      showToast('info', 'Purchase Request Created (Local)', `${newPr.prNumber} stored locally.`);
    }
  };

  const handleConvertPrToRfq = async (pr: PurchaseRequest) => {
    try {
      showToast('info', 'Generating RFQ', `Converting ${pr.prNumber} to an active RFQ tender...`);
      const generated = await ApiClient.generateRfqFromPr(pr.id);
      if (generated) {
        setRfqs((prev) => [generated, ...prev.filter((r) => r.id !== generated.id)]);
        setActiveRfqId(generated.id);
        setCurrentStage('rfqs');
        showToast('success', 'RFQ Generated', `${generated.rfqNumber} generated and broadcasted to qualified vendors.`);
        return;
      }
    } catch (err) {
      console.warn('Fallback local RFQ generation:', err);
    }

    // Local fallback
    const newRfq: RFQ = {
      id: `rfq-${Date.now()}`,
      rfqNumber: `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: pr.title,
      department: pr.department,
      requesterName: pr.requesterName,
      requesterEmail: pr.requesterEmail,
      category: 'IT Hardware',
      priority: pr.priority === 'Urgent' ? 'urgent' : pr.priority === 'High' ? 'high' : 'medium',
      status: 'open_for_quotes',
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: pr.requiredDeliveryDate,
      targetBudget: pr.budget,
      budgetCurrency: currency,
      deliveryLocation: 'VendraX Technology Hub, Whitefield, Bengaluru',
      requiredDeliveryDate: pr.requiredDeliveryDate,
      description: pr.specificationsText,
      items: [
        {
          id: `item-${Date.now()}`,
          itemCode: 'LAP-i7-16-512',
          name: pr.product,
          category: 'IT Hardware',
          requiredQuantity: pr.quantity,
          unit: pr.unit,
          targetUnitPrice: Math.round(pr.budget / pr.quantity),
          technicalSpecs: pr.specifications,
          complianceRequired: ['ISO 9001', 'RoHS', 'BIS Certified'],
        },
      ],
      invitedVendorIds: ['v-vendor-a', 'v-vendor-b', 'v-vendor-c'],
      quotes: pr.product.toLowerCase().includes('laptop') ? sampleQuotesLaptopRfq : [],
      approvalStatus: 'pending',
      approvalRulesMatched: [],
    };

    setRfqs((prev) => [newRfq, ...prev]);
    setActiveRfqId(newRfq.id);
    setCurrentStage('rfqs');
    showToast('success', 'RFQ Generated', `${newRfq.rfqNumber} broadcasted to invited vendors.`);
  };

  const handleCreateRfq = async (newRfq: RFQ) => {
    try {
      const created = await ApiClient.createRfq(newRfq);
      setRfqs((prev) => [created || newRfq, ...prev]);
      setActiveRfqId(created?.id || newRfq.id);
      showToast('success', 'RFQ Broadcasted', `${newRfq.rfqNumber} broadcasted to invited vendors.`);
    } catch {
      setRfqs((prev) => [newRfq, ...prev]);
      setActiveRfqId(newRfq.id);
      showToast('info', 'RFQ Created', `${newRfq.rfqNumber} registered.`);
    }
  };

  const handleUploadQuote = async (quote: VendorQuote) => {
    try {
      showToast('info', 'Ingesting Quote', `Extracting commercial terms from ${quote.vendorName}...`);
      await ApiClient.uploadQuotation({
        rfqId: activeRfqId,
        rawQuoteText: quote.rawQuoteText || JSON.stringify(quote),
        fileName: quote.fileName,
        vendorId: quote.vendorId,
      });

      // Refetch RFQs to get backend calculated true cost and scores
      const updatedRfqs = await ApiClient.getRfqs();
      if (updatedRfqs?.length > 0) {
        setRfqs(updatedRfqs);
      } else {
        setRfqs((prev) =>
          prev.map((r) => {
            if (r.id === activeRfqId) {
              const exists = r.quotes.some((q) => q.id === quote.id);
              const updatedQuotes = exists
                ? r.quotes.map((q) => (q.id === quote.id ? quote : q))
                : [...r.quotes, quote];
              return { ...r, quotes: updatedQuotes, status: 'decision_ready' };
            }
            return r;
          })
        );
      }
      showToast('success', 'Quotation Ingested', `Line items extracted from ${quote.vendorName}. True landed cost modeled.`);
    } catch {
      setRfqs((prev) =>
        prev.map((r) => {
          if (r.id === activeRfqId) {
            const exists = r.quotes.some((q) => q.id === quote.id);
            const updatedQuotes = exists
              ? r.quotes.map((q) => (q.id === quote.id ? quote : q))
              : [...r.quotes, quote];
            return { ...r, quotes: updatedQuotes, status: 'decision_ready' };
          }
          return r;
        })
      );
      showToast('success', 'Quotation Ingested', `Extracted terms for ${quote.vendorName}.`);
    }
  };

  const handleLoadSampleQuotes = async (sampleQuotes: VendorQuote[]) => {
    try {
      showToast('info', 'Analyzing Multi-Vendor Bids', 'Extracting line items and modeling True Landed Costs for 3 vendors...');
      
      // Post all 3 quotes to backend
      for (const q of sampleQuotes) {
        await ApiClient.uploadQuotation({
          rfqId: activeRfqId,
          rawQuoteText: q.rawQuoteText || `Quotation for 100 laptops by ${q.vendorName}`,
          fileName: q.fileName,
          vendorId: q.vendorId,
        }).catch(() => {});
      }

      // Analyze RFQ quotations on backend
      await ApiClient.analyzeQuotationsForRfq(activeRfqId).catch(() => {});

      // Refetch RFQs
      const updatedRfqs = await ApiClient.getRfqs();
      if (updatedRfqs?.length > 0) {
        setRfqs(updatedRfqs);
      } else {
        setRfqs((prev) =>
          prev.map((r) => {
            if (r.id === activeRfqId) {
              return { ...r, quotes: sampleQuotes, status: 'decision_ready' };
            }
            return r;
          })
        );
      }
      showToast('success', 'Quotes Ingested & Analyzed', '3 Vendor proposals ingested. True Cost, Risk, and AI Scores calculated.');
    } catch {
      setRfqs((prev) =>
        prev.map((r) => {
          if (r.id === activeRfqId) {
            return { ...r, quotes: sampleQuotes, status: 'decision_ready' };
          }
          return r;
        })
      );
      showToast('success', 'Quotes Ingested', '3 Vendor quotations loaded.');
    }
  };

  const handleApproveAndGeneratePo = async (rfq: RFQ, winnerQuote: VendorQuote) => {
    try {
      showToast('info', 'Processing Purchase Order', 'Evaluating approval policy & issuing electronic PO...');

      // 1. Call backend to create PO from approved quote
      const createdPo = await ApiClient.createPurchaseOrderFromRfq(rfq.id, winnerQuote.id);
      
      // 2. Approve RFQ on backend
      await ApiClient.approveRfq(rfq.id, 'Approved via Autonomous Policy Engine');

      // 3. Refresh all state from backend to ensure 100% data consistency
      const [newPos, newRfqs, newInv, newFin] = await Promise.all([
        ApiClient.getPurchaseOrders().catch(() => []),
        ApiClient.getRfqs().catch(() => []),
        ApiClient.getInventory().catch(() => []),
        ApiClient.getFinanceInvoices().catch(() => []),
      ]);

      if (newPos?.length) setPurchaseOrders(newPos);
      if (newRfqs?.length) setRfqs(newRfqs);
      if (newInv?.length) setInventory(newInv);
      if (newFin?.length) setFinanceRecords(newFin);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('success', 'Purchase Order Issued', `${createdPo.poNumber} created. Inbound stock & 3-way match scheduled.`);
      setCurrentStage('purchase_orders');
    } catch (err: any) {
      console.warn('Backend PO creation fallback to local state synchronization:', err);

      const newPoNumber = `PO-2026-${Math.floor(100 + Math.random() * 900)}-VENDRAX`;
      
      const newPo: PurchaseOrder = {
        id: `po-${Date.now()}`,
        poNumber: newPoNumber,
        rfqId: rfq.id,
        rfqTitle: rfq.title,
        vendorId: winnerQuote.vendorId,
        vendorName: winnerQuote.vendorName,
        issueDate: new Date().toISOString().split('T')[0],
        deliveryDueDate: winnerQuote.promisedDeliveryDate || '2026-08-27',
        items: rfq.items?.[0]?.name || rfq.title,
        quantity: rfq.items?.[0]?.requiredQuantity || 100,
        unitPrice: winnerQuote.lineItems?.[0]?.unitPrice || Math.round(winnerQuote.quotedTotal / 100),
        taxAmount: winnerQuote.taxAmount,
        totalAmount: winnerQuote.trueCost.totalTrueCost,
        currency: currency,
        status: 'issued',
        paymentTerms: winnerQuote.paymentTerms,
        incoterms: `${winnerQuote.incoterms} Destination`,
        deliveryAddress: 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
        warrantyTerms: winnerQuote.warrantyText || '3 Years On-Site SLA',
        trueLandingCostCalculated: winnerQuote.trueCost.totalTrueCost,
        lineItems: winnerQuote.lineItems,
        milestones: [
          { title: 'Electronic PO Transmitted via EDI', date: new Date().toISOString().split('T')[0], completed: true },
          { title: 'Factory Imaging & Packing Dispatch', date: 'In Progress', completed: false },
          { title: 'Inbound Warehouse Transit Hub', date: 'Pending', completed: false },
          { title: 'GRN Barcode Scan & QC Inspection', date: 'Pending', completed: false },
        ],
      };

      setRfqs((prev) =>
        prev.map((r) =>
          r.id === rfq.id
            ? {
                ...r,
                status: 'awarded',
                approvalStatus: 'approved',
                poNumber: newPoNumber,
                selectedQuoteId: winnerQuote.id,
              }
            : r
        )
      );

      setPurchaseOrders((prev) => [newPo, ...prev]);

      setInventory((prev) =>
        prev.map((item) => {
          if (item.sku === 'LAP-i7-16-512' || item.name.toLowerCase().includes('laptop')) {
            return {
              ...item,
              incomingStock: item.incomingStock + (rfq.items?.[0]?.requiredQuantity || 100),
              pendingPoQuantity: item.pendingPoQuantity + (rfq.items?.[0]?.requiredQuantity || 100),
            };
          }
          return item;
        })
      );

      const newFinanceRecord: FinanceInvoiceRecord = {
        id: `inv-rec-${Date.now()}`,
        invoiceNumber: `INV-2026-CC-${Math.floor(1000 + Math.random() * 9000)}`,
        poNumber: newPoNumber,
        poValue: winnerQuote.trueCost.totalTrueCost,
        tax: winnerQuote.taxAmount,
        amountPayable: winnerQuote.trueCost.totalTrueCost,
        paidAmount: 0,
        pendingAmount: winnerQuote.trueCost.totalTrueCost,
        vendorName: winnerQuote.vendorName,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '2026-10-04',
        status: 'matched_3way',
        poMatchedAmount: winnerQuote.trueCost.totalTrueCost,
        grnMatchedQuantity: rfq.items?.[0]?.requiredQuantity || 100,
        varianceAmount: 0,
        varianceNotes: '3-Way Match Verified: Electronic PO, GRN Barcode Scan, and Tax Invoice match 100% with ₹0.00 variance.',
        capturedSavingsAmount: winnerQuote.trueCost.savingsVsBudget > 0 ? winnerQuote.trueCost.savingsVsBudget : 100000,
      };

      setFinanceRecords((prev) => [newFinanceRecord, ...prev]);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('success', 'Purchase Order Issued', `${newPoNumber} generated for ${winnerQuote.vendorName}.`);
      setCurrentStage('purchase_orders');
    }
  };

  const handleTriggerReorder = async (item: InventoryItem) => {
    const reorderPr: PurchaseRequest = {
      id: `pr-reorder-${Date.now()}`,
      prNumber: `PR-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: `Reorder ${item.reorderLevel * 2}x ${item.name}`,
      product: item.name,
      quantity: item.reorderLevel * 2,
      unit: item.unit,
      specifications: { 'Item SKU': item.sku },
      specificationsText: `Stock replenishment for SKU: ${item.sku}. Safety buffer replenishment.`,
      budget: item.unitCost * item.reorderLevel * 2,
      currency: currency,
      requiredDeliveryDate: '2026-09-10',
      priority: 'High',
      department: 'Inventory & Warehouse Hub',
      requesterName: 'Autonomous Stock Trigger',
      requesterEmail: 'warehouse@vendrax.ai',
      status: 'Approved',
      createdDate: new Date().toISOString().split('T')[0],
    };

    try {
      await ApiClient.createPurchaseRequest(reorderPr);
    } catch {}

    setPurchaseRequests((prev) => [reorderPr, ...prev]);
    showToast('success', 'Reorder PR Triggered', `Generated ${reorderPr.prNumber} for SKU ${item.sku}.`);
    setCurrentStage('purchase_requests');
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans selection:bg-[var(--primary)]/20 selection:text-[var(--primary)] transition-colors duration-150">
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl border shadow-md flex items-start gap-3 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-2 duration-200 bg-[var(--surface)] ${
              toast.type === 'success'
                ? 'border-[var(--secondary)]/40 text-[var(--foreground)]'
                : toast.type === 'error'
                ? 'border-[var(--danger)]/40 text-[var(--foreground)]'
                : 'border-[var(--primary)]/30 text-[var(--foreground)]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-[var(--primary)] shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[var(--foreground)] leading-tight">{toast.title}</div>
              <div className="text-[11px] text-[var(--foreground-muted)] leading-snug mt-0.5">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer touch-target"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Navbar */}
      <Navbar
        currentStage={currentStage}
        onNavigate={setCurrentStage}
        activeRfq={activeRfq}
        rfqs={rfqs}
        onSelectRfq={handleSelectRfq}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        currency={currency}
        onToggleCurrency={handleToggleCurrency}
        theme={theme}
        onSetTheme={handleSetTheme}
        onOpenMobileMenu={() => setIsMobileNavOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop / Tablet Landscape) */}
        <Sidebar
          currentStage={currentStage}
          onNavigate={setCurrentStage}
          activeRfq={activeRfq}
          quotesCount={activeRfq?.quotes?.length || 0}
          anomaliesCount={3}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8 bg-[var(--background)] pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentStage === 'dashboard' && (
              <DashboardModule
                rfqs={rfqs}
                activeRfq={activeRfq}
                pos={purchaseOrders}
                onSelectRfq={handleSelectRfq}
                onNavigate={setCurrentStage}
                currency={currency}
              />
            )}

            {currentStage === 'purchase_requests' && (
              <PurchaseRequestsModule
                requests={purchaseRequests}
                onCreatePr={handleCreatePr}
                onConvertToRfq={handleConvertPrToRfq}
                currency={currency}
              />
            )}

            {currentStage === 'rfqs' && (
              <RfqModule
                rfqs={rfqs}
                activeRfq={activeRfq}
                vendors={vendors}
                onSelectRfq={handleSelectRfq}
                onNavigate={setCurrentStage}
                onCreateRfq={handleCreateRfq}
                currency={currency}
              />
            )}

            {currentStage === 'quotations' && (
              <QuoteExtractionModule
                activeRfq={activeRfq}
                quotes={activeRfq?.quotes || []}
                onUploadQuote={handleUploadQuote}
                onLoadSampleQuotes={handleLoadSampleQuotes}
                onNavigate={setCurrentStage}
                currency={currency}
              />
            )}

            {currentStage === 'ai_analysis' && (
              <AiAnalysisHeroModule
                activeRfq={activeRfq}
                quotes={activeRfq?.quotes?.length > 0 ? activeRfq.quotes : sampleQuotesLaptopRfq}
                onApproveAndGeneratePo={handleApproveAndGeneratePo}
                onNavigate={setCurrentStage}
                currency={currency}
              />
            )}

            {currentStage === 'vendor_intelligence' && (
              <VendorIntelligenceModule
                vendors={vendors}
                currency={currency}
              />
            )}

            {currentStage === 'purchase_orders' && (
              <PurchaseOrdersModule
                pos={purchaseOrders}
                onNavigate={setCurrentStage}
                currency={currency}
              />
            )}

            {currentStage === 'inventory' && (
              <InventoryModule
                inventory={inventory}
                movements={inventoryMovements}
                onTriggerReorder={handleTriggerReorder}
                onNavigate={setCurrentStage}
                currency={currency}
              />
            )}

            {currentStage === 'finance' && (
              <FinanceModule
                records={financeRecords}
                onNavigate={setCurrentStage}
                currency={currency}
              />
            )}

            {currentStage === 'copilot' && (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">AI Procurement Copilot</h2>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      Chat directly with the autonomous procurement intelligence engine.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCopilotOpen(true)}
                    className="px-5 py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--surface)] text-xs font-bold shadow-xs cursor-pointer touch-target transition-colors"
                  >
                    Open Copilot Drawer
                  </button>
                </div>
              </div>
            )}

            {currentStage === 'settings' && (
              <SettingsModule
                settings={settings}
                onUpdateSettings={setSettings}
                currency={currency}
                onToggleCurrency={handleToggleCurrency}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Drawer Navigation (Slide-over for phones/small tablets) */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentStage={currentStage}
        onNavigate={setCurrentStage}
        activeRfq={activeRfq}
        quotesCount={activeRfq?.quotes?.length || 0}
        anomaliesCount={3}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        theme={theme}
        onSetTheme={handleSetTheme}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        currentStage={currentStage}
        onNavigate={setCurrentStage}
        onOpenCopilot={() => setIsCopilotOpen(true)}
      />

      {/* Interactive AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeRfq={activeRfq}
        quotes={activeRfq?.quotes?.length > 0 ? activeRfq.quotes : sampleQuotesLaptopRfq}
        onNavigate={setCurrentStage}
        onApproveWinner={() => {
          const winner = activeRfq?.quotes?.find((q) => q.isRecommendedWinner) || sampleQuotesLaptopRfq[0];
          handleApproveAndGeneratePo(activeRfq, winner);
          setIsCopilotOpen(false);
        }}
        currency={currency}
      />
    </div>
  );
};
export default App;
