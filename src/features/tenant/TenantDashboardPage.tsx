import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { CreditCard, Wrench, MessageSquare, BookOpen, Package, UserCheck } from 'lucide-react';

export const TenantDashboardPage: React.FC = () => {
  const navigate = useNavigate();

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
        title="Resident Dashboard"
        description="Verify monthly rent balances, lease expiration milestones, packages arrivals, and maintenance dispatches."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Dashboard' },
        ]}
      />

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/tenant/payments' })} className="flex items-center gap-1">
          <CreditCard className="w-4 h-4" /> Pay Rent
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/tenant/maintenance' })} className="flex items-center gap-1">
          <Wrench className="w-4 h-4" /> Submit Repair Request
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/tenant/messages' })} className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" /> Contact Management
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/tenant/lease' })} className="flex items-center gap-1">
          <BookOpen className="w-4 h-4" /> View Lease Terms
        </Button>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Rent due</p>
            <p className="text-2xl font-black mt-1 text-primary">${metrics.currentRent.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Due Date: {metrics.nextDueDate}</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Outstanding Balance</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">${metrics.outstandingBalance.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Account status: Paid in Full</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Visitor Passes</p>
            <p className="text-2xl font-black mt-1 text-indigo-500">{metrics.activeVisitors}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Registered guests logs</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Waiting Packages</p>
            <p className="text-2xl font-black mt-1 text-amber-500">{metrics.packagesWaiting}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Awaiting pickup in parcel locker</span>
        </Card>
      </div>

      {/* ADDITIONAL LEASE NOTIFICATION CARD */}
      <Card className="p-5 border bg-card flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h4 className="font-extrabold text-sm uppercase">Lease renewal option active</h4>
          <p className="text-xs text-muted-foreground font-semibold">Your lease is expiring on {metrics.leaseExpiration}. Lock in your rate for the upcoming year.</p>
        </div>
        <Button size="sm" onClick={() => navigate({ to: '/tenant/lease' })} className="uppercase text-xs font-black">
          Review Renewal
        </Button>
      </Card>
    </div>
  );
};
export default TenantDashboardPage;
