import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { FilterBuilder } from '../components/FilterBuilder';
import { DataTable } from '../../../components/DataTable';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ColumnDef } from '@tanstack/react-table';

export const LeasingAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    propertyId: 'all',
    dateRange: 'all',
    status: 'all',
    searchQuery: '',
  });

  const { data: funnel = [], isLoading: loadingFunnel } = useQuery({
    queryKey: ['leasing-funnel'],
    queryFn: () => api.analytics.getLeasingFunnel(),
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['leasing-metrics'],
    queryFn: () => api.metrics.getLeasingMetrics(),
  });

  const funnelColumns: ColumnDef<any>[] = [
    { accessorKey: 'stage', header: 'Funnel Stage', id: 'stage' },
    { accessorKey: 'count', header: 'Lead Count', id: 'count' },
    { accessorKey: 'conversion', header: 'Stage Conversion %', id: 'conversion', cell: ({ getValue }) => `${getValue()}%` },
  ];

  const agentColumns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Agent', id: 'name' },
    { accessorKey: 'signed', header: 'Leases Signed', id: 'signed' },
    { accessorKey: 'leads', header: 'Total Leads Handled', id: 'leads' },
    { id: 'rate', header: 'Conversion Rate', accessorFn: (row) => ((row.signed / row.leads) * 100).toFixed(1), cell: ({ getValue }) => `${getValue()}%` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leasing Analytics"
        description="Analyze your rental lead conversion funnel, agent activities, and marketing source performance."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Leasing' }]}
      />

      <FilterBuilder onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <AnalyticsCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate || 0}%`}
          description="Average lead to signed lease"
          loading={loadingMetrics}
        />
        <AnalyticsCard
          title="Avg Days to Lease"
          value={`${metrics?.avgDaysToLease || 0} Days`}
          description="Average lead-to-signing lifecycle duration"
          loading={loadingMetrics}
        />
      </div>

      <Tabs defaultValue="funnel">
        <TabsList className="mb-4">
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="sources">Sources Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DataTable columns={funnelColumns} data={funnel} loading={loadingFunnel} />
            <div className="bg-card border border-border p-5 rounded-xl flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={funnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" fontSize={11} stroke="#94a3b8" />
                  <YAxis dataKey="stage" type="category" fontSize={11} stroke="#94a3b8" width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <DataTable columns={agentColumns} data={metrics?.agentPerformance || []} loading={loadingMetrics} />
        </TabsContent>

        <TabsContent value="sources">
          <div className="bg-card border border-border p-5 rounded-xl">
            <h3 className="font-bold text-sm text-foreground mb-4">Lead Source Conversions</h3>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.sourcePerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar name="Leads" dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar name="Conversions" dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default LeasingAnalyticsPage;
