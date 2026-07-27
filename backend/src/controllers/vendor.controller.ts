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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyName, contactName, email, phone, serviceType, rating } = req.body;
      const vendor = await prisma.vendor.update({
        where: { id: req.params.id as string },
        data: { companyName, contactName, email, phone, serviceType, rating },
      });
      return sendSuccess({ res, data: vendor });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.vendor.delete({
        where: { id: req.params.id as string },
      });
      return sendSuccess({ res, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }
}

export const vendorController = new VendorController();
