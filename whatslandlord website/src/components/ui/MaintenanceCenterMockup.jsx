import React from 'react';
import { Wrench, Calendar, DollarSign, Play, Eye, Search } from 'lucide-react';

export default function MaintenanceCenterMockup() {
  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      {/* Header matching Netlify Screenshot 1 */}
      <div className="bg-brand-neutral-dark text-white px-5 py-3.5 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          <span className="font-bold tracking-wider">STAFF PORTAL • TECHNICIAN LEAD 1</span>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          ACTIVE TASKS (84)
        </span>
      </div>

      <div className="p-5 bg-brand-slate-surface space-y-4 text-xs">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-neutral-muted" />
          <input 
            type="text" 
            placeholder="Search tasks by ID, property, or issue..." 
            className="w-full bg-white border border-brand-neutral-border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none text-brand-neutral-dark font-medium"
            readOnly
          />
        </div>

        {/* Work Order Task Card 1 (WO-40010 - Exact Netlify Screenshot Data) */}
        <div className="p-4 rounded-xl bg-white border-2 border-amber-500/40 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-brand-blue-surface text-brand-blue font-bold font-mono text-[10px]">
                WO-40010
              </span>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold text-[10px]">
                Assigned
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-extrabold text-[9px] uppercase tracking-wider">
              HIGH PRIORITY
            </span>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-brand-neutral-dark">Broken Door Lock</h4>
            <p className="text-[11px] text-brand-neutral-muted font-medium mt-0.5">
              Oakridge Heights • Unit 205
            </p>
          </div>

          <p className="text-[11px] text-brand-neutral-dark/80 leading-relaxed bg-brand-slate p-2.5 rounded-lg border border-brand-slate-accent">
            The front door lock is loose and difficult to lock/unlock. Needs inspection and possibly replacement.
          </p>

          <div className="flex items-center justify-between text-[11px] pt-1 text-brand-neutral-muted">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-brand-blue" />
              <span>11 Jul 2026</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-brand-neutral-dark">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>ESTIMATED BUDGET: $350</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-slate-accent">
            <button className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-lg text-xs flex items-center gap-1.5 shadow-xs">
              <Play className="w-3 h-3 fill-current" />
              <span>Start Work</span>
            </button>
            <button className="px-3 py-1.5 bg-brand-slate hover:bg-brand-slate-accent border border-brand-neutral-border text-brand-neutral-dark font-bold rounded-lg text-xs flex items-center gap-1">
              <Eye className="w-3 h-3 text-brand-blue" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
