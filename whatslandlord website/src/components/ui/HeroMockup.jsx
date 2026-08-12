import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Wrench, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Search,
  Bell,
  Zap,
  Bot
} from 'lucide-react';

export default function HeroMockup() {
  return (
    <div className="w-full relative">
      {/* Floating AI Widget 1 - Top Left */}
      <div className="hidden lg:flex absolute -left-8 top-16 z-20 bg-white/90 backdrop-blur-md border border-brand-blue/30 shadow-xl p-3 rounded-xl items-center gap-3 animate-float-slow">
        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center shadow-[0_0_15px_rgba(47,79,58,0.4)]">
          <Sparkles className="w-4 h-4 text-brand-indigo-light" />
        </div>
        <div>
          <p className="text-[10px] text-brand-neutral-muted font-bold uppercase tracking-wider">AI Insight</p>
          <p className="text-xs font-extrabold text-brand-neutral-dark">Predicted 12 lease renewals</p>
        </div>
      </div>

      {/* Floating AI Widget 2 - Bottom Right */}
      <div className="hidden lg:flex absolute -right-6 bottom-32 z-20 bg-white/90 backdrop-blur-md border border-emerald-500/30 shadow-xl p-3 rounded-xl items-center gap-3 animate-float-delayed">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <DollarSign className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] text-brand-neutral-muted font-bold uppercase tracking-wider">Forecast</p>
          <p className="text-xs font-extrabold text-emerald-700">Rent collection +8.4%</p>
        </div>
      </div>

      {/* Floating AI Widget 3 - Bottom Left */}
      <div className="hidden md:flex absolute -left-4 bottom-12 z-20 bg-white/90 backdrop-blur-md border border-amber-500/30 shadow-xl p-3 rounded-xl items-center gap-3 animate-float-slow">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
          <Wrench className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-[10px] text-brand-neutral-muted font-bold uppercase tracking-wider">Risk Detected</p>
          <p className="text-xs font-extrabold text-brand-neutral-dark">HVAC maintenance predicted</p>
        </div>
      </div>

      {/* Main Central Dashboard Canvas - Clean & Spacious */}
      <div className="w-full bg-white rounded-3xl border border-brand-neutral-border shadow-hero-card overflow-hidden">
        {/* Top App Control Bar */}
        <div className="bg-brand-neutral-dark text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <div className="flex gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80 inline-block"></span>
            </div>
            <span className="text-[11px] sm:text-xs text-gray-300 font-mono pl-2 sm:pl-3 border-l border-gray-700 truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
              app.propertysaas.com/ai-copilot/overview
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-300 shrink-0">
            <div className="hidden sm:flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span>Ask AI Copilot...</span>
            </div>
            <div className="relative">
              <Bell className="w-4 h-4 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-indigo animate-pulse"></span>
            </div>
            <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center font-bold text-xs text-brand-indigo-light relative">
              AI
              <span className="absolute inset-0 rounded-full bg-brand-blue animate-ping opacity-75"></span>
            </div>
          </div>
        </div>

        {/* Dashboard Canvas Content */}
        <div className="bg-brand-slate-surface p-4 sm:p-8 space-y-6">
          {/* Top Key Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-neutral-muted">Portfolio Score</span>
                <div className="p-1.5 rounded-lg bg-brand-blue-surface text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
                <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">98.4</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Top 1% Health</span>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-neutral-muted">Revenue Forecast</span>
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
                <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">+14.2%</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">YTD Trend</span>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-blue/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-neutral-muted">Occupancy Forecast</span>
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
                <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">99.2%</span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">+2% Predicted</span>
              </div>
            </div>

            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-brand-neutral-border shadow-xs hover:border-brand-indigo/30 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-neutral-muted">AI Triage Speed</span>
                <div className="p-1.5 rounded-lg bg-brand-indigo-surface text-brand-indigo-dark group-hover:bg-brand-indigo group-hover:text-white transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline justify-between flex-wrap gap-1">
                <span className="text-xl sm:text-2xl font-extrabold text-brand-neutral-dark">1.2 Hrs</span>
                <span className="text-[11px] font-bold text-brand-indigo-dark bg-brand-indigo-surface px-1.5 py-0.5 rounded">Instant Dispatch</span>
              </div>
            </div>
          </div>

          {/* Main Visual Area Curve Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-brand-neutral-border shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl"></div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 relative z-10">
                <div>
                  <h3 className="text-base font-bold text-brand-neutral-dark flex items-center gap-2">
                    Predictive Revenue Forecast
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </h3>
                  <p className="text-xs text-brand-neutral-muted font-mono mt-0.5">Machine Learning model curve forecasting revenue vs baseline</p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-brand-blue text-white flex items-center gap-1 shadow-sm shrink-0">
                  <Sparkles className="w-3 h-3 text-brand-indigo-light" /> AI Model 2.0
                </span>
              </div>

              {/* Distinct Area Curve SVG Chart with Gradient Fill */}
              <div className="h-44 sm:h-52 w-full pt-2 pb-2 relative z-10">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 130" fill="none">
                  <defs>
                    <linearGradient id="heroGradientClean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#F1F5F9" strokeDasharray="3 3" />

                  {/* Shaded Area 1 (Actual Revenue Curve) */}
                  <path
                    d="M 10,95 C 70,80 130,55 190,45 C 250,35 310,25 390,15 L 390,115 L 10,115 Z"
                    fill="url(#heroGradientClean)"
                  />

                  {/* Main Line 1 (Forest Green Solid Curve) */}
                  <path
                    d="M 10,95 C 70,80 130,55 190,45 C 250,35 310,25 390,15"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-dash"
                  />

                  {/* Line 2 (AI Gold Prediction Curve) */}
                  <path
                    d="M 10,105 C 70,92 130,70 190,58 C 250,42 310,30 390,22"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />

                  {/* Data Point Circles */}
                  <circle cx="10" cy="95" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="70" cy="80" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="130" cy="55" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="190" cy="45" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="250" cy="35" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="310" cy="25" r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="390" cy="15" r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" className="animate-pulse" />

                  {/* Month X-Axis Labels */}
                  <text x="10" y="125" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Jan</text>
                  <text x="70" y="125" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Feb</text>
                  <text x="130" y="125" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Mar</text>
                  <text x="190" y="125" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Apr</text>
                  <text x="250" y="125" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="bold">May</text>
                  <text x="310" y="125" textAnchor="middle" fill="#6B7280" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Jun</text>
                  <text x="390" y="125" textAnchor="middle" fill="#2563EB" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Jul (AI)</text>
                </svg>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-brand-neutral-muted border-t border-brand-slate/80 pt-3 relative z-10">
                <div className="flex items-center gap-4 font-semibold flex-wrap">
                  <span className="flex items-center gap-1.5 text-brand-neutral-dark">
                    <span className="w-3 h-3 rounded-full bg-brand-blue inline-block"></span> Actual Net Revenue
                  </span>
                  <span className="flex items-center gap-1.5 text-brand-neutral-dark">
                    <span className="w-3 h-3 rounded-full bg-brand-indigo inline-block"></span> AI Forecast
                  </span>
                </div>
                <span className="font-extrabold text-brand-blue">Real-Time Forecast</span>
              </div>
            </div>

            {/* Smart AI Actions Sidebar */}
            <div className="bg-white p-6 rounded-2xl border border-brand-neutral-border shadow-xs flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-indigo/10 rounded-full blur-xl group-hover:bg-brand-indigo/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 font-bold text-brand-neutral-dark">
                    <Bot className="w-4 h-4 text-brand-blue" />
                    <span>AI Copilot Digest</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-indigo-surface text-brand-indigo-dark">
                    3 Insights
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-brand-blue-surface border border-brand-blue/20 hover:border-brand-blue/40 transition-colors cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer"></div>
                    <span className="font-bold text-brand-blue block mb-0.5">Lease Renewal Target</span>
                    <p className="text-brand-neutral-dark text-[11px] leading-relaxed">
                      14 leases expiring in August. AI recommends +$95/mo adjustment to match zip code comps.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer">
                    <span className="font-bold text-emerald-900 block mb-0.5">Maintenance Risk</span>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      HVAC unit at 104 Willow St showing signs of potential failure based on repair history.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-brand-slate mt-4 text-xs font-extrabold text-brand-blue flex items-center justify-between cursor-pointer group-hover:text-brand-blue-dark relative z-10">
                <span>View AI Command Center</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
