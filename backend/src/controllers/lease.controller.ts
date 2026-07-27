import { Request, Response, NextFunction } from 'express';
import { leaseService } from '../services/lease.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class LeaseController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const leases = await leaseService.getAllLeases();
      return sendSuccess({ res, data: leases });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lease = await leaseService.createLease(req.body);
      return sendSuccess({ res, statusCode: 201, data: lease });
    } catch (error) {
      next(error);
    }
  }
}

export const leaseController = new LeaseController();
