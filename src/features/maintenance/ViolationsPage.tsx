import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { Violation } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Wrench, ShieldAlert, Eye, Download, Info } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ViolationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Queries
  const { data: violations = [], isLoading } = useQuery({ 
    queryKey: ['violations-list'], 
    queryFn: () => api.violations.getAll() 
  });

  const createWorkOrderMutation = useMutation({
    mutationFn: (id: string) => api.violations.createWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['violations-list'] });
      queryClient.invalidateQueries({ queryKey: ['work-orders-list'] });
      alert('Corrective Work Order has been successfully generated and dispatched.');
    },
  });

  const filteredViolations = violations.filter((v) => {
    const authorityVal = v.issuingAuthority || '';
    const descVal = v.description || '';
    const searchMatch = 
      authorityVal.toLowerCase().includes(searchQuery.toLowerCase()) || 
      descVal.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.violationCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const severityMatch = severityFilter === '' || v.severity === severityFilter;
    const statusMatch = statusFilter === '' || v.status === statusFilter;
    return searchMatch && severityMatch && statusMatch;
  });

  const handleExport = () => {
    const headers = 'ID,Code,Authority,Property,Unit,Severity,Status,Fine,Due Date\n';
    const rows = filteredViolations
      .slice(0, 500)
      .map(
        (v) =>
          `"${v.id}","${v.violationCode}","${v.issuingAuthority}","${v.propertyName}","${v.unitNumber || ''}","${v.severity}","${v.status}","${v.fineAmount}","${v.dueDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Maintenance_Violations.csv');
    a.click();
  };

  const columns: ColumnDef<Violation>[] = [
    {
      accessorKey: 'violationCode',
      header: t('maintenanceViolations.violationCode'),
      id: 'violationCode',
      cell: ({ row }) => (
        <span className="font-extrabold text-rose-500 font-mono">
          {row.original.violationCode}
        </span>
      ),
    },
    { accessorKey: 'issuingAuthority', header: t('maintenanceViolations.issuingAuthority'), id: 'issuingAuthority' },
    {
      accessorKey: 'propertyName',
      header: t('maintenanceRequests.propertyLocation'),
      id: 'property',
      cell: ({ row }) => (
        <div>
          <p className="font-bold">{row.original.propertyName}</p>
          <p className="text-[10px] text-muted-foreground">{t('maintenanceRequests.unit')}: {row.original.unitNumber || 'All Building'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'fineAmount',
      header: t('maintenanceViolations.fineAmount'),
      id: 'fine',
      cell: ({ row }) => (
        <span className="font-bold text-rose-500">
          ${row.original.fineAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    { accessorKey: 'dueDate', header: t('maintenanceViolations.dueDate'), id: 'dueDate' },
    {
      accessorKey: 'severity',
      header: t('maintenanceRequests.priority'),
      id: 'severity',
      cell: ({ row }) => (
        <StatusBadge status={row.original.severity} />
      ),
    },
    {
      accessorKey: 'status',
      header: t('maintenanceRequests.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: t('maintenanceRequests.actions'),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {row.original.status !== 'Resolved' && !row.original.workOrderId ? (
            <Button
              size="sm"
              onClick={() => createWorkOrderMutation.mutate(row.original.id)}
              className="flex items-center gap-1 text-[10px] py-1 bg-amber-500 hover:bg-amber-600 text-white font-extrabold uppercase leading-none"
            >
              <Wrench className="w-3 h-3" /> Fix Issue
            </Button>
          ) : row.original.workOrderId ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate({ to: `/maintenance/work-orders/${row.original.workOrderId}` })}
              className="flex items-center gap-1 text-[10px] py-1 font-bold border-amber-500/20 text-amber-500 hover:bg-amber-500/5 bg-transparent"
            >
              <Info className="w-3 h-3" /> Linked WO
            </Button>
          ) : (
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
              Settled
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('maintenanceViolations.title')}
        description={t('maintenanceViolations.desc')}
        breadcrumbs={[{ label: t('header.home'), href: '/' }, { label: t('nav.maintenance'), href: '/maintenance' }, { label: t('maintenanceViolations.title') }]}
        action={{
          label: t('maintenanceRequests.exportCsv'),
          onClick: handleExport,
          icon: <Download className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search violations by authority, description, code..."
        filters={[
          {
            key: 'severity',
            value: severityFilter,
            placeholder: 'All Severities',
            options: [
              { label: 'Critical Alert', value: 'Critical' },
              { label: 'Warning Notice', value: 'Warning' },
            ],
          },
          {
            key: 'status',
            value: statusFilter,
            placeholder: 'All Statuses',
            options: [
              { label: 'Open Violation', value: 'Open' },
              { label: 'Resolved Compliant', value: 'Resolved' },
              { label: 'Disputed Claim', value: 'Disputed' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'severity') setSeverityFilter(val);
          if (key === 'status') setStatusFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setSeverityFilter('');
          setStatusFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredViolations} loading={isLoading} />
    </div>
  );
};

export default ViolationsPage;
