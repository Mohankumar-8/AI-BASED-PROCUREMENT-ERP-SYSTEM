import { Request, Response, NextFunction } from 'express';
import { RfqService } from '../services/rfqService';
import { QuotationService } from '../services/quotationService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class RfqController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const rfqs = RfqService.getAll();
      return sendSuccess(res, rfqs, 'RFQs retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const rfq = RfqService.getById(id);
      if (!rfq) {
        return sendError(res, `RFQ '${id}' not found`, 404);
      }
      return sendSuccess(res, rfq);
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const rfq = RfqService.create(req.body);
      return sendSuccess(res, rfq, 'RFQ created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  public static async inviteVendors(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { vendorIds } = req.body;
      if (!vendorIds || !Array.isArray(vendorIds)) {
        return sendError(res, 'vendorIds array is required', 400);
      }
      const updated = RfqService.inviteVendors(id, vendorIds);
      return sendSuccess(res, updated, 'Vendors invited successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async generateFromPurchaseRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const purchaseRequestId = req.body.purchaseRequestId || id;
      const rfq = RfqService.generateFromPurchaseRequest(purchaseRequestId);
      return sendSuccess(res, rfq, 'RFQ generated from Purchase Request successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  public static async getQuotations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quotes = QuotationService.getQuotationsByRfq(id);
      return sendSuccess(res, quotes, 'Quotations retrieved for RFQ');
    } catch (err) {
      next(err);
    }
  }

  public static async analyzeQuotations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const analysis = QuotationService.analyzeQuotations(id);
      return sendSuccess(res, analysis, 'Multi-quote analysis and recommendation completed');
    } catch (err) {
      next(err);
    }
  }
}
