import React, { useState } from 'react';
import { ROLE_PREVIEWS } from '../data/roleData';
import { Key, Briefcase, Crown, Home, Wrench, BarChart3, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

import SuperAdminMockup from '../components/ui/SuperAdminMockup';
import PropertyPortfolioMockup from '../components/ui/PropertyPortfolioMockup';
import OwnerOverviewMockup from '../components/ui/OwnerOverviewMockup';
import TenantPortalMockup from '../components/ui/TenantPortalMockup';
import MaintenanceCenterMockup from '../components/ui/MaintenanceCenterMockup';
import FinancialDashboardMockup from '../components/ui/FinancialDashboardMockup';

export default function RolePortalsSection() {
  const [selectedRoleId, setSelectedRoleId] = useState('super-admin');

  const roleIcons = {
    'super-admin': Key,
    'manager': Briefcase,
    'owner-portal': Crown,
    'tenant-portal': Home,
    'maintenance-staff': Wrench,
    'collection-manager': BarChart3,
  };

  const selectedRole = ROLE_PREVIEWS.find((r) => r.id === selectedRoleId) || ROLE_PREVIEWS[0];

  return (
    <section className="py-12 sm:py-16 bg-brand-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Role-Based Portals"
          badgeIcon={Users}
          title="Tailored Workspaces for Every Stakeholder"
          subtitle="Provide specialized interfaces for Super Admins, Managers, Owners, Tenants, Maintenance Staff, and Collection Managers."
        />

        {/* 6 Role Selector Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {ROLE_PREVIEWS.map((role) => {
            const Icon = roleIcons[role.id] || Briefcase;
            const isSelected = selectedRoleId === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-brand-blue text-white border-brand-blue shadow-md translate-y-[-2px]'
                    : 'bg-white text-brand-neutral-dark border-brand-neutral-border hover:border-brand-blue/40 hover:bg-brand-slate-surface'
                }`}
              >
                <div className={`p-2 rounded-xl inline-block mb-2 ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-blue-surface text-brand-blue'}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm mb-1 break-words">{role.roleName}</h4>
                <p className={`text-[10px] sm:text-[11px] ${isSelected ? 'text-gray-200' : 'text-brand-neutral-muted'}`}>
                  {role.badge}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Role Showcase Card with Visual Dashboard */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="green">{selectedRole.badge}</Badge>
              <span className="text-xs text-brand-neutral-muted font-mono uppercase tracking-wider">Role Preview</span>
            </div>

            <h3 className="text-3xl font-extrabold text-brand-neutral-dark">
              {selectedRole.roleName}
            </h3>

            <p className="text-lg font-semibold text-brand-blue">
              {selectedRole.tagline}
            </p>

            <p className="text-base text-brand-neutral-muted leading-relaxed">
              {selectedRole.description}
            </p>

            <div className="space-y-3 pt-2">
              {selectedRole.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0" />
                  <span className="text-sm font-bold text-brand-neutral-dark">{feature}</span>
                </div>
              ))}
            </div>

            {/* AI Smart Timeline Flow */}
            <div className="mt-6 pt-6 border-t border-brand-neutral-border/60">
              <span className="text-[10px] font-extrabold text-brand-indigo-dark bg-brand-indigo-surface px-2 py-0.5 rounded uppercase tracking-widest mb-3 inline-block">
                AI Timeline Automation
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-brand-neutral-dark flex-wrap">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-brand-neutral-muted">Yesterday</span>
                  <div className="w-2 h-2 rounded-full bg-brand-blue mt-1"></div>
                </div>
                <div className="h-0.5 w-6 sm:w-8 bg-brand-blue/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-brand-neutral-muted">Today</span>
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-indigo ring-2 ring-brand-indigo/30 mt-1"></div>
                </div>
                <div className="h-0.5 w-6 sm:w-8 bg-brand-neutral-border"></div>
                <div className="flex flex-col items-center opacity-50">
                  <span className="text-[10px] text-brand-neutral-muted">Tomorrow</span>
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-1"></div>
                </div>
              </div>
              <p className="text-xs text-brand-neutral-muted mt-3">
                <span className="font-bold text-brand-neutral-dark">Pattern Detected:</span> Role workflow optimized. <br/>
                <span className="font-bold text-brand-indigo-dark">Action:</span> Live dashboard synchronized for {selectedRole.roleName}.
              </p>
            </div>

            <div className="pt-4">
              <Button to="/solutions" variant="primary" size="md" icon={ArrowRight}>
                See All Solution Workflows
              </Button>
            </div>
          </div>

          {/* Right Visual Dashboard Mockup preview tailored to each role */}
          <div className="mt-8 lg:mt-0 relative z-10">
            {selectedRoleId === 'super-admin' && <SuperAdminMockup />}
            {selectedRoleId === 'manager' && <PropertyPortfolioMockup />}
            {selectedRoleId === 'owner-portal' && <OwnerOverviewMockup />}
            {selectedRoleId === 'tenant-portal' && <TenantPortalMockup />}
            {selectedRoleId === 'maintenance-staff' && <MaintenanceCenterMockup />}
            {selectedRoleId === 'collection-manager' && <FinancialDashboardMockup />}
          </div>
        </div>
      </div>
    </section>
  );
}
