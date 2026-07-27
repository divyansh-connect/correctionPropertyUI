import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class TenantController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await prisma.tenant.findMany({
        include: {
          unit: {
            include: {
              property: true,
            },
          },
          leases: true,
        },
      });
      return sendSuccess({ res, data: tenants });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, phone, unitId, status } = req.body;
      const tenant = await prisma.tenant.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          unitId,
          status: status || 'Pending',
        },
      });
      return sendSuccess({ res, statusCode: 201, data: tenant });
    } catch (error) {
      next(error);
    }
  }
}

export const tenantController = new TenantController();
