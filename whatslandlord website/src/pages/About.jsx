import React from 'react';
import { Building2, Target, Eye, ShieldCheck, HeartHandshake, Zap, Award, Users } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import FinalCTASection from '../sections/FinalCTASection';

export default function About() {
  const values = [
    {
      title: 'Customer Trust First',
      desc: 'We protect user data and financial ledgers with bank-grade security and SOC 2 Type II compliance.',
      icon: ShieldCheck
    },
    {
      title: 'Continuous Operational Excellence',
      desc: 'Every feature we build aims to reduce friction, save administrative hours, and improve clarity.',
      icon: Zap
    },
    {
      title: 'Complete Financial Transparency',
      desc: 'We empower property owners, managers, and residents with crystal-clear reporting.',
      icon: Eye
    },
    {
      title: 'Long-Term Partnership',
      desc: 'We grow alongside our clients, supporting portfolios from 20 units to 50,000+ units seamlessly.',
      icon: HeartHandshake
    }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={Building2} className="mb-4">
            About Our Company & Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Empowering Modern Real Estate Operators Worldwide
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            We build modern enterprise software designed to simplify property operations, automate accounting, and connect real estate stakeholders.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="green">Company Story</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-neutral-dark leading-tight">
                Built by Real Estate Veterans & Tech Innovators
              </h2>
              <p className="text-base text-brand-neutral-muted leading-relaxed">
                Founded with a vision to modernize property management, our platform was created to eliminate legacy software inefficiencies. Property managers spent too many hours wrestling with disconnected accounting spreadsheets, lost work orders, and manual owner statements.
              </p>
              <p className="text-base text-brand-neutral-muted leading-relaxed">
                Today, our software manages over 500,000 units across North America and Europe, processing billions in rent payments annually while delivering 99.99% system uptime.
              </p>
            </div>

            <div className="lg:col-span-6">
              <Card variant="beige" className="p-8 sm:p-10 border-brand-slate-accent relative overflow-hidden">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-brand-blue text-white">
                      <Award className="w-8 h-8 text-brand-indigo-light" />
                    </div>
                    <div>
                      <h4 className="text-xl font-extrabold text-brand-neutral-dark">Enterprise Standards</h4>
                      <p className="text-xs text-brand-neutral-muted">Recognized as Top Property SaaS Platform</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-white border border-brand-neutral-border">
                      <span className="text-2xl font-extrabold text-brand-blue block">500k+</span>
                      <span className="text-xs text-brand-neutral-muted">Units Under Management</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-brand-neutral-border">
                      <span className="text-2xl font-extrabold text-brand-neutral-dark block">$2.4B+</span>
                      <span className="text-xs text-brand-neutral-muted">Annual Rent Processed</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <Card variant="white" className="p-8 border-brand-blue/20">
              <div className="p-3 rounded-xl bg-brand-blue-surface text-brand-blue inline-block mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-brand-neutral-dark mb-3">Our Mission</h3>
              <p className="text-base text-brand-neutral-muted leading-relaxed">
                To provide real estate operators with intuitive, enterprise-grade software that automates administrative tasks, maximizes net operating income, and creates exceptional resident experiences.
              </p>
            </Card>

            <Card variant="white" className="p-8 border-brand-indigo/30">
              <div className="p-3 rounded-xl bg-brand-indigo-surface text-brand-indigo-dark inline-block mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-brand-neutral-dark mb-3">Our Vision</h3>
              <p className="text-base text-brand-neutral-muted leading-relaxed">
                To set the global standard for property technology by combining predictive AI, automated double-entry accounting, and seamless mobile access into one unified ecosystem.
              </p>
            </Card>
          </div>

          {/* Core Values */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="green">Our Philosophy</Badge>
              <h2 className="text-3xl font-extrabold text-brand-neutral-dark mt-2">Core Values That Guide Us</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <Card key={i} variant="beige" className="p-6">
                    <div className="p-3 rounded-xl bg-white text-brand-blue border border-brand-neutral-border inline-block mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-brand-neutral-dark mb-2">{v.title}</h4>
                    <p className="text-xs text-brand-neutral-muted leading-relaxed">{v.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  );
}
