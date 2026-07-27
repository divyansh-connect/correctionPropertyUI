import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { Report } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/ui/Button';
import { BarChart3 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => api.report.getAll(),
  });

  const columns: ColumnDef<Report>[] = [
    { accessorKey: 'name', header: t('pmReports.name'), id: 'name', cell: ({ row }) => <span className="font-bold">{row.original.name}</span> },
    { accessorKey: 'category', header: t('pmReports.category'), id: 'category' },
    { accessorKey: 'description', header: t('pmReports.description'), id: 'description' },
    {
      id: 'actions',
      header: t('pmReports.export'),
      cell: () => (
        <Button variant="outline" size="sm" className="text-xs font-semibold flex items-center gap-1">
          <BarChart3 className="w-3.5 h-3.5" />
          {t('pmReports.generate')}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('pmReports.title')}
        description={t('pmReports.desc')}
        breadcrumbs={[
          { label: t('header.home'), href: '/' },
          { label: t('pmReports.title') },
        ]}
      />
      <DataTable columns={columns} data={reports} loading={isLoading} />
    </div>
  );
};
export default ReportsPage;
