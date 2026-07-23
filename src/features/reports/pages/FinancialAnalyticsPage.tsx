import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { FilterBuilder } from '../components/FilterBuilder';
import { DataTable } from '../../../components/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ColumnDef } from '@tanstack/react-table';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const FinancialAnalyticsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    propertyId: 'all',
    dateRange: 'all',
    status: 'all',
    searchQuery: '',
  });

  const { data: pnl, isLoading: loadingPnL } = useQuery({
    queryKey: ['financial-pnl', filters],
    queryFn: () => api.reports.getPnL(),
  });

  const { data: cashFlow, isLoading: loadingCash } = useQuery({
    queryKey: ['financial-cash', filters],
    queryFn: () => api.reports.getCashFlow(),
  });

  const { data: budget, isLoading: loadingBudget } = useQuery({
    queryKey: ['financial-budget', filters],
    queryFn: () => api.reports.getBudgetAnalysis(),
  });

  const { data: expData, isLoading: loadingExp } = useQuery({
    queryKey: ['financial-exp-analysis'],
    queryFn: () => api.charts.getExpenseAnalysis(),
  });

  const tableColumns: ColumnDef<any>[] = [
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'amount', header: 'Amount', id: 'amount', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
  ];

  const budgetColumns: ColumnDef<any>[] = [
    { accessorKey: 'category', header: 'Category', id: 'category' },
    { accessorKey: 'budget', header: 'Budget', id: 'budget', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'actual', header: 'Actual', id: 'actual', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
    { accessorKey: 'variance', header: 'Variance', id: 'variance', cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Analytics"
        description="Review Profit & Loss statements, Cash Flow tracking, budget variance, and expense analytics."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reports' }, { label: 'Financial' }]}
      />

      <FilterBuilder onFilterChange={setFilters} />

      <Tabs defaultValue="pnl">
        <TabsList className="mb-4">
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="expense">Expense Analysis</TabsTrigger>
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase">Revenue</h3>
              <DataTable columns={tableColumns} data={pnl?.revenue || []} loading={loadingPnL} />
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase">Expenses</h3>
              <DataTable columns={tableColumns} data={pnl?.expenses || []} loading={loadingPnL} />
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-xl flex justify-between font-bold text-lg text-foreground">
            <span>Net Operating Profit:</span>
            <span className="text-emerald-600">${pnl?.netProfit.toLocaleString()}</span>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase">Incoming Cash</h3>
              <DataTable columns={tableColumns} data={cashFlow?.incoming || []} loading={loadingCash} />
            </div>
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase">Outgoing Cash</h3>
              <DataTable columns={tableColumns} data={cashFlow?.outgoing || []} loading={loadingCash} />
            </div>
          </div>
          <div className="bg-card border border-border p-5 rounded-xl flex justify-between font-bold text-lg text-foreground">
            <span>Ending Cash Balance:</span>
            <span className="text-primary">${cashFlow?.balance.toLocaleString()}</span>
          </div>
        </TabsContent>

        <TabsContent value="expense" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4">Expense Categories</h3>
              <div className="h-[240px] flex items-center justify-center">
                {loadingExp ? (
                  <span>Loading Chart...</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expData?.categories || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {(expData?.categories || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4">Vendor Spending</h3>
              <div className="h-[240px]">
                {loadingExp ? (
                  <span>Loading Chart...</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expData?.vendorSpending || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                      <YAxis fontSize={10} stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <h3 className="font-bold text-sm text-foreground mb-4">Monthly Trend</h3>
              <div className="h-[240px]">
                {loadingExp ? (
                  <span>Loading Chart...</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expData?.monthlyTrend || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="period" fontSize={10} stroke="#94a3b8" />
                      <YAxis fontSize={10} stroke="#94a3b8" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="budget">
          <DataTable columns={budgetColumns} data={budget || []} loading={loadingBudget} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default FinancialAnalyticsPage;
