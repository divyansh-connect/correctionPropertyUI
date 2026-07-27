import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../utils/apiResponse';

export class PortalController {
  // --- Tenant Portal Views ---
  async getTenantLeases(req: Request, res: Response, next: NextFunction) {
    try {
      const leases = await prisma.lease.findMany({
        include: {
          property: true,
          unit: true,
        },
      });
      return sendSuccess({ res, data: leases });
    } catch (error) {
      next(error);
    }
  }

  async getTenantMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await prisma.workOrder.findMany({
        include: {
          property: true,
        },
      });
      return sendSuccess({ res, data: orders });
    } catch (error) {
      next(error);
    }
  }

  async getTenantDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const documents = await prisma.document.findMany({
        where: { category: { in: ['Leasing', 'Onboarding'] } },
      });
      return sendSuccess({ res, data: documents });
    } catch (error) {
      next(error);
    }
  }

  // --- Owner Portal Views ---
  async getOwnerFinancials(req: Request, res: Response, next: NextFunction) {
    try {
      const distributions = await prisma.ownerDistribution.findMany({
        include: {
          owner: true,
        },
      });
      return sendSuccess({ res, data: distributions });
    } catch (error) {
      next(error);
    }
  }

  // --- Super Admin Portal Views ---
  async getSuperAdminBilling(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await prisma.subscriptionPlan.findFirst();
      return sendSuccess({
        res,
        data: plan || {
          planName: 'Enterprise SaaS Tier',
          price: 499,
          billingCycle: 'Monthly',
          nextInvoice: new Date('2026-08-01'),
          usageLimit: 'Unlimited Properties',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSuperAdminSecurity(req: Request, res: Response, next: NextFunction) {
    try {
      const policy = await prisma.securityPolicy.findFirst();
      return sendSuccess({
        res,
        data: policy || {
          mfaRequired: true,
          sessionTimeout: 30,
          passwordPolicy: 'Strong (min 10 chars, symbols)',
          ipWhitelist: '192.168.1.0/24',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSuperAdminAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await prisma.auditLog.findMany({
        include: {
          user: true,
        },
        orderBy: { timestamp: 'desc' },
      });
      return sendSuccess({ res, data: logs });
    } catch (error) {
      next(error);
    }
  }

  // --- Collections & Other Operations ---
  async getCollectionPaymentPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await prisma.paymentPlan.findMany({
        include: {
          tenant: true,
        },
      });
      return sendSuccess({ res, data: plans });
    } catch (error) {
      next(error);
    }
  }

  async createCollectionPaymentPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, totalAmount, frequency } = req.body;
      const plan = await prisma.paymentPlan.create({
        data: {
          tenantId,
          totalAmount: parseFloat(totalAmount),
          frequency,
        },
      });
      return sendSuccess({ res, statusCode: 201, data: plan });
    } catch (error) {
      next(error);
    }
  }

  async getCrmLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const leads = await prisma.crmLead.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return sendSuccess({ res, data: leads });
    } catch (error) {
      next(error);
    }
  }

  async createCrmLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, phone, source } = req.body;
      const lead = await prisma.crmLead.create({
        data: { name, email, phone, source },
      });
      return sendSuccess({ res, statusCode: 201, data: lead });
    } catch (error) {
      next(error);
    }
  }

  async getScreeningReports(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await prisma.screeningReport.findMany({
        include: { tenant: true },
      });
      return sendSuccess({ res, data: reports });
    } catch (error) {
      next(error);
    }
  }

  async createScreeningReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId, creditScore, criminalPass, evictionPass, status } = req.body;
      const report = await prisma.screeningReport.create({
        data: {
          tenantId,
          creditScore: parseInt(creditScore),
          criminalPass: criminalPass ?? true,
          evictionPass: evictionPass ?? true,
          status: status || 'Approved',
        },
      });
      return sendSuccess({ res, statusCode: 201, data: report });
    } catch (error) {
      next(error);
    }
  }

  async getViolations(req: Request, res: Response, next: NextFunction) {
    try {
      const violations = await prisma.violation.findMany({
        include: {
          unit: {
            include: { property: true },
          },
        },
      });
      return sendSuccess({ res, data: violations });
    } catch (error) {
      next(error);
    }
  }

  async createViolation(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId, title, description, fineAmount } = req.body;
      const violation = await prisma.violation.create({
        data: {
          unitId,
          title,
          description,
          fineAmount: parseFloat(fineAmount || '0'),
        },
      });
      return sendSuccess({ res, statusCode: 201, data: violation });
    } catch (error) {
      next(error);
    }
  }
}

export const portalController = new PortalController();
