import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../services/reportApi';
import { ReportLayout } from '../components/ReportLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ExportActions } from '../components/ExportActions';
import { ReportTable } from '../components/ReportTable';
import { useReportFilters } from '../hooks/useReportFilters';
import { useReportExport } from '../hooks/useReportExport';

export const PaymentHistoryReport: React.FC = () => {
  const { filters, setFilterVal, resetFilters } = useReportFilters('paymentDate');
  const { isExporting, handleExport } = useReportExport();

  // Query Payment History data
  const { data, isLoading } = useQuery({
    queryKey: ['report-payment-history', filters],
    queryFn: () => reportApi.getPaymentHistory(filters),
  });

  const columns = [
    { key: 'tenantName', header: 'Tenant Name' },
    { key: 'propertyName', header: 'Property' },
    { key: 'unitNumber', header: 'Unit' },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (row: any) => new Date(row.paymentDate).toLocaleDateString(),
    },
    {
      key: 'amount',
      header: 'Amount Paid',
      render: (row: any) => `$${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    { key: 'paymentMethod', header: 'Payment Method' },
    { key: 'referenceNumber', header: 'Reference/Check #' },
    {
      key: 'paymentStatus',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            row.paymentStatus === 'Paid'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {row.paymentStatus}
        </span>
      ),
    },
  ];

  return (
    <ReportLayout
      title="Payment History Report"
      description="List of all completed rental payments and transaction references."
    >
      <ExportActions
        onExport={(fileType) =>
          handleExport({
            reportType: 'PAYMENT_HISTORY',
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
        statusOptions={['Paid', 'Pending', 'PartiallyPaid', 'Failed', 'Refunded']}
        showPaymentMethodFilter={true}
        paymentMethodOptions={['ACH', 'CreditCard', 'DebitCard', 'BankTransfer', 'WireTransfer', 'Cash', 'Check', 'MoneyOrder', 'Zelle']}
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
export default PaymentHistoryReport;
