import prisma from '../config/database.js';
import { AppError } from '../utils/appError.js';

export class PropertyService {
  async getAllProperties() {
    return prisma.property.findMany({
      include: {
        owner: true,
        buildings: true,
        units: true,
      },
    });
  }

  async getPropertyById(id: string) {
    const prop = await prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        buildings: true,
        units: true,
      },
    });

    if (!prop) throw new AppError('Property not found.', 404, 'NOT_FOUND');
    return prop;
  }

  async createProperty(data: any) {
    return prisma.property.create({
      data: {
        name: data.name,
        type: data.type || 'Apartment',
        status: data.status || 'Active',
        ownerId: data.ownerId,
        ownershipPercentage: data.ownershipPercentage || 100,
        managementCompany: data.managementCompany || 'Apex Property Management',
        address: data.address,
        streetAddress: data.streetAddress || data.address,
        city: data.city || 'Austin',
        state: data.state || 'TX',
        zip: data.zip || '78701',
        yearBuilt: data.yearBuilt || 2020,
        squareFootage: data.squareFootage || 10000,
        purchasePrice: data.purchasePrice || 1000000,
        currentValue: data.currentValue || 1200000,
      },
    });
  }
}

export const propertyService = new PropertyService();
