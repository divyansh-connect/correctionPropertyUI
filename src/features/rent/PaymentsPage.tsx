import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { RentPayment } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { PaymentMethodBadge } from '../../components/Phase4Components';
import { Plus, Eye, AlertOctagon, RefreshCw, Trash2, Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // Dialog triggers
  const [refundId, setRefundId] = useState<string | null>(null);
  const [voidId, setVoidId] = useState<string | null>(null);

  // Queries
  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ['payments-list'],
    queryFn: () => api.payments.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  // Mutations
  const refundMutation = useMutation({
    mutationFn: (id: string) => api.payments.refund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      setRefundId(null);
    },
  });

  const voidMutation = useMutation({
    mutationFn: (id: string) => api.payments.void(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      setVoidId(null);
    },
  });

  // Filters
  const filteredPayments = payments.filter((pay) => {
    const nameMatch = pay.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const refMatch = (pay.referenceNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProp = propertyFilter === '' || pay.propertyId === propertyFilter;
    const matchesStatus = statusFilter === '' || pay.status === statusFilter;
    const matchesMethod = methodFilter === '' || pay.paymentMethod === methodFilter;

    return (nameMatch || refMatch) && matchesProp && matchesStatus && matchesMethod;
  });

  // Export CSV
  const handleExport = () => {
    const headers = 'Receipt,Tenant,Property,Unit,Amount,Status,Method,Reference\n';
    const rows = filteredPayments
      .map(
        (p) =>
          `"${p.id}","${p.tenantName}","${p.propertyName}","${p.unitNumber}",${p.amount},"${p.status}","${p.paymentMethod}","${p.referenceNumber}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Payments_Report.csv');
    a.click();
  };

  const columns: ColumnDef<RentPayment>[] = [
    {
      accessorKey: 'id',
      header: 'Receipt #',
      id: 'id',
      cell: ({ row }) => (
        <span
          onClick={() => navigate({ to: `/payments/${row.original.id}` })}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          {row.original.id}
        </span>
      ),
    },
    { accessorKey: 'tenantName', header: 'Tenant', id: 'tenantName' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit #', id: 'unit' },
    { accessorKey: 'paidDate', header: 'Date Paid', id: 'paidDate', cell: ({ row }) => row.original.paidDate || '-' },
    {
      accessorKey: 'amount',
      header: 'Amount Paid',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      id: 'method',
      cell: ({ row }) => <PaymentMethodBadge method={row.original.paymentMethod} />,
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
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/payments/${row.original.id}` })} title="View Receipt">
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status === 'Paid' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setRefundId(row.original.id)}
                className="text-amber-500 hover:bg-amber-500/10"
                title="Refund Payment"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setVoidId(row.original.id)}
                className="text-rose-500 hover:bg-rose-500/10"
                title="Void Transaction"
              >
                <AlertOctagon className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Rent Payments"
        description="Verify individual cleared transaction logs, receipt ledger details, and voided charges."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Payments' },
        ]}
        action={{
          label: 'Record Payment',
          onClick: () => navigate({ to: '/payments/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Showing {filteredPayments.length} Payment Receipts
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search payments by tenant name or Ref..."
        filters={[
          {
            key: 'property',
            value: propertyFilter,
            placeholder: 'All Properties',
            options: properties.map((p) => ({ label: p.name, value: p.id })),
          },
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Refunded', value: 'Refunded' },
              { label: 'Voided', value: 'Voided' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'property') setPropertyFilter(val);
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPropertyFilter('');
          setStatusFilter('');
          setMethodFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredPayments} loading={isLoading} error={error ? error.message : null} />

      <ConfirmDialog
        open={!!refundId}
        onOpenChange={(open) => !open && setRefundId(null)}
        title="Refund Payment Receipt"
        description="Are you sure you want to issue a refund for this transaction? The payment status will update to Refunded and create a processed refund line item."
        confirmText="Confirm Refund"
        onConfirm={() => refundId && refundMutation.mutate(refundId)}
      />

      <ConfirmDialog
        open={!!voidId}
        onOpenChange={(open) => !open && setVoidId(null)}
        title="Void Transaction Record"
        description="Voiding a transaction reverses the credit in the rent ledger. This cannot be undone."
        confirmText="Void Payment"
        variant="destructive"
        onConfirm={() => voidId && voidMutation.mutate(voidId)}
      />
    </div>
  );
};
export default PaymentsPage;
