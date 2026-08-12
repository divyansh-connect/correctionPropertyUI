import React from 'react';
import { ShieldCheck, DollarSign, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function OwnerOverviewMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      <div className="bg-brand-neutral-dark text-white px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate">Investor & Owner Portal Workspace</span>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
          Distribution Ready
        </span>
      </div>

      <div className="p-4 sm:p-5 bg-brand-slate-surface space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
            <span className="text-brand-neutral-muted block text-[11px]">Net June Payout</span>
            <span className="text-lg font-extrabold text-brand-blue">$124,800.00</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
            <span className="text-brand-neutral-muted block text-[11px]">Operating Margin</span>
            <span className="text-lg font-extrabold text-brand-neutral-dark">68.5% NOI</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-brand-neutral-border space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 font-bold text-brand-neutral-dark">
            <span>June 2026 Owner Statement & 1099</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> ACH Sent
            </span>
          </div>
          <p className="text-brand-neutral-muted text-[11px] leading-relaxed">
            Direct deposit cleared into Chase Bank account ending #4012. Statement archived in tax vault.
          </p>
          <div className="pt-2 border-t border-brand-slate flex items-center justify-between gap-2 text-brand-blue font-semibold text-[11px]">
            <span className="flex items-center gap-1 truncate"><FileText className="w-3.5 h-3.5 shrink-0" /> June_P&L_Statement.pdf</span>
            <Download className="w-3.5 h-3.5 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
