import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../services/reportApi';
import { ReportLayout } from '../components/ReportLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ExportActions } from '../components/ExportActions';
import { ReportTable } from '../components/ReportTable';
import { useReportFilters } from '../hooks/useReportFilters';
import { useReportExport } from '../hooks/useReportExport';

export const RentRollReport: React.FC = () => {
  const { filters, setFilterVal, resetFilters } = useReportFilters('startDate');
  const { isExporting, handleExport } = useReportExport();

  // Query Rent Roll data
  const { data, isLoading } = useQuery({
    queryKey: ['report-rent-roll', filters],
    queryFn: () => reportApi.getRentRoll(filters),
  });

  const columns = [
    { key: 'propertyName', header: 'Property Name' },
    { key: 'unitNumber', header: 'Unit Number' },
    { key: 'tenantName', header: 'Tenant Name' },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (row: any) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: 'endDate',
      header: 'End Date',
      render: (row: any) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      key: 'leaseStatus',
      header: 'Lease Status',
      render: (row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.leaseStatus === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {row.leaseStatus}
        </span>
      ),
    },
    {
      key: 'monthlyRent',
      header: 'Monthly Rent',
      render: (row: any) => `$${row.monthlyRent.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'securityDeposit',
      header: 'Security Deposit',
      render: (row: any) => `$${row.securityDeposit.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'unitStatus',
      header: 'Unit Status',
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            row.unitStatus === 'Occupied'
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.unitStatus}
        </span>
      ),
    },
  ];

  return (
    <ReportLayout
      title="Rent Roll Report"
      description="Detailed breakdown of rents, security deposits, and unit vacancy status across all properties."
    >
      <ExportActions
        onExport={(fileType) =>
          handleExport({
            reportType: 'RENT_ROLL',
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
        statusOptions={['Active', 'Draft', 'Expired', 'Terminated', 'Ended']}
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
export default RentRollReport;
