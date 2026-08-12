import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIFloatingAssistant from '../components/ui/AIFloatingAssistant';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-slate text-brand-neutral-dark relative overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="flex-grow pt-20 sm:pt-24 overflow-x-hidden w-full max-w-full">
        <Outlet />
      </main>
      <Footer />
      {/* Premium Static AI Assistant Widget */}
      <AIFloatingAssistant />
    </div>
  );
}
