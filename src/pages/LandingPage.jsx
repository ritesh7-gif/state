import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, CheckCircle2, User, Globe, Volume2, Layers } from 'lucide-react';
import TrustSection from '../components/TrustSection';
import AIAgents from '../components/AIAgents';
import PlatformFeatures from '../components/PlatformFeatures';
import PlatformPreviewMockup from '../components/PlatformPreviewMockup';
import WhyUs from '../components/WhyUs';
import AIInsights from '../components/AIInsights';
import PricingSection from '../components/PricingSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

import bgVideo from '../assets/Create_an_ultra_realistic_cine.mp4';
import logoImg from '../assets/logo.png';
import '../styles/sierra-landing.css';

const AnimatedChatWidget = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5); // 0, 1, 2, 3, 4
    }, 1200); // reduced delay to make the chat cycle faster
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sierra-floating-chat-container">
      {/* Agent Bubble 1 */}
      <div className={`sierra-chat-box sierra-chat-agent ${
        step === 0 ? 'hidden-state' : step >= 3 ? 'blur-out' : 'pop-in'
      }`}>
        <div className="sierra-chat-header">
          <img src={logoImg} className="w-4 h-4 object-contain" alt="Realstate Logo" />
          <span>Realstate Agent</span>
        </div>
        <div className="sierra-chat-text">
          Hi there, how can I help you today?
        </div>
      </div>

      {/* User Bubble */}
      <div className={`sierra-chat-box sierra-chat-user ${
        step <= 1 ? 'hidden-state' : step >= 4 ? 'blur-out' : 'pop-in'
      }`}>
        <div className="sierra-chat-header">
          <div className="sierra-avatar">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Marie" />
          </div>
          <span>Marie</span>
        </div>
        <div className="sierra-chat-text">
          I need to schedule a property visit for this weekend.
        </div>
      </div>

      {/* Agent Bubble 2 */}
      <div className={`sierra-chat-box sierra-chat-agent ${
        step <= 2 ? 'hidden-state' : 'pop-in'
      }`}>
        <div className="sierra-chat-header">
          <img src={logoImg} className="w-4 h-4 object-contain" alt="Realstate Logo" />
          <span>Realstate Agent</span>
        </div>
        <div className="sierra-chat-text">
          I found 3 matching properties. Scheduling for Saturday morning...
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Scroll to top on mount for a fresh view of the hero
    window.scrollTo(0, 0);

    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* SIERRA-STYLE HERO SECTION (100vh) */}
      <div className="sierra-landing">
        {/* Video Background */}
        <div className="sierra-video-wrapper">
          <video 
            className="sierra-video-bg" 
            autoPlay 
            muted 
            loop 
            playsInline
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
          <div className="sierra-video-overlay"></div>
        </div>

        {/* Main Content Overlay */}
        <div className="sierra-content-overlay">
          {/* Header */}
          <header className={`sierra-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="sierra-header-left">
              <Link to="/" className="sierra-logo flex items-center gap-2">
                <img src={logoImg} className="w-7 h-7 object-contain" alt="Realstate Logo" />
                <span>Realstate</span>
              </Link>
            </div>
            
            <nav className="sierra-header-center">
              <div className="sierra-nav-item">
                <Link to="/features" className="sierra-nav-link">Product</Link>
                <div className="sierra-dropdown-card">
                  <div className="sierra-dropdown-column">
                    <h4>FEATURES</h4>
                    <Link to="#">AI Valuation</Link>
                    <Link to="#">Virtual Tours</Link>
                    <Link to="#">Lead Qualification</Link>
                  </div>
                  <div className="sierra-dropdown-column">
                    <h4>PLATFORM</h4>
                    <Link to="#">Realstate Core LLM</Link>
                    <Link to="#">KB Sync</Link>
                    <Link to="#">Analytics</Link>
                  </div>
                </div>
              </div>

              <div className="sierra-nav-item">
                <Link to="#" className="sierra-nav-link">Industries</Link>
                <div className="sierra-dropdown-card">
                  <div className="sierra-dropdown-column">
                    <h4>REAL ESTATE</h4>
                    <Link to="#">Residential Brokerage</Link>
                    <Link to="#">Commercial Leasing</Link>
                    <Link to="#">Property Management</Link>
                    <Link to="#">Land Acquisitions</Link>
                  </div>
                </div>
              </div>

              <div className="sierra-nav-item">
                <Link to="#" className="sierra-nav-link">Customers</Link>
              </div>

              <div className="sierra-nav-item">
                <Link to="/about" className="sierra-nav-link">Company</Link>
                <div className="sierra-dropdown-card sierra-dropdown-single">
                  <div className="sierra-dropdown-column">
                    <h4>ABOUT</h4>
                    <Link to="#">Our Team</Link>
                    <Link to="#">Careers</Link>
                    <Link to="#">Press Kit</Link>
                    <Link to="#">Contact Sales</Link>
                  </div>
                </div>
              </div>
            </nav>

            <div className="sierra-header-right">
              <Link to="/login" className="sierra-link-btn">Sign in</Link>
              <Link to="/login" className="sierra-pill-btn">Learn more</Link>
            </div>
          </header>

          {/* Hero */}
          <main className="sierra-hero">
            <div className="sierra-hero-text">
              <h1>
                Intelligent AI Agents.<br />
                Built for Modern<br />
                Real Estate.
              </h1>
              <Link to="/features" className="sierra-hero-btn">
                Learn more
              </Link>
            </div>
          </main>
        </div>

        {/* Floating Chat Widgets Loop */}
        <AnimatedChatWidget />
        
        {/* Scroll Indicator */}
        <div className="sierra-scroll-indicator"></div>
      </div>

      {/* REST OF THE SITE (Below the fold) */}
      <div className="sierra-rest-of-site">
        <TrustSection />
        <AIAgents />
        <PlatformFeatures />
        <PlatformPreviewMockup />
        <WhyUs />
        <AIInsights />
        <PricingSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
