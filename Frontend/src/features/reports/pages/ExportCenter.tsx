import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { DataTable } from '../../../components/DataTable';
import { Button } from '../../../components/ui/Button';
import { Download, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ExportCenter: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: exports = [], isLoading } = useQuery({
    queryKey: ['export-center-list'],
    queryFn: () => api.exports.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.exports.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['export-center-list'] }),
  });

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'name', header: 'Export Filename', id: 'name' },
    { accessorKey: 'type', header: 'File Format', id: 'type' },
    { accessorKey: 'createdAt', header: 'Created Date', id: 'createdAt' },
    { accessorKey: 'createdBy', header: 'User', id: 'createdBy' },
    {
      accessorKey: 'status',
      header: 'Job Status',
      id: 'status',
      cell: ({ getValue }) => {
        const val = getValue() as string;
        if (val === 'Processing') {
          return (
            <span className="inline-flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Processing
            </span>
          );
        }
        if (val === 'Completed') {
          return (
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
            </span>
          );
        }
        return (
          <span className="inline-flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> Failed
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Download / Delete',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={row.original.status !== 'Completed'}
            onClick={() => alert(`Downloading ${row.original.name}.${row.original.type.toLowerCase()}`)}
            className="text-xs font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={() => deleteMutation.mutate(row.original.id)} className="text-xs font-semibold text-rose-500 flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Export Center"
        description="Monitor status of report CSV/PDF file exports requests."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Exports' }]}
      />

      <DataTable columns={columns} data={exports} loading={isLoading} />
    </div>
  );
};
export default ExportCenter;
