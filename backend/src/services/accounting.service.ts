import prisma from '../config/database.js';
import { AppError } from '../utils/appError.js';

export class AccountingService {
  async getChartOfAccounts() {
    return prisma.coAAccount.findMany({
      orderBy: { accountCode: 'asc' },
    });
  }

  async postJournalEntry(data: { description: string; lines: Array<{ accountId: string; debit: number; credit: number }> }) {
    const totalDebit = data.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + (l.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.001) {
      throw new AppError('Double-entry validation failed: Total Debits must equal Total Credits.', 422, 'BALANCING_ERROR');
    }

    return prisma.journalEntry.create({
      data: {
        entryNumber: `JE-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date(),
        description: data.description,
        lines: {
          create: data.lines.map((l) => ({
            accountId: l.accountId,
            debit: l.debit || 0,
            credit: l.credit || 0,
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });
  }
}

export const accountingService = new AccountingService();
