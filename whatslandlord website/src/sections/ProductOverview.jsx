import React from 'react';
import { ArrowRight, CheckCircle2, Building, DollarSign, Layers, ShieldCheck, Sparkles, Bot } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function ProductOverview() {
  return (
    <section className="py-12 sm:py-16 bg-brand-slate">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Product Overview"
          badgeIcon={Layers}
          title="Designed for Clarity, Built for Scale"
          subtitle="Replace disconnected spreadsheets, separate accounting software, and manual paper workflows with one unified property management ecosystem."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-dark leading-tight">
              One Single Source of Truth for Your Entire Real Estate Portfolio
            </h3>

            <p className="text-base text-brand-neutral-muted leading-relaxed">
              Whether you oversee 50 single-family units, a 2,000-unit residential apartment community, or a mixed commercial plaza, our platform brings operational rigor and financial precision to every transaction.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-brand-blue-surface text-brand-blue mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-neutral-dark">Automated Double-Entry Accounting</h4>
                  <p className="text-sm text-brand-neutral-muted">Bank feed sync, auto-reconciliation, and segregated trust accounts built for property management rules.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-brand-blue-surface text-brand-blue mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-neutral-dark">24/7 Mobile Resident & Owner Portals</h4>
                  <p className="text-sm text-brand-neutral-muted">Tenants pay rent and log repair tickets on their phones; owners access live P&L statements and ACH payouts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-brand-blue-surface text-brand-blue mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-brand-neutral-dark">Work Order & Vendor Dispatching</h4>
                  <p className="text-sm text-brand-neutral-muted">Track repair requests with photos, assign vendors, and reconcile maintenance invoices automatically.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button to="/features" variant="primary" size="lg" icon={ArrowRight}>
                Explore All Product Features
              </Button>
            </div>
          </div>

          {/* Right Column: Premium Interactive Illustration Card */}
          <div className="mt-8 lg:mt-0">
            <Card variant="white" className="p-4 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-brand-slate pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-brand-neutral-dark">Oakridge Towers & Plaza</h4>
                    <p className="text-xs text-brand-neutral-muted">140 Residential Units • Commercial Retail</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  Active Portfolio
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Metric Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  <div className="p-3 rounded-xl bg-brand-slate-surface border border-brand-slate-accent flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                    <span className="text-brand-neutral-muted block text-[11px]">Monthly Rent</span>
                    <span className="text-base font-extrabold text-brand-neutral-dark">$184,200</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-slate-surface border border-brand-slate-accent flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                    <span className="text-brand-neutral-muted block text-[11px]">Occupancy</span>
                    <span className="text-base font-extrabold text-brand-blue">98.5%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-slate-surface border border-brand-slate-accent flex sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                    <span className="text-brand-neutral-muted block text-[11px]">NOI Margin</span>
                    <span className="text-base font-extrabold text-brand-neutral-dark">71.2%</span>
                  </div>
                </div>

                {/* Progress bar card */}
                <div className="p-4 rounded-xl border border-brand-neutral-border bg-white shadow-xs relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-indigo/10 rounded-full blur-xl group-hover:bg-brand-indigo/20 transition-all"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2 relative z-10">
                    <span className="font-bold text-brand-neutral-dark flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-indigo-dark" /> AI Predicted Collection
                    </span>
                    <span className="font-extrabold text-brand-blue">99.1% Confidence</span>
                  </div>
                  <div className="w-full h-3 bg-brand-slate rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-brand-blue rounded-full relative" style={{ width: '99.1%' }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Feed */}
                <div className="p-4 rounded-xl border border-brand-neutral-border bg-brand-slate-surface space-y-2.5">
                  <span className="font-bold text-brand-neutral-dark block text-xs flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-brand-blue" /> AI Copilot Log
                  </span>
                  <div className="flex items-center justify-between text-brand-neutral-muted gap-2">
                    <span className="truncate flex-1">• AI dispatched emergency plumber to Unit 304</span>
                    <span className="font-mono text-[10px] shrink-0 whitespace-nowrap">Just now</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-neutral-muted gap-2">
                    <span className="truncate flex-1">• ACH Payment #8402 auto-reconciled</span>
                    <span className="font-mono text-[10px] shrink-0 whitespace-nowrap">12m ago</span>
                  </div>
                  <div className="flex items-center justify-between text-brand-neutral-muted gap-2">
                    <span className="truncate flex-1">• Dynamic rent model adjusted 5 leases</span>
                    <span className="font-mono text-[10px] shrink-0 whitespace-nowrap">1h ago</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
