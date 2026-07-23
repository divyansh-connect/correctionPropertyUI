import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { BookOpen, Award, Download, Key } from 'lucide-react';

export const TenantLeasePage: React.FC = () => {
  // Queries
  const { data: lease = null, isLoading } = useQuery({ queryKey: ['tenant-lease-details'], queryFn: () => api.tenantLeases.get() });

  if (isLoading || !lease) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-4xl">
      <PageHeader
        title="My Lease Agreement"
        description="Verify monthly lease schedules, renewal options eligibility, and utility splits."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Lease' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Lease Terms Summary */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <div className="flex items-center space-x-3 border-b pb-4">
            <BookOpen className="w-7 h-7 text-primary shrink-0" />
            <div>
              <h3 className="font-extrabold text-sm uppercase">Lease Term Details</h3>
              <p className="text-xs text-muted-foreground mt-0.5 font-bold">Start: {lease.leaseStart} • End: {lease.leaseEnd}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase">Monthly Rent</span>
              <p className="font-bold text-sm text-primary">${lease.rentAmount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase">Refundable Security Deposit</span>
              <p className="font-bold text-sm">${lease.securityDeposit.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4 text-xs font-semibold text-muted-foreground">
            <p className="font-bold text-foreground">Included Utilities</p>
            <div className="grid grid-cols-3 gap-2">
              <span className="bg-secondary/40 border p-2 rounded-xl text-center">Trash Valet</span>
              <span className="bg-secondary/40 border p-2 rounded-xl text-center">Sewage</span>
              <span className="bg-secondary/40 border p-2 rounded-xl text-center">Pest Control</span>
            </div>
          </div>
        </Card>

        {/* Lease Actions & Document downloads */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-4">
          <div className="flex items-center space-x-2 border-b pb-2">
            <Award className="w-4.5 h-4.5 text-primary shrink-0" />
            <h4 className="font-extrabold uppercase">Lease Actions</h4>
          </div>

          <div className="space-y-3">
            <Button size="sm" className="w-full text-xs font-bold uppercase flex items-center justify-center gap-1.5" onClick={() => alert('Downloading Lease PDF...')}>
              <Download className="w-4 h-4" /> Download Lease Agreement
            </Button>
            <Button size="sm" variant="outline" className="w-full text-xs font-bold uppercase flex items-center justify-center gap-1.5" onClick={() => alert('Contacting leasing office...')}>
              <Key className="w-4 h-4" /> Request Renewal Form
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default TenantLeasePage;
