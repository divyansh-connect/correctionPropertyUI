import React, { useState } from 'react';
import { Bot, Sparkles, Send, Mic, ArrowUpRight, TrendingUp, AlertTriangle, MessageSquare, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';

export default function AIAssistantPreviewSection() {
  const [activeTopic, setActiveTopic] = useState('Revenue Optimization');
  const [inputValue, setInputValue] = useState('');
  const [userPrompts, setUserPrompts] = useState([]);

  const handleSendPrompt = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue('');
    setUserPrompts((prev) => [
      ...prev,
      { query: text, response: `AI Copilot scanned 12 active properties: "${text}" analyzed cleanly with 99.8% confidence.` }
    ]);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-brand-neutral-border relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Enterprise Copilot"
          badgeIcon={Bot}
          title="Meet Your New AI Property Manager"
          subtitle="Interact with your entire portfolio using natural language. The AI Assistant predicts issues, drafts responses, and executes tasks automatically."
        />

        <div className="max-w-4xl mx-auto mt-12">
          {/* Main AI Assistant Panel Mockup */}
          <div className="bg-white rounded-3xl border border-brand-neutral-border shadow-hero-card overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar (Chat History / Topics) */}
            <div className="w-full md:w-1/3 bg-brand-slate-surface border-r border-brand-neutral-border p-6 hidden md:block">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-brand-blue flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-brand-neutral-dark">Copilot Chat</span>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-brand-neutral-muted uppercase tracking-wider">Suggested Topics</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => setActiveTopic('Revenue Optimization')}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer ${
                      activeTopic === 'Revenue Optimization' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-brand-slate hover:border-brand-blue/30 text-brand-neutral-dark'
                    }`}
                  >
                    <span>Revenue Optimization</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </button>
                  <button 
                    onClick={() => setActiveTopic('Maintenance Risk')}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer ${
                      activeTopic === 'Maintenance Risk' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-brand-slate hover:border-brand-blue/30 text-brand-neutral-dark'
                    }`}
                  >
                    <span>Maintenance Risk</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </button>
                  <button 
                    onClick={() => setActiveTopic('Lease Renewals')}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-between group cursor-pointer ${
                      activeTopic === 'Lease Renewals' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-brand-slate hover:border-brand-blue/30 text-brand-neutral-dark'
                    }`}
                  >
                    <span>Lease Renewals</span>
                    <ArrowUpRight className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="w-full md:w-2/3 flex flex-col bg-white">
              <div className="p-6 sm:p-8 flex-grow">
                {/* AI Greeting */}
                <div className="flex gap-4 mb-6 animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-brand-indigo-surface flex items-center justify-center shrink-0 border border-brand-indigo/30">
                    <Bot className="w-5 h-5 text-brand-indigo-dark" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-brand-neutral-dark mb-1">Good Morning, Alex</h4>
                    <p className="text-sm text-brand-neutral-muted mb-4">Daily briefing for: <span className="font-bold text-brand-blue">{activeTopic}</span></p>
                    
                    {/* Insight Cards generated by AI */}
                    <div className="space-y-3">
                      {activeTopic === 'Revenue Optimization' && (
                        <div className="p-4 rounded-2xl bg-brand-slate-surface border border-brand-slate flex gap-3 hover:bg-brand-slate transition-colors">
                          <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-emerald-800 mb-0.5">Revenue forecast increased by 6%</p>
                            <p className="text-[11px] text-brand-neutral-muted">Driven by optimized lease renewals across 3 commercial properties.</p>
                          </div>
                        </div>
                      )}

                      {activeTopic === 'Maintenance Risk' && (
                        <div className="p-4 rounded-2xl bg-brand-slate-surface border border-brand-slate flex gap-3 hover:bg-brand-slate transition-colors">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800 mb-0.5">HVAC preventative maintenance alert</p>
                            <p className="text-[11px] text-brand-neutral-muted font-normal">Compressor telemetry in Oakridge Bldg #2 detected anomalous vibration pattern.</p>
                          </div>
                        </div>
                      )}

                      {activeTopic === 'Lease Renewals' && (
                        <div className="p-4 rounded-2xl bg-brand-slate-surface border border-brand-slate flex gap-3 hover:bg-brand-slate transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-blue-800 mb-0.5">3 lease renewal notices queued</p>
                            <p className="text-[11px] text-brand-neutral-muted">AI recommended +$95/mo adjustment to match zip code market rates.</p>
                          </div>
                        </div>
                      )}

                      {userPrompts.map((item, pIdx) => (
                        <div key={pIdx} className="space-y-2 pt-2 animate-fade-in">
                          <div className="p-3 rounded-xl bg-brand-blue text-white text-xs font-bold text-right ml-8">
                            {item.query}
                          </div>
                          <div className="p-3 rounded-xl bg-brand-slate-surface border border-brand-slate text-xs text-brand-neutral-dark mr-8">
                            {item.response}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Input Box */}
              <form onSubmit={handleSendPrompt} className="p-4 sm:p-6 border-t border-brand-slate bg-white">
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-brand-neutral-muted">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask AI anything about your portfolio..." 
                    className="w-full bg-brand-slate-surface border border-brand-neutral-border rounded-full py-3.5 sm:py-4 pl-10 pr-20 sm:pl-12 sm:pr-24 text-xs sm:text-sm focus:outline-none focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/50 transition-all text-brand-neutral-dark font-medium"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button type="button" className="p-2 text-brand-neutral-muted hover:text-brand-neutral-dark transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button type="submit" className="p-2 bg-brand-blue text-white rounded-full hover:bg-brand-blue-dark transition-colors shadow-sm">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-bold text-brand-neutral-muted">
                  <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-brand-indigo" /> GPT-4 Enterprise</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> SOC 2 Secure</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
