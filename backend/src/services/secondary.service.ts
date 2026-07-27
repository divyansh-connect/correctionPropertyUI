import prisma from '../config/database';

export class SecondaryService {
  // Announcements
  async getAnnouncements() {
    return prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAnnouncement(data: { title: string; content: string; category?: string; isPinned?: boolean }) {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        category: data.category || 'General',
        isPinned: data.isPinned || false,
      },
    });
  }

  // Insurance Policies
  async getInsurancePolicies() {
    return prisma.insurancePolicy.findMany({
      include: { tenant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInsurancePolicy(data: { tenantId: string; policyNumber: string; provider: string; coverageAmount: number; startDate: Date; endDate: Date }) {
    return prisma.insurancePolicy.create({
      data: {
        tenantId: data.tenantId,
        policyNumber: data.policyNumber,
        provider: data.provider,
        coverageAmount: data.coverageAmount,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      },
    });
  }

  // Promotions
  async getPromotions() {
    return prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPromotion(data: { code: string; discount: string; duration: string; maxUses?: number }) {
    return prisma.promotion.create({
      data: {
        code: data.code,
        discount: data.discount,
        duration: data.duration,
        maxUses: data.maxUses || 100,
      },
    });
  }

  // Notifications
  async getNotifications() {
    return prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markNotificationRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  // Documents
  async getDocuments() {
    return prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDocument(data: { name: string; category?: string; fileUrl: string; fileSize?: string; uploadedBy?: string }) {
    return prisma.document.create({
      data: {
        name: data.name,
        category: data.category || 'General',
        fileUrl: data.fileUrl,
        fileSize: data.fileSize || '1.5 MB',
        uploadedBy: data.uploadedBy || 'Property Manager',
      },
    });
  }

  // AI Assistant Chat Response based on real DB metrics
  async processAiChat(prompt: string) {
    const propertyCount = await prisma.property.count();
    const unitCount = await prisma.unit.count();
    const occupiedUnits = await prisma.unit.count({ where: { status: 'Occupied' } });
    const tenantCount = await prisma.tenant.count();
    const occupancyRate = unitCount > 0 ? Math.round((occupiedUnits / unitCount) * 100) : 0;

    const queryLower = prompt.toLowerCase();
    let responseText = `I am your DoorLoop ERP AI Assistant. Currently, your portfolio consists of ${propertyCount} properties, ${unitCount} total units (${occupancyRate}% occupancy), and ${tenantCount} active tenants. How can I further assist with your property management operations?`;

    if (queryLower.includes('occupancy') || queryLower.includes('units')) {
      responseText = `Portfolio Occupancy Analysis: You have ${unitCount} total units across ${propertyCount} properties. Current occupied units: ${occupiedUnits} (${occupancyRate}% occupancy rate).`;
    } else if (queryLower.includes('tenant') || queryLower.includes('resident')) {
      responseText = `Tenant Overview: There are currently ${tenantCount} active tenants registered in your MySQL database system.`;
    } else if (queryLower.includes('revenue') || queryLower.includes('financial') || queryLower.includes('expense')) {
      responseText = `Financial Summary: All transactions, rent payments, and chart of accounts are recorded live in your double-entry accounting ledger.`;
    }

    await prisma.aiChatLog.create({
      data: {
        prompt,
        response: responseText,
      },
    });

    return { prompt, response: responseText };
  }
}

export const secondaryService = new SecondaryService();
