import React from 'react';
import { TRUSTED_COMPANIES } from '../data/testimonialsData';
import { ShieldCheck } from 'lucide-react';

export default function TrustedCompanies() {
  return (
    <section className="py-8 sm:py-10 border-y border-brand-neutral-border/60 bg-white/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Header Badge */}
          <div className="flex items-center gap-3 shrink-0 text-center md:text-left">
            <div className="p-2 rounded-xl bg-brand-blue-surface text-brand-blue shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-extrabold text-brand-neutral-dark">Trusted Worldwide</p>
              <p className="text-[11px] sm:text-xs text-brand-neutral-muted font-medium">Managing 500,000+ Units Globally</p>
            </div>
          </div>

          {/* 100% Responsive Clean Grid for Logos: 2 col on mobile, 3 col on tablet, 6 col on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 w-full md:w-auto">
            {TRUSTED_COMPANIES.map((company) => (
              <div
                key={company.name}
                className="px-3 py-2 bg-brand-slate-surface/80 rounded-xl border border-brand-neutral-border/70 text-[11px] sm:text-xs font-extrabold text-brand-neutral-dark/80 tracking-widest uppercase hover:text-brand-blue hover:border-brand-blue/40 transition-all cursor-default text-center truncate shadow-2xs"
              >
                {company.logoText}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
