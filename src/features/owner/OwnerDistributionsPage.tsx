import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { OwnerDistribution } from '../../types';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';

export const OwnerDistributionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: distributions = [], isLoading } = useQuery({ queryKey: ['owner-distributions-list'], queryFn: () => api.ownerDistributions.getAll() });

  const filteredDist = distributions.filter((d) =>
    d.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.distributionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: ColumnDef<OwnerDistribution>[] = [
    { accessorKey: 'distributionNumber', header: 'Distribution NO', id: 'number', cell: ({ row }) => <span className="font-bold">{row.original.distributionNumber}</span> },
    { accessorKey: 'propertyName', header: 'Property Managed', id: 'property' },
    { accessorKey: 'date', header: 'Payment Date', id: 'date' },
    {
      accessorKey: 'amount',
      header: 'Amount Paid',
      id: 'amount',
      cell: ({ row }) => <span className="font-extrabold text-emerald-500">${row.original.amount.toLocaleString()}</span>,
    },
    { accessorKey: 'method', header: 'Payout Method', id: 'method' },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Payout Distributions Log"
        description="Verify direct deposits ACH/Wires cleared to checking accounts."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Distributions' },
        ]}
      />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search distributions by number or asset..."
        onReset={() => setSearchQuery('')}
      />

      <DataTable columns={columns} data={filteredDist.slice(0, 100)} loading={isLoading} />
    </div>
  );
};
export default OwnerDistributionsPage;
