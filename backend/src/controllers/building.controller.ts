import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../utils/apiResponse';

export class BuildingController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const buildings = await prisma.building.findMany({
        include: {
          property: true,
          units: true,
        },
      });
      return sendSuccess({ res, data: buildings });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, name, floors, unitsCount, occupancyRate } = req.body;
      const building = await prisma.building.create({
        data: {
          propertyId,
          name,
          floors: parseInt(floors || '1'),
          unitsCount: parseInt(unitsCount || '0'),
          occupancyRate: parseFloat(occupancyRate || '0'),
        },
      });
      return sendSuccess({ res, statusCode: 201, data: building });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { propertyId, name, floors, unitsCount, occupancyRate } = req.body;
      const building = await prisma.building.update({
        where: { id: req.params.id as string },
        data: {
          propertyId,
          name,
          floors: floors !== undefined ? parseInt(floors) : undefined,
          unitsCount: unitsCount !== undefined ? parseInt(unitsCount) : undefined,
          occupancyRate: occupancyRate !== undefined ? parseFloat(occupancyRate) : undefined,
        },
      });
      return sendSuccess({ res, data: building });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.building.delete({
        where: { id: req.params.id as string },
      });
      return sendSuccess({ res, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }
}

export const buildingController = new BuildingController();
