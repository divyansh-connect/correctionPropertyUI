import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export const OwnerFinancialsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: income = [] } = useQuery({ queryKey: ['income-list'], queryFn: () => api.income.getAll() });

  const filteredIncome = income.filter((item) =>
    item.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<any>[] = [
    { accessorKey: 'date', header: 'Clearing Date', id: 'date' },
    { accessorKey: 'propertyName', header: 'Property Managed', id: 'property', cell: ({ row }) => <span className="font-bold">{row.original.propertyName}</span> },
    { accessorKey: 'tenantName', header: 'Tenant / Source', id: 'source' },
    {
      accessorKey: 'category',
      header: 'Category',
      id: 'category',
      cell: ({ row }) => <span className="font-bold text-[10px] bg-secondary px-2 py-0.5 rounded border uppercase">{row.original.category}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Gross Revenue',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Portfolio Ledger & Transactions"
        description="Verify clearing deposits, operating disbursements, maintenance write-offs, and distributions."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Financials' },
        ]}
      />

      <div className="flex justify-between items-center mb-3 text-xs font-semibold text-foreground">
        <span className="text-muted-foreground uppercase">Showing {filteredIncome.length} Ledger Postings</span>
        <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" /> Print Ledger
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search ledger by tenant or property..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredIncome.slice(0, 100)} />
    </div>
  );
};
export default OwnerFinancialsPage;
