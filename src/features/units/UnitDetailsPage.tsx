import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { FileUploader } from '../../components/FileUploader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { FormDialog } from '../../components/FormDialog';
import { 
  Building2, Home, User, CreditCard, Wrench, FileText, ArrowLeft, 
  Plus, Upload, Loader2, Sparkles, Bed, Bath, DollarSign, Calendar 
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const UnitDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/properties/units/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [isDocOpen, setIsDocOpen] = useState(false);

  // Queries
  const { data: unit, isLoading: loadingUnit } = useQuery({
    queryKey: ['unit', id],
    queryFn: () => api.unit.getById(id),
  });

  const { data: allTenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.tenant.getAll() });
  const { data: allLeases = [] } = useQuery({ queryKey: ['leases'], queryFn: () => api.leasing.getLeases() });
  const { data: allPayments = [] } = useQuery({ queryKey: ['payments'], queryFn: () => api.rent.getAll() });
  const { data: allMaint = [] } = useQuery({ queryKey: ['maintenance-tickets'], queryFn: () => api.maintenance.getAll() });
  const { data: allDocs = [] } = useQuery({ queryKey: ['documents'], queryFn: () => api.document.getAll() });

  // Filtered lists
  const unitTenant = allTenants.find((t) => t.unitId === id);
  const unitLease = allLeases.find((l) => l.unitId === id);
  const unitPayments = allPayments.filter((p) => p.unitId === id);
  const unitMaint = allMaint.filter((m) => m.unitId === id);
  const unitDocs = allDocs.filter((d) => d.propertyId === unit?.propertyId); // fallback property-level docs

  // Mutations
  const assignMutation = useMutation({
    mutationFn: (tenantId: string) => {
      const ten = allTenants.find((t) => t.id === tenantId);
      const name = ten ? `${ten.firstName} ${ten.lastName}` : 'Tenant';
      return api.unit.assignTenant(id, tenantId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit', id] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setIsAssignOpen(false);
      setSelectedTenantId('');
    },
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      api.document.create({
        name: file.name,
        type: 'PDF',
        propertyId: unit?.propertyId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsDocOpen(false);
    },
  });

  if (loadingUnit || !unit) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Columns definition
  const payColumns: ColumnDef<any>[] = [
    { accessorKey: 'dueDate', header: 'Due Date', id: 'dueDate' },
    { accessorKey: 'amount', header: 'Amount', id: 'amount', cell: ({ row }) => <span>${row.original.amount.toLocaleString()}</span> },
    { accessorKey: 'paidDate', header: 'Paid Date', id: 'paidDate', cell: ({ row }) => row.original.paidDate || '-' },
    { accessorKey: 'status', header: 'Status', id: 'status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  const maintColumns: ColumnDef<any>[] = [
    { accessorKey: 'createdAt', header: 'Date', id: 'createdAt' },
    { accessorKey: 'title', header: 'Issue', id: 'title', cell: ({ row }) => <span className="font-bold">{row.original.title}</span> },
    { accessorKey: 'priority', header: 'Priority', id: 'priority', cell: ({ row }) => <StatusBadge status={row.original.priority} /> },
    { accessorKey: 'status', header: 'Status', id: 'status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  ];

  const docColumns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Name', id: 'name', cell: ({ row }) => <span className="font-bold">{row.original.name}</span> },
    { accessorKey: 'uploadedAt', header: 'Uploaded', id: 'uploadedAt' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/units' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm font-semibold text-muted-foreground">Back to Units</span>
      </div>

      {/* --- HEADER BLOCK --- */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6 border-b">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Unit {unit.unitNumber}</h1>
            <StatusBadge status={unit.status} />
          </div>
          <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1">
            <Building2 className="w-4 h-4 text-primary" />
            {unit.propertyName} {unit.buildingName ? `• ${unit.buildingName}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unit.status !== 'Occupied' && (
            <Button size="sm" onClick={() => setIsAssignOpen(true)} className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Assign Tenant
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate({ to: '/leasing/leases' })} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Create Lease
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT HAND UNIT OVERVIEW CARD --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 space-y-4 border-border text-foreground">
            <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Unit Details</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Bed className="w-4 h-4" /> Bedrooms</span>
                <span>{unit.bedrooms} Beds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Bath className="w-4 h-4" /> Bathrooms</span>
                <span>{unit.bathrooms} Baths</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Sparkles className="w-4 h-4" /> Layout Size</span>
                <span>{unit.squareFootage.toLocaleString()} sqft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4" /> Rent Amount</span>
                <span>${unit.rentAmount.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4" /> Security Deposit</span>
                <span>${unit.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-4 h-4" /> Availability Date</span>
                <span>{unit.availabilityDate}</span>
              </div>
            </div>
          </Card>

          {/* Tenant Information Card */}
          <Card className="p-6 space-y-4 border-border text-foreground">
            <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Current Resident</h3>
            {unitTenant ? (
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-center space-x-3 p-3 bg-secondary/40 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{unitTenant.firstName} {unitTenant.lastName}</p>
                    <p className="text-muted-foreground text-[10px]">{unitTenant.email}</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{unitTenant.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={unitTenant.status} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4 font-semibold italic">
                No active tenant assigned.
              </p>
            )}
          </Card>
        </div>

        {/* --- RIGHT HAND TABS DETAIL --- */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="lease" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="lease">Lease Agreement</TabsTrigger>
              <TabsTrigger value="payments">Payments ({unitPayments.length})</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance ({unitMaint.length})</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* LEASE TAB */}
            <TabsContent value="lease" className="space-y-4">
              {unitLease ? (
                <Card className="p-6 space-y-4 border-border text-foreground">
                  <h3 className="font-bold text-base border-b pb-2 uppercase tracking-wide">Active Lease Log</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <p className="text-muted-foreground">Lease Agreement ID</p>
                      <p className="text-foreground mt-0.5">{unitLease.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lease Term</p>
                      <p className="text-foreground mt-0.5">{unitLease.startDate} to {unitLease.endDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Rent Amount</p>
                      <p className="text-foreground mt-0.5">${unitLease.rentAmount.toLocaleString()}/mo</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Security Deposit held</p>
                      <p className="text-foreground mt-0.5">${unitLease.depositAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center border-border">
                  <p className="text-sm font-semibold text-muted-foreground italic mb-4">No active lease agreement registered.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate({ to: '/leasing/leases' })}>
                    Create Lease Agreement
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* PAYMENTS TAB */}
            <TabsContent value="payments">
              <DataTable columns={payColumns} data={unitPayments} />
            </TabsContent>

            {/* MAINTENANCE TAB */}
            <TabsContent value="maintenance">
              <DataTable columns={maintColumns} data={unitMaint} />
            </TabsContent>

            {/* DOCUMENTS TAB */}
            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsDocOpen(true)} className="flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Upload Document
                </Button>
              </div>
              <DataTable columns={docColumns} data={unitDocs} />

              <FormDialog open={isDocOpen} onOpenChange={setIsDocOpen} title="Upload Unit Document">
                <FileUploader onFileSelect={(file) => uploadMutation.mutate(file)} />
              </FormDialog>
            </TabsContent>
          </Tabs>
        </div>

      </div>

      {/* MOVE IN TENANT DIALOG */}
      <FormDialog open={isAssignOpen} onOpenChange={setIsAssignOpen} title="Assign Tenant to Unit">
        <div className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground font-semibold">Select an inactive/pending tenant to move into Unit {unit.unitNumber}.</p>
          <Select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)}>
            <option value="">Select Tenant...</option>
            {allTenants.filter(t => t.status !== 'Active').map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName} ({t.status})
              </option>
            ))}
          </Select>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button 
              onClick={() => selectedTenantId && assignMutation.mutate(selectedTenantId)}
              disabled={assignMutation.isPending || !selectedTenantId}
            >
              {assignMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Assign Tenant
            </Button>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};
export default UnitDetailsPage;
