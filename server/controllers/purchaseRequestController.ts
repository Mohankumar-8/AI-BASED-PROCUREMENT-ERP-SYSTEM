import { Request, Response, NextFunction } from 'express';
import { PurchaseRequestService } from '../services/purchaseRequestService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class PurchaseRequestController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const requests = PurchaseRequestService.getAll();
      return sendSuccess(res, requests, 'Purchase requests retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const request = PurchaseRequestService.getById(id);
      if (!request) {
        return sendError(res, `Purchase Request '${id}' not found`, 404);
      }
      return sendSuccess(res, request);
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { rawNaturalLanguage, department, ...rest } = req.body;

      if (rawNaturalLanguage) {
        const pr = await PurchaseRequestService.createFromNaturalLanguage(
          rawNaturalLanguage,
          department || req.user?.department,
          req.user?.name,
          req.user?.email
        );
        return sendSuccess(res, pr, 'Purchase Request created from natural language requirement', 201);
      }

      const pr = PurchaseRequestService.create({
        ...rest,
        department: department || req.user?.department,
        requesterName: req.body.requesterName || req.user?.name,
        requesterEmail: req.body.requesterEmail || req.user?.email,
      });

      return sendSuccess(res, pr, 'Purchase Request created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = PurchaseRequestService.update(id, req.body);
      return sendSuccess(res, updated, 'Purchase Request updated successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async parseNaturalLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, rawRequestText, department } = req.body;
      const input = text || rawRequestText;
      if (!input) {
        return sendError(res, 'Requirement text is required', 400);
      }

      const parsed = await PurchaseRequestService.parseNaturalLanguage(input, department || req.user?.department);
      return sendSuccess(res, parsed, 'Natural language requirement parsed successfully');
    } catch (err) {
      next(err);
    }
  }
}
