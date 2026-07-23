import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { 
  Sparkles, Building2, ShieldAlert, Cpu, Check, Users, ArrowRight, 
  MessageSquare, DollarSign, Database, Zap, ArrowUpRight, BarChart3, Shield,
  Sun, Moon, Loader2
} from 'lucide-react';
import { useThemeStore } from '../../store/useStore';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const [rentVolume, setRentVolume] = useState(15000);
  const [activeTab, setActiveTab] = useState<'portals' | 'ai' | 'developers'>('portals');
  const { theme, toggleTheme } = useThemeStore();

  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<{name: string, price: number} | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'loading' | 'success'>('form');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('loading');
    setTimeout(() => {
      setCheckoutStep('success');
      setTimeout(() => {
        setSelectedCheckoutPlan(null);
        setCheckoutStep('form');
        setCardName('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        navigate('/login');
      }, 2000);
    }, 2000);
  };

  // Estimate SaaS savings
  const estimatedSavings = Math.round(rentVolume * 0.045);

  return (
    <div className="relative w-full min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans overflow-x-hidden selection:bg-primary selection:text-white transition-colors duration-300">
      {/* Custom Keyframes for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(12px) rotate(-1.5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        .animate-float-card {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-card-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .dark .glass-panel {
          background: rgba(15, 23, 42, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
      `}</style>

      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[400px] right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[1200px] left-1/3 w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-slate-950/70 h-16 flex items-center justify-between px-6 lg:px-12 transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-white font-black text-base">D</span>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            DoorLoop <span className="text-primary text-xs font-semibold px-1 py-0.5 rounded bg-primary/15 ml-1">APEX</span>
          </span>
        </div>
        <nav className="hidden md:flex space-x-8 text-xs font-extrabold text-slate-505 dark:text-slate-400">
          <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition">Features</a>
          <a href="#calculator" className="hover:text-slate-900 dark:hover:text-white transition">ROI Calculator</a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition">Pricing Matrix</a>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </Button>

          <button onClick={() => navigate('/login')} className="text-xs font-extrabold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            Sign In
          </button>
          <Button onClick={() => navigate('/login')} size="sm" className="bg-primary hover:bg-primary/90 text-white font-extrabold text-xs h-8 px-4 rounded-lg shadow-lg shadow-primary/20">
            Access Portals
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Hero Details */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tenant PropTech Engine</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none text-slate-900 dark:text-white">
            Unified Cloud for{' '}
            <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Property Portals
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-semibold max-w-xl">
            Scale rent reconciliations, deploy live developer webhook dispatches, trigger AI-driven work orders, and provision tenant portals from a single corporate console.
          </p>

          <div className="flex gap-4 pt-2">
            <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/95 text-white font-bold h-12 px-6 rounded-xl flex items-center justify-center gap-2 group shadow-xl shadow-primary/15">
              Launch Sandbox Portals
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" className="border-slate-300 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/5 text-slate-700 dark:text-white font-bold h-12 px-6 rounded-xl bg-transparent">
              Developer Docs
            </Button>
          </div>
        </div>

        {/* Right Hero Interactive Cards Layout */}
        <div className="lg:col-span-5 relative w-full max-w-full h-[380px] flex justify-center items-center scale-90 sm:scale-100 transition-transform origin-center overflow-hidden">
          {/* Floating Card 1: AI Ticket */}
          <div className="absolute top-4 left-4 sm:left-6 w-[240px] sm:w-64 glass-panel p-4 rounded-2xl shadow-2xl animate-float-card text-xs font-semibold">
            <div className="flex justify-between items-center mb-3">
              <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded text-[9px] font-bold">AI Workflow</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Just Now</span>
            </div>
            <p className="text-slate-900 dark:text-white font-bold mb-2">"AC Not Cooling in Unit 301"</p>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Auto-dispatched Vendor: AC Solutions Ltd</span>
            </div>
          </div>

          {/* Floating Card 2: Financial Stats */}
          <div className="absolute bottom-6 right-4 sm:right-6 w-[230px] sm:w-60 glass-panel p-5 rounded-2xl shadow-2xl animate-float-card-delayed text-xs font-semibold">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><DollarSign className="w-4 h-4" /></span>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-[10px]">Rent Collected</p>
                <p className="text-slate-900 dark:text-white text-lg font-black">$48,250</p>
              </div>
            </div>
            <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden">
              <div className="w-3/4 h-full bg-primary" />
            </div>
            <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-2">75% of target met</p>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200/80 dark:border-white/5 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">All-in-One PropTech Feature Matrix</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
            Everything you need to manage, scale, and automate your entire real estate portfolio.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-start md:justify-center space-x-2 border-b border-slate-200/80 dark:border-white/5 pb-2 overflow-x-auto scrollbar-none whitespace-nowrap md:mx-0 md:px-0">
          {[
            { key: 'portals', label: 'Multi-Tenant Portals', icon: <Users className="w-4 h-4" /> },
            { key: 'ai', label: 'AI Dispatches', icon: <Sparkles className="w-4 h-4" /> },
            { key: 'developers', label: 'Developers & RBAC', icon: <Database className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition border-b-2 -mb-2 shrink-0 ${
                activeTab === tab.key 
                  ? 'border-primary text-primary dark:text-white bg-primary/5' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Detail panel */}
        <div className="glass-panel p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {activeTab === 'portals' && (
            <>
              <div className="space-y-4 text-left">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Segmented User Environments</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                  Provision fully brand-customized portals for property managers, tenants, and owners. Each user logs into an isolated portal mapped to their specific workflow needs.
                </p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-bold list-none">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Manager Dashboards & CRM</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Owner Statements & Cash Distributions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Tenant rent payments & lease updates</li>
                </ul>
              </div>
              <div className="p-6 bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 rounded-2xl space-y-3">
                <p className="text-xs font-extrabold uppercase text-primary tracking-wider">Interface Mapping</p>
                <div className="p-3 bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 rounded-xl flex justify-between items-center text-xs">
                  <span>Manager Portal</span>
                  <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded uppercase font-bold">Default</span>
                </div>
                <div className="p-3 bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 rounded-xl flex justify-between items-center text-xs">
                  <span>Owner Dashboard</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded uppercase font-bold">/owner</span>
                </div>
                <div className="p-3 bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 rounded-xl flex justify-between items-center text-xs">
                  <span>Tenant portal</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">/tenant</span>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai' && (
            <>
              <div className="space-y-4 text-left">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">AI Automation Dispatcher</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                  Leverage natural language AI agents to parse leases, automate dispatcher requests, draft responses, and explain complex accounting tables.
                </p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-bold list-none">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Vector Knowledge Base Libraries</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dynamic automation recipes builder</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Accounting AI explanation engines</li>
                </ul>
              </div>
              <div className="p-6 bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 rounded-2xl text-xs space-y-2 font-semibold">
                <p className="text-[10px] uppercase text-indigo-600 dark:text-indigo-400 font-extrabold">Trigger simulation</p>
                <p className="text-slate-900 dark:text-white font-bold">"Read tenant ledger and explain late fee exception."</p>
                <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl leading-relaxed text-[11px]">
                  "Exception found: Rent was paid on the 6th, which is outside the 5-day grace period ending on the 5th."
                </div>
              </div>
            </>
          )}

          {activeTab === 'developers' && (
            <>
              <div className="space-y-4 text-left">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Enterprise Settings & API Management</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs font-semibold leading-relaxed">
                  Provide developers with robust API keys management, customized webhook notification triggers, security whitelists, and live system audits.
                </p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-bold list-none">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Outbound Webhook Subscriptions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Key Rotation & developer tokens</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> IP restrictions & MFA Whitelisting</li>
                </ul>
              </div>
              <div className="p-6 bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5 rounded-2xl text-left space-y-3">
                <p className="text-[10px] font-extrabold uppercase text-sky-600 dark:text-sky-400 tracking-wider">Outbound Webhook Callback</p>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg font-mono text-[10px] text-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-white/5">
                  POST https://api.client.com/webhook<br/>
                  Body: {"{ event: 'payment.received' }"}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 18 Features Grid */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
          {[
            { title: "1. Executive Dashboard", desc: "Detailed portfolio performance charts, vacancy rates, and real-time financial tracking metrics." },
            { title: "2. Property Profiles", desc: "Support for apartments, commercial units, HOA, single & multi-family properties." },
            { title: "3. Unit Inventory", desc: "Detailed bed/bath square footage logs, availability status trackers, and rental settings." },
            { title: "4. Tenant Profiles", desc: "Centralized lease history, payment ledgers, messaging logs, and compliance records." },
            { title: "5. Online Applications", desc: "Track leads, collect dynamic applications, and handle background check integrations." },
            { title: "6. Rent Collection", desc: "Automate payments, ACH/Credit Card processing, late fee rules, and receipt generation." },
            { title: "7. Accounting Suite", desc: "Profit & Loss sheets, trust accounting rules, chart of accounts, and bank reconciliation." },
            { title: "8. Maintenance Flow", desc: "From tenant submission to manager approval, vendor dispatching, and payments." },
            { title: "9. Vendor Directory", desc: "Database of certified contractors, service agreements, billing history, and dispatch records." },
            { title: "10. Owner Portal", desc: "Self-service dashboard for performance logs, automated reports, and direct payouts." },
            { title: "11. Lead CRM Pipeline", desc: "Nurture leasing prospects from showing appointments up to lease signatures." },
            { title: "12. Communications Hub", desc: "Unified inbox for SMS alerts, recurring email notifications, and system announcements." },
            { title: "13. Document Hub", desc: "Securely store templates, lease agreements, check-out forms, and e-signatures." },
            { title: "14. Inspection Manager", desc: "Checklists, condition photo attachments, and move-in/move-out reports." },
            { title: "15. Custom Reports", desc: "Pre-built financial templates, delinquency reports, and scheduled exports." },
            { title: "16. Mobile Portals", desc: "Fully responsive layouts for property managers, tenants, and owners on the go." },
            { title: "17. AI Assistant Suite", desc: "AI-driven maintenance agent, accounting interpreter, and ROI analyst." },
            { title: "18. System Settings", desc: "Flexible user roles, RBAC configurations, API endpoints, webhooks, and audit logs." }
          ].map((f, i) => (
            <div key={i} className="p-5 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl space-y-2 hover:border-primary/30 transition duration-300">
              <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {f.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Savings Calculator */}
      <section id="calculator" className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-200/80 dark:border-white/5 text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Estimate Your SaaS ROI</h2>
          <p className="text-xs text-slate-505 dark:text-slate-400 font-bold">Calculate potential savings by automating lease reconciliations</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl max-w-2xl mx-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <span>Monthly Rent Collections Volume</span>
              <span className="text-primary">${rentVolume.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="5000" 
              max="200000" 
              step="5000"
              value={rentVolume} 
              onChange={(e) => setRentVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="pt-6 border-t border-slate-200/80 dark:border-white/5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-505 dark:text-slate-400 font-bold uppercase tracking-wider">Estimated Savings / year</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${(estimatedSavings * 12).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-505 dark:text-slate-400 font-bold uppercase tracking-wider">Efficiency Gained</p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">45%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-200/80 dark:border-white/5 space-y-12 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Harmonious Enterprise Pricing</h2>
          <p className="text-xs text-slate-505 dark:text-slate-400 font-bold">Choose a package metered to your portfolio volume</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { 
              name: 'Starter', 
              price: 99, 
              desc: 'Ideal for independent landlords scaling their initial residential units.',
              features: ['Up to 50 properties', 'Basic screening logs', 'Standard ledger billing'] 
            },
            { 
              name: 'Professional', 
              price: 199, 
              desc: 'For growing property agencies needing advanced rules automation.',
              features: ['Up to 200 properties', 'Late Fee rules builder', 'AI tenant conversation logs'] 
            },
            { 
              name: 'Enterprise', 
              price: 499, 
              desc: 'Designed for enterprise corporations requiring robust security controls.',
              features: ['Unlimited properties', 'Developer webhook callbacks', 'API keys rotation', 'Dedicated vector library'] 
            },
          ].map((tier, idx) => (
            <div key={idx} className="bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/40 hover:bg-slate-100 dark:hover:bg-white/[0.03] transition-all duration-300 shadow-sm">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-wider font-extrabold text-primary">{tier.name}</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white">${tier.price}<span className="text-xs text-slate-505 dark:text-slate-400 font-medium">/mo</span></p>
                <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed font-semibold">{tier.desc}</p>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 font-bold pt-4 border-t border-slate-200 dark:border-white/5 list-none">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={() => setSelectedCheckoutPlan({ name: tier.name, price: tier.price })} className="w-full mt-8 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-800 dark:text-white font-bold h-10 text-xs rounded-xl transition">
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Live Client Testimonials */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-200/80 dark:border-white/5 space-y-8 text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Trusted by Leading Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
              "Transitioning our 1,500 units to DoorLoop Apex solved our communication latency. The Tenant portal interface has made rent collection completely friction-free."
            </p>
            <div className="text-xs font-bold">
              <p className="text-slate-900 dark:text-white">Marcus Vance</p>
              <p className="text-slate-505 dark:text-slate-400 text-[10px]">Operations VP, Vance Realty</p>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed">
              "We love the AI Workflows. Late fee exception handling that used to take our accounting team hours is now audited automatically in minutes."
            </p>
            <div className="text-xs font-bold">
              <p className="text-slate-900 dark:text-white">Sophia Reynolds</p>
              <p className="text-slate-505 dark:text-slate-400 text-[10px]">CTO, Premier Housing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-950 py-16 px-6 lg:px-12 text-slate-505 dark:text-slate-400 text-xs font-semibold transition-colors duration-300">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 border-b border-slate-200 dark:border-white/5 pb-12">
          {/* Logo and Tagline */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-base">D</span>
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">DoorLoop</span>
            </div>
            <p className="text-slate-505 dark:text-slate-400 leading-relaxed font-semibold max-w-sm text-[11px]">
              DoorLoop Apex simplifies multi-tenant real estate management, providing high-fidelity portal UI modules and enterprise developer integration matrices.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <p className="text-slate-900 dark:text-white font-bold text-[11px] uppercase tracking-wider">Product</p>
            <ul className="space-y-2 text-slate-505 dark:text-slate-400 font-semibold list-none">
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Manager Console</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Owner Portal</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Tenant Portal</button></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <p className="text-slate-900 dark:text-white font-bold text-[11px] uppercase tracking-wider">Developers</p>
            <ul className="space-y-2 text-slate-505 dark:text-slate-400 font-semibold list-none">
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">API Reference</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Webhook Events</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Security Console</button></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-3">
            <p className="text-slate-900 dark:text-white font-bold text-[11px] uppercase tracking-wider">Enterprise</p>
            <ul className="space-y-2 text-slate-505 dark:text-slate-400 font-semibold list-none">
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Multi-Company</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Pricing Plans</button></li>
              <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 dark:hover:text-white transition">Help Desk</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-505 text-[10px]">
          <span>© {new Date().getFullYear()} DoorLoop Apex SaaS Systems. All rights reserved.</span>
          <div className="flex space-x-6">
            <button className="hover:text-slate-400 dark:hover:text-slate-300">Privacy Policy</button>
            <button className="hover:text-slate-400 dark:hover:text-slate-300">Terms of Service</button>
          </div>
        </div>
      </footer>
      {selectedCheckoutPlan && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left text-xs font-semibold text-slate-800 dark:text-slate-200">
            {checkoutStep === 'form' && (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">Secure Checkout</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Subscribe to DoorLoop / Zentrol Apex</p>
                  </div>
                  <button type="button" onClick={() => setSelectedCheckoutPlan(null)} className="text-slate-400 hover:text-slate-650 text-xl font-bold">&times;</button>
                </div>

                <div className="p-3.5 bg-primary/10 border border-primary/20 text-primary rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-black text-sm uppercase">{selectedCheckoutPlan.name} Plan</p>
                    <p className="text-[10px] text-slate-500">Auto-recurring billing</p>
                  </div>
                  <p className="font-black text-lg">${selectedCheckoutPlan.price}/mo</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Cardholder Name</label>
                  <input required placeholder="E.g., John Doe" value={cardName} onChange={e => setCardName(e.target.value)} className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Card Number</label>
                  <input required placeholder="4111 2222 3333 4444" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Expiry Date</label>
                    <input required placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">CVV</label>
                    <input required placeholder="123" type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value)} className="w-full text-xs font-semibold p-2.5 rounded-lg border bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-primary focus:outline-none" />
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedCheckoutPlan(null)}>Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/95 text-white font-bold h-10 px-4 rounded-xl">Pay & Subscribe</Button>
                </div>
              </form>
            )}

            {checkoutStep === 'loading' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="font-bold text-sm text-slate-900 dark:text-white">Processing Card Payment...</p>
                <p className="text-[10px] text-muted-foreground">Verifying 3D Secure credentials</p>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-500/15 text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <p className="font-black text-base text-emerald-500">Payment Successful!</p>
                <p className="text-[11px] text-muted-foreground font-semibold">Your SaaS instance is ready. Redirecting to Portals...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
