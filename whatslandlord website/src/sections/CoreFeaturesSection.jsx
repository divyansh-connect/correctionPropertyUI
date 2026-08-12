import React from 'react';
import { FEATURES } from '../data/featuresData';
import * as Icons from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function CoreFeaturesSection() {
  return (
    <section className="py-10 sm:py-16 bg-white border-y border-brand-neutral-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Platform Capability Suite"
          badgeIcon={Icons.Layers}
          title="Enterprise SaaS Modules Built for Scale"
          subtitle="Explore the major property management modules engineered with double-entry trust accounting, automated rent collection, and predictive AI dispatch."
        />

        {/* 100% Responsive Grid: 1 col on mobile, 2 col on tablet/sm, 3 col on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {FEATURES.map((feature) => {
            const IconComponent = Icons[feature.iconName] || Icons.Building2;
            return (
              <Card 
                key={feature.id} 
                variant="white" 
                className={`flex flex-col justify-between h-full p-4 sm:p-6 group hover:-translate-y-1 transition-all duration-300 shadow-card ${feature.isAI ? 'hover:border-brand-indigo/60 hover:shadow-card-hover border-brand-indigo/20' : 'hover:border-brand-blue/40'}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 sm:mb-5 flex-wrap gap-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-xs ${feature.isAI ? 'bg-brand-indigo-surface text-brand-indigo-dark group-hover:bg-brand-indigo group-hover:text-white' : 'bg-brand-blue-surface text-brand-blue group-hover:bg-brand-blue group-hover:text-white'}`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {feature.isAI && (
                        <span className="text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-indigo-surface text-brand-indigo-dark border border-brand-indigo/30 flex items-center gap-1">
                          <Icons.Sparkles className="w-3 h-3" /> {feature.aiTag || 'AI Powered'}
                        </span>
                      )}
                      <Badge variant="neutral" className="text-[10px] sm:text-xs">{feature.tag}</Badge>
                    </div>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-extrabold text-brand-neutral-dark mb-2 transition-colors leading-snug break-words ${feature.isAI ? 'group-hover:text-brand-indigo-dark' : 'group-hover:text-brand-blue'}`}>
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-neutral-muted leading-relaxed mb-4 sm:mb-6">
                    {feature.shortDesc}
                  </p>

                  {/* Responsive Mini Visual UI Snippet */}
                  <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-xl bg-brand-slate-surface border border-brand-slate-accent text-xs space-y-1.5 font-mono overflow-hidden">
                    <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-brand-neutral-muted">
                      <span>{feature.isAI ? 'AI ENGINE' : 'ENTERPRISE MODULE'}</span>
                      <span className={`${feature.isAI ? 'text-brand-indigo-dark' : 'text-brand-blue'} font-extrabold flex items-center gap-1`}>
                        <Icons.CheckCircle2 className="w-3 h-3" /> ACTIVE
                      </span>
                    </div>
                    <div className="font-bold text-brand-neutral-dark text-[10px] sm:text-[11px] truncate">
                      <span>{feature.benefits[0]}</span>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 sm:pt-4 border-t border-brand-slate flex items-center justify-between text-xs font-extrabold relative z-10 ${feature.isAI ? 'text-brand-indigo-dark' : 'text-brand-blue'}`}>
                  <span>Explore module details</span>
                  <Icons.ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
