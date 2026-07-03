import React, { useState, useEffect } from 'react';
import { Check, X, User, Settings, Database, Sliders } from 'lucide-react';
import Sidebar, { PROVISIONAL_AGENTS } from '../components/workspace/Sidebar';
import ConversationPane from '../components/workspace/ConversationPane';
import DashboardOverlay from '../components/workspace/DashboardOverlay';
import PropertyDetailsModal from '../components/workspace/PropertyDetailsModal';
import SettingsView from '../components/workspace/SettingsView';
import '../styles/workspace.css';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// ---- Seed Data ----
const SEED_PROPERTIES = [
  { unit: 'A-1203', type: '2', city: 'Pune',   project: 'Blue Ridge Hinjewadi',         price: '₹75,00,000',   status: 'Available' },
  { unit: 'B-804',  type: '3', city: 'Pune',   project: 'Amanora Park Town',            price: '₹1,20,00,000', status: 'Available' },
  { unit: 'C-502',  type: '1', city: 'Pune',   project: 'Godrej Infinity Keshavnagar',  price: '₹45,00,000',   status: 'Available' },
  { unit: 'D-101',  type: '2', city: 'Mumbai', project: 'Lodha Crown Majiwada',         price: '₹95,00,000',   status: 'Available' },
  { unit: 'E-204',  type: '3', city: 'Mumbai', project: 'Hiranandani Gardens Powai',    price: '₹2,40,00,000', status: 'Available' },
];

const SEED_BOOKINGS = [
  { id: 'BK-7892', customerName: 'Priya Sharma', unit: 'B-804', amount: '₹5,00,000', status: 'Confirmed', timestamp: 'Jun 19, 2026' },
  { id: 'BK-5612', customerName: 'Sanjay Mehta', unit: 'C-502', amount: '₹3,00,000', status: 'Pending',   timestamp: 'Jun 21, 2026' },
];

const SEED_CUSTOMERS = [
  { name: 'Priya Sharma', email: 'priya.sharma@example.com', phone: '9823456789', status: 'Active', assignedAgent: 'Booking Agent', dateAdded: 'Jun 18, 2026' },
  { name: 'Amit Patel', email: 'amit.patel@example.com', phone: '9123456780', status: 'Contacted', assignedAgent: 'Lead Agent', dateAdded: 'Jun 19, 2026' },
  { name: 'Sanjay Mehta', email: 'sanjay.mehta@example.com', phone: '9567890123', status: 'Active', assignedAgent: 'Booking Agent', dateAdded: 'Jun 20, 2026' }
];

const SEED_CONVERSATIONS = [
  {
    id: 'h1',
    title: 'Pune Property Search',
    pinned: false,
    date: 'Today',
    messages: [
      { id: 'msg-seed-1-1', sender: 'user', text: 'Search properties in Pune' },
      {
        id: 'msg-seed-1-2',
        sender: 'ai',
        text: 'Here are the available properties in Pune. Let me know if you would like details on any of these.',
        type: 'properties',
        payload: [
          { unit: 'A-1203', type: '2', city: 'Pune',   project: 'Blue Ridge Hinjewadi',         price: '₹75,00,000',   status: 'Available' },
          { unit: 'B-804',  type: '3', city: 'Pune',   project: 'Amanora Park Town',            price: '₹1,20,00,000', status: 'Available' },
          { unit: 'C-502',  type: '1', city: 'Pune',   project: 'Godrej Infinity Keshavnagar',  price: '₹45,00,000',   status: 'Available' },
        ]
      }
    ],
    customerContext: { name: '', phone: '', email: '' },
    propertyContext: { project: '', unit: '', price: '' },
    bookingContext: { status: '', amount: '' },
    conversationStage: 'PROPERTY_SELECTION',
    activeAgentStep: 1
  },
  {
    id: 'h2',
    title: 'Schedule site visit',
    pinned: false,
    date: 'Yesterday',
    messages: [
      { id: 'msg-seed-2-1', sender: 'user', text: 'Schedule a site visit' },
      { id: 'msg-seed-2-2', sender: 'ai', text: 'Which property would you like to visit, and at what date and time works best for you?' }
    ],
    customerContext: { name: '', phone: '', email: '' },
    propertyContext: { project: '', unit: '', price: '' },
    bookingContext: { status: '', amount: '' },
    conversationStage: 'SITE_VISIT',
    activeAgentStep: 1
  },
  {
    id: 'h3',
    title: 'Customer details Ritesh',
    pinned: false,
    date: 'Previous 7 Days',
    messages: [
      { id: 'msg-seed-3-1', sender: 'user', text: 'I want to book unit A-1203 for customer Ritesh' },
      {
        id: 'msg-seed-3-2',
        sender: 'ai',
        text: 'I have selected unit A-1203. Please fill in the customer details below to proceed with the booking.',
        type: 'customer_form'
      }
    ],
    customerContext: { name: 'Ritesh', phone: '', email: '' },
    propertyContext: { unit: 'A-1203', project: 'Blue Ridge Hinjewadi', price: '₹75,00,000' },
    bookingContext: { status: '', amount: '' },
    conversationStage: 'CUSTOMER_INFORMATION',
    activeAgentStep: 2
  }
];

const WorkspacePage = () => {
  const [currentView,       setView]             = useState('chat');
  const [backendStatus,     setBackendStatus]    = useState('connected');
  const [sidebarExpanded,   setSidebarExpanded]  = useState(true);
  const [detailsProperty,   setDetailsProperty]  = useState(null);
  const [activeAgentId,     setActiveAgentId]    = useState('a0');

  // Settings States
  const [profileName, setProfileName] = useState(() => localStorage.getItem('ew_setting_profile_name') || 'Jane Doe');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('ew_setting_profile_email') || 'jane.doe@realstate.ai');
  const [agencyName, setAgencyName] = useState(() => localStorage.getItem('ew_setting_agency_name') || 'RealState Enterprise Group');
  const [assistantLanguage, setAssistantLanguage] = useState(() => localStorage.getItem('ew_setting_assistant_language') || 'en');
  const [responseLength, setResponseLength] = useState(() => localStorage.getItem('ew_setting_response_length') || 'concise');
  const [dictationAutoSubmit, setDictationAutoSubmit] = useState(() => localStorage.getItem('ew_setting_auto_submit') === 'true');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('ew_setting_theme_mode') || 'dark');

  const handleSaveSettings = (key, val, setter) => {
    setter(val);
    localStorage.setItem(key, String(val));
  };

  // CRM
  const [properties, setProperties] = useState(SEED_PROPERTIES);
  const [customers,  setCustomers]   = useState(SEED_CUSTOMERS);
  const [bookings,   setBookings]    = useState(SEED_BOOKINGS);
  const [siteVisits, setSiteVisits]  = useState([]);
  const [followUps,  setFollowUps]   = useState([]);

  // Conversations & History
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('ew_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const unique = [];
          const seen = new Set();
          parsed.forEach(c => {
            if (c && c.id && !seen.has(c.id)) {
              seen.add(c.id);
              if (c.messages) {
                c.messages = c.messages.filter(m => !m.isThinking);
              }
              unique.push(c);
            }
          });
          return unique;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return SEED_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    const saved = localStorage.getItem('ew_active_conversation_id');
    if (saved && saved !== 'undefined') return saved;
    return SEED_CONVERSATIONS[0].id;
  });

  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const [messages, setMessages] = useState(() => activeConversation?.messages || []);
  const [customerContext, setCustomerContext] = useState(() => activeConversation?.customerContext || { name: '', phone: '', email: '' });
  const [propertyContext, setPropertyContext] = useState(() => activeConversation?.propertyContext || { project: '', unit: '', price: '' });
  const [bookingContext, setBookingContext] = useState(() => activeConversation?.bookingContext || { status: '', amount: '' });
  const [conversationStage, setConversationStage] = useState(() => activeConversation?.conversationStage || 'GREETING');
  const [activeAgentStep, setActiveAgentStep] = useState(() => activeConversation?.activeAgentStep || 1);
  const [input,    setInput]    = useState('');

  // ---- Synchronize local state when activeConversationId changes ----
  useEffect(() => {
    const active = conversations.find(c => c.id === activeConversationId);
    if (active) {
      setMessages(active.messages || []);
      setCustomerContext(active.customerContext || { name: '', phone: '', email: '' });
      setPropertyContext(active.propertyContext || { project: '', unit: '', price: '' });
      setBookingContext(active.bookingContext || { status: '', amount: '' });
      setConversationStage(active.conversationStage || 'GREETING');
      setActiveAgentStep(active.activeAgentStep || 1);
    }
  }, [activeConversationId]);

  // ---- Save current active state back to conversations list ----
  useEffect(() => {
    setConversations(prev => {
      const idx = prev.findIndex(c => c.id === activeConversationId);
      if (idx !== -1) {
        const active = prev[idx];
        if (
          active.messages !== messages ||
          active.customerContext !== customerContext ||
          active.propertyContext !== propertyContext ||
          active.bookingContext !== bookingContext ||
          active.conversationStage !== conversationStage ||
          active.activeAgentStep !== activeAgentStep
        ) {
          const next = [...prev];
          next[idx] = {
            ...active,
            messages,
            customerContext,
            propertyContext,
            bookingContext,
            conversationStage,
            activeAgentStep
          };
          return next;
        }
      }
      return prev;
    });
  }, [messages, customerContext, propertyContext, bookingContext, conversationStage, activeAgentStep, activeConversationId]);

  // ---- Persist to localStorage ----
  useEffect(() => {
    localStorage.setItem('ew_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ew_active_conversation_id', activeConversationId);
  }, [activeConversationId]);

  // ---- Backend health check ----
  useEffect(() => {
    setBackendStatus('connected');
  }, []);

  // ---- Load data from backend ----
  useEffect(() => {
    const load = (ep, setter) => {
      fetch(`${API_URL}/api/${ep}`)
        .then(r => {
          if (!r.ok) throw new Error();
          return r.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setter(data);
          }
        })
        .catch(() => {});
    };
    load('properties', setProperties);
    load('customers',  setCustomers);
    load('bookings',   setBookings);
    load('site_visits', setSiteVisits);
    load('follow_ups', setFollowUps);
  }, []);

  // ---- Reset/Create new chat ----
  const resetChat = () => {
    const active = conversations.find(c => c.id === activeConversationId);
    if (active && (!active.messages || active.messages.length === 0)) {
      setMessages([]);
      setCustomerContext({ name: '', phone: '', email: '' });
      setPropertyContext({ project: '', unit: '', price: '' });
      setBookingContext({ status: '', amount: '' });
      setConversationStage('GREETING');
      setActiveAgentStep(1);
      setInput('');
      setView('chat');
      return;
    }

    const newId = 'conv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    const newConv = {
      id: newId,
      title: 'New Conversation',
      pinned: false,
      date: 'Today',
      messages: [],
      customerContext: { name: '', phone: '', email: '' },
      propertyContext: { project: '', unit: '', price: '' },
      bookingContext: { status: '', amount: '' },
      conversationStage: 'GREETING',
      activeAgentStep: 1
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newId);
    setMessages([]);
    setCustomerContext({ name: '', phone: '', email: '' });
    setPropertyContext({ project: '', unit: '', price: '' });
    setBookingContext({ status: '', amount: '' });
    setConversationStage('GREETING');
    setActiveAgentStep(1);
    setInput('');
    setView('chat');
  };

  // ---- Open new chat after login ----
  useEffect(() => {
    if (sessionStorage.getItem('just_logged_in') === 'true') {
      sessionStorage.removeItem('just_logged_in');
      // Use setTimeout to ensure state is initialized before resetting
      setTimeout(() => resetChat(), 0);
    }
  }, []); // Run once on mount

  // ---- Replace thinking message ----
  const replaceThinker = (prev, newMsg) => {
    const idx = prev.findIndex(m => m.isThinking);
    if (idx !== -1) {
      const c = [...prev];
      c[idx] = newMsg;
      return c;
    }
    return [...prev, newMsg];
  };

  // ---- Call backend ----
  const callChatApi = async (messageText, action = null, actionPayload = null) => {
    try {
      let finalMessage = messageText;
      // We removed the rigid System Context prefix so the AI can freely auto-route based on the user's actual intent.

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: finalMessage,
          action,
          action_payload: actionPayload,
          conversation_stage: conversationStage,
          customer_context: customerContext,
          property_context: propertyContext,
          booking_context: bookingContext,
        }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      if (data.customer_context) setCustomerContext(data.customer_context);
      if (data.property_context) setPropertyContext(data.property_context);
      if (data.booking_context)  setBookingContext(data.booking_context);
      if (data.conversation_stage) setConversationStage(data.conversation_stage);

      const stage = data.conversation_stage;
      let step = 1;
      if (stage === 'CUSTOMER_INFORMATION') step = 2;
      if (stage === 'BOOKING_REVIEW' || stage === 'BOOKING_CONFIRMATION') step = 3;
      if (stage === 'BOOKING_COMPLETE') step = 4;
      setActiveAgentStep(step);

      // Auto-route to the correct agent based on backend decision
      if (data.response_agent_name) {
        const agentMapping = {
          'Financial Agent': 'a6',
          'Project Info Agent': 'a8',
          'Property Search Agent': 'a7',
          'Customer Agent': 'a5',
          'Site Visit Agent': 'a3',
          'Follow-up Agent': 'a1',
          'Booking Agent': 'a4',
          'Dashboard Agent': 'a0',
          'Database Agent': 'a0',
          'AI Assistant': 'a0' // Greeting defaults to Super Agent
        };
        const matchedAgentId = agentMapping[data.response_agent_name];
        if (matchedAgentId && activeAgentId !== 'a0') {
          setActiveAgentId(matchedAgentId);
        }
      }

      if (data.properties && Array.isArray(data.properties)) setProperties(data.properties);
      if (data.customers && Array.isArray(data.customers))  setCustomers(data.customers);
      if (data.bookings && Array.isArray(data.bookings))   setBookings(data.bookings);
      if (data.site_visits && Array.isArray(data.site_visits)) setSiteVisits(data.site_visits);
      if (data.follow_ups && Array.isArray(data.follow_ups)) setFollowUps(data.follow_ups);

      const aiMsg = {
        id:      'msg-' + Date.now(),
        sender:  'ai',
        text:    data.response_text,
        type:    data.response_type,
        payload: data.response_payload,
        actions: data.response_actions,
        steps:   data.steps,
      };
      setMessages(prev => replaceThinker(prev, aiMsg));
    } catch {
      const errMsg = {
        id:     'msg-err-' + Date.now(),
        sender: 'ai',
        text:   'Unable to reach the backend server. Make sure the FastAPI server is running on port 8000.',
      };
      setMessages(prev => replaceThinker(prev, errMsg));
    }
  };

  // ---- Helper to send text to chat API ----
  const handleSendText = (text, action = null, actionPayload = null) => {
    setMessages(prev => [
      ...prev,
      { id: 'msg-user-' + Date.now(),     sender: 'user', text },
      { id: 'msg-thinking-' + Date.now(), sender: 'ai',   isThinking: true },
    ]);

    // Update title of the active conversation if it was "New Conversation" or empty
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId && (c.title === 'New Conversation' || !c.messages || c.messages.length === 0)) {
        const shortTitle = text.length > 25 ? text.substring(0, 25) + '...' : text;
        return { ...c, title: shortTitle };
      }
      return c;
    }));

    callChatApi(text, action, actionPayload);
  };

  // ---- Send message ----
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    handleSendText(text);
  };

  // ---- Edit message ----
  const handleEditMessage = (msgId, newText) => {
    setMessages(prev => {
      const idx = prev.findIndex(m => m.id === msgId);
      if (idx === -1) return prev;
      const sliced = prev.slice(0, idx);
      return [
        ...sliced,
        { id: 'msg-user-' + Date.now(), sender: 'user', text: newText },
        { id: 'msg-thinking-' + Date.now(), sender: 'ai', isThinking: true },
      ];
    });
    callChatApi(newText);
  };

  // ---- Select property ----
  const handleSelectProperty = (prop) => {
    setMessages(prev => prev.map(msg => {
      if (msg.type === 'properties' || msg.type === 'properties_with_form') {
        return { ...msg, payload: msg.payload.map(p => ({ ...p, selected: p.unit === prop.unit })) };
      }
      return msg;
    }));
    const text = `Select Unit ${prop.unit}`;
    handleSendText(text, 'select_property', prop);
  };

  // ---- Cancel booking ----
  const handleCancelBooking = () => {
    handleSendText('Cancel booking', 'cancel_booking');
  };

  // ---- Confirm booking ----
  const handleConfirmBooking = (summary) => {
    handleSendText('Confirm booking', 'confirm_booking', summary);
  };

  // ---- Quick action ----
  const handleQuickAction = (action, payload) => {
    if (action !== 'reset_booking') {
      setView('chat');
    }
    switch (action) {
      case 'book':
      case 'book_property':
        setCustomerContext({ name: '', phone: '', email: '' });
        setPropertyContext({ project: '', unit: '', price: '' });
        setBookingContext({ status: '', amount: '' });
        setConversationStage('PROPERTY_SELECTION');
        handleSendText('I want to book a property');
        break;

      case 'search':
      case 'check_availability':
        handleSendText('Show available properties');
        break;

      case 'customer':
      case 'find_customer':
        handleSendText('Show customer directory');
        break;

      case 'history':
      case 'view_booking_history':
        handleSendText('Show booking history');
        break;

      case 'site_visit':
        handleSendText('Show scheduled site visits');
        break;

      case 'follow_up':
        handleSendText('Show pending follow-ups');
        break;

      case 'dashboard':
        handleSendText('Show sales dashboard');
        break;

      case 'cancel_booking':
        handleCancelBooking();
        break;

      case 'confirm_booking':
        handleConfirmBooking(payload);
        break;

      case 'reset_booking':
        fetch(`${API_URL}/api/reset`, { method: 'POST' })
          .then(r => r.json())
          .then(data => {
            if (data.properties && Array.isArray(data.properties)) setProperties(data.properties);
            if (data.customers && Array.isArray(data.customers))  setCustomers(data.customers);
            if (data.bookings && Array.isArray(data.bookings))   setBookings(data.bookings);
            if (data.site_visits && Array.isArray(data.site_visits)) setSiteVisits(data.site_visits);
            if (data.follow_ups && Array.isArray(data.follow_ups)) setFollowUps(data.follow_ups);
            resetChat();
          })
          .catch(() => resetChat());
        break;

      case 'submit_customer_form': {
        const { name, phone, email, amount } = payload;
        let text = `Customer Name: ${name}, Phone: ${phone}`;
        if (email)  text += `, Email: ${email}`;
        if (amount) text += `, Amount: ${amount}`;
        handleSendText(text);
        break;
      }

      case 'submit_site_visit_form': {
        const { name, project, dateTime } = payload;
        handleSendText(`Customer: ${name}, Project: ${project}, Time: ${dateTime}`);
        break;
      }

      default:
        // Try passing the action as direct text
        handleSendText(action);
        break;
    }
  };


  const handleResetDataDirect = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reset`, { method: 'POST' });
      const data = await response.json();
      if (data.properties && Array.isArray(data.properties)) setProperties(data.properties);
      if (data.customers && Array.isArray(data.customers))  setCustomers(data.customers);
      if (data.bookings && Array.isArray(data.bookings))   setBookings(data.bookings);
      if (data.site_visits && Array.isArray(data.site_visits)) setSiteVisits(data.site_visits);
      if (data.follow_ups && Array.isArray(data.follow_ups)) setFollowUps(data.follow_ups);
      resetChat();
    } catch (err) {
      console.error(err);
      resetChat();
    }
  };

  // ---- Render center panel ----
  const renderCenter = () => {
    if (currentView === 'dashboard') {
      return (
        <DashboardOverlay
          bookings={bookings}
          properties={properties}
          customers={customers}
          siteVisits={siteVisits}
          followUps={followUps}
          onQuickAction={handleQuickAction}
          setBookings={setBookings}
          setCustomers={setCustomers}
          setSiteVisits={setSiteVisits}
          setFollowUps={setFollowUps}
          onResetData={handleResetDataDirect}
        />
      );
    }



    if (currentView === 'settings') {
      return (
        <div className="ew-dashboard">
          <div className="ew-dashboard-topbar">
            <span className="ew-dashboard-topbar-title">Settings</span>
          </div>
          <div className="ew-dashboard-body" style={{ padding: '24px 30px' }}>
            <SettingsView onResetData={handleResetDataDirect} />
          </div>
        </div>
      );
    }

    if (currentView === 'reports') {
      return (
        <div className="ew-dashboard">
          <div className="ew-dashboard-topbar">
            <span className="ew-dashboard-topbar-title">Reports</span>
          </div>
          <div className="ew-dashboard-body" style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
              <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, fontSize: 15 }}>Reports coming soon</div>
              <div style={{ fontSize: 13 }}>Analytics will be available in the next release.</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <ConversationPane
        messages={messages}
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        onQuickAction={handleQuickAction}
        onEditMessage={handleEditMessage}
        onSelectProperty={handleSelectProperty}
        onConfirmBooking={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
        onViewDetails={setDetailsProperty}
        backendStatus={backendStatus}
      />
    );
  };

  return (
    <div className="ew-root">
      <Sidebar
        currentView={currentView}
        setView={setView}
        resetChat={resetChat}
        bookingsCount={bookings.filter(b => b.status === 'Confirmed').length}
        onQuickAction={handleQuickAction}
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        onProfileClick={() => {
          setView('settings');
          setSidebarExpanded(false);
        }}
        conversations={conversations}
        setConversations={setConversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        activeAgentId={activeAgentId}
        setActiveAgentId={setActiveAgentId}
      />
      {renderCenter()}
      {detailsProperty && (
        <PropertyDetailsModal
          property={detailsProperty}
          onClose={() => setDetailsProperty(null)}
          onSelect={(prop) => {
            setDetailsProperty(null);
            handleSelectProperty(prop);
          }}
        />
      )}
    </div>
  );
};

export default WorkspacePage;
