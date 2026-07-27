import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Landmark, User, Mail, Shield } from 'lucide-react';

export const OwnerProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 text-foreground max-w-3xl">
      <PageHeader
        title="My Investor Profile"
        description="Verify direct deposit banking configurations, mailing addresses, and security passwords."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Profile' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Personal Details */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Mailing & Contact Info</h3>
          <form className="space-y-4 text-xs font-semibold" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                <Input value="William" disabled={true} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                <Input value="Anderson" disabled={true} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone</label>
                <Input value="(212) 555-0122" disabled={true} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                <Input value="bill.a@investments.com" disabled={true} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Mailing Street Address</label>
              <Input value="742 Evergreen Terrace, New York, NY" disabled={true} />
            </div>
          </form>
        </Card>

        {/* Payout Bank Setup */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">ACH Direct Deposit</h3>
          <div className="space-y-3.5 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-bold text-foreground">Chase checking</p>
                <p className="font-mono text-[10px]">XXXX-XXXX-9822</p>
              </div>
            </div>
            <p className="text-[10px] uppercase font-bold text-emerald-500">Routing status: Verified</p>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default OwnerProfilePage;
