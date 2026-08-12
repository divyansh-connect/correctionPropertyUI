import React from 'react';
import { ArrowUpRight, TrendingUp, Activity, PieChart, ShieldAlert, Sparkles, Building2, CalendarClock } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function PredictiveAnalyticsSection() {
  const analyticsCards = [
    {
      title: 'Rent Prediction Engine',
      value: '+$112/mo',
      trend: '+5.2%',
      trendDesc: 'Recommended increase',
      icon: TrendingUp,
      status: 'High Confidence',
      statusColor: 'text-brand-blue bg-brand-blue-surface'
    },
    {
      title: 'Occupancy Forecast',
      value: '98.8%',
      trend: '+1.4%',
      trendDesc: 'Next 90 Days',
      icon: Activity,
      status: 'Stable',
      statusColor: 'text-emerald-700 bg-emerald-50'
    },
    {
      title: 'Maintenance Forecast',
      value: '14 Units',
      trend: '-30%',
      trendDesc: 'Preventative vs Reactive',
      icon: ShieldAlert,
      status: 'Action Needed',
      statusColor: 'text-amber-700 bg-amber-50'
    },
    {
      title: 'Lease Expiration Risk',
      value: '42 Leases',
      trend: '68%',
      trendDesc: 'Auto-renewal probability',
      icon: CalendarClock,
      status: 'Monitoring',
      statusColor: 'text-blue-700 bg-blue-50'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-brand-slate-surface border-t border-brand-neutral-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center">
          
          {/* Left Text Content */}
          <div className="lg:w-1/2">
            <Badge variant="gold" icon={Sparkles} className="mb-6 shadow-sm border-brand-indigo/30">
              Predictive Intelligence
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-neutral-dark tracking-tight mb-6 leading-[1.15]">
              Don't just track data. <br />
              <span className="text-brand-blue">Predict the future of your portfolio.</span>
            </h2>
            <p className="text-lg text-brand-neutral-muted mb-8 leading-relaxed">
              Our advanced machine learning models analyze local market comps, historical tenant behavior, and seasonal maintenance patterns to give you proactive foresight before issues arise.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-brand-neutral-border flex items-center justify-center shrink-0">
                  <PieChart className="w-5 h-5 text-brand-indigo-dark" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-neutral-dark text-base mb-1">Revenue Projections</h4>
                  <p className="text-sm text-brand-neutral-muted">Model cash flow for the next 12 months with 96% accuracy based on historical lease data.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-brand-neutral-border flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-bold text-brand-neutral-dark text-base mb-1">Market Trend Analysis</h4>
                  <p className="text-sm text-brand-neutral-muted">Automatically benchmark your property rates against real-time neighborhood census data.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dashboard Grid */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analyticsCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white p-5 rounded-2xl border border-brand-neutral-border cursor-default relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-brand-slate-surface flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-neutral-dark" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${card.statusColor}`}>
                        {card.status}
                      </span>
                    </div>
                    
                    <div className="relative z-10">
                      <h4 className="text-xs font-bold text-brand-neutral-muted mb-1">{card.title}</h4>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-black text-brand-neutral-dark">{card.value}</span>
                        <span className="flex items-center text-xs font-bold text-brand-blue">
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          {card.trend}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-neutral-muted">{card.trendDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
