import { Request, Response, NextFunction } from 'express';
import { FinanceService } from '../services/financeService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class FinanceController {
  public static async getAllInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const invoices = FinanceService.getAllInvoices();
      return sendSuccess(res, invoices, 'Finance invoice ledger retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async getInvoiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const invoice = FinanceService.getInvoiceById(id);
      if (!invoice) {
        return sendError(res, `Invoice '${id}' not found`, 404);
      }
      return sendSuccess(res, invoice);
    } catch (err) {
      next(err);
    }
  }

  public static async matchThreeWay(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId, invoiceAmount, grnQuantity } = req.body;
      if (!invoiceId || invoiceAmount === undefined || grnQuantity === undefined) {
        return sendError(res, 'invoiceId, invoiceAmount, and grnQuantity are required', 400);
      }

      const result = FinanceService.matchThreeWay(invoiceId, Number(invoiceAmount), Number(grnQuantity));
      return sendSuccess(res, result, '3-Way reconciliation matched successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { invoiceId, paymentAmount } = req.body;
      if (!invoiceId || !paymentAmount) {
        return sendError(res, 'invoiceId and paymentAmount are required', 400);
      }

      const result = FinanceService.processPayment(invoiceId, Number(paymentAmount));
      return sendSuccess(res, result, 'Payment recorded successfully');
    } catch (err) {
      next(err);
    }
  }
}
