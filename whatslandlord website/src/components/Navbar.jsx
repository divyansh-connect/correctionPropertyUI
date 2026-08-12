import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Menu, X, ArrowRight, Shield } from 'lucide-react';
import { NAV_LINKS } from '../data/navigationData';
import Button from './ui/Button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page navigate
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-full transition-all duration-300 ${
        isScrolled ? 'glass-nav-scrolled py-2.5 sm:py-3' : 'glass-nav py-3.5 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white shadow-md group-hover:bg-brand-blue-dark transition-colors shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-brand-neutral-dark tracking-tight leading-tight">
                WhatsLandlord
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold text-brand-blue uppercase tracking-wider">
                Enterprise Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (XL screens and above) */}
          <nav className="hidden xl:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'text-brand-blue bg-brand-blue-surface'
                      : 'text-brand-neutral-dark hover:text-brand-blue hover:bg-brand-slate-muted'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden xl:flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className="text-sm font-bold text-brand-neutral-dark hover:text-brand-blue px-3 py-2 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Shield className="w-4 h-4 text-brand-blue" />
              <span>Login</span>
            </Link>
            <Button to="/contact" variant="primary" size="md" icon={ArrowRight}>
              Book Demo
            </Button>
          </div>

          {/* Mobile & Tablet Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl text-brand-neutral-dark hover:bg-brand-slate-muted transition-colors focus:outline-none shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 w-full max-w-full bg-white border-b border-brand-neutral-border shadow-xl p-4 sm:p-6 animate-fade-in space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto pointer-events-auto">
          <div className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full px-4 py-3 text-base font-semibold rounded-xl transition-colors ${
                    isActive
                      ? 'text-brand-blue bg-brand-blue-surface'
                      : 'text-brand-neutral-dark hover:bg-brand-slate'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-brand-slate flex flex-col gap-3 pb-6">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 text-base font-bold text-brand-neutral-dark hover:text-brand-blue bg-brand-slate rounded-xl border border-brand-neutral-border transition-colors"
            >
              Login to Software
            </Link>
            <Button to="/contact" variant="primary" size="lg" className="w-full justify-center flex" onClick={() => setMobileMenuOpen(false)}>
              Book Demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
