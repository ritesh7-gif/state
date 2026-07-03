import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Predictable pricing</h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            Choose the plan that best fits your real estate team's needs. Scale seamlessly as you grow.
          </p>
        </div>
      </div>

      <section style={{ padding: '0 2rem 120px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          
          {/* Starter Plan */}
          <div style={{ padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Starter</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Perfect for independent agents.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>$49<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/mo</span></div>
            <Link to="/login" className="lp-btn lp-btn-secondary" style={{ width: '100%', marginBottom: '2rem' }}>Get Started</Link>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> 1 AI Agent Persona</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> Basic CRM Integration</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> Up to 500 interactions/mo</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div style={{ padding: '3rem', background: '#0f172a', borderRadius: '24px', color: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transform: 'scale(1.05)' }}>
            <div style={{ background: '#0052FF', color: 'white', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>MOST POPULAR</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ffffff' }}>Professional</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>For growing real estate agencies.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#ffffff' }}>$199<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/mo</span></div>
            <Link to="/login" className="lp-btn lp-btn-primary" style={{ width: '100%', marginBottom: '2rem', background: '#0052FF', border: 'none' }}>Start Free Trial</Link>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#00d2ff" /> All AI Agent Personas</li>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#00d2ff" /> Advanced CRM Integration</li>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#00d2ff" /> Unlimited interactions</li>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#00d2ff" /> Custom property database</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div style={{ padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>For large scale developers.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Custom</div>
            <a href="mailto:sales@realstate.ai" className="lp-btn lp-btn-secondary" style={{ width: '100%', marginBottom: '2rem' }}>Contact Sales</a>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> Dedicated Infrastructure</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> Custom AI Fine-Tuning</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> 24/7 Priority Support</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#0052FF" /> SLA Guarantee</li>
            </ul>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PricingPage;
