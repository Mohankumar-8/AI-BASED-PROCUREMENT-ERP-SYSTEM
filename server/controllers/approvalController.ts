import { Request, Response, NextFunction } from 'express';
import { ApprovalEngine } from '../services/approvalEngine';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class ApprovalController {
  public static async evaluate(req: Request, res: Response, next: NextFunction) {
    try {
      const { rfqId, quoteId, totalAmount, riskLevel, vendorScore } = req.body;

      if (rfqId) {
        const evaluation = ApprovalEngine.evaluateRfqApproval(rfqId, quoteId);
        return sendSuccess(res, evaluation, 'Approval policy evaluated successfully');
      }

      if (totalAmount !== undefined && riskLevel && vendorScore !== undefined) {
        const evaluation = ApprovalEngine.evaluatePolicy(totalAmount, riskLevel, vendorScore);
        return sendSuccess(res, evaluation, 'Approval policy evaluated successfully');
      }

      return sendError(res, 'rfqId or (totalAmount, riskLevel, vendorScore) required', 400);
    } catch (err) {
      next(err);
    }
  }

  public static async approve(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { approverName, notes } = req.body;

      const rfq = ApprovalEngine.approveRfq(id, approverName || req.user?.name, notes);
      return sendSuccess(res, rfq, 'RFQ approved and marked ready for Purchase Order issuance');
    } catch (err) {
      next(err);
    }
  }

  public static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rejectorName, reason } = req.body;

      if (!reason) {
        return sendError(res, 'Rejection reason is required', 400);
      }

      const rfq = ApprovalEngine.rejectRfq(id, rejectorName || req.user?.name || 'Reviewer', reason);
      return sendSuccess(res, rfq, 'RFQ approval rejected');
    } catch (err) {
      next(err);
    }
  }
}
