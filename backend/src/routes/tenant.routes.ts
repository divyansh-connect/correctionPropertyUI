import { Router } from 'express';
import { tenantController } from '../controllers/tenant.controller.js';

const router = Router();

router.get('/', (req, res, next) => tenantController.getAll(req, res, next));
router.post('/', (req, res, next) => tenantController.create(req, res, next));

export default router;
