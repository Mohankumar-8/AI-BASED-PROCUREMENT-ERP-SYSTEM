import { Request, Response, NextFunction } from 'express';
import { QuotationService } from '../services/quotationService';
import { QuotationExtractionService } from '../services/quotationExtractionService';
import { sendSuccess, sendError } from '../middleware/authMiddleware';

export class QuotationController {
  public static async uploadQuotation(req: Request, res: Response, next: NextFunction) {
    try {
      const { rfqId, rawQuoteText, rawText, fileName, vendorId } = req.body;
      const textToProcess = rawQuoteText || rawText;

      if (!rfqId) {
        return sendError(res, 'rfqId is required', 400);
      }
      if (!textToProcess) {
        return sendError(res, 'rawQuoteText or rawText is required', 400);
      }

      const quote = await QuotationService.processQuotationPipeline(
        rfqId,
        textToProcess,
        fileName || 'Uploaded_Quotation.pdf',
        vendorId
      );

      return sendSuccess(res, quote, 'Quotation processed through full intelligence pipeline successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quote = QuotationService.getQuotationById(id);
      if (!quote) {
        return sendError(res, `Quotation '${id}' not found`, 404);
      }
      return sendSuccess(res, quote);
    } catch (err) {
      next(err);
    }
  }

  public static async extractRaw(req: Request, res: Response, next: NextFunction) {
    try {
      const { rawQuoteText, rawText, fileName, vendorName } = req.body;
      const input = rawQuoteText || rawText;
      if (!input) {
        return sendError(res, 'rawQuoteText is required', 400);
      }

      const extracted = await QuotationExtractionService.extract(input, fileName, vendorName);
      return sendSuccess(res, extracted, 'Quotation terms extracted successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const quote = QuotationService.getQuotationById(id);
      if (!quote) {
        return sendError(res, `Quotation '${id}' not found`, 404);
      }

      const analysis = QuotationService.analyzeQuotations(quote.rfqId);
      return sendSuccess(res, { quote, analysis }, 'Quotation analysis completed');
    } catch (err) {
      next(err);
    }
  }
}
