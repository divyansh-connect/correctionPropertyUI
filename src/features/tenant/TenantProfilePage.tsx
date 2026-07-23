import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { User, ShieldAlert } from 'lucide-react';

export const TenantProfilePage: React.FC = () => {
  // Queries
  const { data: profile = null, isLoading } = useQuery({ queryKey: ['tenant-profile-details'], queryFn: () => api.tenantProfile.get() });

  if (isLoading || !profile) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-3xl">
      <PageHeader
        title="Resident Profile"
        description="Verify personal contact details, registered vehicles, pets records, and emergency notifications."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Profile' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Contact details</h3>
          <form className="space-y-4 text-xs font-semibold" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                <Input value={profile.firstName} disabled={true} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                <Input value={profile.lastName} disabled={true} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone</label>
                <Input value={profile.phone} disabled={true} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                <Input value={profile.email} disabled={true} />
              </div>
            </div>
          </form>
        </Card>

        {/* Vehicles & Pets */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-5 text-xs font-semibold">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Permits</h3>
          
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase">Registered Vehicles</span>
            <p className="font-bold text-foreground">{profile.vehicles}</p>
          </div>

          <div className="space-y-2 border-t pt-3">
            <span className="text-[10px] text-muted-foreground uppercase">Registered Pets</span>
            <p className="font-bold text-foreground">{profile.pets}</p>
          </div>

          <div className="space-y-2 border-t pt-3">
            <span className="text-[10px] text-muted-foreground uppercase">Preferred Language</span>
            <p className="font-bold text-foreground">{profile.preferredLanguage}</p>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default TenantProfilePage;
