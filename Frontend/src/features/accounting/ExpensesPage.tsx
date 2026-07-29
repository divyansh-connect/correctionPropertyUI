import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { ExpenseRecord } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/StatusBadge';
import { CurrencyInput } from '../../components/Phase4Components';
import { Plus, Check, X, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ExpensesPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [payeeType, setPayeeType] = useState<'Vendor' | 'Maintenance' | 'Tenant' | 'Owner'>('Vendor');
  const [propertyId, setPropertyId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [selectedMaintenanceId, setSelectedMaintenanceId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [amount, setAmount] = useState(250);

  // Queries
  const { data: expenses = [], isLoading } = useQuery({ queryKey: ['expenses-list'], queryFn: () => api.expenses.getAll() });
  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.property.getAll() });
  const { data: buildings = [] } = useQuery({ queryKey: ['buildings'], queryFn: () => api.building.getAll() });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: () => api.unit.getAll() });
  const { data: vendors = [] } = useQuery({ queryKey: ['vendors'], queryFn: () => api.vendors.getAll() });
  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.tenant.getAll() });
  const { data: owners = [] } = useQuery({ queryKey: ['owners'], queryFn: () => api.owner.getAll() });
  const { data: users = [] } = useQuery({ queryKey: ['users-list'], queryFn: () => api.users.getAll() });

  // Mutations
  const createMutation = useMutation({
    mutationFn: () => {
      const prop = properties.find((p) => p.id === propertyId);
      
      let resolvedPayeeName = '';
      let payeeId = '';
      if (payeeType === 'Vendor') {
        const vendor = vendors.find((v) => v.id === selectedVendorId);
        resolvedPayeeName = vendor ? vendor.name : 'Vendor';
        payeeId = selectedVendorId;
      } else if (payeeType === 'Maintenance') {
        const staff = users.find((u) => u.id === selectedMaintenanceId);
        resolvedPayeeName = staff ? staff.name : 'Maintenance Staff';
        payeeId = selectedMaintenanceId;
      } else if (payeeType === 'Tenant') {
        const tenant = tenants.find((t) => t.id === selectedTenantId);
        resolvedPayeeName = tenant ? `${tenant.firstName} ${tenant.lastName} (Tenant)` : 'Tenant';
        payeeId = selectedTenantId;
      } else if (payeeType === 'Owner') {
        const owner = owners.find((o) => o.id === selectedOwnerId);
        resolvedPayeeName = owner ? `${owner.firstName} ${owner.lastName} (Owner)` : 'Owner';
        payeeId = selectedOwnerId;
      }

      return api.expenses.create({
        vendorName: resolvedPayeeName,
        propertyId,
        propertyName: prop ? prop.name : 'Property',
        buildingId,
        unitId,
        payeeType,
        payeeId,
        category,
        amount,
        tax: amount * 0.05,
        paymentMethod: 'Bank Wire',
        date: new Date().toISOString().split('T')[0],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses-list'] });
      setIsOpen(false);
      setAmount(250);
      setPropertyId('');
      setBuildingId('');
      setUnitId('');
      setSelectedVendorId('');
      setSelectedMaintenanceId('');
      setSelectedTenantId('');
      setSelectedOwnerId('');
      setPayeeType('Vendor');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.expenses.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses-list'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.expenses.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses-list'] });
    },
  });

  const filteredExpenses = expenses.filter((exp) => {
    const vendor = exp.vendorName || '';
    const propName = exp.propertyName || '';
    const searchMatch = vendor.toLowerCase().includes(searchQuery.toLowerCase()) || propName.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || exp.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const columns: ColumnDef<ExpenseRecord>[] = [
    { accessorKey: 'date', header: t('pmExpenses.expenseDate'), id: 'date' },
    { accessorKey: 'vendorName', header: t('pmExpenses.vendorPartner'), id: 'vendor' },
    { accessorKey: 'propertyName', header: t('pmIncome.propertyLocation'), id: 'property' },
    {
      accessorKey: 'category',
      header: t('pmIncome.category'),
      id: 'category',
      cell: ({ row }) => <span className="font-bold text-[10px] bg-secondary px-2 py-0.5 rounded-lg border uppercase">{row.original.category}</span>,
    },
    {
      accessorKey: 'amount',
      header: t('pmExpenses.amountPaid'),
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-rose-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: t('pmIncome.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: t('pmExpenses.approvalAction'),
      cell: ({ row }) => {
        if (row.original.status === 'Pending Approval') {
          return (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => approveMutation.mutate(row.original.id)}
                className="text-emerald-500 hover:bg-emerald-500/10 h-8 w-8"
                title="Approve Expense"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => rejectMutation.mutate(row.original.id)}
                className="text-rose-500 hover:bg-rose-500/10 h-8 w-8"
                title="Reject Expense"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        }
        return <span className="text-xs text-muted-foreground font-semibold">Audited</span>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('pmExpenses.title')}
        description={t('pmExpenses.desc')}
        breadcrumbs={[
          { label: t('header.home'), href: '/' },
          { label: t('nav.accounting'), href: '/accounting' },
          { label: t('pmExpenses.title') },
        ]}
        action={{
          label: t('pmExpenses.recordExpense'),
          onClick: () => setIsOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('pmExpenses.searchPlaceholder')}
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: t('pmExpenses.expenseCategory'),
            options: [
              { label: 'Repairs', value: 'Repairs' },
              { label: 'Maintenance', value: 'Maintenance' },
              { label: 'Utilities', value: 'Utilities' },
              { label: 'Insurance', value: 'Insurance' },
              { label: 'Property Taxes', value: 'Property Taxes' },
              { label: 'Payroll', value: 'Payroll' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'category') setCategoryFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setCategoryFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredExpenses.slice(0, 100)} loading={isLoading} />

      {/* CREATE DIALOG */}
      <FormDialog open={isOpen} onOpenChange={setIsOpen} title="Record Expense Transaction">
        <div className="space-y-4 pt-2">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Payee Type</label>
            <Select value={payeeType} onChange={(e) => {
              setPayeeType(e.target.value as any);
              setSelectedVendorId('');
              setSelectedMaintenanceId('');
              setSelectedTenantId('');
              setSelectedOwnerId('');
            }}>
              <option value="Vendor">Vendor / Service Partner</option>
              <option value="Maintenance">Maintenance Staff (Internal)</option>
              <option value="Tenant">Tenant (Refund / Return)</option>
              <option value="Owner">Property Owner (Distribution)</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Property Portfolio</label>
            <Select value={propertyId} onChange={(e) => {
              setPropertyId(e.target.value);
              setBuildingId('');
              setUnitId('');
              setSelectedTenantId('');
              setSelectedOwnerId('');
            }}>
              <option value="">Select Property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Building Portfolio</label>
            <Select value={buildingId} onChange={(e) => {
              setBuildingId(e.target.value);
              setUnitId('');
              setSelectedTenantId('');
            }} disabled={!propertyId}>
              <option value="">Select Building...</option>
              {buildings.filter((b) => b.propertyId === propertyId).map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Rentable Unit</label>
            <Select value={unitId} onChange={(e) => {
              setUnitId(e.target.value);
              setSelectedTenantId('');
            }} disabled={!buildingId}>
              <option value="">Select Unit...</option>
              {units.filter((u) => u.buildingId === buildingId).map((u) => (
                <option key={u.id} value={u.id}>Unit {u.unitNumber} - {u.status}</option>
              ))}
            </Select>
          </div>

          {payeeType === 'Vendor' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Vendor Payee</label>
              <Select value={selectedVendorId} onChange={(e) => setSelectedVendorId(e.target.value)}>
                <option value="">Select Vendor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </Select>
            </div>
          )}

          {payeeType === 'Maintenance' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Maintenance Staff Payee</label>
              <Select value={selectedMaintenanceId} onChange={(e) => setSelectedMaintenanceId(e.target.value)}>
                <option value="">Select Maintainer...</option>
                {users
                  .filter((u) => u.role === 'Maintenance Staff' || u.role === 'Maintenance')
                  .map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))
                }
              </Select>
            </div>
          )}

          {payeeType === 'Tenant' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Resident / Tenant Payee</label>
              <Select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)}>
                <option value="">Select Tenant...</option>
                {tenants
                  .filter((t) => !unitId || t.unitId === unitId || t.propertyId === propertyId)
                  .map((t) => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} {t.unitNumber ? `(Unit ${t.unitNumber})` : ''}</option>
                  ))
                }
              </Select>
            </div>
          )}

          {payeeType === 'Owner' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property Owner Payee</label>
              <Select value={selectedOwnerId} onChange={(e) => setSelectedOwnerId(e.target.value)}>
                <option value="">Select Owner...</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>
                ))}
              </Select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Expense Category</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Repairs">Repairs & Diagnostics</option>
              <option value="Maintenance">General Maintenance</option>
              <option value="Utilities">Public Utilities</option>
              <option value="Insurance">Property Insurance Premium</option>
              <option value="Property Taxes">Property Taxes Levies</option>
              <option value="Payroll">Staff Payroll</option>
              <option value="Landscaping">Landscaping Servicing</option>
              <option value="Office">Office Supplies & Tools</option>
            </Select>
          </div>

          <CurrencyInput
            label="Expense Amount ($)"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={
                !propertyId ||
                (payeeType === 'Vendor' && !selectedVendorId) ||
                (payeeType === 'Maintenance' && !selectedMaintenanceId) ||
                (payeeType === 'Tenant' && !selectedTenantId) ||
                (payeeType === 'Owner' && !selectedOwnerId) ||
                createMutation.isPending
              }
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Expense
            </Button>
          </div>

        </div>
      </FormDialog>
    </div>
  );
};
export default ExpensesPage;
