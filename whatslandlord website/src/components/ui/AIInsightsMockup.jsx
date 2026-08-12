import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

export default function AIInsightsMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      <div className="bg-brand-neutral-dark text-white px-5 py-3 flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-indigo-light" />
          <span>AI Portfolio Intelligence & Anomaly Engine</span>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-indigo/20 text-brand-indigo-light border border-brand-indigo/30">
          12 AI Models Active
        </span>
      </div>

      <div className="p-5 bg-brand-slate-surface space-y-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white border border-brand-slate-accent space-y-2">
          <div className="flex items-center justify-between font-bold text-brand-neutral-dark">
            <span className="flex items-center gap-1.5 text-brand-blue">
              <TrendingUp className="w-4 h-4" /> Market Rent Optimization
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-blue-surface text-brand-blue">
              +$1,140/mo Opportunity
            </span>
          </div>
          <p className="text-brand-neutral-muted text-[11px]">
            Comparative market analysis of 12 units expiring in August indicates room for +5.2% rent adjustment based on neighborhood demand metrics.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-brand-slate-accent space-y-2">
          <div className="flex items-center justify-between font-bold text-brand-neutral-dark">
            <span className="flex items-center gap-1.5 text-amber-700">
              <AlertTriangle className="w-4 h-4" /> Vendor Bill Duplicate Detection
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              Flagged ($240.00)
            </span>
          </div>
          <p className="text-brand-neutral-muted text-[11px]">
            Duplicate invoice #8042 detected from City Electric. Auto-flagged before disbursement processing.
          </p>
        </div>
      </div>
    </div>
  );
}
