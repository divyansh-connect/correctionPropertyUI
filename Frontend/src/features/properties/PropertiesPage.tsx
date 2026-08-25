import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { Property } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Trash2, Edit, Copy, Eye, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const PropertiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Query Properties
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  // Query Owners to populate filter
  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: () => api.owner.getAll(),
  });

  // Actions Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.property.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setDeleteId(null);
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (prop: Property) => {
      return api.property.create({
        name: `${prop.name} (Copy)`,
        type: prop.type,
        status: prop.status,
        owner: prop.owner,
        ownershipPercentage: prop.ownershipPercentage,
        managementCompany: prop.managementCompany,
        address: prop.address,
        streetAddress: prop.streetAddress,
        city: prop.city,
        state: prop.state,
        country: prop.country,
        zip: prop.zip,
        yearBuilt: prop.yearBuilt,
        totalBuildings: prop.totalBuildings,
        squareFootage: prop.squareFootage,
        purchasePrice: prop.purchasePrice,
        currentValue: prop.currentValue,
        monthlyExpenses: prop.monthlyExpenses,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  // Filters
  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prop.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === '' || prop.type === typeFilter;
    const matchesStatus = statusFilter === '' || prop.status === statusFilter;
    const matchesOwner = ownerFilter === '' || prop.owner === ownerFilter;
    return matchesSearch && matchesType && matchesStatus && matchesOwner;
  });

  // Export CSV mock
  const handleExport = () => {
    const headers = 'Name,Type,Status,Owner,Units,OccupancyRate,Revenue,Address\n';
    const rows = filteredProperties
      .map(
        (p) =>
          `"${p.name}","${p.type}","${p.status}","${p.owner}",${p.unitsCount},${p.occupancyRate},${p.monthlyRevenue},"${p.address}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Properties_Report.csv');
    a.click();
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: 'name',
      header: t('properties.columns.name'),
      id: 'name',
      cell: ({ row }) => (
        <span className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => navigate({ to: `/properties/${row.original.id}` })}>
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: t('properties.columns.type'),
      id: 'type',
      cell: ({ row }) => <StatusBadge status={row.original.type} />,
    },
    {
      accessorKey: 'owner',
      header: t('properties.columns.owner'),
      id: 'owner',
      cell: ({ row }) => {
        const owner = row.original.owner;
        const ownerName = owner && typeof owner === 'object' ? owner.name : (owner || 'No Owner');
        return <span className="text-muted-foreground text-xs font-semibold">{ownerName}</span>;
      },
    },
    {
      accessorKey: 'address',
      header: t('properties.columns.address'),
      id: 'address',
      cell: ({ row }) => <span className="text-muted-foreground text-xs truncate max-w-[150px] inline-block">{row.original.address}</span>,
    },
    {
      accessorKey: 'unitsCount',
      header: t('properties.columns.units'),
      id: 'units',
      cell: ({ row }) => <span>{row.original.unitsCount}</span>,
    },
    {
      accessorKey: 'occupancyRate',
      header: t('properties.columns.occupancy'),
      id: 'occupancy',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1.5">
          <span className="font-semibold text-xs">{row.original.occupancyRate}%</span>
          <div className="w-12 bg-muted rounded-full h-1 overflow-hidden">
            <div className="bg-primary h-1" style={{ width: `${row.original.occupancyRate}%` }} />
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'monthlyRevenue',
      header: t('properties.columns.revenue'),
      id: 'revenue',
      cell: ({ row }) => <span className="font-semibold text-emerald-500">${row.original.monthlyRevenue.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: t('properties.columns.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'createdAt',
      header: t('properties.columns.createdAt'),
      id: 'createdAt',
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.createdAt}</span>,
    },
    {
      id: 'actions',
      header: t('properties.columns.actions'),
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: `/properties/${row.original.id}` })}
            title={t('properties.actions.view')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: `/properties/edit`, search: { id: row.original.id } as any })}
            title={t('properties.actions.edit', 'Edit')}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title={t('properties.actions.delete')}
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
        title={t('properties.title')}
        description={t('properties.desc')}
        breadcrumbs={[
          { label: t('ai.breadcrumbs.home'), href: '/' },
          { label: t('owner.nav.properties') },
        ]}
        action={{
          label: t('properties.addProperty'),
          onClick: () => navigate({ to: '/properties/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          {t('properties.showing', { count: filteredProperties.length })}
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          {t('properties.exportCsv')}
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('properties.searchPlaceholder')}
        filters={[
          {
            key: 'type',
            value: typeFilter,
            placeholder: t('properties.typePlaceholder'),
            options: [
              { label: t('properties.types.apartment'), value: 'Apartment' },
              { label: t('properties.types.commercial'), value: 'Commercial' },
              { label: t('properties.types.singleFamily'), value: 'Single Family' },
              { label: t('properties.types.multiFamily'), value: 'Multi Family' },
              { label: t('properties.types.hoa'), value: 'HOA' },
            ],
          },
          {
            key: 'status',
            value: statusFilter,
            placeholder: t('properties.statusPlaceholder'),
            options: [
              { label: t('properties.statuses.active'), value: 'Active' },
              { label: t('properties.statuses.inactive'), value: 'Inactive' },
              { label: t('properties.statuses.underReview'), value: 'Under Review' },
              { label: t('properties.statuses.archived'), value: 'Archived' },
            ],
          },
          {
            key: 'owner',
            value: ownerFilter,
            placeholder: t('properties.ownerPlaceholder'),
            options: owners.map((o) => ({
              id: o.id,
              label: `${o.firstName} ${o.lastName}`,
              value: `${o.firstName} ${o.lastName}`,
            })),
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'type') setTypeFilter(val);
          if (key === 'status') setStatusFilter(val);
          if (key === 'owner') setOwnerFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setTypeFilter('');
          setStatusFilter('');
          setOwnerFilter('');
        }}
      />

      <DataTable
        columns={columns}
        data={filteredProperties}
        loading={isLoading}
        error={error ? error.message : null}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('properties.deleteDialog.title')}
        description={t('properties.deleteDialog.desc')}
        confirmText={t('properties.deleteDialog.confirm')}
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default PropertiesPage;
