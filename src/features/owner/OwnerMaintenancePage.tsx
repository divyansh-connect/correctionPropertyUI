import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

export const OwnerMaintenancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  // Queries
  const { data: maintenance = [], isLoading } = useQuery({ queryKey: ['owner-maintenance-list'], queryFn: () => api.ownerMaintenance.getAll() });

  const filteredMaint = maintenance.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<MaintenanceRequest>[] = [
    { accessorKey: 'id', header: 'Request NO', id: 'id', cell: ({ row }) => <span className="font-bold">#{row.original.id.replace('sr-', '')}</span> },
    { accessorKey: 'title', header: 'Subject Issue', id: 'title', cell: ({ row }) => <span className="font-bold">{row.original.title}</span> },
    { accessorKey: 'propertyName', header: 'Location Property', id: 'property' },
    { accessorKey: 'unitNumber', header: 'Unit', id: 'unit' },
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
        title="Portfolio Maintenance Tickets"
        description="Verify contractor dispatches progress and repairs costs deductions."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Maintenance' },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search tickets by property or subject..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredMaint.slice(0, 100)} loading={isLoading} />

      {/* DETAIL DIALOG */}
      <FormDialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)} title="Maintenance Dispatch Progress">
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
