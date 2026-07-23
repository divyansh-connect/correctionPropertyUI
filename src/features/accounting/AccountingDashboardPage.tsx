import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Legend 
} from 'recharts';
import { Plus, CheckSquare, DollarSign, Wallet, FileText, ArrowRight } from 'lucide-react';

export const AccountingDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Queries
  const { data: accounts = [], isLoading: loadingAccounts } = useQuery({ queryKey: ['coa-accounts-list'], queryFn: () => api.accounts.getAll() });
  const { data: bills = [], isLoading: loadingBills } = useQuery({ queryKey: ['bills-list'], queryFn: () => api.vendorBills.getAll() });

  if (loadingAccounts || loadingBills) {
    return <LoadingSkeleton type="card" />;
  }

  // Calculate totals
  const cashBalance = accounts.filter(a => a.accountType === 'Assets').reduce((sum, a) => sum + a.balance, 0);
  const totalIncome = accounts.filter(a => a.accountType === 'Income').reduce((sum, a) => sum + a.balance, 0);
  const totalExpenses = accounts.filter(a => a.accountType === 'Expenses').reduce((sum, a) => sum + a.balance, 0);
  const netProfit = totalIncome - totalExpenses;

  // Chart data
  const monthlyData = [
    { month: 'Jan', Income: totalIncome * 0.12, Expenses: totalExpenses * 0.11 },
    { month: 'Feb', Income: totalIncome * 0.15, Expenses: totalExpenses * 0.13 },
    { month: 'Mar', Income: totalIncome * 0.18, Expenses: totalExpenses * 0.14 },
    { month: 'Apr', Income: totalIncome * 0.14, Expenses: totalExpenses * 0.16 },
    { month: 'May', Income: totalIncome * 0.22, Expenses: totalExpenses * 0.15 },
    { month: 'Jun', Income: totalIncome * 0.19, Expenses: totalExpenses * 0.17 },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Accounting Dashboard"
        description="Verify Chart of Accounts distributions, profit margins, cash balances, and financial audits."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Accounting' },
        ]}
      />

      {/* QUICK ACTIONS BAR */}
      <div className="flex flex-wrap gap-2.5 p-3.5 bg-card border rounded-2xl">
        <Button size="sm" onClick={() => navigate({ to: '/accounting/income' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Record Income
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/accounting/expenses' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Record Expense
        </Button>
        <Button size="sm" variant="outline" onClick={() => navigate({ to: '/accounting/chart-of-accounts' })} className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> Chart of Accounts
        </Button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Cash Account Balance</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">${cashBalance.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Standard asset holdings</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Income YTD</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">${totalIncome.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Operating revenues</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Expenses YTD</p>
            <p className="text-2xl font-black mt-1 text-rose-500">${totalExpenses.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Maintenance, taxes & fees</span>
        </Card>

        <Card className="p-5 border bg-card flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Net Profit Margin</p>
            <p className="text-2xl font-black mt-1 text-emerald-500">${netProfit.toLocaleString()}</p>
          </div>
          <span className="text-[10px] text-muted-foreground font-semibold mt-4">Income after operating costs</span>
        </Card>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Income vs Expenses Bar Chart */}
        <Card className="lg:col-span-2 p-6 border bg-card">
          <h3 className="font-extrabold text-sm uppercase mb-4 tracking-wider">Monthly Financial Payouts</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                <XAxis dataKey="month" stroke="currentColor" fontSize={11} opacity={0.6} />
                <YAxis stroke="currentColor" fontSize={11} opacity={0.6} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                <Legend />
                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Profit margins trend */}
        <Card className="lg:col-span-1 p-6 border bg-card">
          <h3 className="font-extrabold text-sm uppercase mb-4 tracking-wider">Net Profit Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData.map(d => ({ month: d.month, Profit: d.Income - d.Expenses }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                <XAxis dataKey="month" stroke="currentColor" fontSize={11} opacity={0.6} />
                <YAxis stroke="currentColor" fontSize={11} opacity={0.6} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="Profit" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

      {/* BOTTOM SEGMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pending Bills */}
        <Card className="p-5 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-3 tracking-wider">Pending Vendor Bills</h3>
          <div className="divide-y space-y-3">
            {bills.slice(0, 3).map((bill) => (
              <div key={bill.id} className="pt-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold">{bill.vendorName}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">Due: {bill.dueDate} • NO: {bill.billNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-rose-500">${bill.amount.toLocaleString()}</p>
                  <span className="text-[9px] text-muted-foreground font-bold">{bill.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Bank Reconciliation Status */}
        <Card className="p-5 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-3 tracking-wider">Bank Reconciliation Status</h3>
          <div className="space-y-4 text-xs font-semibold pt-2">
            <p className="text-muted-foreground">Reconciliation period closing: July 2026</p>
            <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-xl">
              <span>Cleared Statement Balance:</span>
              <span>$45,000.00</span>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => navigate({ to: '/accounting/reconciliation' })} className="flex items-center gap-1.5 text-xs">
                Run Reconciliation Matcher <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default AccountingDashboardPage;
