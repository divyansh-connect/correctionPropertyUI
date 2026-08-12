import React from 'react';
import { UserCheck, CreditCard, CheckCircle2, Wrench, FileCheck } from 'lucide-react';

export default function TenantPortalMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      <div className="bg-brand-neutral-dark text-white px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-brand-indigo-light shrink-0" />
          <span className="truncate">Resident Mobile Self-Service App</span>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-blue text-white shrink-0">
          Autopay Active
        </span>
      </div>

      <div className="p-4 sm:p-5 bg-brand-slate-surface space-y-3 text-xs">
        <div className="p-4 rounded-xl bg-white border border-brand-neutral-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-brand-neutral-muted text-[11px]">Upcoming Rent Due (1st)</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Scheduled</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-1">
            <span className="text-2xl font-extrabold text-brand-neutral-dark">$1,850.00</span>
            <span className="text-xs font-bold text-brand-blue flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> ACH Autopay (#8402)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-brand-neutral-dark block text-[11px]">1 Active Repair</span>
              <span className="text-[10px] text-brand-neutral-muted">HVAC Technician 2PM</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-blue-surface text-brand-blue shrink-0">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-brand-neutral-dark block text-[11px]">Active Lease</span>
              <span className="text-[10px] text-brand-neutral-muted">Expires May 2027</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
