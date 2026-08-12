import React, { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Property Assistant. How can I help optimize your portfolio today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const samplePrompts = [
    'Analyze Q3 lease renewal forecast',
    'Show today’s ACH rent reconciliation',
    'Identify preventative maintenance risks'
  ];

  const handleSendPrompt = (promptText) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text: textToSend, time: 'Just now' };
    
    // Simulated AI Response
    let aiResponseText = 'AI Model calculated: Portfolio occupancy forecast is 98.8% for Q3. 14 leases scheduled for automated renewal offers with +4.8% rate adjustment target.';
    if (textToSend.toLowerCase().includes('ach') || textToSend.toLowerCase().includes('rent')) {
      aiResponseText = 'ACH Rent Collection Update: $48,250.00 reconciled today across 142 units with 99.2% on-time payment rate.';
    } else if (textToSend.toLowerCase().includes('maintenance')) {
      aiResponseText = 'Maintenance Intelligence: Unit #404 compressor alert classified as preventative HVAC service. Assigned to Apex Plumbing.';
    }

    const aiMsg = { sender: 'ai', text: aiResponseText, time: 'Just now' };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-brand-blue text-white shadow-hero-card hover:bg-brand-blue-dark hover:scale-105 transition-all duration-300 cursor-pointer border border-brand-indigo/40 group"
          aria-label="Open AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-brand-indigo-light group-hover:rotate-12 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-indigo animate-ping"></span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-extrabold tracking-tight leading-tight">AI Assistant</span>
            <span className="text-[10px] text-brand-indigo-light font-semibold">Portfolio Intelligence</span>
          </div>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl border border-brand-neutral-border shadow-hero-card overflow-hidden animate-fade-in flex flex-col h-[480px]">
          {/* Header */}
          <div className="bg-brand-neutral-dark text-white p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-blue flex items-center justify-center text-brand-indigo-light">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  AI Property Assistant
                  <Sparkles className="w-3.5 h-3.5 text-brand-indigo-light" />
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online & Listening
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 bg-brand-slate-surface overflow-y-auto space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-brand-indigo-surface border border-brand-indigo/20 text-brand-indigo-dark text-[11px] font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Ask about occupancy, rent pricing, maintenance, or revenue forecasts.</span>
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-blue text-white rounded-br-none'
                      : 'bg-white text-brand-neutral-dark border border-brand-neutral-border shadow-xs rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-brand-neutral-muted mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white border-t border-brand-slate flex items-center gap-1.5 overflow-x-auto text-[10px]">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(p)}
                className="px-2.5 py-1 rounded-full bg-brand-slate hover:bg-brand-blue-surface hover:text-brand-blue text-brand-neutral-muted font-semibold shrink-0 transition-colors cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="p-3 bg-white border-t border-brand-neutral-border flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AI property assistant..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-brand-slate text-xs text-brand-neutral-dark placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-brand-blue text-white hover:bg-brand-blue-dark transition-colors cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
