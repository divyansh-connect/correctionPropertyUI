import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';

const unitFormSchema = zod.object({
  propertyId: zod.string().min(1, 'Property is required'),
  buildingId: zod.string().optional(),
  unitNumber: zod.string().min(1, 'Unit Number is required'),
  floor: zod.number().min(1, 'Floor must be at least 1'),
  bedrooms: zod.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: zod.number().min(0, 'Bathrooms must be non-negative'),
  squareFootage: zod.number().min(1, 'Square footage must be positive'),
  rentAmount: zod.number().min(1, 'Rent Amount must be positive'),
  securityDeposit: zod.number().min(0, 'Security Deposit must be non-negative'),
  availabilityDate: zod.string().min(1, 'Availability Date is required'),
  status: zod.enum(['Occupied', 'Vacant', 'Reserved', 'Under Maintenance']),
});

type UnitFormInputs = zod.infer<typeof unitFormSchema>;

export const NewUnitPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Queries
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => api.building.getAll(),
  });

  const { watch, register, handleSubmit, formState: { errors } } = useForm<UnitFormInputs>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      floor: 1,
      bedrooms: 2,
      bathrooms: 2,
      squareFootage: 850,
      rentAmount: 1500,
      securityDeposit: 1500,
      status: 'Vacant',
      availabilityDate: new Date().toISOString().split('T')[0],
    },
  });

  const selectedPropertyId = watch('propertyId');
  const filteredBuildings = buildings.filter((b) => b.propertyId === selectedPropertyId);

  const createMutation = useMutation({
    mutationFn: (values: UnitFormInputs) => {
      const propObj = properties.find((p) => p.id === values.propertyId);
      const bldObj = buildings.find((b) => b.id === values.buildingId);
      return api.unit.create({
        ...values,
        propertyName: propObj ? propObj.name : 'Unknown Property',
        buildingName: bldObj ? bldObj.name : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/units' }), 2000);
    },
  });

  const onSubmit = (values: UnitFormInputs) => {
    createMutation.mutate(values);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Add Unit"
        description="Register a new rentable unit layout to a property building."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: 'Units', href: '/units' },
          { label: 'Add Unit' },
        ]}
      />

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          Unit created successfully! Redirecting back...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm text-foreground">
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Property</label>
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
            <label className="text-xs font-bold text-muted-foreground uppercase">Building (Optional)</label>
            <Select {...register('buildingId')} disabled={!selectedPropertyId}>
              <option value="">Select Building...</option>
              {filteredBuildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Unit Number</label>
            <Input placeholder="Suite B / 204" {...register('unitNumber')} />
            {errors.unitNumber && <p className="text-rose-500 text-xs">{errors.unitNumber.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Floor</label>
            <Input type="number" {...register('floor', { valueAsNumber: true })} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Square Footage</label>
            <Input type="number" {...register('squareFootage', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Bedrooms</label>
            <Input type="number" {...register('bedrooms', { valueAsNumber: true })} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Bathrooms</label>
            <Input type="number" step="0.5" {...register('bathrooms', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Monthly Rent ($)</label>
            <Input type="number" {...register('rentAmount', { valueAsNumber: true })} />
            {errors.rentAmount && <p className="text-rose-500 text-xs">{errors.rentAmount.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Security Deposit ($)</label>
            <Input type="number" {...register('securityDeposit', { valueAsNumber: true })} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Availability Date</label>
            <Input type="date" {...register('availabilityDate')} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Initial Status</label>
            <Select {...register('status')}>
              <option value="Vacant">Vacant</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: '/units' })}
            className="flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>

          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save Unit
          </Button>
        </div>

      </form>
    </div>
  );
};
export default NewUnitPage;
