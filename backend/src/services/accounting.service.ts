import prisma from '../config/database';
import { AppError } from '../utils/appError';

export class AccountingService {
  async getChartOfAccounts() {
    return prisma.coAAccount.findMany({
      orderBy: { accountCode: 'asc' },
    });
  }

  async createAccount(data: { accountCode: string; accountName: string; type: string; balance?: number }) {
    return prisma.coAAccount.create({
      data: {
        accountCode: data.accountCode,
        accountName: data.accountName,
        type: data.type,
        balance: data.balance || 0,
      },
    });
  }

  async deleteAccount(id: string) {
    return prisma.coAAccount.delete({
      where: { id },
    });
  }

  async getJournalEntries() {
    return prisma.journalEntry.findMany({
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async getGeneralLedger() {
    // Return all journal entry lines representing the ledger transactions
    return prisma.journalEntryLine.findMany({
      include: {
        account: true,
        journalEntry: true,
      },
      orderBy: {
        journalEntry: {
          date: 'desc',
        },
      },
    });
  }

  async getBankAccounts() {
    return prisma.bankAccount.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createBankAccount(data: any) {
    return prisma.bankAccount.create({
      data: {
        name: data.name,
        institution: data.institution,
        accountNumber: data.accountNumber,
        balance: parseFloat(data.balance || '0'),
        type: data.type || 'Checking',
        status: data.status || 'Active',
      },
    });
  }

  async deleteBankAccount(id: string) {
    return prisma.bankAccount.delete({
      where: { id },
    });
  }

  async getBankReconciliation() {
    // Return simple bank reconciliation data
    const bankAccounts = await this.getBankAccounts();
    return bankAccounts.map((ba) => ({
      id: `rec-${ba.id}`,
      bankAccountId: ba.id,
      bankAccountName: ba.name,
      statementDate: new Date(),
      statementEndingBalance: ba.balance,
      clearedBalance: ba.balance,
      difference: 0.00,
      status: 'Reconciled',
    }));
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
