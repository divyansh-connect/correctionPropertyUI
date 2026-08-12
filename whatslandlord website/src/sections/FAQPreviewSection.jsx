import React from 'react';
import { FAQS } from '../data/faqData';
import { HelpCircle, ArrowRight } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Accordion from '../components/ui/Accordion';
import Button from '../components/ui/Button';

export default function FAQPreviewSection() {
  const previewFaqs = FAQS.slice(0, 5);

  return (
    <section className="py-12 sm:py-16 bg-brand-slate">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Frequently Asked Questions"
          badgeIcon={HelpCircle}
          title="Everything You Need to Know"
          subtitle="Common answers regarding portfolio onboarding, software security, double-entry trust accounting, and tenant portals."
        />

        <Accordion items={previewFaqs} className="mb-10" />

        <div className="text-center">
          <Button to="/faq" variant="outline" size="lg" icon={ArrowRight}>
            View All Frequently Asked Questions
          </Button>
        </div>
      </div>
    </section>
  );
}
