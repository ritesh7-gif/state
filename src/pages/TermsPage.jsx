import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Terms of Service</h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
            The rules and guidelines for using the PropAgentOS platform.
          </p>
        </div>
      </div>

      <section style={{ padding: '0 2rem 120px' }}>
        <div className="container" style={{ maxWidth: '800px', color: '#334155', lineHeight: 1.8, fontSize: '1.1rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: '2rem' }}>
            By accessing or using the PropAgentOS platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using our services.
          </p>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>2. Use License</h2>
          <p style={{ marginBottom: '2rem' }}>
            Permission is granted to temporarily access the materials (information or software) on PropAgentOS's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>3. AI Agent Interactions</h2>
          <p style={{ marginBottom: '2rem' }}>
            You understand that you will be interacting with artificial intelligence systems designed to automate real estate tasks. While we strive for accuracy, PropAgentOS is not liable for errors or omissions made by the automated systems. You are responsible for verifying all contracts and financial calculations.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TermsPage;
