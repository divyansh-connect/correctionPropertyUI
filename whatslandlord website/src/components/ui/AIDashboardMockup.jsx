import React, { useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Zap, ShieldAlert, CheckCircle2, ArrowUpRight, BarChart2 } from 'lucide-react';

export default function AIDashboardMockup() {
  const [activeTab, setActiveTab] = useState('prediction');

  return (
    <div className="w-full bg-white rounded-3xl border border-brand-neutral-border shadow-hero-card overflow-hidden">
      {/* Top Header Bar */}
      <div className="bg-brand-neutral-dark text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-indigo/20 text-brand-indigo-light border border-brand-indigo/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">AI Predictive Intelligence Engine</span>
            <span className="text-[10px] text-gray-400 font-mono">Real Estate ML Models • Version 4.2</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 6 Models Active
          </span>
        </div>
      </div>

      {/* AI Sub-navigation */}
      <div className="bg-brand-slate-surface border-b border-brand-neutral-border p-3 flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTab('prediction')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'prediction' ? 'bg-brand-blue text-white shadow-xs' : 'bg-white text-brand-neutral-dark border border-brand-neutral-border'
          }`}
        >
          Rent Price Optimization
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'maintenance' ? 'bg-brand-blue text-white shadow-xs' : 'bg-white text-brand-neutral-dark border border-brand-neutral-border'
          }`}
        >
          Maintenance Triage
        </button>
        <button
          onClick={() => setActiveTab('risk')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'risk' ? 'bg-brand-blue text-white shadow-xs' : 'bg-white text-brand-neutral-dark border border-brand-neutral-border'
          }`}
        >
          Risk & Duplicate Detection
        </button>
      </div>

      {/* Main AI Body Canvas */}
      <div className="p-6 bg-white space-y-6 text-xs">
        {activeTab === 'prediction' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-neutral-dark">Lease Pricing & Revenue Forecast</h4>
                <p className="text-brand-neutral-muted text-[11px]">Neighborhood market comps & predictive modeling</p>
              </div>
              <span className="text-xs font-bold text-brand-blue bg-brand-blue-surface px-2.5 py-1 rounded-full border border-brand-blue/20">
                +$1,140/mo Rec. Gain
              </span>
            </div>

            {/* Smart KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-brand-slate-surface border border-brand-slate-accent space-y-1">
                <span className="text-brand-neutral-muted block text-[10px] uppercase font-bold tracking-wider">Portfolio Health</span>
                <span className="text-lg font-extrabold text-brand-neutral-dark">94%</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Optimal
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-brand-slate-surface border border-brand-slate-accent space-y-1">
                <span className="text-brand-neutral-muted block text-[10px] uppercase font-bold tracking-wider">Market Rent Index</span>
                <span className="text-lg font-extrabold text-brand-neutral-dark">$2,540</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> +4.8% vs Zip Code
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-brand-slate-surface border border-brand-slate-accent space-y-1">
                <span className="text-brand-neutral-muted block text-[10px] uppercase font-bold tracking-wider">Risk Score</span>
                <span className="text-lg font-extrabold text-emerald-700">12 / 100</span>
                <span className="text-[10px] text-brand-neutral-muted">Low Vacancy Risk</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-brand-slate-surface border border-brand-slate-accent space-y-1">
                <span className="text-brand-neutral-muted block text-[10px] uppercase font-bold tracking-wider">Auto Renewals</span>
                <span className="text-lg font-extrabold text-brand-blue">89%</span>
                <span className="text-[10px] text-brand-neutral-muted">14 Units Expiring</span>
              </div>
            </div>

            {/* Revenue Forecast Chart */}
            <div className="p-4 rounded-2xl bg-white border border-brand-neutral-border shadow-xs mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-brand-neutral-dark uppercase tracking-wider">AI Cash Flow Projection (Next 6 Mo)</span>
                <span className="text-[10px] text-brand-indigo-dark font-bold bg-brand-indigo-surface px-2 py-0.5 rounded">98% Confidence</span>
              </div>
              <div className="h-28 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" fill="none">
                  {/* Grid */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#F1F5F9" strokeDasharray="2 2" />
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#F1F5F9" strokeDasharray="2 2" />
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#F1F5F9" strokeDasharray="2 2" />
                  
                  {/* Curve */}
                  <path
                    d="M 10,75 C 80,65 150,55 220,40 C 290,25 360,15 390,10"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 220,40 C 290,35 360,35 390,40"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                  
                  {/* Nodes */}
                  <circle cx="10" cy="75" r="3" fill="#2563EB" />
                  <circle cx="80" cy="65" r="3" fill="#2563EB" />
                  <circle cx="150" cy="55" r="3" fill="#2563EB" />
                  <circle cx="220" cy="40" r="4" fill="#4F46E5" />
                  <circle cx="290" cy="25" r="3" fill="#2563EB" />
                  <circle cx="390" cy="10" r="4" fill="#2563EB" />
                  
                  {/* Labels */}
                  <text x="290" y="95" textAnchor="middle" fill="#2563EB" fontSize="8" fontWeight="bold">AI Projection</text>
                  <text x="290" y="55" textAnchor="middle" fill="#6B7280" fontSize="8">Baseline</text>
                </svg>
              </div>
            </div>

            {/* Smart Action Alert */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3 mt-4">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 block text-xs">AI Recommendation Actioned</span>
                <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                  Auto-drafted renewal offers with +$95/mo lease rate adjustment sent to 12 residents with high renewal probability.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-neutral-dark">Automated Maintenance Triage & Dispatch</h4>
                <p className="text-brand-neutral-muted text-[11px]">Photo classification & emergency priority analysis</p>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                Auto Triage Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-600" /> Preventative HVAC Alert</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-mono">Priority: Medium</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  Unit 404 reported compressor vibration. AI classified as preventative filter/compressor check before summer heat wave.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-brand-neutral-dark">Financial Anomaly & Duplicate Detection</h4>
                <p className="text-brand-neutral-muted text-[11px]">Vendor invoice scanning & audit verification</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                100% Audited
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-brand-neutral-border space-y-2 shadow-xs">
              <div className="flex items-center justify-between font-bold text-brand-neutral-dark">
                <span className="flex items-center gap-1.5 text-emerald-700"><CheckCircle2 className="w-4 h-4" /> 142 Invoices Scanned</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">0 Duplicate Payments</span>
              </div>
              <p className="text-brand-neutral-muted text-[11px]">
                Vendor ledger audit completed. 100% of vendor bills matched against work order PO numbers and general ledger accounts.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
