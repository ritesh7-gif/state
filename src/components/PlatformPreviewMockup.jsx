import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  Sliders, 
  Send, 
  Mic, 
  TrendingUp, 
  Calendar, 
  Check, 
  Globe, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  User,
  CheckCircle,
  Building
} from 'lucide-react';

const PlatformPreviewMockup = () => {
  const [currentView, setCurrentView] = useState('analytics'); // analytics | crm | builder
  const [searchText, setSearchText] = useState('');
  const [isManual, setIsManual] = useState(false);
  const [tick, setTick] = useState(0);
  const manualTimerRef = useRef(null);

  // Queries for the search bar
  const query1 = "Analyze lead activity and booking channels for this week.";
  const query2 = "Open recent high-intent lead profile and booking history.";
  const query3 = "Execute property matching and schedule tour for Marie Dubois.";

  // Auto-cycle animation state machine
  useEffect(() => {
    if (isManual) return;

    const interval = setInterval(() => {
      setTick((prevTick) => {
        const nextTick = (prevTick + 1) % 360;

        // View transitions based on tick timeline
        if (nextTick >= 0 && nextTick < 150) {
          setCurrentView('analytics');
          // Typing query 1
          if (nextTick < 45) {
            setSearchText(query1.substring(0, Math.floor(nextTick * (query1.length / 45))));
          } else {
            setSearchText(query1);
          }
        } else if (nextTick >= 150 && nextTick < 300) {
          setCurrentView('crm');
          // Typing query 2
          if (nextTick >= 150 && nextTick < 195) {
            const progressTick = nextTick - 150;
            setSearchText(query2.substring(0, Math.floor(progressTick * (query2.length / 45))));
          } else {
            setSearchText(query2);
          }
        } else if (nextTick >= 300 && nextTick < 360) {
          setCurrentView('builder');
          // Typing query 3
          if (nextTick >= 300 && nextTick < 335) {
            const progressTick = nextTick - 300;
            setSearchText(query3.substring(0, Math.floor(progressTick * (query3.length / 35))));
          } else {
            setSearchText(query3);
          }
        }

        return nextTick;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isManual]);

  // Handle manual tab override
  const handleTabClick = (view) => {
    setIsManual(true);
    setCurrentView(view);
    
    // Set static query texts directly on manual select
    if (view === 'analytics') setSearchText(query1);
    else if (view === 'crm') setSearchText(query2);
    else if (view === 'builder') setSearchText(query3);

    // Auto-resume tour after 15 seconds of inactivity
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      setIsManual(false);
      // Reset tick to start of the chosen view to make transition seamless
      if (view === 'analytics') setTick(0);
      else if (view === 'crm') setTick(150);
      else if (view === 'builder') setTick(300);
    }, 15000);
  };

  const resumeAutoTour = () => {
    setIsManual(false);
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    if (currentView === 'analytics') setTick(0);
    else if (currentView === 'crm') setTick(150);
    else if (currentView === 'builder') setTick(300);
  };

  // Helper variables for step-based element renders
  const showSummary = isManual || (tick >= 60 && tick < 150);
  const showChart = isManual || (tick >= 70 && tick < 150);
  
  // CRM Chat messages timing helper
  const showChatUserIndicator = !isManual && (tick >= 215 && tick < 225);
  const showChatUserBubble = isManual || (tick >= 225 && tick < 300);
  const showChatAgentIndicator = !isManual && (tick >= 235 && tick < 248);
  const showChatAgentBubble = isManual || (tick >= 248 && tick < 300);

  // Builder toggles and states timing helper
  const builderActiveSMS = isManual || tick >= 335;
  const builderPromptText = isManual 
    ? "Prioritize scheduling Saturday morning tours. Check CRM calendar for agent conflicts before confirming slots."
    : (tick >= 335 ? "Prioritize scheduling Saturday morning tours. Check CRM calendar for agent conflicts before confirming slots.".substring(0, Math.floor((tick - 335) * 3)) : "");
  const builderCheckboxChecked = isManual || tick >= 342;
  const builderSuccessConsole = isManual || tick >= 348;

  return (
    <section className="section-light" style={{ padding: '80px 2rem 140px' }}>
      <div className="container">
        <div className="lp-section-header">
          <div className="lp-section-eyebrow">Realstate Workspace</div>
          <h2>Enterprise AI Control Room</h2>
          <p>
            Experience how our AI agents qualify leads, coordinate bookings, and optimize system workflows in real-time.
          </p>
        </div>

        <div style={{ position: 'relative', margin: '0 auto', maxWidth: '1400px' }}>
          {/* Glowing Background Effect */}
          <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(135deg, rgba(0,82,255,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(34,197,94,0.3) 100%)', filter: 'blur(40px)', borderRadius: '30px', zIndex: 0, opacity: 0.3 }} />
          
          <div className="lp-mockup-main lp-mockup-bg-grid" style={{ position: 'relative', zIndex: 1, height: '680px', display: 'flex', flexDirection: 'column' }}>
          {/* Mockup Header (OS Dots & Navigation Title) */}
          <div className="lp-mockup-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div className="lp-mockup-dot" style={{ background: '#ff5f56' }} />
              <div className="lp-mockup-dot" style={{ background: '#ffbd2e' }} />
              <div className="lp-mockup-dot" style={{ background: '#27c93f' }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500, letterSpacing: '0.05em' }}>
              REALSTATE-AGENT-OS // {currentView.toUpperCase()}_VIEW
            </div>
            <div style={{ width: 48 }} />
          </div>

          <div className="lp-mockup-content" style={{ flex: 1, minHeight: 0 }}>
            {/* Left Sidebar */}
            <div className="lp-mockup-sidebar" style={{ gap: '0.5rem', width: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
                <div className="glow-dot-active" style={{ width: 8, height: 8, borderRadius: '50%', background: '#0052FF' }} />
                Realstate Studio
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '0.25rem', paddingLeft: '0.5rem' }}>ANALYZE</div>
              <button 
                onClick={() => handleTabClick('analytics')}
                className={`lp-mockup-sidebar-item ${currentView === 'analytics' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <BarChart3 size={18} /> Lead Insights
              </button>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginTop: '1rem', marginBottom: '0.25rem', paddingLeft: '0.5rem' }}>ENGAGE</div>
              <button 
                onClick={() => handleTabClick('crm')}
                className={`lp-mockup-sidebar-item ${currentView === 'crm' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <MessageSquare size={18} /> CRM Workspace
              </button>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginTop: '1rem', marginBottom: '0.25rem', paddingLeft: '0.5rem' }}>EXECUTE</div>
              <button 
                onClick={() => handleTabClick('builder')}
                className={`lp-mockup-sidebar-item ${currentView === 'builder' ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <CheckCircle2 size={18} /> Agent Workflow
              </button>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', background: 'rgba(15,23,42,0.03)', borderRadius: '12px', border: '1px solid rgba(15,23,42,0.04)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0052FF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8rem' }}>RE</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>RealEstate Core</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Project workspace</span>
                </div>
              </div>
            </div>

            {/* Main Body Area */}
            <div className="lp-mockup-body" style={{ background: '#f8fafc', padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              


              {/* Dynamic View Panels */}
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                
                {/* 1. ANALYTICS VIEW PANEL */}
                {currentView === 'analytics' && (
                  <div className="view-transition-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.25rem' }}>
                    


                    {/* Content Cards */}
                    <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
                      {/* Tour scheduling chart */}
                      <div className="lp-analytics-card" style={{ flex: 1.3, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tour Bookings</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.03em' }}>142</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#22c55e', display: 'flex', alignItems: 'center' }}>
                                <TrendingUp size={14} style={{ marginRight: 2 }} /> +18.5%
                              </span>
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#f1f5f9', borderRadius: '6px', color: '#64748b', fontWeight: 600 }}>Last 7d</span>
                        </div>
                        
                        {/* SVG Chart */}
                        <div style={{ flex: 1, display: 'flex', alignItems: 'end', minHeight: 0 }}>
                          <svg viewBox="0 0 500 120" width="100%" height="100%" style={{ overflow: 'visible' }} preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0052FF" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#0052FF" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                            
                            <path
                              d="M 0 110 C 150 110, 150 60, 250 60 C 350 60, 350 10, 500 10 L 500 120 L 0 120 Z"
                              fill="url(#chartGradient)"
                              style={{ animation: 'fadeUp 1.2s ease-out backwards' }}
                            />
                            
                            <path
                              d="M 0 110 C 150 110, 150 60, 250 60 C 350 60, 350 10, 500 10"
                              fill="none"
                              stroke="#0052FF"
                              strokeWidth="3"
                              strokeLinecap="round"
                              className="animate-svg-path"
                            />
                            <circle cx="500" cy="10" r="4.5" fill="#0052FF" style={{ animation: 'fadeUp 1.2s ease-out backwards' }} />
                          </svg>
                        </div>
                      </div>

                      {/* Top Channels */}
                      <div className="lp-analytics-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Top Inquiry Channels</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, justifyContent: 'center' }}>
                          
                          {/* Channel Item 1 */}
                          <div style={{ display: 'flex', alignItems: 'center', justifySpace: 'between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                            <div style={{ width: '90px' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Zillow Sync</div>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>68 leads</span>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
                              <svg viewBox="0 0 100 30" width="70" height="20">
                                <path d="M 0 25 C 20 20, 40 5, 60 18 C 80 8, 90 2, 100 5" fill="none" stroke="#22c55e" strokeWidth="2" className="sparkline-path" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e' }}>+22%</span>
                          </div>

                          {/* Channel Item 2 */}
                          <div style={{ display: 'flex', alignItems: 'center', justifySpace: 'between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                            <div style={{ width: '90px' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Organic Web</div>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>44 leads</span>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
                              <svg viewBox="0 0 100 30" width="70" height="20">
                                <path d="M 0 20 C 15 15, 30 18, 45 10 C 60 12, 75 4, 100 2" fill="none" stroke="#22c55e" strokeWidth="2" className="sparkline-path" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e' }}>+12%</span>
                          </div>

                          {/* Channel Item 3 */}
                          <div style={{ display: 'flex', alignItems: 'center', justifySpace: 'between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                            <div style={{ width: '90px' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Facebook Ads</div>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>21 leads</span>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
                              <svg viewBox="0 0 100 30" width="70" height="20">
                                <path d="M 0 5 C 20 8, 40 22, 60 12 C 80 25, 90 28, 100 26" fill="none" stroke="#ef4444" strokeWidth="2" className="sparkline-path" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444' }}>-5%</span>
                          </div>

                          {/* Channel Item 4 */}
                          <div style={{ display: 'flex', alignItems: 'center', justifySpace: 'between' }}>
                            <div style={{ width: '90px' }}>
                              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Direct Referral</div>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>9 leads</span>
                            </div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 8px' }}>
                              <svg viewBox="0 0 100 30" width="70" height="20">
                                <path d="M 0 15 C 20 18, 40 10, 60 12 C 80 8, 90 14, 100 12" fill="none" stroke="#22c55e" strokeWidth="2" className="sparkline-path" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#22c55e' }}>+2%</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CRM WORKSPACE PANEL */}
                {currentView === 'crm' && (
                  <div className="view-transition-container" style={{ display: 'flex', gap: '1.25rem', height: '100%' }}>
                    
                    {/* Left Chat Window */}
                    <div style={{ flex: 1.3, background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafbfc' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} className="glow-dot-active" />
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>Live Session: Booking Agent</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Active</span>
                      </div>
                      
                      {/* Chat Messages */}
                      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
                        
                        {/* Msg 1 - Agent Initial */}
                        <div style={{ display: 'flex', gap: '8px', maxWidth: '80%' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,82,255,0.1)', color: '#0052FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Sparkles size={14} />
                          </div>
                          <div className="lp-mockup-chat-bubble lp-mockup-chat-ai" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                            Hello Marie! I'm your Realstate Booking assistant. I noticed you requested some visit info for downtown properties. How can I help you today?
                          </div>
                        </div>

                        {/* Msg 2 - User Reply */}
                        {showChatUserIndicator && (
                          <div style={{ alignSelf: 'flex-end', display: 'flex', gap: '4px', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '12px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'glowPulse 1s infinite' }} />
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'glowPulse 1s infinite 0.2s' }} />
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'glowPulse 1s infinite 0.4s' }} />
                          </div>
                        )}
                        {showChatUserBubble && (
                          <div className="lp-mockup-chat-bubble lp-mockup-chat-user" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', alignSelf: 'flex-end', background: '#0052FF', animation: 'fadeUp 0.3s ease-out' }}>
                            I need to schedule a property visit for this weekend.
                          </div>
                        )}

                        {/* Msg 3 - Agent Reply */}
                        {showChatAgentIndicator && (
                          <div style={{ display: 'flex', gap: '8px', maxWidth: '80%' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,82,255,0.1)', color: '#0052FF', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
                              <Sparkles size={14} />
                            </div>
                            <div style={{ display: 'flex', gap: '4px', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '12px' }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'glowPulse 1s infinite' }} />
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'glowPulse 1s infinite 0.2s' }} />
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: 'glowPulse 1s infinite 0.4s' }} />
                            </div>
                          </div>
                        )}
                        {showChatAgentBubble && (
                          <div style={{ display: 'flex', gap: '8px', maxWidth: '80%', animation: 'fadeUp 0.3s ease-out' }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,82,255,0.1)', color: '#0052FF', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
                              <Sparkles size={14} />
                            </div>
                            <div className="lp-mockup-chat-bubble lp-mockup-chat-ai" style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                              I found 3 matching properties in downtown. Scheduling for Saturday morning at 10:00 AM. I have synced your profile calendar.
                            </div>
                          </div>
                        )}

                      </div>
                    </div>

                    {/* Right Info Sidebar (Inspired by CRM Sidebar) */}
                    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="lp-analytics-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', gap: '0.85rem' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0052FF', color: 'white', display: 'flex', alignItems: 'center', justify: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                            MD
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>Marie Dubois</div>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Qualified Buyer</span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Purchase Budget</div>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginTop: '0.15rem' }}>$1.2M - $1.8M</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Target Area</div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} style={{ color: '#0052FF' }} /> Downtown Penthouse
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Engagement Score</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ flex: 1, height: 6, background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                              <div style={{ width: showChatUserBubble ? '96%' : '50%', height: '100%', background: '#0052FF', borderRadius: '99px', transition: 'width 1s ease' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{showChatUserBubble ? '96%' : '50%'}</span>
                          </div>
                        </div>

                        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '0.6rem 0.85rem', marginTop: 'auto' }}>
                          <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Booking Confirmed
                          </div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', marginTop: '0.15rem' }}>Saturday 10:00 AM</div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* 3. AGENT WORKFLOW PANEL */}
                {currentView === 'builder' && (
                  <div className="view-transition-container" style={{ display: 'flex', gap: '1.25rem', height: '100%' }}>
                    
                    {/* Execution Timeline Form */}
                    <div className="lp-analytics-card" style={{ flex: 1.3, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} style={{ color: '#0052FF' }} /> Autonomous Agent Execution
                      </div>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        
                        {/* Step 1 */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} /></div>
                            <div style={{ width: '2px', flex: 1, background: '#22c55e', margin: '4px 0' }} />
                          </div>
                          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Analyze Client Request</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Extracted intent: Schedule viewing. Preferences: Downtown, Budget &lt;$1.8M.</div>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} /></div>
                            <div style={{ width: '2px', flex: 1, background: '#22c55e', margin: '4px 0' }} />
                          </div>
                          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Query MLS Database</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Found 12 active listings. Filtered to 3 best matches based on criteria.</div>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: builderActiveSMS ? '#22c55e' : '#e2e8f0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease' }}>{builderActiveSMS && <Check size={10} />}</div>
                            <div style={{ width: '2px', flex: 1, background: builderActiveSMS ? '#22c55e' : '#e2e8f0', margin: '4px 0', transition: 'all 0.5s ease' }} />
                          </div>
                          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Coordinate Scheduling</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Checking agent calendar availability for this Saturday.</div>
                          </div>
                        </div>
                        
                        {/* Step 4 */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: builderSuccessConsole ? '#0052FF' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease' }}>{builderSuccessConsole && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Finalize & Communicate</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Sending confirmation SMS to Marie Dubois with property details.</div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Right Panel: Property Match */}
                    <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      
                      <div className="lp-analytics-card" style={{ flex: 1, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top Property Match</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                          <div style={{ height: '90px', background: '#cbd5e1', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600 }}>98% Match</div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                          </div>
                          <div style={{ padding: '0.75rem' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>The Pinnacle Penthouse</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                              <MapPin size={10} /> Downtown Core
                            </div>
                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, color: '#0052FF', fontSize: '0.9rem' }}>$1,450,000</span>
                              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>3 Beds | 2 Baths</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Console screen */}
                        <div style={{ marginTop: 'auto', background: '#0f172a', borderRadius: '10px', padding: '0.75rem', color: '#22c55e', fontFamily: 'SF Mono, monospace', fontSize: '0.7rem', minHeight: '80px', border: '1px solid #1e293b' }}>
                          <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>Agent System Log:</div>
                          {builderSuccessConsole ? (
                            <div style={{ animation: 'fadeUp 0.3s ease-out' }}>
                              <span style={{ color: '#38bdf8' }}>[info]</span> Tour scheduled for 10:00 AM<br />
                              <span style={{ color: '#22c55e' }}>[success]</span> SMS sent to client.
                            </div>
                          ) : (
                            <div style={{ color: '#f59e0b' }}>
                              <span>●</span> Processing calendar sync...
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
              
              {/* Question Search Bar (Inspired by Sierra Agent OS) */}
              <div className="lp-mockup-searchbar" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
                <Compass size={18} style={{ color: '#0052FF' }} />
                <div style={{ flex: 1, fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                  <span>{searchText}</span>
                  {!isManual && (
                    <span className="typing-cursor" style={{ marginLeft: 2, height: '1.2rem', display: 'inline-block' }}></span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Mic size={16} style={{ color: '#94a3b8' }} />
                  <button style={{ background: '#0052FF', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Ask <Send size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformPreviewMockup;
