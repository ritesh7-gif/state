import React from 'react';
import { ArrowRight, Play, Home, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="lp-hero">
      <div className="container">
        <div className="lp-hero-content">
          <div className="lp-hero-badge animate-fade-up">
            RealEstate AI Platform 2.0
          </div>
          <h1 className="animate-fade-up delay-100">
            AI Agents Built for Modern <br/><span>Real Estate Sales Teams</span>
          </h1>
          <p className="animate-fade-up delay-200">
            Automate property bookings, customer management, site visits, CRM workflows and sales operations using intelligent AI agents.
          </p>
          <div className="lp-hero-actions animate-fade-up delay-300">
            <Link to="/login" className="lp-btn lp-btn-primary">
              Request Demo <ArrowRight size={16} />
            </Link>
            <a href="#features" className="lp-btn lp-btn-secondary">
              <Play size={16} /> Watch Platform
            </a>
          </div>
        </div>

        {/* Floating AI Workspace Mockup */}
        <div className="lp-hero-mockup-wrapper">
          <div className="lp-mockup-main premium-hover">
            <div className="lp-mockup-header">
              <div className="lp-mockup-dot" style={{ background: '#ff5f56' }} />
              <div className="lp-mockup-dot" style={{ background: '#ffbd2e' }} />
              <div className="lp-mockup-dot" style={{ background: '#27c93f' }} />
            </div>
            <div className="lp-mockup-content">
              <div className="lp-mockup-sidebar" style={{ gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', borderRadius: '8px', background: 'rgba(37,99,235,0.08)', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
                  <Home size={18} /> Dashboard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                  <MessageSquare size={18} /> Conversations
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} /> Bookings
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0' }} /> Settings
                </div>
              </div>
              <div className="lp-mockup-body">
                <div className="lp-mockup-chat-bubble lp-mockup-chat-ai">
                  <strong>Booking Agent</strong>
                  <p style={{ marginTop: '0.25rem' }}>I've identified 3 properties matching the client's criteria. Should I schedule site visits for this weekend?</p>
                </div>
                <div className="lp-mockup-chat-bubble lp-mockup-chat-user" style={{ background: '#2563eb' }}>
                  Yes, please schedule them for Saturday morning.
                </div>
                <div className="lp-mockup-chat-bubble lp-mockup-chat-ai">
                  <strong>Booking Agent</strong>
                  <p style={{ marginTop: '0.25rem' }}>Done. Invitations sent to the client and calendars have been updated. The properties are confirmed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
