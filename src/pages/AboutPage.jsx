import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Our Mission</h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
            We believe that real estate transactions should be seamless, automated, and deeply personalized. PropAgentOS is building the intelligent operating system for modern real estate developers and agencies.
          </p>
        </div>
      </div>

      <section style={{ padding: '0 2rem 120px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div style={{ background: '#f8fafc', borderRadius: '24px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              [HQ Image]
            </div>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Built by industry veterans and AI researchers.</h2>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                The real estate industry has been running on legacy CRMs and manual data entry for decades. Our team combined deep expertise in LangGraph, autonomous agents, and real estate operations to create a platform that doesn't just store data—it acts on it.
              </p>
              <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.8 }}>
                Today, PropAgentOS is trusted by top developers worldwide to manage thousands of property bookings and customer interactions automatically every single day.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutPage;
