import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class OwnerController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const owners = await prisma.owner.findMany({
        include: {
          properties: true,
        },
      });
      return sendSuccess({ res, data: owners });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, phone, payoutMethod } = req.body;
      const owner = await prisma.owner.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          payoutMethod: payoutMethod || 'ACH/Direct Deposit',
        },
      });
      return sendSuccess({ res, statusCode: 201, data: owner });
    } catch (error) {
      next(error);
    }
  }
}

export const ownerController = new OwnerController();
