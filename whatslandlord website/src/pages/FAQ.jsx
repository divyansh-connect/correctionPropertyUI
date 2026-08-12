import React, { useState } from 'react';
import { FAQS } from '../data/faqData';
import { HelpCircle, Search, MessageSquare, Phone, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';
import FinalCTASection from '../sections/FinalCTASection';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-brand-slate border-b border-brand-neutral-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="green" icon={HelpCircle} className="mb-4">
            Help Center & Knowledge Base
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-neutral-dark tracking-tight leading-tight max-w-4xl mx-auto">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg text-brand-neutral-muted max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about our enterprise property management SaaS, security, pricing, and onboarding workflows.
          </p>

          {/* Search Input Box */}
          <div className="max-w-xl mx-auto mt-8 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brand-neutral-muted">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by topic (e.g. accounting, ACH, portals)..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-brand-neutral-border text-brand-neutral-dark placeholder-gray-400 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>
      </section>

      {/* Accordion Questions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFaqs.length > 0 ? (
            <Accordion items={filteredFaqs} allowMultiple={true} />
          ) : (
            <div className="text-center py-12 text-brand-neutral-muted">
              <p className="text-lg font-semibold">No questions matching "{searchQuery}"</p>
              <p className="text-sm mt-1">Try searching with a different term or contact our sales team.</p>
            </div>
          )}

          {/* Still Need Help Box */}
          <div className="mt-16 p-8 rounded-2xl bg-brand-slate border border-brand-slate-accent flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-brand-blue text-white shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-brand-neutral-dark">Still Have Questions?</h4>
                <p className="text-xs text-brand-neutral-muted">Our dedicated real estate software specialists are here to assist you.</p>
              </div>
            </div>

            <Button to="/contact" variant="primary" size="md" icon={ArrowRight} className="shrink-0">
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      <FinalCTASection />
    </div>
  );
}
