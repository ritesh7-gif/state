import React from 'react';
import {
  Building2,
  SquarePen,
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  PanelLeft,
  MessageSquare,
  MoreHorizontal,
  Share2,
  Pin,
  Pencil,
  Trash2,
  Bot
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'chat',      icon: SquarePen,      tooltip: 'New Conversation', label: 'New Conversation' },
  { id: 'dashboard', icon: LayoutDashboard, tooltip: 'Dashboard',        label: 'Dashboard'        },
];

export const PROVISIONAL_AGENTS = [
  { id: 'a0', name: 'Super Agent', desc: 'Combines all agents and handles all topics' },
  { id: 'a1', name: 'Lead & Follow-up Agent', desc: 'Manages leads and follow-ups' },
  { id: 'a3', name: 'Site Visit Agent', desc: 'Schedules and manages visits' },
  { id: 'a4', name: 'Booking Agent', desc: 'Handles inventory & bookings' },
  { id: 'a5', name: 'CRM Agent', desc: 'Manages customer records' },
  { id: 'a6', name: 'Financial Agent', desc: 'Provides financial analysis and advice' },
  { id: 'a7', name: 'Property Search Agent', desc: 'Searches inventory for matching properties' },
  { id: 'a8', name: 'Project Information Agent', desc: 'Provides detailed information on projects, amenities, and builders' },
];

const Sidebar = ({
  currentView,
  setView,
  resetChat,
  bookingsCount,
  onQuickAction,
  isExpanded,
  onToggle,
  onProfileClick,
  conversations = [],
  setConversations,
  activeConversationId,
  setActiveConversationId,
  activeAgentId,
  setActiveAgentId
}) => {
  const [openMenuId, setOpenMenuId] = React.useState(null);
  const [renamingId, setRenamingId] = React.useState(null);
  const [renameText, setRenameText] = React.useState('');
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNewChat = () => {
    resetChat();
  };

  const handleDeleteHistory = (id, e) => {
    e.stopPropagation();
    setConversations(prev => {
      const next = prev.filter(item => item.id !== id);
      if (id === activeConversationId) {
        if (next.length > 0) {
          setActiveConversationId(next[0].id);
        } else {
          // If no conversations remain, create a new one
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
          setActiveConversationId(newId);
          return [newConv];
        }
      }
      return next;
    });
    setOpenMenuId(null);
  };

  const handleRenameHistory = (id, e) => {
    e.stopPropagation();
    const currentItem = conversations.find(item => item.id === id);
    if (currentItem) {
      setRenamingId(id);
      setRenameText(currentItem.title);
    }
    setOpenMenuId(null);
  };

  const handlePinHistory = (id, e) => {
    e.stopPropagation();
    setConversations(prev => prev.map(item => 
      item.id === id ? { ...item, pinned: !item.pinned } : item
    ));
    setOpenMenuId(null);
  };

  const sortedHistory = [...conversations].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <aside className={`ew-sidebar${isExpanded ? ' expanded' : ''}`}>
      {/* Header with logo & toggle */}
      <div className="ew-sb-header">
        {isExpanded ? (
          <>
            <div className="ew-sb-brand">
              <div className="ew-sb-logo-static">
                <Building2 size={16} color="white" strokeWidth={2.5} />
              </div>
              <span className="ew-sb-brand-name">PropAgentOS</span>
            </div>
            <button
              className="ew-sb-toggle-btn-corner"
              onClick={onToggle}
              title="Collapse sidebar"
            >
              <PanelLeft size={16} strokeWidth={2} />
            </button>
          </>
        ) : (
          <button
            className="ew-sb-logo-btn"
            onClick={onToggle}
            title="Expand sidebar"
          >
            <div className="ew-sb-logo-icon-wrapper">
              <Building2 className="ew-sb-logo-icon" size={16} color="white" strokeWidth={2.5} />
              <Menu className="ew-sb-menu-icon" size={16} color="white" strokeWidth={2.5} />
            </div>
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav className="ew-sb-nav">
        {NAV_ITEMS.map(({ id, icon: Icon, tooltip, label }) => {
          const isNewChat = id === 'chat';
          return (
            <button
              key={id}
              id={`sb-${id}`}
              data-tooltip={tooltip}
              className={`ew-sb-icon${!isNewChat && currentView === id ? ' active' : ''}`}
              onClick={isNewChat ? handleNewChat : () => setView(id)}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span className="ew-sb-icon-label" style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s', width: isExpanded ? 'auto' : 0, overflow: 'hidden', pointerEvents: isExpanded ? 'auto' : 'none', marginLeft: isExpanded ? '12px' : 0 }}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Agents List Section */}
      <div className="ew-sb-history" style={{ 
        opacity: isExpanded ? 1 : 0, 
        pointerEvents: isExpanded ? 'auto' : 'none',
        transition: 'opacity 0.2s ease',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        <div className="ew-sb-history-header">
          <span>My Agents</span>
        </div>
          <div className="ew-sb-history-list">
            {PROVISIONAL_AGENTS.map(agent => (
              <div 
                key={agent.id} 
                className={`ew-sb-history-item ${activeAgentId === agent.id ? 'active-agent' : ''}`}
                title={agent.desc}
                onClick={() => {
                  setActiveAgentId(agent.id);
                  setView('chat');
                }}
                style={{ 
                  cursor: 'pointer', 
                  height: 'auto', 
                  padding: '10px 12px',
                  backgroundColor: activeAgentId === agent.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: activeAgentId === agent.id ? '1px solid #3b82f6' : '1px solid transparent',
                  borderLeft: activeAgentId === agent.id ? '3px solid #3b82f6' : '3px solid transparent',
                  borderRadius: '8px',
                  margin: '0 8px 4px 8px',
                  width: 'auto',
                  alignSelf: 'stretch',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden', width: '100%' }}>
                  <span className="ew-sb-history-title" style={{ 
                    color: activeAgentId === agent.id ? '#60a5fa' : 'var(--text-main)', 
                    fontSize: '13px', 
                    fontWeight: activeAgentId === agent.id ? '600' : '500',
                    lineHeight: '1.2', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {agent.name}
                  </span>
                  <span style={{ 
                    color: activeAgentId === agent.id ? 'var(--text-primary)' : 'var(--text-muted)', 
                    fontSize: '11px', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {agent.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* Bottom: Settings + Profile / Logout */}
      <div className="ew-sb-bottom">
        <button
          id="sb-settings"
          data-tooltip="Settings"
          className={`ew-sb-icon${currentView === 'settings' ? ' active' : ''}`}
          onClick={() => setView('settings')}
        >
          <Settings size={18} strokeWidth={1.75} />
          <span className="ew-sb-icon-label" style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s', width: isExpanded ? 'auto' : 0, overflow: 'hidden', pointerEvents: isExpanded ? 'auto' : 'none', marginLeft: isExpanded ? '12px' : 0 }}>Settings</span>
        </button>

        <button
          id="sb-logout"
          data-tooltip="Sign out"
          className="ew-sb-icon"
          onClick={() => window.location.href = '/login'}
        >
          <LogOut size={17} strokeWidth={1.75} />
          <span className="ew-sb-icon-label" style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s', width: isExpanded ? 'auto' : 0, overflow: 'hidden', pointerEvents: isExpanded ? 'auto' : 'none', marginLeft: isExpanded ? '12px' : 0 }}>Sign out</span>
        </button>

        {/* Profile Details when expanded */}
        {(() => {
          const storedName = localStorage.getItem('ew_set_profile_name') || 'Jane Doe';
          const storedRole = localStorage.getItem('ew_set_profile_role') || 'Senior Sales Manager';
          const initials = storedName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'JD';
          return isExpanded ? (
            <div className="ew-sb-profile" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
              <div
                id="sb-avatar"
                className="ew-sb-avatar"
                style={{ width: 28, height: 28, fontSize: 11 }}
              >
                {initials}
              </div>
              <div className="ew-sb-profile-info">
                <span className="ew-sb-profile-name">{storedName}</span>
                <span className="ew-sb-profile-role">{storedRole}</span>
              </div>
            </div>
          ) : (
            <div
              id="sb-avatar"
              className="ew-sb-avatar"
              title={`${storedName} — ${storedRole}`}
              style={{ marginTop: 8 }}
              onClick={onProfileClick}
            >
              {initials}
            </div>
          );
        })()}
      </div>
    </aside>
  );
};

export default Sidebar;
