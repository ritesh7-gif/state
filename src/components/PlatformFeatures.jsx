import React from 'react';
import FeaturesCards from "./ui/feature-shader-cards";

const PlatformFeatures = () => {
  return (
    <section id="features" className="section-light" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '100px' }}>
      {/* Background ambient glows */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,82,255,0.03) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="lp-section-header animate-fade-up" style={{ marginBottom: '60px' }}>
          <div className="lp-section-eyebrow">Enterprise Capabilities</div>
          <h2>Powerful Features</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>A comprehensive suite of AI-driven tools designed to automate tasks, qualify leads, and elevate your real estate workflow.</p>
        </div>
        
        <FeaturesCards />
      </div>
    </section>
  );
};

export default PlatformFeatures;
