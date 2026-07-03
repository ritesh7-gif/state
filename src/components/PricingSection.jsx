import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  return (
    <section id="pricing" className="section-white" style={{ padding: '120px 2rem' }}>
      <div className="container">
        <div className="lp-section-header animate-fade-up">
          <div className="lp-section-eyebrow">Predictable Pricing</div>
          <h2>Choose your plan</h2>
          <p>Scale seamlessly as you grow. No hidden fees.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center', marginTop: '4rem' }}>
          
          {/* Starter Plan */}
          <div className="animate-fade-up delay-100" style={{ padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Starter</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Perfect for independent agents.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>$49<span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>/mo</span></div>
            <Link to="/login" className="lp-btn lp-btn-secondary" style={{ width: '100%', marginBottom: '2rem' }}>Get Started</Link>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> 1 AI Agent Persona</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> Basic CRM Integration</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> Up to 500 interactions/mo</li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="animate-fade-up delay-300" style={{ padding: '3rem', background: '#0f172a', borderRadius: '24px', color: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', transform: 'scale(1.05)' }}>
            <div style={{ background: '#2563eb', color: 'white', padding: '0.25rem 1rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>MOST POPULAR</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#ffffff' }}>Professional</h3>
            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>For growing real estate agencies.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#ffffff' }}>$199<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>/mo</span></div>
            <Link to="/login" className="lp-btn lp-btn-primary" style={{ width: '100%', marginBottom: '2rem', background: '#ffffff', color: '#0f172a', border: 'none' }}>Start Free Trial</Link>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#60a5fa" /> All AI Agent Personas</li>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#60a5fa" /> Advanced CRM Integration</li>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#60a5fa" /> Unlimited interactions</li>
              <li style={{ display: 'flex', gap: '10px', color: '#f1f5f9' }}><Check size={20} color="#60a5fa" /> Custom property database</li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="animate-fade-up delay-500" style={{ padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>For large scale developers.</p>
            <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Custom</div>
            <a href="mailto:sales@realstate.ai" className="lp-btn lp-btn-secondary" style={{ width: '100%', marginBottom: '2rem' }}>Contact Sales</a>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> Dedicated Infrastructure</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> Custom AI Fine-Tuning</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> 24/7 Priority Support</li>
              <li style={{ display: 'flex', gap: '10px', color: '#334155' }}><Check size={20} color="#2563eb" /> SLA Guarantee</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PricingSection;
