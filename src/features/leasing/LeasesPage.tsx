import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Lease } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Plus, Eye, Key, AlertTriangle, Play } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const LeasesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog triggers
  const [terminateId, setTerminateId] = useState<string | null>(null);

  // Queries
  const { data: leases = [], isLoading, error } = useQuery({
    queryKey: ['leases'],
    queryFn: () => api.leasing.getLeases(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const terminateMutation = useMutation({
    // simple state update simulation
    mutationFn: async (id: string) => {
      return api.leasing.updateLease(id, { status: 'Terminated' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      setTerminateId(null);
    },
  });

  // Filter Logic
  const filteredLeases = leases.filter((l) => {
    const tenantVal = l.tenantName || '';
    const idVal = l.id || '';
    const tenantMatch = tenantVal.toLowerCase().includes(searchQuery.toLowerCase());
    const leaseIdMatch = idVal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProp = propertyFilter === '' || l.propertyId === propertyFilter;
    const matchesStatus = statusFilter === '' || l.status === statusFilter;
    return (tenantMatch || leaseIdMatch) && matchesProp && matchesStatus;
  });

  const columns: ColumnDef<Lease>[] = [
    {
      accessorKey: 'id',
      header: 'Lease #',
      id: 'id',
      cell: ({ row }) => (
        <span
          onClick={() => navigate({ to: `/leases/${row.original.id}` })}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          {row.original.id}
        </span>
      ),
    },
    { accessorKey: 'tenantName', header: 'Resident', id: 'tenantName' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit #', id: 'unit' },
    { accessorKey: 'startDate', header: 'Start Date', id: 'startDate' },
    { accessorKey: 'endDate', header: 'End Date', id: 'endDate' },
    {
      accessorKey: 'rentAmount',
      header: 'Monthly Rent',
      id: 'rent',
      cell: ({ row }) => <span className="font-semibold">${row.original.rentAmount.toLocaleString()}</span>,
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
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: `/leases/${row.original.id}` })}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status === 'Active' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-rose-500 hover:bg-rose-500/10"
              onClick={() => setTerminateId(row.original.id)}
              title="Terminate Lease"
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Lease Agreements"
        description="Verify active tenancies, renewal windows, and security deposits logs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Leasing', href: '/leasing/leases' },
          { label: 'Leases' },
        ]}
        action={{
          label: 'Create Lease Wizard',
          onClick: () => navigate({ to: '/leases/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search leases by tenant name or ID..."
        filters={[
          {
            key: 'property',
            value: propertyFilter,
            placeholder: 'All Properties',
            options: properties.map((p) => ({ label: p.name, value: p.id })),
          },
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Expired', value: 'Expired' },
              { label: 'Terminated', value: 'Terminated' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'property') setPropertyFilter(val);
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPropertyFilter('');
          setStatusFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredLeases} loading={isLoading} error={error ? error.message : null} />

      <ConfirmDialog
        open={!!terminateId}
        onOpenChange={(open) => !open && setTerminateId(null)}
        title="Terminate Lease Agreement"
        description="Are you sure you want to terminate this lease? This will transition the unit status back to Vacant and flag the lease as terminated."
        confirmText="Terminate Lease"
        variant="destructive"
        onConfirm={() => terminateId && terminateMutation.mutate(terminateId)}
      />
    </div>
  );
};
export default LeasesPage;
