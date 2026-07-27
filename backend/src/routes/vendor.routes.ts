import { Router } from 'express';
import { vendorController } from '../controllers/vendor.controller.js';

const router = Router();

router.get('/', (req, res, next) => vendorController.getAll(req, res, next));
router.post('/', (req, res, next) => vendorController.create(req, res, next));

export default router;
