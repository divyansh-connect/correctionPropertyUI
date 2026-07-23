import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { AuditTimeline } from '../components/AuditTimeline';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Download } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [moduleFilter, setModuleFilter] = useState('All');

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: () => api.auditLogs.getAll(),
  });

  const filtered = moduleFilter === 'All'
    ? logs
    : logs.filter((l) => l.module === moduleFilter);

  const handleExport = () => {
    alert('Exporting system audit logs to CSV...');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Inspect system event timestamps, authorization entries, metadata changes, and administrator edits."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Audit Logs' }]}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-muted-foreground font-semibold">Filter Module:</span>
          <Select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
            <option value="All">All Modules</option>
            <option value="Security">Security</option>
            <option value="Properties">Properties</option>
            <option value="Administration">Administration</option>
          </Select>
        </div>
        <Button onClick={handleExport} className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5 w-full sm:w-auto">
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">Parsing ledger event logs...</div>
      ) : (
        <AuditTimeline logs={filtered} />
      )}
    </div>
  );
};
export default AuditLogsPage;
