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
import { Eye, Plus, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const TenantMaintenancePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
