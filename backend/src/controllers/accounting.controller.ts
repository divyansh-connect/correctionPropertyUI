import { Request, Response, NextFunction } from 'express';
import { accountingService } from '../services/accounting.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class AccountingController {
  async getCoA(req: Request, res: Response, next: NextFunction) {
    try {
      const coa = await accountingService.getChartOfAccounts();
      return sendSuccess({ res, data: coa });
    } catch (error) {
      next(error);
    }
  }

  async postJournalEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const entry = await accountingService.postJournalEntry(req.body);
      return sendSuccess({ res, statusCode: 201, data: entry });
    } catch (error) {
      next(error);
    }
  }
}

export const accountingController = new AccountingController();
