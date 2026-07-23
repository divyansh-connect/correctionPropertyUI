import { 
  createRootRoute, 
  createRoute, 
  createRouter, 
  Outlet, 
  useNavigate, 
  useLocation 
} from '@tanstack/react-router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { useAuthStore } from '../store/useStore';
import { 
  Plus, Search, Eye, Edit, Power, Ban, CheckCircle, XCircle, Lock, Settings, Key, 
  Database, Mail, FileText, Globe, Building2, Users, CreditCard, BarChart3, 
  LifeBuoy, Shield, Activity, Sparkles, Clock, ArrowRight, ShieldAlert, Check, X,
  Trash2, HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/StatusBadge';
import { PageHeader } from '../components/PageHeader';

// Layouts
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Pages
import { LoginPage } from '../features/auth/LoginPage';
import { LandingPage } from '../features/landing/LandingPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { SuperAdminDashboardPage } from '../features/dashboard/SuperAdminDashboardPage';

// Properties & Buildings (Phase 2)
import { PropertiesPage } from '../features/properties/PropertiesPage';
import { NewPropertyPage } from '../features/properties/NewPropertyPage';
import { PropertyDetailsPage } from '../features/properties/PropertyDetailsPage';
import { BuildingsPage } from '../features/properties/BuildingsPage';
import { UnitsPage } from '../features/units/UnitsPage';
import { NewUnitPage } from '../features/units/NewUnitPage';
import { UnitDetailsPage } from '../features/units/UnitDetailsPage';

// Tenants Module (Phase 3)
import { TenantsPage } from '../features/tenants/TenantsPage';
import { NewTenantPage } from '../features/tenants/NewTenantPage';
import { EditTenantPage } from '../features/tenants/EditTenantPage';
import { TenantDetailsPage } from '../features/tenants/TenantDetailsPage';
import { PortalPreviewPage } from '../features/tenants/PortalPreviewPage';

// Leasing & Applications Module (Phase 3)
import { LeasesPage } from '../features/leasing/LeasesPage';
import { NewLeasePage } from '../features/leasing/NewLeasePage';
import { LeaseDetailsPage } from '../features/leasing/LeaseDetailsPage';
import { RenewalsPage } from '../features/leasing/RenewalsPage';
import { MoveInOutPage } from '../features/leasing/MoveInOutPage';
import { ApplicationsPage } from '../features/leasing/ApplicationsPage';
import { NewApplicationPage } from '../features/leasing/NewApplicationPage';

// CRM & Leads Module (Phase 3)
import { CRMDashboardPage } from '../features/crm/CRMDashboardPage';
import { LeadsPage } from '../features/crm/LeadsPage';
import { NewLeadPage } from '../features/crm/NewLeadPage';
import { LeadDetailsPage } from '../features/crm/LeadDetailsPage';

// Rent Collection & Payments (Phase 4)
import { RentDashboardPage } from '../features/rent/RentDashboardPage';
import { PaymentsPage } from '../features/rent/PaymentsPage';
import { NewPaymentPage } from '../features/rent/NewPaymentPage';
import { PaymentDetailsPage } from '../features/rent/PaymentDetailsPage';
import { RentLedgerPage } from '../features/rent/RentLedgerPage';
import { InvoicesPage } from '../features/rent/InvoicesPage';
import { NewInvoicePage } from '../features/rent/NewInvoicePage';
import { ChargesPage } from '../features/rent/ChargesPage';
import { DepositsPage } from '../features/rent/DepositsPage';
import { PaymentPlansPage } from '../features/rent/PaymentPlansPage';
import { RefundsPage } from '../features/rent/RefundsPage';
import { PaymentMethodsPage } from '../features/rent/PaymentMethodsPage';

// Placeholders/Other
import { AccountingDashboardPage } from '../features/accounting/AccountingDashboardPage';
import { ChartOfAccountsPage } from '../features/accounting/ChartOfAccountsPage';
import { JournalEntriesPage } from '../features/accounting/JournalEntriesPage';
import { GeneralLedgerPage } from '../features/accounting/GeneralLedgerPage';
import { IncomePage } from '../features/accounting/IncomePage';
import { ExpensesPage } from '../features/accounting/ExpensesPage';
import { VendorBillsPage } from '../features/accounting/VendorBillsPage';
import { RecurringTransactionsPage } from '../features/accounting/RecurringTransactionsPage';
import { BankAccountsPage } from '../features/accounting/BankAccountsPage';
import { BankReconciliationPage } from '../features/accounting/BankReconciliationPage';
import { BudgetsPage } from '../features/accounting/BudgetsPage';
import { OwnerStatementsPage } from '../features/accounting/OwnerStatementsPage';
import { TaxesPage } from '../features/accounting/TaxesPage';
import { FinancialReportsPage } from '../features/accounting/FinancialReportsPage';
import { YearEndPage } from '../features/accounting/YearEndPage';
import { OwnersPage } from '../features/owners/OwnersPage';
import { MaintenanceDashboardPage } from '../features/maintenance/MaintenanceDashboardPage';
import { RequestsPage } from '../features/maintenance/RequestsPage';
import { NewRequestPage } from '../features/maintenance/NewRequestPage';
import { RequestDetailsPage } from '../features/maintenance/RequestDetailsPage';
import { WorkOrdersPage } from '../features/maintenance/WorkOrdersPage';
import { WorkOrderDetailsPage } from '../features/maintenance/WorkOrderDetailsPage';
import { ViolationsPage } from '../features/maintenance/ViolationsPage';
import { PreventivePage } from '../features/maintenance/PreventivePage';
import { AssetsPage } from '../features/maintenance/AssetsPage';
import { InventoryPage } from '../features/maintenance/InventoryPage';
import { VendorsPage } from '../features/vendors/VendorsPage';
import { VendorInvoicesPage } from '../features/vendors/VendorInvoicesPage';
import { InspectionsPage } from '../features/maintenance/InspectionsPage';
import { NewInspectionPage } from '../features/maintenance/NewInspectionPage';
import { MaintenanceCalendarPage } from '../features/maintenance/MaintenanceCalendarPage';
import { MaintenanceReportsPage } from '../features/maintenance/MaintenanceReportsPage';
import { DocumentsPage } from '../features/documents/DocumentsPage';
import { DocsDashboardPage } from '../features/documents/DocsDashboardPage';
import { DocsAllPage } from '../features/documents/DocsAllPage';
import { DocsFoldersPage } from '../features/documents/DocsFoldersPage';
import { DocsUploadPage } from '../features/documents/DocsUploadPage';
import { DocsSignaturesPage } from '../features/documents/DocsSignaturesPage';
import { DocsSharedPage } from '../features/documents/DocsSharedPage';
import { DocsTemplatesPage } from '../features/documents/DocsTemplatesPage';
import { DocsVersionsPage } from '../features/documents/DocsVersionsPage';
import { DocsRequestsPage } from '../features/documents/DocsRequestsPage';
import { DocsPermissionsPage } from '../features/documents/DocsPermissionsPage';
import { DocsAuditPage } from '../features/documents/DocsAuditPage';
import { DocsArchivePage } from '../features/documents/DocsArchivePage';
import { DocsSettingsPage } from '../features/documents/DocsSettingsPage';
import { ReportsPage } from '../features/reports/ReportsPage';
import { ExecutiveDashboard } from '../features/reports/pages/ExecutiveDashboard';
import { DashboardBuilder } from '../features/reports/pages/DashboardBuilder';
import { PropertyAnalyticsPage } from '../features/reports/pages/PropertyAnalyticsPage';
import { FinancialAnalyticsPage } from '../features/reports/pages/FinancialAnalyticsPage';
import { TenantAnalyticsPage } from '../features/reports/pages/TenantAnalyticsPage';
import { LeasingAnalyticsPage } from '../features/reports/pages/LeasingAnalyticsPage';
import { MaintenanceAnalyticsPage } from '../features/reports/pages/MaintenanceAnalyticsPage';
import { OwnerAnalyticsPage } from '../features/reports/pages/OwnerAnalyticsPage';
import { DataExplorer } from '../features/reports/pages/DataExplorer';
import { CustomReports } from '../features/reports/pages/CustomReports';
import { SavedReports } from '../features/reports/pages/SavedReports';
import { ScheduledReports } from '../features/reports/pages/ScheduledReports';
import { ForecastingPage } from '../features/reports/pages/ForecastingPage';
import { ExportCenter } from '../features/reports/pages/ExportCenter';
import { AnalyticsSettingsPage } from '../features/reports/pages/AnalyticsSettingsPage';
import { CommunicationPage } from '../features/communication/CommunicationPage';
import { AIAssistantPage } from '../features/ai/AIAssistantPage';
import { AISettingsPage } from '../features/ai/AISettingsPage';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard';
import { CompanySettingsPage } from '../features/admin/pages/CompanySettingsPage';
import { UsersPage } from '../features/admin/pages/UsersPage';
import { TeamsPage } from '../features/admin/pages/TeamsPage';
import { RolesPage } from '../features/admin/pages/RolesPage';
import { PropertiesSettingsPage } from '../features/admin/pages/PropertiesSettingsPage';
import { FinancialSettingsPage } from '../features/admin/pages/FinancialSettingsPage';
import { PaymentSettingsPage } from '../features/admin/pages/PaymentSettingsPage';
import { NotificationSettingsPage } from '../features/admin/pages/NotificationSettingsPage';
import { IntegrationsPage } from '../features/admin/pages/IntegrationsPage';
import { ApiManagementPage } from '../features/admin/pages/ApiManagementPage';
import { WebhooksPage } from '../features/admin/pages/WebhooksPage';
import { SecurityPage } from '../features/admin/pages/SecurityPage';
import { AuditLogsPage } from '../features/admin/pages/AuditLogsPage';
import { ActivityLogsPage } from '../features/admin/pages/ActivityLogsPage';
import { BillingPage } from '../features/admin/pages/BillingPage';
import { SystemPreferencesPage } from '../features/admin/pages/SystemPreferencesPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { OwnerDashboardPage } from '../features/owner/OwnerDashboardPage';
import { OwnerPropertiesPage } from '../features/owner/OwnerPropertiesPage';
import { OwnerFinancialsPage } from '../features/owner/OwnerFinancialsPage';
import { OwnerStatementsPage as OwnerStatementsPortalPage } from '../features/owner/OwnerStatementsPage';
import { OwnerDistributionsPage } from '../features/owner/OwnerDistributionsPage';
import { OwnerMaintenancePage } from '../features/owner/OwnerMaintenancePage';
import { OwnerDocumentsPage } from '../features/owner/OwnerDocumentsPage';
import { OwnerMessagesPage } from '../features/owner/OwnerMessagesPage';
import { OwnerReportsPage } from '../features/owner/OwnerReportsPage';
import { OwnerProfilePage } from '../features/owner/OwnerProfilePage';
import { OwnerSupportPage } from '../features/owner/OwnerSupportPage';
import { TenantLayout } from '../layouts/TenantLayout';
import { StaffLayout } from '../layouts/StaffLayout';
import { StaffMaintenancePage } from '../features/maintenance/StaffMaintenancePage';
import { StaffProfilePage } from '../features/maintenance/StaffProfilePage';
import { StaffTaskDetailsPage } from '../features/maintenance/StaffTaskDetailsPage';
import { TenantDashboardPage } from '../features/tenant/TenantDashboardPage';
import { TenantHomePage } from '../features/tenant/TenantHomePage';
import { TenantLeasePage } from '../features/tenant/TenantLeasePage';
import { TenantPaymentsPage } from '../features/tenant/TenantPaymentsPage';
import { TenantMaintenancePage } from '../features/tenant/TenantMaintenancePage';
import { TenantDocumentsPage } from '../features/tenant/TenantDocumentsPage';
import { TenantMessagesPage } from '../features/tenant/TenantMessagesPage';
import { TenantAnnouncementsPage } from '../features/tenant/TenantAnnouncementsPage';
import { TenantVisitorsPage } from '../features/tenant/TenantVisitorsPage';
import { TenantPackagesPage } from '../features/tenant/TenantPackagesPage';
import { TenantInsurancePage } from '../features/tenant/TenantInsurancePage';
import { TenantProfilePage } from '../features/tenant/TenantProfilePage';
import { TenantSettingsPage } from '../features/tenant/TenantSettingsPage';
import { TenantSupportPage } from '../features/tenant/TenantSupportPage';
import { TenantNotificationsPage } from '../features/tenant/TenantNotificationsPage';
import { CommDashboardPage } from '../features/communication/CommDashboardPage';
import { CommInboxPage } from '../features/communication/CommInboxPage';
import { CommConversationsPage } from '../features/communication/CommConversationsPage';
import { CommEmailPage } from '../features/communication/CommEmailPage';
import { CommSMSPage } from '../features/communication/CommSMSPage';
import { CommAnnouncementsPage } from '../features/communication/CommAnnouncementsPage';
import { CommCampaignsPage } from '../features/communication/CommCampaignsPage';
import { CommTemplatesPage } from '../features/communication/CommTemplatesPage';
import { CommContactsPage } from '../features/communication/CommContactsPage';
import { CommNotificationsPage } from '../features/communication/CommNotificationsPage';
import { CommScheduledPage } from '../features/communication/CommScheduledPage';
import { CommActivityPage } from '../features/communication/CommActivityPage';
import { CommSettingsPage } from '../features/communication/CommSettingsPage';

// --- ROOT ROUTE ---
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// --- ACCESS DENIED PAGE ---
const AccessDeniedPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    if (user?.role === 'Owner') {
      navigate({ to: '/owner' });
    } else if (user?.role === 'Tenant') {
      navigate({ to: '/tenant' });
    } else {
      navigate({ to: '/' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center space-y-6 bg-card/45 backdrop-blur-xl rounded-2xl border border-border/60 max-w-lg mx-auto mt-20">
      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/5">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Access Denied</h1>
        <p className="text-sm text-muted-foreground">
          You are logged in as a <span className="font-bold text-foreground">{user?.role}</span> and do not have permission to access this page.
        </p>
      </div>
      <Button onClick={handleHomeRedirect} className="font-bold bg-primary hover:bg-primary/90 text-white px-6">
        Go to my Dashboard
      </Button>
    </div>
  );
};

// --- PUBLIC/AUTH WRAPPER ---
const PublicWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

// --- PROTECTED WRAPPER ---
const ProtectedWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: roles = [] } = useQuery({
    queryKey: ['rbac-roles-list'],
    queryFn: () => api.roles.getAll(),
    enabled: isAuthenticated && !!user,
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/landing' });
      return;
    }
    // Redirect Owner/Tenant/Staff from Root to their dashboards
    if (location.pathname === '/') {
      if (user?.role === 'Owner') {
        navigate({ to: '/owner' });
      } else if (user?.role === 'Tenant') {
        navigate({ to: '/tenant' });
      } else if (user?.role === 'Maintenance Staff') {
        navigate({ to: '/staff/dashboard' });
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const isOwnerPath = location.pathname === '/owner' || location.pathname.startsWith('/owner/');
  const isTenantPath = location.pathname === '/tenant' || location.pathname.startsWith('/tenant/');
  const isStaffPath = location.pathname === '/staff' || location.pathname.startsWith('/staff/');
  const isIntegrationsPath = 
    location.pathname.startsWith('/admin/integrations') || 
    location.pathname.startsWith('/platform-integrations');

  // Role Access Guard
  let hasAccess = true;
  if (!isIntegrationsPath) {
    if (user?.role === 'Owner' && !isOwnerPath) {
      hasAccess = false;
    } else if (user?.role === 'Tenant' && !isTenantPath) {
      hasAccess = false;
    } else if (user?.role === 'Maintenance Staff' && !isStaffPath) {
      hasAccess = false;
    } else if (user?.role && user.role !== 'Super Admin' && user.role !== 'Property Manager') {
      // Map pathname to module permissions
      const getRequiredModule = (path: string): string => {
        if (path.startsWith('/properties') || path.startsWith('/buildings') || path.startsWith('/units')) return 'Properties';
        if (path.startsWith('/leasing')) return 'Leasing';
        if (path.startsWith('/tenants')) return 'Tenants';
        if (path.startsWith('/owners')) return 'Owners';
        if (path.startsWith('/rent') || path.startsWith('/payments') || path.startsWith('/invoices') || path.startsWith('/rent-ledger')) return 'Rent & Payments';
        if (path.startsWith('/accounting')) return 'Accounting';
        if (path.startsWith('/maintenance') || path.startsWith('/inspections') || path.startsWith('/vendors')) return 'Maintenance';
        if (path.startsWith('/reports')) return 'Reports';
        if (path.startsWith('/communication')) return 'Communication';
        if (path.startsWith('/admin') || path.startsWith('/platform-integrations')) return 'Company Settings';
        return '';
      };

      const reqModule = getRequiredModule(location.pathname);
      if (reqModule) {
        const matchingRole = roles.find((r: any) => r.name.toLowerCase() === user.role.toLowerCase());
        if (matchingRole) {
          const permRule = matchingRole.permissions.find((p: any) => p.module === reqModule);
          if (permRule && !permRule.view) {
            hasAccess = false;
          }
        }
      }
    }
  }

  if (!hasAccess) {
    return (
      <DashboardLayout
        currentPath={location.pathname}
        navigate={(path) => navigate({ to: path })}
      >
        <AccessDeniedPage />
      </DashboardLayout>
    );
  }

  if (isTenantPath) {
    return (
      <TenantLayout
        currentPath={location.pathname}
        navigate={(path) => navigate({ to: path })}
      >
        {children}
      </TenantLayout>
    );
  }

  if (isOwnerPath) {
    return (
      <OwnerLayout
        currentPath={location.pathname}
        navigate={(path) => navigate({ to: path })}
      >
        {children}
      </OwnerLayout>
    );
  }

  if (isStaffPath) {
    return (
      <StaffLayout
        currentPath={location.pathname}
        navigate={(path) => navigate({ to: path })}
      >
        {children}
      </StaffLayout>
    );
  }

  return (
    <DashboardLayout 
      currentPath={location.pathname} 
      navigate={(path) => navigate({ to: path })}
    >
      {children}
    </DashboardLayout>
  );
};

// --- ROUTE DEFINITIONS ---

// Auth Routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing',
  component: () => {
    const navigate = useNavigate();
    return <LandingPage navigate={(path) => navigate({ to: path as any })} />;
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => {
    const navigate = useNavigate();
    return (
      <PublicWrapper>
        <LoginPage navigate={(path) => navigate({ to: path })} />
      </PublicWrapper>
    );
  },
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: () => {
    const navigate = useNavigate();
    return (
      <PublicWrapper>
        <ForgotPasswordPage navigate={(path) => navigate({ to: path })} />
      </PublicWrapper>
    );
  },
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: () => {
    const navigate = useNavigate();
    return (
      <PublicWrapper>
        <ResetPasswordPage navigate={(path) => navigate({ to: path })} />
      </PublicWrapper>
    );
  },
});

// Index Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    const { user } = useAuthStore();
    return (
      <ProtectedWrapper>
        {user?.role === 'Super Admin' ? <SuperAdminDashboardPage /> : <DashboardPage />}
      </ProtectedWrapper>
    );
  },
});

// Properties Routes (Phase 2)
const propertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties',
  component: () => (
    <ProtectedWrapper>
      <PropertiesPage />
    </ProtectedWrapper>
  ),
});

const newPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/new',
  component: () => (
    <ProtectedWrapper>
      <NewPropertyPage />
    </ProtectedWrapper>
  ),
});

const propertyDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/$id',
  component: () => (
    <ProtectedWrapper>
      <PropertyDetailsPage />
    </ProtectedWrapper>
  ),
});

const buildingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buildings',
  component: () => (
    <ProtectedWrapper>
      <BuildingsPage />
    </ProtectedWrapper>
  ),
});

const unitsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/units',
  component: () => (
    <ProtectedWrapper>
      <UnitsPage />
    </ProtectedWrapper>
  ),
});

const newUnitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/units/new',
  component: () => (
    <ProtectedWrapper>
      <NewUnitPage />
    </ProtectedWrapper>
  ),
});

const unitDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/units/$id',
  component: () => (
    <ProtectedWrapper>
      <UnitDetailsPage />
    </ProtectedWrapper>
  ),
});

// Tenants Routes (Phase 3)
const tenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants',
  component: () => (
    <ProtectedWrapper>
      <TenantsPage />
    </ProtectedWrapper>
  ),
});

const activeTenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/active',
  component: () => (
    <ProtectedWrapper>
      <TenantsPage filterStatus="Active" />
    </ProtectedWrapper>
  ),
});

const formerTenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/former',
  component: () => (
    <ProtectedWrapper>
      <TenantsPage filterStatus="Inactive" />
    </ProtectedWrapper>
  ),
});

const portalPreviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/portal-preview',
  component: () => (
    <ProtectedWrapper>
      <PortalPreviewPage />
    </ProtectedWrapper>
  ),
});

const newTenantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/new',
  component: () => (
    <ProtectedWrapper>
      <NewTenantPage />
    </ProtectedWrapper>
  ),
});

const editTenantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/$id/edit',
  component: () => (
    <ProtectedWrapper>
      <EditTenantPage />
    </ProtectedWrapper>
  ),
});

const tenantDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/$id',
  component: () => (
    <ProtectedWrapper>
      <TenantDetailsPage />
    </ProtectedWrapper>
  ),
});

// Leases & Leasing Routes (Phase 3)
const leasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/leases',
  component: () => (
    <ProtectedWrapper>
      <LeasesPage />
    </ProtectedWrapper>
  ),
});

const newLeaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leases/new',
  component: () => (
    <ProtectedWrapper>
      <NewLeasePage />
    </ProtectedWrapper>
  ),
});

const leaseDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leases/$id',
  component: () => (
    <ProtectedWrapper>
      <LeaseDetailsPage />
    </ProtectedWrapper>
  ),
});

const renewalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/renewals',
  component: () => (
    <ProtectedWrapper>
      <RenewalsPage />
    </ProtectedWrapper>
  ),
});

const moveInOutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/move-in-out',
  component: () => (
    <ProtectedWrapper>
      <MoveInOutPage />
    </ProtectedWrapper>
  ),
});

const applicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/applications',
  component: () => (
    <ProtectedWrapper>
      <ApplicationsPage />
    </ProtectedWrapper>
  ),
});

const newApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/applications/new',
  component: () => (
    <ProtectedWrapper>
      <NewApplicationPage />
    </ProtectedWrapper>
  ),
});

// CRM & Leads Routes (Phase 3)
const crmDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/crm',
  component: () => (
    <ProtectedWrapper>
      <CRMDashboardPage />
    </ProtectedWrapper>
  ),
});

const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/leads',
  component: () => (
    <ProtectedWrapper>
      <LeadsPage />
    </ProtectedWrapper>
  ),
});

const newLeadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leads/new',
  component: () => (
    <ProtectedWrapper>
      <NewLeadPage />
    </ProtectedWrapper>
  ),
});

const leadDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leads/$id',
  component: () => (
    <ProtectedWrapper>
      <LeadDetailsPage />
    </ProtectedWrapper>
  ),
});

// Rent Collection & Payments (Phase 4)
const rentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rent',
  component: () => (
    <ProtectedWrapper>
      <RentDashboardPage />
    </ProtectedWrapper>
  ),
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: () => (
    <ProtectedWrapper>
      <PaymentsPage />
    </ProtectedWrapper>
  ),
});

const newPaymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments/new',
  component: () => (
    <ProtectedWrapper>
      <NewPaymentPage />
    </ProtectedWrapper>
  ),
});

const paymentDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments/$id',
  component: () => (
    <ProtectedWrapper>
      <PaymentDetailsPage />
    </ProtectedWrapper>
  ),
});

const rentLedgerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rent-ledger',
  component: () => (
    <ProtectedWrapper>
      <RentLedgerPage />
    </ProtectedWrapper>
  ),
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices',
  component: () => (
    <ProtectedWrapper>
      <InvoicesPage />
    </ProtectedWrapper>
  ),
});

const newInvoiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices/new',
  component: () => (
    <ProtectedWrapper>
      <NewInvoicePage />
    </ProtectedWrapper>
  ),
});

const chargesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/charges',
  component: () => (
    <ProtectedWrapper>
      <ChargesPage />
    </ProtectedWrapper>
  ),
});

const depositsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deposits',
  component: () => (
    <ProtectedWrapper>
      <DepositsPage />
    </ProtectedWrapper>
  ),
});

const paymentPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-plans',
  component: () => (
    <ProtectedWrapper>
      <PaymentPlansPage />
    </ProtectedWrapper>
  ),
});

const newPaymentPlanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-plans/new',
  component: () => (
    <ProtectedWrapper>
      <PaymentPlansPage />
    </ProtectedWrapper>
  ),
});

const refundsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/refunds',
  component: () => (
    <ProtectedWrapper>
      <RefundsPage />
    </ProtectedWrapper>
  ),
});

const paymentMethodsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-methods',
  component: () => (
    <ProtectedWrapper>
      <PaymentMethodsPage />
    </ProtectedWrapper>
  ),
});

// Other Placeholders
const ownersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owners',
  component: () => (
    <ProtectedWrapper>
      <OwnersPage />
    </ProtectedWrapper>
  ),
});

const accountingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting',
  component: () => (
    <ProtectedWrapper>
      <AccountingDashboardPage />
    </ProtectedWrapper>
  ),
});

const coaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/chart-of-accounts',
  component: () => (
    <ProtectedWrapper>
      <ChartOfAccountsPage />
    </ProtectedWrapper>
  ),
});

const journalEntriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/journal-entries',
  component: () => (
    <ProtectedWrapper>
      <JournalEntriesPage />
    </ProtectedWrapper>
  ),
});

const generalLedgerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/general-ledger',
  component: () => (
    <ProtectedWrapper>
      <GeneralLedgerPage />
    </ProtectedWrapper>
  ),
});

const incomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/income',
  component: () => (
    <ProtectedWrapper>
      <IncomePage />
    </ProtectedWrapper>
  ),
});

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/expenses',
  component: () => (
    <ProtectedWrapper>
      <ExpensesPage />
    </ProtectedWrapper>
  ),
});

const vendorBillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/vendor-bills',
  component: () => (
    <ProtectedWrapper>
      <VendorBillsPage />
    </ProtectedWrapper>
  ),
});

const recurringTransactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/recurring',
  component: () => (
    <ProtectedWrapper>
      <RecurringTransactionsPage />
    </ProtectedWrapper>
  ),
});

const bankAccountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/bank-accounts',
  component: () => (
    <ProtectedWrapper>
      <BankAccountsPage />
    </ProtectedWrapper>
  ),
});

const bankReconciliationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/reconciliation',
  component: () => (
    <ProtectedWrapper>
      <BankReconciliationPage />
    </ProtectedWrapper>
  ),
});

const budgetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/budgets',
  component: () => (
    <ProtectedWrapper>
      <BudgetsPage />
    </ProtectedWrapper>
  ),
});

const ownerStatementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/owner-statements',
  component: () => (
    <ProtectedWrapper>
      <OwnerStatementsPage />
    </ProtectedWrapper>
  ),
});

const taxesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/taxes',
  component: () => (
    <ProtectedWrapper>
      <TaxesPage />
    </ProtectedWrapper>
  ),
});

const financialReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/reports',
  component: () => (
    <ProtectedWrapper>
      <FinancialReportsPage />
    </ProtectedWrapper>
  ),
});

const yearEndRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/year-end',
  component: () => (
    <ProtectedWrapper>
      <YearEndPage />
    </ProtectedWrapper>
  ),
});

const maintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance',
  component: () => (
    <ProtectedWrapper>
      <MaintenanceDashboardPage />
    </ProtectedWrapper>
  ),
});

const requestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/requests',
  component: () => (
    <ProtectedWrapper>
      <RequestsPage />
    </ProtectedWrapper>
  ),
});

const newRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/requests/new',
  component: () => (
    <ProtectedWrapper>
      <NewRequestPage />
    </ProtectedWrapper>
  ),
});

const requestDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/requests/$id',
  component: () => (
    <ProtectedWrapper>
      <RequestDetailsPage />
    </ProtectedWrapper>
  ),
});

const workOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/work-orders',
  component: () => (
    <ProtectedWrapper>
      <WorkOrdersPage />
    </ProtectedWrapper>
  ),
});

const workOrderDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/work-orders/$id',
  component: () => (
    <ProtectedWrapper>
      <WorkOrderDetailsPage />
    </ProtectedWrapper>
  ),
});

const violationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/violations',
  component: () => (
    <ProtectedWrapper>
      <ViolationsPage />
    </ProtectedWrapper>
  ),
});

const preventiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/preventive',
  component: () => (
    <ProtectedWrapper>
      <PreventivePage />
    </ProtectedWrapper>
  ),
});

const assetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/assets',
  component: () => (
    <ProtectedWrapper>
      <AssetsPage />
    </ProtectedWrapper>
  ),
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/inventory',
  component: () => (
    <ProtectedWrapper>
      <InventoryPage />
    </ProtectedWrapper>
  ),
});

const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: () => (
    <ProtectedWrapper>
      <VendorsPage />
    </ProtectedWrapper>
  ),
});

const vendorInvoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors/invoices',
  component: () => (
    <ProtectedWrapper>
      <VendorInvoicesPage />
    </ProtectedWrapper>
  ),
});

const inspectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inspections',
  component: () => (
    <ProtectedWrapper>
      <InspectionsPage />
    </ProtectedWrapper>
  ),
});

const newInspectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inspections/new',
  component: () => (
    <ProtectedWrapper>
      <NewInspectionPage />
    </ProtectedWrapper>
  ),
});

const maintenanceCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/calendar',
  component: () => (
    <ProtectedWrapper>
      <MaintenanceCalendarPage />
    </ProtectedWrapper>
  ),
});

const maintenanceReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maintenance/reports',
  component: () => (
    <ProtectedWrapper>
      <MaintenanceReportsPage />
    </ProtectedWrapper>
  ),
});

const documentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents',
  component: () => (<ProtectedWrapper><DocsDashboardPage /></ProtectedWrapper>),
});
const docsAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/all',
  component: () => (<ProtectedWrapper><DocsAllPage /></ProtectedWrapper>),
});
const docsFoldersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/folders',
  component: () => (<ProtectedWrapper><DocsFoldersPage /></ProtectedWrapper>),
});
const docsUploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/upload',
  component: () => (<ProtectedWrapper><DocsUploadPage /></ProtectedWrapper>),
});
const docsSignaturesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/signatures',
  component: () => (<ProtectedWrapper><DocsSignaturesPage /></ProtectedWrapper>),
});
const docsSharedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/shared',
  component: () => (<ProtectedWrapper><DocsSharedPage /></ProtectedWrapper>),
});
const docsTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/templates',
  component: () => (<ProtectedWrapper><DocsTemplatesPage /></ProtectedWrapper>),
});
const docsVersionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/versions',
  component: () => (<ProtectedWrapper><DocsVersionsPage /></ProtectedWrapper>),
});
const docsRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/requests',
  component: () => (<ProtectedWrapper><DocsRequestsPage /></ProtectedWrapper>),
});
const docsPermissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/permissions',
  component: () => (<ProtectedWrapper><DocsPermissionsPage /></ProtectedWrapper>),
});
const docsAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/audit',
  component: () => (<ProtectedWrapper><DocsAuditPage /></ProtectedWrapper>),
});
const docsArchiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/archive',
  component: () => (<ProtectedWrapper><DocsArchivePage /></ProtectedWrapper>),
});
const docsSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/documents/settings',
  component: () => (<ProtectedWrapper><DocsSettingsPage /></ProtectedWrapper>),
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => (
    <ProtectedWrapper>
      <ReportsPage />
    </ProtectedWrapper>
  ),
});

const reportsExecutiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/executive',
  component: () => (<ProtectedWrapper><ExecutiveDashboard /></ProtectedWrapper>),
});
const reportsDashboardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/dashboards',
  component: () => (<ProtectedWrapper><DashboardBuilder /></ProtectedWrapper>),
});
const reportsPropertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/properties',
  component: () => (<ProtectedWrapper><PropertyAnalyticsPage /></ProtectedWrapper>),
});
const reportsFinancialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/financial',
  component: () => (<ProtectedWrapper><FinancialAnalyticsPage /></ProtectedWrapper>),
});
const reportsTenantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/tenants',
  component: () => (<ProtectedWrapper><TenantAnalyticsPage /></ProtectedWrapper>),
});
const reportsLeasingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/leasing',
  component: () => (<ProtectedWrapper><LeasingAnalyticsPage /></ProtectedWrapper>),
});
const reportsMaintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/maintenance',
  component: () => (<ProtectedWrapper><MaintenanceAnalyticsPage /></ProtectedWrapper>),
});
const reportsOwnersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/owners',
  component: () => (<ProtectedWrapper><OwnerAnalyticsPage /></ProtectedWrapper>),
});
const reportsExplorerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/explorer',
  component: () => (<ProtectedWrapper><DataExplorer /></ProtectedWrapper>),
});
const reportsCustomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/custom',
  component: () => (<ProtectedWrapper><CustomReports /></ProtectedWrapper>),
});
const reportsSavedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/saved',
  component: () => (<ProtectedWrapper><SavedReports /></ProtectedWrapper>),
});
const reportsScheduledRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/scheduled',
  component: () => (<ProtectedWrapper><ScheduledReports /></ProtectedWrapper>),
});
const reportsForecastRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/forecast',
  component: () => (<ProtectedWrapper><ForecastingPage /></ProtectedWrapper>),
});
const reportsExportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/exports',
  component: () => (<ProtectedWrapper><ExportCenter /></ProtectedWrapper>),
});
const reportsSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/settings',
  component: () => (<ProtectedWrapper><AnalyticsSettingsPage /></ProtectedWrapper>),
});

// --- OWNER PORTAL ROUTES ---
const ownerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner',
  component: () => (
    <ProtectedWrapper>
      <OwnerDashboardPage />
    </ProtectedWrapper>
  ),
});

const ownerPropertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/properties',
  component: () => (
    <ProtectedWrapper>
      <OwnerPropertiesPage />
    </ProtectedWrapper>
  ),
});

const ownerFinancialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/financials',
  component: () => (
    <ProtectedWrapper>
      <OwnerFinancialsPage />
    </ProtectedWrapper>
  ),
});

const ownerPortalStatementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/statements',
  component: () => (
    <ProtectedWrapper>
      <OwnerStatementsPortalPage />
    </ProtectedWrapper>
  ),
});

const ownerDistributionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/distributions',
  component: () => (
    <ProtectedWrapper>
      <OwnerDistributionsPage />
    </ProtectedWrapper>
  ),
});

const ownerMaintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/maintenance',
  component: () => (
    <ProtectedWrapper>
      <OwnerMaintenancePage />
    </ProtectedWrapper>
  ),
});

const ownerDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/documents',
  component: () => (
    <ProtectedWrapper>
      <OwnerDocumentsPage />
    </ProtectedWrapper>
  ),
});

const ownerMessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/messages',
  component: () => (
    <ProtectedWrapper>
      <OwnerMessagesPage />
    </ProtectedWrapper>
  ),
});

const ownerReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/reports',
  component: () => (
    <ProtectedWrapper>
      <OwnerReportsPage />
    </ProtectedWrapper>
  ),
});

const ownerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/profile',
  component: () => (
    <ProtectedWrapper>
      <OwnerProfilePage />
    </ProtectedWrapper>
  ),
});

const ownerSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/support',
  component: () => (
    <ProtectedWrapper>
      <OwnerSupportPage />
    </ProtectedWrapper>
  ),
});

// --- TENANT PORTAL ROUTES ---
const tenantDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant',
  component: () => (
    <ProtectedWrapper>
      <TenantDashboardPage />
    </ProtectedWrapper>
  ),
});

const tenantHomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/home',
  component: () => (
    <ProtectedWrapper>
      <TenantHomePage />
    </ProtectedWrapper>
  ),
});

const tenantLeaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/lease',
  component: () => (
    <ProtectedWrapper>
      <TenantLeasePage />
    </ProtectedWrapper>
  ),
});

const tenantPaymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/payments',
  component: () => (
    <ProtectedWrapper>
      <TenantPaymentsPage />
    </ProtectedWrapper>
  ),
});

const tenantMaintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/maintenance',
  component: () => (
    <ProtectedWrapper>
      <TenantMaintenancePage />
    </ProtectedWrapper>
  ),
});

const staffDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/dashboard',
  component: () => (
    <ProtectedWrapper>
      <MaintenanceDashboardPage />
    </ProtectedWrapper>
  ),
});

const staffTasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/tasks',
  component: () => (
    <ProtectedWrapper>
      <StaffMaintenancePage />
    </ProtectedWrapper>
  ),
});

const staffCompletedTasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/completed',
  component: () => (
    <ProtectedWrapper>
      <StaffMaintenancePage />
    </ProtectedWrapper>
  ),
});

const staffProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/profile',
  component: () => (
    <ProtectedWrapper>
      <StaffProfilePage />
    </ProtectedWrapper>
  ),
});

const staffTaskDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/tasks/$id',
  component: () => (
    <ProtectedWrapper>
      <StaffTaskDetailsPage />
    </ProtectedWrapper>
  ),
});

const staffMaintenanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/maintenance',
  component: () => (
    <ProtectedWrapper>
      <StaffMaintenancePage />
    </ProtectedWrapper>
  ),
});

const tenantDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/documents',
  component: () => (
    <ProtectedWrapper>
      <TenantDocumentsPage />
    </ProtectedWrapper>
  ),
});

const tenantMessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/messages',
  component: () => (
    <ProtectedWrapper>
      <TenantMessagesPage />
    </ProtectedWrapper>
  ),
});

const tenantAnnouncementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/announcements',
  component: () => (
    <ProtectedWrapper>
      <TenantAnnouncementsPage />
    </ProtectedWrapper>
  ),
});

const tenantVisitorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/visitors',
  component: () => (
    <ProtectedWrapper>
      <TenantVisitorsPage />
    </ProtectedWrapper>
  ),
});

const tenantPackagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/packages',
  component: () => (
    <ProtectedWrapper>
      <TenantPackagesPage />
    </ProtectedWrapper>
  ),
});

const tenantInsuranceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/insurance',
  component: () => (
    <ProtectedWrapper>
      <TenantInsurancePage />
    </ProtectedWrapper>
  ),
});

const tenantProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/profile',
  component: () => (
    <ProtectedWrapper>
      <TenantProfilePage />
    </ProtectedWrapper>
  ),
});

const tenantSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/settings',
  component: () => (
    <ProtectedWrapper>
      <TenantSettingsPage />
    </ProtectedWrapper>
  ),
});

const tenantSupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/support',
  component: () => (
    <ProtectedWrapper>
      <TenantSupportPage />
    </ProtectedWrapper>
  ),
});

const tenantNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/notifications',
  component: () => (
    <ProtectedWrapper>
      <TenantNotificationsPage />
    </ProtectedWrapper>
  ),
});

const tenantPaymentsHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenant/payments/history',
  component: () => (
    <ProtectedWrapper>
      <TenantPaymentsPage />
    </ProtectedWrapper>
  ),
});

const commDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication',
  component: () => (
    <ProtectedWrapper>
      <CommDashboardPage />
    </ProtectedWrapper>
  ),
});

const commInboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/inbox',
  component: () => (
    <ProtectedWrapper>
      <CommInboxPage />
    </ProtectedWrapper>
  ),
});

const commConversationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/conversations',
  component: () => (
    <ProtectedWrapper>
      <CommConversationsPage />
    </ProtectedWrapper>
  ),
});

const commEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/email',
  component: () => (
    <ProtectedWrapper>
      <CommEmailPage />
    </ProtectedWrapper>
  ),
});

const commSMSRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/sms',
  component: () => (
    <ProtectedWrapper>
      <CommSMSPage />
    </ProtectedWrapper>
  ),
});

const commAnnouncementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/announcements',
  component: () => (
    <ProtectedWrapper>
      <CommAnnouncementsPage />
    </ProtectedWrapper>
  ),
});

const commCampaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/campaigns',
  component: () => (
    <ProtectedWrapper>
      <CommCampaignsPage />
    </ProtectedWrapper>
  ),
});

const commTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/templates',
  component: () => (
    <ProtectedWrapper>
      <CommTemplatesPage />
    </ProtectedWrapper>
  ),
});

const commContactsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/contacts',
  component: () => (
    <ProtectedWrapper>
      <CommContactsPage />
    </ProtectedWrapper>
  ),
});

const commNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/notifications',
  component: () => (
    <ProtectedWrapper>
      <CommNotificationsPage />
    </ProtectedWrapper>
  ),
});

const commScheduledRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/scheduled',
  component: () => (
    <ProtectedWrapper>
      <CommScheduledPage />
    </ProtectedWrapper>
  ),
});

const commActivityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/activity',
  component: () => (
    <ProtectedWrapper>
      <CommActivityPage />
    </ProtectedWrapper>
  ),
});

const commSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/communication/settings',
  component: () => (
    <ProtectedWrapper>
      <CommSettingsPage />
    </ProtectedWrapper>
  ),
});

const aiAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai/assistant',
  component: () => (<ProtectedWrapper><AIAssistantPage /></ProtectedWrapper>),
});
const aiSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai/settings',
  component: () => (<ProtectedWrapper><AISettingsPage /></ProtectedWrapper>),
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (<ProtectedWrapper><AdminDashboard /></ProtectedWrapper>),
});
const adminCompanySettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/company-settings',
  component: () => (<ProtectedWrapper><CompanySettingsPage /></ProtectedWrapper>),
});
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: () => (<ProtectedWrapper><UsersPage /></ProtectedWrapper>),
});
const adminTeamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/teams',
  component: () => (<ProtectedWrapper><TeamsPage /></ProtectedWrapper>),
});

const AccessTemplatesPage: React.FC = () => {
  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Access Templates"
        description="Bootstrap your organizational permissions with pre-configured access templates."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Administration' }, { label: 'Templates' }]}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-extrabold text-sm text-primary">Standard Staff Access</h3>
          <p className="text-xs text-muted-foreground font-semibold">Standard settings for front desk staff. Grants view-only rights to tenants and properties.</p>
          <span className="inline-block px-2 py-0.5 bg-secondary text-[10px] font-extrabold rounded">6 Modules Enabled</span>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-extrabold text-sm text-primary">Full Financial Access</h3>
          <p className="text-xs text-muted-foreground font-semibold">Tailored for external accountants. Enables comprehensive access to accounting and payments.</p>
          <span className="inline-block px-2 py-0.5 bg-secondary text-[10px] font-extrabold rounded">3 Modules Enabled</span>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-extrabold text-sm text-primary">Maintenance Vendor Access</h3>
          <p className="text-xs text-muted-foreground font-semibold">Minimal access scope. Grants technicians rights to view and update work orders only.</p>
          <span className="inline-block px-2 py-0.5 bg-secondary text-[10px] font-extrabold rounded">1 Module Enabled</span>
        </div>
      </div>
    </div>
  );
};

const adminTemplatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/templates',
  component: () => (<ProtectedWrapper><AccessTemplatesPage /></ProtectedWrapper>),
});

const adminRolesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: () => (<ProtectedWrapper><RolesPage /></ProtectedWrapper>),
});
const adminPropertiesSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/properties-settings',
  component: () => (<ProtectedWrapper><PropertiesSettingsPage /></ProtectedWrapper>),
});
const adminFinancialRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/financial',
  component: () => (<ProtectedWrapper><FinancialSettingsPage /></ProtectedWrapper>),
});
const adminPaymentSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/payment-settings',
  component: () => (<ProtectedWrapper><PaymentSettingsPage /></ProtectedWrapper>),
});
const adminNotificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/notifications',
  component: () => (<ProtectedWrapper><NotificationSettingsPage /></ProtectedWrapper>),
});
const adminIntegrationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/integrations',
  component: () => (<ProtectedWrapper><IntegrationsPage /></ProtectedWrapper>),
});
const adminApiRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/api',
  component: () => (<ProtectedWrapper><ApiManagementPage /></ProtectedWrapper>),
});
const adminWebhooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/webhooks',
  component: () => (<ProtectedWrapper><WebhooksPage /></ProtectedWrapper>),
});
const adminSecurityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/security',
  component: () => (<ProtectedWrapper><SecurityPage /></ProtectedWrapper>),
});
const adminAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/audit',
  component: () => (<ProtectedWrapper><AuditLogsPage /></ProtectedWrapper>),
});
const adminActivityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/activity',
  component: () => (<ProtectedWrapper><ActivityLogsPage /></ProtectedWrapper>),
});
const adminBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/billing',
  component: () => (<ProtectedWrapper><BillingPage /></ProtectedWrapper>),
});
const adminPreferencesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/preferences',
  component: () => (<ProtectedWrapper><SystemPreferencesPage /></ProtectedWrapper>),
});
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <ProtectedWrapper>
      <SettingsPage />
    </ProtectedWrapper>
  ),
});

// ============================================================================
// ==================== NEW SAAS & OPERATIONS COMPONENTS ======================
// ============================================================================

// 1. COMPANIES PAGE
const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = React.useState<any[]>(() => {
    const stored = localStorage.getItem('companies');
    if (stored) return JSON.parse(stored);
    const initial = [
      { id: '1', name: 'Apex Property Management', businessName: 'Apex PM LLC', code: 'APEX', contact: 'Sarah Davis', email: 'sarah@apexpm.com', phone: '555-0199', website: 'apexpm.com', status: 'Active', plan: 'Pro Plan', cycle: 'Monthly', storage: '1.2 GB', date: '2026-01-15' },
      { id: '2', name: 'Horizon Living', businessName: 'Horizon Rentals Inc', code: 'HRZN', contact: 'Mark Wilson', email: 'mark@horizon.com', phone: '555-0244', website: 'horizonrentals.com', status: 'Active', plan: 'Basic Plan', cycle: 'Annual', storage: '800 MB', date: '2026-03-22' },
      { id: '3', name: 'Summit Group', businessName: 'Summit Land Corp', code: 'SMMT', contact: 'Rachel Green', email: 'rachel@summit.com', phone: '555-0311', website: 'summitland.com', status: 'Suspended', plan: 'Enterprise Plan', cycle: 'Monthly', storage: '2.4 GB', date: '2026-02-10' }
    ];
    localStorage.setItem('companies', JSON.stringify(initial));
    return initial;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = companies.map((c: any) => c.id === id ? { ...c, status: newStatus } : c);
    setCompanies(updated);
    localStorage.setItem('companies', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies Directory"
        description="Manage the SaaS client companies, account configuration, and resource usage."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Companies' }]}
        action={{
          label: 'Create Company',
          onClick: () => navigate({ to: '/companies/new' }),
          icon: <Plus className="w-4 h-4" />
        }}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex justify-between items-center bg-card/65 backdrop-blur">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input placeholder="Search companies..." className="pl-9 pr-4 py-2 w-full text-xs font-semibold rounded-lg bg-secondary border focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Company Details</th>
                <th className="p-4">Code</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Plan & Cycle</th>
                <th className="p-4">Storage</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {companies.map((c: any) => (
                <tr key={c.id} className="hover:bg-accent/40 transition">
                  <td className="p-4">
                    <div className="font-extrabold text-sm text-primary cursor-pointer hover:underline" onClick={() => navigate({ to: `/companies/details` })}>{c.name}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">{c.businessName} • {c.website}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-foreground/80">{c.code}</td>
                  <td className="p-4">
                    <div>{c.contact}</div>
                    <div className="text-[10px] text-muted-foreground font-semibold">{c.email} • {c.phone}</div>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={c.plan} />
                    <div className="text-[10px] text-muted-foreground font-semibold mt-1">{c.cycle} Billing</div>
                  </td>
                  <td className="p-4 font-bold">{c.storage}</td>
                  <td className="p-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{c.date}</td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/companies/details` })}><Eye className="w-4 h-4" /></Button>
                    {c.status === 'Active' ? (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(c.id, 'Suspended')} className="text-rose-500 hover:text-rose-600"><Ban className="w-4 h-4" /></Button>
                    ) : (
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(c.id, 'Active')} className="text-emerald-500 hover:text-emerald-600"><CheckCircle className="w-4 h-4" /></Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. CREATE COMPANY FORM
const NewCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const name = (target.elements.namedItem('companyName') as HTMLInputElement).value;
    const businessName = (target.elements.namedItem('businessName') as HTMLInputElement).value;
    const code = (target.elements.namedItem('companyCode') as HTMLInputElement).value;
    const contact = (target.elements.namedItem('contactPerson') as HTMLInputElement).value;
    const email = (target.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (target.elements.namedItem('phone') as HTMLInputElement).value;
    const website = (target.elements.namedItem('website') as HTMLInputElement).value;
    const plan = (target.elements.namedItem('plan') as HTMLSelectElement).value;

    const stored = localStorage.getItem('companies');
    let companiesList: any[] = [];
    if (stored) {
      companiesList = JSON.parse(stored);
    } else {
      companiesList = [
        { id: '1', name: 'Apex Property Management', businessName: 'Apex PM LLC', code: 'APEX', contact: 'Sarah Davis', email: 'sarah@apexpm.com', phone: '555-0199', website: 'apexpm.com', status: 'Active', plan: 'Pro Plan', cycle: 'Monthly', storage: '1.2 GB', date: '2026-01-15' },
        { id: '2', name: 'Horizon Living', businessName: 'Horizon Rentals Inc', code: 'HRZN', contact: 'Mark Wilson', email: 'mark@horizon.com', phone: '555-0244', website: 'horizonrentals.com', status: 'Active', plan: 'Basic Plan', cycle: 'Annual', storage: '800 MB', date: '2026-03-22' },
        { id: '3', name: 'Summit Group', businessName: 'Summit Land Corp', code: 'SMMT', contact: 'Rachel Green', email: 'rachel@summit.com', phone: '555-0311', website: 'summitland.com', status: 'Suspended', plan: 'Enterprise Plan', cycle: 'Monthly', storage: '2.4 GB', date: '2026-02-10' }
      ];
    }

    const newCompany = {
      id: `company-${Date.now()}`,
      name,
      businessName: businessName || 'N/A',
      code: code.toUpperCase(),
      contact,
      email,
      phone: phone || 'N/A',
      website: website || 'N/A',
      status: 'Active',
      plan,
      cycle: 'Monthly',
      storage: '0 MB',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedList = [...companiesList, newCompany];
    localStorage.setItem('companies', JSON.stringify(updatedList));

    // Also register the primary contact person as the first administrator user for this company
    const storedUsers = localStorage.getItem('company_users');
    let usersList: any[] = [];
    if (storedUsers) {
      usersList = JSON.parse(storedUsers);
    } else {
      usersList = [
        { name: 'Sarah Davis', email: 'sarah@apexpm.com', role: 'Administrator', status: 'Active', lastLogin: '2026-07-20 04:33', companyName: 'Apex Property Management' },
        { name: 'David Miller', email: 'david@apexpm.com', role: 'Property Manager', status: 'Active', lastLogin: '2026-07-19 16:10', companyName: 'Apex Property Management' },
        { name: 'Emma Wilson', email: 'emma@apexpm.com', role: 'Staff Member', status: 'Active', lastLogin: '2026-07-20 01:24', companyName: 'Apex Property Management' },
        { name: 'John Horizon', email: 'john@horizon.com', role: 'Administrator', status: 'Active', lastLogin: '2026-07-20 08:12', companyName: 'Horizon Living' },
        { name: 'Rachel Summit', email: 'rachel@summit.com', role: 'Administrator', status: 'Active', lastLogin: '2026-07-19 12:45', companyName: 'Summit Group' }
      ];
    }

    const newCompanyUser = {
      name: contact,
      email: email,
      role: 'Administrator',
      status: 'Active',
      lastLogin: 'Just Registered',
      companyName: name
    };

    localStorage.setItem('company_users', JSON.stringify([...usersList, newCompanyUser]));

    setSuccess(true);
    setTimeout(() => {
      navigate({ to: '/companies' });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Create New Company"
        description="Register a new subscriber tenant onto the SaaS platform."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Companies', href: '/companies' }, { label: 'New' }]}
      />
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 p-4 rounded-xl text-xs font-semibold text-center">
          Company profile created successfully! Redirecting...
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Company Name</label>
            <input name="companyName" required placeholder="Apex Property Management" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Business Name (Legal)</label>
            <input name="businessName" placeholder="Apex PM LLC" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Company Code</label>
            <input name="companyCode" required maxLength={5} placeholder="APEX" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary uppercase focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Primary Contact Person</label>
            <input name="contactPerson" required placeholder="Sarah Davis" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Email Address</label>
            <input name="email" required type="email" placeholder="sarah@apexpm.com" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Phone Number</label>
            <input name="phone" placeholder="555-0199" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Website</label>
            <input name="website" placeholder="www.apexpm.com" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-muted-foreground">Subscription Plan</label>
            <select name="plan" className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-secondary focus:ring-1 focus:ring-primary focus:outline-none">
              <option>Basic Plan</option>
              <option>Pro Plan</option>
              <option>Enterprise Plan</option>
            </select>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/companies' })}>Cancel</Button>
          <Button type="submit">Create Company</Button>
        </div>
      </form>
    </div>
  );
};

// 3. COMPANY DETAILS / METRICS & USAGE
const CompanyDetailsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Profile Details"
        description="Detailed review of registered companies, account subscription plan status, usage stats and limits."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Companies', href: '/companies' }, { label: 'Details' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Operational Information</h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground font-semibold">Company Name</span>
              <p className="font-bold text-sm">Apex Property Management</p>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Legal Entity</span>
              <p className="font-bold text-sm">Apex PM LLC</p>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Contact Email</span>
              <p className="font-bold text-sm">sarah@apexpm.com</p>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Phone</span>
              <p className="font-bold text-sm">555-0199</p>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Website</span>
              <p className="font-bold text-sm">apexpm.com</p>
            </div>
            <div>
              <span className="text-muted-foreground font-semibold">Date Registered</span>
              <p className="font-bold text-sm font-mono">2026-01-15</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Subscription & Limits</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Active Plan:</span>
              <StatusBadge status="Pro Plan" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Billing Period:</span>
              <span className="font-bold">Monthly</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Storage Capacity:</span>
              <span className="font-bold">1.2 GB / 50 GB Used</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '2.4%' }} />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">User Seats:</span>
              <span className="font-bold">8 / 25 Registered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3a. COMPANY USERS LIST
const CompanyUsersPage: React.FC = () => {
  const [companiesList] = React.useState<any[]>(() => {
    const stored = localStorage.getItem('companies');
    if (stored) return JSON.parse(stored);
    return [
      { id: '1', name: 'Apex Property Management', status: 'Active' },
      { id: '2', name: 'Horizon Living', status: 'Active' },
      { id: '3', name: 'Summit Group', status: 'Suspended' }
    ];
  });

  const [allUsers] = React.useState<any[]>(() => {
    const storedUsers = localStorage.getItem('company_users');
    if (storedUsers) return JSON.parse(storedUsers);
    const initialUsers = [
      { name: 'Sarah Davis', email: 'sarah@apexpm.com', role: 'Administrator', status: 'Active', lastLogin: '2026-07-20 04:33', companyName: 'Apex Property Management' },
      { name: 'David Miller', email: 'david@apexpm.com', role: 'Property Manager', status: 'Active', lastLogin: '2026-07-19 16:10', companyName: 'Apex Property Management' },
      { name: 'Emma Wilson', email: 'emma@apexpm.com', role: 'Staff Member', status: 'Active', lastLogin: '2026-07-20 01:24', companyName: 'Apex Property Management' },
      { name: 'John Horizon', email: 'john@horizon.com', role: 'Administrator', status: 'Active', lastLogin: '2026-07-20 08:12', companyName: 'Horizon Living' },
      { name: 'Rachel Summit', email: 'rachel@summit.com', role: 'Administrator', status: 'Active', lastLogin: '2026-07-19 12:45', companyName: 'Summit Group' }
    ];
    localStorage.setItem('company_users', JSON.stringify(initialUsers));
    return initialUsers;
  });

  // Filter out users belonging to companies that are Suspended
  const visibleUsers = allUsers.filter(u => {
    const comp = companiesList.find((c: any) => c.name === u.companyName);
    return !comp || comp.status === 'Active';
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Registered Users"
        description="Manage seat allocations, account configurations, and profiles for subscriber companies."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Companies', href: '/companies' }, { label: 'Users' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Associated Company</th>
                <th className="p-4">Company Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {visibleUsers.map((u, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{u.name}</td>
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4 text-primary font-bold">{u.companyName}</td>
                  <td className="p-4"><StatusBadge status={u.role} /></td>
                  <td className="p-4"><StatusBadge status={u.status} /></td>
                  <td className="p-4 text-muted-foreground font-mono">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3b. COMPANY SUBSCRIPTION DETAILS
const CompanySubscriptionPage: React.FC = () => {
  const invoices = [
    { id: 'INV-001', date: '2026-07-15', amount: 149, status: 'Paid' },
    { id: 'INV-002', date: '2026-06-15', amount: 149, status: 'Paid' },
    { id: 'INV-003', date: '2026-05-15', amount: 149, status: 'Paid' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Plan Subscription"
        description="SaaS billing settings, plan parameters, invoices, and credit card updates."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Companies', href: '/companies' }, { label: 'Subscription' }]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Invoice Billing History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Billing Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium text-foreground">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-accent/40 transition">
                    <td className="p-4 font-mono font-bold text-primary">{inv.id}</td>
                    <td className="p-4 font-mono text-muted-foreground">{inv.date}</td>
                    <td className="p-4 font-bold">${inv.amount}</td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Active Plan Options</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Current Plan:</span>
              <StatusBadge status="Pro Plan" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Payment Method:</span>
              <span className="font-bold">Visa ending in 4242</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Renewal Date:</span>
              <span className="font-bold font-mono">2026-08-15</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3c. COMPANY USAGE STATISTICS
const CompanyUsagePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Resource Usage"
        description="Detailed resource consumption, database usage, units managed, and bandwidth statistics."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Companies', href: '/companies' }, { label: 'Usage' }]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span>Disk Storage Usage</span>
            <span className="text-primary">1.2 GB / 50 GB (2.4%)</span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '2.4%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Includes lease documents, property photos, and invoice PDFs.</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span>Total Managed Units</span>
            <span className="text-emerald-500">42 / 200 Units (21%)</span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '21%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Number of active property units currently managed inside manager dashboard.</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span>Monthly API Requests</span>
            <span className="text-purple-500">4,500 / 50,000 (9%)</span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '9%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Usage statistics for integrations, webhooks, and REST endpoints.</p>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span>Bandwidth Consumption</span>
            <span className="text-amber-500">18.4 GB / 500 GB (3.6%)</span>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '3.6%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground font-medium">Data transfer statistics for upload and download operations.</p>
        </div>
      </div>
    </div>
  );
};

// 4a. PRICING PLANS MANAGER (CREATE & LIST PLANS)
const SubscriptionPlansPage: React.FC = () => {
  const [plans, setPlans] = React.useState([
    { id: '1', name: 'Basic Plan', price: 79, cycle: 'Monthly', units: 'Up to 50 Units', storage: '10 GB', features: 'Email support, standard reports', status: 'Active' },
    { id: '2', name: 'Pro Plan', price: 149, cycle: 'Monthly', units: 'Up to 250 Units', storage: '50 GB', features: 'Priority support, trust accounts, custom branding', status: 'Active' },
    { id: '3', name: 'Enterprise Plan', price: 499, cycle: 'Monthly', units: 'Unlimited Units', storage: '500 GB', features: '24/7 dedicated support, dedicated database, API keys', status: 'Active' }
  ]);

  const [showCreate, setShowCreate] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [newPlan, setNewPlan] = React.useState({ name: '', price: '', cycle: 'Monthly', units: '', storage: '', features: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) return;
    if (editId) {
      setPlans(prev => prev.map(p => p.id === editId ? {
        ...p,
        name: newPlan.name,
        price: Number(newPlan.price),
        cycle: newPlan.cycle,
        units: newPlan.units,
        storage: newPlan.storage,
        features: newPlan.features
      } : p));
      setEditId(null);
    } else {
      setPlans(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          name: newPlan.name,
          price: Number(newPlan.price),
          cycle: newPlan.cycle,
          units: newPlan.units || 'Unlimited',
          storage: newPlan.storage || '100 GB',
          features: newPlan.features || 'Standard Features',
          status: 'Active'
        }
      ]);
    }
    setNewPlan({ name: '', price: '', cycle: 'Monthly', units: '', storage: '', features: '' });
    setShowCreate(false);
  };

  const handleEditClick = (plan: any) => {
    setNewPlan({
      name: plan.name,
      price: String(plan.price),
      cycle: plan.cycle,
      units: plan.units,
      storage: plan.storage,
      features: plan.features
    });
    setEditId(plan.id);
    setShowCreate(true);
  };

  const handleCancel = () => {
    setShowCreate(false);
    setEditId(null);
    setNewPlan({ name: '', price: '', cycle: 'Monthly', units: '', storage: '', features: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Pricing Plans"
        description="Configure subscription plans, manage pricing structures, and create new offers for subscriber companies."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Subscriptions' }, { label: 'Plans' }]}
        action={{
          label: 'Create Pricing Plan',
          onClick: () => {
            handleCancel();
            setShowCreate(true);
          },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {showCreate && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-2xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">
            {editId ? "Edit Subscription Plan" : "Create New Subscription Plan"}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Plan Name</label>
              <input 
                required 
                value={newPlan.name} 
                onChange={e => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Pro Plus Plan" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Price ($)</label>
              <input 
                required 
                type="number" 
                value={newPlan.price} 
                onChange={e => setNewPlan(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g. 199" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Billing Cycle</label>
              <select 
                value={newPlan.cycle} 
                onChange={e => setNewPlan(prev => ({ ...prev, cycle: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>Monthly</option>
                <option>Annual</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Units Limit</label>
              <input 
                value={newPlan.units} 
                onChange={e => setNewPlan(prev => ({ ...prev, units: e.target.value }))}
                placeholder="e.g. Up to 500 Units" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1 text-xs col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Storage Capacity</label>
              <input 
                value={newPlan.storage} 
                onChange={e => setNewPlan(prev => ({ ...prev, storage: e.target.value }))}
                placeholder="e.g. 100 GB" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1 text-xs col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Included Features & Details</label>
              <textarea 
                value={newPlan.features} 
                onChange={e => setNewPlan(prev => ({ ...prev, features: e.target.value }))}
                placeholder="List features separated by commas..." 
                rows={2} 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit">
              {editId ? "Update Pricing Plan" : "Publish Pricing Plan"}
            </Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p.id} className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg text-foreground">{p.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase mt-0.5">{p.cycle} Billing</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="flex items-baseline text-foreground">
                <span className="text-3xl font-extrabold tracking-tight">${p.price}</span>
                <span className="ml-1 text-xs text-muted-foreground font-semibold">/month</span>
              </div>
              <div className="space-y-2 text-xs font-medium border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Properties Limit:</span>
                  <span className="font-bold">{p.units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disk Storage:</span>
                  <span className="font-bold">{p.storage}</span>
                </div>
                <div className="pt-2">
                  <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wide">Included Features:</span>
                  <p className="font-bold text-primary mt-1 text-[11px] leading-relaxed">{p.features}</p>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t mt-6">
              <Button variant="outline" onClick={() => handleEditClick(p)} className="w-full font-bold text-xs">Edit Plan Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4b. ACTIVE SUBSCRIPTIONS LIST
const ActiveSubscriptionsPage: React.FC = () => {
  const subs = [
    { id: '1', plan: 'Pro Plan', company: 'Apex Property Management', price: 149, cycle: 'Monthly', nextBill: '2026-08-15', status: 'Active', trialEnds: 'N/A', paymentStatus: 'Paid' },
    { id: '2', plan: 'Basic Plan', company: 'Horizon Living', price: 79, cycle: 'Annual', nextBill: '2027-03-22', status: 'Active', trialEnds: 'N/A', paymentStatus: 'Paid' },
    { id: '3', plan: 'Enterprise Plan', company: 'Summit Group', price: 499, cycle: 'Monthly', nextBill: '2026-08-10', status: 'Past Due', trialEnds: 'N/A', paymentStatus: 'Failed' },
    { id: '4', plan: 'Pro Plan', company: 'Pioneer Landlord Co', price: 149, cycle: 'Monthly', nextBill: '2026-08-01', status: 'Trial', trialEnds: '2026-07-31', paymentStatus: 'N/A' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Company Subscriptions"
        description="Monitor active SaaS company subscribers, next billing details, and trial status."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Subscriptions', href: '/subscriptions/plans' }, { label: 'Active' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Plan Option</th>
                <th className="p-4">Subscriber Company</th>
                <th className="p-4">Monthly Price</th>
                <th className="p-4">Billing Cycle</th>
                <th className="p-4">Next Billing Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Trial Expiry</th>
                <th className="p-4">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {subs.map(s => (
                <tr key={s.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{s.plan}</td>
                  <td className="p-4 font-bold text-primary">{s.company}</td>
                  <td className="p-4">${s.price}</td>
                  <td className="p-4">{s.cycle}</td>
                  <td className="p-4 font-mono">{s.nextBill}</td>
                  <td className="p-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{s.trialEnds}</td>
                  <td className="p-4">
                    <StatusBadge status={s.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4c. SUBSCRIPTIONS INVOICES LIST
const SubscriptionInvoicesPage: React.FC = () => {
  const invoices = [
    { id: 'INV-1020', company: 'Apex Property Management', plan: 'Pro Plan', amount: 149, date: '2026-07-15', status: 'Paid' },
    { id: 'INV-1019', company: 'Horizon Living', plan: 'Basic Plan', amount: 948, date: '2026-03-22', status: 'Paid' },
    { id: 'INV-1018', company: 'Summit Group', plan: 'Enterprise Plan', amount: 499, date: '2026-07-10', status: 'Unpaid' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing Invoices Ledger"
        description="Monitor system-wide invoices, client company receipts, and tax allocations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Subscriptions', href: '/subscriptions/plans' }, { label: 'Invoices' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Invoice ID</th>
                <th className="p-4">Company</th>
                <th className="p-4">Plan Item</th>
                <th className="p-4">Amount Paid</th>
                <th className="p-4">Invoice Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold text-primary">{inv.id}</td>
                  <td className="p-4 font-bold">{inv.company}</td>
                  <td className="p-4 font-semibold">{inv.plan}</td>
                  <td className="p-4 font-bold">${inv.amount}</td>
                  <td className="p-4 font-mono text-muted-foreground">{inv.date}</td>
                  <td className="p-4"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4d. SUBSCRIPTIONS PAYMENTS LEDGER
const SubscriptionPaymentsPage: React.FC = () => {
  const transactions = [
    { txId: 'ch_stripe_8820', company: 'Apex Property Management', method: 'Visa ending 4242', amount: 149, date: '2026-07-15 09:12', status: 'Success' },
    { txId: 'ch_stripe_4112', company: 'Summit Group', method: 'Mastercard ending 9900', amount: 499, date: '2026-07-10 14:02', status: 'Failed' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gateway Payments Ledger"
        description="Verify Stripe credit card payouts, transaction statuses, and refund records."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Subscriptions', href: '/subscriptions/plans' }, { label: 'Payments' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Company</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Processed Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {transactions.map(tx => (
                <tr key={tx.txId} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold text-primary">{tx.txId}</td>
                  <td className="p-4 font-bold">{tx.company}</td>
                  <td className="p-4 font-semibold">{tx.method}</td>
                  <td className="p-4 font-bold">${tx.amount}</td>
                  <td className="p-4 font-mono text-muted-foreground">{tx.date}</td>
                  <td className="p-4"><StatusBadge status={tx.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4e. SUBSCRIPTIONS COUPONS MANAGER
const SubscriptionCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = React.useState([
    { code: 'SUMMER50', discount: '50%', duration: '3 Months', used: 12, maxUses: 100, status: 'Active' },
    { code: 'WELCOMPM', discount: '10%', duration: 'Forever', used: 24, maxUses: 500, status: 'Active' }
  ]);

  const [showForm, setShowForm] = React.useState(false);
  const [newCoupon, setNewCoupon] = React.useState({ code: '', discount: '', duration: 'Forever', maxUses: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) return;
    setCoupons(prev => [
      ...prev,
      {
        code: newCoupon.code.toUpperCase(),
        discount: newCoupon.discount,
        duration: newCoupon.duration,
        used: 0,
        maxUses: Number(newCoupon.maxUses) || 100,
        status: 'Active'
      }
    ]);
    setNewCoupon({ code: '', discount: '', duration: 'Forever', maxUses: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional Coupons"
        description="Publish discount coupons, campaign codes, and subscription cost overrides."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Subscriptions', href: '/subscriptions/plans' }, { label: 'Coupons' }]}
        action={{
          label: 'Create Coupon Code',
          onClick: () => setShowForm(!showForm),
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-md">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Create New Coupon</h2>
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Promo Code</label>
              <input 
                required 
                value={newCoupon.code} 
                onChange={e => setNewCoupon(prev => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. APEXSTART" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Discount Value (e.g. 50% or $20)</label>
              <input 
                required 
                value={newCoupon.discount} 
                onChange={e => setNewCoupon(prev => ({ ...prev, discount: e.target.value }))}
                placeholder="e.g. 20% or $15" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Duration</label>
              <select 
                value={newCoupon.duration} 
                onChange={e => setNewCoupon(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>Forever</option>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Max Usage Limit</label>
              <input 
                type="number" 
                value={newCoupon.maxUses} 
                onChange={e => setNewCoupon(prev => ({ ...prev, maxUses: e.target.value }))}
                placeholder="e.g. 100" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Activate Coupon</Button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount Amount</th>
                <th className="p-4">Duration Term</th>
                <th className="p-4">Redemption Count</th>
                <th className="p-4">Max Uses</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {coupons.map((c, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-extrabold text-primary font-mono">{c.code}</td>
                  <td className="p-4 font-bold">{c.discount}</td>
                  <td className="p-4 font-semibold">{c.duration}</td>
                  <td className="p-4 font-bold">{c.used} redemptions</td>
                  <td className="p-4 font-mono text-muted-foreground">{c.maxUses}</td>
                  <td className="p-4"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. PLATFORM USERS PAGE
const PlatformUsersPage: React.FC = () => {
  const usersList = [
    { name: 'John Doe', email: 'admin@apexpm.com', role: 'Super Admin', company: 'SaaS Platform Owner', status: 'Active', lastLogin: '2026-07-20 05:12' },
    { name: 'Sarah Davis', email: 'manager@apexpm.com', role: 'Property Manager', company: 'Apex Property Management', status: 'Active', lastLogin: '2026-07-20 04:33' },
    { name: 'Lakeside Development', email: 'owner@apexpm.com', role: 'Owner', company: 'Lakeside Development Co', status: 'Active', lastLogin: '2026-07-19 14:02' },
    { name: 'Robert Johnson', email: 'tenant@apexpm.com', role: 'Tenant', company: 'Apex Rental Portfolio', status: 'Active', lastLogin: '2026-07-20 02:11' },
    { name: 'Alex Thompson', email: 'alex@sunsetvillas.com', role: 'Property Manager', company: 'Horizon Living', status: 'Suspended', lastLogin: '2026-06-12 11:24' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Platform Users"
        description="Oversee and manage global accounts, role configurations, and access details."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platform Users' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Platform Role</th>
                <th className="p-4">Assigned Company</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {usersList.map((u, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{u.name}</td>
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4">
                    <StatusBadge status={u.role} />
                  </td>
                  <td className="p-4">{u.company}</td>
                  <td className="p-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{u.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. SUPPORT TICKETS PAGE
const SupportTicketsPage: React.FC = () => {
  const tickets = [
    { id: 'TKT-102', company: 'Apex Property Management', topic: 'SMTP Email Configuration Issue', type: 'Ticket', priority: 'High', status: 'In Progress', date: '2026-07-20' },
    { id: 'FDB-882', company: 'Horizon Living', topic: 'Requested eSignature integration update', type: 'Feedback', priority: 'Medium', status: 'Waiting', date: '2026-07-19' },
    { id: 'TKT-101', company: 'Summit Group', topic: 'Failed stripe webhook payment retry', type: 'Ticket', priority: 'Critical', status: 'Resolved', date: '2026-07-18' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support & Feedback center"
        description="Review tickets, custom requests, and feedback sent by platform managers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Support' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">Company</th>
                <th className="p-4">Inquiry / Topic</th>
                <th className="p-4">Type</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold">{t.id}</td>
                  <td className="p-4 font-bold">{t.company}</td>
                  <td className="p-4">{t.topic}</td>
                  <td className="p-4">{t.type}</td>
                  <td className="p-4">
                    <StatusBadge status={t.priority} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6a. SUPPORT FEEDBACK PAGE
const SupportFeedbackPage: React.FC = () => {
  const feedbacks = [
    { id: 'FDB-001', company: 'Horizon Living', score: '5 Stars', text: 'Excellent dashboard layout! It is very easy to manage property leasing workflows now.', date: '2026-07-19' },
    { id: 'FDB-002', company: 'Summit Group', score: '4 Stars', text: 'Feature flags are extremely helpful for rolling out beta properties features.', date: '2026-07-17' },
    { id: 'FDB-003', company: 'Apex Property Management', score: '5 Stars', text: 'The new dashboard Recharts integration makes global revenue tracking so transparent.', date: '2026-07-15' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Customer Feedback"
        description="Review ratings, NPS scores, and system reviews sent in by property managers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Support', href: '/support/tickets' }, { label: 'Feedback' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Feedback ID</th>
                <th className="p-4">Company</th>
                <th className="p-4">Satisfaction Score</th>
                <th className="p-4">Customer Review Comments</th>
                <th className="p-4">Submitted Date</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {feedbacks.map(f => (
                <tr key={f.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold text-primary">{f.id}</td>
                  <td className="p-4 font-bold">{f.company}</td>
                  <td className="p-4"><StatusBadge status={f.score} /></td>
                  <td className="p-4 italic text-muted-foreground">"{f.text}"</td>
                  <td className="p-4 font-mono text-muted-foreground">{f.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6b. PUBLIC CONTACT REQUESTS PAGE
const SupportContactPage: React.FC = () => {
  const requests = [
    { name: 'John Peterson', company: 'Peterson Realty', email: 'john@peterson.com', phone: '555-9088', message: 'Looking for a custom enterprise tier package with 1,000 units.', date: '2026-07-20' },
    { name: 'Alice Watson', company: 'Watson & Co', email: 'alice@watson.com', phone: '555-1122', message: 'Requesting a demo call to review trust accounting capabilities next week.', date: '2026-07-18' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Website Contact Requests"
        description="Oversee incoming sales inquiries, trial requests, and contact messages."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Support', href: '/support/tickets' }, { label: 'Contact Requests' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Contact Name</th>
                <th className="p-4">Business / Company</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Sales Message Inquiry</th>
                <th className="p-4">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {requests.map((r, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{r.name}</td>
                  <td className="p-4 font-bold text-primary">{r.company}</td>
                  <td className="p-4 font-mono">{r.email}</td>
                  <td className="p-4 font-mono">{r.phone}</td>
                  <td className="p-4 text-muted-foreground font-medium">{r.message}</td>
                  <td className="p-4 font-mono text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 7a. PLATFORM SETTINGS GENERAL
const PlatformSettingsGeneralView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="General Platform Config"
        description="Modify global SaaS metadata parameters, timezone default settings, and system-wide options."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platform Settings' }, { label: 'General' }]}
      />
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Global SaaS Properties</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Platform System Name</label>
            <input defaultValue="Apex SaaS Platform" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">System Support Email</label>
            <input defaultValue="support@apexpm.com" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Default System Currency</label>
            <select className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">SaaS App Timezone</label>
            <select className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none">
              <option>UTC (Coordinated Universal Time)</option>
              <option>EST (Eastern Standard Time)</option>
              <option>PST (Pacific Standard Time)</option>
            </select>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xs">
            <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
            <span className="font-bold text-rose-500">Enable Maintenance Mode (Restricts Tenant/Owner Portals)</span>
          </div>
          <Button className="font-bold bg-primary text-white hover:bg-primary/95">Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

// 7b. PLATFORM SETTINGS EMAIL
const PlatformSettingsEmailView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Email Server Settings"
        description="Configure SMTP delivery endpoints, credentials, secure TLS/SSL options, and sandbox email triggers."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platform Settings' }, { label: 'Email' }]}
      />
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">SMTP Mail Server Config</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">SMTP Server Host</label>
            <input defaultValue="smtp.sendgrid.net" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">SMTP Port</label>
            <input defaultValue="587" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">SMTP Username</label>
            <input defaultValue="apikey" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">SMTP Secure Password</label>
            <input type="password" placeholder="••••••••••••••••" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
        </div>
        <div className="border-t pt-4 flex justify-end">
          <Button className="font-bold bg-primary text-white hover:bg-primary/95">Save Email Config</Button>
        </div>
      </div>
    </div>
  );
};

// 7c. PLATFORM SETTINGS STORAGE
const PlatformSettingsStorageView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Cloud Storage Providers"
        description="Integrate Amazon S3 or Google Cloud storage bucket services to house tenant lease paperwork."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platform Settings' }, { label: 'Storage' }]}
      />
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">AWS S3 Assets Configuration</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">S3 Default Region</label>
            <input defaultValue="us-east-1" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">AWS S3 Bucket Name</label>
            <input defaultValue="doorloop-saas-production-storage" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
        </div>
        <div className="border-t pt-4 flex justify-end">
          <Button className="font-bold bg-primary text-white hover:bg-primary/95">Save Storage Config</Button>
        </div>
      </div>
    </div>
  );
};

// 7d. PLATFORM SETTINGS BRANDING
const PlatformSettingsBrandingView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="White-Label & Branding"
        description="Update platform CSS colors, primary layout logo uploads, and custom web app favicon elements."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Platform Settings' }, { label: 'Branding' }]}
      />
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Logo & CSS Brand Theme</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">App Brand Hex Code Color</label>
            <div className="flex space-x-2">
              <input type="color" defaultValue="#3b82f6" className="w-10 h-8 rounded border p-0 cursor-pointer" />
              <input defaultValue="#3b82f6" className="flex-1 p-2 rounded border bg-secondary text-xs font-semibold" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Brand Custom Domain Mapping</label>
            <input defaultValue="app.doorloop-apex.com" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
        </div>
        <div className="border-t pt-4 flex justify-end">
          <Button className="font-bold bg-primary text-white hover:bg-primary/95">Save Branding Options</Button>
        </div>
      </div>
    </div>
  );
};

// 8a. PLATFORM INTEGRATIONS CONNECTED APPS
const PlatformIntegrationsConnectedView: React.FC = () => {
  const apps = [
    { name: 'Stripe Payments', category: 'Payment Gateways', desc: 'SaaS subscription processing integration', connected: 'Yes', status: 'Active' },
    { name: 'Twilio SMS', category: 'SMS Gateway', desc: 'System notification SMS messages dispatch', connected: 'Yes', status: 'Active' },
    { name: 'SendGrid Email', category: 'Email (SMTP)', desc: 'Transactional platform emails delivery', connected: 'Yes', status: 'Active' },
    { name: 'QuickBooks Accounting', category: 'Accounting Sync', desc: 'Sync customer company transactions and payouts', connected: 'No', status: 'Inactive' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorized Connected Applications"
        description="Verify third-party client credentials, system-level SMTP bridges, and SMS gateways connected globally."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Integrations' }, { label: 'Connected Apps' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Application Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Connected status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {apps.map((app, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{app.name}</td>
                  <td className="p-4 font-semibold">{app.category}</td>
                  <td className="p-4 text-muted-foreground">{app.desc}</td>
                  <td className="p-4"><StatusBadge status={app.status} /></td>
                  <td className="p-4">
                    <Button variant="outline" size="sm" className="font-bold text-[10px]">
                      {app.connected === 'Yes' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8b. PLATFORM API KEYS
const PlatformIntegrationsKeysView: React.FC = () => {
  const keys = [
    { name: 'Production Dashboard API Key', scope: 'Read/Write', prefix: 'pk_live_••••a899', created: '2026-01-20', status: 'Active' },
    { name: 'Staging Sandbox Testing Key', scope: 'Read-Only', prefix: 'pk_test_••••1100', created: '2026-03-12', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Developer API Credentials"
        description="Provision global authentication keys, developer credentials, and restrict scopes for corporate account APIs."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Integrations' }, { label: 'API Keys' }]}
        action={{
          label: 'Generate API Key',
          onClick: () => {},
          icon: <Plus className="w-4 h-4" />
        }}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">API Key Description</th>
                <th className="p-4">Access Scope</th>
                <th className="p-4">Token Preview</th>
                <th className="p-4">Created Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {keys.map((k, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{k.name}</td>
                  <td className="p-4 font-semibold text-primary">{k.scope}</td>
                  <td className="p-4 font-mono text-muted-foreground">{k.prefix}</td>
                  <td className="p-4 font-mono text-muted-foreground">{k.created}</td>
                  <td className="p-4"><StatusBadge status={k.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8c. PLATFORM WEBHOOK ENDPOINTS
const PlatformIntegrationsWebhooksView: React.FC = () => {
  const webhooks = [
    { url: 'https://api.doorloop-apex.com/v1/billing/stripe', events: 'invoice.paid, invoice.payment_failed', status: 'Active' },
    { url: 'https://api.doorloop-apex.com/v1/notifications/twilio-sms', events: 'message.delivered, message.failed', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incoming & Outgoing Webhooks"
        description="Administer secure system webhook listening triggers and configure automated response patterns."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Integrations' }, { label: 'Webhooks' }]}
        action={{
          label: 'Add Webhook Endpoint',
          onClick: () => {},
          icon: <Plus className="w-4 h-4" />
        }}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Target Endpoint URL</th>
                <th className="p-4">Trigger Event Types</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {webhooks.map((w, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold text-primary">{w.url}</td>
                  <td className="p-4 font-mono text-muted-foreground">{w.events}</td>
                  <td className="p-4"><StatusBadge status={w.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 9a. PLATFORM SECURITY AUDIT LOGS
const PlatformSecurityAuditView: React.FC = () => {
  const logs = [
    { id: '1', action: 'Company Suspension', user: 'admin@apexpm.com', ip: '198.162.0.12', time: '2026-07-20 05:39' },
    { id: '2', action: 'Changed Platform SMTP settings', user: 'admin@apexpm.com', ip: '198.162.0.12', time: '2026-07-20 04:12' },
    { id: '3', action: 'Generated New Production API Key', user: 'admin@apexpm.com', ip: '198.162.0.8', time: '2026-07-19 11:05' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Audit Logs"
        description="Verify system audit trails, corporate policy overrides, and platform configuration changes."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Security' }, { label: 'Audit Logs' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Audit ID</th>
                <th className="p-4">Action Taken</th>
                <th className="p-4">Authorized User</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold">AUD-{l.id}</td>
                  <td className="p-4 font-bold">{l.action}</td>
                  <td className="p-4">{l.user}</td>
                  <td className="p-4 font-mono text-muted-foreground">{l.ip}</td>
                  <td className="p-4 font-mono text-muted-foreground">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 9b. PLATFORM LOGIN HISTORY
const PlatformSecurityLoginView: React.FC = () => {
  const logins = [
    { email: 'admin@apexpm.com', role: 'Super Admin', ip: '198.162.0.12', device: 'Chrome on Windows', status: 'Success', time: '2026-07-20 05:12' },
    { email: 'manager@apexpm.com', role: 'Property Manager', ip: '198.162.0.15', device: 'Safari on macOS', status: 'Success', time: '2026-07-20 04:33' },
    { email: 'owner@apexpm.com', role: 'Owner', ip: '198.162.0.22', device: 'Firefox on Linux', status: 'Success', time: '2026-07-19 14:02' },
    { email: 'invalid@hacker.com', role: 'Unknown', ip: '45.12.88.9', device: 'Chrome on Windows', status: 'Failed', time: '2026-07-19 10:11' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Session Login History"
        description="Monitor user sessions, login devices, geolocation IPs, and failed authentication attempts."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Security' }, { label: 'Login History' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Login Email</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Browser & Device</th>
                <th className="p-4">Status</th>
                <th className="p-4">Login Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {logins.map((l, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{l.email}</td>
                  <td className="p-4"><StatusBadge status={l.role} /></td>
                  <td className="p-4 font-mono text-muted-foreground">{l.ip}</td>
                  <td className="p-4 text-muted-foreground">{l.device}</td>
                  <td className="p-4"><StatusBadge status={l.status} /></td>
                  <td className="p-4 font-mono text-muted-foreground">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 9c. PLATFORM SECURITY POLICIES
const PlatformSecurityPoliciesView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="System Security Policies"
        description="Enforce strong multi-factor authentication (MFA), password rotation, and idle session lock policies."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Security' }, { label: 'Policies' }]}
      />
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Global Policies & MFA Settings</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Minimum Password Length</label>
            <select className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none">
              <option>8 Characters</option>
              <option>12 Characters (Recommended)</option>
              <option>16 Characters</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Idle Session Timeout (Minutes)</label>
            <input defaultValue="30" type="number" className="w-full p-2 rounded border bg-secondary text-xs font-semibold" />
          </div>
        </div>
        <div className="space-y-4 border-t pt-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Authentication Enforcement</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="rounded border-border text-primary" />
              <span className="font-bold">Require Multi-Factor Authentication (MFA) for Super Admins</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-border text-primary" />
              <span className="font-bold">Force Periodic Password Rotation (Every 90 Days)</span>
            </div>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-end">
          <Button className="font-bold bg-primary text-white hover:bg-primary/95">Apply Security Policies</Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ==================== PROPERTY MANAGER NEW SUB-PAGES ========================
// ============================================================================

// 1. AMENITIES VIEW (WITH CRUD)
const AmenitiesPage: React.FC = () => {
  const [amenities, setAmenities] = React.useState([
    { id: '1', name: 'Swimming Pool Access', category: 'Recreation', desc: 'Allows access to clubhouse swimming pool', included: 'No', fee: 25, status: 'Active' },
    { id: '2', name: 'High-Speed Fiber Wifi', category: 'Utilities', desc: '1 Gbps internet connections', included: 'Yes', fee: 0, status: 'Active' },
    { id: '3', name: 'Reserved Underground Parking', category: 'Parking', desc: 'Secure indoor basement parking spot', included: 'No', fee: 75, status: 'Active' }
  ]);

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: '', category: 'Recreation', desc: '', included: 'No', fee: '', status: 'Active' });

  const handleEdit = (amenity: typeof amenities[0]) => {
    setEditingId(amenity.id);
    setForm({
      name: amenity.name,
      category: amenity.category,
      desc: amenity.desc,
      included: amenity.included,
      fee: String(amenity.fee),
      status: amenity.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAmenities(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingId) {
      // Update
      setAmenities(prev => prev.map(a => a.id === editingId ? {
        ...a,
        name: form.name,
        category: form.category,
        desc: form.desc,
        included: form.included,
        fee: Number(form.fee) || 0,
        status: form.status
      } : a));
      setEditingId(null);
    } else {
      // Create
      setAmenities(prev => [
        ...prev,
        {
          id: String(Date.now()),
          name: form.name,
          category: form.category,
          desc: form.desc,
          included: form.included,
          fee: Number(form.fee) || 0,
          status: form.status
        }
      ]);
    }

    setForm({ name: '', category: 'Recreation', desc: '', included: 'No', fee: '', status: 'Active' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties Amenities"
        description="Configure unit/building level amenities and pricing for tenant leases."
        breadcrumbs={[{ label: 'Properties', href: '/properties' }, { label: 'Amenities' }]}
        action={{
          label: editingId ? 'Edit Amenity' : 'Create Amenity',
          onClick: () => {
            if (showForm) {
              setEditingId(null);
              setForm({ name: '', category: 'Recreation', desc: '', included: 'No', fee: '', status: 'Active' });
            }
            setShowForm(!showForm);
          },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">
            {editingId ? 'Modify Amenity Details' : 'Create Custom Property Amenity'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Amenity Name</label>
              <input 
                required 
                value={form.name} 
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Storage Unit A" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>Recreation</option>
                <option>Utilities</option>
                <option>Parking</option>
                <option>Storage</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Fee ($)</label>
              <input 
                type="number" 
                value={form.fee} 
                onChange={e => setForm(prev => ({ ...prev, fee: e.target.value }))}
                placeholder="e.g. 0" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Rent Included?</label>
              <select 
                value={form.included} 
                onChange={e => setForm(prev => ({ ...prev, included: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
              <select 
                value={form.status} 
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
              <textarea 
                value={form.desc} 
                onChange={e => setForm(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="Describe amenity features..." 
                rows={2}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Amenity' : 'Add Amenity'}</Button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Amenity Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Description</th>
                <th className="p-4">Rent Included</th>
                <th className="p-4">Monthly Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {amenities.map((a, i) => (
                <tr key={a.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{a.name}</td>
                  <td className="p-4"><StatusBadge status={a.category} /></td>
                  <td className="p-4 text-muted-foreground">{a.desc}</td>
                  <td className="p-4 font-bold">{a.included}</td>
                  <td className="p-4 font-bold">${a.fee}</td>
                  <td className="p-4"><StatusBadge status={a.status} /></td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 2. FLOOR PLANS VIEW (WITH CRUD)
const FloorPlansPage: React.FC = () => {
  const [plans, setPlans] = React.useState([
    { id: '1', name: 'Studio Deluxe', beds: 1, baths: 1, sqft: 520, rent: 1200, deposit: 1200, desc: 'Compact open layout studio apartment' },
    { id: '2', name: '2B/2B Executive Suite', beds: 2, baths: 2, sqft: 980, rent: 1850, deposit: 1850, desc: 'Double bedroom apartment with balconies' }
  ]);

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ name: '', beds: '', baths: '', sqft: '', rent: '', deposit: '', desc: '' });

  const handleEdit = (plan: typeof plans[0]) => {
    setEditingId(plan.id);
    setForm({
      name: plan.name,
      beds: String(plan.beds),
      baths: String(plan.baths),
      sqft: String(plan.sqft),
      rent: String(plan.rent),
      deposit: String(plan.deposit),
      desc: plan.desc
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;

    if (editingId) {
      // Update
      setPlans(prev => prev.map(p => p.id === editingId ? {
        ...p,
        name: form.name,
        beds: Number(form.beds) || 1,
        baths: Number(form.baths) || 1,
        sqft: Number(form.sqft) || 500,
        rent: Number(form.rent) || 1000,
        deposit: Number(form.deposit) || 1000,
        desc: form.desc
      } : p));
      setEditingId(null);
    } else {
      // Create
      setPlans(prev => [
        ...prev,
        {
          id: String(Date.now()),
          name: form.name,
          beds: Number(form.beds) || 1,
          baths: Number(form.baths) || 1,
          sqft: Number(form.sqft) || 500,
          rent: Number(form.rent) || 1000,
          deposit: Number(form.deposit) || 1000,
          desc: form.desc
        }
      ]);
    }

    setForm({ name: '', beds: '', baths: '', sqft: '', rent: '', deposit: '', desc: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Floor Plans"
        description="Manage layouts, size measurements, and rent structures of floor plans."
        breadcrumbs={[{ label: 'Properties', href: '/properties' }, { label: 'Floor Plans' }]}
        action={{
          label: editingId ? 'Edit Layout' : 'Create Floor Plan',
          onClick: () => {
            if (showForm) {
              setEditingId(null);
              setForm({ name: '', beds: '', baths: '', sqft: '', rent: '', deposit: '', desc: '' });
            }
            setShowForm(!showForm);
          },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">
            {editingId ? 'Modify Floor Plan' : 'Create Custom Floor Plan'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Floor Plan Name</label>
              <input 
                required 
                value={form.name} 
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. 1B/1B Deluxe Loft" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Bedrooms Count</label>
              <input 
                type="number" 
                value={form.beds} 
                onChange={e => setForm(prev => ({ ...prev, beds: e.target.value }))}
                placeholder="e.g. 1" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Bathrooms Count</label>
              <input 
                type="number" 
                value={form.baths} 
                onChange={e => setForm(prev => ({ ...prev, baths: e.target.value }))}
                placeholder="e.g. 1" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Size (Sq Ft)</label>
              <input 
                type="number" 
                value={form.sqft} 
                onChange={e => setForm(prev => ({ ...prev, sqft: e.target.value }))}
                placeholder="e.g. 750" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Market Price Rent ($)</label>
              <input 
                type="number" 
                value={form.rent} 
                onChange={e => setForm(prev => ({ ...prev, rent: e.target.value }))}
                placeholder="e.g. 1200" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Required Deposit ($)</label>
              <input 
                type="number" 
                value={form.deposit} 
                onChange={e => setForm(prev => ({ ...prev, deposit: e.target.value }))}
                placeholder="e.g. 1200" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Description</label>
              <textarea 
                value={form.desc} 
                onChange={e => setForm(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="Describe floor plan features..." 
                rows={2}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Layout' : 'Publish Layout'}</Button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Floor Plan Name</th>
                <th className="p-4">Layout details</th>
                <th className="p-4">Size (Sq Ft)</th>
                <th className="p-4">Market Rent</th>
                <th className="p-4">Deposit</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{p.name}</td>
                  <td className="p-4">{p.beds} Bed, {p.baths} Bath</td>
                  <td className="p-4 font-bold">{p.sqft} sq ft</td>
                  <td className="p-4 font-bold">${p.rent.toLocaleString()}</td>
                  <td className="p-4">${p.deposit.toLocaleString()}</td>
                  <td className="p-4 text-muted-foreground">{p.desc}</td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. LEASING SCREENING VIEW (WITH CRUD)
const ScreeningPage: React.FC = () => {
  const [applicants, setApplicants] = React.useState([
    { id: '1', applicant: 'Michael Jordan', creditScore: 780, background: 'Clean', income: 'Verified ($6k/mo)', eviction: 'No Record', status: 'Employed', decision: 'Approved', date: '2026-07-15' },
    { id: '2', applicant: 'Brittany Spears', creditScore: 590, background: 'Clean', income: 'Unverified', eviction: 'No Record', status: 'Self-Employed', decision: 'Rejected', date: '2026-07-12' }
  ]);

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ applicant: '', creditScore: '', background: 'Clean', income: '', eviction: 'No Record', status: 'Employed', decision: 'Approved' });

  const handleEdit = (app: typeof applicants[0]) => {
    setEditingId(app.id);
    setForm({
      applicant: app.applicant,
      creditScore: String(app.creditScore),
      background: app.background,
      income: app.income,
      eviction: app.eviction,
      status: app.status,
      decision: app.decision
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setApplicants(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicant) return;

    if (editingId) {
      setApplicants(prev => prev.map(a => a.id === editingId ? {
        ...a,
        applicant: form.applicant,
        creditScore: Number(form.creditScore) || 600,
        background: form.background,
        income: form.income || 'Verified',
        eviction: form.eviction,
        status: form.status,
        decision: form.decision
      } : a));
      setEditingId(null);
    } else {
      setApplicants(prev => [
        ...prev,
        {
          id: String(Date.now()),
          applicant: form.applicant,
          creditScore: Number(form.creditScore) || 600,
          background: form.background,
          income: form.income || 'Verified',
          eviction: form.eviction,
          status: form.status,
          decision: form.decision,
          date: new Date().toISOString().split('T')[0]
        }
      ]);
    }

    setForm({ applicant: '', creditScore: '', background: 'Clean', income: '', eviction: 'No Record', status: 'Employed', decision: 'Approved' });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Screening Directory"
        description="Verify credit score, rental history background checks, and employment details of lease applicants."
        breadcrumbs={[{ label: 'Leasing', href: '/leasing' }, { label: 'Screening' }]}
        action={{
          label: editingId ? 'Edit Screening' : 'New Screening Check',
          onClick: () => {
            if (showForm) {
              setEditingId(null);
              setForm({ applicant: '', creditScore: '', background: 'Clean', income: '', eviction: 'No Record', status: 'Employed', decision: 'Approved' });
            }
            setShowForm(!showForm);
          },
          icon: <Plus className="w-4 h-4" />
        }}
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 shadow-sm space-y-4 max-w-xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">
            {editingId ? 'Modify Screening Check Details' : 'Create New Tenant Screening Check'}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Applicant Name</label>
              <input 
                required 
                value={form.applicant} 
                onChange={e => setForm(prev => ({ ...prev, applicant: e.target.value }))}
                placeholder="e.g. John Doe" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Credit Score</label>
              <input 
                type="number" 
                required 
                value={form.creditScore} 
                onChange={e => setForm(prev => ({ ...prev, creditScore: e.target.value }))}
                placeholder="e.g. 720" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Employment Status</label>
              <input 
                value={form.status} 
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                placeholder="e.g. Employed" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Background Check</label>
              <select 
                value={form.background} 
                onChange={e => setForm(prev => ({ ...prev, background: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>Clean</option>
                <option>Alert Raised</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Income status (e.g. Verified ($5k/mo))</label>
              <input 
                value={form.income} 
                onChange={e => setForm(prev => ({ ...prev, income: e.target.value }))}
                placeholder="e.g. Verified ($4k/mo)" 
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Eviction Records</label>
              <select 
                value={form.eviction} 
                onChange={e => setForm(prev => ({ ...prev, eviction: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>No Record</option>
                <option>Record Found</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Decision Status</label>
              <select 
                value={form.decision} 
                onChange={e => setForm(prev => ({ ...prev, decision: e.target.value }))}
                className="w-full p-2.5 rounded border bg-secondary text-xs font-semibold focus:outline-none"
              >
                <option>Approved</option>
                <option>Rejected</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <div className="border-t pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update Screening' : 'Add Screening'}</Button>
          </div>
        </form>
      )}

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">Credit Score</th>
                <th className="p-4">Background check</th>
                <th className="p-4">Income Status</th>
                <th className="p-4">Eviction records</th>
                <th className="p-4">Employment</th>
                <th className="p-4">Decision</th>
                <th className="p-4">Completed Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {applicants.map((a) => (
                <tr key={a.id} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{a.applicant}</td>
                  <td className="p-4 font-bold font-mono">{a.creditScore}</td>
                  <td className="p-4"><StatusBadge status={a.background} /></td>
                  <td className="p-4 font-bold">{a.income}</td>
                  <td className="p-4 font-semibold">{a.eviction}</td>
                  <td className="p-4">{a.status}</td>
                  <td className="p-4">
                    <StatusBadge status={a.decision} />
                  </td>
                  <td className="p-4 text-muted-foreground font-mono">{a.date}</td>
                  <td className="p-4 text-right space-x-1 whitespace-nowrap">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. ACCOUNTING TRUST ACCOUNTS
const TrustAccountsPage: React.FC = () => {
  const accounts = [
    { name: 'Tenant Security Deposit Trust', bank: 'Chase Bank', num: '••••4882', balance: 48500, status: 'Active' },
    { name: 'Owner Operations Distribution Escrow', bank: 'Wells Fargo', num: '••••9920', balance: 120500, status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trust Accounts Ledger"
        description="Fiduciary management of security deposits and owner operations reserves escrow accounts."
        breadcrumbs={[{ label: 'Accounting', href: '/accounting' }, { label: 'Trust Accounts' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Account Name</th>
                <th className="p-4">Bank Name</th>
                <th className="p-4">Account Number</th>
                <th className="p-4">Current Escrow Balance</th>
                <th className="p-4">Fiduciary Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {accounts.map((a, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{a.name}</td>
                  <td className="p-4 font-bold text-primary">{a.bank}</td>
                  <td className="p-4 font-mono text-muted-foreground">{a.num}</td>
                  <td className="p-4 font-extrabold text-emerald-500">${a.balance.toLocaleString()}</td>
                  <td className="p-4"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 6. LATE FEES CONFIG
const LateFeesPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Late Fee Configuration"
        description="Configure late payment fees rules, structures, and grace period settings."
        breadcrumbs={[{ label: 'Rent Collection', href: '/rent' }, { label: 'Late Fees' }]}
      />
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide border-b pb-2">Default Late Fee Policy Settings</h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Late Fee Type</label>
            <select className="w-full p-2.5 rounded border bg-secondary font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Flat Fee ($)</option>
              <option>Percentage of Rent (%)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Amount / Rate</label>
            <input defaultValue="50" className="w-full p-2 rounded border bg-secondary font-semibold text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Grace Period (Days)</label>
            <input defaultValue="5" type="number" className="w-full p-2 rounded border bg-secondary font-semibold text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Recurrence</label>
            <select className="w-full p-2.5 rounded border bg-secondary font-semibold text-xs focus:outline-none focus:ring-1 focus:ring-primary">
              <option>One-Time Fee</option>
              <option>Daily Cumulative</option>
            </select>
          </div>
        </div>
        <div className="border-t pt-4 flex justify-end">
          <Button className="font-bold bg-primary text-white hover:bg-primary/95">Save Late Fee Policy</Button>
        </div>
      </div>
    </div>
  );
};

// 7. TENANT DOCUMENTS VIEW
const ManagerTenantDocumentsPage: React.FC = () => {
  const documents = [
    { name: 'Signed Rent Lease Agreement.pdf', category: 'Lease', size: '1.4 MB', tenant: 'Robert Johnson', date: '2026-07-20' },
    { name: 'Income Verification Statement.pdf', category: 'Agreement', size: '850 KB', tenant: 'Michael Jordan', date: '2026-07-15' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Documents categories"
        description="Access leases, notices, and income agreements uploaded by tenant residents."
        breadcrumbs={[{ label: 'Tenants', href: '/tenants' }, { label: 'Documents' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Document File Name</th>
                <th className="p-4">Type Category</th>
                <th className="p-4">File Size</th>
                <th className="p-4">Tenant Resident</th>
                <th className="p-4">Uploaded Date</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {documents.map((d, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary cursor-pointer hover:underline">{d.name}</td>
                  <td className="p-4"><StatusBadge status={d.category} /></td>
                  <td className="p-4 font-bold">{d.size}</td>
                  <td className="p-4 font-bold">{d.tenant}</td>
                  <td className="p-4 text-muted-foreground font-mono">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8. OWNERS STATEMENTS PAGE
const OwnersStatementsPage: React.FC = () => {
  const statements = [
    { date: '2026-06-30', property: 'Sunset Villas Complex', income: 14500, expenses: 3200, net: 11300, status: 'Sent' },
    { date: '2026-05-31', property: 'Sunset Villas Complex', income: 14500, expenses: 4500, net: 10000, status: 'Sent' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owner Financial Statements"
        description="Fiduciary records of property income statements, expense logs, and net cash balances."
        breadcrumbs={[{ label: 'Owners', href: '/owners' }, { label: 'Statements' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Statement Period Date</th>
                <th className="p-4">Property</th>
                <th className="p-4">Gross Income</th>
                <th className="p-4">Operating Expenses</th>
                <th className="p-4">Net Cash Income</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {statements.map((s, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-mono font-bold">{s.date}</td>
                  <td className="p-4 font-bold text-primary">{s.property}</td>
                  <td className="p-4 text-emerald-500 font-bold">${s.income.toLocaleString()}</td>
                  <td className="p-4 text-rose-500 font-bold">-${s.expenses.toLocaleString()}</td>
                  <td className="p-4 font-extrabold text-blue-500">${s.net.toLocaleString()}</td>
                  <td className="p-4"><StatusBadge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8a. RENT ROLL REPORT
const RentRollReportPage: React.FC = () => {
  const data = [
    { unit: 'Apt 101', tenant: 'Robert Johnson', rent: 1200, start: '2025-08-01', end: '2026-07-31', balance: 0 },
    { unit: 'Apt 102', tenant: 'Michael Jordan', rent: 1850, start: '2026-02-15', end: '2027-02-14', balance: 1850 },
    { unit: 'Apt 201', tenant: 'Sarah Connor', rent: 1500, start: '2026-01-01', end: '2026-12-31', balance: 0 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rent Roll Report Ledger"
        description="Comprehensive list of properties, tenant names, lease schedules, and monthly rent balances."
        breadcrumbs={[{ label: 'Reports', href: '/reports' }, { label: 'Rent Roll' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Unit Name</th>
                <th className="p-4">Tenant Resident</th>
                <th className="p-4">Monthly Rent</th>
                <th className="p-4">Lease Start</th>
                <th className="p-4">Lease End</th>
                <th className="p-4">Current Balance Due</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {data.map((r, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{r.unit}</td>
                  <td className="p-4 font-bold">{r.tenant}</td>
                  <td className="p-4 font-bold">${r.rent.toLocaleString()}</td>
                  <td className="p-4 font-mono text-muted-foreground">{r.start}</td>
                  <td className="p-4 font-mono text-muted-foreground">{r.end}</td>
                  <td className="p-4 font-extrabold text-rose-500">${r.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8b. OCCUPANCY REPORT
const OccupancyReportPage: React.FC = () => {
  const data = [
    { property: 'Sunset Villas Complex', total: 40, occupied: 38, vacant: 2, rate: '95%' },
    { property: 'Summit Group Commercial Loft', total: 10, occupied: 7, vacant: 3, rate: '70%' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Occupancy & Vacancy Report"
        description="Monitor rental occupancy rates, vacancy statistics, and unit counts by building."
        breadcrumbs={[{ label: 'Reports', href: '/reports' }, { label: 'Occupancy' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Property / Building Name</th>
                <th className="p-4">Total Units</th>
                <th className="p-4">Occupied Units</th>
                <th className="p-4">Vacant Units</th>
                <th className="p-4">Occupancy Rate (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {data.map((r, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold text-primary">{r.property}</td>
                  <td className="p-4 font-bold">{r.total}</td>
                  <td className="p-4 text-emerald-500 font-bold">{r.occupied}</td>
                  <td className="p-4 text-rose-500 font-bold">{r.vacant}</td>
                  <td className="p-4 font-extrabold text-blue-500">{r.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8c. DELINQUENCY REPORT
const DelinquencyReportPage: React.FC = () => {
  const data = [
    { tenant: 'Michael Jordan', unit: 'Apt 102', overdue: 1850, days: 5, status: 'Overdue' },
    { tenant: 'Brittany Spears', unit: 'Apt 204', overdue: 950, days: 12, status: 'Delinquent' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delinquent Payments Ledger"
        description="Verify late property rent payments, accrued late fee balances, and days delinquent."
        breadcrumbs={[{ label: 'Reports', href: '/reports' }, { label: 'Delinquency' }]}
      />
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-muted/50 border-b text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Tenant Name</th>
                <th className="p-4">Unit Name</th>
                <th className="p-4">Outstanding Overdue Balance</th>
                <th className="p-4">Days Overdue</th>
                <th className="p-4">Payment Fiduciary Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-foreground">
              {data.map((r, i) => (
                <tr key={i} className="hover:bg-accent/40 transition">
                  <td className="p-4 font-bold">{r.tenant}</td>
                  <td className="p-4 font-bold text-primary">{r.unit}</td>
                  <td className="p-4 font-extrabold text-rose-500">${r.overdue.toLocaleString()}</td>
                  <td className="p-4 font-bold text-rose-600">{r.days} Days</td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- ROUTE INSTANTIATIONS FOR NEW VIEWS ---
const companiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies',
  component: () => (<ProtectedWrapper><CompaniesPage /></ProtectedWrapper>),
});
const newCompanyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies/new',
  component: () => (<ProtectedWrapper><NewCompanyPage /></ProtectedWrapper>),
});
const companyDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies/details',
  component: () => (<ProtectedWrapper><CompanyDetailsPage /></ProtectedWrapper>),
});
const companyUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies/users',
  component: () => (<ProtectedWrapper><CompanyUsersPage /></ProtectedWrapper>),
});
const companySubscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies/subscription',
  component: () => (<ProtectedWrapper><CompanySubscriptionPage /></ProtectedWrapper>),
});
const companyUsageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/companies/usage',
  component: () => (<ProtectedWrapper><CompanyUsagePage /></ProtectedWrapper>),
});
const subscriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions',
  component: () => (<ProtectedWrapper><SubscriptionPlansPage /></ProtectedWrapper>),
});
const subscriptionsPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions/plans',
  component: () => (<ProtectedWrapper><SubscriptionPlansPage /></ProtectedWrapper>),
});
const subscriptionsActiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions/active',
  component: () => (<ProtectedWrapper><ActiveSubscriptionsPage /></ProtectedWrapper>),
});
const subscriptionsInvoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions/invoices',
  component: () => (<ProtectedWrapper><SubscriptionInvoicesPage /></ProtectedWrapper>),
});
const subscriptionsPaymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions/payments',
  component: () => (<ProtectedWrapper><SubscriptionPaymentsPage /></ProtectedWrapper>),
});
const subscriptionsCouponsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscriptions/coupons',
  component: () => (<ProtectedWrapper><SubscriptionCouponsPage /></ProtectedWrapper>),
});
const platformUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-users',
  component: () => (<ProtectedWrapper><PlatformUsersPage /></ProtectedWrapper>),
});
const supportTicketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support/tickets',
  component: () => (<ProtectedWrapper><SupportTicketsPage /></ProtectedWrapper>),
});
const supportFeedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support/feedback',
  component: () => (<ProtectedWrapper><SupportFeedbackPage /></ProtectedWrapper>),
});
const supportContactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/support/contact-requests',
  component: () => (<ProtectedWrapper><SupportContactPage /></ProtectedWrapper>),
});
const platformSettingsGeneralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-settings/general',
  component: () => (<ProtectedWrapper><PlatformSettingsGeneralView /></ProtectedWrapper>),
});
const platformSettingsEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-settings/email',
  component: () => (<ProtectedWrapper><PlatformSettingsEmailView /></ProtectedWrapper>),
});
const platformSettingsStorageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-settings/storage',
  component: () => (<ProtectedWrapper><PlatformSettingsStorageView /></ProtectedWrapper>),
});
const platformSettingsBrandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-settings/branding',
  component: () => (<ProtectedWrapper><PlatformSettingsBrandingView /></ProtectedWrapper>),
});
const platformIntegrationsConnectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-integrations/connected',
  component: () => (<ProtectedWrapper><PlatformIntegrationsConnectedView /></ProtectedWrapper>),
});
const platformIntegrationsKeysRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-integrations/keys',
  component: () => (<ProtectedWrapper><PlatformIntegrationsKeysView /></ProtectedWrapper>),
});
const platformIntegrationsWebhooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-integrations/webhooks',
  component: () => (<ProtectedWrapper><PlatformIntegrationsWebhooksView /></ProtectedWrapper>),
});
const platformSecurityAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-security/audit',
  component: () => (<ProtectedWrapper><PlatformSecurityAuditView /></ProtectedWrapper>),
});
const platformSecurityLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-security/login-history',
  component: () => (<ProtectedWrapper><PlatformSecurityLoginView /></ProtectedWrapper>),
});
const platformSecurityPoliciesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-security/policies',
  component: () => (<ProtectedWrapper><PlatformSecurityPoliciesView /></ProtectedWrapper>),
});
const platformAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/platform-analytics',
  component: () => (<ProtectedWrapper><SuperAdminDashboardPage /></ProtectedWrapper>),
});
const amenitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/amenities',
  component: () => (<ProtectedWrapper><AmenitiesPage /></ProtectedWrapper>),
});
const floorPlansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties/floor-plans',
  component: () => (<ProtectedWrapper><FloorPlansPage /></ProtectedWrapper>),
});
const screeningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/screening',
  component: () => (<ProtectedWrapper><ScreeningPage /></ProtectedWrapper>),
});
const moveInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/move-in',
  component: () => (<ProtectedWrapper><MoveInOutPage type="Move In" /></ProtectedWrapper>),
});
const moveOutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leasing/move-out',
  component: () => (<ProtectedWrapper><MoveInOutPage type="Move Out" /></ProtectedWrapper>),
});
const managerTenantDocumentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tenants/documents',
  component: () => (<ProtectedWrapper><ManagerTenantDocumentsPage /></ProtectedWrapper>),
});
const ownersStatementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owners/statements',
  component: () => (<ProtectedWrapper><OwnersStatementsPage /></ProtectedWrapper>),
});
const lateFeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rent/late-fees',
  component: () => (<ProtectedWrapper><LateFeesPage /></ProtectedWrapper>),
});
const trustAccountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting/trust-accounts',
  component: () => (<ProtectedWrapper><TrustAccountsPage /></ProtectedWrapper>),
});
const rentRollReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/rent-roll',
  component: () => (<ProtectedWrapper><RentRollReportPage /></ProtectedWrapper>),
});
const occupancyReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/occupancy',
  component: () => (<ProtectedWrapper><OccupancyReportPage /></ProtectedWrapper>),
});
const delinquencyReportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports/delinquency',
  component: () => (<ProtectedWrapper><DelinquencyReportPage /></ProtectedWrapper>),
});

// --- REGISTER TREE ---
const routeTree = rootRoute.addChildren([
  indexRoute,
  landingRoute,
  loginRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  
  // Super Admin Routes
  companiesRoute,
  newCompanyRoute,
  companyDetailsRoute,
  companyUsersRoute,
  companySubscriptionRoute,
  companyUsageRoute,
  subscriptionsRoute,
  subscriptionsPlansRoute,
  subscriptionsActiveRoute,
  subscriptionsInvoicesRoute,
  subscriptionsPaymentsRoute,
  subscriptionsCouponsRoute,
  platformUsersRoute,
  supportTicketsRoute,
  supportFeedbackRoute,
  supportContactRoute,
  platformSettingsGeneralRoute,
  platformSettingsEmailRoute,
  platformSettingsStorageRoute,
  platformSettingsBrandingRoute,
  platformIntegrationsConnectedRoute,
  platformIntegrationsKeysRoute,
  platformIntegrationsWebhooksRoute,
  platformSecurityAuditRoute,
  platformSecurityLoginRoute,
  platformSecurityPoliciesRoute,
  platformAnalyticsRoute,

  // Properties Manager Additions
  amenitiesRoute,
  floorPlansRoute,
  screeningRoute,
  moveInRoute,
  moveOutRoute,
  managerTenantDocumentsRoute,
  ownersStatementsRoute,
  lateFeesRoute,
  trustAccountsRoute,
  rentRollReportRoute,
  occupancyReportRoute,
  delinquencyReportRoute,

  // Properties
  propertiesRoute,
  newPropertyRoute,
  propertyDetailsRoute,
  buildingsRoute,
  unitsRoute,
  newUnitRoute,
  unitDetailsRoute,
  
  // Tenants
  tenantsRoute,
  activeTenantsRoute,
  formerTenantsRoute,
  portalPreviewRoute,
  newTenantRoute,
  editTenantRoute,
  tenantDetailsRoute,
  
  // Leasing
  leasesRoute,
  newLeaseRoute,
  leaseDetailsRoute,
  renewalsRoute,
  moveInOutRoute,
  applicationsRoute,
  newApplicationRoute,
  
  // CRM
  crmDashboardRoute,
  leadsRoute,
  newLeadRoute,
  leadDetailsRoute,

  // Rent Collection (Phase 4)
  rentDashboardRoute,
  paymentsRoute,
  newPaymentRoute,
  paymentDetailsRoute,
  rentLedgerRoute,
  invoicesRoute,
  newInvoiceRoute,
  chargesRoute,
  depositsRoute,
  paymentPlansRoute,
  newPaymentPlanRoute,
  refundsRoute,
  paymentMethodsRoute,
  
  // Other
  ownersRoute,
  accountingRoute,
  coaRoute,
  journalEntriesRoute,
  generalLedgerRoute,
  incomeRoute,
  expensesRoute,
  vendorBillsRoute,
  recurringTransactionsRoute,
  bankAccountsRoute,
  bankReconciliationRoute,
  budgetsRoute,
  ownerStatementsRoute,
  taxesRoute,
  financialReportsRoute,
  yearEndRoute,
  
  // Owner Portal (Phase 7)
  ownerDashboardRoute,
  ownerPropertiesRoute,
  ownerFinancialsRoute,
  ownerPortalStatementsRoute,
  ownerDistributionsRoute,
  ownerMaintenanceRoute,
  ownerDocumentsRoute,
  ownerMessagesRoute,
  ownerReportsRoute,
  ownerProfileRoute,
  ownerSupportRoute,

  // Tenant Portal (Phase 8)
  tenantDashboardRoute,
  tenantHomeRoute,
  tenantLeaseRoute,
  tenantPaymentsRoute,
  tenantMaintenanceRoute,
  tenantDocumentsRoute,
  tenantMessagesRoute,
  tenantAnnouncementsRoute,
  tenantVisitorsRoute,
  tenantPackagesRoute,
  tenantInsuranceRoute,
  tenantProfileRoute,
  tenantSettingsRoute,
  tenantSupportRoute,
  tenantNotificationsRoute,
  tenantPaymentsHistoryRoute,
  staffMaintenanceRoute,
  staffDashboardRoute,
  staffTasksRoute,
  staffCompletedTasksRoute,
  staffProfileRoute,
  staffTaskDetailsRoute,
  maintenanceRoute,
  requestsRoute,
  newRequestRoute,
  requestDetailsRoute,
  workOrdersRoute,
  workOrderDetailsRoute,
  violationsRoute,
  preventiveRoute,
  assetsRoute,
  inventoryRoute,
  vendorsRoute,
  vendorInvoicesRoute,
  inspectionsRoute,
  newInspectionRoute,
  maintenanceCalendarRoute,
  maintenanceReportsRoute,
  documentsRoute,
  docsAllRoute,
  docsFoldersRoute,
  docsUploadRoute,
  docsSignaturesRoute,
  docsSharedRoute,
  docsTemplatesRoute,
  docsVersionsRoute,
  docsRequestsRoute,
  docsPermissionsRoute,
  docsAuditRoute,
  docsArchiveRoute,
  docsSettingsRoute,
  reportsRoute,
  reportsExecutiveRoute,
  reportsDashboardsRoute,
  reportsPropertiesRoute,
  reportsFinancialRoute,
  reportsTenantsRoute,
  reportsLeasingRoute,
  reportsMaintenanceRoute,
  reportsOwnersRoute,
  reportsExplorerRoute,
  reportsCustomRoute,
  reportsSavedRoute,
  reportsScheduledRoute,
  reportsForecastRoute,
  reportsExportsRoute,
  reportsSettingsRoute,
  commDashboardRoute,
  commInboxRoute,
  commConversationsRoute,
  commEmailRoute,
  commSMSRoute,
  commAnnouncementsRoute,
  commCampaignsRoute,
  commTemplatesRoute,
  commContactsRoute,
  commNotificationsRoute,
  commScheduledRoute,
  commActivityRoute,
  commSettingsRoute,
  aiAssistantRoute,
  aiSettingsRoute,
  adminDashboardRoute,
  adminCompanySettingsRoute,
  adminUsersRoute,
  adminTeamsRoute,
  adminRolesRoute,
  adminTemplatesRoute,
  adminPropertiesSettingsRoute,
  adminFinancialRoute,
  adminPaymentSettingsRoute,
  adminNotificationsRoute,
  adminIntegrationsRoute,
  adminApiRoute,
  adminWebhooksRoute,
  adminSecurityRoute,
  adminAuditRoute,
  adminActivityRoute,
  adminBillingRoute,
  adminPreferencesRoute,
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
