import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PricingSection from '../components/PricingSection';

const PricingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
