import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import leaseRoutes from './lease.routes.js';
import paymentRoutes from './payment.routes.js';
import accountingRoutes from './accounting.routes.js';

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

export default router;
