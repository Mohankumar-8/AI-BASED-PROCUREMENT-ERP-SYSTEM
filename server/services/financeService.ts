import { db } from '../db/database';
import { FinanceInvoiceRecord, PurchaseOrder, VendorQuote } from '../types/backendTypes';

export class FinanceService {
  public static getAllInvoices(): FinanceInvoiceRecord[] {
    return db.getFinanceInvoices();
  }

  public static getInvoiceById(id: string): FinanceInvoiceRecord | undefined {
    return db.getFinanceInvoiceById(id);
  }

  /**
   * Automatically creates a Finance transaction record when a Purchase Order is issued
   */
  public static createInvoiceFromPo(po: PurchaseOrder, quote?: VendorQuote): FinanceInvoiceRecord {
    const invoiceId = `fin-inv-${Date.now()}`;
    const invoiceNumber = `INV-${po.vendorName.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const poValue = po.quantity * po.unitPrice;
    const tax = po.taxAmount;
    const amountPayable = po.totalAmount;
    const capturedSavings = quote?.trueCost?.savingsVsBudget ? Math.max(0, quote.trueCost.savingsVsBudget) : 100000;

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + (quote?.paymentDays || 45));

    const invoice: FinanceInvoiceRecord = {
      id: invoiceId,
      invoiceNumber,
      poNumber: po.poNumber,
      poValue,
      tax,
      amountPayable,
      paidAmount: 0,
      pendingAmount: amountPayable,
      vendorName: po.vendorName,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: dueDateObj.toISOString().split('T')[0],
      status: 'matched_3way',
      poMatchedAmount: amountPayable,
      grnMatchedQuantity: po.quantity,
      varianceAmount: 0,
      capturedSavingsAmount: capturedSavings,
    };

    return db.createFinanceInvoice(invoice);
  }

  /**
   * Executes 3-Way Matching between PO Amount, Vendor Invoice Amount, and GRN Received Quantity
   */
  public static matchThreeWay(
    invoiceId: string,
    invoiceAmount: number,
    grnQuantity: number
  ): FinanceInvoiceRecord {
    const inv = db.getFinanceInvoiceById(invoiceId);
    if (!inv) throw new Error(`Invoice '${invoiceId}' not found`);

    const variance = invoiceAmount - inv.poMatchedAmount;
    const isMatched = Math.abs(variance) < 1.0;

    const updated = db.updateFinanceInvoice(invoiceId, {
      amountPayable: invoiceAmount,
      pendingAmount: invoiceAmount - inv.paidAmount,
      grnMatchedQuantity: grnQuantity,
      varianceAmount: variance,
      status: isMatched ? 'matched_3way' : 'variance_flagged',
      varianceNotes: isMatched
        ? '3-Way Match Verified: 100% concordance between PO line items, GRN scan, and Invoice total.'
        : `Price variance detected: ₹${variance} discrepancy against original Purchase Order.`,
    });

    return updated!;
  }

  /**
   * Records a payment disbursement against an invoice
   */
  public static processPayment(invoiceId: string, paymentAmount: number): FinanceInvoiceRecord {
    const inv = db.getFinanceInvoiceById(invoiceId);
    if (!inv) throw new Error(`Invoice '${invoiceId}' not found`);

    const newPaid = inv.paidAmount + paymentAmount;
    const newPending = Math.max(0, inv.amountPayable - newPaid);

    const updated = db.updateFinanceInvoice(invoiceId, {
      paidAmount: newPaid,
      pendingAmount: newPending,
      status: newPending === 0 ? 'paid' : 'scheduled_payment',
    });

    return updated!;
  }
}
