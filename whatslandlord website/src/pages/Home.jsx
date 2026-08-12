import React from 'react';
import HeroSection from '../sections/HeroSection';
import TrustedCompanies from '../sections/TrustedCompanies';
import ProductOverview from '../sections/ProductOverview';
import AIWorkflowSection from '../sections/AIWorkflowSection';
import AIAssistantPreviewSection from '../sections/AIAssistantPreviewSection';
import DashboardPreviewSection from '../sections/DashboardPreviewSection';
import PredictiveAnalyticsSection from '../sections/PredictiveAnalyticsSection';
import RolePortalsSection from '../sections/RolePortalsSection';
import CoreFeaturesSection from '../sections/CoreFeaturesSection';
import WhyChooseUsSection from '../sections/WhyChooseUsSection';
import IntegrationsSection from '../sections/IntegrationsSection';
import StatisticsSection from '../sections/StatisticsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import PricingPreviewSection from '../sections/PricingPreviewSection';
import FAQPreviewSection from '../sections/FAQPreviewSection';
import FinalCTASection from '../sections/FinalCTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustedCompanies />
      <ProductOverview />
      <AIWorkflowSection />
      <AIAssistantPreviewSection />
      <DashboardPreviewSection />
      <PredictiveAnalyticsSection />
      <RolePortalsSection />
      <CoreFeaturesSection />
      <WhyChooseUsSection />
      <IntegrationsSection />
      <StatisticsSection />
      <TestimonialsSection />
      <PricingPreviewSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </>
  );
}
