import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { ReceiptPreview } from '../../components/Phase4Components';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { ArrowLeft, Loader2, Printer, Download, RefreshCw, AlertOctagon } from 'lucide-react';

export const PaymentDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/payments/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [msg, setMsg] = useState('');

  // Queries
  const { data: payment, isLoading } = useQuery({
    queryKey: ['payment-detail', id],
    queryFn: () => api.payments.getById(id),
  });

  // Mutations
  const refundMutation = useMutation({
    mutationFn: () => api.payments.refund(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      setMsg('Refund issued successfully.');
      setTimeout(() => setMsg(''), 3000);
    },
  });

  const voidMutation = useMutation({
    mutationFn: () => api.payments.void(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['payments-list'] });
      setMsg('Transaction voided successfully.');
      setTimeout(() => setMsg(''), 3000);
    },
  });

  if (isLoading || !payment) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/payments' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm font-semibold text-muted-foreground">Back to Payments</span>
      </div>

      {msg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm font-semibold mb-6">
          {msg}
        </div>
      )}

      {/* HEADER BLOCK */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6 border-b">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Receipt {payment.id}</h1>
            <StatusBadge status={payment.status} />
          </div>
          <p className="text-sm text-muted-foreground font-semibold">
            Tenant: {payment.tenantName} • Unit {payment.unitNumber} ({payment.propertyName})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1">
            <Printer className="w-4 h-4" /> Print Receipt
          </Button>
          {payment.status === 'Paid' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refundMutation.mutate()}
                className="text-amber-500 hover:bg-amber-500/10 border-amber-500/30 flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" /> Refund
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => voidMutation.mutate()}
                className="text-rose-500 hover:bg-rose-500/10 border-rose-500/30 flex items-center gap-1"
              >
                <AlertOctagon className="w-4 h-4" /> Void Transaction
              </Button>
            </>
          )}
        </div>
      </div>

      {/* TABS SEGMENTS */}
      <Tabs defaultValue="receipt" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="receipt">Receipt Printout</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="allocation">Allocations</TabsTrigger>
        </TabsList>

        {/* RECEIPT PREVIEW */}
        <TabsContent value="receipt" className="pt-2">
          <ReceiptPreview
            id={payment.id}
            tenantName={payment.tenantName}
            propertyName={payment.propertyName}
            unitNumber={payment.unitNumber}
            amount={payment.amount}
            date={payment.paidDate || payment.dueDate}
            method={payment.paymentMethod}
            refNumber={payment.referenceNumber}
            createdBy={payment.createdBy}
          />
        </TabsContent>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          <Card className="p-6 border border-border bg-card">
            <h3 className="font-bold text-sm uppercase tracking-wide border-b pb-2 mb-4">Transaction Audit Parameters</h3>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <p className="text-muted-foreground">Stipulated Amount</p>
                <p className="text-foreground mt-0.5">${payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p className="text-foreground mt-0.5">{payment.dueDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="text-foreground mt-0.5">{payment.paymentMethod}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reference ID</p>
                <p className="text-foreground mt-0.5">{payment.referenceNumber || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ALLOCATION */}
        <TabsContent value="allocation">
          <Card className="p-6 border border-border bg-card">
            <h3 className="font-bold text-sm uppercase tracking-wide border-b pb-2 mb-4">Payment Allocations</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Base Rent Allocation</span>
                <span>${(payment.amount * 0.9).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Utilities Allocation</span>
                <span>${(payment.amount * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-black">
                <span>Total Amount Cleared</span>
                <span>${payment.amount.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default PaymentDetailsPage;
