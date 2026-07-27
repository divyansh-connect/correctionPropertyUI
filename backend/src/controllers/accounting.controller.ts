import { Request, Response, NextFunction } from 'express';
import { accountingService } from '../services/accounting.service';
import { sendSuccess } from '../utils/apiResponse';

export class AccountingController {
  async getCoA(req: Request, res: Response, next: NextFunction) {
    try {
      const coa = await accountingService.getChartOfAccounts();
      return sendSuccess({ res, data: coa });
    } catch (error) {
      next(error);
    }
  }

  async createAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await accountingService.createAccount(req.body);
      return sendSuccess({ res, statusCode: 201, data: account });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await accountingService.deleteAccount(req.params.id as string);
      return sendSuccess({ res, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }

  async getJournalEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const entries = await accountingService.getJournalEntries();
      return sendSuccess({ res, data: entries });
    } catch (error) {
      next(error);
    }
  }

  async getGeneralLedger(req: Request, res: Response, next: NextFunction) {
    try {
      const ledger = await accountingService.getGeneralLedger();
      return sendSuccess({ res, data: ledger });
    } catch (error) {
      next(error);
    }
  }

  async getBankAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const bankAccounts = await accountingService.getBankAccounts();
      return sendSuccess({ res, data: bankAccounts });
    } catch (error) {
      next(error);
    }
  }

  async createBankAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const bankAccount = await accountingService.createBankAccount(req.body);
      return sendSuccess({ res, statusCode: 201, data: bankAccount });
    } catch (error) {
      next(error);
    }
  }

  async deleteBankAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await accountingService.deleteBankAccount(req.params.id as string);
      return sendSuccess({ res, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }

  async getBankReconciliation(req: Request, res: Response, next: NextFunction) {
    try {
      const recon = await accountingService.getBankReconciliation();
      return sendSuccess({ res, data: recon });
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
