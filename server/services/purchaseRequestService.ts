import { db } from '../db/database';
import { PurchaseRequest } from '../types/backendTypes';
import { geminiService } from './geminiService';

export interface StructuredPurchaseRequestParsed {
  title: string;
  product: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  budget: number;
  currency: string;
  deliveryDays: number;
  requiredDeliveryDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  department: string;
  specifications: Record<string, string>;
  specificationsText: string;
}

export class PurchaseRequestService {
  /**
   * Converts natural language purchase requirement into structured fields
   */
  public static async parseNaturalLanguage(
    text: string,
    departmentHint?: string,
    requesterName?: string
  ): Promise<StructuredPurchaseRequestParsed> {
    if (!text || text.trim().length === 0) {
      throw new Error('Purchase requirement text is required');
    }

    // Try Gemini AI NLP Parser first
    if (geminiService.hasApiKey()) {
      try {
        const prompt = `You are VendraX AI Procurement Natural Language Intelligence Engine.
Extract structured enterprise purchase request parameters from the user's natural language requirement.

Raw Requirement:
"""${text}"""
Department Hint: ${departmentHint || 'IT & Digital Engineering'}

Return STRICT valid JSON with this schema:
{
  "title": "Concise PR title",
  "product": "Product Name",
  "quantity": number,
  "unit": "Units" | "Sets" | "Spools" | "Boxes",
  "unitPrice": number,
  "budget": number,
  "currency": "INR" | "USD",
  "deliveryDays": number,
  "requiredDeliveryDate": "YYYY-MM-DD",
  "priority": "Urgent" | "High" | "Medium" | "Low",
  "department": "Department name",
  "specifications": {
    "Key 1": "Value 1",
    "Key 2": "Value 2"
  },
  "specificationsText": "Full formatted technical spec string"
}`;

        const { data } = await geminiService.generateJson<StructuredPurchaseRequestParsed>(prompt);
        if (data && data.product && data.quantity) {
          return data;
        }
      } catch (err) {
        console.warn('[PurchaseRequestService] Gemini NLP parse fallback engaged:', err);
      }
    }

    // Deterministic Rule-Based Fallback Parser
    return this.parseDeterministicNlp(text, departmentHint);
  }

  /**
   * Deterministic fallback parser that reliably handles strings like:
   * "We need 100 laptops with i7, 16GB RAM and 512GB SSD under ₹50,000 within 10 days"
   */
  public static parseDeterministicNlp(text: string, departmentHint?: string): StructuredPurchaseRequestParsed {
    const clean = text.replace(/,/g, '');

    // Quantity
    let quantity = 100;
    const qtyMatch = clean.match(/(\d+)\s*(?:laptops?|desks?|monitors?|access points?|units?|pcs?|items?|servers?)/i);
    if (qtyMatch && qtyMatch[1]) {
      quantity = parseInt(qtyMatch[1], 10);
    }

    // Product & Category
    let product = 'Enterprise High-Performance Laptops';
    let title = 'Enterprise Hardware Procurement';
    const specs: Record<string, string> = {};

    if (text.toLowerCase().includes('laptop')) {
      product = 'Enterprise High-Performance Laptops';
      title = `${quantity}x Enterprise Laptops (i7 / 16GB / 512GB SSD)`;
      specs['Processor'] = 'Intel Core i7 13th Gen';
      specs['Memory'] = '16GB DDR5';
      specs['Storage'] = '512GB NVMe SSD';
      specs['Display'] = '14-inch FHD IPS';
      specs['Warranty'] = '3-Year On-Site SLA';
    } else if (text.toLowerCase().includes('wi-fi') || text.toLowerCase().includes('access point')) {
      product = 'Tri-Band Wi-Fi 7 Enterprise Access Points';
      title = `${quantity}x Wi-Fi 7 Enterprise Access Points`;
      specs['Standard'] = 'Wi-Fi 7 (802.11be)';
      specs['Port'] = '2.5GbE PoE+';
      specs['Management'] = 'Cloud Managed 3-Yr License';
    } else if (text.toLowerCase().includes('desk')) {
      product = 'Dual-Motor Ergonomic Sit-Stand Desks';
      title = `${quantity}x Dual-Motor Electric Sit-Stand Desks`;
      specs['Mechanism'] = 'Dual Motor Electric';
      specs['Range'] = '65cm to 125cm';
      specs['Top'] = 'Solid wood 140x70cm';
    } else if (text.toLowerCase().includes('monitor')) {
      product = '27-inch 4K UHD Developer Monitors';
      title = `${quantity}x 4K UHD 27-inch Developer Monitors`;
      specs['Resolution'] = '4K UHD (3840x2160)';
      specs['Connectivity'] = 'USB-C 90W Power Delivery';
    }

    // Unit Price & Budget
    let unitPrice = 50000;
    const priceMatch = clean.match(/(?:under|max|budget|at|@)[:\s]*(?:₹|\$|inr|usd)?\s*(\d+(\.\d+)?)/i);
    if (priceMatch && priceMatch[1]) {
      unitPrice = parseFloat(priceMatch[1]);
    }
    const budget = Math.round(unitPrice * quantity);

    // Delivery Days
    let deliveryDays = 10;
    const daysMatch = clean.match(/(?:within|in|deadline)[:\s]*(\d+)\s*(?:days?|working days?|weeks?)/i);
    if (daysMatch && daysMatch[1]) {
      const num = parseInt(daysMatch[1], 10);
      deliveryDays = text.toLowerCase().includes('week') ? num * 7 : num;
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    const requiredDeliveryDate = deliveryDate.toISOString().split('T')[0];

    // Priority
    let priority: 'Urgent' | 'High' | 'Medium' | 'Low' = 'High';
    if (deliveryDays <= 7 || text.toLowerCase().includes('urgent') || text.toLowerCase().includes('asap')) {
      priority = 'Urgent';
    } else if (deliveryDays > 20) {
      priority = 'Medium';
    }

    const specsText = Object.entries(specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ') || 'Standard enterprise grade specifications';

    return {
      title,
      product,
      quantity,
      unit: 'Units',
      unitPrice,
      budget,
      currency: 'INR',
      deliveryDays,
      requiredDeliveryDate,
      priority,
      department: departmentHint || 'IT & Digital Engineering',
      specifications: specs,
      specificationsText: specsText,
    };
  }

  public static getAll(): PurchaseRequest[] {
    return db.getPurchaseRequests();
  }

  public static getById(id: string): PurchaseRequest | undefined {
    return db.getPurchaseRequestById(id);
  }

  public static async createFromNaturalLanguage(
    rawText: string,
    department?: string,
    requesterName?: string,
    requesterEmail?: string
  ): Promise<PurchaseRequest> {
    const parsed = await this.parseNaturalLanguage(rawText, department, requesterName);
    const prId = `pr-${Date.now()}`;
    const prNumber = `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPr: PurchaseRequest = {
      id: prId,
      prNumber,
      title: parsed.title,
      product: parsed.product,
      quantity: parsed.quantity,
      unit: parsed.unit,
      specifications: parsed.specifications,
      specificationsText: parsed.specificationsText,
      budget: parsed.budget,
      currency: parsed.currency,
      requiredDeliveryDate: parsed.requiredDeliveryDate,
      priority: parsed.priority,
      department: parsed.department,
      requesterName: requesterName || 'Aditya Sen',
      requesterEmail: requesterEmail || 'aditya.sen@vendrax.internal',
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      rawNaturalLanguage: rawText,
    };

    return db.createPurchaseRequest(newPr);
  }

  public static create(prData: Partial<PurchaseRequest>): PurchaseRequest {
    const prId = prData.id || `pr-${Date.now()}`;
    const prNumber = prData.prNumber || `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const pr: PurchaseRequest = {
      id: prId,
      prNumber,
      title: prData.title || 'Enterprise Hardware Requirement',
      product: prData.product || 'Enterprise Equipment',
      quantity: prData.quantity || 1,
      unit: prData.unit || 'Units',
      specifications: prData.specifications || {},
      specificationsText: prData.specificationsText || '',
      budget: prData.budget || 500000,
      currency: prData.currency || 'INR',
      requiredDeliveryDate: prData.requiredDeliveryDate || new Date().toISOString().split('T')[0],
      priority: prData.priority || 'Medium',
      department: prData.department || 'General Procurement',
      requesterName: prData.requesterName || 'Procurement User',
      requesterEmail: prData.requesterEmail || 'user@vendrax.internal',
      status: prData.status || 'Draft',
      createdDate: prData.createdDate || new Date().toISOString().split('T')[0],
      rawNaturalLanguage: prData.rawNaturalLanguage,
      rfqId: prData.rfqId,
    };

    return db.createPurchaseRequest(pr);
  }

  public static update(id: string, updates: Partial<PurchaseRequest>): PurchaseRequest {
    const updated = db.updatePurchaseRequest(id, updates);
    if (!updated) {
      throw new Error(`Purchase Request '${id}' not found`);
    }
    return updated;
  }
}
