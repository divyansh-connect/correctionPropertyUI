import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { CreditCard, Wrench, MessageSquare, BookOpen, Package, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TenantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Queries
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['tenant-dashboard-metrics'],
    queryFn: () => api.tenantPortal.getMetrics(),
  });

  if (isLoading || !metrics) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title={t('tenant.dashboard.title')}
        description={t('tenant.dashboard.desc')}
        breadcrumbs={[
          { label: t('ai.breadcrumbs.home'), href: '/tenant' },
          { label: t('tenant.nav.dashboard') },
        ]}
      />

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/tenant/payments' })} className="flex items-center gap-1">
          <CreditCard className="w-4 h-4" /> {t('tenant.dashboard.payRent')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/tenant/maintenance' })} className="flex items-center gap-1">
          <Wrench className="w-4 h-4" /> {t('tenant.dashboard.submitRepair')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/tenant/messages' })} className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" /> {t('tenant.dashboard.contactMgmt')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/tenant/lease' })} className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" /> {t('tenant.dashboard.viewLease')}
        </Button>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('tenant.dashboard.currentRentDue')}</p>
            <p className="text-2xl font-black mt-1 text-primary">${metrics.currentRent.toLocaleString()}</p>
          </div>
            <span className="text-[10px] text-muted-foreground font-semibold mt-4">{t('tenant.dashboard.dueDate')}: {metrics.nextDueDate}</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('tenant.dashboard.outstandingBalance')}</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">${metrics.outstandingBalance.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">{t('tenant.dashboard.accountStatus')}</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('tenant.dashboard.activeVisitorPasses')}</p>
            <p className="text-2xl font-black mt-1 text-indigo-500">{metrics.activeVisitors}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">{t('tenant.dashboard.registeredGuests')}</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('tenant.dashboard.waitingPackages')}</p>
            <p className="text-2xl font-black mt-1 text-amber-500">{metrics.packagesWaiting}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">{t('tenant.dashboard.awaitingPickup')}</span>
        </Card>
      </div>

      {/* ADDITIONAL LEASE NOTIFICATION CARD */}
      <Card className="p-5 border bg-card flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm uppercase">{t('tenant.dashboard.leaseRenewal')}</h4>
          <p className="text-xs text-muted-foreground font-semibold">{t('tenant.dashboard.leaseExpiringText', { date: metrics.leaseExpiration })}</p>
        </div>
        <Button size="sm" onClick={() => navigate({ to: '/tenant/lease' })} className="uppercase text-xs font-black">
          {t('tenant.dashboard.reviewRenewal')}
        </Button>
      </Card>
    </div>
  );
};
export default TenantDashboardPage;
