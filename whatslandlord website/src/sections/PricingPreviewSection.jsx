import React, { useState } from 'react';
import { PRICING_PLANS } from '../data/pricingData';
import { Check, ArrowRight, Tag } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function PricingPreviewSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-brand-neutral-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Simple Pricing"
          badgeIcon={Tag}
          title="Transparent Enterprise SaaS Plans"
          subtitle="Choose the right subscription tier for your portfolio size with no hidden software fees."
        />

        {/* Annual / Monthly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-bold ${!annualBilling ? 'text-brand-blue' : 'text-brand-neutral-muted'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setAnnualBilling(!annualBilling)}
            className="w-14 h-8 rounded-full bg-brand-blue p-1 transition-colors relative cursor-pointer"
          >
            <div
              className={`w-6 h-6 rounded-full bg-white transition-transform duration-200 ${
                annualBilling ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${annualBilling ? 'text-brand-blue' : 'text-brand-neutral-muted'}`}>
              Annual Billing
            </span>
            <Badge variant="gold">Save 20%</Badge>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = annualBilling ? plan.annualPrice : plan.monthlyPrice;
            return (
              <Card
                key={plan.id}
                variant={plan.popular ? 'beige' : 'white'}
                className={`flex flex-col justify-between relative ${
                  plan.popular ? 'border-2 border-brand-blue shadow-xl' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant="green" className="shadow-xs font-bold">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-extrabold text-brand-neutral-dark mb-2">{plan.name}</h3>
                  <p className="text-xs text-brand-neutral-muted leading-relaxed mb-6">{plan.description}</p>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-brand-slate">
                    <span className="text-4xl font-extrabold text-brand-neutral-dark">${price}</span>
                    <span className="text-xs font-semibold text-brand-neutral-muted">/ unit / month</span>
                  </div>

                  <ul className="space-y-3 text-xs mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-brand-neutral-dark font-medium">
                        <Check className="w-4 h-4 text-brand-blue shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  to="/pricing"
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  icon={ArrowRight}
                  className="w-full"
                >
                  {plan.ctaText}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
