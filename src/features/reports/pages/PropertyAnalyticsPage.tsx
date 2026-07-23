import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { FilterBuilder } from '../components/FilterBuilder';
import { DataTable } from '../../../components/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { ColumnDef } from '@tanstack/react-table';

export const PropertyAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    propertyId: 'all',
    dateRange: 'all',
    status: 'all',
    searchQuery: '',
  });

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['property-performance', filters],
    queryFn: () => api.analytics.getPropertyPerformance(),
  });

  const performanceColumns: ColumnDef<any>[] = [
    { accessorKey: 'property', header: 'Property', id: 'property' },
    { accessorKey: 'units', header: 'Units', id: 'units' },
    { accessorKey: 'occupied', header: 'Occupancy', id: 'occupied' },
    { accessorKey: 'revenue', header: 'Revenue', id: 'revenue', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'expenses', header: 'Expenses', id: 'expenses', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'noi', header: 'NOI', id: 'noi', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'roi', header: 'ROI', id: 'roi', cell: ({ getValue }) => `${getValue()}%` },
    { accessorKey: 'maintenanceCost', header: 'Maintenance Cost', id: 'maintenanceCost', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
  ];

  const occupancyColumns: ColumnDef<any>[] = [
    { accessorKey: 'property', header: 'Property', id: 'property' },
    { accessorKey: 'units', header: 'Total Units', id: 'units' },
    { accessorKey: 'occupied', header: 'Occupied', id: 'occupied' },
    { accessorKey: 'vacant', header: 'Vacant', id: 'vacant' },
    { accessorKey: 'occupancyRate', header: 'Rate', id: 'occupancyRate', cell: ({ getValue }) => `${getValue()}%` },
  ];

  const revenueColumns: ColumnDef<any>[] = [
    { accessorKey: 'property', header: 'Property', id: 'property' },
    { accessorKey: 'revenue', header: 'Rent Income', id: 'revenue', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { id: 'otherIncome', header: 'Other Income', accessorFn: (row) => row.revenue * 0.05, cell: ({ getValue }) => `$${(getValue() as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
    { id: 'totalIncome', header: 'Total Income', accessorFn: (row) => row.revenue * 1.05, cell: ({ getValue }) => `$${(getValue() as number).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
  ];

  const expenseColumns: ColumnDef<any>[] = [
    { accessorKey: 'property', header: 'Property', id: 'property' },
    { id: 'category', header: 'Category', accessorFn: () => 'Operations & Maintenance' },
    { accessorKey: 'expenses', header: 'Amount', id: 'expenses', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { id: 'vendor', header: 'Vendor', accessorFn: () => 'Multiple Vendors' },
  ];

  const handleExport = (format: 'PDF' | 'CSV' | 'Print') => {
    alert(`Generating ${format} export for Property Analytics...`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Analytics"
        description="Detailed performance auditing across all portfolios."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Properties' }]}
      />

      <FilterBuilder onFilterChange={setFilters} showExport onExport={handleExport} />

      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance Report</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy Report</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Report</TabsTrigger>
          <TabsTrigger value="expenses">Expense Report</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <DataTable columns={performanceColumns} data={properties} loading={isLoading} />
        </TabsContent>

        <TabsContent value="occupancy">
          <DataTable columns={occupancyColumns} data={properties} loading={isLoading} />
        </TabsContent>

        <TabsContent value="revenue">
          <DataTable columns={revenueColumns} data={properties} loading={isLoading} />
        </TabsContent>

        <TabsContent value="expenses">
          <DataTable columns={expenseColumns} data={properties} loading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default PropertyAnalyticsPage;
