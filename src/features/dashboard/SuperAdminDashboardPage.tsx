import React from 'react';
import { StatsCard } from '../../components/StatsCard';
import { ChartCard } from '../../components/ChartCard';
import { PageHeader } from '../../components/PageHeader';
import { 
  Building2, Users, CreditCard, BarChart3, Shield, Settings, Bot, RefreshCw, TrendingUp, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart as ReBarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';

export const SuperAdminDashboardPage: React.FC = () => {
  // Static Mock Data for SaaS Platform
  const metrics = {
    activeCompanies: 142,
    activeUsers: 1842,
    monthlyRecurringRevenue: 42500,
    activeSubscriptions: 138,
    storageUsage: "4.2 TB",
  };

  const revenueData = [
    { name: 'Jan', revenue: 28000 },
    { name: 'Feb', revenue: 31000 },
    { name: 'Mar', revenue: 33500 },
    { name: 'Apr', revenue: 36000 },
    { name: 'May', revenue: 39000 },
    { name: 'Jun', revenue: 42500 },
  ];

  const growthData = [
    { name: 'Jan', companies: 98, users: 1100 },
    { name: 'Feb', companies: 108, users: 1250 },
    { name: 'Mar', companies: 115, users: 1400 },
    { name: 'Apr', companies: 124, users: 1550 },
    { name: 'May', companies: 132, users: 1700 },
    { name: 'Jun', companies: 142, users: 1842 },
  ];

  const planDistribution = [
    { name: 'Basic Plan', value: 45 },
    { name: 'Pro Plan', value: 72 },
    { name: 'Enterprise Plan', value: 21 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="SaaS Platform Control Panel"
        description="Global system administration, operational health, and company subscriptions statistics."
        breadcrumbs={[
          { label: 'Platform Home', href: '/' },
          { label: 'SaaS Dashboard' }
        ]}
        action={{
          label: 'Sync Metrics',
          onClick: () => {},
          icon: <RefreshCw className="w-4 h-4" />,
          variant: 'outline'
        }}
      />

      {/* --- SaaS STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Companies"
          value={metrics.activeCompanies}
          icon={<Building2 className="w-5 h-5" />}
          trend="up"
          trendLabel="+12 new"
          description="this month"
        />
        <StatsCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          icon={<Users className="w-5 h-5" />}
          trend="up"
          trendLabel="+142 new"
          description="weekly signups"
        />
        <StatsCard
          title="MRR (Revenue)"
          value={`$${metrics.monthlyRecurringRevenue.toLocaleString()}`}
          icon={<CreditCard className="w-5 h-5" />}
          trend="up"
          trendLabel="+8.4%"
          description="m/m growth"
        />
        <StatsCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions}
          icon={<BarChart3 className="w-5 h-5" />}
          trend="up"
          trendLabel="98.5%"
          description="retention rate"
        />
      </div>

      {/* --- SaaS CHARTS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Recurring Revenue (MRR) Growth">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-[10px] text-muted-foreground" />
                  <YAxis stroke="currentColor" className="text-[10px] text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px', 
                      fontSize: '12px' 
                    }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#mrrGradient)" name="Monthly Revenue ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Subscription Plan Distribution">
          <div className="h-80 w-full flex flex-col justify-between">
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px', 
                      fontSize: '12px' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 pb-2">
              {planDistribution.map((plan, index) => (
                <div key={plan.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-semibold text-muted-foreground">{plan.name} ({plan.value})</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* --- PLATFORM USERS AND GROWTH CHART --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <ChartCard title="Companies & Global User Signups Growth">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-[10px] text-muted-foreground" />
                  <YAxis yAxisId="left" stroke="#3b82f6" className="text-[10px]" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" className="text-[10px]" />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))', 
                      borderRadius: '8px', 
                      fontSize: '12px' 
                    }} 
                  />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="companies" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Active Companies" />
                <Bar yAxisId="right" dataKey="users" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Registered Users" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  </div>
  );
};
