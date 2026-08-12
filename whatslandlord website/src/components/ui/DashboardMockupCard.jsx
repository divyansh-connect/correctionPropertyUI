import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Wrench, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search,
  Bell,
  PieChart,
  FileCheck
} from 'lucide-react';

export default function DashboardMockupCard({ activeTab = 'analytics', className = '' }) {
  return (
    <div className={`w-full bg-white rounded-3xl border border-brand-neutral-border shadow-hero-card overflow-hidden transition-all duration-300 ${className}`}>
      {/* Top Application Control Bar */}
      <div className="bg-brand-neutral-dark text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="text-xs text-gray-400 font-mono pl-3 border-l border-gray-700">
            app.propertysaas.com/financials/ledger-analytics
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-300">
          <div className="hidden sm:flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span>Search properties, tenants, ledgers...</span>
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-gray-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-indigo"></span>
          </div>
          <div className="w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center font-semibold text-[10px] text-white">
            PM
          </div>
        </div>
      </div>

      {/* Main Dashboard Canvas */}
      <div className="bg-brand-slate-surface p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-neutral-muted">Occupancy Forecast</span>
              <div className="p-1.5 rounded-lg bg-brand-blue-surface text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">96.8%</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4%
              </span>
            </div>
            <span className="text-[11px] text-brand-neutral-muted mt-1 block font-mono">Predicted EOM</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-neutral-muted">Revenue Forecast</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">$412.5k</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4.1%
              </span>
            </div>
            <span className="text-[11px] text-brand-neutral-muted mt-1 block font-mono">AI Growth Model</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-neutral-muted">AI Risk Assessment</span>
              <div className="p-1.5 rounded-lg bg-brand-indigo-surface text-brand-indigo-dark group-hover:bg-brand-indigo group-hover:text-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">92 / 100</span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-3 h-3 mr-0.5" /> Stable
              </span>
            </div>
            <span className="text-[11px] font-bold text-brand-blue mt-1 block font-mono">Risk Level: Low</span>
          </div>

          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-neutral-muted">Renewal Prediction</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">14 Leases</span>
              <span className="text-xs font-bold text-blue-700">30 Days</span>
            </div>
            <span className="text-[11px] text-brand-neutral-muted mt-1 block font-mono">85% Likelihood</span>
          </div>
        </div>

        {/* Dynamic Content View with Grouped Monthly Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          
          {/* Floating AI Alert inside the dashboard */}
          <div className="absolute -top-3 right-1/3 z-20 hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-amber-200 shadow-lg animate-bounce-slow">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-100 text-amber-700">
              <Bell className="w-2.5 h-2.5" />
            </span>
            <span className="text-[10px] font-bold text-amber-900">AI Alert: Unit 404 HVAC risk detected</span>
          </div>

          {/* Main Visual Grouped Bar Chart */}
          <div className="lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-brand-neutral-border shadow-xs relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-brand-neutral-dark">Monthly Revenue vs Expenses Breakdown</h3>
                <p className="text-xs text-brand-neutral-muted">Income collection ledgers by month (2026)</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-blue-surface text-brand-blue border border-brand-blue/20 shrink-0">
                Monthly Breakdown
              </span>
            </div>

            {/* Distinct Grouped Column SVG Chart with Month Labels */}
            <div className="h-44 sm:h-52 w-full pt-4 pb-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130" fill="none">
                {/* Horizontal Grid Lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="0" y1="55" x2="400" y2="55" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />

                {/* Jan Bar Group */}
                <g transform="translate(10, 0)">
                  <rect x="5" y="40" width="16" height="65" rx="3" fill="#2563EB" />
                  <rect x="23" y="70" width="12" height="35" rx="2" fill="#E2E8F0" />
                  <text x="22" y="118" textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Jan</text>
                </g>

                {/* Feb Bar Group */}
                <g transform="translate(75, 0)">
                  <rect x="5" y="32" width="16" height="73" rx="3" fill="#2563EB" />
                  <rect x="23" y="65" width="12" height="40" rx="2" fill="#E2E8F0" />
                  <text x="22" y="118" textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Feb</text>
                </g>

                {/* Mar Bar Group */}
                <g transform="translate(140, 0)">
                  <rect x="5" y="25" width="16" height="80" rx="3" fill="#2563EB" />
                  <rect x="23" y="60" width="12" height="45" rx="2" fill="#E2E8F0" />
                  <text x="22" y="118" textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Mar</text>
                </g>

                {/* Apr Bar Group */}
                <g transform="translate(205, 0)">
                  <rect x="5" y="20" width="16" height="85" rx="3" fill="#2563EB" />
                  <rect x="23" y="50" width="12" height="50" rx="2" fill="#E2E8F0" />
                  <text x="22" y="118" textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Apr</text>
                </g>

                {/* May Bar Group */}
                <g transform="translate(270, 0)">
                  <rect x="5" y="15" width="16" height="90" rx="3" fill="#2563EB" />
                  <rect x="23" y="50" width="12" height="55" rx="2" fill="#E2E8F0" />
                  <text x="22" y="118" textAnchor="middle" fill="#6B7280" fontSize="9" fontWeight="bold" fontFamily="sans-serif">May</text>
                </g>

                {/* Jun Bar Group */}
                <g transform="translate(335, 0)">
                  <rect x="5" y="8" width="16" height="97" rx="3" fill="#2563EB" />
                  <rect x="23" y="45" width="12" height="60" rx="2" fill="#4F46E5" />
                  <text x="22" y="118" textAnchor="middle" fill="#2563EB" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Jun</text>
                </g>
              </svg>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-brand-neutral-muted border-t border-brand-slate/80 pt-3">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-brand-blue inline-block"></span> Total Gross Rent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-brand-slate-accent inline-block"></span> Operating Expenses
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-brand-indigo inline-block"></span> Net Profit
                </span>
              </div>
              <span className="font-semibold text-brand-neutral-dark shrink-0">Updated 2m ago</span>
            </div>
          </div>

          {/* AI Insights Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-brand-neutral-border shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-brand-indigo-surface text-brand-indigo-dark">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-brand-neutral-dark">AI Smart Recommendations</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-brand-slate-surface border border-brand-slate-accent">
                  <div className="flex items-center justify-between font-semibold text-brand-neutral-dark mb-1">
                    <span>Rent Optimization</span>
                    <span className="text-brand-blue font-bold">+5.2% Rec.</span>
                  </div>
                  <p className="text-brand-neutral-muted">
                    Market analysis suggests increasing 12 units in Oakridge Tower by $95/mo upon lease renewal.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center justify-between font-semibold text-emerald-900 mb-1">
                    <span>Auto-Reconciliation</span>
                    <span className="text-emerald-700 font-bold">Matched</span>
                  </div>
                  <p className="text-emerald-800">
                    142 rent ACH payments automatically reconciled with bank ledgers this morning.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-slate/80 mt-4 flex items-center justify-between text-xs font-semibold text-brand-blue">
              <span>View All 12 Insights</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Recent Activity & Tenant Status Table Preview */}
        <div className="bg-white p-5 rounded-2xl border border-brand-neutral-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-brand-neutral-dark">Recent Portfolio Transactions</h3>
            <span className="text-xs text-brand-blue font-semibold cursor-pointer">View Full Ledger →</span>
          </div>

          <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-brand-slate text-brand-neutral-muted uppercase tracking-wider font-mono text-[11px]">
                  <th className="py-2.5 px-3">Property / Unit</th>
                  <th className="py-2.5 px-3">Resident / Owner</th>
                  <th className="py-2.5 px-3">Transaction Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Reconciliation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-slate/60">
                <tr>
                  <td className="py-3 px-3 font-bold text-brand-neutral-dark">Grandview Apts #304</td>
                  <td className="py-3 px-3 text-brand-neutral-muted">Alexander Wright</td>
                  <td className="py-3 px-3 font-mono">Monthly Rent (ACH)</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-700">+$2,450.00</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                      <CheckCircle2 className="w-3 h-3" /> Auto-Cleared
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-brand-neutral-dark">Highland Heights #102</td>
                  <td className="py-3 px-3 text-brand-neutral-muted">Apex Plumbing Inc.</td>
                  <td className="py-3 px-3 font-mono">Work Order Invoice</td>
                  <td className="py-3 px-3 font-extrabold text-brand-neutral-dark">-$180.00</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold">
                      <Clock className="w-3 h-3" /> Pending Review
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-brand-neutral-dark">Westside Retail Plaza</td>
                  <td className="py-3 px-3 text-brand-neutral-muted">Sterling Holdings LLC</td>
                  <td className="py-3 px-3 font-mono">Owner ACH Distribution</td>
                  <td className="py-3 px-3 font-extrabold text-brand-neutral-dark">-$18,450.00</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                      <CheckCircle2 className="w-3 h-3" /> Disbursed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
