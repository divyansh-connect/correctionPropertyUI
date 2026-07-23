import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { DataTable } from '../../../components/DataTable';
import { Button } from '../../../components/ui/Button';
import { Eye, Copy, Trash2, CalendarRange } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const SavedReports: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: saved = [], isLoading } = useQuery({
    queryKey: ['saved-reports-list'],
    queryFn: () => api.savedReports.getAll(),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => api.savedReports.duplicate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-reports-list'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.savedReports.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-reports-list'] }),
  });

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Report Name', id: 'name' },
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'createdBy', header: 'Created By', id: 'createdBy' },
    { accessorKey: 'lastRun', header: 'Last Run Date', id: 'lastRun' },
    {
      accessorKey: 'isShared',
      header: 'Sharing',
      id: 'isShared',
      cell: ({ getValue }) => (getValue() ? 'Public' : 'Private'),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => alert(`Opening report ${row.original.name}`)} className="text-xs font-semibold flex items-center gap-1">
            <Eye className="w-3 h-3" /> Open
          </Button>
          <Button variant="outline" size="sm" onClick={() => duplicateMutation.mutate(row.original.id)} className="text-xs font-semibold flex items-center gap-1">
            <Copy className="w-3 h-3" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(row.original.id)} className="text-xs font-semibold text-rose-500 flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Reports"
        description="Access and manage your curated custom reports and parameters configurations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Saved' }]}
      />

      <DataTable columns={columns} data={saved} loading={isLoading} />
    </div>
  );
};
export default SavedReports;
