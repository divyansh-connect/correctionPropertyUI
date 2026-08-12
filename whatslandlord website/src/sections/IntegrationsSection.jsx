import React from 'react';
import { INTEGRATIONS } from '../data/integrationsData';
import { CreditCard, CheckCircle2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

export default function IntegrationsSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-brand-neutral-border" id="integrations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Payment & Accounting Integrations"
          badgeIcon={CreditCard}
          title="Automated Rent Payments & Ledger Synchronization"
          subtitle="Seamless online rent payment processing via Stripe and direct double-entry accounting sync with QuickBooks."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {INTEGRATIONS.map((app) => (
            <Card key={app.name} variant="beige" className="p-6 relative group hover:border-brand-blue/40 hover:shadow-card-hover transition-all">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div 
                  className="w-12 h-12 rounded-2xl bg-white border border-brand-neutral-border flex items-center justify-center font-black text-base shadow-xs group-hover:scale-105 transition-transform"
                  style={{ color: app.iconColor }}
                >
                  {app.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-white border border-brand-neutral-border text-brand-blue shadow-2xs">
                  {app.badge}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-brand-neutral-dark mb-1.5 flex items-center justify-between">
                <span>{app.name}</span>
                <ArrowUpRight className="w-5 h-5 text-brand-neutral-muted group-hover:text-brand-blue transition-colors" />
              </h3>

              <p className="text-xs sm:text-sm text-brand-neutral-muted leading-relaxed mb-4">{app.description}</p>

              <div className="pt-3 border-t border-brand-slate-accent flex items-center justify-between text-xs font-bold text-brand-neutral-dark">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {app.actionText}
                </span>
                <ShieldCheck className="w-4 h-4 text-brand-blue" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
