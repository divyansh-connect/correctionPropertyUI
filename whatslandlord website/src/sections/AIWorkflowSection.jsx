import React from 'react';
import { Database, BrainCircuit, Sparkles, TrendingUp, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function AIWorkflowSection() {
  const steps = [
    {
      id: 1,
      title: 'Property Data',
      icon: Database,
      desc: 'Ingests leases, ledgers & sensors.',
      highlight: false
    },
    {
      id: 2,
      title: 'AI Analysis',
      icon: BrainCircuit,
      desc: 'Identifies anomalies & patterns.',
      highlight: false
    },
    {
      id: 3,
      title: 'Prediction Engine',
      icon: TrendingUp,
      desc: 'Forecasts trends & risks.',
      highlight: true
    },
    {
      id: 4,
      title: 'Automated Recommendation',
      icon: Sparkles,
      desc: 'Suggests optimal rent & actions.',
      highlight: false
    },
    {
      id: 5,
      title: 'Decision Support',
      icon: CheckCircle2,
      desc: 'One-click executive approvals.',
      highlight: false
    },
    {
      id: 6,
      title: 'Business Growth',
      icon: Zap,
      desc: 'Increased ROI & lower costs.',
      highlight: true
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-brand-neutral-dark text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-indigo/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="gold" icon={Sparkles} className="mb-4 bg-brand-indigo-surface/10 text-brand-indigo-light border-brand-indigo/20">
            Enterprise Workflow Automation
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6">
            How Our AI Works Silently in the Background
          </h2>
          <p className="text-gray-400 text-lg">
            From raw property data to automated financial execution, our Copilot engine processes millions of data points to deliver proactive recommendations.
          </p>
        </div>

        {/* Workflow Visualization */}
        <div className="relative mt-12">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 z-0">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-blue via-brand-indigo to-brand-blue w-full animate-pulse-slow opacity-50"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-3 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative group">
                  <div className={`p-4 xl:p-5 rounded-2xl border transition-all duration-300 h-full flex flex-col items-center text-center ${
                    step.highlight 
                      ? 'bg-brand-blue/10 border-brand-blue/30 shadow-[0_0_30px_rgba(47,79,58,0.2)] group-hover:border-brand-blue/50 group-hover:bg-brand-blue/20' 
                      : 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:bg-gray-800/80'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${
                      step.highlight 
                        ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(47,79,58,0.5)]' 
                        : 'bg-gray-800 text-gray-300 group-hover:text-brand-indigo-light'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 mb-2 uppercase tracking-widest">Phase {step.id}</span>
                    <h3 className={`text-sm font-bold mb-2 ${step.highlight ? 'text-white' : 'text-gray-200'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {step.desc}
                    </p>
                  </div>

                  {/* Arrow Indicator for mobile/tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-3 text-gray-700">
                      <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-medium text-gray-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
            <span>Over 120K+ Predictions Generated</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-blue" />
            <span>45% Average Time Saved Weekly</span>
          </div>
        </div>
      </div>
    </section>
  );
}
