import { Request, Response, NextFunction } from 'express';
import { PurchaseOrderService } from '../services/purchaseOrderService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class PurchaseOrderController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pos = PurchaseOrderService.getAll();
      return sendSuccess(res, pos, 'Purchase orders retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const po = PurchaseOrderService.getById(id);
      if (!po) {
        return sendError(res, `Purchase Order '${id}' not found`, 404);
      }
      return sendSuccess(res, po);
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { rfqId, quoteId, deliveryAddress, ...manualData } = req.body;

      if (rfqId) {
        const po = PurchaseOrderService.createFromApprovedQuote(rfqId, quoteId, deliveryAddress);
        return sendSuccess(res, po, 'Purchase Order created from approved quotation successfully', 201);
      }

      const po = PurchaseOrderService.create(manualData);
      return sendSuccess(res, po, 'Purchase Order created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  public static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const po = PurchaseOrderService.approve(id);
      return sendSuccess(res, po, 'Purchase Order acknowledged & released');
    } catch (err) {
      next(err);
    }
  }
}
