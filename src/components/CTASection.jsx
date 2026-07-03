import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="lp-cta">
      <div className="container">
        <h2>Ready to Transform Your Real Estate Sales Team?</h2>
        <div className="lp-cta-actions">
          <Link to="/login" className="lp-btn lp-btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
            Request Demo
          </Link>
          <a href="#" className="lp-btn lp-btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
            Talk to Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
