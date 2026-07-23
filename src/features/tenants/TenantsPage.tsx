import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Tenant } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { TenantAvatar } from '../../components/TenantAvatar';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const TenantsPage: React.FC<{ filterStatus?: string }> = ({ filterStatus }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterStatus || '');
  const [balanceFilter, setBalanceFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.tenant.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.tenant.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setDeleteId(null);
    },
  });

  // Filter Logic
  const filteredTenants = tenants.filter((t) => {
    const nameMatch = `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = t.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProp = propertyFilter === '' || t.propertyId === propertyFilter;
    const matchesStatus = statusFilter === '' || t.status === statusFilter;
    
    // Mock Balance logic: let's say odd index tenants have a balance for demonstration
    const hasBalance = parseInt(t.id.split('-').pop() || '0') % 3 === 0;
    const matchesBalance = balanceFilter === '' || 
      (balanceFilter === 'has-balance' && hasBalance) ||
      (balanceFilter === 'no-balance' && !hasBalance);

    return (nameMatch || emailMatch) && matchesProp && matchesStatus && matchesBalance;
  });

  // Export CSV
  const handleExport = () => {
    const headers = 'Name,Email,Phone,Property,Unit,Status\n';
    const rows = filteredTenants
      .map(
        (t) =>
          `"${t.firstName} ${t.lastName}","${t.email}","${t.phone}","${t.propertyName || ''}","${t.unitNumber || ''}","${t.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Tenants_Report.csv');
    a.click();
  };

  const columns: ColumnDef<Tenant>[] = [
    {
      id: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => (
        <TenantAvatar name={`${row.original.firstName} ${row.original.lastName}`} size="sm" />
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'Tenant Name',
      id: 'name',
      cell: ({ row }) => (
        <span
          onClick={() => navigate({ to: `/tenants/${row.original.id}` })}
          className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    { accessorKey: 'email', header: 'Email', id: 'email' },
    { accessorKey: 'phone', header: 'Phone', id: 'phone' },
    {
      accessorKey: 'propertyName',
      header: 'Property',
      id: 'property',
      cell: ({ row }) => row.original.propertyName || <span className="text-muted-foreground italic text-xs">Unassigned</span>,
    },
    {
      accessorKey: 'unitNumber',
      header: 'Unit #',
      id: 'unit',
      cell: ({ row }) => row.original.unitNumber || '-',
    },
    {
      id: 'balance',
      header: 'Balance Due',
      cell: ({ row }) => {
        const hasBalance = parseInt(row.original.id.split('-').pop() || '0') % 3 === 0;
        return (
          <span className={hasBalance ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
            {hasBalance ? '$450.00' : '$0.00'}
          </span>
        );
      },
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
            onClick={() => navigate({ to: `/tenants/${row.original.id}` })}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: `/tenants/${row.original.id}/edit` })}
            title="Edit Tenant"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete"
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
        title={filterStatus ? `${filterStatus} Tenants` : 'Tenant Directory'}
        description="Verify occupant contact channels, active lease alignments, and rent balances."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tenants' },
        ]}
        action={{
          label: 'Add Tenant',
          onClick: () => navigate({ to: '/tenants/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Total: {filteredTenants.length} Residents
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tenants by name or email..."
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
              { label: 'Inactive', value: 'Inactive' },
            ],
          },
          {
            key: 'balance',
            value: balanceFilter,
            placeholder: 'All Balances',
            options: [
              { label: 'Has Outstanding Balance', value: 'has-balance' },
              { label: 'No Balance Due', value: 'no-balance' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'property') setPropertyFilter(val);
          if (key === 'status') setStatusFilter(val);
          if (key === 'balance') setBalanceFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPropertyFilter('');
          setStatusFilter('');
          setBalanceFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredTenants} loading={isLoading} error={error ? error.message : null} />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Tenant"
        description="Are you sure you want to delete this tenant record? This action is irreversible."
        confirmText="Delete Tenant"
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default TenantsPage;
