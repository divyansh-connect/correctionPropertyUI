import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { Violation } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/Dialog';
import { Wrench, ShieldAlert, Eye, Download, Info, Building2, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ViolationsPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sync Modal states
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [binNumber, setBinNumber] = useState('4115368');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success?: boolean; message?: string; count?: number } | null>(null);

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
      queryClient.invalidateQueries({ queryKey: ['service-requests-list'] });
      alert('Dispatched! Violation is now converted into a Service Request. You can assign it from Service Requests.');
    },
  });

  const handleOpenSyncModal = () => {
    setSyncResult(null);
    setIsSyncModalOpen(true);
  };

  const handleExecuteSync = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanBin = binNumber.trim();
    if (!cleanBin) return;

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const result: any = await api.violations.syncDob(cleanBin);
      queryClient.invalidateQueries({ queryKey: ['violations-list'] });
      const count = result?.syncedCount ?? 0;
      setSyncResult({
        success: true,
        message: `Successfully fetched and synced ${count} violation(s) for BIN ${cleanBin} from NYC Open Data.`,
        count,
      });
    } catch (err: any) {
      console.error('DOB Sync failed', err);
      setSyncResult({
        success: false,
        message: err?.response?.data?.message || 'Failed to connect to NYC DOB Open Data API. Please verify the BIN number.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

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

  const columns: ColumnDef<Violation>[] = [
    {
      accessorKey: 'violationCode',
      header: 'Violation Reference',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.original.violationCode}</span>
          <span className="text-xs text-muted-foreground">{row.original.issuingAuthority || 'NYC DOB'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'propertyName',
      header: 'Property / Location',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{row.original.propertyName || 'Building Asset'}</span>
          <span className="text-xs text-muted-foreground">Unit: {row.original.unitNumber || 'All Units'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Code Description',
      cell: ({ row }) => (
        <p className="text-xs text-muted-foreground line-clamp-2 max-w-md" title={row.original.description}>
          {row.original.description}
        </p>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
            row.original.severity === 'Critical'
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
              : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}
        >
          {row.original.severity}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Compliance Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'fineAmount',
      header: 'Fine Amount',
      cell: ({ row }) => (
        <span className="font-mono text-sm font-semibold text-foreground">
          ${(row.original.fineAmount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Corrective Action',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.status === 'Resolved' || row.original.status === 'Settled' ? (
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
              Settled
            </span>
          ) : row.original.status === 'Disputed' || row.original.workOrderId ? (
            <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
              Dispatched
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10"
              onClick={() => createWorkOrderMutation.mutate(row.original.id)}
              disabled={createWorkOrderMutation.isPending}
            >
              <Wrench className="w-3.5 h-3.5" />
              Dispatch
            </Button>
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
          label: 'Sync NYC DOB',
          onClick: handleOpenSyncModal,
          icon: <ShieldAlert className="w-4.5 h-4.5" />,
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

      {/* Sync NYC DOB React Modal Popup */}
      <Dialog open={isSyncModalOpen} onOpenChange={setIsSyncModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <DialogTitle className="text-lg font-bold">Sync NYC DOB Violations</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Enter the NYC Building Identification Number (BIN) to fetch live violations directly from NYC Open Data (Socrata API).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleExecuteSync} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>NYC BIN (Building Identification Number)</span>
                <span className="text-[10px] text-muted-foreground font-normal">7-Digit NYC Code</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 4115368"
                value={binNumber}
                onChange={(e) => setBinNumber(e.target.value)}
                className="font-mono text-sm"
                autoFocus
              />
            </div>

            {syncResult && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
                  syncResult.success
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400'
                }`}
              >
                {syncResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                )}
                <div>
                  <p className="font-semibold">{syncResult.success ? 'Sync Successful' : 'Sync Failed'}</p>
                  <p className="mt-0.5 opacity-90">{syncResult.message}</p>
                </div>
              </div>
            )}

            <div className="bg-muted/40 p-2.5 rounded-lg border border-border/50 text-[11px] text-muted-foreground flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>Dataset ID: <code className="font-mono text-foreground font-semibold">3h2n-5cm9</code> (NYC DOB Open Data)</span>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSyncModalOpen(false)}
                disabled={isSyncing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSyncing || !binNumber.trim()}
                className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Sync Violations
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViolationsPage;
