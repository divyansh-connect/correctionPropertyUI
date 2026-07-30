import { useState } from 'react';
import { reportApi } from '../services/reportApi';

export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Client-side CSV generator for small datasets
  const exportToCSVLocal = (data: any[], fileName: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            const cleanVal = val === null || val === undefined ? '' : String(val);
            return `"${cleanVal.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async (params: {
    reportType: string;
    filters: any;
    data: any[];
    totalRecords: number;
    fileType: 'CSV' | 'PDF' | 'XLSX';
  }) => {
    const { reportType, filters, data, totalRecords, fileType } = params;
    setIsExporting(true);

    try {
      const fileName = `${reportType.toLowerCase()}_report_${Date.now()}`;

      // Threshold check: Small dataset threshold is 150 records
      if (totalRecords <= 150 && fileType === 'CSV') {
        console.log('Generating export locally...');
        exportToCSVLocal(data, fileName);
      } else {
        console.log('Triggering background export on backend...');
        // Backend handles heavy PDF/Excel generation and stores history
        await reportApi.triggerExport({
          reportType,
          filters,
          fileName: `${fileName}.${fileType.toLowerCase()}`,
          fileType,
        });
        alert('Large export triggered in the background. You can monitor and download the file from the Export Center history panel.');
      }
    } catch (e) {
      console.error('Export failed:', e);
      alert('Failed to trigger export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
  };
};
