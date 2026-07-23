import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { InspectionRecord } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { InspectionChecklist } from '../../components/MaintenanceComponents';
import { Plus, Eye, Trash2, Printer } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const InspectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog state
  const [selectedIns, setSelectedIns] = useState<InspectionRecord | null>(null);

  // Queries
  const { data: inspections = [], isLoading } = useQuery({ queryKey: ['inspections-list'], queryFn: () => api.inspections.getAll() });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.inspections.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections-list'] });
    },
  });

  const filteredInspections = inspections.filter((ins) =>
    ins.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ins.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<InspectionRecord>[] = [
    { accessorKey: 'propertyName', header: 'Property Location', id: 'property', cell: ({ row }) => <span className="font-bold">{row.original.propertyName}</span> },
    { accessorKey: 'unitNumber', header: 'Unit', id: 'unit' },
    { accessorKey: 'type', header: 'Inspection Type', id: 'type' },
    { accessorKey: 'date', header: 'Inspection Date', id: 'date' },
    {
      accessorKey: 'checklist',
      header: 'Fails / Checklist',
      id: 'fails',
      cell: ({ row }) => {
        const fails = row.original.checklist.filter((item) => item.status === 'Fail').length;
        return (
          <span className={fails > 0 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
            {fails > 0 ? `${fails} Fails` : 'All Pass'}
          </span>
        );
      },
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
          <Button variant="ghost" size="icon" onClick={() => setSelectedIns(row.original)} title="View Checklist">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMutation.mutate(row.original.id)}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Property Inspections Log"
        description="Verify move-in, move-out, safety audits, and routine checklist records."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Maintenance', href: '/maintenance' },
          { label: 'Inspections' },
        ]}
        action={{
          label: 'Record Inspection Wizard',
          onClick: () => navigate({ to: '/inspections/new' }),
          icon: <Plus className="w-4.5 h-4.5" />,
        }}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search inspections by property or type..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredInspections.slice(0, 100)} loading={isLoading} />

      {/* INSPECTION CHECKLIST DIALOG */}
      <FormDialog open={!!selectedIns} onOpenChange={(open) => !open && setSelectedIns(null)} title="Property Inspection checklist">
        {selectedIns && (
          <div className="space-y-4 pt-2">
            <div className="flex justify-between border-b pb-2 text-xs font-semibold text-foreground">
              <div>
                <h4 className="font-extrabold text-sm uppercase">{selectedIns.type} Report</h4>
                <p className="text-muted-foreground mt-0.5">Property: {selectedIns.propertyName} • Unit: {selectedIns.unitNumber}</p>
              </div>
              <StatusBadge status={selectedIns.status} />
            </div>

            <InspectionChecklist checklist={selectedIns.checklist} readOnly={true} />

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedIns(null)}>Close</Button>
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-semibold">
                <Printer className="w-4 h-4" /> Print PDF Report
              </Button>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};
export default InspectionsPage;
