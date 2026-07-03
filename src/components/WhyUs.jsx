import React from 'react';
import { TrendingUp, Zap, CalendarDays, Database, Clock, Shield } from 'lucide-react';

const WhyUs = () => {
  return (
    <section className="section-white">
      <div className="container">
        <div className="lp-section-header animate-fade-up">
          <div className="lp-section-eyebrow">The Advantage</div>
          <h2>Why Builders Choose Us</h2>
          <p>Real estate developers use our platform to accelerate sales and automate manual tasks.</p>
        </div>

        <div className="lp-bento-grid">
          <div className="lp-bento-card lp-bento-large animate-fade-up delay-100">
            <div className="lp-bento-icon"><TrendingUp size={24} /></div>
            <div>
              <h3>Increase Booking Conversion</h3>
              <p>AI agents qualify leads instantly and schedule site visits while interest is at its peak, driving up your conversion rates.</p>
            </div>
          </div>
          <div className="lp-bento-card animate-fade-up delay-200">
            <div className="lp-bento-icon"><Zap size={24} /></div>
            <div>
              <h3>Reduce Manual Work</h3>
              <p>Automate data entry and CRM updates.</p>
            </div>
          </div>
          <div className="lp-bento-card animate-fade-up delay-300">
            <div className="lp-bento-icon"><Clock size={24} /></div>
            <div>
              <h3>24/7 Availability</h3>
              <p>Your sales team never sleeps.</p>
            </div>
          </div>
          <div className="lp-bento-card lp-bento-large animate-fade-up delay-400">
            <div className="lp-bento-icon"><Database size={24} /></div>
            <div>
              <h3>Centralized Customer Data</h3>
              <p>Every conversation, preference, and property viewed is automatically structured and saved to the CRM.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
