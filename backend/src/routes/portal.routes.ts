import { Router } from 'express';
import { portalController } from '../controllers/portal.controller';

const router = Router();

// Tenant Portal Views
router.get('/tenant/leases', (req, res, next) => portalController.getTenantLeases(req, res, next));
router.get('/tenant/lease', (req, res, next) => portalController.getTenantLease(req, res, next));
router.get('/tenant/metrics', (req, res, next) => portalController.getTenantMetrics(req, res, next));
router.get('/tenant/profile', (req, res, next) => portalController.getTenantProfile(req, res, next));
router.post('/tenant/profile', (req, res, next) => portalController.updateTenantProfile(req, res, next));
router.get('/tenant/maintenance', (req, res, next) => portalController.getTenantMaintenance(req, res, next));
router.post('/tenant/maintenance', (req, res, next) => portalController.createTenantMaintenance(req, res, next));
router.get('/tenant/documents', (req, res, next) => portalController.getTenantDocuments(req, res, next));
router.post('/tenant/documents', (req, res, next) => portalController.uploadTenantDocument(req, res, next));
router.get('/tenant/messages', (req, res, next) => portalController.getTenantMessages(req, res, next));
router.post('/tenant/messages', (req, res, next) => portalController.createTenantMessage(req, res, next));
router.get('/tenant/notifications', (req, res, next) => portalController.getTenantNotifications(req, res, next));
router.patch('/tenant/notifications/:id/read', (req, res, next) => portalController.markTenantNotificationRead(req, res, next));
router.delete('/tenant/notifications', (req, res, next) => portalController.clearTenantNotifications(req, res, next));

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

// Maintenance Staff Profile & Tasks Views
router.get('/staff/profile', (req, res, next) => portalController.getStaffProfile(req, res, next));
router.post('/staff/profile', (req, res, next) => portalController.updateStaffProfile(req, res, next));
router.get('/staff/tasks', (req, res, next) => portalController.getStaffTasks(req, res, next));
router.post('/staff/tasks/:id/status', (req, res, next) => portalController.updateStaffTaskStatus(req, res, next));

export default router;
