import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { MaintenanceRequest } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/StatusBadge';
import { RequestPriorityBadge } from '../../components/MaintenanceComponents';
import { Eye, Plus, Loader2, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const TenantMaintenancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newText, setNewText] = useState('');

  const postMessageMutation = useMutation({
    mutationFn: (text: string) => {
      return api.serviceRequests.update(selectedRequest?.id || '', {
        newMessage: {
          senderName: 'Sarah Connor (Resident)',
          role: 'Tenant',
          text,
        }
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-maintenance-list'] });
      setSelectedRequest(data as any);
      setNewText('');
    }
  });

  // Form states
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent' | 'Emergency'>('Medium');
  const [description, setDescription] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  // Queries
  const { data: maintenance = [], isLoading } = useQuery({ queryKey: ['tenant-maintenance-list'], queryFn: () => api.tenantMaintenance.getAll() });

  const createMutation = useMutation({
    mutationFn: () => {
      return api.tenantMaintenance.create({
        title,
        priority,
        description,
        preferredTime,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-maintenance-list'] });
      queryClient.invalidateQueries({ queryKey: ['tenant-dashboard-metrics'] });
      setIsFormOpen(false);
      setTitle('');
      setDescription('');
      setPreferredTime('');
    },
  });

  const filteredMaint = maintenance.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<MaintenanceRequest>[] = [
    { accessorKey: 'createdAt', header: 'Submitted Date', id: 'date' },
    { accessorKey: 'title', header: 'Subject Issue', id: 'title', cell: ({ row }) => <span className="font-bold">{row.original.title}</span> },
    {
      accessorKey: 'priority',
      header: 'Priority',
      id: 'priority',
      cell: ({ row }) => <RequestPriorityBadge priority={row.original.priority as any} />,
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
        <Button variant="ghost" size="icon" onClick={() => setSelectedRequest(row.original)} title="View Progress">
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Maintenance Request logs"
        description="Verify manager dispatch timelines, contractor schedules, or file a new service request."
        breadcrumbs={[
          { label: 'Home', href: '/tenant' },
          { label: 'Maintenance' },
        ]}
        action={{
          label: 'Create Maintenance Request',
          onClick: () => setIsFormOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search service requests..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredMaint} loading={isLoading} />

      {/* DETAIL DIALOG */}
      <FormDialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)} title="Service Request Details">
        {selectedRequest && (
          <div className="space-y-4 pt-2 text-xs font-semibold text-foreground">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-extrabold text-sm uppercase">Request Details</p>
                <p className="text-muted-foreground mt-0.5">{selectedRequest.title}</p>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-[10px] uppercase">Description</p>
              <p className="leading-relaxed bg-secondary/15 p-3 rounded-lg border font-medium">{selectedRequest.description}</p>
            </div>

            {selectedRequest.preferredTime && (
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Preferred Visit Time</p>
                <p className="font-bold">{selectedRequest.preferredTime}</p>
              </div>
            )}

            {/* Discussion / Comments thread */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-muted-foreground text-[10px] uppercase font-black">Discussion & Updates</p>
              
              <div className="space-y-2.5 max-h-52 overflow-y-auto p-3 bg-secondary/15 rounded-lg border flex flex-col">
                {selectedRequest.messages && selectedRequest.messages.length > 0 ? (
                  selectedRequest.messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex flex-col space-y-0.5 p-2.5 rounded-lg max-w-[85%] text-xs font-semibold ${
                        m.role === 'Tenant' ? 'bg-primary/10 border border-primary/20 self-end ml-auto' : 'bg-card border self-start'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-4 border-b border-border/20 pb-0.5 mb-0.5">
                        <span className="font-black uppercase text-[9px] text-primary">{m.senderName}</span>
                        <span className="text-[8px] text-muted-foreground font-mono">{m.timestamp}</span>
                      </div>
                      <p className="text-foreground leading-relaxed font-semibold">{m.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-muted-foreground italic text-center font-semibold">No discussions logged yet.</p>
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
                  placeholder="Ask a question or update manager..."
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                  required
                />
                <Button type="submit" size="sm" disabled={postMessageMutation.isPending || !newText.trim()} className="flex items-center gap-1 h-8">
                  <Send className="w-3 h-3" /> Send
                </Button>
              </form>
            </div>

            {/* Landlord contact channels */}
            <div className="border-t pt-4 mt-4 space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-black">Direct Contact Channels</p>
              <div className="flex gap-2 pt-1 font-bold text-xs">
                <a 
                  href={`sms:5550199`} 
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-secondary/20 hover:bg-secondary/40 border border-border/40 rounded-xl transition text-foreground"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  <span>SMS</span>
                </a>
                <a 
                  href={`mailto:manager@apexpm.com`} 
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-secondary/20 hover:bg-secondary/40 border border-border/40 rounded-xl transition text-foreground"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>Email</span>
                </a>
                <a 
                  href={`https://wa.me/5550199`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-xl transition text-foreground"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
            </div>
          </div>
        )}
      </FormDialog>

      {/* CREATE REQUEST DIALOG */}
      <FormDialog open={isFormOpen} onOpenChange={setIsFormOpen} title="Submit Repair Request">
        <div className="space-y-4 pt-2 text-xs font-semibold text-foreground">
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Problem Summary</label>
            <Input placeholder="E.g., Dishwasher kitchen leakage" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Priority Level</label>
              <Select value={priority} onChange={(e: any) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
                <option value="Emergency">Emergency</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Preferred Visit Window</label>
              <Input placeholder="E.g., Mon/Wed Morning" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">In-Depth Description</label>
            <textarea
              className="w-full min-h-[100px] p-2.5 rounded-lg border bg-card text-foreground"
              placeholder="Describe what occurred, exact locations, and appliance models..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} disabled={!title || !description || createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Submit Request
            </Button>
          </div>

        </div>
      </FormDialog>
    </div>
  );
};
export default TenantMaintenancePage;
