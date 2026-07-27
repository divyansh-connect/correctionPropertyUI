import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Loader2 } from 'lucide-react';

interface RequestFormValues {
  propertyId: string;
  unitId: string;
  tenantName: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;
  preferredTime: string;
  permissionToEnter: boolean;
  notes?: string;
}

export const NewRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Queries
  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.property.getAll() });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: () => api.unit.getAll() });

  const { register, handleSubmit, formState: { errors } } = useForm<RequestFormValues>({
    defaultValues: {
      priority: 'Medium',
      permissionToEnter: true,
      category: 'General',
    }
  });

  const createMutation = useMutation({
    mutationFn: (values: RequestFormValues) => {
      const prop = properties.find((p) => p.id === values.propertyId);
      const unit = units.find((u) => u.id === values.unitId);
      const title = values.description
        ? values.description.slice(0, 40) + (values.description.length > 40 ? '...' : '')
        : `${values.category} Service Request`;
      return api.serviceRequests.create({
        ...values,
        title,
        propertyName: prop ? prop.name : 'Property Location',
        unitNumber: unit ? unit.unitNumber : '101',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-requests-list'] });
      navigate({ to: '/maintenance/requests' });
    },
  });

  const onSubmit = (data: RequestFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl text-foreground">
      <PageHeader
        title="Submit Maintenance Ticket"
        description="Record resident reported issues, HVAC failures, or common area diagnostics."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Requests', href: '/maintenance/requests' },
          { label: 'New Request' },
        ]}
      />

      <Card className="p-6 border bg-card mt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property Portfolio</label>
              <Select {...register('propertyId', { required: 'Property required' })}>
                <option value="">Select Property...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
              {errors.propertyId && <p className="text-rose-500">{errors.propertyId.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Unit</label>
              <Select {...register('unitId', { required: 'Unit required' })}>
                <option value="">Select Unit...</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>Unit {u.unitNumber}</option>
                ))}
              </Select>
              {errors.unitId && <p className="text-rose-500">{errors.unitId.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Resident Payee Name</label>
            <Input placeholder="Resident contact name..." {...register('tenantName', { required: 'Resident name required' })} />
            {errors.tenantName && <p className="text-rose-500">{errors.tenantName.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Issue Category</label>
              <Select {...register('category')}>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="HVAC">HVAC</option>
                <option value="Appliance">Appliance Repair</option>
                <option value="Roofing">Roofing</option>
                <option value="Structural">Structural</option>
                <option value="Landscaping">Landscaping</option>
                <option value="Pest Control">Pest Control</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Security">Security</option>
                <option value="General">General Repairs</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Priority Bracket</label>
              <Select {...register('priority')}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent / Emergency</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Description of Issue</label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-lg border border-border bg-card text-foreground"
              placeholder="Describe the issue, leak rates, or equipment behaviors..."
              {...register('description', { required: 'Description required' })}
            />
            {errors.description && <p className="text-rose-500">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Preferred Visit Time</label>
              <Input type="text" placeholder="E.g., Morning 8 AM - 12 PM" {...register('preferredTime')} />
            </div>
            
            <div className="flex items-center space-x-2 pt-5">
              <input type="checkbox" id="enter-check" {...register('permissionToEnter')} />
              <label htmlFor="enter-check" className="text-xs font-bold text-muted-foreground uppercase cursor-pointer">
                Permission to Enter Unit
              </label>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Diagnostic Notes (Internal Only)</label>
            <Input placeholder="Internal contractor notes..." {...register('notes')} />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => navigate({ to: '/maintenance/requests' })}>Cancel</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Submit Request
            </Button>
          </div>

        </form>
      </Card>
    </div>
  );
};
export default NewRequestPage;
