import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Invoice } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Plus, Eye, Trash2, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Queries
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices-list'],
    queryFn: () => api.invoices.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.invoices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices-list'] });
      setDeleteId(null);
    },
  });

  const filteredInvoices = invoices.filter((inv) => {
    const nameMatch = inv.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || inv.status === statusFilter;
    return nameMatch && matchesStatus;
  });

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice #',
      id: 'id',
      cell: ({ row }) => (
        <span
          onClick={() => setSelectedInvoice(row.original)}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          {row.original.id}
        </span>
      ),
    },
    { accessorKey: 'tenantName', header: 'Tenant', id: 'tenantName' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'dueDate', header: 'Due Date', id: 'dueDate' },
    {
      accessorKey: 'amount',
      header: 'Amount Due',
      id: 'amount',
      cell: ({ row }) => <span className="font-semibold">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'balance',
      header: 'Outstanding Balance',
      id: 'balance',
      cell: ({ row }) => (
        <span className={row.original.balance > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
          ${row.original.balance.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(row.original)} title="View Details">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete Invoice"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Invoices Manager"
        description="Verify resident monthly invoices billing distributions, itemized charges, and overdue alerts."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Invoices' },
        ]}
        action={{
          label: 'Create Invoice',
          onClick: () => navigate({ to: '/invoices/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search invoices by tenant name..."
        filters={[
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Paid', value: 'Paid' },
              { label: 'Sent', value: 'Sent' },
              { label: 'Overdue', value: 'Overdue' },
              { label: 'Draft', value: 'Draft' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredInvoices} loading={isLoading} error={error ? error.message : null} />

      {/* DETAILED INVOICE MODAL */}
      <FormDialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
        title="Itemized Invoice Statement"
      >
        {selectedInvoice && (
          <div className="space-y-6 pt-3 text-xs font-semibold text-foreground">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm uppercase">Invoice Statement</h4>
                <p className="text-[10px] text-muted-foreground font-bold mt-1">NO: {selectedInvoice.id} • DUE: {selectedInvoice.dueDate}</p>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase text-muted-foreground">Resident Details</p>
              <p className="text-sm font-bold">{selectedInvoice.tenantName}</p>
              <p className="text-muted-foreground">{selectedInvoice.propertyName} • Unit {selectedInvoice.unitNumber}</p>
            </div>

            {/* Line items list */}
            <div className="space-y-2 border-t pt-4">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wide">Line Items Breakdown</p>
              <div className="divide-y border rounded-xl overflow-hidden bg-secondary/15">
                {selectedInvoice.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3">
                    <span>{item.description}</span>
                    <span className="font-extrabold">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed pt-4 flex justify-between items-center text-sm font-black">
              <span>Total Balance Due</span>
              <span className="text-lg text-rose-500">${selectedInvoice.balance.toLocaleString()}</span>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
              <Button onClick={() => {
                setSelectedInvoice(null);
                navigate({ to: '/payments/new' });
              }}>Record Payment</Button>
            </div>
          </div>
        )}
      </FormDialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Invoice Statement"
        description="Are you sure you want to delete this invoice? The transaction debit will be reversed."
        confirmText="Delete Invoice"
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default InvoicesPage;
