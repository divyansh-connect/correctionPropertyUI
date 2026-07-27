import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../utils/apiResponse';

export class UnitController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const units = await prisma.unit.findMany({
        include: {
          property: true,
          building: true,
          tenants: true,
        },
      });
      return sendSuccess({ res, data: units });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const unit = await prisma.unit.findUnique({
        where: { id: req.params.id as string },
        include: {
          property: true,
          building: true,
          tenants: true,
        },
      });
      return sendSuccess({ res, data: unit });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        propertyId,
        buildingId,
        unitNumber,
        floor,
        bedrooms,
        bathrooms,
        squareFootage,
        rentAmount,
        securityDeposit,
        availabilityDate,
        status,
      } = req.body;

      const unit = await prisma.unit.create({
        data: {
          propertyId,
          buildingId,
          unitNumber,
          floor: parseInt(floor || '1'),
          bedrooms: parseInt(bedrooms || '1'),
          bathrooms: parseFloat(bathrooms || '1.0'),
          squareFootage: parseFloat(squareFootage || '0'),
          rentAmount: parseFloat(rentAmount || '0'),
          securityDeposit: parseFloat(securityDeposit || '0'),
          availabilityDate: new Date(availabilityDate || Date.now()),
          status: status || 'Vacant',
        },
      });
      return sendSuccess({ res, statusCode: 201, data: unit });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        propertyId,
        buildingId,
        unitNumber,
        floor,
        bedrooms,
        bathrooms,
        squareFootage,
        rentAmount,
        securityDeposit,
        availabilityDate,
        status,
      } = req.body;

      const unit = await prisma.unit.update({
        where: { id: req.params.id as string },
        data: {
          propertyId,
          buildingId,
          unitNumber,
          floor: floor !== undefined ? parseInt(floor) : undefined,
          bedrooms: bedrooms !== undefined ? parseInt(bedrooms) : undefined,
          bathrooms: bathrooms !== undefined ? parseFloat(bathrooms) : undefined,
          squareFootage: squareFootage !== undefined ? parseFloat(squareFootage) : undefined,
          rentAmount: rentAmount !== undefined ? parseFloat(rentAmount) : undefined,
          securityDeposit: securityDeposit !== undefined ? parseFloat(securityDeposit) : undefined,
          availabilityDate: availabilityDate ? new Date(availabilityDate) : undefined,
          status,
        },
      });
      return sendSuccess({ res, data: unit });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.unit.delete({
        where: { id: req.params.id as string },
      });
      return sendSuccess({ res, data: { success: true } });
    } catch (error) {
      next(error);
    }
  }

  async assignTenant(req: Request, res: Response, next: NextFunction) {
    try {
      const { tenantId } = req.body;
      const unit = await prisma.unit.update({
        where: { id: req.params.id as string },
        data: {
          status: 'Occupied',
          tenants: {
            connect: { id: tenantId },
          },
        },
      });
      return sendSuccess({ res, data: unit });
    } catch (error) {
      next(error);
    }
  }
}

export const unitController = new UnitController();
