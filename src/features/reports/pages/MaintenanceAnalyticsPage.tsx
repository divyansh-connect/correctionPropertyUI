import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { FilterBuilder } from '../components/FilterBuilder';
import { DataTable } from '../../../components/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { ColumnDef } from '@tanstack/react-table';

export const MaintenanceAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    propertyId: 'all',
    dateRange: 'all',
    status: 'all',
    searchQuery: '',
  });

  const { data: vendors = [], isLoading: loadingVend } = useQuery({
    queryKey: ['maintenance-vendors'],
    queryFn: () => api.analytics.getVendorPerformance(),
  });

  const vendorColumns: ColumnDef<any>[] = [
    { accessorKey: 'vendor', header: 'Vendor Name', id: 'vendor' },
    { accessorKey: 'jobsCompleted', header: 'Jobs Completed', id: 'jobsCompleted' },
    { accessorKey: 'avgResponseTime', header: 'Avg Response Time', id: 'avgResponseTime' },
    { accessorKey: 'rating', header: 'Rating', id: 'rating', cell: ({ getValue }) => `${getValue()}/5.0` },
    { accessorKey: 'totalCost', header: 'Total Cost Paid', id: 'totalCost', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance Analytics"
        description="Audit vendor performance ratings, ticket response completion rates, and categories of spending."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Maintenance' }]}
      />

      <FilterBuilder onFilterChange={setFilters} />

      <Tabs defaultValue="vendors">
        <TabsList className="mb-4">
          <TabsTrigger value="vendors">Vendor Performance</TabsTrigger>
          <TabsTrigger value="workorders">Work Order Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <DataTable columns={vendorColumns} data={vendors} loading={loadingVend} />
        </TabsContent>

        <TabsContent value="workorders">
          <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">
            <h3 className="font-bold text-base text-foreground mb-4 font-sans">Work Order Metrics</h3>
            <p className="max-w-md mx-auto text-sm">
              Average completion time across all properties is 24.5 hours. 91.8% of requests are addressed within SLAs.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default MaintenanceAnalyticsPage;
