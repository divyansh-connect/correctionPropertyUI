import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [category, setCategory] = useState('Rent');
  const [amount, setAmount] = useState(150);

  // Queries
  const { data: income = [], isLoading } = useQuery({ queryKey: ['income-list'], queryFn: () => api.income.getAll() });
  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.property.getAll() });
  const [propertyId, setPropertyId] = useState('');

  const createMutation = useMutation({
    mutationFn: () => {
      const prop = properties.find((p) => p.id === propertyId);
      return api.income.create({
        date: new Date().toISOString().split('T')[0],
        propertyId,
        propertyName: prop ? prop.name : 'Property',
        tenantName,
        category,
        amount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['income-list'] });
      setIsOpen(false);
      setTenantName('');
      setAmount(150);
    },
  });

  const filteredIncome = income.filter((item) => {
    const searchMatch = item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) || item.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || item.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const columns: ColumnDef<IncomeRecord>[] = [
    { accessorKey: 'date', header: 'Clearing Date', id: 'date' },
    { accessorKey: 'tenantName', header: 'Resident Name', id: 'tenant' },
    { accessorKey: 'propertyName', header: 'Property Location', id: 'property' },
    {
      accessorKey: 'category',
      header: 'Category',
      id: 'category',
      cell: ({ row }) => <span className="font-bold text-[10px] bg-secondary px-2 py-0.5 rounded-lg border uppercase">{row.original.category}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Income Transactions"
        description="Verify utility disbursements, late fees payments, pet assessments, and rental revenue."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Accounting', href: '/accounting' },
          { label: 'Income' },
        ]}
        action={{
          label: 'Record Miscellaneous Income',
          onClick: () => setIsOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search income by tenant or property..."
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: 'Income Category',
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
            <label className="text-xs font-bold text-muted-foreground uppercase">Property Portfolio</label>
            <Select value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
              <option value="">Select Property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Resident / Source Name</label>
            <Input placeholder="Resident name or payee..." value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
          </div>

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
            <Button onClick={() => createMutation.mutate()} disabled={!propertyId || !tenantName || createMutation.isPending}>
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
