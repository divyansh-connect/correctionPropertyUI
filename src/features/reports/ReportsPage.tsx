import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Report } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { BarChart3 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ReportsPage: React.FC = () => {
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.report.getAll(),
  });

  const columns: ColumnDef<Report>[] = [
    { accessorKey: 'name', header: 'Report Name', id: 'name', cell: ({ row }) => <span className="font-bold">{row.original.name}</span> },
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'description', header: 'Description', id: 'description' },
    {
      id: 'actions',
      header: 'Export',
      cell: () => (
        <Button variant="outline" size="sm" className="text-xs font-semibold flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          Generate
          </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Run financial reports, rent roll analytics, and work order audit reports."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Reports' },
        ]}
      />
      <DataTable columns={columns} data={reports} loading={isLoading} />
    </div>
  );
};
export default ReportsPage;
