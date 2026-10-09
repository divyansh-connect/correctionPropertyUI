import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/StatusBadge';
import { 
  Building2, Home, UserCheck, AlertCircle, Download, FileSpreadsheet, FileText, 
  Search, X, CheckCircle, Clock
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export type MetricType = 'properties' | 'totalUnits' | 'occupiedUnits' | 'vacantUnits';

interface MetricDetailsModalProps {
  open: boolean;
  onClose: () => void;
  metricType: MetricType | null;
}

export const MetricDetailsModal: React.FC<MetricDetailsModalProps> = ({
  open,
  onClose,
  metricType,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch properties
  const { data: properties = [], isLoading: loadingProps } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
    enabled: open && metricType === 'properties',
  });

  // Fetch units
  const { data: units = [], isLoading: loadingUnits } = useQuery({
    queryKey: ['units'],
    queryFn: () => api.unit.getAll(),
    enabled: open && metricType !== 'properties',
  });

  // Fetch tenants for Occupied units enrichment
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.tenant.getAll(),
    enabled: open && (metricType === 'occupiedUnits' || metricType === 'totalUnits'),
  });

  // Reset search term when modal opens/closes
  React.useEffect(() => {
    if (!open) setSearchTerm('');
  }, [open]);

  // Compute title, icon, and filtered rows based on metricType
  const modalConfig = useMemo(() => {
    if (!metricType) return null;

    switch (metricType) {
      case 'properties': {
        const list = properties.map((p: any) => ({
          id: p.id,
          propertyName: p.name,
          address: p.address || `${p.city || 'Austin'}, ${p.state || 'TX'}`,
          type: p.type || 'Residential',
          totalUnits: p.totalUnits || p.units?.length || 0,
          occupiedUnits: p.units?.filter((u: any) => u.status === 'Occupied').length || 0,
          vacantUnits: p.units?.filter((u: any) => u.status === 'Vacant').length || 0,
          occupancyRate: p.units?.length ? `${Math.round(((p.units.filter((u: any) => u.status === 'Occupied').length) / p.units.length) * 100)}%` : '0%',
          monthlyRevenue: p.monthlyRevenue ? `$${p.monthlyRevenue.toLocaleString()}` : '$0',
        }));

        const filtered = list.filter((item: any) =>
          item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.type.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
          title: 'Total Properties Details Matrix',
          description: 'Comprehensive breakdown of all properties in your portfolio',
          icon: <Building2 className="w-6 h-6 text-primary" />,
          badgeBg: 'bg-primary/10 text-primary border-primary/20',
          count: list.length,
          countLabel: 'Properties',
          data: filtered,
          rawData: list,
          reportTitle: 'TOTAL_PROPERTIES_REPORT',
          columns: [
            { header: 'Property Name', accessorKey: 'propertyName' },
            { header: 'Address', accessorKey: 'address' },
            { header: 'Type', accessorKey: 'type' },
            { header: 'Total Units', accessorKey: 'totalUnits' },
            { header: 'Occupied Units', accessorKey: 'occupiedUnits' },
            { header: 'Vacant Units', accessorKey: 'vacantUnits' },
            { header: 'Occupancy %', accessorKey: 'occupancyRate' },
            { header: 'Monthly Revenue', accessorKey: 'monthlyRevenue' },
          ],
        };
      }

      case 'totalUnits': {
        const list = units.map((u: any) => {
          const tenant = tenants.find((t: any) => t.unitId === u.id || t.id === u.tenantId);
          return {
            id: u.id,
            unitNumber: `Unit ${u.unitNumber}`,
            propertyName: u.propertyName || 'Property',
            floor: `Floor ${u.floor || 1}`,
            bedroomsBathrooms: `${u.bedrooms || 0} Beds / ${u.bathrooms || 1} Baths`,
            squareFootage: `${(u.squareFootage || 0).toLocaleString()} sqft`,
            rentAmount: `$${(u.rentAmount || 0).toLocaleString()}`,
            tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : (u.status === 'Occupied' ? 'Active Resident' : 'Vacant'),
            status: u.status || 'Vacant',
          };
        });

        const filtered = list.filter((item: any) =>
          item.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
          title: 'Total Portfolio Units Breakdown',
          description: 'Complete inventory list of all units across properties',
          icon: <Home className="w-6 h-6 text-blue-500" />,
          badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          count: list.length,
          countLabel: 'Units',
          data: filtered,
          rawData: list,
          reportTitle: 'TOTAL_UNITS_REPORT',
          columns: [
            { header: 'Unit #', accessorKey: 'unitNumber' },
            { header: 'Property Name', accessorKey: 'propertyName' },
            { header: 'Floor', accessorKey: 'floor' },
            { header: 'Layout', accessorKey: 'bedroomsBathrooms' },
            { header: 'SqFt', accessorKey: 'squareFootage' },
            { header: 'Monthly Rent', accessorKey: 'rentAmount' },
            { header: 'Resident', accessorKey: 'tenantName' },
            { header: 'Status', accessorKey: 'status' },
          ],
        };
      }

      case 'occupiedUnits': {
        const occupiedList = units
          .filter((u: any) => u.status === 'Occupied')
          .map((u: any) => {
            const tenant = tenants.find((t: any) => t.unitId === u.id || t.id === u.tenantId);
            return {
              id: u.id,
              unitNumber: `Unit ${u.unitNumber}`,
              propertyName: u.propertyName || 'Property',
              tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Active Resident',
              tenantEmail: tenant?.email || 'N/A',
              moveInDate: tenant?.moveInDate ? tenant.moveInDate.split('T')[0] : 'N/A',
              rentAmount: `$${(u.rentAmount || 0).toLocaleString()}`,
              securityDeposit: `$${(u.securityDeposit || 0).toLocaleString()}`,
              leaseStatus: tenant?.status || 'Active',
            };
          });

        const filtered = occupiedList.filter((item: any) =>
          item.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
          title: 'Occupied Units Matrix',
          description: 'Details of all currently occupied units and resident profiles',
          icon: <UserCheck className="w-6 h-6 text-emerald-500" />,
          badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          count: occupiedList.length,
          countLabel: 'Occupied',
          data: filtered,
          rawData: occupiedList,
          reportTitle: 'OCCUPIED_UNITS_REPORT',
          columns: [
            { header: 'Unit #', accessorKey: 'unitNumber' },
            { header: 'Property Name', accessorKey: 'propertyName' },
            { header: 'Resident Name', accessorKey: 'tenantName' },
            { header: 'Contact Email', accessorKey: 'tenantEmail' },
            { header: 'Move-In Date', accessorKey: 'moveInDate' },
            { header: 'Monthly Rent', accessorKey: 'rentAmount' },
            { header: 'Security Deposit', accessorKey: 'securityDeposit' },
            { header: 'Lease Status', accessorKey: 'leaseStatus' },
          ],
        };
      }

      case 'vacantUnits': {
        const vacantList = units
          .filter((u: any) => u.status === 'Vacant')
          .map((u: any) => ({
            id: u.id,
            unitNumber: `Unit ${u.unitNumber}`,
            propertyName: u.propertyName || 'Property',
            floor: `Floor ${u.floor || 1}`,
            bedroomsBathrooms: `${u.bedrooms || 0} Beds / ${u.bathrooms || 1} Baths`,
            squareFootage: `${(u.squareFootage || 0).toLocaleString()} sqft`,
            rentAmount: `$${(u.rentAmount || 0).toLocaleString()}`,
            availabilityDate: u.availabilityDate ? u.availabilityDate.split('T')[0] : 'Immediate',
            advertised: u.advertiseListing ? 'Active Listing' : 'Not Advertised',
          }));

        const filtered = vacantList.filter((item: any) =>
          item.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.advertised.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return {
          title: 'Vacant Units Matrix',
          description: 'Detailed inventory of vacant units ready for leasing & marketing',
          icon: <AlertCircle className="w-6 h-6 text-rose-500" />,
          badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          count: vacantList.length,
          countLabel: 'Vacant',
          data: filtered,
          rawData: vacantList,
          reportTitle: 'VACANT_UNITS_REPORT',
          columns: [
            { header: 'Unit #', accessorKey: 'unitNumber' },
            { header: 'Property Name', accessorKey: 'propertyName' },
            { header: 'Floor', accessorKey: 'floor' },
            { header: 'Layout', accessorKey: 'bedroomsBathrooms' },
            { header: 'SqFt', accessorKey: 'squareFootage' },
            { header: 'Target Rent', accessorKey: 'rentAmount' },
            { header: 'Availability Date', accessorKey: 'availabilityDate' },
            { header: 'Marketing Status', accessorKey: 'advertised' },
          ],
        };
      }

      default:
        return null;
    }
  }, [metricType, properties, units, tenants, searchTerm]);

  if (!open || !modalConfig) return null;

  const isLoading = loadingProps || loadingUnits;

  // Export handlers
  const handleExportCSV = () => {
    const list = modalConfig.data;
    if (list.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(list);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matrix Details');
    XLSX.writeFile(workbook, `${modalConfig.reportTitle}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPDF = () => {
    const list = modalConfig.data;
    if (list.length === 0) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(modalConfig.title.toUpperCase(), 14, 15);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${list.length}`, 14, 21);

    const headers = modalConfig.columns.map((c) => c.header);
    const tableRows = list.map((item: any) =>
      modalConfig.columns.map((c) => String(item[c.accessorKey] ?? 'N/A'))
    );

    autoTable(doc, {
      startY: 26,
      head: [headers],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    doc.save(`${modalConfig.reportTitle}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-5xl h-[85vh] max-h-[85vh] p-6 overflow-hidden">
        <div className="flex flex-col h-full overflow-hidden gap-3">
          {/* Header Section */}
          <DialogHeader className="pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary/80 rounded-2xl shrink-0">
                {modalConfig.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-extrabold text-foreground">
                    {modalConfig.title}
                  </DialogTitle>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${modalConfig.badgeBg}`}>
                    {modalConfig.count} {modalConfig.countLabel}
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {modalConfig.description}
                </DialogDescription>
              </div>
            </div>

            {/* Action Export Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={isLoading || modalConfig.data.length === 0}
                className="flex items-center gap-1.5 text-xs font-bold"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Export Excel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleExportPDF}
                disabled={isLoading || modalConfig.data.length === 0}
                className="flex items-center gap-1.5 text-xs font-bold"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </DialogHeader>

          {/* Search & Filter Bar */}
          <div className="shrink-0 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${modalConfig.countLabel.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Showing {modalConfig.data.length} of {modalConfig.count} entries
            </span>
          </div>

          {/* Table Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto border border-border rounded-xl">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3 text-muted-foreground">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold">Loading matrix details...</p>
              </div>
            ) : modalConfig.data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 text-muted-foreground">
                <AlertCircle className="w-10 h-10 text-muted-foreground/50" />
                <p className="font-extrabold text-sm text-foreground">No Records Found</p>
                <p className="text-xs max-w-xs">
                  {searchTerm ? `No results match your search "${searchTerm}".` : 'No data available for this metric category.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-secondary/90 sticky top-0 border-b border-border z-10 text-muted-foreground font-extrabold uppercase text-[10px] tracking-wider backdrop-blur-md">
                  <tr>
                    {modalConfig.columns.map((col) => (
                      <th key={col.accessorKey} className="px-4 py-3 bg-secondary/90">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {modalConfig.data.map((row: any, idx: number) => (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-secondary/40 transition-colors font-medium text-foreground"
                    >
                      {modalConfig.columns.map((col) => {
                        const val = row[col.accessorKey];

                        // Custom Badge Renderers
                        if (col.accessorKey === 'status' || col.accessorKey === 'leaseStatus') {
                          return (
                            <td key={col.accessorKey} className="px-4 py-3">
                              <StatusBadge status={val} />
                            </td>
                          );
                        }

                        if (col.accessorKey === 'advertised') {
                          return (
                            <td key={col.accessorKey} className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  val === 'Active Listing'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                                }`}
                              >
                                {val}
                              </span>
                            </td>
                          );
                        }

                        if (col.accessorKey === 'propertyName' || col.accessorKey === 'unitNumber') {
                          return (
                            <td key={col.accessorKey} className="px-4 py-3 font-bold text-foreground">
                              {val}
                            </td>
                          );
                        }

                        return (
                          <td key={col.accessorKey} className="px-4 py-3 text-muted-foreground">
                            {val || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-border flex items-center justify-between shrink-0 text-xs text-muted-foreground">
            <span>Real-time portfolio intelligence breakdown</span>
            <Button variant="outline" size="sm" onClick={onClose} className="px-6">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default MetricDetailsModal;
