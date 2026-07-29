import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { IncomeRecord } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/StatusBadge';
import { CurrencyInput } from '../../components/Phase4Components';
import { Plus, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const IncomePage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [sourceType, setSourceType] = useState<'Tenant' | 'Owner' | 'Miscellaneous'>('Tenant');
  const [propertyId, setPropertyId] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [miscSourceName, setMiscSourceName] = useState('');
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState(150);

  // Queries
  const { data: income = [], isLoading } = useQuery({ queryKey: ['income-list'], queryFn: () => api.income.getAll() });
  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.property.getAll() });
  const { data: buildings = [] } = useQuery({ queryKey: ['buildings'], queryFn: () => api.building.getAll() });
  const { data: units = [] } = useQuery({ queryKey: ['units'], queryFn: () => api.unit.getAll() });
  const { data: tenants = [] } = useQuery({ queryKey: ['tenants'], queryFn: () => api.tenant.getAll() });
  const { data: owners = [] } = useQuery({ queryKey: ['owners'], queryFn: () => api.owner.getAll() });

  const createMutation = useMutation({
    mutationFn: () => {
      const prop = properties.find((p) => p.id === propertyId);
      
      let resolvedName = '';
      let sourceId = '';
      if (sourceType === 'Tenant') {
        const tenant = tenants.find((t) => t.id === selectedTenantId);
        resolvedName = tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Tenant';
        sourceId = selectedTenantId;
      } else if (sourceType === 'Owner') {
        const owner = owners.find((o) => o.id === selectedOwnerId);
        resolvedName = owner ? `${owner.firstName} ${owner.lastName}` : 'Owner';
        sourceId = selectedOwnerId;
      } else {
        resolvedName = miscSourceName || 'Miscellaneous Source';
      }

      return api.income.create({
        date: new Date().toISOString().split('T')[0],
        propertyId,
        propertyName: prop ? prop.name : 'Property',
        buildingId,
        unitId,
        sourceType,
        sourceId,
        tenantName: resolvedName,
        category,
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-list'] });
      setIsOpen(false);
      setAmount(150);
      setPropertyId('');
      setBuildingId('');
      setUnitId('');
      setSelectedTenantId('');
      setSelectedOwnerId('');
      setMiscSourceName('');
      setSourceType('Tenant');
    },
  });

  const filteredIncome = income.filter((item) => {
    const searchMatch = item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || item.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || item.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const columns: ColumnDef<IncomeRecord>[] = [
    { accessorKey: 'date', header: t('pmIncome.clearingDate'), id: 'date' },
    { accessorKey: 'tenantName', header: t('pmIncome.residentName'), id: 'tenant' },
    { accessorKey: 'propertyName', header: t('pmIncome.propertyLocation'), id: 'property' },
    {
      accessorKey: 'category',
      header: t('pmIncome.category'),
      id: 'category',
      cell: ({ row }) => <span className="font-bold text-[10px] bg-secondary px-2 py-0.5 rounded-lg border uppercase">{row.original.category}</span>,
    },
    {
      accessorKey: 'amount',
      header: t('pmIncome.amount'),
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: t('pmIncome.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('pmIncome.title')}
        description={t('pmIncome.desc')}
        breadcrumbs={[
          { label: t('header.home'), href: '/' },
          { label: t('nav.accounting'), href: '/accounting' },
          { label: t('pmIncome.title') },
        ]}
        action={{
          label: t('pmIncome.recordIncome'),
          onClick: () => setIsOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('pmIncome.searchPlaceholder')}
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: t('pmIncome.incomeCategory'),
            options: [
              { label: 'Rent', value: 'Rent' },
              { label: 'Utilities', value: 'Utilities' },
              { label: 'Late Fees', value: 'Late Fees' },
              { label: 'Parking', value: 'Parking' },
              { label: 'Storage', value: 'Storage' },
              { label: 'Pet Fees', value: 'Pet Fees' },
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

      <DataTable columns={columns} data={filteredIncome.slice(0, 100)} loading={isLoading} />

      {/* CREATE DIALOG */}
      <FormDialog open={isOpen} onOpenChange={setIsOpen} title="Record Miscellaneous Income">
        <div className="space-y-4 pt-2">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Source Type</label>
            <Select value={sourceType} onChange={(e) => {
              setSourceType(e.target.value as any);
              setSelectedTenantId('');
              setSelectedOwnerId('');
              setMiscSourceName('');
            }}>
              <option value="Tenant">Tenant / Resident</option>
              <option value="Owner">Property Owner (Contribution)</option>
              <option value="Miscellaneous">Miscellaneous / Vending / Other</option>
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

          {sourceType === 'Tenant' && (
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

          {sourceType === 'Owner' && (
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

          {sourceType === 'Miscellaneous' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Source / Payee Name</label>
              <Input placeholder="E.g., Laundry machine collection" value={miscSourceName} onChange={(e) => setMiscSourceName(e.target.value)} />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Income Category</label>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Rent">Rent Revenue</option>
              <option value="Utilities">Utilities Reimbursement</option>
              <option value="Late Fees">Late Fees Penalty</option>
              <option value="Parking">Parking Space Rent</option>
              <option value="Storage">Storage Lockers Rent</option>
              <option value="Pet Fees">Pet Rent Fee</option>
            </Select>
          </div>

          <CurrencyInput
            label="Payment Amount ($)"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={
                !propertyId ||
                (sourceType === 'Tenant' && !selectedTenantId) ||
                (sourceType === 'Owner' && !selectedOwnerId) ||
                (sourceType === 'Miscellaneous' && !miscSourceName) ||
                createMutation.isPending
              }
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Income
            </Button>
          </div>

        </div>
      </FormDialog>
    </div>
  );
};
export default IncomePage;
