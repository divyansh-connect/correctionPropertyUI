import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { AddressForm } from '../../components/AddressForm';
import { FileUploader } from '../../components/FileUploader';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';

const propertyFormSchema = zod.object({
  name: zod.string().min(1, 'Property Name is required'),
  type: zod.enum(['Apartment', 'Commercial', 'Single Family', 'Multi Family', 'HOA']),
  status: zod.enum(['Active', 'Inactive', 'Under Review', 'Archived']),
  
  streetAddress: zod.string().min(1, 'Street Address is required'),
  city: zod.string().min(1, 'City is required'),
  state: zod.string().min(2, 'State is required'),
  country: zod.string().min(1, 'Country is required'),
  zip: zod.string().min(5, 'ZIP Code is required'),
  
  owner: zod.string().min(1, 'Owner is required'),
  ownershipPercentage: zod.number().min(1).max(100),
  managementCompany: zod.string().min(1, 'Management Company is required'),
  
  yearBuilt: zod.number().min(1700).max(new Date().getFullYear()),
  totalBuildings: zod.number().min(1),
  totalUnits: zod.number().min(0),
  squareFootage: zod.number().min(1),
  
  purchasePrice: zod.number().min(0),
  currentValue: zod.number().min(0),
  monthlyExpenses: zod.number().min(0),
});

type PropertyFormInputs = zod.infer<typeof propertyFormSchema>;

export const NewPropertyPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Query owners to select one
  const { data: owners = [] } = useQuery({
    queryKey: ['owners'],
    queryFn: () => api.owner.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (values: PropertyFormInputs) => {
      return api.property.create({
        name: values.name,
        type: values.type,
        status: values.status,
        owner: values.owner,
        ownershipPercentage: values.ownershipPercentage,
        managementCompany: values.managementCompany,
        address: `${values.streetAddress}, ${values.city}, ${values.state}, ${values.country}, ${values.zip}`,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        country: values.country,
        zip: values.zip,
        yearBuilt: values.yearBuilt,
        totalBuildings: values.totalBuildings,
        squareFootage: values.squareFootage,
        purchasePrice: values.purchasePrice,
        currentValue: values.currentValue,
        monthlyExpenses: values.monthlyExpenses,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/properties' }), 2000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormInputs>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      type: 'Apartment',
      status: 'Active',
      ownershipPercentage: 100,
      managementCompany: 'Apex Property Management',
      yearBuilt: 2010,
      totalBuildings: 1,
      totalUnits: 10,
      squareFootage: 8500,
      purchasePrice: 2000000,
      currentValue: 2200000,
      monthlyExpenses: 4500,
    },
  });

  const onSubmit = (values: PropertyFormInputs) => {
    createMutation.mutate(values);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Add Property"
        description="Register a new property asset in your management ledger."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Properties', href: '/properties' },
          { label: 'Add Property' },
        ]}
      />

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6 animate-fade-in">
          Property created successfully! Redirecting back to portfolio...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card border border-border p-6 rounded-2xl shadow-sm text-foreground">
        
        {/* --- SECTION 1: BASIC INFORMATION --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property Name</label>
              <Input placeholder="Oakridge Heights" {...register('name')} />
              {errors.name && <p className="text-rose-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property Type</label>
              <Select {...register('type')}>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
                <option value="Single Family">Single Family</option>
                <option value="Multi Family">Multi Family</option>
                <option value="HOA">HOA</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Initial Status</label>
              <Select {...register('status')}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Review">Under Review</option>
                <option value="Archived">Archived</option>
              </Select>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: ADDRESS (REUSABLE) --- */}
        <AddressForm register={register} errors={errors} />

        {/* --- SECTION 3: OWNERSHIP --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Ownership Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Owner</label>
              <Select {...register('owner')}>
                <option value="">Select Owner...</option>
                {owners.map((o) => (
                  <option key={o.id} value={`${o.firstName} ${o.lastName}`}>
                    {o.firstName} {o.lastName}
                  </option>
                ))}
              </Select>
              {errors.owner && <p className="text-rose-500 text-xs">{errors.owner.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Ownership Percentage (%)</label>
              <Input type="number" {...register('ownershipPercentage', { valueAsNumber: true })} />
              {errors.ownershipPercentage && <p className="text-rose-500 text-xs">{errors.ownershipPercentage.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Management Company</label>
              <Input {...register('managementCompany')} />
              {errors.managementCompany && <p className="text-rose-500 text-xs">{errors.managementCompany.message}</p>}
            </div>
          </div>
        </div>

        {/* --- SECTION 4: PROPERTY DETAILS --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Property Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Year Built</label>
              <Input type="number" {...register('yearBuilt', { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Total Buildings</label>
              <Input type="number" {...register('totalBuildings', { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Total Units</label>
              <Input type="number" {...register('totalUnits', { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Square Footage</label>
              <Input type="number" {...register('squareFootage', { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        {/* --- SECTION 5: FINANCIAL INFORMATION --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Financial Valuation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Purchase Price ($)</label>
              <Input type="number" {...register('purchasePrice', { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Current Value ($)</label>
              <Input type="number" {...register('currentValue', { valueAsNumber: true })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Monthly Expenses ($)</label>
              <Input type="number" {...register('monthlyExpenses', { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        {/* --- SECTION 6: MEDIA --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Media & Attachments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property Photos</label>
              <FileUploader onFileSelect={(file) => setPhotos((prev) => [...prev, file.name])} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property Documents</label>
              <FileUploader />
            </div>
          </div>
        </div>

        {/* --- FOOTER BUTTONS --- */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: '/properties' })}
            className="flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancel
          </Button>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/properties' })}>
              Save Draft
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Create Property
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
};
export default NewPropertyPage;
