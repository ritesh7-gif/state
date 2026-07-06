import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Get in Touch</h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
            Whether you're looking for a custom enterprise plan or want to join our team of AI researchers, we'd love to hear from you.
          </p>
        </div>
      </div>

      <section style={{ padding: '0 2rem 120px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#0f172a' }}>Sales & Partnerships</h2>
              <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
                Interested in deploying PropAgentOS across your organization? Let's talk about custom integrations.
              </p>
              <a href="mailto:sales@propagentos.ai" className="lp-btn lp-btn-primary" style={{ width: '100%' }}>sales@propagentos.ai</a>
            </div>

            <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#0f172a' }}>Careers</h2>
              <p style={{ color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
                We are constantly looking for talented engineers and real estate veterans to join our mission.
              </p>
              <a href="mailto:careers@propagentos.ai" className="lp-btn lp-btn-secondary" style={{ width: '100%' }}>careers@propagentos.ai</a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;
