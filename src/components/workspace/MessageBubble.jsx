import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw, 
  Copy, 
  User, 
  Calendar, 
  Clock, 
  Building2, 
  ClipboardList, 
  Landmark, 
  Coins, 
  FileText, 
  CheckCircle,
  Mail,
  Phone,
  Edit2
} from 'lucide-react';
import PropertyCard from './PropertyCard';
import BookingCard from './BookingCard';

/* Formats plain text into JSX — handles newlines + bullet points + basic Markdown bold/code tags */
const formatText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const t = line.trim();
    if (!t) return <div key={i} style={{ height: 8 }} />;
    
    // Check if line is a list item
    const isBullet = t.startsWith('* ') || t.startsWith('• ') || t.startsWith('- ');
    const rawLine = isBullet ? t.slice(2) : t;
    
    // Parse bold tags **text** and inline code `code`
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const splitParts = rawLine.split(regex);
    
    const formattedLine = splitParts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} style={{ color: 'var(--text-primary)', fontWeight: 650 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} style={{ 
            fontFamily: 'var(--font-mono)', 
            fontSize: '12.5px', 
            background: 'var(--bg-hover)', 
            padding: '2px 6px', 
            borderRadius: '4px',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)'
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', margin: '3px 0' }}>
          <span style={{ color: 'var(--accent)', marginTop: 5, fontSize: 10, flexShrink: 0 }}>●</span>
          <span style={{ color: 'var(--text-primary)' }}>{formattedLine}</span>
        </div>
      );
    }
    
    return <div key={i} style={{ color: 'var(--text-primary)', margin: '2px 0' }}>{formattedLine}</div>;
  });
};

const ReactionBar = () => (
  <div className="ew-msg-reactions">
    <button className="ew-msg-reaction-btn" title="Good response">
      <ThumbsUp size={14} strokeWidth={1.75} />
    </button>
    <button className="ew-msg-reaction-btn" title="Bad response">
      <ThumbsDown size={14} strokeWidth={1.75} />
    </button>
    <button className="ew-msg-reaction-btn" title="Regenerate">
      <RotateCcw size={14} strokeWidth={1.75} />
    </button>
    <button className="ew-msg-reaction-btn" title="Copy">
      <Copy size={14} strokeWidth={1.75} />
    </button>
  </div>
);

/* =====================================================================
   CUSTOM PREMIUM CARDS
   ===================================================================== */

const CustomerCard = ({ customer }) => {
  if (!customer) return null;
  
  return (
    <div className="ew-custom-card customer-card">
      <div className="ew-card-header">
        <div className="ew-card-icon-wrapper">
          <User size={15} strokeWidth={2} />
        </div>
        <div className="ew-card-title-group">
          <span className="ew-card-title">{customer.name}</span>
          <span className="ew-card-subtitle">Added on {customer.dateAdded || 'N/A'}</span>
        </div>
        <span className={`ew-card-badge status-${(customer.status || '').toLowerCase()}`}>
          {customer.status}
        </span>
      </div>
      
      <div className="ew-card-body">
        <div className="ew-card-contact-row">
          <span className="ew-contact-item"><Phone size={12} /> {customer.phone}</span>
          <span className="ew-contact-item"><Mail size={12} /> {customer.email}</span>
        </div>

        {customer.bookings && customer.bookings.length > 0 && (
          <div className="ew-card-section">
            <span className="ew-section-heading">Bookings</span>
            <div className="ew-section-items">
              {customer.bookings.map(b => (
                <div key={b.id} className="ew-section-item justify-between">
                  <span>Unit {b.unit}</span>
                  <span className="bold">{b.amount}</span>
                  <span className="badge-small confirmed">{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {customer.site_visits && customer.site_visits.length > 0 && (
          <div className="ew-card-section">
            <span className="ew-section-heading">Site Visits</span>
            <div className="ew-section-items">
              {customer.site_visits.map(v => (
                <div key={v.id} className="ew-section-item">
                  <span>📅 {v.date} · {v.time} · {v.project}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SiteVisitCard = ({ visit }) => {
  if (!visit) return null;
  
  return (
    <div className="ew-custom-card visit-card">
      <div className="ew-card-header">
        <div className="ew-card-icon-wrapper">
          <Calendar size={15} strokeWidth={2} />
        </div>
        <div className="ew-card-title-group">
          <span className="ew-card-title">{visit.project}</span>
          <span className="ew-card-subtitle">Site Visit scheduled</span>
        </div>
        <span className={`ew-card-badge status-${(visit.status || '').toLowerCase()}`}>
          {visit.status}
        </span>
      </div>
      
      <div className="ew-card-body">
        <div className="ew-card-grid-info">
          <div className="ew-grid-info-item">
            <span className="info-label">Customer</span>
            <span className="info-value">{visit.customerName}</span>
          </div>
          <div className="ew-grid-info-item">
            <span className="info-label">Schedule</span>
            <span className="info-value">{visit.date} at {visit.time}</span>
          </div>
          {visit.executive && (
            <div className="ew-grid-info-item">
              <span className="info-label">Executive</span>
              <span className="info-value">{visit.executive}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FollowUpCard = ({ followUp }) => {
  if (!followUp) return null;
  
  return (
    <div className="ew-custom-card follow-up-card">
      <div className="ew-card-header">
        <div className="ew-card-icon-wrapper">
          <ClipboardList size={15} strokeWidth={2} />
        </div>
        <div className="ew-card-title-group">
          <span className="ew-card-title">{followUp.customerName}</span>
          <span className="ew-card-subtitle">Lead follow-up action</span>
        </div>
        <span className={`ew-card-badge status-${(followUp.status || '').toLowerCase()}`}>
          {followUp.status}
        </span>
      </div>
      
      <div className="ew-card-body">
        <div className="ew-follow-notes">
          {followUp.notes}
        </div>
        <div className="ew-follow-meta">
          <span>Due date: {followUp.dueDate}</span>
        </div>
      </div>
    </div>
  );
};

const DashboardStatsCard = ({ stats }) => {
  if (!stats) return null;
  
  const cards = [
    { label: "Today's Bookings", value: stats.today_bookings, icon: Landmark, color: '#2563eb' },
    { label: "Pending Bookings", value: stats.pending_bookings, icon: FileText, color: '#d97706' },
    { label: "Total Site Visits", value: stats.total_visits, icon: Calendar, color: '#3b82f6' },
    { label: "Total Revenue", value: stats.total_revenue, icon: Coins, color: '#059669' },
  ];
  
  return (
    <div className="ew-dashboard-stats-grid">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="ew-dashboard-kpi-bubble">
            <div className="ew-kpi-bubble-header">
              <span className="ew-kpi-bubble-label">{card.label}</span>
              <div className="ew-kpi-bubble-icon" style={{ color: card.color }}>
                <Icon size={14} />
              </div>
            </div>
            <span className="ew-kpi-bubble-value">{card.value}</span>
          </div>
        );
      })}
    </div>
  );
};

const BookingsListCard = ({ bookings }) => {
  if (!bookings || bookings.length === 0) return null;
  return (
    <div className="ew-custom-card bookings-list-card" style={{ width: '100%', overflowX: 'auto' }}>
      <div className="ew-card-header">
        <div className="ew-card-icon-wrapper" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <ClipboardList size={15} strokeWidth={2} />
        </div>
        <div className="ew-card-title-group">
          <span className="ew-card-title">Bookings Directory</span>
          <span className="ew-card-subtitle">{bookings.length} Record{bookings.length !== 1 ? 's' : ''} Found</span>
        </div>
      </div>
      <div className="ew-card-body" style={{ padding: 0 }}>
        <table className="ew-booking-table" style={{ margin: 0, width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)' }}>Customer</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)' }}>Unit</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)' }}>Token</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-secondary)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={b.id || b.booking_id || i} style={{ borderBottom: i < bookings.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>{b.id || b.booking_id || `BK-${1000+i}`}</td>
                <td style={{ padding: '10px 12px', fontWeight: 500, fontSize: '12px', color: 'var(--text-primary)' }}>{b.customerName || b.customer_name || '—'}</td>
                <td style={{ padding: '10px 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>{b.unit || b.property_unit || '—'}</td>
                <td style={{ padding: '10px 12px', fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)' }}>{b.amount || b.token_amount || '—'}</td>
                <td style={{ padding: '10px 12px' }}>
                  <span className={`ew-badge ${
                    (b.status || '').toLowerCase() === 'confirmed' ? 'ew-badge-success' :
                    (b.status || '').toLowerCase() === 'pending'   ? 'ew-badge-warning' : 'ew-badge-danger'
                  }`} style={{ fontSize: '10px', padding: '2px 6px' }}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GreetingActionsCard = ({ actions, onAction }) => {
  if (!actions || actions.length === 0) return null;
  
  const labelMap = {
    'book_property': 'Book Property',
    'search_property': 'Check Availability',
    'customer_info': 'Find Customer',
    'follow_up': 'Lead Follow-ups',
    'dashboard': 'Dashboard Stats'
  };

  return (
    <div className="ew-actions-button-grid">
      {actions.map(act => (
        <button
          key={act}
          onClick={() => onAction && onAction(act)}
          className="ew-actions-grid-btn"
        >
          {labelMap[act] || act}
        </button>
      ))}
    </div>
  );
};

const SiteVisitFormCard = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.customerName || '');
  const [project, setProject] = useState(initialData?.project || '');
  const [dateTime, setDateTime] = useState(initialData?.dateTime || '');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !project || !dateTime) return;
    setSubmitted(true);
    onSubmit({ name, project, dateTime });
  };

  if (submitted) {
    return (
      <div className="ew-customer-form-card" style={{ padding: '24px 20px', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#4ade80',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          <CheckCircle size={20} strokeWidth={2.5} />
        </div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Site Visit Details Submitted</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>The site visit is being scheduled.</div>
      </div>
    );
  }

  return (
    <form className="ew-customer-form-card" onSubmit={handleFormSubmit}>
      <div className="ew-customer-form-title">Site Visit Scheduling Form</div>
      <div className="ew-customer-form-body">
        <div className="ew-form-group">
          <label className="ew-form-label">Customer Name *</label>
          <input 
            type="text" 
            className="ew-form-input" 
            placeholder="e.g. Ritesh Yadav" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="ew-form-group">
          <label className="ew-form-label">Project / Property Name *</label>
          <input 
            type="text" 
            className="ew-form-input" 
            placeholder="e.g. Blue Ridge Hinjewadi" 
            value={project} 
            onChange={e => setProject(e.target.value)} 
            required 
          />
        </div>
        <div className="ew-form-group">
          <label className="ew-form-label">Date & Time *</label>
          <input 
            type="text" 
            className="ew-form-input" 
            placeholder="e.g. Tomorrow at 11 AM" 
            value={dateTime} 
            onChange={e => setDateTime(e.target.value)} 
            required 
          />
        </div>
      </div>
      <button 
        type="submit" 
        className="ew-btn ew-btn-primary ew-customer-form-submit" 
        disabled={!name || !project || !dateTime}
      >
        Schedule Visit
      </button>
    </form>
  );
};

const CustomerFormCard = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('200000');
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
    onSubmit({ name, phone, email, amount });
  };

  if (submitted) {
    return (
      <div className="ew-customer-form-card" style={{ padding: '24px 20px', alignItems: 'center', textAlign: 'center' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#4ade80',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px'
        }}>
          <CheckCircle size={20} strokeWidth={2.5} />
        </div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>Customer Details Submitted</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>The booking summary is being compiled.</div>
      </div>
    );
  }

  return (
    <form className="ew-customer-form-card" onSubmit={handleFormSubmit}>
      <div className="ew-customer-form-title">Customer Information Form</div>
      <div className="ew-customer-form-body">
        <div className="ew-form-group">
          <label className="ew-form-label">Full Name *</label>
          <input 
            type="text" 
            className="ew-form-input" 
            placeholder="e.g. Ritesh Yadav" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="ew-form-group">
          <label className="ew-form-label">Mobile Number *</label>
          <input 
            type="tel" 
            className="ew-form-input" 
            placeholder="e.g. 9876543210" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            required 
          />
        </div>
        <div className="ew-form-group">
          <label className="ew-form-label">Email Address (Optional)</label>
          <input 
            type="email" 
            className="ew-form-input" 
            placeholder="e.g. ritesh@gmail.com" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="ew-form-group">
          <label className="ew-form-label">Token Amount (INR, Optional)</label>
          <input 
            type="text" 
            className="ew-form-input" 
            placeholder="e.g. 200000" 
            value={amount} 
            onChange={e => setAmount(e.target.value)} 
          />
        </div>
      </div>
      <button 
        type="submit" 
        className="ew-btn ew-btn-primary ew-customer-form-submit" 
        disabled={!name || !phone}
      >
        Submit Details
      </button>
    </form>
  );
};

/* =====================================================================
   MAIN COMPONENT
   ===================================================================== */

const animatedMessageIds = new Set();

const MessageBubble = ({ message, onSelectProperty, onConfirmBooking, onCancelBooking, onQuickAction, onEditMessage, onViewDetails, onAnimationComplete }) => {
  const { sender, text, type, payload, actions, isThinking, steps } = message;
  
  const [visibleStepsCount, setVisibleStepsCount] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Determine if the message is newly created (less than 5 seconds old)
    let isRecent = false;
    if (message.id && !message.id.includes('seed') && !message.id.includes('err')) {
      const parts = message.id.split('-');
      // Assuming format: msg-{timestamp} or msg-user-{timestamp}
      const tsStr = parts.length > 2 ? parts[2] : parts[1];
      const ts = parseInt(tsStr, 10);
      if (!isNaN(ts) && Date.now() - ts < 5000) {
        isRecent = true;
      }
    }

    const shouldAnimate = steps && steps.length > 0 && isRecent && !animatedMessageIds.has(message.id);

    if (shouldAnimate) {
      setVisibleStepsCount(0);
      setShowContent(false);
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setVisibleStepsCount(current);
        if (current >= steps.length) {
          clearInterval(interval);
          animatedMessageIds.add(message.id);
          setTimeout(() => {
            setShowContent(true);
            if (onAnimationComplete) setTimeout(onAnimationComplete, 100);
          }, 250);
        }
      }, 350); // Stagger interval
      return () => clearInterval(interval);
    } else {
      setVisibleStepsCount(steps ? steps.length : 0);
      setShowContent(true);
      animatedMessageIds.add(message.id);
      if (onAnimationComplete) setTimeout(onAnimationComplete, 100);
    }
  }, [steps, message.id, onAnimationComplete]);

  /* Thinking state */
  if (isThinking) {
    return (
      <div className="ew-msg-row ai">
        <div className="ew-premium-thinking">
          <div className="ew-premium-thinking-icon">
            <Building2 size={15} strokeWidth={2.5} />
          </div>
          <span className="ew-premium-thinking-text">RealState AI is analyzing your request...</span>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text || '');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setEditValue(text || '');
  }, [text]);

  /* User message */
  if (sender === 'user') {
    if (isEditing) {
      return (
        <div className="ew-msg-row user">
          <div className="ew-msg-user-edit-container">
            <textarea
              className="ew-msg-user-edit-textarea"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={2}
              autoFocus
              onFocus={(e) => {
                const val = e.target.value;
                e.target.value = '';
                e.target.value = val;
              }}
            />
            <div className="ew-msg-user-edit-actions-row">
              <button 
                className="ew-msg-user-edit-btn cancel" 
                onClick={() => { setIsEditing(false); setEditValue(text); }}
              >
                Cancel
              </button>
              <button 
                className="ew-msg-user-edit-btn send"
                onClick={() => {
                  setIsEditing(false);
                  if (editValue.trim() !== text && editValue.trim()) {
                    if (onEditMessage) {
                      onEditMessage(message.id, editValue.trim());
                    } else {
                      onQuickAction(editValue.trim());
                    }
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="ew-msg-row user">
        <div className="ew-msg-user-content-wrapper">
          <div className="ew-msg-user-bubble">{text}</div>
          <div className="ew-user-msg-actions">
            <button 
              className="ew-user-msg-action-btn" 
              onClick={() => {
                navigator.clipboard.writeText(text).then(() => {
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }).catch(err => console.error('Copy failed', err));
              }}
              title="Copy"
            >
              {isCopied ? <CheckCircle size={14} color="#10B981" /> : <Copy size={14} />}
            </button>
            <button 
              className="ew-user-msg-action-btn"
              onClick={() => setIsEditing(true)}
              title="Edit message"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ew-msg-row ai">
      {/* 1. Single smooth animated step display instead of staggered list */}
      {steps && steps.length > 0 && !showContent && (
        <div className="ew-premium-thinking" style={{ marginBottom: 16 }}>
          <div className="ew-premium-thinking-icon">
            <Building2 size={15} strokeWidth={2.5} />
          </div>
          <span className="ew-premium-thinking-text" key={visibleStepsCount}>
            {steps[Math.max(0, visibleStepsCount - 1)] || "Finalizing response..."}
          </span>
        </div>
      )}


      {/* 2. Show actual response content after steps animation ends */}
      {showContent && (
        <div className="ew-msg-content-wrapper" style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
          <div className="ew-msg-ai-content">
            <div className="ew-msg-ai-avatar">
              <Building2 size={18} strokeWidth={2.5} />
            </div>
            <div className="ew-msg-ai-body">
              {text && type !== 'booking_complete' && (
                <div className="ew-msg-ai-text">{formatText(text)}</div>
              )}

              {/* Cards payload rendering */}
              {(type === 'properties' || type === 'properties_with_form') && Array.isArray(payload) && payload.length > 0 && (
                <div className="ew-property-cards">
                  {payload.map((prop, i) => (
                    <PropertyCard
                      key={prop.unit || i}
                      property={prop}
                      index={i}
                      onSelect={onSelectProperty}
                      onViewDetails={onViewDetails}
                      disabled={payload.some(p => p.selected)}
                    />
                  ))}
                </div>
              )}

              {(type === 'site_visit_form') && (
                <SiteVisitFormCard 
                  initialData={payload || {}}
                  onSubmit={(details) => onQuickAction && onQuickAction('submit_site_visit_form', details)} 
                />
              )}

              {(type === 'customer_form' || type === 'properties_with_form') && (
                <CustomerFormCard 
                  onSubmit={(details) => onQuickAction && onQuickAction('submit_customer_form', details)} 
                />
              )}

              {(type === 'booking_review' || type === 'booking_confirmation' || type === 'booking_summary') && payload && (
                <BookingCard
                  payload={payload}
                  onConfirm={onConfirmBooking}
                  onCancel={onCancelBooking}
                />
              )}

              {type === 'booking_complete' && payload && (
                <BookingCard payload={{ ...payload, status: 'confirmed' }} />
              )}

              {type === 'bookings' && Array.isArray(payload) && (
                <div className="ew-cards-column" style={{ width: '100%' }}>
                  <BookingsListCard bookings={payload} />
                </div>
              )}

              {type === 'customers' && Array.isArray(payload) && (
                <div className="ew-cards-column">
                  {payload.map((cust, i) => (
                    <CustomerCard key={cust.name || i} customer={cust} />
                  ))}
                </div>
              )}

              {type === 'site_visits' && Array.isArray(payload) && (
                <div className="ew-cards-column">
                  {payload.map((visit, i) => (
                    <SiteVisitCard key={visit.id || i} visit={visit} />
                  ))}
                </div>
              )}

              {type === 'follow_ups' && Array.isArray(payload) && (
                <div className="ew-cards-column">
                  {payload.map((fu, i) => (
                    <FollowUpCard key={fu.id || i} followUp={fu} />
                  ))}
                </div>
              )}

              {type === 'dashboard_stats' && payload && (
                <DashboardStatsCard stats={payload} />
              )}

              {type === 'greeting_actions' && (
                <GreetingActionsCard actions={actions} onAction={onQuickAction} />
              )}

              {/* Render regular quick actions if available */}
              {type !== 'greeting_actions' && type !== 'booking_review' && type !== 'booking_confirmation' && type !== 'booking_summary' && actions && actions.length > 0 && (
                <div className="ew-actions-button-grid" style={{ marginTop: 12 }}>
                  {actions
                    .filter(act => act !== 'select_property' && act !== 'reset_booking')
                    .map(act => {
                      let label = act;
                      if (act === 'book_property' || act === 'book') label = 'Book Property';
                      if (act === 'check_availability' || act === 'search') label = 'Check Availability';
                      if (act === 'view_booking_history' || act === 'history') label = 'Booking History';
                      if (act === 'confirm_booking') label = 'Confirm Booking';
                      if (act === 'cancel_booking') label = 'Cancel';
                      if (act === 'reset_booking') label = 'New Session';
                      if (act === 'select_property') label = 'Select Property';

                      return (
                        <button
                          key={act}
                          onClick={() => onQuickAction && onQuickAction(act)}
                          className="ew-actions-grid-btn"
                        >
                          {label}
                        </button>
                      );
                    })}
                </div>
              )}

              <ReactionBar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
