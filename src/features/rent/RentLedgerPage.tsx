import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Download } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface LedgerItem {
  id: string;
  date: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  transactionType: string;
}

export const RentLedgerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Queries
  const { data: ledger = [], isLoading, error } = useQuery({
    queryKey: ['rent-ledger-list'],
    queryFn: () => api.rentLedger.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const filteredLedger = ledger.filter((item) => {
    const nameMatch = item.tenantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProp = propertyFilter === '' || item.propertyName.includes(propertyFilter);
    const matchesType = typeFilter === '' || item.transactionType === typeFilter;
    return nameMatch && matchesProp && matchesType;
  });

  // Export CSV
  const handleExport = () => {
    const headers = 'Date,Tenant,Property,Description,Debit,Credit,Balance,Type\n';
    const rows = filteredLedger
      .map(
        (l) =>
          `"${l.date}","${l.tenantName}","${l.propertyName}","${l.description}",${l.debit},${l.credit},${l.balance},"${l.transactionType}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Rent_Ledger_Report.csv');
    a.click();
  };

  const columns: ColumnDef<LedgerItem>[] = [
    { accessorKey: 'date', header: 'Date', id: 'date' },
    { accessorKey: 'tenantName', header: 'Tenant', id: 'tenant' },
    { accessorKey: 'propertyName', header: 'Property', id: 'property', cell: ({ row }) => `${row.original.propertyName} (Unit ${row.original.unitNumber})` },
    { accessorKey: 'description', header: 'Description', id: 'description' },
    {
      accessorKey: 'debit',
      header: 'Debit (+)',
      id: 'debit',
      cell: ({ row }) => row.original.debit > 0 ? <span className="text-rose-500 font-bold">+${row.original.debit.toLocaleString()}</span> : '-',
    },
    {
      accessorKey: 'credit',
      header: 'Credit (-)',
      id: 'credit',
      cell: ({ row }) => row.original.credit > 0 ? <span className="text-emerald-500 font-bold">-${row.original.credit.toLocaleString()}</span> : '-',
    },
    {
      accessorKey: 'balance',
      header: 'Running Balance',
      id: 'balance',
      cell: ({ row }) => (
        <span className={row.original.balance > 0 ? 'text-rose-500 font-black' : 'text-emerald-500 font-black'}>
          ${row.original.balance.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'transactionType',
      header: 'Type',
      id: 'type',
      cell: ({ row }) => <StatusBadge status={row.original.transactionType} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Rent Ledger"
        description="Verify chronological credit payments, billing assessments, and running balance totals."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Rent Collection', href: '/rent' },
          { label: 'Rent Ledger' },
        ]}
      />

      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase">
          Ledger contains {filteredLedger.length} Line Items
        </span>
        <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search ledger by tenant name..."
        filters={[
          {
            key: 'property',
            value: propertyFilter,
            placeholder: 'All Properties',
            options: properties.map((p) => ({ label: p.name, value: p.name })),
          },
          {
            key: 'type',
            value: typeFilter,
            placeholder: 'Transaction Type',
            options: [
              { label: 'Rent Charge', value: 'Rent Charge' },
              { label: 'Payment', value: 'Payment' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'property') setPropertyFilter(val);
          if (key === 'type') setTypeFilter(val);
        }}
        onReset={() => {
          setSearchQuery('');
          setPropertyFilter('');
          setTypeFilter('');
        }}
      />

      <DataTable columns={columns} data={filteredLedger} loading={isLoading} error={error ? error.message : null} />
    </div>
  );
};
export default RentLedgerPage;
