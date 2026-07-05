import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="lp-navbar animate-slide-down">
      <div className="container lp-nav-container">
        <Link to="/" className="lp-nav-brand flex items-center gap-2">
          <img src={logoImg} className="w-8 h-8 object-contain" alt="Realstate Logo" />
          Realstate
        </Link>

        <div className="lp-nav-links">
          <Link to="/features">Platform</Link>
          <a href="/#pricing">Pricing</a>
          <Link to="/about">About Us</Link>
        </div>

        <div className="lp-nav-actions">
          <Link to="/login" className="lp-btn lp-btn-secondary">Log In</Link>
          <Link to="/login" className="lp-btn lp-btn-primary">Request Demo</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
