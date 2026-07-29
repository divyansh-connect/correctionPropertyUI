import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { DataTable } from '../../components/DataTable';
import { FilterBar } from '../../components/FilterBar';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/StatusBadge';
import { Download, Printer, Eye, ArrowLeft } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const search: any = useSearch({ strict: false });
  const navigate = useNavigate();
  const selectedTenantId = search.tenantId || '';

  const setSelectedTenantId = (id: string) => {
    navigate({
      to: '/rent-ledger',
      search: (prev: any) => ({ ...prev, tenantId: id || undefined }),
    });
  };

  // Queries
  const { data: ledger = [], isLoading, error } = useQuery({
    queryKey: ['rent-ledger-list'],
    queryFn: () => api.rentLedger.getAll(),
  });

  const { data: properties = [] } = useQuery({
    queryKey: ['properties'],
    queryFn: () => api.property.getAll(),
  });

  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => api.tenant.getAll(),
  });

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
  const tenantProperty = selectedTenant ? properties.find((p) => p.id === selectedTenant.propertyId) : null;
  const propertyAddress = tenantProperty ? tenantProperty.address : (selectedTenant?.propertyName ? `${selectedTenant.propertyName}, Austin, TX` : 'N/A');
  const managementCompany = tenantProperty?.managementCompany || 'Apex Property Management';

  const selectedTenantLedger = React.useMemo(() => {
    if (!selectedTenant) return [];
    const tenantFullName = `${selectedTenant.firstName} ${selectedTenant.lastName}`;
    const items = ledger.filter((item) => item.tenantName === tenantFullName);
    
    // Sort items by date ascending
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    
    // Recalculate running balance
    let runningBalance = 0;
    return sorted.map((item) => {
      let debit = item.debit;
      let credit = item.credit;
      if (item.transactionType === 'Rent Charge') {
        runningBalance += debit;
      } else if (item.transactionType === 'Payment') {
        runningBalance -= credit;
      }
      return {
        ...item,
        balance: runningBalance
      };
    });
  }, [ledger, selectedTenant]);

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
    { accessorKey: 'date', header: t('rentLedgerPage.date'), id: 'date' },
    { accessorKey: 'tenantName', header: t('rentLedgerPage.tenant'), id: 'tenant' },
    { accessorKey: 'propertyName', header: t('rentLedgerPage.property'), id: 'property', cell: ({ row }) => `${row.original.propertyName} (Unit ${row.original.unitNumber})` },
    { accessorKey: 'description', header: t('rentLedgerPage.description'), id: 'description' },
    {
      accessorKey: 'debit',
      header: t('rentLedgerPage.debit'),
      id: 'debit',
      cell: ({ row }) => row.original.debit > 0 ? <span className="text-rose-500 font-bold">+${row.original.debit.toLocaleString()}</span> : '-',
    },
    {
      accessorKey: 'credit',
      header: t('rentLedgerPage.credit'),
      id: 'credit',
      cell: ({ row }) => row.original.credit > 0 ? <span className="text-emerald-500 font-bold">-${row.original.credit.toLocaleString()}</span> : '-',
    },
    {
      accessorKey: 'balance',
      header: t('rentLedgerPage.runningBalance'),
      id: 'balance',
      cell: ({ row }) => (
        <span className={row.original.balance > 0 ? 'text-rose-500 font-black' : 'text-emerald-500 font-black'}>
          ${row.original.balance.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'transactionType',
      header: t('rentLedgerPage.type'),
      id: 'type',
      cell: ({ row }) => <StatusBadge status={row.original.transactionType} />,
    },
    {
      id: 'actions',
      header: t('rentLedgerPage.actions'),
      cell: ({ row }) => {
        const tenantObj = tenants.find((tItem) => `${tItem.firstName} ${tItem.lastName}` === row.original.tenantName);
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (tenantObj) {
                setSelectedTenantId(tenantObj.id);
              } else {
                const firstTenant = tenants[0];
                if (firstTenant) {
                  setSelectedTenantId(firstTenant.id);
                }
              }
            }}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            title={t('rentLedgerPage.viewStatement')}
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('rentLedgerPage.title')}
        description={t('rentLedgerPage.desc')}
        breadcrumbs={[
          { label: t('ai.breadcrumbs.home'), href: '/' },
          { label: t('rentPaymentsPage.rentCollection'), href: '/rent' },
          { label: t('rentLedgerPage.title') },
        ]}
      />

      {!selectedTenant && (
        <>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              {t('rentLedgerPage.showingItems', { count: filteredLedger.length })}
            </span>
            <Button variant="outline" size="sm" onClick={handleExport} className="text-xs font-semibold flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              {t('rentLedgerPage.exportCsv')}
            </Button>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={t('rentLedgerPage.searchPlaceholder')}
            filters={[
              {
                key: 'property',
                value: propertyFilter,
                placeholder: t('rentLedgerPage.allProperties'),
                options: properties.map((p) => ({ label: p.name, value: p.name })),
              },
              {
                key: 'type',
                value: typeFilter,
                placeholder: t('rentLedgerPage.transactionType'),
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
              setSelectedTenantId('');
            }}
          />
        </>
      )}

      {selectedTenant ? (
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6 mt-4">
          <div className="no-print flex items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTenantId('')}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground pl-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('rentLedgerPage.backToLedger')}
            </Button>
          </div>
          <style>{`
            @page {
              size: A4 portrait;
              margin: 15mm 15mm 15mm 15mm;
            }
            @media print {
              body {
                background: white !important;
                color: black !important;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-rent-ledger, #printable-rent-ledger * {
                visibility: visible !important;
              }
              #printable-rent-ledger {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                color: black !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .no-print {
                display: none !important;
              }
              table {
                width: 100% !important;
                border-collapse: collapse !important;
              }
              th, td {
                border-bottom: 1px solid #e2e8f0 !important;
                padding: 8px 4px !important;
                color: black !important;
              }
              th {
                font-weight: 800 !important;
              }
            }
          `}</style>
          
          <div id="printable-rent-ledger" className="space-y-6">
            {/* Ledger Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded no-print">
                  {t('rentLedgerPage.officialStatement')}
                </span>
                <h3 className="font-extrabold text-base text-foreground mt-1">{managementCompany}</h3>
                <p className="text-muted-foreground text-[10px] leading-relaxed">
                  {propertyAddress}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-muted-foreground text-[10px] uppercase font-bold">{t('rentLedgerPage.statementRecipient')}</p>
                <p className="font-extrabold text-foreground text-sm">{selectedTenant.firstName} {selectedTenant.lastName}</p>
                <p className="text-muted-foreground text-[10px] leading-relaxed">
                  Phone: {selectedTenant.phone || 'N/A'} • Email: {selectedTenant.email || 'N/A'}<br />
                  {selectedTenant.propertyName ? `${selectedTenant.propertyName} • Unit ${selectedTenant.unitNumber}` : 'Unassigned Portfolio Resident'}
                </p>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-2.5">{t('rentLedgerPage.date')}</th>
                    <th className="py-2.5">{t('rentLedgerPage.description')}</th>
                    <th className="py-2.5 text-right">{t('rentLedgerPage.debitCharges')}</th>
                    <th className="py-2.5 text-right">{t('rentLedgerPage.creditPayments')}</th>
                    <th className="py-2.5 text-right">{t('rentLedgerPage.runningBalance')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {selectedTenantLedger.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-secondary/10">
                      <td className="py-2.5 font-semibold text-muted-foreground">{entry.date}</td>
                      <td className="py-2.5 text-foreground font-extrabold">{entry.description}</td>
                      <td className="py-2.5 text-right text-rose-500 font-bold">
                        {entry.debit > 0 ? `$${entry.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="py-2.5 text-right text-emerald-500 font-bold">
                        {entry.credit > 0 ? `$${entry.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className={`py-2.5 text-right font-black ${entry.balance > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        ${entry.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {selectedTenantLedger.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground italic font-medium">
                        {t('rentLedgerPage.noTransactions')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Ledger Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <div className="text-[10px] text-muted-foreground">
                {t('rentLedgerPage.generatedOn', { date: new Date().toLocaleDateString() })}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] uppercase text-muted-foreground font-bold">{t('rentLedgerPage.outstandingBalance')}</p>
                  <p className={`text-lg font-black ${selectedTenantLedger.length > 0 ? (selectedTenantLedger[selectedTenantLedger.length - 1].balance > 0 ? 'text-rose-500' : 'text-emerald-500') : 'text-emerald-500'}`}>
                    ${selectedTenantLedger.length > 0 ? selectedTenantLedger[selectedTenantLedger.length - 1].balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTenantId('')} className="no-print h-9 font-bold">
                    {t('rentLedgerPage.closeStatement')}
                  </Button>
                  <Button variant="default" size="sm" onClick={() => window.print()} className="no-print flex items-center gap-1.5 h-9 font-bold bg-primary text-primary-foreground hover:bg-primary/95">
                    <Printer className="w-4 h-4" /> {t('rentLedgerPage.printStatement')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredLedger} loading={isLoading} error={error ? error.message : null} />
      )}
    </div>
  );
};
export default RentLedgerPage;
