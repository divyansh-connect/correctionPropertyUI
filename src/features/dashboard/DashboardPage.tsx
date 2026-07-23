import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { StatsCard } from '../../components/StatsCard';
import { ChartCard } from '../../components/ChartCard';
import { PageHeader } from '../../components/PageHeader';
import { 
  Building2, Home, UserCheck, AlertCircle, TrendingUp, DollarSign, Calendar, Wrench, 
  Sparkles, RefreshCw, BarChart
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart as ReBarChart, Bar, Legend, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  // Query Metrics
  const { data: metrics, isLoading: loadingMetrics, refetch: refetchMetrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: () => api.dashboard.getMetrics(),
  });

  // Query Charts
  const { data: charts, isLoading: loadingCharts, refetch: refetchCharts } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: () => api.dashboard.getChartData(),
  });

  const refreshAll = () => {
    refetchMetrics();
    refetchCharts();
  };

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Analytics"
        description="Real-time operational metrics and financial intelligence for your properties."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard' }
        ]}
        action={{
          label: 'Sync Data',
          onClick: refreshAll,
          icon: <RefreshCw className="w-4 h-4" />,
          variant: 'outline'
        }}
      />

      {/* --- 10 METRIC CARDS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Properties"
          value={metrics?.totalProperties ?? 0}
          icon={<Building2 className="w-5 h-5" />}
          trend="up"
          trendLabel="+1 new"
          description="this quarter"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Total Units"
          value={metrics?.totalUnits ?? 0}
          icon={<Home className="w-5 h-5" />}
          description="Across all assets"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Occupied Units"
          value={metrics?.occupiedUnits ?? 0}
          icon={<UserCheck className="w-5 h-5" />}
          trend="neutral"
          trendLabel="Stable"
          description="Active leases"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Vacant Units"
          value={metrics?.vacantUnits ?? 0}
          icon={<AlertCircle className="w-5 h-5" />}
          trend="down"
          trendLabel="-2 units"
          description="ready for listings"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${metrics?.occupancyRate ?? 0}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          trendLabel="+4.2%"
          description="compared to last month"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`$${(metrics?.monthlyRevenue ?? 0).toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend="up"
          trendLabel="+12.4%"
          description="Rent collection rate"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Pending Rent"
          value={`$${(metrics?.pendingRent ?? 0).toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          trend="down"
          trendLabel="-8.5%"
          description="outstanding balances"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Expenses"
          value={`$${(metrics?.expenses ?? 0).toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
          description="Invoices paid this month"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Open Maintenance"
          value={metrics?.openMaintenance ?? 0}
          icon={<Wrench className="w-5 h-5" />}
          trend="up"
          trendLabel="+1 pending"
          description="Active work orders"
          loading={loadingMetrics}
        />
        <StatsCard
          title="Leases Expiring Soon"
          value={metrics?.leasesExpiringSoon ?? 0}
          icon={<Calendar className="w-5 h-5" />}
          description="Expiring in next 60 days"
          loading={loadingMetrics}
        />
      </div>

      {/* --- 4 CHARTS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <ChartCard
          title="Revenue Growth"
          description="Gross rent collected month-over-month"
          loading={loadingCharts}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts?.revenueGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
              <XAxis dataKey="month" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} />
              <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: '10px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Income vs Expenses Chart */}
        <ChartCard
          title="Income vs Expenses"
          description="Net operations performance comparison"
          loading={loadingCharts}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={charts?.incomeVsExpenses} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
              <XAxis dataKey="month" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} />
              <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: '10px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'semibold' }} />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Occupancy Trend Chart */}
        <ChartCard
          title="Occupancy Trend"
          description="Portfolio occupancy percentage rates"
          loading={loadingCharts}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts?.occupancyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
              <XAxis dataKey="month" stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} />
              <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} opacity={0.6} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip 
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: '10px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: any) => [`${value}%`, 'Occupancy']}
              />
              <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Maintenance Analytics Chart */}
        <ChartCard
          title="Maintenance Work Orders"
          description="Work orders broken down by specialty trade category"
          loading={loadingCharts}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts?.maintenanceAnalytics}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="count"
                nameKey="category"
              >
                {charts?.maintenanceAnalytics.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  background: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))', 
                  borderRadius: '10px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'semibold' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
export default DashboardPage;
