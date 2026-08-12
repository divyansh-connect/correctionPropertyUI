import React from 'react';
import { Sparkles, Zap, TrendingUp, AlertTriangle, MessageSquare, CheckCircle2, ShieldAlert, BarChart2 } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import AIDashboardMockup from '../components/ui/AIDashboardMockup';
import Badge from '../components/ui/Badge';

export default function AISection() {
  const aiFeatures = [
    {
      title: 'AI Rent Prediction & Optimization',
      desc: 'Analyze local market comps and neighborhood demand trends to optimize lease pricing upon renewals automatically.',
      icon: TrendingUp,
      tag: 'Revenue Gain'
    },
    {
      title: 'Maintenance Triage & Suggestions',
      desc: 'Automatically classify resident repair requests, detect emergency priority levels, and draft vendor work orders.',
      icon: Zap,
      tag: 'Instant Dispatch'
    },
    {
      title: 'Vacancy & Renewal Forecast',
      desc: 'Identify tenants at risk of non-renewal up to 90 days early, enabling proactive leasing team outreach.',
      icon: BarChart2,
      tag: 'Occupancy Boost'
    },
    {
      title: 'Risk & Duplicate Detection',
      desc: 'AI automatically scans vendor bills, flags duplicate charges, and alerts accounting before disbursements are sent.',
      icon: ShieldAlert,
      tag: 'Audit Protection'
    },
    {
      title: 'Revenue Analytics & NOIs',
      desc: 'Detect margin drift and expense inflation across properties to keep net operating income optimized.',
      icon: Sparkles,
      tag: 'Financial AI'
    },
    {
      title: 'Smart Resident Notifications',
      desc: 'Instantly resolve 70% of routine tenant inquiries regarding rent balances, parking policies, and maintenance schedules.',
      icon: MessageSquare,
      tag: '24/7 Response'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-brand-neutral-dark text-white relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          badge="AI & Intelligence"
          badgeIcon={Sparkles}
          title="Predictive AI Powered by Real Estate Intelligence"
          subtitle="Transform passive data into active portfolio optimization. Automate routine admin work, detect financial anomalies, and maximize net operating income."
          className="text-white"
        />

        {/* AI Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {aiFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gray-800/80 border border-gray-700 hover:border-brand-indigo/60 transition-all duration-300 space-y-4 hover:-translate-y-1 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-brand-blue text-brand-indigo-light inline-block shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-indigo/20 text-brand-indigo-light border border-brand-indigo/30">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold border-t border-gray-700/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Automated AI Model</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Interactive AI Marketing Dashboard Mockup */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo-light">Live Marketing Preview</span>
            <h3 className="text-2xl font-extrabold text-white mt-1">Interactive AI Control Center</h3>
          </div>
          <AIDashboardMockup />
        </div>
      </div>
    </section>
  );
}
