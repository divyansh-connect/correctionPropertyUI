import { Request, Response, NextFunction } from 'express';
import { secondaryService } from '../services/secondary.service';
import { sendSuccess } from '../utils/apiResponse';

export class SecondaryController {
  // Announcements
  async getAnnouncements(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await secondaryService.getAnnouncements();
      return sendSuccess({ res, data: list });
    } catch (error) {
      next(error);
    }
  }

  async createAnnouncement(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await secondaryService.createAnnouncement(req.body);
      return sendSuccess({ res, statusCode: 201, data: item });
    } catch (error) {
      next(error);
    }
  }

  // Insurance
  async getInsurancePolicies(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await secondaryService.getInsurancePolicies();
      return sendSuccess({ res, data: list });
    } catch (error) {
      next(error);
    }
  }

  async createInsurancePolicy(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await secondaryService.createInsurancePolicy(req.body);
      return sendSuccess({ res, statusCode: 201, data: item });
    } catch (error) {
      next(error);
    }
  }

  // Promotions
  async getPromotions(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await secondaryService.getPromotions();
      return sendSuccess({ res, data: list });
    } catch (error) {
      next(error);
    }
  }

  async createPromotion(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await secondaryService.createPromotion(req.body);
      return sendSuccess({ res, statusCode: 201, data: item });
    } catch (error) {
      next(error);
    }
  }

  // Notifications
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await secondaryService.getNotifications();
      return sendSuccess({ res, data: list });
    } catch (error) {
      next(error);
    }
  }

  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const item = await secondaryService.markNotificationRead(id);
      return sendSuccess({ res, data: item });
    } catch (error) {
      next(error);
    }
  }

  // Documents
  async getDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await secondaryService.getDocuments();
      return sendSuccess({ res, data: list });
    } catch (error) {
      next(error);
    }
  }

  async createDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await secondaryService.createDocument(req.body);
      return sendSuccess({ res, statusCode: 201, data: item });
    } catch (error) {
      next(error);
    }
  }

  // AI Chat
  async processAiChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { prompt } = req.body;
      const result = await secondaryService.processAiChat(prompt || 'Show summary');
      return sendSuccess({ res, data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const secondaryController = new SecondaryController();
