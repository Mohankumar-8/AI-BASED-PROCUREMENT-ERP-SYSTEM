import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';
import { sendSuccess } from '../middleware/authMiddleware';

export class DashboardController {
  public static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = DashboardService.getMetrics();
      return sendSuccess(res, metrics, 'Dashboard KPI metrics retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async getSpending(req: Request, res: Response, next: NextFunction) {
    try {
      const spending = DashboardService.getSpending();
      return sendSuccess(res, spending, 'Spending breakdown retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async getVendorPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const performance = DashboardService.getVendorPerformance();
      return sendSuccess(res, performance, 'Vendor performance benchmark retrieved');
    } catch (err) {
      next(err);
    }
  }

  public static async getInsights(req: Request, res: Response, next: NextFunction) {
    try {
      const insights = DashboardService.getInsights();
      return sendSuccess(res, insights, 'Strategic procurement insights retrieved');
    } catch (err) {
      next(err);
    }
  }
}
