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
import { CurrencyInput } from '../../components/Phase4Components';
import { Loader2, ArrowLeft } from 'lucide-react';

const payFormSchema = zod.object({
  tenantId: zod.string().min(1, 'Tenant is required'),
  amount: zod.number().min(1, 'Amount must be positive'),
  dueDate: zod.string().min(1, 'Due Date is required'),
  paidDate: zod.string().min(1, 'Payment Date is required'),
  paymentMethod: zod.enum(['ACH', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cash', 'Check', 'Money Order']),
  referenceNumber: zod.string().optional(),
  
  allocRent: zod.number().min(0),
  allocUtilities: zod.number().min(0),
  allocParking: zod.number().min(0),
  allocPet: zod.number().min(0),
  notes: zod.string().optional(),
});

type PayFormInputs = zod.infer<typeof payFormSchema>;

export const NewPaymentPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Queries
  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.tenant.getAll() });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: () => api.unit.getAll() });

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PayFormInputs>({
    resolver: zodResolver(payFormSchema),
    defaultValues: {
      amount: 1500,
      paymentMethod: 'ACH',
      paidDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      allocRent: 1400,
      allocUtilities: 100,
      allocParking: 0,
      allocPet: 0,
    },
  });

  const selectedTenantId = watch('tenantId');
  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
  const selectedUnit = selectedTenant ? units.find((u) => u.id === selectedTenant.unitId) : null;

  const recordMutation = useMutation({
    mutationFn: (values: PayFormInputs) => {
      return api.payments.create({
        tenantId: values.tenantId,
        tenantName: selectedTenant ? `${selectedTenant.firstName} ${selectedTenant.lastName}` : 'Tenant',
        propertyId: selectedUnit ? selectedUnit.propertyId : 'prop-1',
        propertyName: selectedUnit ? selectedUnit.propertyName : 'Property',
        unitId: selectedUnit ? selectedUnit.id : 'unit-1',
        unitNumber: selectedUnit ? selectedUnit.unitNumber : '101',
        amount: values.amount,
        dueDate: values.dueDate,
        paidDate: values.paidDate,
        paymentMethod: values.paymentMethod,
        referenceNumber: values.referenceNumber || `MAN-${Date.now()}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/payments' }), 2000);
    },
  });

  const onSubmit = (values: PayFormInputs) => {
    recordMutation.mutate(values);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Record Payment Receipt"
        description="Log offline checks, cash, or credit transactions directly into the resident ledger."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Payments', href: '/payments' },
          { label: 'Record Payment' },
        ]}
      />

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          Payment logged successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm text-foreground">
        
        {/* --- SECTION 1: TENANT SELECT --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Resident Account</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Tenant</label>
              <Select {...register('tenantId')}>
                <option value="">Select Resident...</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} ({t.propertyName ? `${t.propertyName} - Unit ${t.unitNumber}` : 'No Unit'})
                  </option>
                ))}
              </Select>
              {errors.tenantId && <p className="text-rose-500 text-xs">{errors.tenantId.message}</p>}
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Unit Location</label>
              <Input
                value={selectedUnit ? `${selectedUnit.propertyName} • Unit ${selectedUnit.unitNumber}` : 'Unassigned'}
                disabled
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: PAYMENT DETAILS --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Payment Parameters</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <CurrencyInput
              label="Payment Amount ($)"
              {...register('amount', { valueAsNumber: true })}
              error={errors.amount?.message}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Channel</label>
              <Select {...register('paymentMethod')}>
                <option value="ACH">ACH Direct</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Bank Transfer">Bank Wire</option>
                <option value="Check">Check</option>
                <option value="Cash">Cash</option>
                <option value="Money Order">Money Order</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Payment Date</label>
              <Input type="date" {...register('paidDate')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Due Date Reference</label>
              <Input type="date" {...register('dueDate')} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Reference Number</label>
              <Input placeholder="Check # / Wire ID" {...register('referenceNumber')} />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: ALLOCATIONS --- */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase border-b pb-2">Billing Allocations</h3>
          <div className="grid grid-cols-4 gap-4">
            <CurrencyInput label="Rent ($)" {...register('allocRent', { valueAsNumber: true })} />
            <CurrencyInput label="Utilities ($)" {...register('allocUtilities', { valueAsNumber: true })} />
            <CurrencyInput label="Parking ($)" {...register('allocParking', { valueAsNumber: true })} />
            <CurrencyInput label="Pet Fee ($)" {...register('allocPet', { valueAsNumber: true })} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Transaction Notes</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 text-foreground"
            placeholder="Add receipt notes..."
            {...register('notes')}
          />
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button type="button" variant="ghost" onClick={() => navigate({ to: '/payments' })} className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Button>
          <Button type="submit" disabled={recordMutation.isPending}>
            {recordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Record Payment Receipt
          </Button>
        </div>

      </form>
    </div>
  );
};
export default NewPaymentPage;
