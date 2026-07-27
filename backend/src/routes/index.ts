import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import leaseRoutes from './lease.routes.js';
import paymentRoutes from './payment.routes.js';
import accountingRoutes from './accounting.routes.js';
import tenantRoutes from './tenant.routes.js';
import ownerRoutes from './owner.routes.js';
import vendorRoutes from './vendor.routes.js';
import workOrderRoutes from './workorder.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'DoorLoop ERP Backend',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/leases', leaseRoutes);
router.use('/payments', paymentRoutes);
router.use('/accounting', accountingRoutes);
router.use('/tenants', tenantRoutes);
router.use('/owners', ownerRoutes);
router.use('/vendors', vendorRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
