import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

const tenantFormSchema = zod.object({
  firstName: zod.string().min(1, 'First Name is required'),
  lastName: zod.string().min(1, 'Last Name is required'),
  email: zod.string().email('Invalid email address'),
  phone: zod.string().min(1, 'Phone is required'),
  status: zod.enum(['Active', 'Inactive', 'Pending']),
});

type TenantFormInputs = zod.infer<typeof tenantFormSchema>;

export const EditTenantPage: React.FC = () => {
  const { id } = useParams({ from: '/tenants/$id/edit' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Fetch Tenant
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => api.tenant.getById(id),
  });

  const updateMutation = useMutation({
    mutationFn: (values: TenantFormInputs) => api.tenant.update(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant', id] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/tenants' }), 2000);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormInputs>({
    resolver: zodResolver(tenantFormSchema),
    values: tenant, // dynamically load queried data
  });

  const onSubmit = (values: TenantFormInputs) => {
    updateMutation.mutate(values);
  };

  if (isLoading || !tenant) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Edit Tenant"
        description="Update profile coordinates and active residency statuses."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Tenants', href: '/tenants' },
          { label: 'Edit Tenant' },
        ]}
      />

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          Tenant updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm text-foreground">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">First Name</label>
            <Input {...register('firstName')} />
            {errors.firstName && <p className="text-rose-500 text-xs">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Last Name</label>
            <Input {...register('lastName')} />
            {errors.lastName && <p className="text-rose-500 text-xs">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
            <Input type="email" {...register('email')} />
            {errors.email && <p className="text-rose-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Mobile Phone</label>
            <Input {...register('phone')} />
            {errors.phone && <p className="text-rose-500 text-xs">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Residency Status</label>
          <Select {...register('status')}>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: '/tenants' })} className="flex items-center gap-1">
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
export default EditTenantPage;
