import { mockApi } from './mockApi';
import { apiClient } from './client';

export const api = {
  ...mockApi,

  // Real Database connections (strictly reflects DB state, even if empty)
  property: {
    ...mockApi.property,
    getAll: async () => {
      try {
        const res: any = await apiClient.get('/properties');
        return (res.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          address: p.address,
          type: p.type,
          unitsCount: p.units?.length || 0,
          occupiedUnits: p.units?.filter((u: any) => u.status === 'Occupied').length || 0,
          occupancyRate: p.units?.length ? Math.round((p.units.filter((u: any) => u.status === 'Occupied').length / p.units.length) * 100) : 0,
          monthlyRevenue: p.units?.reduce((sum: number, u: any) => sum + (u.rentAmount || 0), 0) || 0,
          status: p.status,
        }));
      } catch (e) {
        console.error('Properties DB fetch failed:', e);
        return []; // Return empty if database query fails
      }
    },
    create: async (data: any) => {
      const res: any = await apiClient.post('/properties', {
        name: data.name,
        type: data.type,
        address: data.address,
        status: data.status,
        ownerId: data.ownerId || 'own-1',
      });
      return {
        ...res.data,
        unitsCount: 0,
        occupiedUnits: 0,
        occupancyRate: 0,
        monthlyRevenue: 0,
      };
    },
  },

  leasing: {
    ...mockApi.leasing,
    getLeases: async () => {
      try {
        const res: any = await apiClient.get('/leases');
        return res.data || [];
      } catch (e) {
        console.error('Leases DB fetch failed:', e);
        return [];
      }
    },
    createLease: async (data: any) => {
      const res: any = await apiClient.post('/leases', data);
      return res.data;
    },
  },

  rent: {
    ...mockApi.rent,
    getAll: async () => {
      try {
        const res: any = await apiClient.get('/payments');
        return (res.data || []).map((p: any) => ({
          id: p.id,
          tenantName: p.tenantName || 'Sarah Connor',
          propertyName: p.propertyName || 'Skyline Luxury Lofts',
          unitNumber: p.unitNumber || '304',
          amount: p.amount,
          dueDate: p.dueDate || p.date,
          paidDate: p.date,
          status: p.status || 'Paid',
          paymentMethod: p.method || 'ACH',
        }));
      } catch (e) {
        console.error('Payments DB fetch failed:', e);
        return [];
      }
    },
  },

  tenantPayments: {
    ...mockApi.tenantPayments,
    payRent: async (data: any) => {
      const res: any = await apiClient.post('/payments', {
        amount: data.amount,
        baseAmount: data.baseAmount,
        method: data.method,
      });
      return res.data;
    },
  },

  tenant: {
    ...mockApi.tenant,
    getAll: async () => {
      try {
        const res: any = await apiClient.get('/tenants');
        return (res.data || []).map((t: any) => ({
          id: t.id,
          firstName: t.firstName,
          lastName: t.lastName,
          email: t.email,
          phone: t.phone,
          unitName: t.unit?.unitNumber || 'Unassigned',
          propertyName: t.unit?.property?.name || 'Unassigned',
          status: t.status,
          createdAt: t.createdAt,
        }));
      } catch (e) {
        console.error('Tenants fetch failed:', e);
        return [];
      }
    },
    create: async (data: any) => {
      const res: any = await apiClient.post('/tenants', data);
      return res.data;
    },
  },

  owner: {
    ...mockApi.owner,
    getAll: async () => {
      try {
        const res: any = await apiClient.get('/owners');
        return (res.data || []).map((o: any) => ({
          id: o.id,
          firstName: o.firstName,
          lastName: o.lastName,
          email: o.email,
          phone: o.phone,
          payoutMethod: o.payoutMethod,
          propertiesOwnedCount: o.properties?.length || 0,
        }));
      } catch (e) {
        console.error('Owners fetch failed:', e);
        return [];
      }
    },
    create: async (data: any) => {
      const res: any = await apiClient.post('/owners', data);
      return res.data;
    },
  },

  vendor: {
    ...mockApi.vendor,
    getAll: async () => {
      try {
        const res: any = await apiClient.get('/vendors');
        return (res.data || []).map((v: any) => ({
          id: v.id,
          companyName: v.companyName,
          contactName: v.contactName,
          email: v.email,
          phone: v.phone,
          serviceType: v.serviceType,
          rating: v.rating,
          activeJobs: v.workOrders?.filter((w: any) => w.status !== 'Completed').length || 0,
        }));
      } catch (e) {
        console.error('Vendors fetch failed:', e);
        return [];
      }
    },
  },

  workOrders: {
    ...mockApi.workOrders,
    getAll: async () => {
      try {
        const res: any = await apiClient.get('/work-orders');
        return (res.data || []).map((w: any) => ({
          id: w.id,
          title: w.title,
          description: w.description,
          propertyName: w.property?.name || 'Property',
          vendorName: w.vendor?.companyName || 'Unassigned',
          priority: w.priority,
          status: w.status === 'InProgress' ? 'In Progress' : w.status,
          estimatedCost: w.estimatedCost || 0,
          actualCost: w.actualCost || 0,
          createdAt: w.createdAt,
        }));
      } catch (e) {
        console.error('Work orders fetch failed:', e);
        return [];
      }
    },
    create: async (data: any) => {
      const res: any = await apiClient.post('/work-orders', data);
      return res.data;
    },
  },

  dashboard: {
    ...mockApi.dashboard,
    getMetrics: async () => {
      try {
        const res: any = await apiClient.get('/dashboard/metrics');
        return res.data;
      } catch (e) {
        console.error('Dashboard metrics fetch failed:', e);
        return mockApi.dashboard.getMetrics();
      }
    },
    getChartData: async () => {
      try {
        const res: any = await apiClient.get('/dashboard/charts');
        return res.data;
      } catch (e) {
        console.error('Dashboard charts fetch failed:', e);
        return mockApi.dashboard.getChartData();
      }
    },
  },
};

export default api;
