import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { FOOTER_LINKS } from '../data/navigationData';

export default function Footer() {
  return (
    <footer className="bg-brand-neutral-dark text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 pb-12 border-b border-gray-800">
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md shrink-0">
                <Building2 className="w-5 h-5 text-white stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-tight">
                  WhatsLandlord
                </span>
                <span className="text-[10px] font-extrabold text-brand-blue-surface uppercase tracking-wider">
                  Enterprise Property Software
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed pr-4">
              All-in-one enterprise property management platform for modern real estate operators, property managers, owners, and residents.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
              <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SOC 2 Type II Certified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                <Lock className="w-4 h-4 text-brand-indigo-light" />
                <span>256-bit Encrypted</span>
              </div>
            </div>
          </div>

          {/* 6 DEMO PORTALS Column - Highlighted & Directly Linked to Software Portals */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <h4 className="text-sm font-extrabold text-brand-indigo-light uppercase tracking-wider">6 Role Portals</h4>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-blue/30 text-brand-blue-surface border border-brand-blue/40">LIVE</span>
            </div>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.portals.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-300 hover:text-brand-blue-surface font-semibold transition-colors flex items-center gap-1 group">
                    <span>{item.name}</span>
                    <ArrowRight className="w-3 h-3 text-brand-blue opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.product.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.solutions.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company & Support</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Enterprise Property Management SaaS. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2">
            <Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Security Statement</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
