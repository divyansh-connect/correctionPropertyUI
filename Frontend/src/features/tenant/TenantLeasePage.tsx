import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { BookOpen, Award, Download, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TenantLeasePage: React.FC = () => {
  // Queries
  const { data: lease = null, isLoading } = useQuery({ queryKey: ['tenant-lease-details'], queryFn: () => api.tenantLeases.get() });
  const { t } = useTranslation();

  if (isLoading || !lease) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-4xl">
      <PageHeader
        title={t('tenantLease.title')}
        description={t('tenantLease.desc')}
        breadcrumbs={[
          { label: t('ai.breadcrumbs.home'), href: '/tenant' },
          { label: t('tenant.nav.lease') },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lease Terms Summary */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <div className="flex items-center space-x-3 border-b pb-4">
            <BookOpen className="w-7 h-7 text-primary shrink-0" />
            <div>
              <h3 className="font-extrabold text-sm uppercase">{t('tenantLease.termDetails')}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-bold">{t('tenantLease.start')}: {lease.leaseStart} • {t('tenantLease.end')}: {lease.leaseEnd}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase">{t('tenantLease.monthlyRent')}</span>
              <p className="font-bold text-sm text-primary">${(Number(lease.rentAmount) || 0).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase">{t('tenantLease.securityDeposit')}</span>
              <p className="font-bold text-sm">${(Number(lease.securityDeposit) || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4 text-xs font-semibold text-muted-foreground">
            <p className="font-bold text-foreground">{t('tenantLease.includedUtilities')}</p>
            <div className="grid grid-cols-3 gap-2">
              <span className="bg-secondary/40 border p-2 rounded-xl text-center">{t('tenantLease.utilities.trash')}</span>
              <span className="bg-secondary/40 border p-2 rounded-xl text-center">{t('tenantLease.utilities.sewage')}</span>
              <span className="bg-secondary/40 border p-2 rounded-xl text-center">{t('tenantLease.utilities.pest')}</span>
            </div>
          </div>
        </Card>

        {/* Lease Actions & Document downloads */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2">
            <Award className="w-4.5 h-4.5 text-primary shrink-0" />
            <h4 className="font-extrabold uppercase">{t('tenantLease.actionsTitle')}</h4>
          </div>

          <div className="space-y-3">
            <Button size="sm" className="w-full text-xs font-bold uppercase flex items-center justify-center gap-1.5" onClick={() => alert('Downloading Lease PDF...')}>
              <Download className="w-4 h-4" /> {t('tenantLease.download')}
            </Button>
            <Button size="sm" variant="outline" className="w-full text-xs font-bold uppercase flex items-center justify-center gap-1.5" onClick={() => alert('Contacting leasing office...')}>
              <Key className="w-4 h-4" /> {t('tenantLease.requestRenewal')}
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default TenantLeasePage;
