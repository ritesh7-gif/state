import React, { useRef, useEffect } from 'react';
import { Send, Bot, User, Home, ShieldCheck, Search, Users, Landmark, CalendarDays, Building2, ArrowUp, Mic, Plus, FileText } from 'lucide-react';

const renderMessageText = (text) => {
  if (!text) return null;
  return text.split('\n').map((paragraph, index) => {
    if (!paragraph.trim()) return null;
    return (
      <p key={index} className="ws-message-para">
        {paragraph}
      </p>
    );
  });
};

const ChatArea = ({ 
  messages = [], 
  input = '', 
  setInput, 
  handleSend, 
  onQuickAction, 
  onSelectProperty, 
  onConfirmBooking,
  activeAgentStep = 1,
  sidebarOpen,
  onToggleSidebar,
  backendStatus = 'checking'
}) => {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${Math.min(newHeight, 180)}px`;
    textarea.style.overflowY = newHeight > 180 ? 'auto' : 'hidden';
  };

  useEffect(() => {
    if (!input) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = '36px';
        textarea.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSend(e);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickActions = [
    { id: 'book', icon: <Landmark size={16} />, label: 'Book a Property', desc: 'Start a new reservation' },
    { id: 'search', icon: <Search size={16} />, label: 'Check Availability', desc: 'Search live inventory' },
    { id: 'customer', icon: <Users size={16} />, label: 'Find a Customer', desc: 'Search CRM records' },
    { id: 'history', icon: <FileText size={16} />, label: 'Booking History', desc: 'View all reservations' },
  ];

  return (
    <div className="ws-center-pane">

      {/* Header Bar */}
      <div className="ws-agent-flow-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
          {!sidebarOpen && (
            <button
              type="button"
              className="ws-brand-logo-toggle"
              onClick={onToggleSidebar}
              title="Open Sidebar"
            >
              <Building2 size={14} />
            </button>
          )}
          <div className="ws-agent-flow-title" style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="ws-agent-indicator-pulse"></div>
              <span>Real Estate AI Workspace</span>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: 700,
              padding: '3px 10px', borderRadius: '99px', letterSpacing: '0.02em',
              backgroundColor: backendStatus === 'connected' ? '#ECFDF5' : '#FEF2F2',
              color: backendStatus === 'connected' ? '#059669' : '#DC2626',
              border: `1px solid ${backendStatus === 'connected' ? '#A7F3D0' : '#FECACA'}`
            }}>
              <span style={{ fontSize: '9px' }}>●</span>
              {backendStatus === 'connected' ? 'Connected' : backendStatus === 'disconnected' ? 'Disconnected' : 'Checking…'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="ws-chat-messages">
        {messages.length === 0 ? (

          /* ── Professional Empty State ── */
          <div className="ws-empty-state">
            <div className="ws-empty-logo-ring">
              <Building2 size={28} />
            </div>

            <h1 className="ws-empty-headline">How can I assist you today?</h1>
            <p className="ws-empty-sub">
              Your AI-powered real estate assistant is ready.<br />
              Select an action below or type your request directly.
            </p>

            <div className="ws-quick-actions-grid">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className="ws-quick-action-card"
                  onClick={() => onQuickAction(action.id)}
                >
                  {action.icon}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.8375rem', color: '#0F172A', lineHeight: 1.3 }}>
                      {action.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '1px' }}>
                      {action.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        ) : (

          /* ── Conversation Thread ── */
          messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div key={msg.id} className={`ws-message-wrapper ${isUser ? 'user' : 'ai'}`}>
                <div className={`ws-message-avatar ${isUser ? 'user' : 'ai'}`}>
                  {isUser ? <User size={15} /> : <Building2 size={15} />}
                </div>

                <div className="ws-message-content">
                  <div className="ws-message-author">
                    {isUser ? 'You' : 'PropAgentOS'}
                  </div>

                  {/* Thinking Indicator */}
                  {msg.isThinking ? (
                    <div className="ws-ai-thinking-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  ) : (
                    <div className="ws-message-text">
                      {renderMessageText(msg.text)}
                    </div>
                  )}

                  {/* Property Cards */}
                  {(msg.type === 'properties' || msg.type === 'properties_with_form') && msg.payload && (
                    <div className="ws-property-cards-container">
                      {msg.payload.map((prop) => (
                        <div className="ws-property-card" key={prop.unit}>
                          <div style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid #F1F4F7',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFF 100%)'
                          }}>
                            <span className="ws-property-card-tag">{prop.type} BHK</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569' }}>{prop.city}</span>
                          </div>

                          <div className="ws-property-card-body">
                            <span className="ws-property-card-unit">Unit {prop.unit}</span>
                            <span className="ws-property-card-project">{prop.project}</span>
                            <span className="ws-property-card-price">{prop.price}</span>

                            <button
                              className={`ws-property-card-select-btn ${prop.selected ? 'selected' : ''}`}
                              onClick={() => !prop.selected && !prop.reserved && onSelectProperty(prop)}
                              disabled={prop.selected || prop.reserved}
                              style={prop.reserved ? { backgroundColor: '#F1F5F9', color: '#94A3B8', cursor: 'not-allowed', boxShadow: 'none' } : {}}
                            >
                              {prop.selected ? '✓ Selected' : prop.reserved ? 'Reserved' : 'Select Property'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Customer Form */}
                  {(msg.type === 'customer_form' || msg.type === 'properties_with_form') && (
                    <div style={{
                      padding: '1.25rem',
                      border: '1px solid #E8ECF0',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      marginTop: '0.75rem',
                      boxShadow: '0 1px 4px rgba(15,23,42,0.06)'
                    }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#0F172A', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                        Customer Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                          { label: 'Customer Name *', id: `form_name_${msg.id}`, type: 'text', placeholder: 'e.g. Ritesh Yadav' },
                          { label: 'Mobile Number *', id: `form_phone_${msg.id}`, type: 'text', placeholder: 'e.g. 9876543210' },
                          { label: 'Email Address', id: `form_email_${msg.id}`, type: 'email', placeholder: 'e.g. name@example.com' },
                          { label: 'Booking Amount', id: `form_amount_${msg.id}`, type: 'text', placeholder: 'e.g. 500000' },
                        ].map(field => (
                          <div key={field.id}>
                            <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748B', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              id={field.id}
                              style={{
                                width: '100%', padding: '0.6rem 0.875rem',
                                border: '1px solid #D1D9E0', borderRadius: '8px',
                                outline: 'none', fontSize: '0.875rem', color: '#0F172A',
                                background: '#F8F9FB', transition: 'all 0.15s ease',
                                boxSizing: 'border-box'
                              }}
                              onFocus={e => { e.target.style.borderColor = '#93C5FD'; e.target.style.background = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.07)'; }}
                              onBlur={e => { e.target.style.borderColor = '#D1D9E0'; e.target.style.background = '#F8F9FB'; e.target.style.boxShadow = 'none'; }}
                              placeholder={field.placeholder}
                            />
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const name = document.getElementById(`form_name_${msg.id}`).value;
                            const phone = document.getElementById(`form_phone_${msg.id}`).value;
                            const email = document.getElementById(`form_email_${msg.id}`).value;
                            const amount = document.getElementById(`form_amount_${msg.id}`).value;
                            if (name && phone) {
                              onQuickAction('submit_customer_form', { name, phone, email, amount });
                            } else {
                              alert('Please provide at least Customer Name and Mobile Number.');
                            }
                          }}
                          style={{
                            marginTop: '0.25rem',
                            padding: '0.65rem 1.25rem',
                            background: '#1E40AF',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: '0.8375rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(30,64,175,0.2)'
                          }}
                          onMouseEnter={e => { e.target.style.background = '#1D4ED8'; e.target.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.target.style.background = '#1E40AF'; e.target.style.transform = 'none'; }}
                        >
                          Submit Information
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Booking Summary Card */}
                  {msg.type === 'booking_summary' && msg.payload && (
                    <div className="ws-booking-summary-card">
                      <div className="ws-booking-summary-header">
                        <ShieldCheck size={16} style={{ color: '#059669' }} />
                        <h4>Booking Reservation Summary</h4>
                      </div>

                      <div className="ws-booking-summary-grid">
                        <div>
                          <div className="ws-booking-summary-label">Customer Name</div>
                          <div className="ws-booking-summary-val">{msg.payload.customerName}</div>
                        </div>
                        <div>
                          <div className="ws-booking-summary-label">Property Unit</div>
                          <div className="ws-booking-summary-val">Unit {msg.payload.unit}</div>
                        </div>
                        <div>
                          <div className="ws-booking-summary-label">Contact Phone</div>
                          <div className="ws-booking-summary-val">{msg.payload.phone}</div>
                        </div>
                        <div>
                          <div className="ws-booking-summary-label">Email Address</div>
                          <div className="ws-booking-summary-val">{msg.payload.email || '—'}</div>
                        </div>
                        <div>
                          <div className="ws-booking-summary-label">Booking Status</div>
                          <div className="ws-booking-summary-val" style={{ color: '#D97706' }}>{msg.payload.status}</div>
                        </div>
                        <div>
                          <div className="ws-booking-summary-label">Booking Amount</div>
                          <div className="ws-booking-summary-val">{msg.payload.amount || '₹2,00,000'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.25rem' }}>
                        <button
                          className={`ws-booking-summary-confirm-btn ${msg.payload.confirmed ? 'confirmed' : ''}`}
                          onClick={() => !msg.payload.confirmed && onConfirmBooking(msg.payload)}
                          disabled={msg.payload.confirmed}
                          style={{ flex: 1 }}
                        >
                          {msg.payload.confirmed ? '✓ Booking Confirmed' : 'Confirm Booking'}
                        </button>

                        {!msg.payload.confirmed && (
                          <button
                            onClick={() => onQuickAction('cancel')}
                            style={{
                              padding: '0.65rem 1rem',
                              backgroundColor: 'transparent',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                              borderRadius: '8px',
                              fontWeight: 600,
                              fontSize: '0.8375rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => { e.target.style.background = '#FEF2F2'; }}
                            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customers List */}
                  {msg.type === 'customers' && msg.payload && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {msg.payload.map(cust => (
                        <div key={cust.name} style={{
                          padding: '0.875rem 1rem', border: '1px solid #E8ECF0',
                          borderRadius: '10px', background: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(15,23,42,0.05)'
                        }}>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{cust.name}</div>
                          <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                            <span>📞 {cust.phone}</span>
                            <span>✉️ {cust.email}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '0.35rem', fontWeight: 600 }}>
                            Status: {cust.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Site Visits */}
                  {msg.type === 'site_visits' && msg.payload && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {msg.payload.map(visit => (
                        <div key={visit.id} style={{
                          padding: '0.875rem 1rem', border: '1px solid #E8ECF0',
                          borderRadius: '10px', background: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(15,23,42,0.05)'
                        }}>
                          <div style={{ fontWeight: 600, color: '#0F172A', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span>{visit.project}</span>
                            <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: '#FFFBEB', color: '#D97706', borderRadius: '4px', fontWeight: 700 }}>
                              {visit.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.3rem' }}>Customer: {visit.customerName}</div>
                          <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.25rem' }}>📅 {visit.date} at {visit.time}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Follow-ups */}
                  {msg.type === 'follow_ups' && msg.payload && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {msg.payload.map(fu => (
                        <div key={fu.id} style={{
                          padding: '0.875rem 1rem', border: '1px solid #E8ECF0',
                          borderRadius: '10px', background: '#FFFFFF',
                          borderLeft: '3px solid #3B82F6',
                          boxShadow: '0 1px 3px rgba(15,23,42,0.05)'
                        }}>
                          <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{fu.customerName}</div>
                          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.3rem' }}>📝 {fu.notes}</div>
                          <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '0.25rem' }}>Due: {fu.dueDate}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dashboard Stats */}
                  {msg.type === 'dashboard_stats' && msg.payload && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginTop: '0.5rem' }}>
                      {[
                        { label: "Today's Bookings", value: msg.payload.today_bookings, color: '#0F172A' },
                        { label: 'Pending Bookings', value: msg.payload.pending_bookings, color: '#D97706' },
                        { label: 'Total Site Visits', value: msg.payload.total_visits, color: '#1E40AF' },
                        { label: 'Total Revenue', value: msg.payload.total_revenue, color: '#059669' },
                      ].map(stat => (
                        <div key={stat.label} style={{
                          padding: '0.875rem 1rem', border: '1px solid #E8ECF0',
                          borderRadius: '10px', background: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(15,23,42,0.04)'
                        }}>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {stat.label}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.color, marginTop: '0.25rem', letterSpacing: '-0.02em' }}>
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Greeting Action Buttons */}
                  {msg.type === 'greeting_actions' && (
                    <div className="ws-action-buttons-container">
                      {[
                        { action: 'book', label: 'Book Property', primary: true },
                        { action: 'search', label: 'Check Availability', primary: false },
                        { action: 'customer', label: 'Find Customer', primary: false },
                        { action: 'history', label: 'Booking History', primary: false },
                      ].map(btn => (
                        <button
                          key={btn.action}
                          onClick={() => onQuickAction(btn.action)}
                          style={{
                            padding: '0.5rem 1rem',
                            background: btn.primary ? '#1E40AF' : '#FFFFFF',
                            color: btn.primary ? '#FFFFFF' : '#475569',
                            borderRadius: '7px',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            border: btn.primary ? 'none' : '1px solid #E2E8F0',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: btn.primary ? '0 2px 6px rgba(30,64,175,0.2)' : 'none'
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Dynamic Response Actions */}
                  {msg.type !== 'greeting_actions' && msg.type !== 'booking_summary' && msg.actions && msg.actions.length > 0 && (
                    <div className="ws-action-buttons-container">
                      {msg.actions.map(action => {
                        let label = action;
                        if (action === 'book_property' || action === 'book') label = 'Book Property';
                        if (action === 'check_availability' || action === 'search') label = 'Check Availability';
                        if (action === 'view_booking_history' || action === 'history') label = 'Booking History';
                        if (action === 'confirm_booking') label = 'Confirm Booking';
                        if (action === 'cancel_booking') label = 'Cancel';
                        if (action === 'reset_booking') label = 'New Session';
                        if (action === 'select_property') label = 'Select Property';

                        const isPrimary = action === 'confirm_booking' || action === 'book_property' || action === 'book';

                        return (
                          <button
                            key={action}
                            onClick={() => onQuickAction(action)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: isPrimary ? '#1E40AF' : '#FFFFFF',
                              color: isPrimary ? '#FFFFFF' : '#475569',
                              borderRadius: '7px',
                              fontWeight: 600,
                              fontSize: '0.8125rem',
                              border: isPrimary ? 'none' : '1px solid #E2E8F0',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: isPrimary ? '0 2px 6px rgba(30,64,175,0.2)' : 'none'
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="ws-ai-input-container">
        <div className="ws-ai-input-wrapper">
          <div className="ws-ai-plus-btn" title="Attach file">
            <Plus size={16} />
          </div>

          <textarea
            id="ai-input"
            ref={textareaRef}
            value={input}
            placeholder="Ask PropAgentOS..."
            className="ws-ai-textarea"
            style={{ minHeight: '36px', maxHeight: '180px' }}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
          />

          <div className="ws-ai-mic-btn" title="Voice Input">
            <Mic size={15} />
          </div>

          <button
            onClick={input.trim() ? handleSend : undefined}
            type="button"
            className={`ws-ai-send-btn ${input.trim() ? 'active' : ''}`}
            disabled={!input.trim()}
            title="Send Message"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
