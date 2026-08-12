import React from 'react';
import { ArrowRight, Sparkles, Play, CheckCircle2, ShieldCheck, Zap, Bot, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import HeroMockup from '../components/ui/HeroMockup';

export default function HeroSection() {
  return (
    <section className="relative pt-4 sm:pt-12 pb-16 sm:pb-28 overflow-hidden w-full max-w-full">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[750px] h-[350px] sm:h-[750px] bg-brand-blue/8 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-12 right-12 w-72 sm:w-96 h-72 sm:h-96 bg-brand-indigo/12 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-10 sm:mb-16">
          {/* Top AI Badge Pill */}
          <div className="mb-4 sm:mb-6 animate-fade-in flex items-center justify-center gap-2 max-w-full">
            <Badge variant="green" icon={Sparkles} className="shadow-xs py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs font-extrabold text-center max-w-full leading-tight">
              AI-Powered Enterprise Property Management Platform
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-[1.15] break-words max-w-full">
            Smarter Real Estate Decisions <br className="hidden sm:inline" />
            <span className="text-brand-blue relative inline-block">
              Powered by Predictive AI
              <span className="absolute bottom-1 left-0 right-0 h-2.5 bg-brand-indigo/25 -z-10 rounded"></span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-brand-neutral-muted leading-relaxed font-normal max-w-3xl">
            Automate double-entry trust accounting, optimize lease renewal pricing with market AI, streamline tenant rent collection, and deliver 24/7 financial transparency to property owners.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto relative">
            <div className="hidden md:flex absolute -top-5 right-1/4 translate-x-12 items-center gap-1 bg-brand-indigo-surface text-brand-indigo-dark text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-brand-indigo/30 shadow-sm animate-bounce-slow z-10">
              <Sparkles className="w-3 h-3" /> AI Powered
            </div>
            <Button to="/contact" variant="primary" size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-md font-bold hover:shadow-[0_0_20px_rgba(47,79,58,0.4)] transition-all duration-300">
              Book Interactive AI Demo
            </Button>
            <Button to="/features" variant="outline" size="lg" icon={Play} iconPosition="left" className="w-full sm:w-auto font-bold">
              Explore Capabilities
            </Button>
          </div>

          {/* AI Value Props Bullet Bar - 100% Mobile Responsive */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-brand-neutral-muted font-bold max-w-full">
            <div className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-neutral-border shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>Predictive Rent Optimizer</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-neutral-border shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>Automated Workflows</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-neutral-border shadow-2xs">
              <Bot className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>AI Recommendation Engine</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 sm:px-3 py-1.5 rounded-full border border-brand-neutral-border shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-brand-blue shrink-0" />
              <span>98.8% Occupancy Forecast</span>
            </div>
          </div>
        </div>

        {/* Dynamic Hero Dashboard Canvas with Floating AI Widgets */}
        <div className="relative max-w-5xl mx-auto animate-fade-in pt-4">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
