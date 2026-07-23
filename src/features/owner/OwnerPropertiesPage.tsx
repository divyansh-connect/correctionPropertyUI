import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { FormDialog } from '../../components/FormDialog';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Building, MapPin, Plus, Trash2 } from 'lucide-react';

export const OwnerPropertiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  // Create Property States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [propertyRent, setPropertyRent] = useState(2400);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Queries
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['owner-properties-list'],
    queryFn: () => api.ownerProperties.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (newProp: any) => api.ownerProperties.create(newProp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-properties-list'] });
      setIsCreateOpen(false);
      setPropertyName('');
      setPropertyAddress('');
      setPropertyType('Apartment');
      setPropertyRent(2400);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.ownerProperties.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-properties-list'] });
      setDeleteId(null);
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (propertyName) {
      createMutation.mutate({
        name: propertyName,
        address: propertyAddress,
        type: propertyType,
        monthlyRent: Number(propertyRent)
      });
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="card" />;
  }

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="My Properties"
        description="Verify property allocations, addresses, current units layouts, and occupancy percentages."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'My Properties' },
        ]}
        action={{
          label: 'Add Property',
          onClick: () => setIsCreateOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <Card key={p.id} className="p-5 border bg-card flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-primary shrink-0" />
                  <h4 className="font-extrabold text-sm uppercase">{p.name}</h4>
                </div>
              </div>

              <div className="flex items-center text-xs text-muted-foreground font-semibold">
                <MapPin className="w-4 h-4 mr-1 shrink-0" />
                <span className="truncate">{p.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center bg-secondary/15 rounded-xl p-3 text-xs font-semibold">
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">Type</p>
                <p className="font-extrabold">{p.type || 'Residential'}</p>
              </div>
              <div>
                <p className="text-[9px] text-muted-foreground uppercase">Rent Cost</p>
                <p className="font-extrabold text-emerald-500">${(p as any).monthlyRent?.toLocaleString() || '2,400'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedProperty(p)} className="flex-1 text-xs font-bold uppercase">
                View Details
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleteId(p.id)} className="text-rose-500 hover:text-rose-650 hover:bg-rose-550/10 p-2 rounded-xl" title="Delete Property">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* DETAIL DIALOG */}
      <FormDialog open={!!selectedProperty} onOpenChange={(open) => !open && setSelectedProperty(null)} title="Managed Asset Profile">
        {selectedProperty && (
          <div className="space-y-6 pt-3 text-xs font-semibold text-foreground">
            <div className="flex items-center space-x-3 border-b pb-3">
              <Building className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm uppercase">{selectedProperty.name}</h4>
                <p className="text-muted-foreground mt-0.5">{selectedProperty.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Property Type</p>
                <p className="font-bold">{selectedProperty.type || 'Residential Apartment'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Operating Status</p>
                <p className="text-emerald-500 font-extrabold">Active</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>Close</Button>
            </div>
          </div>
        )}
      </FormDialog>

      {/* CREATE DIALOG */}
      <FormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} title="Add New Property">
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-3 text-xs font-semibold text-foreground">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Property Name</label>
            <Input required placeholder="E.g., Sunset Gardens" value={propertyName} onChange={e => setPropertyName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">Address</label>
            <Input required placeholder="E.g., 789 Palms Blvd, Austin, TX" value={propertyAddress} onChange={e => setPropertyAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Property Type</label>
              <Select value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
                <option value="Single Family">Single Family</option>
                <option value="Multi Family">Multi Family</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Target Monthly Rent ($)</label>
              <Input type="number" required min="0" value={propertyRent} onChange={e => setPropertyRent(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-bold">Add Property</Button>
          </div>
        </form>
      </FormDialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action is irreversible."
        confirmText="Delete Property"
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default OwnerPropertiesPage;
