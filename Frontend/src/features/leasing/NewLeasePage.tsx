import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { ApplicationStepper } from '../../components/ApplicationStepper';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { FileUploader } from '../../components/FileUploader';
import { Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const leaseWizardSchema = zod.object({
  propertyId: zod.string().min(1, 'Property is required'),
  unitId: zod.string().min(1, 'Unit is required'),
  tenantId: zod.string().min(1, 'Tenant selection is required'),
  
  startDate: zod.string().min(1, 'Start Date is required'),
  endDate: zod.string().min(1, 'End Date is required'),
  rentAmount: zod.number().min(1, 'Rent must be positive'),
  depositAmount: zod.number().min(0, 'Deposit must be non-negative'),
  dueDate: zod.number().min(1).max(31),
  lateFee: zod.number().min(0),
  gracePeriod: zod.number().min(0),
  leaseType: zod.enum(['Fixed Term', 'Month to Month']),
  utilitiesIncluded: zod.string().optional(),
  parking: zod.string().optional(),
  storage: zod.string().optional(),
  signatureInitials: zod.string().min(2, 'Initials are required for digital signoff'),
});

type LeaseWizardInputs = zod.infer<typeof leaseWizardSchema>;

export const NewLeasePage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Queries
  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.property.getAll() });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: () => api.unit.getAll() });
  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.tenant.getAll() });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaseWizardInputs>({
    resolver: zodResolver(leaseWizardSchema),
    defaultValues: {
      leaseType: 'Fixed Term',
      dueDate: 1,
      lateFee: 50,
      gracePeriod: 5,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      rentAmount: 1500,
      depositAmount: 1500,
    },
  });

  const selectedPropertyId = watch('propertyId');
  const selectedUnitId = watch('unitId');
  const selectedTenantId = watch('tenantId');

  // Filter vacant units of selected property
  const vacantUnits = units.filter((u) => u.propertyId === selectedPropertyId && u.status === 'Vacant');

  const createMutation = useMutation({
    mutationFn: (values: LeaseWizardInputs) => {
      const ten = tenants.find((t) => t.id === values.tenantId);
      const prop = properties.find((p) => p.id === values.propertyId);
      const uni = units.find((u) => u.id === values.unitId);

      return api.leasing.createLease({
        tenantId: values.tenantId,
        tenantName: ten ? `${ten.firstName} ${ten.lastName}` : 'Resident',
        propertyId: values.propertyId,
        propertyName: prop ? prop.name : 'Property',
        unitId: values.unitId,
        unitNumber: uni ? uni.unitNumber : 'Unit',
        startDate: values.startDate,
        endDate: values.endDate,
        rentAmount: values.rentAmount,
        depositAmount: values.depositAmount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      setSuccess(true);
      setTimeout(() => navigate({ to: '/leasing/leases' }), 2000);
    },
  });

  // Steps Labels
  const steps = ['Select Asset', 'Select Unit', 'Assign Tenant', 'Terms', 'Documents', 'Sign & Review'];

  const handleNext = () => {
    // Basic step validation override (simulated checks before final submit)
    if (step === 0 && !selectedPropertyId) return;
    if (step === 1 && !selectedUnitId) return;
    if (step === 2 && !selectedTenantId) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFinalSubmit = (values: LeaseWizardInputs) => {
    createMutation.mutate(values);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Create Lease Agreement"
        description="Wizard to set up rental terms, security deposits, and digital signoffs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Leasing', href: '/leasing/leases' },
          { label: 'New Lease' },
        ]}
      />

      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm text-foreground">
        <ApplicationStepper steps={steps} currentStep={step} />

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold my-6">
            Lease Agreement created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-6 pt-6 mt-6 border-t">
          {/* STEP 0: SELECT PROPERTY */}
          {step === 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Step 1: Select Property Asset</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Property</label>
                <Select {...register('propertyId')}>
                  <option value="">Select Property...</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </Select>
                {errors.propertyId && <p className="text-rose-500 text-xs">{errors.propertyId.message}</p>}
              </div>
            </div>
          )}

          {/* STEP 1: SELECT UNIT */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Step 2: Select Rentable Unit</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Available Unit</label>
                <Select {...register('unitId')}>
                  <option value="">Select Unit...</option>
                  {vacantUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber} - Floor {u.floor} ({u.bedrooms}B / {u.bathrooms}Ba - ${u.rentAmount}/mo)
                    </option>
                  ))}
                </Select>
                {errors.unitId && <p className="text-rose-500 text-xs">{errors.unitId.message}</p>}
                {vacantUnits.length === 0 && selectedPropertyId && (
                  <p className="text-amber-500 text-xs mt-2 font-semibold">No vacant units available for this property asset.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT TENANT */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Step 3: Select Resident Profile</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Resident / Applicant</label>
                <Select {...register('tenantId')}>
                  <option value="">Select Tenant...</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.email})</option>
                  ))}
                </Select>
                {errors.tenantId && <p className="text-rose-500 text-xs">{errors.tenantId.message}</p>}
              </div>
            </div>
          )}

          {/* STEP 3: LEASE TERMS */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Step 4: Stipulate Lease Terms</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Lease Start Date</label>
                  <Input type="date" {...register('startDate')} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Lease End Date</label>
                  <Input type="date" {...register('endDate')} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Monthly Rent Amount ($)</label>
                  <Input type="number" {...register('rentAmount', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Security Deposit ($)</label>
                  <Input type="number" {...register('depositAmount', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Lease Contract Type</label>
                  <Select {...register('leaseType')}>
                    <option value="Fixed Term">Fixed Term</option>
                    <option value="Month to Month">Month to Month</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Due Date (Day of Month)</label>
                  <Input type="number" {...register('dueDate', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Late Fee ($)</label>
                  <Input type="number" {...register('lateFee', { valueAsNumber: true })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Grace Period (Days)</label>
                  <Input type="number" {...register('gracePeriod', { valueAsNumber: true })} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DOCUMENTS */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Step 5: Attach Legal Documentation</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Standard Lease Template (PDF)</label>
                <div className="p-4 border rounded-xl flex items-center justify-between text-xs font-bold bg-secondary/20">
                  <span>Standard_Residential_Lease_Agreement_2026.pdf</span>
                  <Button type="button" variant="outline" size="sm">Download Template</Button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Addendum / Rider Uploads</label>
                <FileUploader />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SIGN */}
          {step === 5 && (
            <div className="space-y-6">
              <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Step 6: Digital Signature & Verification</h3>
              <div className="space-y-4 bg-secondary/10 p-5 rounded-xl border border-dashed text-xs">
                <h4 className="font-extrabold text-sm uppercase tracking-wide">Lease Agreement Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Property Asset:</strong> {properties.find(p => p.id === selectedPropertyId)?.name}</p>
                  <p><strong>Resident:</strong> {tenants.find(t => t.id === selectedTenantId)?.firstName} {tenants.find(t => t.id === selectedTenantId)?.lastName}</p>
                  <p><strong>Stipulated Rent:</strong> ${watch('rentAmount')}/mo</p>
                  <p><strong>Security Deposit:</strong> ${watch('depositAmount')}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Type Initials to Digital Sign (e.g. JD)</label>
                <Input placeholder="JD" {...register('signatureInitials')} />
                {errors.signatureInitials && <p className="text-rose-500 text-xs">{errors.signatureInitials.message}</p>}
              </div>
            </div>
          )}

          {/* WIZARD ACTIONS FOOTER */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              disabled={step === 0}
              className="flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            {step < steps.length - 1 ? (
              <Button type="button" onClick={handleNext} className="flex items-center gap-1">
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Sign & Finalize Lease
              </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
export default NewLeasePage;
