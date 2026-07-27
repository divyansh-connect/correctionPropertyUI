import { Router } from 'express';
import { workOrderController } from '../controllers/workorder.controller.js';

const router = Router();

router.get('/', (req, res, next) => workOrderController.getAll(req, res, next));
router.post('/', (req, res, next) => workOrderController.create(req, res, next));

export default router;
