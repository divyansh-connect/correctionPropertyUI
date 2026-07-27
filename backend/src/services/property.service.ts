import prisma from '../config/database';
import { AppError } from '../utils/appError';

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
    let ownerId = data.ownerId;
    if (!ownerId) {
      const firstOwner = await prisma.owner.findFirst();
      if (firstOwner) {
        ownerId = firstOwner.id;
      } else {
        const newOwner = await prisma.owner.create({
          data: {
            name: 'Primary Owner',
            email: 'owner@apexpm.com',
            phone: '555-0100',
          },
        });
        ownerId = newOwner.id;
      }
    }

    return prisma.property.create({
      data: {
        name: data.name,
        type: data.type || 'Apartment',
        status: data.status || 'Active',
        ownerId: ownerId,
        ownershipPercentage: data.ownershipPercentage || 100,
        managementCompany: data.managementCompany || 'Apex Property Management',
        address: data.address || 'Austin, TX',
        streetAddress: data.streetAddress || data.address || '100 Main St',
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

  async deleteProperty(id: string) {
    return prisma.property.delete({
      where: { id },
    });
  }
}

export const propertyService = new PropertyService();
