import React from 'react';
import { SOLUTIONS } from '../data/solutionsData';
import * as Icons from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FinalCTASection from '../sections/FinalCTASection';

export default function Solutions() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={Icons.Users} className="mb-4">
            Tailored Industry Solutions
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Tailored Software Workflows for Every Stakeholder
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            Whether you are managing thousands of units, reporting to investors, or residing in a property, our platform offers a personalized workspace for your needs.
          </p>
        </div>
      </section>

      {/* Solutions Sections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {SOLUTIONS.map((sol, index) => {
            const Icon = Icons[sol.iconName] || Icons.Building;
            const isEven = index % 2 === 0;

            return (
              <div key={sol.id} id={sol.id} className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6 text-brand-indigo-light" />
                  </div>
                  <div>
                    <Badge variant="green">{sol.role}</Badge>
                    <h2 className="text-3xl font-extrabold text-brand-neutral-dark mt-1">{sol.title}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Problem & Solution Cards */}
                  <div className="lg:col-span-6">
                    <Card variant="white" className="p-7 space-y-4 border-red-100 bg-red-50/30 h-full">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-red-700 uppercase tracking-wider">
                        <Icons.AlertCircle className="w-4 h-4" />
                        <span>The Operational Challenge</span>
                      </div>
                      <p className="text-base text-brand-neutral-dark font-medium leading-relaxed">
                        {sol.problem}
                      </p>
                    </Card>
                  </div>

                  <div className="lg:col-span-6">
                    <Card variant="white" className="p-7 space-y-4 border-emerald-100 bg-emerald-50/30 h-full">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
                        <Icons.CheckCircle2 className="w-4 h-4" />
                        <span>The Platform Solution</span>
                      </div>
                      <p className="text-base text-brand-neutral-dark font-medium leading-relaxed">
                        {sol.solution}
                      </p>
                    </Card>
                  </div>
                </div>

                {/* Benefits & Highlights Grid */}
                <div className="mt-8 p-8 rounded-2xl bg-brand-slate border border-brand-slate-accent">
                  <h3 className="text-lg font-bold text-brand-neutral-dark mb-4">Core Benefits for {sol.role}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sol.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm text-brand-neutral-dark font-medium">
                        <Icons.CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-brand-slate-accent flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {sol.highlights.map((h, hIdx) => (
                        <span key={hIdx} className="px-3 py-1 text-xs font-semibold rounded-full bg-white border border-brand-neutral-border text-brand-neutral-dark">
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <Button to="/login" variant="outline" size="md" icon={Icons.ShieldCheck}>
                        Preview Live Portal
                      </Button>
                      <Button to="/contact" variant="primary" size="md" icon={Icons.ArrowRight}>
                        Get Solution Guide
                      </Button>
                    </div>
                  </div>
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
