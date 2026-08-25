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
import { Plus, Eye, Trash2, Download, Mail, MessageSquare } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

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
    const nameMatch = (inv.tenantName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || inv.status === statusFilter;
    return nameMatch && matchesStatus;
  });

  const getInvoiceNumber = (invId: string) => {
    const index = invoices.findIndex((inv) => inv.id === invId);
    return `INV-${String(index !== -1 ? index + 1 : 1).padStart(4, '0')}`;
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: t('invoicesPage.invoiceNo'),
      id: 'id',
      cell: ({ row }) => (
        <span
          onClick={() => setSelectedInvoice(row.original)}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          {getInvoiceNumber(row.original.id)}
        </span>
      ),
    },
    { accessorKey: 'tenantName', header: t('invoicesPage.tenant'), id: 'tenantName' },
    { accessorKey: 'propertyName', header: t('invoicesPage.property'), id: 'property' },
    { accessorKey: 'dueDate', header: t('invoicesPage.dueDate'), id: 'dueDate' },
    {
      accessorKey: 'amount',
      header: t('invoicesPage.amountDue'),
      id: 'amount',
      cell: ({ row }) => <span className="font-semibold">${(row.original.amount || 0).toLocaleString()}</span>,
    },
    {
      accessorKey: 'balance',
      header: t('invoicesPage.outstandingBalance'),
      id: 'balance',
      cell: ({ row }) => (
        <span className={(row.original.balance || 0) > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
          ${(row.original.balance || 0).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: t('invoicesPage.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: t('invoicesPage.actions'),
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setSelectedInvoice(row.original)} title={t('invoicesPage.viewDetails')}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title={t('invoicesPage.deleteInvoice')}
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
        title={t('invoicesPage.title')}
        description={t('invoicesPage.desc')}
        breadcrumbs={[
          { label: t('ai.breadcrumbs.home'), href: '/' },
          { label: t('rentPaymentsPage.rentCollection'), href: '/rent' },
          { label: t('invoicesPage.invoices') },
        ]}
        action={{
          label: t('invoicesPage.createInvoice'),
          onClick: () => navigate({ to: '/invoices/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('invoicesPage.searchPlaceholder')}
        filters={[
          {
            key: 'status',
            value: statusFilter,
            placeholder: t('rentPaymentsPage.allStatuses'),
            options: [
              { label: 'Paid', value: 'Paid' },
              { label: 'Partially Paid', value: 'Partially Paid' },
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
        title={t('invoicesPage.itemizedStatement')}
      >
        {selectedInvoice && (
          <div className="space-y-6 pt-3 text-xs font-semibold text-foreground">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm uppercase">{t('invoicesPage.invoiceStatement')}</h4>
                <p className="text-[10px] text-muted-foreground font-bold mt-1">NO: {getInvoiceNumber(selectedInvoice.id)} • DUE: {selectedInvoice.dueDate}</p>
              </div>
              <StatusBadge status={selectedInvoice.status} />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase text-muted-foreground">{t('invoicesPage.residentDetails')}</p>
              <p className="text-sm font-bold">{selectedInvoice.tenantName}</p>
              <p className="text-muted-foreground">{selectedInvoice.propertyName} • Unit {selectedInvoice.unitNumber}</p>
            </div>

            {/* Line items list */}
            <div className="space-y-2 border-t pt-4">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wide">{t('invoicesPage.lineItemsBreakdown')}</p>
              <div className="divide-y border rounded-xl overflow-hidden bg-secondary/15">
                {(selectedInvoice.lineItems || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between p-3">
                    <span>{item.description}</span>
                    <span className="font-extrabold">${(item.amount || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed pt-4 flex justify-between items-center text-sm font-black">
              <span>{t('invoicesPage.totalBalanceDue')}</span>
              <span className="text-lg text-rose-500">${(selectedInvoice.balance || 0).toLocaleString()}</span>
            </div>

            {/* Share / Send Invoice options */}
            <div className="border-t pt-4 space-y-2">
              <p className="text-[10px] uppercase text-muted-foreground tracking-wide font-black">{t('invoicesPage.directDelivery')}</p>
              <div className="flex gap-2 font-bold text-xs">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => alert(`Invoice ${getInvoiceNumber(selectedInvoice.id)} sent to ${selectedInvoice.tenantName}'s registered email!`)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{t('invoicesPage.sendEmail')}</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => alert(`Invoice alert text message dispatched for ${getInvoiceNumber(selectedInvoice.id)} to ${selectedInvoice.tenantName}'s phone number!`)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span>{t('invoicesPage.sendSms')}</span>
                </Button>
                <a 
                  href={`https://wa.me/${((selectedInvoice as any).tenantPhone || (selectedInvoice as any).phone || '').replace(/\D/g, '') || '15550199'}?text=${encodeURIComponent(`Hi ${selectedInvoice.tenantName}, here is your outstanding statement balance details for invoice ${getInvoiceNumber(selectedInvoice.id)} (${selectedInvoice.propertyName} Unit ${selectedInvoice.unitNumber}). Total amount due: $${selectedInvoice.balance.toLocaleString()}. Please view details and complete payment: http://localhost:5173/tenant/payments`)}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl transition text-foreground"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t('invoicesPage.whatsApp')}</span>
                </a>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>{t('invoicesPage.close')}</Button>
              <Button onClick={() => {
                setSelectedInvoice(null);
                navigate({ to: '/payments/new' });
              }}>{t('invoicesPage.recordPayment')}</Button>
            </div>
          </div>
        )}
      </FormDialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t('invoicesPage.deleteTitle')}
        description={t('invoicesPage.deleteDesc')}
        confirmText={t('invoicesPage.confirmDelete')}
        variant="destructive"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
};
export default InvoicesPage;
