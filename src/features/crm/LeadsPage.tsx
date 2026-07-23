import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Lead } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { KanbanBoard } from '../../components/KanbanBoard';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Plus, Eye, Kanban, Table, Calendar, Clock, 
  Trash2, UserCheck, AlertOctagon, Loader2 
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Dialog triggers
  const [tourLead, setTourLead] = useState<Lead | null>(null);
  const [tourTime, setTourTime] = useState('');
  
  const [convertLead, setConvertLead] = useState<Lead | null>(null);

  // Queries
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: () => api.leasing.getLeads(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => {
      // simulate updating in local mock db
      return api.leasing.createLead({ id, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (lead: Lead) => {
      // create tenant from lead
      await api.tenant.create({
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        status: 'Active',
      });
      // mark lead lost or lease signed
      return api.leasing.createLead({ id: lead.id, status: 'Lease Signed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setConvertLead(null);
    },
  });

  const filteredLeads = leads.filter((l) => {
    const nameMatch = `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProp = propertyFilter === '' || l.propertyOfInterestId === propertyFilter;
    const matchesStatus = statusFilter === '' || l.status === statusFilter;
    return nameMatch && matchesProp && matchesStatus;
  });

  // Kanban Pipeline Stages mapping
  const pipelineStages = [
    { label: 'New', value: 'New' },
    { label: 'Contacted', value: 'Contacted' },
    { label: 'Tour Scheduled', value: 'Tour Scheduled' },
    { label: 'Application Sent', value: 'Application Sent' },
    { label: 'Negotiating', value: 'Negotiating' },
    { label: 'Lease Signed', value: 'Lease Signed' },
    { label: 'Lost', value: 'Lost' },
  ];

  // Convert leads list to KanbanItem format
  const kanbanItems = filteredLeads.map((l) => {
    // Generate simple mock values
    const budgetVal = 1400 + (parseInt(l.id.split('-').pop() || '0') % 4) * 200;
    return {
      id: l.id,
      title: `${l.firstName} ${l.lastName}`,
      subtitle: l.propertyName,
      budget: budgetVal,
      date: l.createdAt,
      status: l.status,
      priority: parseInt(l.id.split('-').pop() || '0') % 2 === 0 ? 'High' : 'Medium',
    };
  });

  const tableColumns: ColumnDef<Lead>[] = [
    {
      accessorKey: 'firstName',
      header: 'Lead Name',
      id: 'name',
      cell: ({ row }) => (
        <span
          onClick={() => navigate({ to: `/leads/${row.original.id}` })}
          className="font-bold text-foreground hover:text-primary transition-colors cursor-pointer"
        >
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    },
    { accessorKey: 'email', header: 'Email', id: 'email' },
    { accessorKey: 'phone', header: 'Phone', id: 'phone' },
    { accessorKey: 'propertyName', header: 'Property Preference', id: 'property' },
    {
      id: 'budget',
      header: 'Budget',
      cell: ({ row }) => {
        const budgetVal = 1400 + (parseInt(row.original.id.split('-').pop() || '0') % 4) * 200;
        return <span className="font-semibold text-emerald-500">${budgetVal.toLocaleString()}/mo</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Stage',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/leads/${row.original.id}` })} title="View Lead">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTourLead(row.original)}
            className="text-amber-500 hover:bg-amber-500/10"
            title="Schedule Tour"
          >
            <Clock className="w-4 h-4" />
          </Button>
          {row.original.status !== 'Lease Signed' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConvertLead(row.original)}
              className="text-emerald-500 hover:bg-emerald-500/10"
              title="Convert Resident"
            >
              <UserCheck className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Leads Pipeline"
        description="Verify visitors pipeline interest, schedule viewing tours, and track conversions."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'CRM', href: '/crm' },
          { label: 'Leads' },
        ]}
        action={{
          label: 'Add Lead',
          onClick: () => navigate({ to: '/leads/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      {/* VIEW TOGGLES */}
      <div className="flex justify-between items-center mb-5 bg-card/65 p-2 rounded-xl border border-border/80">
        <span className="text-xs font-bold text-muted-foreground uppercase pl-2">
          Pipeline View Mode
        </span>
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Kanban className="w-3.5 h-3.5" /> Kanban Board
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Table className="w-3.5 h-3.5" /> Table Directory
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="text-xs font-bold flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Tours Calendar
          </Button>
        </div>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search leads by name..."
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
            placeholder: 'All Stages',
            options: pipelineStages.map((s) => ({ label: s.label, value: s.value })),
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
        }}
      />

      {/* VIEW CONDITIONAL RENDERING */}
      {viewMode === 'kanban' && (
        <KanbanBoard
          columns={pipelineStages}
          items={kanbanItems}
          onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status: status as any })}
          onItemClick={(id) => navigate({ to: `/leads/${id}` })}
        />
      )}

      {viewMode === 'table' && (
        <DataTable columns={tableColumns} data={filteredLeads} loading={isLoading} error={error ? error.message : null} />
      )}

      {viewMode === 'calendar' && (
        <Card className="p-8 text-center border-border">
          <Calendar className="w-8 h-8 text-muted-foreground/60 mx-auto mb-4 animate-bounce-slow" />
          <h4 className="font-bold text-sm">Tour Appointments Calendar</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Showing 4 viewings scheduled today. Check lead detail dashboard timelines to update viewing slots.
          </p>
        </Card>
      )}

      {/* TOUR SCHEDULE MODAL */}
      <FormDialog
        open={!!tourLead}
        onOpenChange={(open) => !open && setTourLead(null)}
        title="Schedule Viewing Tour"
      >
        {tourLead && (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">Select date/time slot for {tourLead.firstName} {tourLead.lastName}.</p>
            <Input type="datetime-local" value={tourTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTourTime(e.target.value)} />
            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="outline" onClick={() => setTourLead(null)}>Cancel</Button>
              <Button
                onClick={() => {
                  updateStatusMutation.mutate({ id: tourLead.id, status: 'Tour Scheduled' });
                  setTourLead(null);
                }}
                disabled={!tourTime}
              >
                Schedule Tour
              </Button>
            </div>
          </div>
        )}
      </FormDialog>

      {/* CONVERT LEAD MODAL */}
      <FormDialog
        open={!!convertLead}
        onOpenChange={(open) => !open && setConvertLead(null)}
        title="Convert Lead to Resident Tenant"
      >
        {convertLead && (
          <div className="space-y-4 pt-2 text-xs font-semibold">
            <p className="text-muted-foreground">
              Are you sure you want to promote {convertLead.firstName} {convertLead.lastName} to a resident tenant?
              This will create a new Active profile in the Tenant Directory.
            </p>
            <div className="flex justify-end space-x-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setConvertLead(null)}>Cancel</Button>
              <Button
                onClick={() => convertMutation.mutate(convertLead)}
                disabled={convertMutation.isPending}
              >
                {convertMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Confirm Promotion
              </Button>
            </div>
          </div>
        )}
      </FormDialog>

    </div>
  );
};
export default LeadsPage;
