import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustSection from '../components/TrustSection';
import AIAgents from '../components/AIAgents';
import PlatformFeatures from '../components/PlatformFeatures';
import PlatformPreviewMockup from '../components/PlatformPreviewMockup';
import WhyUs from '../components/WhyUs';
import AIInsights from '../components/AIInsights';
import PricingSection from '../components/PricingSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <Hero />
      <TrustSection />
      <AIAgents />
      <PlatformFeatures />
      <PlatformPreviewMockup />
      <WhyUs />
      <AIInsights />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
