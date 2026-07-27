import { Router } from 'express';
import { portalController } from '../controllers/portal.controller';

const router = Router();

// Tenant Portal Views
router.get('/tenant/leases', (req, res, next) => portalController.getTenantLeases(req, res, next));
router.get('/tenant/maintenance', (req, res, next) => portalController.getTenantMaintenance(req, res, next));
router.get('/tenant/documents', (req, res, next) => portalController.getTenantDocuments(req, res, next));

// Owner Portal Views
router.get('/owner/financials', (req, res, next) => portalController.getOwnerFinancials(req, res, next));
router.get('/owner/distributions', (req, res, next) => portalController.getOwnerDistributions(req, res, next));
router.get('/owner/statements', (req, res, next) => portalController.getOwnerStatements(req, res, next));
router.get('/owner/maintenance', (req, res, next) => portalController.getOwnerMaintenance(req, res, next));
router.get('/owner/documents', (req, res, next) => portalController.getOwnerDocuments(req, res, next));
router.post('/owner/documents', (req, res, next) => portalController.uploadOwnerDocument(req, res, next));
router.get('/owner/messages', (req, res, next) => portalController.getOwnerMessages(req, res, next));
router.post('/owner/messages', (req, res, next) => portalController.composeOwnerMessage(req, res, next));
router.get('/owner/reports', (req, res, next) => portalController.getOwnerReports(req, res, next));
router.get('/owner/profile', (req, res, next) => portalController.getOwnerProfile(req, res, next));
router.post('/owner/profile', (req, res, next) => portalController.updateOwnerProfile(req, res, next));
router.get('/owner/metrics', (req, res, next) => portalController.getOwnerMetrics(req, res, next));

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
