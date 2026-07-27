import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service';
import { sendSuccess } from '../utils/apiResponse';

export class PaymentController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const payments = await paymentService.getAllPayments();
      return sendSuccess({ res, data: payments });
    } catch (error) {
      next(error);
    }
  }

  async processPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.processPayment(req.body);
      return sendSuccess({ res, statusCode: 201, data: payment });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();
