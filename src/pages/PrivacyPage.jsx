import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Privacy Policy</h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
            How RealState AI collects, uses, and protects your personal data.
          </p>
        </div>
      </div>

      <section style={{ padding: '0 2rem 120px' }}>
        <div className="container" style={{ maxWidth: '800px', color: '#334155', lineHeight: 1.8, fontSize: '1.1rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>1. Data Collection</h2>
          <p style={{ marginBottom: '2rem' }}>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
          </p>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>2. How We Use Your Data</h2>
          <p style={{ marginBottom: '2rem' }}>
            Our AI agents use the data collected to provide, maintain, and improve our services, including to facilitate real estate transactions, automate CRM workflows, and personalize the platform experience for our users. We do not sell your personal data to third parties.
          </p>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>3. Data Security</h2>
          <p style={{ marginBottom: '2rem' }}>
            We implement high-level enterprise security measures to protect your data. Your data is encrypted in transit and at rest using industry-standard protocols to prevent unauthorized access.
          </p>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0f172a' }}>4. Changes to This Policy</h2>
          <p style={{ marginBottom: '2rem' }}>
            We may change this Privacy Policy from time to time. If we make significant changes in the way we treat your personal information, we will provide you notice through the Services or by some other means, such as email.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
