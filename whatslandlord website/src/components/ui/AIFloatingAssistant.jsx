import React, { useState } from 'react';
import { Sparkles, X, ChevronUp, Activity, DollarSign, Wrench, Search } from 'lucide-react';

export default function AIFloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSelectPrompt = (title, response) => {
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: title },
      { type: 'ai', text: response }
    ]);
  };

  const handleSendCustomPrompt = (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    const userQuery = promptText;
    setPromptText('');
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: userQuery },
      { type: 'ai', text: `AI Insights generated for "${userQuery}": All 12 portfolio ledgers scanned cleanly. No risk detected.` }
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[40] flex flex-col items-end pointer-events-none">
      {/* AI Assistant Panel */}
      <div 
        className={`mb-3 w-[calc(100vw-2rem)] xs:w-80 max-w-sm bg-white rounded-2xl border border-brand-indigo/30 shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-brand-neutral-dark text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-indigo-surface flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-brand-indigo-dark" />
            </div>
            <div>
              <h4 className="text-sm font-bold">AI Property Assistant</h4>
              <p className="text-[10px] text-brand-indigo-light">Copilot Intelligence</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 space-y-3 bg-brand-slate-surface h-64 overflow-y-auto">
          <div className="text-xs text-brand-neutral-muted mb-2 font-medium">How can AI assist you today?</div>
          
          <button 
            onClick={() => handleSelectPrompt('Predict Vacancies', 'AI Analysis: 4 leases expiring in Q3. Automated renewal notices generated with +5.2% rent adjustment.')}
            className="w-full text-left bg-white p-3 rounded-xl border border-brand-neutral-border hover:border-brand-indigo hover:shadow-xs transition-all group flex items-start gap-3 cursor-pointer"
          >
            <Activity className="w-4 h-4 text-brand-blue mt-0.5 group-hover:text-brand-indigo transition-colors shrink-0" />
            <div>
              <span className="text-xs font-bold text-brand-neutral-dark block">Predict Vacancies</span>
              <span className="text-[10px] text-brand-neutral-muted">Analyze lease expirations & market trends</span>
            </div>
          </button>

          <button 
            onClick={() => handleSelectPrompt('Analyze Revenue', 'Revenue Audit: Net rental yield projected +8.4% YoY. Discrepancies reconciled in 0.2ms.')}
            className="w-full text-left bg-white p-3 rounded-xl border border-brand-neutral-border hover:border-brand-indigo hover:shadow-xs transition-all group flex items-start gap-3 cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-brand-blue mt-0.5 group-hover:text-brand-indigo transition-colors shrink-0" />
            <div>
              <span className="text-xs font-bold text-brand-neutral-dark block">Analyze Revenue</span>
              <span className="text-[10px] text-brand-neutral-muted">Find optimal rent increase targets</span>
            </div>
          </button>

          <button 
            onClick={() => handleSelectPrompt('Maintenance Insights', 'Predictive Alert: Unit #304 HVAC system shows 84% failure probability based on sensor telemetry.')}
            className="w-full text-left bg-white p-3 rounded-xl border border-brand-neutral-border hover:border-brand-indigo hover:shadow-xs transition-all group flex items-start gap-3 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-brand-blue mt-0.5 group-hover:text-brand-indigo transition-colors shrink-0" />
            <div>
              <span className="text-xs font-bold text-brand-neutral-dark block">Maintenance Insights</span>
              <span className="text-[10px] text-brand-neutral-muted">Preventative HVAC & plumbing alerts</span>
            </div>
          </button>

          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-xl text-xs animate-fade-in ${
                m.type === 'user' 
                  ? 'bg-brand-blue text-white ml-6 font-semibold text-right' 
                  : 'bg-brand-blue-surface text-brand-neutral-dark border border-brand-blue/20 mr-4 font-normal'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendCustomPrompt} className="p-3 bg-white border-t border-brand-neutral-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ask AI anything..." 
              className="w-full bg-brand-slate-surface border border-brand-neutral-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all"
            />
          </div>
        </form>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-brand-neutral-dark rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border border-brand-neutral-dark hover:border-brand-indigo pointer-events-auto"
      >
        {/* Subtle background pulse effect */}
        <div className="absolute inset-0 rounded-full bg-brand-indigo opacity-0 group-hover:opacity-20 transition-opacity duration-500 animate-pulse-slow"></div>
        
        {isOpen ? (
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand-indigo-light" />
        ) : (
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-indigo-light" />
        )}
      </button>
    </div>
  );
}
