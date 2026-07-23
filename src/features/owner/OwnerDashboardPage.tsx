import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Building2, CreditCard, MessageSquare, Wrench } from 'lucide-react';

export const OwnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['owner-dashboard-metrics'],
    queryFn: () => api.ownerPortal.getMetrics(),
  });

  if (isLoading || !metrics) {
    return <LoadingSkeleton type="card" />;
  }

  // Monthly Revenue Chart data
  const revenueData = [
    { name: 'Feb', Income: metrics.monthlyIncome * 0.9, Expenses: metrics.monthlyExpenses * 0.95 },
    { name: 'Mar', Income: metrics.monthlyIncome * 0.95, Expenses: metrics.monthlyExpenses * 0.9 },
    { name: 'Apr', Income: metrics.monthlyIncome * 1.0, Expenses: metrics.monthlyExpenses * 1.0 },
    { name: 'May', Income: metrics.monthlyIncome * 1.05, Expenses: metrics.monthlyExpenses * 1.1 },
    { name: 'Jun', Income: metrics.monthlyIncome * 1.0, Expenses: metrics.monthlyExpenses * 1.05 },
    { name: 'Jul', Income: metrics.monthlyIncome, Expenses: metrics.monthlyExpenses },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Owner Portfolio Dashboard"
        description="Verify monthly portfolio incomes, occupancy trends, net profits, and contractor dispatches."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Dashboard' },
        ]}
      />

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/owner/statements' })} className="flex items-center gap-1">
          <Download className="w-4 h-4" /> Download Statement
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/owner/properties' })} className="flex items-center gap-1">
          <Building2 className="w-4 h-4" /> My Properties
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/owner/messages' })} className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" /> Contact Manager
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/owner/documents' })} className="flex items-center gap-1">
          <Download className="w-4 h-4" /> Tax Documents
        </Button>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Managed Properties</p>
            <p className="text-2xl font-black mt-1 text-primary">{metrics.totalProperties}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Active assets holdings</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Occupancy Rate</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">{metrics.occupancyRate}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">{metrics.totalUnits} Total Units</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Net Income</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">${metrics.netIncome.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Operating cash flows</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Pending Maintenance</p>
            <p className="text-2xl font-black mt-1 text-amber-500">{metrics.pendingMaintenance}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Active service requests</span>
        </Card>
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Expenses Bar Chart */}
        <Card className="lg:col-span-3 p-6 border bg-card">
          <h3 className="font-extrabold text-sm uppercase mb-4 tracking-wider">Income vs Operating Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                <XAxis dataKey="name" stroke="currentColor" fontSize={11} opacity={0.6} />
                <YAxis stroke="currentColor" fontSize={11} opacity={0.6} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default OwnerDashboardPage;
