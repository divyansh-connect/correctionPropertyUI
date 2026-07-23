import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Plus, X, Loader2, Edit2, Trash2, Eye } from 'lucide-react';
import api from '../../api';
import { Owner } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

const ownerFormSchema = zod.object({
  firstName: zod.string().min(1, 'First Name is required'),
  lastName: zod.string().min(1, 'Last Name is required'),
  email: zod.string().email('Invalid email address'),
  phone: zod.string().min(10, 'Phone number must be at least 10 digits'),
  payoutMethod: zod.enum(['ACH/Direct Deposit', 'Wire Transfer', 'Check']),
});

type OwnerFormInputs = zod.infer<typeof ownerFormSchema>;

export const OwnersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [viewingOwner, setViewingOwner] = useState<Owner | null>(null);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  const { data: owners = [], isLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: () => api.owner.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OwnerFormInputs>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      payoutMethod: 'ACH/Direct Deposit',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: any) => {
      return api.owner.create(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsModalOpen(false);
      setSelectedProperties([]);
      reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return api.owner.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setIsModalOpen(false);
      setEditingOwner(null);
      setSelectedProperties([]);
      reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return api.owner.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });

  const handleEditClick = (owner: Owner) => {
    setEditingOwner(owner);
    const owned = properties
      .filter(p => p.owner === `${owner.firstName} ${owner.lastName}`)
      .map(p => p.id);
    setSelectedProperties(owned);
    reset({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      phone: owner.phone,
      payoutMethod: owner.payoutMethod as "ACH/Direct Deposit" | "Wire Transfer" | "Check",
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this owner? This will also unassign them from any properties.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewClick = (owner: Owner) => {
    setViewingOwner(owner);
  };

  const onSubmit = (data: OwnerFormInputs) => {
    const payload = {
      ...data,
      assignedProperties: selectedProperties,
    };
    if (editingOwner) {
      updateMutation.mutate({ id: editingOwner.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const columns: ColumnDef<Owner>[] = [
    {
      accessorKey: 'firstName',
      header: 'Owner Name',
      id: 'name',
      cell: ({ row }) => (
        <span className="font-bold">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    { accessorKey: 'email', header: 'Email', id: 'email' },
    { accessorKey: 'phone', header: 'Phone', id: 'phone' },
    { accessorKey: 'propertiesOwnedCount', header: 'Properties Owned', id: 'propertiesOwnedCount' },
    { accessorKey: 'payoutMethod', header: 'Payout Method', id: 'payoutMethod' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewClick(row.original)}
            title="View Details"
          >
            <Eye className="w-4 h-4 text-emerald-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditClick(row.original)}
            title="Edit Owner"
          >
            <Edit2 className="w-4 h-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original.id)}
            title="Delete Owner"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Property Owners"
        description="Manage owner contacts, properties owned, and payout preferences."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Owners' },
        ]}
        action={{
          label: 'Add Owner',
          onClick: () => {
            setEditingOwner(null);
            setSelectedProperties([]);
            reset({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              payoutMethod: 'ACH/Direct Deposit',
            });
            setIsModalOpen(true);
          },
          icon: <Plus className="w-4 h-4" />,
        }}
      />
      <DataTable columns={columns} data={owners} loading={isLoading} />

      {/* Add / Edit Owner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 text-foreground">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-extrabold text-base">
                {editingOwner ? 'Edit Property Owner' : 'Add Property Owner'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingOwner(null);
                  setSelectedProperties([]);
                  reset();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
                  <Input
                    placeholder="e.g. Jane"
                    {...register('firstName')}
                  />
                  {errors.firstName && <p className="text-rose-500 text-xs">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
                  <Input
                    placeholder="e.g. Doe"
                    {...register('lastName')}
                  />
                  {errors.lastName && <p className="text-rose-500 text-xs">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
                <Input
                  type="email"
                  placeholder="jane.doe@example.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone</label>
                <Input
                  placeholder="(555) 555-0100"
                  {...register('phone')}
                />
                {errors.phone && <p className="text-rose-500 text-xs">{errors.phone.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Payout Method</label>
                <Select
                  {...register('payoutMethod')}
                >
                  <option value="ACH/Direct Deposit">ACH/Direct Deposit</option>
                  <option value="Wire Transfer">Wire Transfer</option>
                  <option value="Check">Check</option>
                </Select>
                {errors.payoutMethod && <p className="text-rose-500 text-xs">{errors.payoutMethod.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Assign Properties</label>
                <div className="max-h-32 overflow-y-auto border border-border rounded-lg p-2 space-y-2 bg-background">
                  {properties.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic p-1">No properties available.</p>
                  ) : (
                    properties.map(p => (
                      <label key={p.id} className="flex items-center space-x-2 text-xs font-semibold cursor-pointer text-foreground">
                        <input
                          type="checkbox"
                          value={p.id}
                          checked={selectedProperties.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProperties([...selectedProperties, p.id]);
                            } else {
                              setSelectedProperties(selectedProperties.filter(id => id !== p.id));
                            }
                          }}
                          className="rounded border-input text-primary focus:ring-primary bg-card"
                        />
                        <span>{p.name}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border/80">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingOwner(null);
                    setSelectedProperties([]);
                    reset();
                  }}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingOwner ? 'Save Changes' : 'Create Owner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Owner Details Modal */}
      {viewingOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 text-foreground animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="font-extrabold text-base">Owner Details</h3>
              <button
                onClick={() => setViewingOwner(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">First Name</span>
                  <span className="font-semibold text-foreground bg-accent/40 px-3 py-2 rounded-lg block">{viewingOwner.firstName}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Last Name</span>
                  <span className="font-semibold text-foreground bg-accent/40 px-3 py-2 rounded-lg block">{viewingOwner.lastName}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Email</span>
                <span className="font-semibold text-foreground bg-accent/40 px-3 py-2 rounded-lg block break-all">{viewingOwner.email}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Phone</span>
                <span className="font-semibold text-foreground bg-accent/40 px-3 py-2 rounded-lg block">{viewingOwner.phone}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Payout Method</span>
                <span className="font-semibold text-foreground bg-accent/40 px-3 py-2 rounded-lg block">{viewingOwner.payoutMethod}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase block mb-1">Owned Properties</span>
                <div className="border border-border rounded-lg p-3 bg-accent/20 max-h-32 overflow-y-auto">
                  {properties.filter(p => p.owner === `${viewingOwner.firstName} ${viewingOwner.lastName}`).length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">No properties assigned.</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {properties
                        .filter(p => p.owner === `${viewingOwner.firstName} ${viewingOwner.lastName}`)
                        .map(p => (
                          <span key={p.id} className="text-xs font-bold px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
                            {p.name}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/80">
              <Button onClick={() => setViewingOwner(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OwnersPage;
