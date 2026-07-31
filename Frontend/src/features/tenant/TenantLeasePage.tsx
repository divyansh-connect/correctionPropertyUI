import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { 
  BookOpen, 
  Award, 
  Download, 
  Key, 
  Home, 
  User, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Mail, 
  Phone, 
  Building,
  Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TenantLeasePage: React.FC = () => {
  // Queries
  const { data: lease = null, isLoading } = useQuery({ 
    queryKey: ['tenant-lease-details'], 
    queryFn: () => api.tenantLeases.get() 
  });
  const { t } = useTranslation();

  if (isLoading || !lease) {
    return <LoadingSkeleton type="card" />;
  }

  const property = lease.property || {};
  const unit = lease.unit || {};
  const tenant = lease.tenant || {};
  const owner = property.owner || {};

  return (
    <div className="space-y-6 text-foreground max-w-5xl">
      <PageHeader
        title={t('tenantLease.title')}
        description={t('tenantLease.desc')}
        breadcrumbs={[
          { label: t('ai.breadcrumbs.home'), href: '/tenant' },
          { label: t('tenant.nav.lease') },
        ]}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Lease Overview, Property & Unit details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Lease Status & Financials Overview */}
          <Card className="p-6 border bg-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-7 h-7 text-primary shrink-0" />
                <div>
                  <h3 className="font-extrabold text-sm uppercase">{t('tenantLease.termDetails')}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 font-bold">
                    {t('tenantLease.start')}: {lease.leaseStart} • {t('tenantLease.end')}: {lease.leaseEnd}
                  </p>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                  lease.status === 'Active' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                    : lease.status === 'Pending_Move_In'
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-500'
                    : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                }`}>
                  {lease.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
              <div className="space-y-1 bg-secondary/20 p-3 rounded-xl border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase">{t('tenantLease.monthlyRent')}</span>
                <p className="font-extrabold text-lg text-primary">${(Number(lease.rentAmount) || 0).toLocaleString()}</p>
              </div>
              <div className="space-y-1 bg-secondary/20 p-3 rounded-xl border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase">{t('tenantLease.securityDeposit')}</span>
                <p className="font-extrabold text-lg">${(Number(lease.securityDeposit) || 0).toLocaleString()}</p>
              </div>
              <div className="space-y-1 bg-secondary/20 p-3 rounded-xl border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase">Lease Duration</span>
                <p className="font-extrabold text-sm text-foreground/80 mt-1">12 Months</p>
              </div>
              <div className="space-y-1 bg-secondary/20 p-3 rounded-xl border border-border/40">
                <span className="text-[10px] text-muted-foreground uppercase">Next Due Date</span>
                <p className="font-extrabold text-sm text-foreground/80 mt-1">
                  {lease.status === 'Active' ? 'Aug 1, 2026' : 'On Move-In'}
                </p>
              </div>
            </div>
          </Card>

          {/* Property & Unit Details Card */}
          <Card className="p-6 border bg-card space-y-6">
            <div className="flex items-center space-x-3 border-b pb-4">
              <Home className="w-7 h-7 text-primary shrink-0" />
              <div>
                <h3 className="font-extrabold text-sm uppercase">Property & Unit Information</h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-bold">
                  {property.name || lease.propertyName} — {lease.unitNumber || `Unit ${unit.unitNumber || ''}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unit specifications */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase text-muted-foreground">Unit Specs</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center space-x-2 bg-secondary/10 p-2 rounded-lg">
                    <Bed className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>{unit.bedrooms || '—'}</strong> Bedrooms</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-secondary/10 p-2 rounded-lg">
                    <Bath className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>{unit.bathrooms || '—'}</strong> Bathrooms</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-secondary/10 p-2 rounded-lg">
                    <Maximize className="w-4 h-4 text-primary shrink-0" />
                    <span><strong>{unit.squareFootage || '—'}</strong> Sq Ft</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-secondary/10 p-2 rounded-lg">
                    <Building className="w-4 h-4 text-primary shrink-0" />
                    <span>Floor: <strong>{unit.floor !== undefined ? unit.floor : '—'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase text-muted-foreground">Property Location & Details</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{property.streetAddress || property.address || '—'}</strong>
                      <br />
                      {property.city ? `${property.city}, ${property.state || ''} ${property.zip || ''}` : ''}
                      {property.country ? `, ${property.country}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Type: <strong className="text-foreground">{property.type || '—'}</strong></span>
                  </div>
                  {property.yearBuilt && (
                    <div className="flex items-center space-x-2">
                      <Info className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">Year Built: <strong className="text-foreground">{property.yearBuilt}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Included Utilities */}
          <Card className="p-6 border bg-card space-y-4">
            <h4 className="font-extrabold text-sm uppercase border-b pb-2">{t('tenantLease.includedUtilities')}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
              <span className="bg-secondary/40 border p-3 rounded-xl text-center text-foreground/80">{t('tenantLease.utilities.trash')}</span>
              <span className="bg-secondary/40 border p-3 rounded-xl text-center text-foreground/80">{t('tenantLease.utilities.sewage')}</span>
              <span className="bg-secondary/40 border p-3 rounded-xl text-center text-foreground/80">{t('tenantLease.utilities.pest')}</span>
              <span className="bg-secondary/40 border p-3 rounded-xl text-center text-foreground/80">Water & Gas</span>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Landlord / Management, Actions, Tenant details */}
        <div className="space-y-6">
          
          {/* Landlord / Management Card */}
          <Card className="p-6 border bg-card space-y-4">
            <div className="flex items-center space-x-2 border-b pb-2">
              <User className="w-4.5 h-4.5 text-primary shrink-0" />
              <h4 className="font-extrabold uppercase">Landlord & Management</h4>
            </div>

            <div className="space-y-4 text-xs">
              {owner.name && (
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase">Property Owner</span>
                  <p className="font-bold text-foreground text-sm">{owner.name}</p>
                  {owner.email && (
                    <div className="flex items-center space-x-1.5 text-muted-foreground mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{owner.email}</span>
                    </div>
                  )}
                  {owner.phone && (
                    <div className="flex items-center space-x-1.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {property.managementCompany && (
                <div className="space-y-1 pt-2 border-t">
                  <span className="text-[10px] text-muted-foreground uppercase">Management Company</span>
                  <p className="font-bold text-foreground text-sm">{property.managementCompany}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Tenant Profile (Self) Details */}
          <Card className="p-6 border bg-card space-y-4">
            <div className="flex items-center space-x-2 border-b pb-2">
              <User className="w-4.5 h-4.5 text-primary shrink-0" />
              <h4 className="font-extrabold uppercase">Tenant Profile</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-muted-foreground uppercase">Full Name</span>
                <p className="font-bold text-foreground">{lease.tenantName || `${tenant.firstName || ''} ${tenant.lastName || ''}`}</p>
              </div>
              {tenant.email && (
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{tenant.email}</span>
                </div>
              )}
              {tenant.phone && (
                <div className="flex items-center space-x-1.5 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{tenant.phone}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Lease Actions & Document downloads */}
          <Card className="p-6 border bg-card space-y-4">
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
    </div>
  );
};
export default TenantLeasePage;
