import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import api from '../../api';
import { Transaction } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

const txSchema = zod.object({
  type: zod.enum(['Income', 'Expense']),
  category: zod.string().min(1, 'Category is required'),
  amount: zod.number().min(1, 'Amount must be positive'),
  propertyName: zod.string().min(1, 'Property is required'),
  description: zod.string().min(1, 'Description is required'),
  reference: zod.string().optional(),
});

type TxFormValues = zod.infer<typeof txSchema>;

export const AccountingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.accounting.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (newTx: TxFormValues) => api.accounting.create(newTx),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
      setIsFormOpen(false);
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TxFormValues>({
    resolver: zodResolver(txSchema),
    defaultValues: { type: 'Income' },
  });

  const onSubmit = (values: TxFormValues) => {
    createMutation.mutate(values);
  };

  const filteredTx = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === '' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns: ColumnDef<Transaction>[] = [
    { accessorKey: 'date', header: 'Date', id: 'date' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'description', header: 'Description', id: 'description' },
    {
      accessorKey: 'type',
      header: 'Type',
      id: 'type',
      cell: ({ row }) => (
        <span
          className={
            row.original.type === 'Income'
              ? 'text-emerald-500 font-bold'
              : 'text-rose-500 font-bold'
          }
        >
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      id: 'amount',
      cell: ({ row }) => (
        <span
          className={
            row.original.type === 'Income'
              ? 'text-emerald-500 font-bold'
              : 'text-rose-500 font-bold'
          }
        >
          {row.original.type === 'Income' ? '+' : '-'}${row.original.amount.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Accounting & Ledger"
        description="Review receipts, expense statements, and overall cash flows."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Accounting' },
        ]}
        action={{
          label: 'Record Transaction',
          onClick: () => setIsFormOpen(true),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search transactions by category or description..."
        filters={[
          {
            key: 'type',
            value: typeFilter,
            placeholder: 'Filter by Type',
            options: [
              { label: 'Income', value: 'Income' },
              { label: 'Expense', value: 'Expense' },
            ],
          },
        ]}
        onFilterChange={(_, val) => setTypeFilter(val)}
        onReset={() => {
          setSearchQuery('');
          setTypeFilter('');
        }}
      />

      <DataTable
        columns={columns}
        data={filteredTx}
        loading={isLoading}
        emptyStateMessage="No transactions matching filters."
      />

      <FormDialog open={isFormOpen} onOpenChange={setIsFormOpen} title="Record Cash Transaction">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Transaction Type</label>
              <Select {...register('type')}>
                <option value="Income">Income (+)</option>
                <option value="Expense">Expense (-)</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Amount ($)</label>
              <Input
                type="number"
                placeholder="250"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && <p className="text-rose-500 text-xs">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
              <Input placeholder="Rent / Water / Repair" {...register('category')} />
              {errors.category && <p className="text-rose-500 text-xs">{errors.category.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Property</label>
              <Select {...register('propertyName')}>
                <option value="">Select Property...</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </Select>
              {errors.propertyName && <p className="text-rose-500 text-xs">{errors.propertyName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Description</label>
            <Input placeholder="Enter details about this payment..." {...register('description')} />
            {errors.description && <p className="text-rose-500 text-xs">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Transaction
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
};
export default AccountingPage;
