import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="lp-footer">
      <div className="container">
        <div className="lp-footer-grid">
          <div>
            <div className="lp-footer-brand">
              <Building2 size={24} color="#0052FF" />
              RealState
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '280px' }}>
              Enterprise AI agents for modern real estate companies. Automate your entire sales pipeline with intelligent LangGraph-powered automation.
            </p>
          </div>

          <div className="lp-footer-col">
            <h4>Platform</h4>
            <Link to="/features">Features</Link>
            <a href="/#pricing">Pricing</a>
            <Link to="/login">Workspace</Link>
            <Link to="/features">Documentation</Link>
          </div>

          <div className="lp-footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Careers</Link>
            <Link to="/">Blog</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="lp-footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Cookie Policy</Link>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span>&copy; {new Date().getFullYear()} RealState AI. All rights reserved.</span>
          <span>Built with LangGraph &amp; Python</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
