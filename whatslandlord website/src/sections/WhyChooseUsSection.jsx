import React from 'react';
import { ShieldCheck, Zap, Server, Lock, Layers, RefreshCw } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

export default function WhyChooseUsSection() {
  const reasons = [
    {
      title: 'Lightning-Fast AI Engine',
      desc: 'Optimized cloud engine processes complex predictive models and 5,000+ unit ledgers in under 200 milliseconds.',
      icon: Zap
    },
    {
      title: 'Bank-Grade Security',
      desc: 'SOC 2 Type II certified infrastructure with AES-256 data encryption and complete multi-factor authentication.',
      icon: Lock
    },
    {
      title: 'High Uptime SLA',
      desc: 'Guaranteed 99.99% operational availability with continuous multi-region backups and disaster recovery.',
      icon: Server
    },
    {
      title: 'Enterprise Ready',
      desc: 'Granular role-based access controls, multi-entity chart of accounts, and custom user permissions.',
      icon: ShieldCheck
    },
    {
      title: 'Infinite Scalability',
      desc: 'Engineered to handle growth seamlessly from 20 units to 50,000+ units across multiple asset classes.',
      icon: Layers
    },
    {
      title: 'Continuous AI Learning',
      desc: 'Our predictive models get smarter over time, automatically adapting to your portfolio\'s specific seasonal trends and anomalies.',
      icon: RefreshCw
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-brand-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Why Choose Us"
          badgeIcon={ShieldCheck}
          title="Built for High-Performing Property Teams"
          subtitle="Why leading real estate operators trust our platform to run their business-critical operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} variant="white" className="p-7">
                <div className="w-12 h-12 rounded-xl bg-brand-blue-surface text-brand-blue flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-brand-neutral-dark mb-3">{item.title}</h3>
                <p className="text-sm text-brand-neutral-muted leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
