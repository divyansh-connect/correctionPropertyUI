import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api';
import { ScreeningCheck } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { RequestScreeningModal } from './RequestScreeningModal';
import { ScreeningReportDrawer } from './ScreeningReportDrawer';
import { Eye, Plus, Play, Loader2, ClipboardCheck } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const TenantScreeningPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScreening, setSelectedScreening] = useState<ScreeningCheck | null>(null);

  // Queries
  const { data: screenings = [], isLoading, error } = useQuery({
    queryKey: ['screening-checks-list'],
    queryFn: () => api.screening.getAll(),
  });

  const generateReportMutation = useMutation({
    mutationFn: (id: string) => api.screening.generateReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['screening-checks-list'] });
      alert('Mock screening check calculations complete! TransUnion report generated.');
    },
  });

  const filteredScreenings = screenings.filter((s) => {
    const nameMatch = s.applicantName.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = s.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPackage = packageFilter === '' || s.screeningPackage === packageFilter;
    const matchesStatus = statusFilter === '' || s.screeningStatus === statusFilter;

    return (nameMatch || emailMatch) && matchesPackage && matchesStatus;
  });

  const columns: ColumnDef<ScreeningCheck>[] = [
    { 
      accessorKey: 'applicantName', 
      header: 'Applicant Name', 
      id: 'applicantName', 
      cell: ({ row }) => <span className="font-bold">{row.original.applicantName}</span> 
    },
    { accessorKey: 'applicantEmail', header: 'Email', id: 'email' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit #', id: 'unit' },
    { accessorKey: 'screeningPackage', header: 'Package', id: 'package' },
    { 
      accessorKey: 'applicantStatus', 
      header: 'Applicant Status', 
      id: 'applicantStatus',
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-black uppercase ${
          row.original.applicantStatus === 'Submitted' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25' :
          row.original.applicantStatus === 'Started' ? 'text-amber-500 bg-amber-500/10 border-amber-500/25' :
          'text-muted-foreground bg-secondary/15 border-border/40'
        }`}>
          {row.original.applicantStatus}
        </span>
      )
    },
    { 
      accessorKey: 'screeningStatus', 
      header: 'Screening Status', 
      id: 'screeningStatus',
      cell: ({ row }) => <StatusBadge status={row.original.screeningStatus} />
    },
    { 
      accessorKey: 'paymentStatus', 
      header: 'Payment Status', 
      id: 'paymentStatus',
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-black uppercase ${
          row.original.paymentStatus === 'Paid' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25' :
          row.original.paymentStatus === 'Waived' ? 'text-blue-500 bg-blue-500/10 border-blue-500/25' :
          'text-rose-500 bg-rose-500/10 border-rose-500/25'
        }`}>
          {row.original.paymentStatus || 'Pending'}
        </span>
      )
    },
    { 
      accessorKey: 'creditRecommendation', 
      header: 'Credit Recommendation', 
      id: 'creditRecommendation',
      cell: ({ row }) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] border font-black uppercase ${
          row.original.creditRecommendation === 'Approved' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' :
          row.original.creditRecommendation === 'Conditional' ? 'text-amber-500 bg-amber-500/10 border-amber-500/30' :
          row.original.creditRecommendation === 'Review Recommended' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' :
          row.original.creditRecommendation === 'Declined' ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' :
          'text-muted-foreground bg-secondary/15'
        }`}>
          {row.original.creditRecommendation || 'Pending check'}
        </span>
      )
    },
    { accessorKey: 'invitationSentAt', header: 'Sent Date', id: 'sentDate' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {row.original.screeningStatus === 'Processing' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => generateReportMutation.mutate(row.original.id)}
              title="Run Check & Generate Report"
              disabled={generateReportMutation.isPending}
              className="text-emerald-500 hover:bg-emerald-500/10 border-emerald-500/30 h-7 w-7"
            >
              {generateReportMutation.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedScreening(row.original)}
            title="View Screening Report"
            className="h-7 w-7"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Tenant Screening & Applications"
        description="Verify applicant background history checks, TransUnion credit recommendations, and eviction registries."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Leasing' }, { label: 'Tenant Screening' }]}
        action={{
          label: 'Request Screening Check',
          onClick: () => setIsModalOpen(true),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search applicants or email..."
        filters={[
          {
            key: 'package',
            value: packageFilter,
            placeholder: 'All Packages',
            options: [
              { label: 'Basic Check', value: 'Basic' },
              { label: 'Comprehensive Check', value: 'Comprehensive' },
            ],
          },
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Pending Checks', value: 'Pending' },
              { label: 'Processing', value: 'Processing' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Approved', value: 'Approved' },
              { label: 'Declined', value: 'Declined' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'package') setPackageFilter(val);
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPackageFilter('');
          setStatusFilter('');
        }}
      />

      <DataTable
        columns={columns}
        data={filteredScreenings}
        loading={isLoading}
        error={error ? error.message : null}
      />

      {/* REQUEST DIALOG MODAL */}
      <RequestScreeningModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* SCREENING DETAIL REPORT DRAWER */}
      <ScreeningReportDrawer
        screening={selectedScreening}
        onClose={() => setSelectedScreening(null)}
      />
    </div>
  );
};
export default TenantScreeningPage;
