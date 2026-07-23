import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import api from '../../api';
import { Building } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

const buildingSchema = zod.object({
  propertyId: zod.string().min(1, 'Property is required'),
  name: zod.string().min(1, 'Building Name is required'),
  floors: zod.number().min(1, 'Must have at least 1 floor'),
  unitsCount: zod.number().min(0, 'Units Count cannot be negative'),
  address: zod.string().optional(),
  status: zod.enum(['Active', 'Inactive']),
});

type BuildingFormValues = zod.infer<typeof buildingSchema>;

export const BuildingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: buildings = [], isLoading } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => api.building.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newBld: BuildingFormValues) => {
      const prop = properties.find((p) => p.id === newBld.propertyId);
      return api.building.create({
        ...newBld,
        propertyName: prop ? prop.name : 'Unknown Property',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      setIsFormOpen(false);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.building.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      setDeleteId(null);
    },
  });

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingSchema),
    defaultValues: { floors: 3, unitsCount: 12, status: 'Active' },
  });

  const onSubmit = (values: BuildingFormValues) => {
    createMutation.mutate(values);
  };

  const filteredBuildings = buildings.filter((bld) =>
    bld.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bld.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<Building>[] = [
    { accessorKey: 'name', header: 'Building Name', id: 'name', cell: ({ row }) => <span className="font-bold">{row.original.name}</span> },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'floors', header: 'Floors', id: 'floors' },
    { accessorKey: 'unitsCount', header: 'Total Units', id: 'units' },
    {
      accessorKey: 'occupancyRate',
      header: 'Occupancy',
      id: 'occupancy',
      cell: ({ row }) => <span>{row.original.occupancyRate || 0}%</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status || 'Active'} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteId(row.original.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Buildings"
        description="Verify structures, complexes, and layouts inside your properties list."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: 'Buildings' },
        ]}
        action={{
          label: 'Add Building',
          onClick: () => setIsFormOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search buildings by name or property..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredBuildings} loading={isLoading} />

      {/* ADD BUILDING DIALOG */}
      <FormDialog open={isFormOpen} onOpenChange={setIsFormOpen} title="Add New Building">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Associated Property</label>
            <Select {...register('propertyId')}>
              <option value="">Select Property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            {errors.propertyId && <p className="text-rose-500 text-xs">{errors.propertyId.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Building Name</label>
            <Input placeholder="Building B / Block C" {...register('name')} />
            {errors.name && <p className="text-rose-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Number of Floors</label>
              <Input type="number" {...register('floors', { valueAsNumber: true })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Total Units</label>
              <Input type="number" {...register('unitsCount', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Street Address</label>
            <Input placeholder="Leave blank to use property address" {...register('address')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
            <Select {...register('status')}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Building
            </Button>
          </div>
        </form>
      </FormDialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Building"
        description="Are you sure you want to delete this building? This cannot be undone."
        confirmText="Delete Building"
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default BuildingsPage;
