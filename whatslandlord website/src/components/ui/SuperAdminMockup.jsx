import React from 'react';
import { Shield, Globe, Users, Building, Activity } from 'lucide-react';

export default function SuperAdminMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      <div className="bg-brand-neutral-dark text-white px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-indigo-light shrink-0" />
          <span className="truncate">Super Admin Executive Control Center</span>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-blue text-white shrink-0">
          24 Entities Active
        </span>
      </div>

      <div className="p-4 sm:p-5 bg-brand-slate-surface space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
            <span className="text-brand-neutral-muted block text-[11px]">Managed Entities</span>
            <span className="text-base font-extrabold text-brand-neutral-dark">24 Companies</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
            <span className="text-brand-neutral-muted block text-[11px]">Total Units</span>
            <span className="text-base font-extrabold text-brand-blue">14,850 Units</span>
          </div>
          <div className="p-3 rounded-xl bg-white border border-brand-neutral-border flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
            <span className="text-brand-neutral-muted block text-[11px]">System SLA</span>
            <span className="text-base font-extrabold text-brand-indigo-dark">99.98% Health</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-brand-neutral-border space-y-2">
          <div className="flex items-center justify-between gap-2 font-bold text-brand-neutral-dark">
            <span className="flex items-center gap-1.5 truncate"><Globe className="w-4 h-4 text-brand-blue shrink-0" /> Global Governance & Audit Log</span>
            <span className="text-[10px] text-brand-neutral-muted font-mono shrink-0">RBAC Active</span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-brand-slate-surface text-brand-neutral-dark">
              <span className="truncate flex-1">• Executive Admin updated trust accounting permissions</span>
              <span className="text-gray-400 font-mono shrink-0 whitespace-nowrap">10m ago</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-2 rounded bg-brand-slate-surface text-brand-neutral-dark">
              <span className="truncate flex-1">• Regional Portfolio B added 450 new units</span>
              <span className="text-gray-400 font-mono shrink-0 whitespace-nowrap">1h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
