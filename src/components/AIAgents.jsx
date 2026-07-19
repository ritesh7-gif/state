import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Search, Users, MapPin,
  DollarSign, Lightbulb, CheckCircle2, Zap, BarChart3,
  Globe, Shield, TrendingUp, ArrowRight, Clock, User, Building
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Agent Data ──────────────────────────────────────────────────── */
const AGENTS_DATA = [
  {
    id: 'super',
    title: 'Super Agent',
    tagline: 'Your AI command center.',
    description: 'Coordinates all agents, understands user intent, and delegates work efficiently.',
    icon: Users,
    color: '#0052FF',
    colorBg: 'rgba(0,82,255,0.15)',
    longDesc: 'The Super Agent is the orchestrator of your PropAgentOS. It understands complex requests from your sales managers and routes them to the specialized agents. It ensures a seamless workflow across leads, bookings, marketing, and finance.',
    stats: [
      { value: '100%', label: 'Intent Accuracy' },
      { value: '< 1s', label: 'Delegation Speed' }
    ],
    features: [
      { icon: Zap, text: 'Understands natural language commands' },
      { icon: CheckCircle2, text: 'Coordinates multiple agents for complex workflows' },
      { icon: BarChart3, text: 'Aggregates data for unified dashboards' },
      { icon: Globe, text: 'Enterprise-grade orchestration' },
    ],
    useCases: [
      'Sales Managers reviewing daily summaries',
      'Executing multi-step business actions',
      'Orchestrating cross-department workflows'
    ],
    chatSequence: [
      { role: 'user', text: 'Show today\'s sales summary and schedule a visit for Rahul tomorrow.' },
      { role: 'agent', text: 'You have 12 New Leads, 4 Site Visits, and 2 Bookings today. I will now ask the Site Visit Agent to schedule Rahul.' },
      { role: 'agent', text: 'The Site Visit Agent has confirmed Rahul\'s visit at Tower A and assigned a sales executive.' }
    ]
  },
  {
    id: 'lead',
    title: 'Lead & Follow-up Agent',
    tagline: 'Never drop a lead.',
    description: 'Manages leads, handles scoring, automates follow-up reminders, and updates the CRM.',
    icon: User,
    color: '#10b981',
    colorBg: 'rgba(16,185,129,0.15)',
    longDesc: 'The Lead & Follow-up Agent ensures your pipeline is always moving. It captures leads from all channels, scores them based on engagement, and sends automated follow-ups to keep prospects warm until a sales executive takes over.',
    stats: [
      { value: '3x', label: 'Conversion Rate' },
      { value: '0', label: 'Dropped Leads' }
    ],
    features: [
      { icon: CheckCircle2, text: 'Automated lead capture & scoring' },
      { icon: Clock, text: 'Smart follow-up reminders' },
      { icon: Zap, text: 'Automated customer communication' },
      { icon: Users, text: 'Seamless CRM status updates' },
    ],
    useCases: [
      'Nurturing cold leads automatically',
      'Prioritizing high-intent prospects',
      'Sending personalized follow-up emails'
    ],
    chatSequence: [
      { role: 'user', text: 'Are there any high-intent leads that need follow-up today?' },
      { role: 'agent', text: 'Yes, 3 leads have viewed the Sky Heights brochure twice today. I have drafted follow-up emails for them.' },
      { role: 'user', text: 'Send the emails.' },
      { role: 'agent', text: 'Emails sent. I\'ve updated their CRM status and set a reminder to call them tomorrow.' }
    ]
  },
  {
    id: 'booking',
    title: 'Booking Agent',
    tagline: 'Frictionless unit reservations.',
    description: 'Books units, reserves inventory, generates booking confirmations, and updates availability.',
    icon: Calendar,
    color: '#3b82f6',
    colorBg: 'rgba(59,130,246,0.15)',
    longDesc: 'The Booking Agent takes the hassle out of securing a property. It instantly reserves inventory upon request, generates compliant booking confirmations, and immediately updates availability across all sales channels to prevent double-booking.',
    stats: [
      { value: '100%', label: 'Availability Sync' },
      { value: 'Instant', label: 'Confirmations' }
    ],
    features: [
      { icon: CheckCircle2, text: 'Instant unit reservation' },
      { icon: Globe, text: 'Live inventory availability updates' },
      { icon: Shield, text: 'Automated booking confirmations' },
      { icon: Zap, text: 'Prevents double-bookings globally' },
    ],
    useCases: [
      'Securing units during high-demand launches',
      'Generating instant booking receipts',
      'Real-time inventory management'
    ],
    chatSequence: [
      { role: 'user', text: 'Book Flat A-1203 for Marie Dubois.' },
      { role: 'agent', text: 'Reserving Flat A-1203. Generating the booking confirmation now.' },
      { role: 'agent', text: 'Booking confirmed. Flat A-1203 has been marked as "Sold" in the inventory. Confirmation sent to Marie.' }
    ]
  },
  {
    id: 'sitevisit',
    title: 'Site Visit Agent',
    tagline: 'Flawless field coordination.',
    description: 'Schedules visits, handles rescheduling, assigns sales executives, and sends reminders.',
    icon: MapPin,
    color: '#f43f5e',
    colorBg: 'rgba(244,63,94,0.15)',
    longDesc: 'The Site Visit Agent coordinates the physical customer journey. It schedules and reschedules site visits, automatically assigns the most appropriate sales executive based on availability, and sends timely reminders to both the prospect and the staff.',
    stats: [
      { value: '-40%', label: 'No-Show Rate' },
      { value: '100%', label: 'Calendar Sync' }
    ],
    features: [
      { icon: Clock, text: 'Automated scheduling and rescheduling' },
      { icon: Users, text: 'Smart sales executive assignment' },
      { icon: Zap, text: 'SMS and email reminders' },
      { icon: CheckCircle2, text: 'Real-time calendar syncing' },
    ],
    useCases: [
      'Managing high volumes of weekend visits',
      'Handling last-minute rescheduling',
      'Optimizing sales executive schedules'
    ],
    chatSequence: [
      { role: 'user', text: 'Schedule a site visit for John Smith this Saturday.' },
      { role: 'agent', text: 'Scheduling John Smith for Saturday at 11 AM at Tower B.' },
      { role: 'agent', text: 'Visit scheduled. Sarah has been assigned as the sales executive. Reminders have been sent to both.' }
    ]
  },
  {
    id: 'search',
    title: 'Property Search Agent',
    tagline: 'Instant inventory matchmaking.',
    description: 'Searches inventory, recommends units, compares properties, and filters by budget.',
    icon: Search,
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.15)',
    longDesc: 'The Property Search Agent acts as your internal inventory expert. It instantly filters through thousands of units to find exact matches for client requirements, compares properties, and recommends the best options to your sales team.',
    stats: [
      { value: '1000s', label: 'Units Searched/sec' },
      { value: '99%', label: 'Match Accuracy' }
    ],
    features: [
      { icon: Search, text: 'Advanced inventory filtering' },
      { icon: CheckCircle2, text: 'Smart property recommendations' },
      { icon: BarChart3, text: 'Side-by-side property comparisons' },
      { icon: Zap, text: 'Budget and preference matching' },
    ],
    useCases: [
      'Finding available units matching tight client budgets',
      'Comparing towers for investors',
      'Recommending alternatives when a unit is sold'
    ],
    chatSequence: [
      { role: 'user', text: 'Find available 3 BHK units below ₹1.5 Cr in Tower C.' },
      { role: 'agent', text: 'I found 4 available 3 BHK units in Tower C under ₹1.5 Cr.' },
      { role: 'user', text: 'Compare Unit 401 and 502.' },
      { role: 'agent', text: 'Unit 401 is ₹1.45 Cr with a park view. Unit 502 is ₹1.48 Cr with a city view. Sending comparison sheet.' }
    ]
  },
  {
    id: 'project',
    title: 'Project Info Agent',
    tagline: 'All project data, instantly accessible.',
    description: 'Provides project details, amenities, pricing, construction progress, and floor plans.',
    icon: CheckCircle2,
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.15)',
    longDesc: 'The Project Information Agent is a walking encyclopedia of your developments. It instantly serves up construction updates, floor plans, detailed amenity lists, and pricing sheets so your sales team can answer any client question immediately.',
    stats: [
      { value: '0s', label: 'Data Retrieval Time' },
      { value: '100%', label: 'Up-to-date Specs' }
    ],
    features: [
      { icon: CheckCircle2, text: 'Instant access to project details' },
      { icon: Clock, text: 'Live construction progress updates' },
      { icon: CheckCircle2, text: 'Floor plan and pricing retrieval' },
      { icon: Globe, text: 'Amenity and neighborhood data' },
    ],
    useCases: [
      'Providing construction updates to buyers',
      'Sending floor plans instantly during a call',
      'Checking current pricing sheets'
    ],
    chatSequence: [
      { role: 'user', text: 'What is the construction progress for Sky Heights?' },
      { role: 'agent', text: 'Sky Heights is currently at 65% completion. The structure for Tower A is complete, and interior work has begun.' },
      { role: 'user', text: 'Send the 2BHK floor plans to my email.' },
      { role: 'agent', text: 'Floor plans sent to your email.' }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Agent',
    tagline: 'Your automated growth engine.',
    description: 'Handles Instagram content, Facebook campaigns, Google Ads, SEO, and image generation.',
    icon: Globe,
    color: '#ec4899',
    colorBg: 'rgba(236,72,153,0.15)',
    longDesc: 'The Marketing Agent acts as a full-stack digital marketing team. It drafts Instagram copy, creates campaign strategies for Facebook and Google Ads, generates promotional images, and manages the publishing workflow to keep your projects highly visible.',
    stats: [
      { value: '10x', label: 'Content Output' },
      { value: '+45%', label: 'Ad Engagement' }
    ],
    features: [
      { icon: Zap, text: 'Automated social media content generation' },
      { icon: BarChart3, text: 'Campaign planning and ad copy' },
      { icon: Users, text: 'Target audience optimization' },
      { icon: CheckCircle2, text: 'Image generation and SEO tracking' },
    ],
    useCases: [
      'Launching a new project on social media',
      'Generating weekly Instagram posts',
      'Drafting Google Ads copy for available units'
    ],
    chatSequence: [
      { role: 'user', text: 'Generate an Instagram campaign for the new Sky Heights launch.' },
      { role: 'agent', text: 'I\'ve created a 5-day campaign plan with images, captions, and hashtags focusing on luxury amenities.' },
      { role: 'user', text: 'Approve and schedule it.' },
      { role: 'agent', text: 'Campaign approved. The first post will go live tomorrow at 10 AM.' }
    ]
  },
  {
    id: 'finance',
    title: 'Finance Agent',
    tagline: 'Real-time financial visibility.',
    description: 'Tracks payments, manages revenue, monitors pending dues, and generates financial reports.',
    icon: DollarSign,
    color: '#d97706',
    colorBg: 'rgba(217,119,6,0.15)',
    longDesc: 'The Finance Agent ensures your cash flow is always tracked and transparent. It monitors installment schedules, flags pending customer payments, tracks overall revenue, and generates comprehensive financial reports for the management team.',
    stats: [
      { value: '100%', label: 'Payment Tracking' },
      { value: 'Instant', label: 'Financial Reports' }
    ],
    features: [
      { icon: DollarSign, text: 'Real-time payment and revenue tracking' },
      { icon: Clock, text: 'Automated pending dues monitoring' },
      { icon: BarChart3, text: 'Installment schedule management' },
      { icon: CheckCircle2, text: 'Instant financial reporting' },
    ],
    useCases: [
      'Checking monthly revenue summaries',
      'Tracking delayed customer installments',
      'Generating payment schedules for new bookings'
    ],
    chatSequence: [
      { role: 'user', text: 'Show pending customer payments for this week.' },
      { role: 'agent', text: 'There are 5 pending payments due this week totaling $120k.' },
      { role: 'user', text: 'Send payment reminders to these clients.' },
      { role: 'agent', text: 'Automated payment reminders have been sent via email and SMS.' }
    ]
  },
  {
    id: 'crm',
    title: 'CRM Agent',
    tagline: 'The ultimate customer database.',
    description: 'Maintains customer databases, customer history, communication logs, and profile management.',
    icon: Users,
    color: '#6366f1',
    colorBg: 'rgba(99,102,241,0.15)',
    longDesc: 'The CRM Agent is the central nervous system of your customer relationships. It logs every email, call, and site visit, keeping customer profiles rich and updated so your sales team always has the full context before reaching out.',
    stats: [
      { value: '360°', label: 'Customer View' },
      { value: '100%', label: 'Interaction Logging' }
    ],
    features: [
      { icon: Users, text: 'Comprehensive customer profile management' },
      { icon: Clock, text: 'Detailed interaction and communication logs' },
      { icon: CheckCircle2, text: 'Automated data entry and enrichment' },
      { icon: Shield, text: 'Secure customer database maintenance' },
    ],
    useCases: [
      'Reviewing a customer\'s interaction history before a call',
      'Automatically logging email threads to a profile',
      'Updating customer preferences based on chat logs'
    ],
    chatSequence: [
      { role: 'user', text: 'Pull up the history for client Alex Johnson.' },
      { role: 'agent', text: 'Alex Johnson: Interested in 3BHK. Last contacted 2 days ago via email. Had a site visit last month.' },
      { role: 'user', text: 'Add a note that he prefers corner units.' },
      { role: 'agent', text: 'Note added to Alex Johnson\'s CRM profile.' }
    ]
  }
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

  useEffect(() => {
    const list = document.getElementById('agents-tab-list');
    const activeEl = document.getElementById(`agent-tab-${activeIndex}`);
    if (list && activeEl) {
      // Calculate offset to center the active element
      const offset = activeEl.offsetTop - (list.clientHeight / 2) + (activeEl.clientHeight / 2);
      list.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [activeIndex]);

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
          <div className="w-full lg:w-[42%] relative z-10 h-[500px] lg:h-[760px]">
            <div 
              id="agents-tab-list"
              className="absolute inset-0 overflow-y-auto flex flex-col gap-3 py-16 px-1"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
              }}
            >
              {AGENTS_DATA.map((agent, index) => {
                const isActive = activeIndex === index;
                const Icon = agent.icon;
                return (
                  <button
                    key={agent.id}
                    id={`agent-tab-${index}`}
                    onClick={() => setActiveIndex(index)}
                    className={`text-left p-5 md:p-6 rounded-[20px] transition-all duration-300 relative overflow-hidden group flex-shrink-0 ${
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
