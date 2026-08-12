import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, PhoneCall, CheckCircle2, Bot, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function FinalCTASection() {
  return (
    <section className="py-12 sm:py-16 bg-brand-neutral-dark text-white relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-brand-blue/15 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Floating AI Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-brand-indigo rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <Badge variant="gold" icon={Sparkles} className="relative px-4 py-1.5 text-xs font-extrabold shadow-xs bg-brand-indigo-surface border border-brand-indigo text-brand-indigo-dark">
                Predictive Intelligence Powered
              </Badge>
            </div>
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-white/5 text-white border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
              <Activity className="w-3.5 h-3.5 text-brand-indigo-light animate-pulse-slow" /> AI Health Score: 98.4 / 100
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Discover Your Portfolio's AI Potential
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed font-normal max-w-3xl mx-auto">
            Find out exactly how much revenue you can recover and how many hours you can save. Get a custom AI assessment for your properties today.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-0 bg-brand-indigo rounded-xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-500"></div>
              <Button to="/contact" variant="gold" size="lg" icon={ArrowRight} className="relative w-full sm:w-auto shadow-md font-bold">
                Start Free AI Assessment
              </Button>
            </div>
            <Button to="/contact" variant="ghost" size="lg" icon={PhoneCall} iconPosition="left" className="w-full sm:w-auto !text-white border border-white/20 hover:!bg-white/10 hover:!border-white/40 font-bold backdrop-blur-sm">
              Contact Sales Team
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-300 font-bold border-t border-white/10 max-w-2xl mx-auto">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-indigo-light" /> SOC 2 Type II Certified
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-indigo-light" /> 48-Hour Rapid Setup
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-indigo-light" /> Cancel Anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
