import { Request, Response, NextFunction } from 'express';
import { CopilotService } from '../services/copilotService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class CopilotController {
  public static async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, messages, conversationHistory, contextRfqId, rfqContext, actionRequested } = req.body;
      const userMessage = message || (messages && messages[messages.length - 1]?.content);

      if (!userMessage) {
        return sendError(res, 'message or messages array is required', 400);
      }

      const history = conversationHistory || (messages ? messages.slice(0, -1) : []);
      const rfqId = contextRfqId || (rfqContext && rfqContext.id);

      const result = await CopilotService.processChat({
        message: userMessage,
        conversationHistory: history,
        contextRfqId: rfqId,
        actionRequested,
      });

      return sendSuccess(res, result, 'Copilot response generated');
    } catch (err) {
      next(err);
    }
  }
}
