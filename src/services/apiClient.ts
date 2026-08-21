import {
  PurchaseRequest,
  RFQ,
  VendorQuote,
  VendorProfile,
  PurchaseOrder,
  InventoryItem,
  FinanceInvoiceRecord,
} from '../types';

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP error ${res.status}`);
    }

    const json = await res.json();
    return json.data !== undefined ? json.data : json;
  }

  // Health
  public static async checkHealth() {
    return this.request<{ status: string; service: string; hasGeminiKey: boolean }>('/api/health');
  }

  // 1. Purchase Requests
  public static async getPurchaseRequests(): Promise<PurchaseRequest[]> {
    return this.request<PurchaseRequest[]>('/api/purchase-requests');
  }

  public static async createPurchaseRequest(data: Partial<PurchaseRequest>): Promise<PurchaseRequest> {
    return this.request<PurchaseRequest>('/api/purchase-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async parseNaturalLanguageRequirement(rawNaturalLanguage: string): Promise<any> {
    return this.request('/api/purchase-requests/parse-nlp', {
      method: 'POST',
      body: JSON.stringify({ rawNaturalLanguage, text: rawNaturalLanguage }),
    });
  }

  // 2. RFQs
  public static async getRfqs(): Promise<RFQ[]> {
    return this.request<RFQ[]>('/api/rfqs');
  }

  public static async getRfqById(id: string): Promise<RFQ> {
    return this.request<RFQ>(`/api/rfqs/${id}`);
  }

  public static async createRfq(data: Partial<RFQ>): Promise<RFQ> {
    return this.request<RFQ>('/api/rfqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public static async generateRfqFromPr(purchaseRequestId: string): Promise<RFQ> {
    return this.request<RFQ>(`/api/rfqs/${purchaseRequestId}/generate`, {
      method: 'POST',
      body: JSON.stringify({ purchaseRequestId }),
    });
  }

  public static async analyzeQuotationsForRfq(rfqId: string): Promise<any> {
    return this.request(`/api/rfqs/${rfqId}/analyze-quotations`, {
      method: 'POST',
    });
  }

  // 3. Vendors
  public static async getVendors(): Promise<VendorProfile[]> {
    return this.request<VendorProfile[]>('/api/vendors');
  }

  public static async createVendor(data: Partial<VendorProfile>): Promise<VendorProfile> {
    return this.request<VendorProfile>('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 4. Quotations
  public static async uploadQuotation(data: {
    rfqId: string;
    rawQuoteText: string;
    fileName?: string;
    vendorId?: string;
  }): Promise<VendorQuote> {
    return this.request<VendorQuote>('/api/quotations/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 5. Approvals
  public static async evaluateApproval(params: { rfqId?: string; totalAmount?: number; riskLevel?: string; vendorScore?: number }) {
    return this.request('/api/approvals/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  public static async approveRfq(rfqId: string, notes?: string): Promise<RFQ> {
    return this.request<RFQ>(`/api/approvals/${rfqId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  public static async rejectRfq(rfqId: string, reason: string): Promise<RFQ> {
    return this.request<RFQ>(`/api/approvals/${rfqId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  // 6. Purchase Orders
  public static async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return this.request<PurchaseOrder[]>('/api/purchase-orders');
  }

  public static async createPurchaseOrderFromRfq(rfqId: string, quoteId?: string): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>('/api/purchase-orders', {
      method: 'POST',
      body: JSON.stringify({ rfqId, quoteId }),
    });
  }

  public static async approvePurchaseOrder(poId: string): Promise<PurchaseOrder> {
    return this.request<PurchaseOrder>(`/api/purchase-orders/${poId}/approve`, {
      method: 'POST',
    });
  }

  // 7. Inventory
  public static async getInventory(): Promise<InventoryItem[]> {
    return this.request<InventoryItem[]>('/api/inventory');
  }

  public static async processGoodsReceipt(data: {
    sku?: string;
    itemId?: string;
    quantity: number;
    poNumber: string;
  }) {
    return this.request('/api/inventory/receipt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 8. Finance
  public static async getFinanceInvoices(): Promise<FinanceInvoiceRecord[]> {
    return this.request<FinanceInvoiceRecord[]>('/api/finance/invoices');
  }

  public static async matchThreeWay(invoiceId: string, invoiceAmount: number, grnQuantity: number) {
    return this.request('/api/finance/match', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, invoiceAmount, grnQuantity }),
    });
  }

  public static async processPayment(invoiceId: string, paymentAmount: number) {
    return this.request('/api/finance/pay', {
      method: 'POST',
      body: JSON.stringify({ invoiceId, paymentAmount }),
    });
  }

  // 9. Dashboard
  public static async getDashboardMetrics() {
    return this.request('/api/dashboard/metrics');
  }

  public static async getSpendingBreakdown() {
    return this.request('/api/dashboard/spending');
  }

  // 10. AI Copilot
  public static async sendCopilotChat(message: string, conversationHistory?: any[], contextRfqId?: string) {
    return this.request<{ reply: string; engine: string; actionResult?: any }>('/api/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory, contextRfqId }),
    });
  }
}
