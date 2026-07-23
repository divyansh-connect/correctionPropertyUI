import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { Unit } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Eye, UserPlus, Key, RefreshCw, Trash2, Edit, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from '@tanstack/react-router';

export const UnitsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState('');

  // Assign tenant modal state
  const [assignUnitId, setAssignUnitId] = useState<string | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  
  // Change status modal state
  const [statusUnitId, setStatusUnitId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>('Vacant');

  // Queries
  const { data: units = [], isLoading, error } = useQuery({
    queryKey: ['units'],
    queryFn: () => api.unit.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => api.building.getAll(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.tenant.getAll(),
  });

  // Mutations
  const assignMutation = useMutation({
    mutationFn: ({ unitId, tenantId }: { unitId: string; tenantId: string }) => {
      const tenantObj = tenants.find((t) => t.id === tenantId);
      const name = tenantObj ? `${tenantObj.firstName} ${tenantObj.lastName}` : 'Tenant';
      return api.unit.assignTenant(unitId, tenantId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setAssignUnitId(null);
      setSelectedTenantId('');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ unitId, status }: { unitId: string; status: any }) =>
      api.unit.update(unitId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setStatusUnitId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.unit.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
  });

  // Filter logic
  const filteredUnits = units.filter((unit) => {
    const matchesSearch =
      unit.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProp = propertyFilter === '' || unit.propertyId === propertyFilter;
    const matchesBld = buildingFilter === '' || unit.buildingId === buildingFilter;
    const matchesStatus = statusFilter === '' || unit.status === statusFilter;
    const matchesBeds = bedroomsFilter === '' || unit.bedrooms === Number(bedroomsFilter);
    return matchesSearch && matchesProp && matchesBld && matchesStatus && matchesBeds;
  });

  const columns: ColumnDef<Unit>[] = [
    {
      accessorKey: 'unitNumber',
      header: 'Unit #',
      id: 'unitNumber',
      cell: ({ row }) => (
        <span
          className="font-bold text-primary hover:underline cursor-pointer"
          onClick={() => navigate({ to: `/properties/units/${row.original.id}` })} // matching the routed parameter later
        >
          {row.original.unitNumber}
        </span>
      ),
    },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'buildingName', header: 'Building', id: 'building', cell: ({ row }) => row.original.buildingName || 'N/A' },
    { accessorKey: 'floor', header: 'Floor', id: 'floor' },
    { accessorKey: 'bedrooms', header: 'Beds', id: 'bedrooms' },
    { accessorKey: 'bathrooms', header: 'Baths', id: 'bathrooms' },
    { accessorKey: 'squareFootage', header: 'Sqft', id: 'squareFootage' },
    {
      accessorKey: 'rentAmount',
      header: 'Rent',
      id: 'rent',
      cell: ({ row }) => <span>${row.original.rentAmount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'tenantName',
      header: 'Tenant',
      id: 'tenant',
      cell: ({ row }) => row.original.tenantName || <span className="text-muted-foreground italic text-xs">Vacant</span>,
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
            onClick={() => navigate({ to: `/properties/units/${row.original.id}` })}
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status !== 'Occupied' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAssignUnitId(row.original.id)}
              title="Assign Tenant"
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setStatusUnitId(row.original.id);
              setSelectedStatus(row.original.status);
            }}
            title="Change Status"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(row.original.id)}
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
        title="Units"
        description="Verify layout square footage, occupancy levels, and monthly rent logs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: 'Units' },
        ]}
        action={{
          label: 'Add Unit',
          onClick: () => navigate({ to: '/properties/units/new' }), // matching routes
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by unit # or property..."
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
              { label: 'Occupied', value: 'Occupied' },
              { label: 'Vacant', value: 'Vacant' },
              { label: 'Reserved', value: 'Reserved' },
              { label: 'Under Maintenance', value: 'Under Maintenance' },
            ],
          },
          {
            key: 'bedrooms',
            value: bedroomsFilter,
            placeholder: 'Bedrooms',
            options: [
              { label: '1 Bed', value: '1' },
              { label: '2 Bed', value: '2' },
              { label: '3 Bed', value: '3' },
              { label: '4 Bed', value: '4' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'property') {
            setPropertyFilter(val);
            setBuildingFilter('');
          }
          if (key === 'status') setStatusFilter(val);
          if (key === 'bedrooms') setBedroomsFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPropertyFilter('');
          setBuildingFilter('');
          setStatusFilter('');
          setBedroomsFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredUnits} loading={isLoading} error={error ? error.message : null} />

      {/* ASSIGN TENANT MODAL */}
      <FormDialog
        open={!!assignUnitId}
        onOpenChange={(open) => !open && setAssignUnitId(null)}
        title="Assign Tenant to Unit"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground">Select an active/pending tenant to move into this unit.</p>
          <Select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)}>
            <option value="">Select Tenant...</option>
            {tenants.filter(t => t.status !== 'Active').map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName} ({t.status})
              </option>
            ))}
          </Select>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setAssignUnitId(null)}>Cancel</Button>
            <Button 
              onClick={() => assignUnitId && selectedTenantId && assignMutation.mutate({ unitId: assignUnitId, tenantId: selectedTenantId })}
              disabled={assignMutation.isPending || !selectedTenantId}
            >
              {assignMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Assign Tenant
            </Button>
          </div>
        </div>
      </FormDialog>

      {/* CHANGE STATUS MODAL */}
      <FormDialog
        open={!!statusUnitId}
        onOpenChange={(open) => !open && setStatusUnitId(null)}
        title="Change Unit Status"
      >
        <div className="space-y-4 pt-2">
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)}>
            <option value="Vacant">Vacant</option>
            <option value="Occupied">Occupied</option>
            <option value="Reserved">Reserved</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </Select>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setStatusUnitId(null)}>Cancel</Button>
            <Button
              onClick={() => statusUnitId && statusMutation.mutate({ unitId: statusUnitId, status: selectedStatus })}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Update Status
            </Button>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};
export default UnitsPage;
