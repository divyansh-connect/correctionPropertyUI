import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { BillingCard } from '../components/BillingCard';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Check, Sparkles } from 'lucide-react';

const PLANS_MATRIX = [
  { name: 'Starter', price: 99, features: ['Up to 50 properties', 'Basic tenant screening', 'Standard ledger billing'] },
  { name: 'Professional', price: 199, features: ['Up to 200 properties', 'Premium screening', 'Automated Late Fee scripts'] },
  { name: 'Enterprise SaaS Tier', price: 499, features: ['Unlimited properties', 'Custom roles & RBAC matrix', 'Vector Knowledge base', 'API Keys & Webhook endpoints'] },
];

export const BillingPage: React.FC = () => {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['admin-billing-sub'],
    queryFn: () => api.billing.getSubscription(),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Billing"
        description="Verify invoicing transaction histories, upgrade operational tier limits, or replace active credit cards."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Billing' }]}
      />

      {isLoading ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">Mapping billing details...</div>
      ) : subscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current plan detail */}
          <div className="lg:col-span-2">
            <BillingCard subscription={subscription} />
          </div>

          {/* Pricing tiers comparison */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5 border-b border-border pb-2">
              <Sparkles className="w-4 h-4 text-primary" /> Subscription Tiers Comparison
            </h3>
            {PLANS_MATRIX.map((p) => {
              const isActive = subscription.planName === p.name;
              return (
                <Card key={p.name} className={`p-4 border bg-card flex flex-col justify-between space-y-3 transition ${
                  isActive ? 'border-primary shadow-sm bg-primary/5' : 'border-border'
                }`}>
                  <div className="flex justify-between items-start text-xs font-bold">
                    <div>
                      <span className="text-foreground">{p.name}</span>
                      {isActive && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded ml-2 uppercase">Current</span>}
                    </div>
                    <span className="text-foreground">${p.price}/mo</span>
                  </div>
                  <ul className="text-[11px] text-muted-foreground font-semibold list-none space-y-1.5">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default BillingPage;
