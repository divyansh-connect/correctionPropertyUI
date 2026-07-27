import prisma from '../config/database';

export class PaymentService {
  async getAllPayments() {
    return prisma.rentPayment.findMany({
      include: {
        tenant: true,
        property: true,
        unit: true,
        lease: true,
      },
    });
  }

  async processPayment(data: any) {
    return prisma.rentPayment.create({
      data: {
        tenantId: data.tenantId,
        propertyId: data.propertyId,
        unitId: data.unitId,
        leaseId: data.leaseId,
        amount: data.amount,
        dueDate: new Date(data.dueDate || Date.now()),
        paidDate: new Date(),
        status: 'Paid',
        paymentMethod: data.paymentMethod || 'ACH',
        referenceNumber: data.referenceNumber || `REF-${Date.now()}`,
      },
    });
  }
}

export const paymentService = new PaymentService();
