import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { User, ShieldAlert } from 'lucide-react';

export const TenantProfilePage: React.FC = () => {
  const { t } = useTranslation();

  // Queries
  const { data: profile = null, isLoading } = useQuery({ queryKey: ['tenant-profile-details'], queryFn: () => api.tenantProfile.get() });

  if (isLoading || !profile) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-3xl">
      <PageHeader
        title={t('tenant.profile.title')}
        description={t('tenant.profile.desc')}
        breadcrumbs={[
          { label: t('header.home'), href: '/tenant' },
          { label: t('tenant.profile.title') },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">{t('tenant.profile.contactDetails')}</h3>
          <form className="space-y-4 text-xs font-semibold" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('tenant.profile.firstName')}</label>
                <Input value={profile.firstName} disabled={true} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('tenant.profile.lastName')}</label>
                <Input value={profile.lastName} disabled={true} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('tenant.profile.phone')}</label>
                <Input value={profile.phone} disabled={true} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">{t('tenant.profile.email')}</label>
                <Input value={profile.email} disabled={true} />
              </div>
            </div>
          </form>
        </Card>

        {/* Vehicles & Pets */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-5 text-xs font-semibold">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">{t('tenant.profile.permits')}</h3>
          
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase">{t('tenant.profile.registeredVehicles')}</span>
            <p className="font-bold text-foreground">{profile.vehicles}</p>
          </div>

          <div className="space-y-2 border-t pt-3">
            <span className="text-[10px] text-muted-foreground uppercase">{t('tenant.profile.registeredPets')}</span>
            <p className="font-bold text-foreground">{profile.pets}</p>
          </div>

          <div className="space-y-2 border-t pt-3">
            <span className="text-[10px] text-muted-foreground uppercase">{t('tenant.profile.preferredLanguage')}</span>
            <p className="font-bold text-foreground">{profile.preferredLanguage}</p>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default TenantProfilePage;
