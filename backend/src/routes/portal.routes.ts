import { Router } from 'express';
import { portalController } from '../controllers/portal.controller.js';

const router = Router();

// Tenant Portal Views
router.get('/tenant/leases', (req, res, next) => portalController.getTenantLeases(req, res, next));
router.get('/tenant/maintenance', (req, res, next) => portalController.getTenantMaintenance(req, res, next));
router.get('/tenant/documents', (req, res, next) => portalController.getTenantDocuments(req, res, next));

// Owner Portal Views
router.get('/owner/financials', (req, res, next) => portalController.getOwnerFinancials(req, res, next));

// Super Admin Portal Views
router.get('/superadmin/billing', (req, res, next) => portalController.getSuperAdminBilling(req, res, next));
router.get('/superadmin/security', (req, res, next) => portalController.getSuperAdminSecurity(req, res, next));
router.get('/superadmin/audit', (req, res, next) => portalController.getSuperAdminAuditLogs(req, res, next));

// CRM, Screening, Violations & Collections
router.get('/collections/payment-plans', (req, res, next) => portalController.getCollectionPaymentPlans(req, res, next));
router.post('/collections/payment-plans', (req, res, next) => portalController.createCollectionPaymentPlan(req, res, next));

router.get('/crm/leads', (req, res, next) => portalController.getCrmLeads(req, res, next));
router.post('/crm/leads', (req, res, next) => portalController.createCrmLead(req, res, next));

router.get('/screening/reports', (req, res, next) => portalController.getScreeningReports(req, res, next));
router.post('/screening/reports', (req, res, next) => portalController.createScreeningReport(req, res, next));

router.get('/violations', (req, res, next) => portalController.getViolations(req, res, next));
router.post('/violations', (req, res, next) => portalController.createViolation(req, res, next));

export default router;
