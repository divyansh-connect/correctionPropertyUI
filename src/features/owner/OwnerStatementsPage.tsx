import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { OwnerStatement } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { FormDialog } from '../../components/FormDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Eye, Printer } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const OwnerStatementsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatement, setSelectedStatement] = useState<OwnerStatement | null>(null);

  // Queries
  const { data: statements = [], isLoading } = useQuery({ queryKey: ['owner-statements-list'], queryFn: () => api.ownerStatements.getAll() });

  const filteredStatements = statements.filter((s) =>
    s.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<OwnerStatement>[] = [
    { accessorKey: 'period', header: t('ownerStatementsPage.period'), id: 'period' },
    { accessorKey: 'propertyName', header: t('ownerStatementsPage.propertyLocation'), id: 'property', cell: ({ row }) => <span className="font-bold">{row.original.propertyName}</span> },
    {
      accessorKey: 'income',
      header: t('ownerStatementsPage.grossIncome'),
      id: 'income',
      cell: ({ row }) => <span>${row.original.income.toLocaleString()}</span>,
    },
    {
      accessorKey: 'expenses',
      header: t('ownerStatementsPage.totalExpenses'),
      id: 'expenses',
      cell: ({ row }) => <span className="text-rose-500 font-semibold">${row.original.expenses.toLocaleString()}</span>,
    },
    {
      accessorKey: 'netDistribution',
      header: t('ownerStatementsPage.netDistribution'),
      id: 'netDistribution',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.netDistribution.toLocaleString()}</span>,
    },
    {
      accessorKey: 'status',
      header: t('ownerStatementsPage.status'),
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: t('ownerStatementsPage.actions'),
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => setSelectedStatement(row.original)} title={t('ownerStatementsPage.viewDetail')}>
          <Eye className="w-4.5 h-4.5" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('ownerStatementsPage.title')}
        description={t('ownerStatementsPage.desc')}
        breadcrumbs={[
          { label: t('ownerStatementsPage.home'), href: '/owner' },
          { label: t('ownerStatementsPage.statements') },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder={t('ownerStatementsPage.searchPlaceholder')}
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredStatements.slice(0, 100)} loading={isLoading} />

      {/* DETAIL DIALOG */}
      <FormDialog open={!!selectedStatement} onOpenChange={(open) => !open && setSelectedStatement(null)} title={t('ownerStatementsPage.reportTitle')}>
        {selectedStatement && (
          <div className="space-y-6 pt-3 text-xs font-semibold text-foreground">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-extrabold text-sm uppercase">{t('ownerStatementsPage.statementSheet')}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">{t('ownerStatementsPage.periodLabel')} {selectedStatement.period}</p>
              </div>
              <StatusBadge status={selectedStatement.status} />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase">{t('ownerStatementsPage.managedAsset')}</p>
              <p className="font-bold text-sm">{selectedStatement.propertyName}</p>
            </div>

            <div className="space-y-3.5 pt-3.5 border-t">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t('ownerStatementsPage.operatingRevenues')}</span>
                <span className="text-emerald-500 font-bold">${selectedStatement.income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">{t('ownerStatementsPage.operatingExpenses')}</span>
                <span className="text-rose-500 font-bold">-${selectedStatement.expenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-dashed text-sm font-black uppercase">
                <span>{t('ownerStatementsPage.netPayout')}</span>
                <span className="text-emerald-500">${selectedStatement.netDistribution.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedStatement(null)}>{t('ownerStatementsPage.close')}</Button>
              <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> {t('ownerStatementsPage.printStatement')}
              </Button>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};
export default OwnerStatementsPage;
