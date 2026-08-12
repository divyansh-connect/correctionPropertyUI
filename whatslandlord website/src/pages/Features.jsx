import React from 'react';
import { FEATURES } from '../data/featuresData';
import * as Icons from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import FinalCTASection from '../sections/FinalCTASection';

export default function Features() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={Icons.Layers} className="mb-4">
            Comprehensive Platform Capabilities
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Everything You Need to Manage & Scale Your Real Estate Portfolio
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            Explore our end-to-end property management modules designed for residential, commercial, and mixed-use real estate operations.
          </p>
        </div>
      </section>

      {/* Feature Deep Dive List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {FEATURES.map((feature, index) => {
            const Icon = Icons[feature.iconName] || Icons.Building2;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.id}
                id={feature.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  isEven ? '' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Text Content Column */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? '' : 'lg:order-2'}`}>
                  <Badge variant="green">{feature.tag}</Badge>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-neutral-dark leading-tight">
                    {feature.title}
                  </h2>
                  <p className="text-base text-brand-neutral-muted leading-relaxed">
                    {feature.fullDesc}
                  </p>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-brand-neutral-dark uppercase tracking-wider">Key Operational Benefits</h3>
                    {feature.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-sm text-brand-neutral-dark font-medium">
                        <Icons.CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button to="/contact" variant="primary" size="md" icon={Icons.ArrowRight}>
                      Request Demo for {feature.title}
                    </Button>
                  </div>
                </div>

                {/* Visual Card Column */}
                <div className={`lg:col-span-6 ${isEven ? '' : 'lg:order-1'}`}>
                  <Card variant="beige" className="p-8 sm:p-10 border-brand-slate-accent relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-brand-blue text-white flex items-center justify-center shadow-md">
                        <Icon className="w-7 h-7 text-brand-indigo-light" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-brand-neutral-dark">{feature.title}</h4>
                        <p className="text-xs text-brand-neutral-muted">Module Capability Preview</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-brand-neutral-border space-y-3">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-brand-neutral-muted">Status</span>
                        <span className="text-brand-blue font-bold flex items-center gap-1">
                          <Icons.CheckCircle2 className="w-3.5 h-3.5" /> Active Module
                        </span>
                      </div>
                      <div className="h-2 w-full bg-brand-slate rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue rounded-full w-4/5"></div>
                      </div>
                      <p className="text-xs text-brand-neutral-muted pt-2 border-t border-brand-slate">
                        Automated workflow triggers and notifications synchronized across tenant and owner portals.
                      </p>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FinalCTASection />
    </div>
  );
}
