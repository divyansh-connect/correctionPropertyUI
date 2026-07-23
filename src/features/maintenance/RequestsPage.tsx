import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { MaintenanceRequest } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { RequestPriorityBadge } from '../../components/MaintenanceComponents';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Eye, Trash2, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const RequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Queries
  const { data: requests = [], isLoading } = useQuery({ queryKey: ['service-requests-list'], queryFn: () => api.serviceRequests.getAll() });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.serviceRequests.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests-list'] });
    },
  });

  const filteredRequests = requests.filter((r) => {
    const titleVal = r.title || '';
    const tenantVal = r.tenantName || '';
    const searchMatch = titleVal.toLowerCase().includes(searchQuery.toLowerCase()) || tenantVal.toLowerCase().includes(searchQuery.toLowerCase());
    const prioMatch = priorityFilter === '' || r.priority === priorityFilter;
    const statusMatch = statusFilter === '' || r.status === statusFilter;
    return searchMatch && prioMatch && statusMatch;
  });

  const handleExport = () => {
    const headers = 'ID,Title,Property,Unit,Tenant,Priority,Status,Created At\n';
    const rows = filteredRequests
      .slice(0, 500)
      .map(
        (r) =>
          `"${r.id}","${r.title}","${r.propertyName}","${r.unitNumber}","${r.tenantName}","${r.priority}","${r.status}","${r.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Maintenance_Requests.csv');
    a.click();
  };

  const columns: ColumnDef<MaintenanceRequest>[] = [
    {
      accessorKey: 'id',
      header: 'Request NO',
      id: 'id',
      cell: ({ row }) => (
        <span onClick={() => navigate({ to: `/maintenance/requests/${row.original.id}` })} className="font-bold text-primary hover:underline cursor-pointer">
          #{row.original.id.replace('sr-', '')}
        </span>
      ),
    },
    { accessorKey: 'propertyName', header: 'Property Location', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit', id: 'unit' },
    { accessorKey: 'tenantName', header: 'Resident', id: 'tenant' },
    {
      accessorKey: 'priority',
      header: 'Priority',
      id: 'priority',
      cell: ({ row }) => <RequestPriorityBadge priority={row.original.priority as any} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: 'createdAt', header: 'Submitted Date', id: 'createdAt' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/maintenance/requests/${row.original.id}` })} title="View Detail">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Archive Request"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Service Tickets & Requests"
        description="Verify property issues, emergency service dispatches, and appliance failures."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Service Requests' },
        ]}
        action={{
          label: 'Submit Service Ticket',
          onClick: () => navigate({ to: '/maintenance/requests/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Total {filteredRequests.length} Service Tickets Found
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tickets by resident or issue..."
        filters={[
          {
            key: 'priority',
            value: priorityFilter,
            placeholder: 'Priority Bracket',
            options: [
              { label: 'Urgent', value: 'Urgent' },
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' },
            ],
          },
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'New', value: 'New' },
              { label: 'Submitted', value: 'Submitted' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Assigned', value: 'Assigned' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Waiting for Parts', value: 'Waiting for Parts' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Cancelled', value: 'Cancelled' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'priority') setPriorityFilter(val);
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPriorityFilter('');
          setStatusFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredRequests.slice(0, 100)} loading={isLoading} />
    </div>
  );
};
export default RequestsPage;
