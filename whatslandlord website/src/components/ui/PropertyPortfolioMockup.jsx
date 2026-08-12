import React from 'react';
import { Building2, CheckCircle2, MapPin, Users } from 'lucide-react';

export default function PropertyPortfolioMockup() {
  const units = [
    { number: 'Unit 101', status: 'Occupied', tenant: 'Alexander Wright', rent: '$2,450/mo', type: '2B / 2B' },
    { number: 'Unit 102', status: 'Occupied', tenant: 'Sophia Chen', rent: '$1,950/mo', type: '1B / 1B' },
    { number: 'Unit 103', status: 'Lease Renewal', tenant: 'Marcus Vance', rent: '$2,650/mo', type: '2B / 2B' },
    { number: 'Unit 104', status: 'Available', tenant: 'Ready for Move-in', rent: '$2,200/mo', type: '1B / 1.5B' }
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-brand-neutral-border shadow-card overflow-hidden">
      <div className="bg-brand-neutral-dark text-white px-5 py-3 flex items-center justify-between text-xs font-mono">
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-brand-indigo-light" />
          <span>Oakridge Luxury Apartment Complex (140 Units)</span>
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-blue text-white">98.5% Occupied</span>
      </div>

      <div className="p-5 bg-brand-slate-surface space-y-3 text-xs">
        <div className="flex justify-between items-center text-brand-neutral-muted mb-2 font-semibold">
          <span>Unit Directory & Status Grid</span>
          <span>Showing 4 of 140 Units</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {units.map((u, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white border border-brand-neutral-border space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between font-bold text-brand-neutral-dark">
                <span>{u.number}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  u.status === 'Occupied' ? 'bg-emerald-100 text-emerald-800' :
                  u.status === 'Lease Renewal' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {u.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-brand-neutral-muted text-[11px]">
                <span>{u.tenant}</span>
                <span className="font-bold text-brand-neutral-dark">{u.rent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
