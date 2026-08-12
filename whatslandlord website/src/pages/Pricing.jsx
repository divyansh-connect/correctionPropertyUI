import React, { useState } from 'react';
import { PRICING_PLANS, COMPARISON_MATRIX } from '../data/pricingData';
import { Check, X, Tag, HelpCircle, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Accordion from '../components/ui/Accordion';
import { FAQS } from '../data/faqData';
import FinalCTASection from '../sections/FinalCTASection';

export default function Pricing() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={Tag} className="mb-4">
            Predictable Pricing Plans
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Simple, Transparent Pricing Designed to Scale
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            No long-term contracts. No hidden per-feature add-ons. Pick a plan built for your portfolio scale.
          </p>

          {/* 100% Mobile Responsive Toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8 sm:mt-10 px-2 max-w-full">
            <span className={`text-xs sm:text-sm font-bold ${!annualBilling ? 'text-brand-blue' : 'text-brand-neutral-muted'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="w-12 h-7 sm:w-14 sm:h-8 rounded-full bg-brand-blue p-1 transition-colors relative cursor-pointer shrink-0"
              aria-label="Toggle billing frequency"
            >
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white transition-transform duration-200 ${
                  annualBilling ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className={`text-xs sm:text-sm font-bold ${annualBilling ? 'text-brand-blue' : 'text-brand-neutral-muted'}`}>
                Annual Billing
              </span>
              <Badge variant="gold" className="text-[10px] sm:text-xs">Save 20%</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
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
                    to="/contact"
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

          {/* Feature Comparison Matrix */}
          <div className="mt-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-brand-neutral-dark">Compare Plan Features</h2>
              <p className="text-sm text-brand-neutral-muted mt-2">Comprehensive side-by-side feature breakdown across all plan tiers.</p>
            </div>

            <div className="overflow-x-auto border border-brand-neutral-border rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-brand-slate border-b border-brand-neutral-border text-brand-neutral-dark font-extrabold">
                    <th className="py-4 px-6">Feature Capabilities</th>
                    <th className="py-4 px-6 text-center">Starter</th>
                    <th className="py-4 px-6 text-center">Professional</th>
                    <th className="py-4 px-6 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-neutral-border/60">
                  {COMPARISON_MATRIX.map((section, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <tr className="bg-brand-slate-surface/60 font-bold text-xs uppercase text-brand-neutral-muted tracking-wider">
                        <td colSpan={4} className="py-3 px-6">{section.category}</td>
                      </tr>
                      {section.items.map((item, iIdx) => (
                        <tr key={iIdx} className="hover:bg-brand-slate/30 transition-colors">
                          <td className="py-3.5 px-6 font-medium text-brand-neutral-dark">{item.feature}</td>
                          <td className="py-3.5 px-6 text-center">
                            {typeof item.starter === 'boolean' ? (
                              item.starter ? <Check className="w-5 h-5 text-brand-blue mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-xs font-semibold text-brand-neutral-muted">{item.starter}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            {typeof item.pro === 'boolean' ? (
                              item.pro ? <Check className="w-5 h-5 text-brand-blue mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-xs font-semibold text-brand-neutral-muted">{item.pro}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            {typeof item.enterprise === 'boolean' ? (
                              item.enterprise ? <Check className="w-5 h-5 text-brand-blue mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-xs font-semibold text-brand-neutral-muted">{item.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-extrabold text-brand-neutral-dark text-center mb-8">Pricing FAQ</h3>
            <Accordion items={FAQS.filter(f => f.category === 'Financials & Payments' || f.category === 'General Overview')} />
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  );
}
