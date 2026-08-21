import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class InventoryController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const items = InventoryService.getAll();
      return sendSuccess(res, items, 'Inventory stock retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async getMovements(req: Request, res: Response, next: NextFunction) {
    try {
      const movements = InventoryService.getMovements();
      return sendSuccess(res, movements, 'Inventory movements history retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async receiveGoods(req: Request, res: Response, next: NextFunction) {
    try {
      const { sku, itemId, quantity, poNumber, warehouseLocation, actorName } = req.body;
      const targetId = sku || itemId;

      if (!targetId || !quantity || !poNumber) {
        return sendError(res, 'sku/itemId, quantity, and poNumber are required', 400);
      }

      const result = InventoryService.processGoodsReceipt(
        targetId,
        Number(quantity),
        poNumber,
        warehouseLocation,
        actorName || req.user?.name
      );

      return sendSuccess(res, result, 'Goods receipt (GRN) processed and stock updated successfully', 201);
    } catch (err) {
      next(err);
    }
  }
}
