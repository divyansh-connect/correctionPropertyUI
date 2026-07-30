import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../services/reportApi';
import { ReportLayout } from '../components/ReportLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ExportActions } from '../components/ExportActions';
import { ReportTable } from '../components/ReportTable';
import { useReportFilters } from '../hooks/useReportFilters';
import { useReportExport } from '../hooks/useReportExport';

export const MaintenanceReport: React.FC = () => {
  const { filters, setFilterVal, resetFilters } = useReportFilters('createdAt');
  const { isExporting, handleExport } = useReportExport();

  // Query Maintenance data
  const { data, isLoading } = useQuery({
    queryKey: ['report-maintenance', filters],
    queryFn: () => reportApi.getMaintenance(filters),
  });

  const columns = [
    { key: 'ticketId', header: 'Ticket ID' },
    { key: 'propertyName', header: 'Property' },
    { key: 'unitNumber', header: 'Unit' },
    { key: 'issue', header: 'Issue' },
    {
      key: 'priority',
      header: 'Priority',
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded text-xs font-semibold ${
            row.priority === 'Emergency' || row.priority === 'High'
              ? 'bg-rose-100 text-rose-700'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            row.status === 'Completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: 'assignedPerson', header: 'Assigned Staff' },
    { key: 'vendor', header: 'Vendor' },
    {
      key: 'estimatedCost',
      header: 'Est. Cost',
      render: (row: any) => `$${row.estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'actualCost',
      header: 'Actual Cost',
      render: (row: any) => `$${row.actualCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      render: (row: any) => new Date(row.createdDate).toLocaleDateString(),
    },
    {
      key: 'completedDate',
      header: 'Completed Date',
      render: (row: any) =>
        row.completedDate ? new Date(row.completedDate).toLocaleDateString() : 'Pending',
    },
  ];

  return (
    <ReportLayout
      title="Maintenance Log Report"
      description="Track maintenance jobs, staff/vendor performance, and repair cost balances."
    >
      <ExportActions
        onExport={(fileType) =>
          handleExport({
            reportType: 'MAINTENANCE',
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
        statusOptions={['Open', 'Assigned', 'InProgress', 'Completed', 'Closed']}
        showPriorityFilter={true}
        priorityOptions={['Low', 'Normal', 'High', 'Emergency']}
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
export const ReportReport = MaintenanceReport;
export default ReportReport;
