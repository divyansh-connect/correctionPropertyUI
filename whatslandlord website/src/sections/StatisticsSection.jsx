import React from 'react';
import { STATISTICS } from '../data/statisticsData';
import { TrendingUp } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';

export default function StatisticsSection() {
  return (
    <section className="py-12 sm:py-16 bg-brand-slate relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          badge="Proven Portfolio Scale"
          badgeIcon={TrendingUp}
          title="Empowering Industry Leaders Nationwide"
          subtitle="Real results driven by enterprise technology, automated property accounting, and resident engagement."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATISTICS.map((stat) => (
            <div
              key={stat.id}
              className="p-6 rounded-2xl bg-white border border-brand-neutral-border shadow-sm flex flex-col justify-between text-center transition-all hover:shadow-md"
            >
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-base font-bold text-brand-neutral-dark mb-2">{stat.label}</div>
              </div>
              <p className="text-xs text-brand-neutral-muted leading-relaxed pt-3 border-t border-brand-neutral-border/50">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
