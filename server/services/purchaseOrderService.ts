import { db } from '../db/database';
import { PurchaseOrder, VendorQuote, RFQ } from '../types/backendTypes';
import { InventoryService } from './inventoryService';
import { FinanceService } from './financeService';

export class PurchaseOrderService {
  public static getAll(): PurchaseOrder[] {
    return db.getPurchaseOrders();
  }

  public static getById(id: string): PurchaseOrder | undefined {
    return db.getPurchaseOrderById(id);
  }

  /**
   * Automatically creates a Purchase Order from an approved RFQ & Vendor Quotation
   */
  public static createFromApprovedQuote(
    rfqId: string,
    quoteId?: string,
    deliveryAddress?: string
  ): PurchaseOrder {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) throw new Error(`RFQ '${rfqId}' not found`);

    const quote = rfq.quotes.find((q) => q.id === (quoteId || rfq.selectedQuoteId || rfq.quotes[0]?.id));
    if (!quote) throw new Error(`No quotation found to generate Purchase Order`);

    const poNumber = `PO-2026-${Math.floor(1000 + Math.random() * 9000)}-VENDRAX`;
    const poId = `po-${Date.now()}`;
    const issueDate = new Date().toISOString().split('T')[0];

    const quantity = rfq.items[0]?.requiredQuantity || 100;
    const unitPrice = quote.lineItems[0]?.unitPrice || Math.round(quote.basePrice / quantity);

    const purchaseOrder: PurchaseOrder = {
      id: poId,
      poNumber,
      rfqId: rfq.id,
      rfqTitle: rfq.title,
      vendorId: quote.vendorId,
      vendorName: quote.vendorName,
      issueDate,
      deliveryDueDate: quote.promisedDeliveryDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      items: rfq.items[0]?.name || rfq.title,
      quantity,
      unitPrice,
      taxAmount: quote.taxAmount,
      totalAmount: quote.trueCost.totalTrueCost,
      currency: rfq.budgetCurrency || 'INR',
      status: 'issued',
      paymentTerms: quote.paymentTerms,
      incoterms: `${quote.incoterms} Destination`,
      deliveryAddress: deliveryAddress || rfq.deliveryLocation || 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
      warrantyTerms: quote.warrantyText || '3 Years On-Site SLA',
      trueLandingCostCalculated: quote.trueCost.totalTrueCost,
      lineItems: quote.lineItems,
      milestones: [
        { title: 'Electronic PO Transmitted via EDI', date: issueDate, completed: true },
        { title: 'Factory Imaging & Packing Dispatch', date: 'In Progress', completed: false },
        { title: 'Inbound Warehouse Transit Hub', date: 'Pending', completed: false },
        { title: 'GRN Barcode Scan & QC Inspection', date: 'Pending', completed: false },
      ],
    };

    // 1. Save PO
    db.createPurchaseOrder(purchaseOrder);

    // 2. Update RFQ with awarded status & PO linkage
    db.updateRfq(rfq.id, {
      status: 'awarded',
      approvalStatus: 'approved',
      poNumber,
      selectedQuoteId: quote.id,
    });

    // 3. Update Inbound Inventory
    const itemSku = rfq.items[0]?.itemCode || 'LAP-i7-16-512';
    InventoryService.registerInboundPo(itemSku, quantity, poNumber, rfq.items[0]?.name || rfq.title);

    // 4. Create Finance Invoice / Accrual Record
    FinanceService.createInvoiceFromPo(purchaseOrder, quote);

    return purchaseOrder;
  }

  public static create(poData: Partial<PurchaseOrder>): PurchaseOrder {
    const id = poData.id || `po-${Date.now()}`;
    const poNumber = poData.poNumber || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}-VENDRAX`;

    const po: PurchaseOrder = {
      id,
      poNumber,
      rfqId: poData.rfqId || 'rfq-manual',
      rfqTitle: poData.rfqTitle || 'Direct Purchase Order',
      vendorId: poData.vendorId || 'v-vendor-c',
      vendorName: poData.vendorName || 'Enterprise Vendor',
      issueDate: poData.issueDate || new Date().toISOString().split('T')[0],
      deliveryDueDate: poData.deliveryDueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: poData.items || 'Procured Items',
      quantity: poData.quantity || 1,
      unitPrice: poData.unitPrice || 10000,
      taxAmount: poData.taxAmount || 1800,
      totalAmount: poData.totalAmount || 11800,
      currency: poData.currency || 'INR',
      status: poData.status || 'issued',
      paymentTerms: poData.paymentTerms || 'Net 30 Days',
      incoterms: poData.incoterms || 'DDP Destination',
      deliveryAddress: poData.deliveryAddress || 'VendraX Technology Hub, Whitefield, Bengaluru',
      warrantyTerms: poData.warrantyTerms || 'Standard Warranty',
      trueLandingCostCalculated: poData.trueLandingCostCalculated || poData.totalAmount || 11800,
      lineItems: poData.lineItems || [],
      milestones: poData.milestones || [
        { title: 'Electronic PO Transmitted via EDI', date: new Date().toISOString().split('T')[0], completed: true },
      ],
    };

    return db.createPurchaseOrder(po);
  }

  public static approve(id: string): PurchaseOrder {
    const po = db.getPurchaseOrderById(id);
    if (!po) throw new Error(`Purchase Order '${id}' not found`);

    const updated = db.updatePurchaseOrder(id, {
      status: 'acknowledged',
      milestones: po.milestones.map((m, idx) => (idx <= 1 ? { ...m, completed: true } : m)),
    });

    return updated!;
  }
}
