import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../services/reportApi';
import { ReportLayout } from '../components/ReportLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ExportActions } from '../components/ExportActions';
import { ReportTable } from '../components/ReportTable';
import { useReportFilters } from '../hooks/useReportFilters';
import { useReportExport } from '../hooks/useReportExport';

export const DelinquencyReport: React.FC = () => {
  const { filters, setFilterVal, resetFilters } = useReportFilters('dueDate');
  const { isExporting, handleExport } = useReportExport();

  // Query Delinquency data
  const { data, isLoading } = useQuery({
    queryKey: ['report-delinquency', filters],
    queryFn: () => reportApi.getDelinquency(filters),
  });

  const columns = [
    { key: 'tenantName', header: 'Tenant Name' },
    { key: 'propertyName', header: 'Property' },
    { key: 'unitNumber', header: 'Unit' },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row: any) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      key: 'rentAmount',
      header: 'Amount Due',
      render: (row: any) => `$${row.rentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      render: (row: any) => `$${row.paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'outstandingBalance',
      header: 'Outstanding Balance',
      render: (row: any) => (
        <span className="font-bold text-red-500">
          ${row.outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'daysLate',
      header: 'Days Late',
      render: (row: any) => (
        <span className="font-semibold text-orange-600">{row.daysLate} Days</span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (row: any) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
          {row.paymentStatus}
        </span>
      ),
    },
  ];

  return (
    <ReportLayout
      title="Delinquency Report"
      description="Track outstanding invoice balances, overdue fees, and payment delays per tenant."
    >
      <ExportActions
        onExport={(fileType) =>
          handleExport({
            reportType: 'DELINQUENCY',
            filters,
            data: data?.data || [],
            totalRecords: data?.pagination.totalRecords || 0,
            fileType,
          })
        }
        isExporting={isExporting}
      />

      <ReportFilters
        filters={filters}
        onChange={setFilterVal}
        onReset={resetFilters}
        showStatusFilter={true}
        statusOptions={['Unpaid', 'Overdue', 'Partially Paid']}
      />

      <ReportTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={(page) => setFilterVal('page', page)}
        onSort={(key) => {
          const order = filters.sortBy === key && filters.sortOrder === 'asc' ? 'desc' : 'asc';
          setFilterVal('sortBy', key);
          setFilterVal('sortOrder', order);
        }}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder}
      />
    </ReportLayout>
  );
};
export default DelinquencyReport;
