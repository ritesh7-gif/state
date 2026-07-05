import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft, ArrowRight, Calendar, Search, Users, MapPin,
  DollarSign, Lightbulb, X, CheckCircle2, Zap, BarChart3,
  Clock, Globe, Shield, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Agent Data ──────────────────────────────────────────────────── */
const AGENTS_DATA = [
  {
    id: 'booking',
    title: 'Booking Agent',
    tagline: 'Zero double-bookings. Always.',
    description: 'Automatically schedules and coordinates property viewings with clients and sales teams, ensuring zero double-bookings.',
    icon: Calendar,
    color: '#3b82f6',
    colorBg: 'rgba(59,130,246,0.10)',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    longDesc: 'The Booking Agent takes full ownership of your scheduling pipeline. It parses inbound client requests, checks agent availability in real-time, blocks calendar slots across Google Calendar, Outlook and your CRM, then sends branded confirmation messages — all without human intervention.',
    stats: [
      { value: '98%', label: 'Booking Accuracy' },
      { value: '< 2s', label: 'Response Time' },
      { value: '3×', label: 'More Viewings / Week' },
    ],
    features: [
      { icon: Clock, text: '24/7 automated scheduling with instant confirmations' },
      { icon: Globe, text: 'Syncs across Google, Outlook & iCal in real-time' },
      { icon: Shield, text: 'Smart conflict detection — zero double-bookings guaranteed' },
      { icon: Zap, text: 'Auto-reschedules cancellations and notifies all parties' },
    ],
    useCases: [
      'High-volume agencies managing 50+ viewings per week',
      'Property managers coordinating tenants and landlords',
      'Developers running show-home open days',
    ],
  },
  {
    id: 'search',
    title: 'Property Search Agent',
    tagline: 'Natural language. Instant results.',
    description: 'Understands natural language queries to scour property listings and retrieve matches immediately.',
    icon: Search,
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.10)',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80',
    longDesc: 'Forget keyword searches. Clients simply describe what they want — "3-bedroom with a garden near good schools under £500k" — and the Search Agent maps that to hundreds of MLS, Rightmove, and Zillow criteria in milliseconds, returning ranked results with neighbourhood scoring.',
    stats: [
      { value: '10M+', label: 'Listings Indexed' },
      { value: '< 500ms', label: 'Query Time' },
      { value: '94%', label: 'Client Satisfaction' },
    ],
    features: [
      { icon: Zap, text: 'NLP intent parsing across 40+ search parameters' },
      { icon: Globe, text: 'Multi-portal aggregation (Zillow, Rightmove, MLS)' },
      { icon: BarChart3, text: 'AI-ranked results by conversion likelihood' },
      { icon: TrendingUp, text: 'Learns from client feedback to improve future matches' },
    ],
    useCases: [
      'Client-facing portals wanting a conversational search UX',
      'Agents quickly qualifying buyer budgets and preferences',
      'Relocation services handling urgent cross-city searches',
    ],
  },
  {
    id: 'crm',
    title: 'CRM Agent',
    tagline: 'Every lead. Every interaction. Logged.',
    description: 'Maintains customer profiles, logs client interactions, and suggests follow-up actions automatically.',
    icon: Users,
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.10)',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    longDesc: 'The CRM Agent works silently in the background — capturing every email, call transcript, and viewing note, enriching lead profiles with social data, scoring their purchase intent, and surfacing "next best action" prompts to your agents at exactly the right moment.',
    stats: [
      { value: '100%', label: 'Interaction Capture' },
      { value: '2.4×', label: 'Lead Conversion' },
      { value: '40%', label: 'Less Admin Time' },
    ],
    features: [
      { icon: Shield, text: 'Automatic interaction logging from email, calls & chat' },
      { icon: TrendingUp, text: 'AI lead scoring with purchase intent signals' },
      { icon: Zap, text: 'Next-best-action recommendations for each agent' },
      { icon: Globe, text: 'Native integrations with Salesforce, HubSpot & Zoho' },
    ],
    useCases: [
      'Large brokerages tracking hundreds of active leads',
      'Sales managers needing pipeline visibility and forecasting',
      'Agents following up across long nurture cycles',
    ],
  },
  {
    id: 'visit',
    title: 'Site Visit Agent',
    tagline: 'On-site intelligence. In your pocket.',
    description: 'Provides on-demand property details and localized information to clients during their visits.',
    icon: MapPin,
    color: '#f43f5e',
    colorBg: 'rgba(244,63,94,0.10)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    longDesc: 'When a client steps onto a property, the Site Visit Agent activates — surfacing floor plans, council tax bands, EPC ratings, flood risk data, school league tables and commute times. It captures visit notes, client reactions, and automatically flags properties marked "high interest" back to the CRM.',
    stats: [
      { value: '200+', label: 'Data Points Per Property' },
      { value: '30%', label: 'Faster Decisions' },
      { value: '4.9★', label: 'Client Experience' },
    ],
    features: [
      { icon: MapPin, text: 'GPS-triggered property data card at arrival' },
      { icon: Globe, text: 'Walkability, flood risk, schools & transport layers' },
      { icon: Zap, text: 'Voice capture for visit notes — transcribed automatically' },
      { icon: Shield, text: 'Flags interest level back to CRM in real-time' },
    ],
    useCases: [
      'Field agents managing 8+ viewings a day independently',
      'International buyers doing remote virtual walk-throughs',
      'New-build sales suites with self-guided tours',
    ],
  },
  {
    id: 'finance',
    title: 'Financial Agent',
    tagline: 'Numbers, instant. Confidence, immediate.',
    description: 'Calculates mortgages, yield rates, payment plans, and ROI metrics instantly based on live data.',
    icon: DollarSign,
    color: '#d97706',
    colorBg: 'rgba(217,119,6,0.10)',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    longDesc: 'Stop losing deals at the financial stage. The Financial Agent calculates personalised mortgage scenarios with live rate data, models rental yield and cash-on-cash ROI for investors, estimates stamp duty and conveyancing costs, and exports a clean financial summary PDF for each client.',
    stats: [
      { value: '15+', label: 'Mortgage Providers' },
      { value: '< 1s', label: 'Calculation Time' },
      { value: '22%', label: 'Increase in Offers Made' },
    ],
    features: [
      { icon: BarChart3, text: 'Live mortgage rate comparisons across 15+ lenders' },
      { icon: TrendingUp, text: 'Buy-to-let yield, ROI and cashflow modelling' },
      { icon: DollarSign, text: 'Stamp duty, LTT and conveyancing cost estimates' },
      { icon: Zap, text: 'Generates branded financial summary PDF in seconds' },
    ],
    useCases: [
      'Residential agents converting hesitant first-time buyers',
      'Investment advisors pitching portfolio acquisitions',
      'Mortgage brokers qualifying clients at point of enquiry',
    ],
  },
  {
    id: 'recommend',
    title: 'Recommendation Agent',
    tagline: 'The right property. Every time.',
    description: 'Understands your client preferences and matches them to high-conversion listings dynamically.',
    icon: Lightbulb,
    color: '#ec4899',
    colorBg: 'rgba(236,72,153,0.10)',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    longDesc: "Our recommendation engine learns from every client interaction — saved listings, rejected properties, time-on-page, search refinements — building a rich preference model that grows smarter with each signal. The result: listings that feel personally curated rather than algorithmically sorted, driving 3× higher offer rates.",
    stats: [
      { value: '3×', label: 'Higher Offer Rate' },
      { value: '96%', label: 'Match Accuracy' },
      { value: '8min', label: 'Avg. Time to Match' },
    ],
    features: [
      { icon: Lightbulb, text: 'Collaborative filtering tuned on 2M+ real estate journeys' },
      { icon: TrendingUp, text: 'Learns from rejections as powerfully as from saves' },
      { icon: BarChart3, text: 'Weekly "Top Picks" digest sent directly to clients' },
      { icon: Zap, text: 'Price-drop alerts for wishlisted and near-match properties' },
    ],
    useCases: [
      'Portals wanting Netflix-style personalised discovery',
      'Agents managing 50+ active buyers simultaneously',
      'Off-plan developers matching units to investor profiles',
    ],
  },
];

/* ─── Agent Detail Modal ──────────────────────────────────────────── */
const AgentModal = ({ agent, onClose }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const Icon = agent.icon;

  return (
    <div
      className="agent-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="agent-modal-panel">

        {/* ── LEFT: Full-height Image Panel ── */}
        <div className="agent-modal-left">
          <img src={agent.image} alt={agent.title} className="agent-modal-left-img" />
          {/* Dark gradient over bottom half so text pops */}
          <div className="agent-modal-left-overlay" />

          {/* Badge + tagline anchored to bottom-left */}
          <div className="agent-modal-left-content">
            <span className="agent-modal-badge">
              <Icon size={13} /> {agent.title}
            </span>
            <h2 className="agent-modal-title">{agent.tagline}</h2>

            {/* Stat pills inline in image panel */}
            <div className="agent-modal-img-stats">
              {agent.stats.map((s, i) => (
                <div key={i} className="agent-modal-img-stat">
                  <span className="agent-modal-img-stat-val">{s.value}</span>
                  <span className="agent-modal-img-stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Scrollable Content Panel ── */}
        <div className="agent-modal-right">

          {/* Close button */}
          <button className="agent-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>

          {/* How it works */}
          <div className="agent-modal-section">
            <p className="agent-modal-section-label">How it works</p>
            <p className="agent-modal-long-desc">{agent.longDesc}</p>
          </div>

          {/* Key capabilities */}
          <div className="agent-modal-section">
            <p className="agent-modal-section-label">Key capabilities</p>
            <div className="agent-features-list">
              {agent.features.map((f, i) => {
                const FIcon = f.icon;
                return (
                  <div key={i} className="agent-feature-row">
                    <span
                      className="agent-feature-icon"
                      style={{ background: agent.colorBg, color: agent.color }}
                    >
                      <FIcon size={15} />
                    </span>
                    <span>{f.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best for */}
          <div className="agent-modal-section">
            <p className="agent-modal-section-label">Best for</p>
            <ul className="agent-use-cases">
              {agent.useCases.map((u, i) => (
                <li key={i}>
                  <CheckCircle2 size={15} style={{ color: agent.color, flexShrink: 0, marginTop: '2px' }} />
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="agent-modal-cta">
            <Link to="/login" className="agent-cta-primary" style={{ background: agent.color }}>
              Try {agent.title} Free
            </Link>
            <Link to="/contact" className="agent-cta-secondary">
              Talk to Sales
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─── Main Carousel Section ───────────────────────────────────────── */
const AIAgents = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const totalSlides = AGENTS_DATA.length;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const cardSize = width <= 640 ? 296 : width <= 1024 ? 336 : 380;
      const padding = Math.max(32, (width - 1200) / 2 + 32);
      const visible = Math.floor((width - padding) / cardSize);
      setSlidesToShow(Math.max(1, visible));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const maxIndex = totalSlides - slidesToShow;
    if (currentIndex > maxIndex) setCurrentIndex(Math.max(0, maxIndex));
  }, [slidesToShow, currentIndex, totalSlides]);

  const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const handleNext = () => { if (currentIndex < totalSlides - slidesToShow) setCurrentIndex(currentIndex + 1); };
  const handleDotClick = (index) => setCurrentIndex(Math.min(index, totalSlides - slidesToShow));

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < totalSlides - slidesToShow;

  const handleCardClick = useCallback((e, agent) => {
    e.preventDefault();
    setSelectedAgent(agent);
  }, []);

  return (
    <>
      <section id="agents" className="section-light" style={{ padding: '100px 0', overflowX: 'clip' }}>

        {/* Header */}
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="lp-gallery-header">
            <div className="lp-gallery-header-left">
              <div className="lp-section-eyebrow" style={{ color: '#006642', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                Intelligent Workforce
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
                Meet Your AI Sales Team
              </h2>
              <p style={{ maxWidth: '520px', margin: 0, fontSize: '1.05rem', color: '#64748b', lineHeight: 1.5 }}>
                Deploy specialized AI agents that handle every stage of the real estate lifecycle, working seamlessly with your human workforce.
              </p>
            </div>
            <div className="lp-gallery-header-right">
              <button className="lp-gallery-btn" onClick={handlePrev} disabled={!canScrollPrev} aria-label="Previous">
                <ArrowLeft size={20} />
              </button>
              <button className="lp-gallery-btn" onClick={handleNext} disabled={!canScrollNext} aria-label="Next">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Track (full-bleed right) */}
        <div className="lp-gallery-carousel">
          <div
            className="lp-gallery-track"
            style={{ transform: `translate3d(calc(-${currentIndex} * (var(--card-width) + var(--card-gap))), 0px, 0px)` }}
          >
            {AGENTS_DATA.map((agent) => {
              const Icon = agent.icon;
              return (
                <div key={agent.id} className="lp-gallery-item">
                  <a
                    href="#"
                    className="lp-gallery-card"
                    onClick={(e) => handleCardClick(e, agent)}
                    aria-label={`View details for ${agent.title}`}
                  >
                    <img src={agent.image} alt={agent.title} className="lp-gallery-img" />
                    <div className="lp-gallery-overlay" />
                    <div className="lp-gallery-content">
                      {/* Mini badge */}
                      <span className="lp-gallery-card-badge" style={{ background: agent.colorBg, color: agent.color }}>
                        <Icon size={12} /> {agent.title}
                      </span>
                      <div className="lp-gallery-card-title">{agent.tagline}</div>
                      <div className="lp-gallery-card-desc">{agent.description}</div>
                      <div className="lp-gallery-link">
                        View details <ArrowRight size={16} />
                      </div>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="lp-gallery-dots">
            {AGENTS_DATA.map((_, index) => {
              const maxIndex = totalSlides - slidesToShow;
              if (index > maxIndex && maxIndex >= 0) return null;
              return (
                <button
                  key={index}
                  className={`lp-gallery-dot ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>

      </section>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </>
  );
};

export default AIAgents;
