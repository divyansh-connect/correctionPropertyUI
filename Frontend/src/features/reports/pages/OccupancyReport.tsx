import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportApi } from '../services/reportApi';
import { ReportLayout } from '../components/ReportLayout';
import { ReportFilters } from '../components/ReportFilters';
import { ExportActions } from '../components/ExportActions';
import { ReportTable } from '../components/ReportTable';
import { useReportFilters } from '../hooks/useReportFilters';
import { useReportExport } from '../hooks/useReportExport';

export const OccupancyReport: React.FC = () => {
  const { filters, setFilterVal, resetFilters } = useReportFilters('propertyName');
  const { isExporting, handleExport } = useReportExport();

  // Query Occupancy data
  const { data, isLoading } = useQuery({
    queryKey: ['report-occupancy', filters],
    queryFn: () => reportApi.getOccupancy(filters),
  });

  const columns = [
    { key: 'propertyName', header: 'Property Name' },
    { key: 'totalUnits', header: 'Total Units' },
    { key: 'occupiedUnits', header: 'Occupied Units' },
    { key: 'vacantUnits', header: 'Vacant Units' },
    {
      key: 'occupancyPercentage',
      header: 'Occupancy Percentage',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2"
              style={{ width: `${Math.min(100, row.occupancyPercentage)}%` }}
            ></div>
          </div>
          <span className="font-semibold">{row.occupancyPercentage}%</span>
        </div>
      ),
    },
  ];

  return (
    <ReportLayout
      title="Occupancy Report"
      description="Detailed analysis of unit occupancy levels and vacancies across your properties."
    >
      <ExportActions
        onExport={(fileType) =>
          handleExport({
            reportType: 'OCCUPANCY',
            filters,
            data: data?.data || [],
            totalRecords: data?.pagination.totalRecords || 0,
            fileType,
          })
        }
        isExporting={isExporting}
      />

      <ReportFilters filters={filters} onChange={setFilterVal} onReset={resetFilters} />

      <ReportTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={(page) => setFilterVal('page', page)}
      />
    </ReportLayout>
  );
};
export default OccupancyReport;
