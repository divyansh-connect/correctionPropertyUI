import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { MaintenanceRequest } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { RequestPriorityBadge } from '../../components/MaintenanceComponents';
import { Eye } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { getFormattedRequestNumber } from '../../utils/format';

export const OwnerMaintenancePage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  // Queries
  const { data: maintenance = [], isLoading } = useQuery({ queryKey: ['owner-maintenance-list'], queryFn: () => api.ownerMaintenance.getAll() });

  const filteredMaint = maintenance.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<MaintenanceRequest>[] = [
    { accessorKey: 'id', header: t('owner.maintenance.requestNo'), id: 'id', cell: ({ row }) => <span className="font-bold">{getFormattedRequestNumber(row.original, row.index)}</span> },
    { accessorKey: 'title', header: t('owner.maintenance.subjectIssue'), id: 'title', cell: ({ row }) => <span className="font-bold">{row.original.title}</span> },
    { accessorKey: 'propertyName', header: t('owner.maintenance.locationProperty'), id: 'property' },
    { accessorKey: 'unitNumber', header: t('owner.maintenance.unit'), id: 'unit' },
    {
      accessorKey: 'priority',
      header: t('owner.maintenance.priority'),
      id: 'priority',
      cell: ({ row }) => <RequestPriorityBadge priority={row.original.priority as any} />,
    },
    {
      accessorKey: 'status',
      header: t('owner.maintenance.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: t('owner.maintenance.actions'),
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
        title={t('owner.maintenance.title')}
        description={t('owner.maintenance.desc')}
        breadcrumbs={[
          { label: t('header.home'), href: '/owner' },
          { label: t('nav.maintenance') },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('owner.maintenance.searchPlaceholder')}
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredMaint.slice(0, 100)} loading={isLoading} />

      {/* DETAIL DIALOG */}
      <FormDialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)} title={t('owner.maintenance.dialogTitle')}>
        {selectedRequest && (
          <div className="space-y-4 pt-2 text-xs font-semibold text-foreground">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-extrabold text-sm uppercase">Ticket #{selectedRequest.id.replace('sr-', '')}</p>
                <p className="text-muted-foreground">{selectedRequest.title}</p>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-[10px] uppercase">Issue Description</p>
              <p className="leading-relaxed bg-secondary/15 p-3 rounded-lg border font-medium">{selectedRequest.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Property Location</p>
                <p className="font-bold">{selectedRequest.propertyName} • Unit {selectedRequest.unitNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase">Resident Name</p>
                <p className="font-bold">{selectedRequest.tenantName}</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};
export default OwnerMaintenancePage;
