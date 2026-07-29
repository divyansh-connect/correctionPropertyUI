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
import { CheckCircle, AlertTriangle, User, Calendar, Clock, Lock, MessageSquare, Phone, Mail, Send } from 'lucide-react';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams({ from: '/maintenance/requests/$id' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [assignedCost, setAssignedCost] = useState<string>('');
  const [newText, setNewText] = useState('');

  // Queries
  const { data: request, isLoading } = useQuery({
    queryKey: ['service-request-detail', id],
    queryFn: () => api.serviceRequests.getById(id),
  });

  const { data: vendorsList = [] } = useQuery({ queryKey: ['vendors-list'], queryFn: () => api.vendors.getAll() });

  const postMessageMutation = useMutation({
    mutationFn: (text: string) => {
      return api.serviceRequests.update(id, {
        newMessage: {
          senderName: 'Property Manager Staff',
          role: 'Manager',
          text,
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-request-detail', id] });
      setNewText('');
    }
  });

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
                <option value="">Select Maintenance Staff...</option>
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

          {/* Discussion log / comments thread */}
          <div className="border-t pt-6 space-y-4">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-primary" /> In-App Tenant Message Thread
            </h4>
            
            <div className="space-y-3 max-h-72 overflow-y-auto p-4 bg-secondary/15 rounded-xl border border-border/40 flex flex-col">
              {request.messages && request.messages.length > 0 ? (
                request.messages.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex flex-col space-y-1 p-3 rounded-xl max-w-[85%] text-xs font-semibold ${
                      m.role === 'Manager' ? 'bg-primary/10 border border-primary/20 self-end ml-auto' : 'bg-card border self-start'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-4 border-b border-border/20 pb-1 mb-1">
                      <span className="font-black uppercase text-[10px] text-primary">{m.senderName}</span>
                      <span className="text-[9px] text-muted-foreground font-mono">{m.timestamp}</span>
                    </div>
                    <p className="text-foreground leading-relaxed font-semibold">{m.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic text-center font-semibold">No messages on this request yet.</p>
              )}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newText.trim()) {
                  postMessageMutation.mutate(newText);
                }
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Type message update to resident..."
                value={newText}
                onChange={e => setNewText(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                required
              />
              <Button type="submit" size="sm" disabled={postMessageMutation.isPending || !newText.trim()} className="flex items-center gap-1 h-10">
                <Send className="w-3.5 h-3.5" /> Send
              </Button>
            </form>
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
              <p className="text-[10px] text-muted-foreground uppercase">Assigned Maintenance Staff</p>
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

            {/* Resident contact details */}
            <div className="border-t pt-4 mt-4 space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-black">Direct Contact Channels</p>
              <div className="flex flex-col gap-2 pt-1.5 font-bold text-xs">
                <a 
                  href={`sms:5550199`} 
                  className="flex items-center justify-between p-2.5 bg-secondary/20 hover:bg-secondary/40 border border-border/40 rounded-xl transition text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>SMS Tenant</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">555-0199</span>
                </a>
                <a 
                  href={`mailto:${(request.tenantName || 'tenant').toLowerCase().replace(' ', '')}@rentals.com`} 
                  className="flex items-center justify-between p-2.5 bg-secondary/20 hover:bg-secondary/40 border border-border/40 rounded-xl transition text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Email Tenant</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[100px]">
                    {(request.tenantName || 'tenant').toLowerCase().replace(' ', '')}@rentals.com
                  </span>
                </a>
                <a 
                  href={`https://wa.me/5550199`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-between p-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl transition text-foreground"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp Chat</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default RequestDetailsPage;
