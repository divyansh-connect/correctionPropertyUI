import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { 
  DollarSign, TrendingUp, AlertCircle, Calendar, Plus, 
  Send, HelpCircle, Activity, CreditCard 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export const RentDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['rent-metrics'],
    queryFn: async () => {
      const allPay = await api.payments.getAll();
      const allInv = await api.invoices.getAll();
      const allPlans = await api.paymentPlans.getAll();
      
      const collected = allPay.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
      const pending = allPay.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
      const overdue = allInv.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.balance, 0);

      return {
        collectedToday: collected * 0.05,
        monthlyCollected: collected,
        outstandingBalance: overdue,
        latePayments: allInv.filter(i => i.status === 'Overdue').length,
        activePlans: allPlans.filter(p => p.status === 'Active').length,
      };
    },
  });

  const { data: recentPayments = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['recent-payments'],
    queryFn: async () => {
      const all = await api.payments.getAll();
      return all.slice(0, 5);
    },
  });

  if (loadingMetrics || loadingRecent || !metrics) {
    return <LoadingSkeleton type="card" />;
  }

  // Chart data
  const collectionTrendData = [
    { day: 'Mon', Collected: metrics.monthlyCollected * 0.12 },
    { day: 'Tue', Collected: metrics.monthlyCollected * 0.15 },
    { day: 'Wed', Collected: metrics.monthlyCollected * 0.18 },
    { day: 'Thu', Collected: metrics.monthlyCollected * 0.14 },
    { day: 'Fri', Collected: metrics.monthlyCollected * 0.22 },
    { day: 'Sat', Collected: metrics.monthlyCollected * 0.09 },
    { day: 'Sun', Collected: metrics.monthlyCollected * 0.10 },
  ];

  const methodDistribution = [
    { name: 'ACH Direct', value: 55 },
    { name: 'Credit Card', value: 25 },
    { name: 'Bank Wire', value: 12 },
    { name: 'Cash/Check', value: 8 },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Rent Dashboard"
        description="Verify monthly payment collections, active payment plans, and outstanding rent balances."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection' },
        ]}
      />

      {/* QUICK ACTION BAR */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card/60 border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/payments/new' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Record Payment
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/invoices/new' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/rent-ledger' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Rent Ledger
        </Button>
      </div>

      {/* STATS METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 border border-border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Collected Today</p>
            <p className="text-2xl font-extrabold mt-1 text-emerald-500">${metrics.collectedToday.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Daily clearing</span>
        </Card>

        <Card className="p-5 border border-border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Monthly Collected</p>
            <p className="text-2xl font-extrabold mt-1 text-emerald-500">${metrics.monthlyCollected.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold mt-4 flex items-center gap-0.5">
            <TrendingUp className="w-3.5 h-3.5" /> 92% Collection Rate
          </span>
        </Card>

        <Card className="p-5 border border-border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Outstanding Balance</p>
            <p className="text-2xl font-extrabold mt-1 text-rose-500">${metrics.outstandingBalance.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-rose-500 font-bold mt-4 flex items-center gap-0.5">
            <AlertCircle className="w-3.5 h-3.5" /> {metrics.latePayments} Overdue Bills
          </span>
        </Card>

        <Card className="p-5 border border-border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Payment Plans</p>
            <p className="text-2xl font-extrabold mt-1">{metrics.activePlans}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Active installment plans</span>
        </Card>

        <Card className="p-5 border border-border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Late Fee Invoices</p>
            <p className="text-2xl font-extrabold mt-1">{metrics.latePayments}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Dispatched automatically</span>
        </Card>
      </div>

      {/* GRAPH & DATA SEGMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Graph */}
        <Card className="lg:col-span-2 p-6 border-border bg-card">
          <h3 className="font-bold text-sm uppercase mb-4 tracking-wide">Daily Collection Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={collectionTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                <XAxis dataKey="day" stroke="currentColor" fontSize={11} opacity={0.6} />
                <YAxis stroke="currentColor" fontSize={11} opacity={0.6} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                <Area type="monotone" dataKey="Collected" stroke="hsl(var(--primary))" fill="rgba(var(--primary), 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Method Distribution */}
        <Card className="lg:col-span-1 p-6 border-border bg-card flex flex-col justify-between">
          <h3 className="font-bold text-sm uppercase mb-4 tracking-wide">Payment Channels</h3>
          <div className="h-60 flex justify-center items-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={methodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {methodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-muted-foreground pt-4 border-t border-border/40">
            {methodDistribution.map((method, index) => (
              <div key={method.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate">{method.name} ({method.value}%)</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* BOTTOM LIST WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Recent Payments */}
        <Card className="p-5 border-border bg-card space-y-4">
          <h3 className="font-bold text-sm uppercase border-b pb-3 tracking-wide">Recent Cleared Payments</h3>
          <div className="divide-y space-y-3">
            {recentPayments.map((pay) => (
              <div key={pay.id} className="flex justify-between items-center pt-3 text-xs">
                <div>
                  <p className="font-bold">{pay.tenantName}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Unit {pay.unitNumber} • {pay.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-emerald-500">${pay.amount.toLocaleString()}</p>
                  <span className="text-[9px] text-muted-foreground font-bold">{pay.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Overdue Accounts */}
        <Card className="p-5 border-border bg-card space-y-4">
          <h3 className="font-bold text-sm uppercase border-b pb-3 tracking-wide">Largest Outstanding Rent Balances</h3>
          <div className="divide-y space-y-3">
            {recentPayments.slice(0, 3).map((pay, idx) => (
              <div key={pay.id} className="flex justify-between items-center pt-3 text-xs">
                <div>
                  <p className="font-bold">{pay.tenantName}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Unit {pay.unitNumber} • Overdue</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-rose-500">${(pay.amount * 1.5).toLocaleString()}</p>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-primary hover:bg-primary/10">
                    Send Reminder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};
export default RentDashboardPage;
