import React, { useState } from 'react';
import { TESTIMONIALS } from '../data/testimonialsData';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Card from '../components/ui/Card';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section className="py-12 sm:py-16 bg-brand-slate" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Customer Success Stories"
          badgeIcon={MessageSquare}
          title="Trusted by Top Property Management Leaders"
          subtitle="Discover how property managers, investors, and operations executives achieve scale with our software."
        />

        {/* 4 Grid Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.slice(0, 4).map((item) => (
            <Card key={item.id} variant="white" className="p-5 sm:p-6 flex flex-col justify-between h-full border-brand-neutral-border shadow-card hover:border-brand-blue/40 hover:-translate-y-1 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-indigo text-brand-indigo" />
                    ))}
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-blue-surface text-brand-blue">
                    Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-brand-neutral-dark leading-relaxed mb-6 italic line-clamp-5">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-slate flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-brand-neutral-dark truncate">{item.name}</h4>
                  <p className="text-[10px] font-semibold text-brand-blue truncate">{item.role}</p>
                  <p className="text-[9px] text-brand-neutral-muted truncate">{item.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
