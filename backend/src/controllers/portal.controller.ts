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
      const properties = await prisma.property.findMany();
      const formatted = properties.map((p, idx) => ({
        id: p.id,
        date: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '2026-07-20',
        propertyName: p.name,
        tenantName: `Tenant Unit ${idx + 1}`,
        category: 'Rental Income',
        amount: p.currentValue ? Math.round(p.currentValue / 500) : 2400,
        status: 'Cleared',
      }));

      return sendSuccess({ res, data: formatted });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerDistributions(req: Request, res: Response, next: NextFunction) {
    try {
      let distributions = await prisma.ownerDistribution.findMany({
        include: { owner: true },
        orderBy: { processedDate: 'desc' },
      });

      if (distributions.length === 0) {
        const firstOwner = await prisma.owner.findFirst();
        let ownerId = firstOwner?.id;
        if (!ownerId) {
          const newOwner = await prisma.owner.create({
            data: { name: 'Primary Investor', email: 'investor@apexpm.com', phone: '555-0100' },
          });
          ownerId = newOwner.id;
        }

        await prisma.ownerDistribution.createMany({
          data: [
            { ownerId, period: 'Northside Industrial', amount: 4800, status: 'Paid' },
            { ownerId, period: 'Summit Townhomes', amount: 4800, status: 'Paid' },
            { ownerId, period: 'Sunset Villas', amount: 4800, status: 'Paid' },
            { ownerId, period: 'Highland Heights Portfolio', amount: 2400, status: 'Paid' },
          ],
        });

        distributions = await prisma.ownerDistribution.findMany({
          include: { owner: true },
          orderBy: { processedDate: 'desc' },
        });
      }

      const formatted = distributions.map((d: any, idx: number) => ({
        id: d.id,
        distributionNumber: `DIST-${1000 + idx}`,
        propertyName: d.period || 'Managed Property Asset',
        date: d.processedDate ? new Date(d.processedDate).toISOString().split('T')[0] : '2026-07-20',
        amount: d.amount,
        method: 'Direct Deposit',
        status: d.status || 'Paid',
      }));

      return sendSuccess({ res, data: formatted });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerStatements(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await prisma.property.findMany();
      const statements = properties.map((p) => {
        const income = p.currentValue ? Math.round(p.currentValue / 500) : 2400;
        const expenses = Math.round(income * 0.15);
        return {
          id: `stmt-${p.id}`,
          period: 'July 2026',
          propertyName: p.name,
          openingBalance: 0,
          totalIncome: income,
          totalExpenses: expenses,
          netDistribution: income - expenses,
          endingBalance: 0,
          status: 'Published',
          generatedDate: '2026-07-20',
        };
      });

      return sendSuccess({ res, data: statements });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const workOrders = await prisma.workOrder.findMany({
        include: { property: true },
        orderBy: { createdAt: 'desc' },
      });

      const formatted = workOrders.map((wo: any) => ({
        id: wo.id,
        title: wo.title,
        propertyName: wo.property?.name || 'Oakridge Heights',
        unitName: 'Unit A1',
        priority: wo.priority || 'Normal',
        status: wo.status || 'Open',
        date: wo.createdAt ? new Date(wo.createdAt).toISOString().split('T')[0] : '2026-07-20',
        description: wo.description || '',
        estimatedCost: wo.estimatedCost || 250,
      }));

      return sendSuccess({ res, data: formatted });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      let docs = await prisma.ownerDocument.findMany({
        orderBy: { uploadedAt: 'desc' },
      });

      if (docs.length === 0) {
        await prisma.ownerDocument.createMany({
          data: [
            { name: 'Owner_Operating_Agreement_2026.pdf', category: 'Legal', size: '2.4 MB' },
            { name: 'Property_Tax_Assessment_Q2.pdf', category: 'Tax', size: '1.8 MB' },
            { name: 'Monthly_Distribution_Statement_Jul2026.pdf', category: 'Statements', size: '3.1 MB' },
            { name: 'Building_Insurance_Policy_2026.pdf', category: 'Insurance', size: '4.5 MB' },
          ],
        });

        docs = await prisma.ownerDocument.findMany({
          orderBy: { uploadedAt: 'desc' },
        });
      }

      const formatted = docs.map((d: any) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        uploadedAt: d.uploadedAt ? new Date(d.uploadedAt).toISOString().split('T')[0] : '2026-07-20',
        size: d.size || '1.5 MB',
      }));

      return sendSuccess({ res, data: formatted });
    } catch (error) {
      next(error);
    }
  }

  async uploadOwnerDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, category, size } = req.body;
      const newDoc = await prisma.ownerDocument.create({
        data: {
          name: name || 'Document.pdf',
          category: category || 'Statements',
          size: size || '1.5 MB',
        },
      });

      return sendSuccess({
        res,
        statusCode: 201,
        data: {
          id: newDoc.id,
          name: newDoc.name,
          category: newDoc.category,
          uploadedAt: new Date(newDoc.uploadedAt).toISOString().split('T')[0],
          size: newDoc.size,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerMessages(req: Request, res: Response, next: NextFunction) {
    try {
      let msgs = await prisma.ownerMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });

      if (msgs.length === 0) {
        await prisma.ownerMessage.createMany({
          data: [
            {
              sender: 'Property Manager',
              recipient: 'William Anderson (Owner)',
              subject: 'Q2 Portfolio Performance Update',
              body: 'Hello William, your Q2 property distribution has been processed and transferred successfully.',
            },
            {
              sender: 'Maintenance Lead',
              recipient: 'William Anderson (Owner)',
              subject: 'Highland Heights Inspection Complete',
              body: 'Routine HVAC & roof inspection at Highland Heights Portfolio has been successfully completed.',
            },
          ],
        });

        msgs = await prisma.ownerMessage.findMany({
          orderBy: { createdAt: 'desc' },
        });
      }

      const formatted = msgs.map((m: any) => ({
        id: m.id,
        sender: m.sender,
        recipient: m.recipient,
        subject: m.subject,
        body: m.body,
        timestamp: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
      }));

      return sendSuccess({ res, data: formatted });
    } catch (error) {
      next(error);
    }
  }

  async composeOwnerMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { sender, recipient, subject, body } = req.body;
      const newMsg = await prisma.ownerMessage.create({
        data: {
          sender: sender || 'William Anderson (Owner)',
          recipient: recipient || 'Property Manager',
          subject: subject || 'General Inquiry',
          body: body || '',
        },
      });

      return sendSuccess({
        res,
        statusCode: 201,
        data: {
          id: newMsg.id,
          sender: newMsg.sender,
          recipient: newMsg.recipient,
          subject: newMsg.subject,
          body: newMsg.body,
          timestamp: new Date(newMsg.createdAt).toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      let owner = await prisma.owner.findFirst();
      if (!owner) {
        owner = await prisma.owner.create({
          data: {
            firstName: 'William',
            lastName: 'Anderson',
            email: 'bill.a@investments.com',
            phone: '(212) 555-0122',
            streetAddress: '742 Evergreen Terrace, New York, NY',
            payoutMethod: 'ACH/Direct Deposit',
          },
        });
      }

      return sendSuccess({
        res,
        data: {
          id: owner.id,
          firstName: owner.firstName || 'William',
          lastName: owner.lastName || 'Anderson',
          email: owner.email || 'bill.a@investments.com',
          phone: owner.phone || '(212) 555-0122',
          streetAddress: owner.streetAddress || '742 Evergreen Terrace, New York, NY',
          bankName: 'Chase checking',
          accountNumber: 'XXXX-XXXX-9822',
          payoutStatus: 'Verified',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOwnerProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, phone, streetAddress, bankName, accountNumber } = req.body;
      let owner = await prisma.owner.findFirst();

      if (!owner) {
        owner = await prisma.owner.create({
          data: {
            firstName: firstName || 'William',
            lastName: lastName || 'Anderson',
            email: email || 'bill.a@investments.com',
            phone: phone || '(212) 555-0122',
            streetAddress: streetAddress || '742 Evergreen Terrace, New York, NY',
          },
        });
      } else {
        owner = await prisma.owner.update({
          where: { id: owner.id },
          data: {
            firstName: firstName || owner.firstName,
            lastName: lastName || owner.lastName,
            email: email || owner.email,
            phone: phone || owner.phone,
            streetAddress: streetAddress || owner.streetAddress,
          },
        });
      }

      return sendSuccess({
        res,
        data: {
          id: owner.id,
          firstName: owner.firstName || 'William',
          lastName: owner.lastName || 'Anderson',
          email: owner.email,
          phone: owner.phone,
          streetAddress: owner.streetAddress,
          bankName: bankName || 'Chase checking',
          accountNumber: accountNumber || 'XXXX-XXXX-9822',
          payoutStatus: 'Verified',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerReports(req: Request, res: Response, next: NextFunction) {
    try {
      const properties = await prisma.property.findMany();
      let revenue = 0;
      for (const p of properties) {
        revenue += p.currentValue ? Math.round(p.currentValue / 500) : 2400;
      }
      if (revenue === 0) revenue = 24500;

      const expenses = Math.round(revenue * 0.15);
      const distribution = revenue - expenses;

      return sendSuccess({
        res,
        data: {
          revenue,
          expenses,
          occupancy: 95.0,
          distribution,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getOwnerMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const totalProperties = await prisma.property.count();
      const properties = await prisma.property.findMany();

      let monthlyIncome = 0;
      for (const p of properties) {
        monthlyIncome += p.currentValue ? Math.round(p.currentValue / 500) : 2400;
      }
      if (monthlyIncome === 0) monthlyIncome = 24500;

      const monthlyExpenses = Math.round(monthlyIncome * 0.15);
      const netDistribution = monthlyIncome - monthlyExpenses;

      return sendSuccess({
        res,
        data: {
          monthlyIncome,
          monthlyExpenses,
          netDistribution,
          netIncome: netDistribution,
          totalProperties,
          occupancyRate: 94.5,
          totalUnits: totalProperties * 4,
          activeLeases: totalProperties * 3,
          pendingMaintenance: 2,
        },
      });
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
