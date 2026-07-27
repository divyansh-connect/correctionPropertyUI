import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../utils/apiResponse';

export class ApplicationController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await prisma.application.findMany({
        orderBy: { submittedDate: 'desc' },
      });
      return sendSuccess({ res, data: applications });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantName, email, propertyName, unitNumber, rentProposed, status, submittedDate } = req.body;
      const application = await prisma.application.create({
        data: {
          tenantName,
          email,
          propertyName,
          unitNumber,
          rentProposed: parseFloat(rentProposed || '0'),
          status: status || 'Pending',
          submittedDate: submittedDate ? new Date(submittedDate) : new Date(),
        },
      });
      return sendSuccess({ res, statusCode: 201, data: application });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const application = await prisma.application.update({
        where: { id: req.params.id as string },
        data: { status },
      });
      return sendSuccess({ res, data: application });
    } catch (error) {
      next(error);
    }
  }
}

export const applicationController = new ApplicationController();
