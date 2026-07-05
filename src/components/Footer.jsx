import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-white pt-20 pb-16 px-6 sm:px-12 md:px-16 border-t border-slate-200 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-16">
          
          {/* Brand Information Column */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <Link to="/" className="flex items-center gap-3 text-slate-900 font-extrabold text-2xl tracking-wider mb-5">
                <img src={logoImg} className="w-9 h-9 object-contain" alt="Realstate Logo" />
                <span>Realstate</span>
              </Link>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-sm">
                Enterprise AI workspace for modern real estate developers. Qualify leads instantly, schedule property visits, and automate customer pipelines with intelligent AI agents.
              </p>
            </div>

            {/* Social Icons Row (Instagram, Facebook, Twitter, LinkedIn) */}
            <div className="flex items-center gap-5 mt-8 text-slate-500">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#e1306c] transition-colors p-1.5 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877f2] transition-colors p-1.5 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors p-1.5 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] transition-colors p-1.5 rounded-full hover:bg-slate-100">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns Grid */}
          <div className="md:col-span-8 flex flex-col sm:flex-row justify-between gap-8 md:gap-12 lg:gap-24 lg:pl-16 w-full">
            
            {/* Column 1: Product */}
            <div className="flex flex-col flex-1 min-w-[120px]">
              <h4 className="text-base font-bold text-slate-900 tracking-tight" style={{ marginBottom: '1.25rem' }}>
                Product
              </h4>
              <div className="flex flex-col gap-4 text-sm sm:text-base">
                <Link to="/features" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Overview
                </Link>
                <a href="/#pricing" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Pricing
                </a>
                <Link to="/login" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Marketplace
                </Link>
                <Link to="/features" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Features
                </Link>
              </div>
            </div>

            {/* Column 2: Company */}
            <div className="flex flex-col flex-1 min-w-[120px]">
              <h4 className="text-base font-bold text-slate-900 tracking-tight" style={{ marginBottom: '1.25rem' }}>
                Company
              </h4>
              <div className="flex flex-col gap-4 text-sm sm:text-base">
                <Link to="/about" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  About
                </Link>
                <Link to="/about" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Team
                </Link>
                <Link to="/" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Blog
                </Link>
                <Link to="/contact" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Careers
                </Link>
              </div>
            </div>

            {/* Column 3: Resources */}
            <div className="flex flex-col flex-1 min-w-[120px]">
              <h4 className="text-base font-bold text-slate-900 tracking-tight" style={{ marginBottom: '1.25rem' }}>
                Resources
              </h4>
              <div className="flex flex-col gap-4 text-sm sm:text-base">
                <Link to="/features" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Help
                </Link>
                <Link to="/contact" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Sales
                </Link>
                <Link to="/contact" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Advertise
                </Link>
                <Link to="/privacy" className="text-slate-700 hover:text-slate-950 transition-colors font-medium">
                  Privacy
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom copyright & policies */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-600 text-sm sm:text-base pt-8 border-t border-slate-200">
          <span>&copy; {new Date().getFullYear()} Realstate. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/terms" className="text-slate-600 hover:text-slate-950 transition-colors font-medium">
              Terms and Conditions
            </Link>
            <Link to="/privacy" className="text-slate-600 hover:text-slate-950 transition-colors font-medium">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
