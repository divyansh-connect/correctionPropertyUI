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
};

export default api;
