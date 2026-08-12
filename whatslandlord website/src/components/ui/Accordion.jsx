import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items, allowMultiple = false, className = '' }) {
  const [openIndexes, setOpenIndexes] = useState([0]); // Open first by default

  const toggleItem = (index) => {
    if (allowMultiple) {
      if (openIndexes.includes(index)) {
        setOpenIndexes(openIndexes.filter((i) => i !== index));
      } else {
        setOpenIndexes([...openIndexes, index]);
      }
    } else {
      setOpenIndexes(openIndexes.includes(index) ? [] : [index]);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        return (
          <div
            key={index}
            className="border border-brand-neutral-border rounded-2xl bg-white overflow-hidden shadow-xs transition-all duration-200 hover:border-brand-blue/30"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-brand-neutral-dark hover:text-brand-blue transition-colors focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-base sm:text-lg">{item.question}</span>
              <div className={`p-1.5 rounded-full bg-brand-slate transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-blue-surface text-brand-blue' : 'text-brand-neutral-muted'}`}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-6 pt-1 text-brand-neutral-muted text-sm sm:text-base leading-relaxed border-t border-brand-slate/80 animate-fade-in">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
