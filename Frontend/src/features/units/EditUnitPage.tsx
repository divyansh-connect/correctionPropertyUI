import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { mapBackendErrors } from '../../utils/errorMapping';

const unitFormSchema = zod.object({
  propertyId: zod.string().min(1, 'Property is required'),
  buildingId: zod.string().optional(),
  unitNumber: zod.string().min(1, 'Unit Number is required'),
  floor: zod.number().min(1, 'Floor must be at least 1'),
  bedrooms: zod.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: zod.number().min(0, 'Bathrooms must be non-negative'),
  squareFootage: zod.number().min(1, 'Square footage must be positive'),
  rentAmount: zod.number().min(0, 'Rent Amount must be non-negative'),
  securityDeposit: zod.number().min(0, 'Security Deposit must be non-negative'),
  availabilityDate: zod.string().min(1, 'Availability Date is required'),
  status: zod.enum(['Occupied', 'Vacant', 'Reserved', 'Under Maintenance']),
});

type UnitFormInputs = zod.infer<typeof unitFormSchema>;

export const EditUnitPage: React.FC = () => {
  const { id } = useParams({ from: '/properties/units/$id/edit' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Fetch Unit
  const { data: unit, isLoading: loadingUnit } = useQuery({
    queryKey: ['unit', id],
    queryFn: () => api.unit.getById(id),
  });

  // Queries for Select Options
  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const { data: buildings = [] } = useQuery({
    queryKey: ['buildings'],
    queryFn: () => api.building.getAll(),
  });

  const updateMutation = useMutation({
    mutationFn: (values: UnitFormInputs) => {
      const propObj = properties.find((p) => p.id === values.propertyId);
      const bldObj = buildings.find((b) => b.id === values.buildingId);
      return api.unit.update(id, {
        ...values,
        propertyName: propObj ? propObj.name : undefined,
        buildingName: bldObj ? bldObj.name : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit', id] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/units' }), 2000);
    },
    onError: (err: any) => {
      mapBackendErrors(err, setError);
    }
  });

  const { watch, register, handleSubmit, setError, formState: { errors } } = useForm<UnitFormInputs>({
    resolver: zodResolver(unitFormSchema),
    values: unit ? {
      propertyId: unit.propertyId || '',
      buildingId: unit.buildingId || '',
      unitNumber: unit.unitNumber || '',
      floor: Number(unit.floor) || 1,
      bedrooms: Number(unit.bedrooms) || 0,
      bathrooms: Number(unit.bathrooms) || 1,
      squareFootage: Number(unit.squareFootage) || 0,
      rentAmount: Number(unit.rentAmount) || 0,
      securityDeposit: Number(unit.securityDeposit) || 0,
      availabilityDate: unit.availabilityDate ? (unit.availabilityDate.includes('T') ? unit.availabilityDate.split('T')[0] : unit.availabilityDate) : '',
      status: unit.status || 'Vacant',
    } : undefined,
  });

  const selectedPropertyId = watch('propertyId');
  const filteredBuildings = buildings.filter((b) => b.propertyId === selectedPropertyId);

  const onSubmit = (values: UnitFormInputs) => {
    updateMutation.mutate(values);
  };

  if (loadingUnit || !unit) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Edit Unit"
        description="Update unit parameters, rent amount, layout specs and occupancy status."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: 'Units', href: '/units' },
          { label: 'Edit Unit' },
        ]}
      />

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          Unit updated successfully! Redirecting...
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
            <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
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
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Button>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </div>

      </form>
    </div>
  );
};

export default EditUnitPage;
