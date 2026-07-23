import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { Application } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Eye, Check, X, ShieldAlert, FileText, Loader2, ArrowRight } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Queries
  const { data: apps = [], isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: () => api.leasing.getApplications(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      // update status in mock API
      return api.leasing.updateApplication(id, { status: 'Approved' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setSelectedApp(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.leasing.updateApplication(id, { status: 'Rejected' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setSelectedApp(null);
    },
  });

  const filteredApps = apps.filter((app) => {
    const nameVal = app.tenantName || '';
    const nameMatch = nameVal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || app.status === statusFilter;
    return nameMatch && matchesStatus;
  });

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: 'tenantName',
      header: 'Applicant',
      id: 'applicant',
      cell: ({ row }) => (
        <span
          onClick={() => setSelectedApp(row.original)}
          className="font-bold text-primary hover:underline cursor-pointer"
        >
          {row.original.tenantName}
        </span>
      ),
    },
    { accessorKey: 'propertyName', header: 'Interested Property', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit #', id: 'unit' },
    { accessorKey: 'submittedDate', header: 'Submission Date', id: 'submittedDate' },
    {
      id: 'creditScore',
      header: 'Credit Score',
      cell: ({ row }) => {
        // mock score placeholder
        const score = 650 + (parseInt(row.original.id.split('-').pop() || '0') % 150);
        return (
          <span className={`font-bold ${score >= 700 ? 'text-emerald-500' : 'text-amber-500'}`}>
            {score}
          </span>
        );
      },
    },
    {
      accessorKey: 'rentProposed',
      header: 'Proposed Rent',
      id: 'rentProposed',
      cell: ({ row }) => <span className="font-semibold">${row.original.rentProposed.toLocaleString()}</span>,
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
          <Button variant="ghost" size="icon" onClick={() => setSelectedApp(row.original)} title="Review Application">
            <Eye className="w-4 h-4" />
          </Button>
          {row.original.status === 'Pending' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-emerald-500 hover:bg-emerald-500/10"
                onClick={() => approveMutation.mutate(row.original.id)}
                title="Approve"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-500 hover:bg-rose-500/10"
                onClick={() => rejectMutation.mutate(row.original.id)}
                title="Reject"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          {row.original.status === 'Approved' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/leases/new' })}
              className="text-xs font-semibold flex items-center gap-1"
            >
              Convert to Lease <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Background Applications"
        description="Oversee applicant credit evaluations, income streams, and screening logs."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Leasing', href: '/leasing/leases' },
          { label: 'Applications' },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search applicants by name..."
        filters={[
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Pending', value: 'Pending' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Rejected', value: 'Rejected' },
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

      <DataTable columns={columns} data={filteredApps} loading={isLoading} error={error ? error.message : null} />

      {/* APPLICANT REVIEW DRAWER / DIALOG */}
      <FormDialog
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
        title="Applicant Screening Record"
      >
        {selectedApp && (
          <div className="space-y-6 pt-3 text-xs font-semibold text-foreground">
            <div className="flex items-center space-x-3 p-4 bg-secondary/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {selectedApp.tenantName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm">{selectedApp.tenantName}</h4>
                <p className="text-muted-foreground text-[10px]">{selectedApp.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Property Interest</p>
                <p className="text-foreground mt-0.5">{selectedApp.propertyName} - Unit {selectedApp.unitNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Proposed Monthly Rent</p>
                <p className="text-foreground mt-0.5">${selectedApp.rentProposed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Income Verification</p>
                <p className="text-foreground mt-0.5">$5,200/mo (Verified via W2)</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Credit Score Rating</p>
                <p className="text-emerald-500 font-bold mt-0.5">720 (Excellent)</p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-4">
              <h5 className="font-bold uppercase text-[10px] tracking-wide text-muted-foreground">Screening Checklists</h5>
              <div className="flex justify-between items-center bg-secondary/10 p-2.5 rounded-lg border">
                <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-emerald-500" /> Criminal Eviction check</span>
                <span className="text-emerald-500">CLEARED</span>
              </div>
              <div className="flex justify-between items-center bg-secondary/10 p-2.5 rounded-lg border">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> Reference validation</span>
                <span className="text-emerald-500">SUCCESS</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
              {selectedApp.status === 'Pending' && (
                <>
                  <Button
                    variant="outline"
                    className="text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                    onClick={() => rejectMutation.mutate(selectedApp.id)}
                  >
                    Reject Applicant
                  </Button>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => approveMutation.mutate(selectedApp.id)}
                  >
                    Approve Application
                  </Button>
                </>
              )}
              {selectedApp.status === 'Approved' && (
                <Button onClick={() => navigate({ to: '/leases/new' })}>
                  Convert to Lease
                </Button>
              )}
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};
export default ApplicationsPage;
