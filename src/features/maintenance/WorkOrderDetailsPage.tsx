import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { StatusBadge } from '../../components/StatusBadge';
import { Printer, Calendar, DollarSign, User, Wrench, ShieldAlert } from 'lucide-react';

export const WorkOrderDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/maintenance/work-orders/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const { data: wo, isLoading } = useQuery({
    queryKey: ['work-order-detail', id],
    queryFn: () => api.workOrders.getById(id),
  });

  const { data: vendorsList = [] } = useQuery({ queryKey: ['vendors-list'], queryFn: () => api.vendors.getAll() });

  const assignMutation = useMutation({
    mutationFn: (vendorId: string) => {
      const v = vendorsList.find((v) => v.id === vendorId);
      return api.workOrders.update(id, {
        status: 'Assigned',
        vendorId,
        vendorName: v ? v.name : 'Assigned Vendor',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-order-detail', id] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => api.workOrders.update(id, { status: 'Completed', actualCost: wo ? wo.estimatedCost * 1.1 : 200 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-order-detail', id] });
    },
  });

  const closeMutation = useMutation({
    mutationFn: () => api.workOrders.update(id, { status: 'Closed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-order-detail', id] });
    },
  });

  if (isLoading || !wo) {
    return <LoadingSkeleton type="details" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-4xl">
      <PageHeader
        title={`Work Order Detail - ${wo.workOrderNumber}`}
        description="Verify contractor estimates, technicians scheduling, and completed service invoices."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Work Orders', href: '/maintenance/work-orders' },
          { label: 'Details' },
        ]}
      />

      {/* QUICK STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-card border rounded-2xl gap-3">
        <div className="flex items-center space-x-3.5">
          <StatusBadge status={wo.status} />
          <span className="text-xs font-bold text-muted-foreground font-mono">{wo.scheduledDate}</span>
        </div>

        <div className="flex space-x-2">
          {wo.status === 'Draft' && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground mr-2">Assign Vendor:</span>
              <select
                className="text-xs p-1.5 rounded-lg border bg-card text-foreground"
                onChange={(e) => assignMutation.mutate(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Vendor...</option>
                {vendorsList.slice(0, 15).map((v) => (
                  <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                ))}
              </select>
            </div>
          )}
          {wo.status === 'Assigned' && (
            <Button size="sm" onClick={() => completeMutation.mutate()}>Mark Complete</Button>
          )}
          {wo.status === 'Completed' && (
            <Button size="sm" onClick={() => closeMutation.mutate()} className="bg-emerald-500 hover:bg-emerald-600">
              Close Work Order
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-1.5 text-xs">
            <Printer className="w-4 h-4" /> Print Form
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate({ to: '/maintenance/work-orders' })}>Back</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="invoices">Invoices & Financials</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 p-6 border bg-card space-y-6">
              <h3 className="text-sm font-extrabold uppercase border-b pb-2">Assigned Logistics & Property</h3>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-3.5 bg-secondary/10 rounded-xl border">
                  <p className="text-muted-foreground text-[10px] uppercase">Property Location</p>
                  <p className="font-bold text-sm mt-1">{wo.propertyName}</p>
                  <p className="text-muted-foreground">Unit: {wo.unitNumber}</p>
                </div>
                <div className="p-3.5 bg-secondary/10 rounded-xl border">
                  <p className="text-muted-foreground text-[10px] uppercase">Assigned Vendor</p>
                  <p className="font-bold text-sm mt-1">{wo.vendorName}</p>
                  <p className="text-muted-foreground">Technician: {wo.assignedTechnician}</p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-1 p-6 border bg-card space-y-4">
              <h3 className="text-sm font-extrabold uppercase border-b pb-2">Cost Analysis</h3>
              <div className="space-y-3.5 text-xs font-semibold">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <span className="font-bold">${wo.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Actual Cost:</span>
                  <span className="font-extrabold text-rose-500">${wo.actualCost.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TIMELINE */}
        <TabsContent value="timeline" className="mt-4">
          <Card className="p-6 border bg-card space-y-4">
            <h3 className="text-sm font-extrabold uppercase border-b pb-2">Work Order Progress Logs</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex space-x-3.5 border-l-2 border-primary pl-4 pb-4 position-relative">
                <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-[22px] mt-1" />
                <div>
                  <p className="font-bold">Work Order Finalized / Dispatched</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">{wo.scheduledDate} 09:00 AM • System Log</p>
                </div>
              </div>

              <div className="flex space-x-3.5 border-l-2 border-primary pl-4 pb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-primary -ml-[22px] mt-1" />
                <div>
                  <p className="font-bold">Contractor Dispatched to Site</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">{wo.scheduledDate} 10:30 AM • {wo.vendorName}</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* INVOICES */}
        <TabsContent value="invoices" className="mt-4">
          <Card className="p-6 border bg-card space-y-4">
            <h3 className="text-sm font-extrabold uppercase border-b pb-2">Linked Vendor Invoices</h3>
            <div className="p-4 bg-secondary/15 rounded-xl border flex justify-between items-center text-xs font-semibold">
              <div>
                <p className="font-bold">Vendor Billing Invoice</p>
                <p className="text-[10px] text-muted-foreground">Reference Work Order: {wo.workOrderNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-extrabold">${wo.actualCost.toLocaleString()}</p>
                <StatusBadge status={wo.status === 'Closed' ? 'Paid' : 'Approved'} />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default WorkOrderDetailsPage;
