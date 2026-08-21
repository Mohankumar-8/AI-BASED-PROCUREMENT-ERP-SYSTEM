import { db } from '../db/database';
import { RFQ, PurchaseRequest, RfqItem } from '../types/backendTypes';

export class RfqService {
  public static getAll(): RFQ[] {
    return db.getRfqs();
  }

  public static getById(id: string): RFQ | undefined {
    return db.getRfqById(id);
  }

  public static create(rfqData: Partial<RFQ>): RFQ {
    const id = rfqData.id || `rfq-${Date.now()}`;
    const rfqNumber = rfqData.rfqNumber || `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`;

    const rfq: RFQ = {
      id,
      rfqNumber,
      title: rfqData.title || 'Enterprise RFQ Specification',
      department: rfqData.department || 'Corporate Procurement',
      requesterName: rfqData.requesterName || 'Procurement Specialist',
      requesterEmail: rfqData.requesterEmail || 'procurement@vendrax.internal',
      category: rfqData.category || 'IT Hardware',
      priority: rfqData.priority || 'medium',
      status: rfqData.status || 'open_for_quotes',
      createdAt: rfqData.createdAt || new Date().toISOString().split('T')[0],
      deadlineDate: rfqData.deadlineDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      targetBudget: rfqData.targetBudget || 5000000,
      budgetCurrency: rfqData.budgetCurrency || 'INR',
      deliveryLocation: rfqData.deliveryLocation || 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
      requiredDeliveryDate: rfqData.requiredDeliveryDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      description: rfqData.description || 'Enterprise RFQ requirement',
      items: rfqData.items || [],
      invitedVendorIds: rfqData.invitedVendorIds || ['v-vendor-c', 'v-vendor-a', 'v-vendor-b'],
      quotes: rfqData.quotes || [],
      approvalStatus: 'pending',
      approvalRulesMatched: [],
    };

    return db.createRfq(rfq);
  }

  /**
   * Generates a structured RFQ directly from an existing Purchase Request
   */
  public static generateFromPurchaseRequest(purchaseRequestId: string): RFQ {
    const pr = db.getPurchaseRequestById(purchaseRequestId);
    if (!pr) {
      throw new Error(`Purchase Request '${purchaseRequestId}' not found`);
    }

    const rfqId = `rfq-${Date.now()}`;
    const rfqNumber = `RFQ-2026-${Math.floor(100 + Math.random() * 900)}`;

    const rfqItem: RfqItem = {
      id: `item-${Date.now()}`,
      itemCode: pr.product.toLowerCase().includes('laptop') ? 'LAP-i7-16-512' : `SKU-${Date.now().toString().slice(-4)}`,
      name: pr.product,
      category: 'IT Hardware',
      requiredQuantity: pr.quantity,
      unit: pr.unit,
      targetUnitPrice: Math.round(pr.budget / pr.quantity),
      technicalSpecs: pr.specifications,
      complianceRequired: ['ISO 9001:2015', 'RoHS Compliant', 'BIS Certified'],
    };

    const newRfq: RFQ = {
      id: rfqId,
      rfqNumber,
      title: pr.title,
      department: pr.department,
      requesterName: pr.requesterName,
      requesterEmail: pr.requesterEmail,
      category: 'IT Hardware',
      priority: pr.priority.toLowerCase() as any,
      status: 'open_for_quotes',
      createdAt: new Date().toISOString().split('T')[0],
      deadlineDate: pr.requiredDeliveryDate,
      targetBudget: pr.budget,
      budgetCurrency: pr.currency,
      deliveryLocation: 'VendraX Technology Hub, Whitefield, Bengaluru, KA 560066',
      requiredDeliveryDate: pr.requiredDeliveryDate,
      description: pr.specificationsText,
      items: [rfqItem],
      invitedVendorIds: ['v-vendor-c', 'v-vendor-a', 'v-vendor-b'],
      quotes: [],
      approvalStatus: 'pending',
      approvalRulesMatched: [],
    };

    // Update PR status
    db.updatePurchaseRequest(pr.id, {
      status: 'Converted to RFQ',
      rfqId: newRfq.id,
    });

    return db.createRfq(newRfq);
  }

  /**
   * Invites vendors to an active RFQ
   */
  public static inviteVendors(rfqId: string, vendorIds: string[]): RFQ {
    const rfq = db.getRfqById(rfqId);
    if (!rfq) throw new Error(`RFQ '${rfqId}' not found`);

    const current = new Set(rfq.invitedVendorIds);
    vendorIds.forEach((vid) => current.add(vid));

    const updated = db.updateRfq(rfqId, {
      invitedVendorIds: Array.from(current),
    });

    return updated!;
  }
}
