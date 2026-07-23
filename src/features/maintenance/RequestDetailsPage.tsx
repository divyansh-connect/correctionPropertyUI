import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { RequestPriorityBadge } from '../../components/MaintenanceComponents';
import { StatusBadge } from '../../components/StatusBadge';
import { CheckCircle, AlertTriangle, User, Calendar, Clock, Lock } from 'lucide-react';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/maintenance/requests/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [assignedCost, setAssignedCost] = useState<string>('');

  // Queries
  const { data: request, isLoading } = useQuery({
    queryKey: ['service-request-detail', id],
    queryFn: () => api.serviceRequests.getById(id),
  });

  const { data: vendorsList = [] } = useQuery({ queryKey: ['vendors-list'], queryFn: () => api.vendors.getAll() });

  const approveMutation = useMutation({
    mutationFn: () => api.serviceRequests.update(id, { status: 'Approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-detail', id] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ vendorId, cost }: { vendorId: string; cost: number }) => {
      const v = vendorsList.find((v) => v.id === vendorId);
      return api.serviceRequests.update(id, {
        status: 'Assigned',
        assignedVendorId: vendorId,
        assignedVendorName: v ? v.name : 'Assigned Vendor',
        cost: cost,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-detail', id] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (cost?: number) => api.serviceRequests.update(id, { status: 'Completed', cost }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-detail', id] });
    },
  });

  if (isLoading || !request) {
    return <LoadingSkeleton type="details" />;
  }

  return (
    <div className="space-y-6 text-foreground max-w-4xl">
      <PageHeader
        title={`Service Ticket Details - #${request.id.replace('sr-', '')}`}
        description="Verify service diagnostics, update statuses, or assign service contractors."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Requests', href: '/maintenance/requests' },
          { label: 'Details' },
        ]}
      />

      {/* STATUS OVERVIEW */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-card border rounded-2xl gap-3">
        <div className="flex items-center space-x-3.5">
          <StatusBadge status={request.status} />
          <RequestPriorityBadge priority={request.priority as any} />
        </div>

        <div className="flex space-x-2 items-center">
          {request.status === 'New' && (
            <Button size="sm" onClick={() => approveMutation.mutate()}>Approve Ticket</Button>
          )}
          {request.status === 'Approved' && (
            <div className="flex items-center space-x-2">
              <select
                className="text-xs p-1.5 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-8"
                onChange={(e) => setSelectedVendorId(e.target.value)}
                value={selectedVendorId}
              >
                <option value="">Select Vendor...</option>
                {vendorsList.slice(0, 15).map((v) => (
                  <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Enter cost ($)..."
                value={assignedCost}
                onChange={(e) => setAssignedCost(e.target.value)}
                className="text-xs p-1.5 rounded-lg border bg-background text-foreground w-28 focus:outline-none focus:ring-1 focus:ring-primary h-8"
              />
              <Button 
                size="sm" 
                onClick={() => {
                  if (selectedVendorId && assignedCost) {
                    assignMutation.mutate({ 
                      vendorId: selectedVendorId, 
                      cost: Number(assignedCost) 
                    });
                  }
                }}
                disabled={!selectedVendorId || !assignedCost}
                className="bg-primary hover:bg-primary/95 text-white font-bold h-8 text-[11px]"
              >
                Assign & Dispatch
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate({ to: '/maintenance/requests' })}>Back to List</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Columns - Details */}
        <Card className="md:col-span-2 p-6 border bg-card space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-extrabold uppercase tracking-wide border-b pb-2">{request.title}</h3>
            <p className="text-xs font-semibold text-muted-foreground pt-2">Issue Description:</p>
            <p className="text-xs leading-relaxed font-medium bg-secondary/10 p-3.5 border rounded-xl">{request.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-3.5 bg-secondary/15 rounded-xl border border-border/40">
              <p className="text-muted-foreground text-[10px] uppercase">Property Location</p>
              <p className="font-bold text-sm mt-1">{request.propertyName}</p>
              <p className="text-muted-foreground">Unit: {request.unitNumber}</p>
            </div>

            <div className="p-3.5 bg-secondary/15 rounded-xl border border-border/40">
              <p className="text-muted-foreground text-[10px] uppercase">Resident Payee</p>
              <p className="font-bold text-sm mt-1">{request.tenantName}</p>
            </div>
          </div>
        </Card>

        {/* Right Column - Auditing */}
        <Card className="md:col-span-1 p-6 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Access & Scheduling</h3>
          
          <div className="space-y-3.5 text-xs font-semibold">
            <div className="flex items-center space-x-2">
              <Clock className="w-4.5 h-4.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Preferred Visit Time</p>
                <p>{request.preferredTime || 'Anytime'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Lock className="w-4.5 h-4.5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Permission to Enter</p>
                <p className="text-emerald-500 font-extrabold">Granted</p>
              </div>
            </div>

            <div className="border-t pt-3.5 mt-2">
              <p className="text-[10px] text-muted-foreground uppercase">Assigned Vendor</p>
              <p className="font-bold mt-0.5">{request.assignedVendorName || 'Not Assigned Yet'}</p>
            </div>

            {request.cost !== undefined && request.cost > 0 && (
              <div className="border-t pt-3.5 mt-2 animate-fade-in">
                <p className="text-[10px] text-muted-foreground uppercase">
                  {request.status === 'Completed' ? 'Final Actual Cost' : 'Estimated Cost'}
                </p>
                <p className="font-bold text-emerald-500 mt-0.5">${request.cost}</p>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};
export default RequestDetailsPage;
