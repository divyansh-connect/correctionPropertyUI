import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api';
import { PageHeader } from '../../components/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Printer, Download } from 'lucide-react';

export const OwnerReportsPage: React.FC = () => {
  // Queries
  const { data: reports = null, isLoading } = useQuery({ queryKey: ['owner-reports-summary'], queryFn: () => api.ownerReports.getAll() });

  if (isLoading || !reports) {
    return <LoadingSkeleton type="card" />;
  }

  const reportsList = [
    { title: 'Income Summary', desc: 'Detailed breakdown of rental revenues and late fees.' },
    { title: 'Expense Summary', desc: 'Audits of maintenance, structural diagnostics, and tax levies.' },
    { title: 'Property Performance', desc: 'Occupancy statistics and cash flow margins by property.' },
    { title: 'Distribution Report', desc: 'Historical direct deposit records and pending ACH schedules.' },
  ];

  return (
    <div className="space-y-6 text-foreground">
      <PageHeader
        title="Portfolio Financial Reports"
        description="Verify annual tax declarations summaries, revenue balances, and occupancy reports."
        breadcrumbs={[
          { label: 'Home', href: '/owner' },
          { label: 'Reports' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Reports Directory */}
        <Card className="p-6 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Available Reports</h3>
          <div className="divide-y space-y-3 text-xs font-semibold">
            {reportsList.map((r, idx) => (
              <div key={idx} className="pt-3 flex justify-between items-center">
                <div>
                  <p className="font-bold">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{r.desc}</p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => window.print()} title="Print Report">
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick summary sheet */}
        <Card className="p-6 border bg-card space-y-4">
          <h3 className="font-extrabold text-sm uppercase border-b pb-2 tracking-wider">Annual Summary Statistics</h3>
          <div className="space-y-3.5 text-xs font-semibold">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Operating Income:</span>
              <span className="text-emerald-500 font-bold">${reports.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2 text-rose-500">
              <span>Operating Expenses:</span>
              <span>-${reports.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Portfolio Occupancy:</span>
              <span>{reports.occupancy}%</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-black uppercase">
              <span>Total Payouts Distributed:</span>
              <span className="text-emerald-500">${reports.distribution.toLocaleString()}</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
export default OwnerReportsPage;
