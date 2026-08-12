import React from 'react';
import { DollarSign, AlertCircle, ArrowUpRight, TrendingUp, RefreshCw, Send } from 'lucide-react';

export default function FinancialDashboardMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      {/* Header matching Netlify Collection Manager Screenshot 2 */}
      <div className="bg-brand-neutral-dark text-white px-5 py-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="font-bold tracking-wider">COLLECTION MANAGER • MICHAEL COLLECTION</span>
        </div>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Refresh Ledger
        </span>
      </div>

      <div className="p-5 bg-brand-slate-surface space-y-4 text-xs">
        {/* Title & Subtitle */}
        <div>
          <h4 className="text-lg font-extrabold text-brand-neutral-dark">Cashflow & Collections</h4>
          <p className="text-[11px] text-brand-neutral-muted mt-0.5">
            Monitor tenant rent receipts, owner distribution payouts, and vendor repair payments.
          </p>
        </div>

        {/* 4 KPI Cards matching Netlify Image 2 EXACTLY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border space-y-1">
            <span className="text-[10px] font-bold text-brand-neutral-muted uppercase tracking-wider block">TENANT COLLECTIONS</span>
            <span className="text-base font-extrabold text-brand-neutral-dark">$246,000</span>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit">
              <TrendingUp className="w-2.5 h-2.5" /> +12.4% Gross
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">OVERDUE BALANCE</span>
            <span className="text-base font-extrabold text-rose-600">$8,400</span>
            <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit">
              <AlertCircle className="w-2.5 h-2.5" /> -8.5% Pending
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border space-y-1">
            <span className="text-[10px] font-bold text-brand-neutral-muted uppercase tracking-wider block">OWNER PAYOUTS</span>
            <span className="text-base font-extrabold text-brand-blue">$177,120</span>
            <span className="text-[9px] text-brand-neutral-muted block truncate">Distributions processed</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border space-y-1">
            <span className="text-[10px] font-bold text-brand-neutral-muted uppercase tracking-wider block">MAINTENANCE EXPENSES</span>
            <span className="text-base font-extrabold text-brand-neutral-dark">$12,500</span>
            <span className="text-[9px] text-brand-neutral-muted block truncate">Invoices paid to vendors</span>
          </div>
        </div>

        {/* Follow-Up Required Card (Exact Robert Johnson $1450 Netlify Screenshot) */}
        <div className="p-4 rounded-xl bg-white border border-brand-neutral-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-extrabold text-brand-neutral-dark">Follow-Up Required</h5>
              <p className="text-[10px] text-brand-neutral-muted">Tenants with outstanding balances requiring contact</p>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">1 Overdue</span>
          </div>

          <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="font-bold text-brand-neutral-dark text-xs block">Robert Johnson</span>
              <span className="text-[10px] text-rose-700 font-semibold">Unit 205 • 12 days late</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-extrabold text-rose-600">$1,450</span>
              <button className="px-2.5 py-1 bg-brand-blue text-white rounded-lg text-[10px] font-bold hover:bg-brand-blue-dark flex items-center gap-1">
                <Send className="w-2.5 h-2.5" />
                <span>Send Alert</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
