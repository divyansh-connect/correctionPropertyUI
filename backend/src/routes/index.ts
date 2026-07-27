import { Router } from 'express';
import authRoutes from './auth.routes';
import propertyRoutes from './property.routes';
import leaseRoutes from './lease.routes';
import paymentRoutes from './payment.routes';
import accountingRoutes from './accounting.routes';
import tenantRoutes from './tenant.routes';
import ownerRoutes from './owner.routes';
import vendorRoutes from './vendor.routes';
import workOrderRoutes from './workorder.routes';
import dashboardRoutes from './dashboard.routes';
import secondaryRoutes from './secondary.routes';
import portalRoutes from './portal.routes';

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
router.use('/portal', portalRoutes);
router.use('/', secondaryRoutes);

export default router;
