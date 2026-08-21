import { Request, Response, NextFunction } from 'express';
import { VendorService } from '../services/vendorService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class VendorController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = VendorService.getAll();
      return sendSuccess(res, vendors, 'Vendors retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const vendor = VendorService.getById(id);
      if (!vendor) {
        return sendError(res, `Vendor '${id}' not found`, 404);
      }
      return sendSuccess(res, vendor);
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const vendor = VendorService.create(req.body);
      return sendSuccess(res, vendor, 'Vendor created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = VendorService.update(id, req.body);
      return sendSuccess(res, updated, 'Vendor updated successfully');
    } catch (err) {
      next(err);
    }
  }
}
