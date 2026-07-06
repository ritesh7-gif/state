import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare, CheckCircle2, User, Globe, Volume2, Layers } from 'lucide-react';
import TrustSection from '../components/TrustSection';
import AIAgents from '../components/AIAgents';
import PlatformFeatures from '../components/PlatformFeatures';
import PlatformPreviewMockup from '../components/PlatformPreviewMockup';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import PricingSection from '../components/PricingSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

import bgVideo from '../assets/0706(1) (1).mp4';
import logoImg from '../assets/logo.png';
import '../styles/sierra-landing.css';

import { motion, AnimatePresence } from 'framer-motion';

const AnimatedChatWidget = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState([]);

  const chatSequence = [
    { id: 1, type: 'agent', text: 'Hi there! I am your PropAgentOS. How can I help you today?' },
    { id: 2, type: 'user', text: 'I am looking for a 3-bedroom property with a pool under $2M.' },
    { id: 3, type: 'agent', text: 'I found 5 matching properties. I have also pre-qualified your profile for them.' },
    { id: 4, type: 'user', text: 'Perfect. Can you schedule visits for the top 3 this weekend?' },
    { id: 5, type: 'agent', text: 'Done! I have booked the viewings and added the itinerary to your calendar.' },
  ];

  useEffect(() => {
    let delay = 1500;
    
    // Dynamic timing for a realistic typing feel
    if (messageIndex === 0) {
      delay = 800; // Fast start for the first message
    } else if (messageIndex === 1) {
      delay = 2000; 
    } else if (messageIndex === 2) {
      delay = 1800;
    } else if (messageIndex === 3) {
      delay = 1500;
    } else if (messageIndex === 4) {
      delay = 2000;
    } else if (messageIndex === 5) {
      delay = 3000; // Pause at the end for people to read
    } else {
      delay = 1000; // Quick pause before resetting
    }

    const timeoutId = setTimeout(() => {
      setMessageIndex((prev) => {
        const next = prev + 1;
        if (next > chatSequence.length + 1) { 
          return 0; // Reset
        }
        return next;
      });
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [messageIndex, chatSequence.length]);

  useEffect(() => {
    if (messageIndex === 0) {
      setVisibleMessages([]);
    } else if (messageIndex <= chatSequence.length) {
      const newMessage = chatSequence[messageIndex - 1];
      setVisibleMessages((prev) => {
        const updated = [...prev, newMessage];
        if (updated.length > 3) {
          return updated.slice(updated.length - 3);
        }
        return updated;
      });
    } else {
      // Pause at the end before resetting
      setVisibleMessages([]);
    }
  }, [messageIndex]); 

  return (
    <div className="sierra-floating-chat-container">
      <AnimatePresence mode="sync">
        {visibleMessages.map((msg) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`sierra-chat-box ${msg.type === 'agent' ? 'sierra-chat-agent' : 'sierra-chat-user'}`}
          >
            <div className="sierra-chat-header">
              {msg.type === 'agent' ? (
                <>
                  <img src={logoImg} className="h-6 w-auto object-contain" alt="PropAgentOS Logo" />
                  <span>PropAgentOS Agent</span>
                </>
              ) : (
                <>
                  <div className="sierra-avatar">
                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Marie" />
                  </div>
                  <span>Marie</span>
                </>
              )}
            </div>
            <div className="sierra-chat-text">
              {msg.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const BackgroundVideo = React.memo(() => {
  const videoRef = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!videoRef.current) return;
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="sierra-video-wrapper">
      <video 
        ref={videoRef}
        className="sierra-video-bg" 
        autoPlay 
        muted 
        loop 
        playsInline
        preload="auto"
        disablePictureInPicture
      >
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="sierra-video-overlay"></div>
    </div>
  );
});

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
        <BackgroundVideo />

        {/* Header */}
        <header className={`sierra-header ${scrolled ? 'scrolled' : ''}`}>
          <div className="sierra-header-left">
            <Link 
              to="/" 
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="sierra-logo flex items-center gap-2"
            >
              <img src={logoImg} className="h-16 w-auto object-contain" alt="PropAgentOS Logo" />
              <span>PropAgentOS</span>
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
                  <Link to="#">PropAgentOS Core LLM</Link>
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

        {/* Main Content Overlay */}
        <div className="sierra-content-overlay">


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
        <div className="flex flex-col gap-16 md:gap-24">
          <TrustSection />
          <AIAgents />
          <PlatformFeatures />
          <PlatformPreviewMockup />
          <WhyUs />
          <Testimonials />
          <PricingSection />
          <CTASection />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
