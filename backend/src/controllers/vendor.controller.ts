import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class VendorController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await prisma.vendor.findMany({
        include: {
          workOrders: true,
        },
      });
      return sendSuccess({ res, data: vendors });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyName, contactName, email, phone, serviceType, rating } = req.body;
      const vendor = await prisma.vendor.create({
        data: {
          companyName,
          contactName,
          email,
          phone,
          serviceType,
          rating: rating || 5.0,
        },
      });
      return sendSuccess({ res, statusCode: 201, data: vendor });
    } catch (error) {
      next(error);
    }
  }
}

export const vendorController = new VendorController();
