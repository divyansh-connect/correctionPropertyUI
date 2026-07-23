import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { WorkOrder } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Eye, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const WorkOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Queries
  const { data: workOrdersList = [], isLoading } = useQuery({ queryKey: ['work-orders-list'], queryFn: () => api.workOrders.getAll() });

  const filteredOrders = workOrdersList.filter((w) => {
    const searchMatch = w.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || w.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === '' || w.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const handleExport = () => {
    const headers = 'WO Number,Property,Unit,Vendor,Technician,Scheduled Date,Estimated Cost,Actual Cost,Status\n';
    const rows = filteredOrders
      .slice(0, 500)
      .map(
        (w) =>
          `"${w.workOrderNumber}","${w.propertyName}","${w.unitNumber}","${w.vendorName}","${w.assignedTechnician}","${w.scheduledDate}",${w.estimatedCost},${w.actualCost},"${w.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Work_Orders.csv');
    a.click();
  };

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: 'workOrderNumber',
      header: 'Work Order Number',
      id: 'workOrderNumber',
      cell: ({ row }) => (
        <span onClick={() => navigate({ to: `/maintenance/work-orders/${row.original.id}` })} className="font-bold text-primary hover:underline cursor-pointer">
          {row.original.workOrderNumber}
        </span>
      ),
    },
    { accessorKey: 'propertyName', header: 'Property Location', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit', id: 'unit' },
    { accessorKey: 'vendorName', header: 'Contractor Vendor', id: 'vendor' },
    { accessorKey: 'assignedTechnician', header: 'Assigned Tech', id: 'tech' },
    { accessorKey: 'scheduledDate', header: 'Scheduled Date', id: 'date' },
    {
      accessorKey: 'estimatedCost',
      header: 'Est. Cost',
      id: 'estCost',
      cell: ({ row }) => <span>${row.original.estimatedCost.toLocaleString()}</span>,
    },
    {
      accessorKey: 'actualCost',
      header: 'Actual Cost',
      id: 'actCost',
      cell: ({ row }) => (
        <span className="font-bold text-rose-500">
          {row.original.actualCost > 0 ? `$${row.original.actualCost.toLocaleString()}` : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/maintenance/work-orders/${row.original.id}` })} title="View Detail">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Work Orders & Dispatches"
        description="Verify service diagnostics dispatches, material expenses, and vendor logs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Work Orders' },
        ]}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Total {filteredOrders.length} Dispatched Work Orders Found
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search work orders by number or vendor..."
        filters={[
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Draft', value: 'Draft' },
              { label: 'Assigned', value: 'Assigned' },
              { label: 'Scheduled', value: 'Scheduled' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Waiting', value: 'Waiting' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Closed', value: 'Closed' },
              { label: 'Cancelled', value: 'Cancelled' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredOrders.slice(0, 100)} loading={isLoading} />
    </div>
  );
};
export default WorkOrdersPage;
