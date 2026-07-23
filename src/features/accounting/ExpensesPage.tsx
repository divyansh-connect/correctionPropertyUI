import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState('Repairs');
  const [amount, setAmount] = useState(250);
  const [propertyId, setPropertyId] = useState('');

  // Queries
  const { data: expenses = [], isLoading } = useQuery({ queryKey: ['expenses-list'], queryFn: () => api.expenses.getAll() });
  const { data: properties = [] } = useQuery({ queryKey: ['properties'], queryFn: () => api.property.getAll() });

  // Mutations
  const createMutation = useMutation({
    mutationFn: () => {
      const prop = properties.find((p) => p.id === propertyId);
      return api.expenses.create({
        vendorName,
        propertyId,
        propertyName: prop ? prop.name : 'Property',
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
      setVendorName('');
      setAmount(250);
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
    const searchMatch = exp.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || exp.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = categoryFilter === '' || exp.category === categoryFilter;
    return searchMatch && catMatch;
  });

  const columns: ColumnDef<ExpenseRecord>[] = [
    { accessorKey: 'date', header: 'Expense Date', id: 'date' },
    { accessorKey: 'vendorName', header: 'Vendor / Partner', id: 'vendor' },
    { accessorKey: 'propertyName', header: 'Property Location', id: 'property' },
    {
      accessorKey: 'category',
      header: 'Category',
      id: 'category',
      cell: ({ row }) => <span className="font-bold text-[10px] bg-secondary px-2 py-0.5 rounded-lg border uppercase">{row.original.category}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount Paid',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-rose-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Approval Action',
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
        title="Expense Tracker"
        description="Verify property business landscaping bills, utility invoices, repairs, and payroll distributions."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Accounting', href: '/accounting' },
          { label: 'Expenses' },
        ]}
        action={{
          label: 'Record Expense',
          onClick: () => setIsOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search expenses by vendor or property..."
        filters={[
          {
            key: 'category',
            value: categoryFilter,
            placeholder: 'Expense Category',
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
            <label className="text-xs font-bold text-muted-foreground uppercase">Property Portfolio</label>
            <Select value={propertyId} onChange={(e) => setPropertyId(e.target.value)}>
              <option value="">Select Property...</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Vendor / Payee</label>
            <Input placeholder="E.g., Local Plumbing Inc" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
          </div>

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
            <Button onClick={() => createMutation.mutate()} disabled={!propertyId || !vendorName || createMutation.isPending}>
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
