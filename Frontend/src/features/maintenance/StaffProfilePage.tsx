import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useStore';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { 
  User, Mail, Shield, CheckCircle2, Clock, 
  Star, MapPin, Phone, Calendar, Briefcase, Power, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StaffProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['staff-profile-data'],
    queryFn: () => api.staffProfile.get(),
  });

  const toggleDutyMutation = useMutation({
    mutationFn: (newStatus: boolean) => api.staffProfile.update({ isAvailable: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-profile-data'] });
    },
  });

  if (isLoading || !profile) {
    return <LoadingSkeleton type="card" />;
  }

  const isAvailable = profile.isAvailable ?? true;

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title={t('staffProfilePage.title')}
        description={t('staffProfilePage.desc')}
        breadcrumbs={[
          { label: t('staffProfilePage.portalBreadcrumb'), href: '/staff/dashboard' },
          { label: t('staffProfilePage.profileBreadcrumb') },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card - User Avatar & Primary Status */}
        <Card className="lg:col-span-1 p-6 border bg-card flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"}
              alt={profile.name || user?.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-lg"
            />
            <span className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-card flex items-center justify-center ${
              isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
            }`} />
          </div>

          <div>
            <h3 className="font-extrabold text-lg">{profile.name || user?.name || 'Marcus Vance'}</h3>
            <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center gap-1 mt-1">
              <Briefcase className="w-3.5 h-3.5" /> {profile.specialist || t('staffProfilePage.specialist')}
            </p>
          </div>

          {/* Availability Toggle */}
          <div className="w-full pt-4 border-t border-border/40 flex flex-col items-center space-y-2">
            <div className="flex items-center justify-between w-full px-2 text-xs font-bold">
              <span className="text-muted-foreground">{t('staffProfilePage.dutyStatus')}</span>
              <span className={isAvailable ? 'text-emerald-500' : 'text-rose-500'}>
                {isAvailable ? t('staffProfilePage.onDuty') : t('staffProfilePage.offDuty')}
              </span>
            </div>
            <Button
              size="sm"
              disabled={toggleDutyMutation.isPending}
              onClick={() => toggleDutyMutation.mutate(!isAvailable)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl h-10 font-bold transition-all ${
                isAvailable 
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20' 
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'
              }`}
            >
              {toggleDutyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
              {isAvailable ? t('staffProfilePage.clockOut') : t('staffProfilePage.clockIn')}
            </Button>
          </div>
        </Card>

        {/* Right Cards - Profile Details & Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Work Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 border bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('staffProfilePage.completedJobs')}</p>
                <p className="text-xl font-black mt-0.5">{profile.completedJobs || 142}</p>
              </div>
            </Card>

            <Card className="p-5 border bg-gradient-to-br from-blue-500/5 to-blue-500/10 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('staffProfilePage.avgResponseTime')}</p>
                <p className="text-xl font-black mt-0.5">{profile.avgResponseTime || '38 Min'}</p>
              </div>
            </Card>

            <Card className="p-5 border bg-gradient-to-br from-amber-500/5 to-amber-500/10 flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">{t('staffProfilePage.customerRating')}</p>
                <p className="text-xl font-black mt-0.5">{profile.customerRating || '4.92 / 5.0'}</p>
              </div>
            </Card>
          </div>

          {/* Account & Details Card */}
          <Card className="p-6 border bg-card space-y-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider border-b pb-3">{t('staffProfilePage.credentials')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <User className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{t('staffProfilePage.fullName')}</p>
                    <p className="text-foreground mt-0.5">{profile.name || user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{t('staffProfilePage.emailAddress')}</p>
                    <p className="text-foreground mt-0.5">{profile.email || user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{t('staffProfilePage.contactPhone')}</p>
                    <p className="text-foreground mt-0.5">{profile.phone || '(512) 555-0199'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Shield className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{t('staffProfilePage.securityRole')}</p>
                    <p className="text-foreground mt-0.5">{profile.role || user?.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{t('staffProfilePage.assignedProperties')}</p>
                    <p className="text-foreground mt-0.5">{profile.assignedProperties || 'Sunset Villas, Apex Heights, Lakeside'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Calendar className="w-4.5 h-4.5 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60">{t('staffProfilePage.joinedDate')}</p>
                    <p className="text-foreground mt-0.5">{profile.joinedDate || 'January 15th, 2025'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;
