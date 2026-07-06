import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Search, Users, MapPin,
  DollarSign, Lightbulb, CheckCircle2, Zap, BarChart3,
  Globe, Shield, TrendingUp, ArrowRight, Clock
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
    colorBg: 'rgba(59,130,246,0.15)',
    longDesc: 'The Booking Agent takes full ownership of your scheduling pipeline. It parses inbound client requests, checks agent availability in real-time, blocks calendar slots across Google Calendar, Outlook and your CRM, then sends branded confirmation messages — all without human intervention.',
    stats: [
      { value: '98%', label: 'Booking Accuracy' },
      { value: '< 2s', label: 'Response Time' }
    ],
    features: [
      { icon: Clock, text: '24/7 automated scheduling with confirmations' },
      { icon: Globe, text: 'Syncs across Google, Outlook & iCal' },
      { icon: Shield, text: 'Smart conflict detection — zero double-bookings' },
      { icon: Zap, text: 'Auto-reschedules cancellations and notifies parties' },
    ],
    useCases: [
      'Agencies managing 50+ viewings/week',
      'Property managers coordinating tenants',
      'Developers running show-home open days',
    ],
    chatSequence: [
      { role: 'user', text: 'I have a client who wants to view 123 Maple St tomorrow.' },
      { role: 'agent', text: 'I checked your calendar. You have openings at 10 AM, 2 PM, and 4 PM. I also verified the seller is available.' },
      { role: 'user', text: 'Book them for 2 PM.' },
      { role: 'agent', text: 'Done! I sent calendar invites to you, the client, and the seller. I also updated the CRM status.' }
    ],
  },
  {
    id: 'search',
    title: 'Property Search Agent',
    tagline: 'Natural language. Instant results.',
    description: 'Understands natural language queries to scour property listings and retrieve matches immediately.',
    icon: Search,
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.15)',
    longDesc: 'Forget keyword searches. Clients simply describe what they want — "3-bedroom with a garden near good schools under $500k" — and the Search Agent maps that to hundreds of MLS criteria in milliseconds, returning ranked results with neighbourhood scoring.',
    stats: [
      { value: '10M+', label: 'Listings Indexed' },
      { value: '< 500ms', label: 'Query Time' }
    ],
    features: [
      { icon: Zap, text: 'NLP intent parsing across 40+ search parameters' },
      { icon: Globe, text: 'Multi-portal aggregation (Zillow, Rightmove, MLS)' },
      { icon: BarChart3, text: 'AI-ranked results by conversion likelihood' },
      { icon: TrendingUp, text: 'Learns from client feedback to improve matches' },
    ],
    useCases: [
      'Client-facing portals wanting conversational UX',
      'Agents qualifying buyer budgets & preferences',
      'Relocation services handling urgent searches',
    ],
    chatSequence: [
      { role: 'user', text: 'I need a 3BHK house under $1.5M, close to a park and highly-rated elementary schools.' },
      { role: 'agent', text: 'I found 4 properties matching your exact criteria across 3 MLS portals.' },
      { role: 'user', text: 'Can you show me the one with the best commute to downtown?' },
      { role: 'agent', text: 'Certainly. 450 Oak Ave is a 15-minute commute to downtown. Want me to send the brochure?' }
    ],
  },
  {
    id: 'crm',
    title: 'CRM Agent',
    tagline: 'Every lead. Every interaction. Logged.',
    description: 'Maintains customer profiles, logs client interactions, and suggests follow-up actions automatically.',
    icon: Users,
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.15)',
    longDesc: 'The CRM Agent works silently in the background — capturing every email, call transcript, and viewing note, enriching lead profiles with social data, scoring their purchase intent, and surfacing "next best action" prompts to your agents at exactly the right moment.',
    stats: [
      { value: '100%', label: 'Interaction Capture' },
      { value: '2.4×', label: 'Lead Conversion' }
    ],
    features: [
      { icon: Shield, text: 'Automatic logging from email, calls & chat' },
      { icon: TrendingUp, text: 'AI lead scoring with purchase intent signals' },
      { icon: Zap, text: 'Next-best-action recommendations for agents' },
      { icon: Globe, text: 'Native integrations with Salesforce, HubSpot & Zoho' },
    ],
    useCases: [
      'Large brokerages tracking hundreds of leads',
      'Sales managers needing pipeline visibility',
      'Agents following up across long nurture cycles',
    ],
    chatSequence: [
      { role: 'user', text: 'I just finished a call with Sarah Jenkins.' },
      { role: 'agent', text: 'I have transcribed the call and extracted key notes. She is interested in a quick close.' },
      { role: 'user', text: 'Log it and remind me to follow up next Tuesday.' },
      { role: 'agent', text: 'Call logged. Lead score updated to "Hot". I have set a follow-up reminder for next Tuesday at 9 AM.' }
    ],
  },
  {
    id: 'visit',
    title: 'Site Visit Agent',
    tagline: 'On-site intelligence. In your pocket.',
    description: 'Provides on-demand property details and localized information to clients during their visits.',
    icon: MapPin,
    color: '#f43f5e',
    colorBg: 'rgba(244,63,94,0.15)',
    longDesc: 'When a client steps onto a property, the Site Visit Agent activates — surfacing floor plans, tax bands, EPC ratings, flood risk data, school tables and commute times. It captures visit notes and automatically flags properties marked "high interest" back to the CRM.',
    stats: [
      { value: '200+', label: 'Data Points Per Property' },
      { value: '30%', label: 'Faster Decisions' }
    ],
    features: [
      { icon: MapPin, text: 'GPS-triggered property data card at arrival' },
      { icon: Globe, text: 'Walkability, flood risk, schools & transport layers' },
      { icon: Zap, text: 'Voice capture for visit notes — auto-transcribed' },
      { icon: Shield, text: 'Flags interest level back to CRM in real-time' },
    ],
    useCases: [
      'Field agents managing 8+ viewings a day',
      'International buyers doing virtual walk-throughs',
      'New-build sales suites with self-guided tours',
    ],
    chatSequence: [
      { role: 'user', text: 'I am at the 789 Pine Rd property with a client right now.' },
      { role: 'agent', text: 'Welcome to 789 Pine Rd. Here is the floor plan and recent tax history. Would you like me to pull up neighborhood comps?' },
      { role: 'user', text: 'Yes, what are the local school ratings?' },
      { role: 'agent', text: 'The local district is rated 9/10. Lincoln Elementary is just 0.4 miles away.' }
    ],
  },
  {
    id: 'finance',
    title: 'Financial Agent',
    tagline: 'Numbers, instant. Confidence, immediate.',
    description: 'Calculates mortgages, yield rates, payment plans, and ROI metrics instantly based on live data.',
    icon: DollarSign,
    color: '#d97706',
    colorBg: 'rgba(217,119,6,0.15)',
    longDesc: 'Stop losing deals at the financial stage. The Financial Agent calculates personalised mortgage scenarios with live rate data, models rental yield and cash-on-cash ROI for investors, estimates stamp duty, and exports a clean financial summary PDF for each client.',
    stats: [
      { value: '15+', label: 'Mortgage Providers' },
      { value: '< 1s', label: 'Calculation Time' }
    ],
    features: [
      { icon: BarChart3, text: 'Live mortgage rate comparisons across 15+ lenders' },
      { icon: TrendingUp, text: 'Buy-to-let yield, ROI and cashflow modelling' },
      { icon: DollarSign, text: 'Stamp duty, LTT and conveyancing cost estimates' },
      { icon: Zap, text: 'Generates branded financial summary PDF in seconds' },
    ],
    useCases: [
      'Residential agents converting first-time buyers',
      'Investment advisors pitching portfolio acquisitions',
      'Mortgage brokers qualifying clients instantly',
    ],
    chatSequence: [
      { role: 'user', text: 'The client wants to know the estimated monthly payments for 101 Lakeview Dr with 20% down.' },
      { role: 'agent', text: 'Based on a $800k purchase price with 20% down, the estimated monthly payment is $3,450 at current rates (6.2%).' },
      { role: 'user', text: 'Can you generate a branded PDF summary for them?' },
      { role: 'agent', text: 'Summary generated. I have emailed the PDF to the client and logged the activity in your CRM.' }
    ],
  },
  {
    id: 'recommend',
    title: 'Recommendation Agent',
    tagline: 'The right property. Every time.',
    description: 'Understands your client preferences and matches them to high-conversion listings dynamically.',
    icon: Lightbulb,
    color: '#ec4899',
    colorBg: 'rgba(236,72,153,0.15)',
    longDesc: "Our recommendation engine learns from every client interaction — saved listings, rejected properties, time-on-page — building a rich preference model that grows smarter with each signal. The result: listings that feel personally curated rather than algorithmically sorted.",
    stats: [
      { value: '3×', label: 'Higher Offer Rate' },
      { value: '96%', label: 'Match Accuracy' }
    ],
    features: [
      { icon: Lightbulb, text: 'Collaborative filtering tuned on 2M+ journeys' },
      { icon: TrendingUp, text: 'Learns from rejections as powerfully as from saves' },
      { icon: BarChart3, text: 'Weekly "Top Picks" digest sent directly to clients' },
      { icon: Zap, text: 'Price-drop alerts for wishlisted and near-matches' },
    ],
    useCases: [
      'Portals wanting Netflix-style personalised discovery',
      'Agents managing 50+ active buyers simultaneously',
      'Off-plan developers matching units to investors',
    ],
    chatSequence: [
      { role: 'user', text: 'Mark Johnson just rejected three modern condos I sent him.' },
      { role: 'agent', text: 'Noted. He seems to prefer historical or craftsman-style homes based on his recent saves.' },
      { role: 'user', text: 'Find me two alternative properties that fit that profile.' },
      { role: 'agent', text: 'Found two craftsman homes in his price range. I have drafted an email with the listings for your review.' }
    ],
  },
];

const AgentChatSimulation = ({ activeAgent, onComplete }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    
    const runSequence = async () => {
      setVisibleMessages([]);
      setIsTyping(true);
      
      for (let i = 0; i < activeAgent.chatSequence.length; i++) {
        if (!isMounted) return;
        const msg = activeAgent.chatSequence[i];
        
        if (msg.role === 'agent') {
          setIsTyping(true);
          await new Promise(r => { timeoutId = setTimeout(r, 1200); });
        } else {
          setIsTyping(false);
          await new Promise(r => { timeoutId = setTimeout(r, 600); });
        }
        
        if (!isMounted) return;
        setIsTyping(false);
        setVisibleMessages(prev => [...prev, msg]);
        
        await new Promise(r => { timeoutId = setTimeout(r, 800); });
      }
      
      // Wait a few seconds for the user to read the final message before switching
      if (isMounted && onComplete) {
        await new Promise(r => { timeoutId = setTimeout(r, 3000); });
        if (isMounted) onComplete();
      }
    };
    
    runSequence();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [activeAgent.id, activeAgent.chatSequence]);

  return (
    <div className="flex-grow flex flex-col justify-end gap-4 overflow-y-auto mb-8 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <AnimatePresence>
        {visibleMessages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-tr-sm' 
                  : 'text-slate-800 rounded-tl-sm border'
              }`}
              style={msg.role === 'agent' ? { backgroundColor: activeAgent.colorBg, borderColor: `${activeAgent.color}40` } : {}}
            >
              {msg.role === 'agent' && (
                <div className="flex items-center gap-2 mb-2">
                  <activeAgent.icon size={14} style={{ color: activeAgent.color }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeAgent.color }}>{activeAgent.title}</span>
                </div>
              )}
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            key="typing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full justify-start mt-2"
          >
            <div 
              className="max-w-[85%] rounded-2xl p-4 shadow-sm text-slate-800 rounded-tl-sm border flex items-center gap-2"
              style={{ backgroundColor: activeAgent.colorBg, borderColor: `${activeAgent.color}40` }}
            >
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: activeAgent.color }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: activeAgent.color, animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: activeAgent.color, animationDelay: '0.4s' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AIAgents = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAgent = AGENTS_DATA[activeIndex];

  const handleChatComplete = () => {
    setActiveIndex((prev) => (prev + 1) % AGENTS_DATA.length);
  };

  return (
    <section id="agents" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1300px]">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-24 md:mb-32">
          <div className="text-[#006642] font-bold text-sm tracking-widest uppercase mb-4">
            Intelligent Workforce
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-6 tracking-tight">
            Meet Your AI Sales Team
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Deploy specialized AI agents that handle every stage of the real estate lifecycle, working seamlessly with your human workforce.
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left: Tab List */}
          <div className="w-full lg:w-[42%] flex flex-col gap-3 relative z-10">
            {AGENTS_DATA.map((agent, index) => {
              const isActive = activeIndex === index;
              const Icon = agent.icon;
              return (
                <button
                  key={agent.id}
                  onClick={() => setActiveIndex(index)}
                  className={`text-left p-5 md:p-6 rounded-[20px] transition-all duration-300 relative overflow-hidden group ${
                    isActive 
                      ? 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] scale-[1.02] border border-slate-100 z-10' 
                      : 'hover:bg-slate-50 border border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-agent-bg"
                      className="absolute inset-0 border-l-4"
                      style={{ borderLeftColor: agent.color, backgroundColor: 'white' }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-start gap-4">
                    <div 
                      className={`p-3.5 rounded-xl transition-colors duration-300 ${
                        isActive ? '' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                      style={isActive ? { backgroundColor: agent.color, color: 'white', boxShadow: `0 10px 20px ${agent.color}40` } : {}}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-1 transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {agent.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed hidden sm:block">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Details View */}
          <div className="w-full lg:w-[58%] lg:sticky lg:top-28 h-auto lg:h-[760px] self-start relative z-10">
            {/* Ambient Background Gradient Behind Card */}
            <div 
              className="absolute -inset-2 opacity-20 blur-[24px] rounded-[32px] transition-colors duration-700 -z-10"
              style={{ backgroundColor: activeAgent.color }}
            />
            
            <div
              key={activeAgent.id}
              className="w-full h-full rounded-[32px] overflow-hidden relative flex flex-col shadow-[0_20px_50px_rgb(0,0,0,0.08)] bg-white border border-slate-100"
            >
                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full p-6 md:p-8 text-slate-900">
                  
                  {/* Chat Header */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="p-3 rounded-xl border border-slate-100 shadow-sm" style={{ backgroundColor: activeAgent.colorBg }}>
                      <activeAgent.icon size={24} style={{ color: activeAgent.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        {activeAgent.title}
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">{activeAgent.tagline}</p>
                    </div>
                  </div>

                  {/* Interactive Chat Simulation */}
                  <AgentChatSimulation activeAgent={activeAgent} onComplete={handleChatComplete} />

                  {/* Mock Chat Input Footer */}
                  <div className="pt-4 mt-2 border-t border-slate-100 relative z-20">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-5 py-3 shadow-inner">
                      <div className="flex-grow text-[15px] text-slate-400 font-medium tracking-wide">
                        Message {activeAgent.title.split(' ')[0]}...
                      </div>
                      <Link 
                        to="/login"
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md hover:shadow-lg" 
                        style={{ backgroundColor: activeAgent.color }}
                      >
                        <ArrowRight size={18} strokeWidth={3} className="text-white" />
                      </Link>
                    </div>
                    <div className="text-center mt-3">
                      <Link 
                        to="/login" 
                        className="inline-flex items-center justify-center px-4 py-2 mt-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-bold rounded-full transition-colors shadow-sm"
                      >
                        Try this Agent <ArrowRight size={14} className="ml-1.5" />
                      </Link>
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

export default AIAgents;
