import { Router } from 'express';
import { accountingController } from '../controllers/accounting.controller.js';

const router = Router();

router.get('/accounts', (req, res, next) => accountingController.getCoA(req, res, next));
router.post('/journal-entries', (req, res, next) => accountingController.postJournalEntry(req, res, next));

export default router;
