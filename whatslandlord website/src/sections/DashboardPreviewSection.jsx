import React, { useState } from 'react';
import { LayoutDashboard, BarChart3, Building2, FileText, Sparkles } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import DashboardMockupCard from '../components/ui/DashboardMockupCard';
import FinancialDashboardMockup from '../components/ui/FinancialDashboardMockup';
import PropertyPortfolioMockup from '../components/ui/PropertyPortfolioMockup';
import AIInsightsMockup from '../components/ui/AIInsightsMockup';

export default function DashboardPreviewSection() {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'AI Revenue Forecast', icon: BarChart3 },
    { id: 'properties', label: 'Predictive Portfolio', icon: Building2 },
    { id: 'reports', label: 'Smart Trust Ledgers', icon: FileText },
    { id: 'ai-insights', label: 'Copilot Insights', icon: Sparkles },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-brand-neutral-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Dashboard Showcase"
          badgeIcon={LayoutDashboard}
          title="Intuitive Interface Built for Maximum Productivity"
          subtitle="Explore distinct visual marketing previews showcasing portfolio analytics, unit management, double-entry ledgers, and AI optimizations."
        />

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'bg-brand-slate text-brand-neutral-dark hover:bg-brand-slate-accent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-indigo-light' : 'text-brand-blue'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tailored Visual Mockups for each tab */}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'analytics' && <DashboardMockupCard activeTab="analytics" />}
          {activeTab === 'properties' && <PropertyPortfolioMockup />}
          {activeTab === 'reports' && <FinancialDashboardMockup />}
          {activeTab === 'ai-insights' && <AIInsightsMockup />}
        </div>
      </div>
    </section>
  );
}
