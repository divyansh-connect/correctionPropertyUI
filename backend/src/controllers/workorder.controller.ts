import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class WorkOrderController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workOrders = await prisma.workOrder.findMany({
        include: {
          property: true,
          vendor: true,
        },
      });
      return sendSuccess({ res, data: workOrders });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, title, description, vendorId, priority, status, estimatedCost, actualCost } = req.body;
      const workOrder = await prisma.workOrder.create({
        data: {
          propertyId,
          title,
          description,
          vendorId,
          priority: priority || 'Normal',
          status: status || 'Open',
          estimatedCost,
          actualCost,
        },
      });
      return sendSuccess({ res, statusCode: 201, data: workOrder });
    } catch (error) {
      next(error);
    }
  }
}

export const workOrderController = new WorkOrderController();
