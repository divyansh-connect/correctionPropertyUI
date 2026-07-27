import prisma from '../config/database';

export class LeaseService {
  async getAllLeases() {
    return prisma.lease.findMany({
      include: {
        tenant: true,
        property: true,
        unit: true,
      },
    });
  }

  async createLease(data: any) {
    return prisma.lease.create({
      data: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        unitId: data.unitId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        rentAmount: data.rentAmount,
        depositAmount: data.depositAmount,
        status: data.status || 'Pending',
      },
    });
  }

  async updateLease(id: string, data: any) {
    return prisma.lease.update({
      where: { id },
      data: {
        status: data.status,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
  }

  async deleteLease(id: string) {
    return prisma.lease.delete({
      where: { id },
    });
  }
}

export const leaseService = new LeaseService();
