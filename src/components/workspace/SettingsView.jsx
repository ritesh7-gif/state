import React, { useState } from 'react';
import {
  User,
  Bell,
  Palette,
  Check,
  Phone,
  MapPin,
  Mail
} from 'lucide-react';

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [savingTab, setSavingTab] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. General Profile State
  const [profileName, setProfileName] = useState(() => localStorage.getItem('ew_set_profile_name') || 'Jane Doe');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('ew_set_profile_email') || 'jane.doe@realstate.ai');
  const [profileRole, setProfileRole] = useState(() => localStorage.getItem('ew_set_profile_role') || 'Senior Sales Manager');
  const [profileAgency, setProfileAgency] = useState(() => localStorage.getItem('ew_set_profile_agency') || 'RealState Enterprise Group');
  const [profilePhone, setProfilePhone] = useState(() => localStorage.getItem('ew_set_profile_phone') || '+91 98765 43210');
  const [profileLocation, setProfileLocation] = useState(() => localStorage.getItem('ew_set_profile_location') || 'Pune, MH Office');

  // 2. Notifications State
  const [notifDesktop, setNotifDesktop] = useState(() => localStorage.getItem('ew_set_notif_desktop') !== 'false');
  const [notifBooking, setNotifBooking] = useState(() => localStorage.getItem('ew_set_notif_booking') !== 'false');
  const [notifSiteVisit, setNotifSiteVisit] = useState(() => localStorage.getItem('ew_set_notif_sitevisit') !== 'false');
  const [notifFollowup, setNotifFollowup] = useState(() => localStorage.getItem('ew_set_notif_followup') !== 'false');
  const [notifDailyReport, setNotifDailyReport] = useState(() => localStorage.getItem('ew_set_notif_dailyreport') === 'true');
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem('ew_set_notif_email') !== 'false');
  const [notifSound, setNotifSound] = useState(() => localStorage.getItem('ew_set_notif_sound') !== 'false');

  // 3. Appearance State
  const [theme, setTheme] = useState(() => localStorage.getItem('ew_set_theme') || 'Dark');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('ew_set_accent') || 'Blue');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('ew_set_fontsize') || 'Comfortable');
  const [sidebarState, setSidebarState] = useState(() => localStorage.getItem('ew_set_sidebar_state') || 'Expanded');
  const [chatDensity, setChatDensity] = useState(() => localStorage.getItem('ew_set_chat_density') || 'Comfortable');

  // Save changes handler with simulated 700ms loading and toast alert
  const triggerSave = (tabName, saveCallback) => {
    setSavingTab(tabName);
    setTimeout(() => {
      saveCallback();
      setSavingTab(null);
      setToastMessage('Changes saved successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2400);
    }, 700);
  };

  const handleSaveGeneral = () => {
    triggerSave('general', () => {
      localStorage.setItem('ew_set_profile_name', profileName);
      localStorage.setItem('ew_set_profile_email', profileEmail);
      localStorage.setItem('ew_set_profile_role', profileRole);
      localStorage.setItem('ew_set_profile_agency', profileAgency);
      localStorage.setItem('ew_set_profile_phone', profilePhone);
      localStorage.setItem('ew_set_profile_location', profileLocation);
    });
  };

  const handleSaveNotif = () => {
    triggerSave('notif', () => {
      localStorage.setItem('ew_set_notif_desktop', String(notifDesktop));
      localStorage.setItem('ew_set_notif_booking', String(notifBooking));
      localStorage.setItem('ew_set_notif_sitevisit', String(notifSiteVisit));
      localStorage.setItem('ew_set_notif_followup', String(notifFollowup));
      localStorage.setItem('ew_set_notif_dailyreport', String(notifDailyReport));
      localStorage.setItem('ew_set_notif_email', String(notifEmail));
      localStorage.setItem('ew_set_notif_sound', String(notifSound));
    });
  };

  const handleSaveAppearance = () => {
    triggerSave('appearance', () => {
      localStorage.setItem('ew_set_theme', theme);
      localStorage.setItem('ew_set_accent', accentColor);
      localStorage.setItem('ew_set_fontsize', fontSize);
      localStorage.setItem('ew_set_sidebar_state', sidebarState);
      localStorage.setItem('ew_set_chat_density', chatDensity);

      // Apply theme globally
      if (theme === 'Light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
    });
  };

  const navItems = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  return (
    <div className="ew-settings-layout" style={{ height: 'auto', minHeight: 460 }}>
      {/* Sidebar Navigation */}
      <div className="ew-settings-sidebar">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`ew-settings-nav-item${activeTab === item.id ? ' active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Panel */}
      <div className="ew-settings-content" style={{ padding: '24px 32px' }}>
        
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <>
            <div>
              <h2 className="ew-settings-section-title">General Settings</h2>
              <p className="ew-settings-section-desc">Manage your professional profile and chatbot account details.</p>
            </div>

            <div className="ew-settings-card">
              <span className="ew-settings-card-title">Profile Information</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.25)'
                }}>
                  {profileName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'M'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 650, color: 'var(--text-primary)' }}>Profile Photo</span>
                  <button className="ew-btn ew-btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }}>
                    Upload New
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="ew-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="ew-form-label">Sales Manager Name</label>
                  <input
                    className="ew-form-input"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="ew-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="ew-form-label">Email Address</label>
                  <input
                    className="ew-form-input"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="manager@realstate.ai"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="ew-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="ew-form-label">Role</label>
                  <input
                    className="ew-form-input"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    placeholder="Sales Lead"
                  />
                </div>
                <div className="ew-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="ew-form-label">Agency Name</label>
                  <input
                    className="ew-form-input"
                    value={profileAgency}
                    onChange={(e) => setProfileAgency(e.target.value)}
                    placeholder="RealState Agency"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="ew-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="ew-form-label">Phone Number</label>
                  <input
                    className="ew-form-input"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 99999 99999"
                  />
                </div>
                <div className="ew-form-group" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label className="ew-form-label">Office Location</label>
                  <input
                    className="ew-form-input"
                    value={profileLocation}
                    onChange={(e) => setProfileLocation(e.target.value)}
                    placeholder="Pune, India"
                  />
                </div>
              </div>

              <button
                className="ew-btn"
                style={{ width: 'fit-content', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={handleSaveGeneral}
                disabled={savingTab === 'general'}
              >
                {savingTab === 'general' ? <div className="ew-spinner" /> : <Check size={14} />}
                Save Changes
              </button>
            </div>
          </>
        )}

        {/* Tab 2: Notifications */}
        {activeTab === 'notifications' && (
          <>
            <div>
              <h2 className="ew-settings-section-title">Notification Configuration</h2>
              <p className="ew-settings-section-desc">Manage system triggers, sound alerts, and email notifications.</p>
            </div>

            <div className="ew-settings-card">
              <span className="ew-settings-card-title">System & Alerts</span>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Desktop Notifications</span>
                  <span className="ew-toggle-desc">Show windows prompt boxes.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifDesktop} onChange={(e) => setNotifDesktop(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Booking Completed Alert</span>
                  <span className="ew-toggle-desc">Trigger notification when booking is confirmed.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifBooking} onChange={(e) => setNotifBooking(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Site Visit Reminder</span>
                  <span className="ew-toggle-desc">Trigger notification prior to site visit schedules.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifSiteVisit} onChange={(e) => setNotifSiteVisit(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Pending Follow-up Reminder</span>
                  <span className="ew-toggle-desc">Daily checks for customer follow-up actions.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifFollowup} onChange={(e) => setNotifFollowup(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Daily Sales Report</span>
                  <span className="ew-toggle-desc">Generate CSV digests at the end of the day.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifDailyReport} onChange={(e) => setNotifDailyReport(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Email Notifications</span>
                  <span className="ew-toggle-desc">Send workspace summary emails.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Sound Alerts</span>
                  <span className="ew-toggle-desc">Play diagnostic sounds.</span>
                </div>
                <label className="ew-toggle-switch">
                  <input type="checkbox" checked={notifSound} onChange={(e) => setNotifSound(e.target.checked)} />
                  <span className="ew-toggle-slider" />
                </label>
              </div>

              <button
                className="ew-btn"
                style={{ width: 'fit-content', marginTop: 8 }}
                onClick={handleSaveNotif}
                disabled={savingTab === 'notif'}
              >
                {savingTab === 'notif' && <div className="ew-spinner" style={{ display: 'inline-block', marginRight: 6 }} />}
                Save Alert Settings
              </button>
            </div>
          </>
        )}

        {/* Tab 3: Appearance */}
        {activeTab === 'appearance' && (
          <>
            <div>
              <h2 className="ew-settings-section-title">Appearance Customization</h2>
              <p className="ew-settings-section-desc">Manage typography, theme layouts, and active accent colors.</p>
            </div>

            <div className="ew-settings-card">
              <span className="ew-settings-card-title">Theme & Layout</span>

              {/* Theme Segmented Control */}
              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">System Theme</span>
                  <span className="ew-toggle-desc">Toggle layout appearance.</span>
                </div>
                <div className="ew-segmented-control">
                  {['Dark', 'Light', 'System'].map(t => (
                    <button
                      key={t}
                      className={`ew-segment-btn${theme === t ? ' active' : ''}`}
                      onClick={() => setTheme(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Segmented */}
              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Accent Color</span>
                  <span className="ew-toggle-desc">Select active highlights theme.</span>
                </div>
                <div className="ew-segmented-control">
                  {['Blue', 'Green', 'Purple'].map(color => (
                    <button
                      key={color}
                      className={`ew-segment-btn${accentColor === color ? ' active' : ''}`}
                      onClick={() => setAccentColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Segmented */}
              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Font Size</span>
                  <span className="ew-toggle-desc">Set overall workspace size metrics.</span>
                </div>
                <div className="ew-segmented-control">
                  {['Compact', 'Comfortable', 'Large'].map(sz => (
                    <button
                      key={sz}
                      className={`ew-segment-btn${fontSize === sz ? ' active' : ''}`}
                      onClick={() => setFontSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar Segmented */}
              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Sidebar Defaults</span>
                  <span className="ew-toggle-desc">Default navigation layout.</span>
                </div>
                <div className="ew-segmented-control">
                  {['Expanded', 'Collapsed'].map(sb => (
                    <button
                      key={sb}
                      className={`ew-segment-btn${sidebarState === sb ? ' active' : ''}`}
                      onClick={() => setSidebarState(sb)}
                    >
                      {sb}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Density Segmented */}
              <div className="ew-toggle-container">
                <div className="ew-toggle-label-group">
                  <span className="ew-toggle-title">Chat Density</span>
                  <span className="ew-toggle-desc">Determine margins for chat lists.</span>
                </div>
                <div className="ew-segmented-control">
                  {['Compact', 'Comfortable'].map(cd => (
                    <button
                      key={cd}
                      className={`ew-segment-btn${chatDensity === cd ? ' active' : ''}`}
                      onClick={() => setChatDensity(cd)}
                    >
                      {cd}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="ew-btn"
                style={{ width: 'fit-content', marginTop: 8 }}
                onClick={handleSaveAppearance}
                disabled={savingTab === 'appearance'}
              >
                {savingTab === 'appearance' && <div className="ew-spinner" style={{ display: 'inline-block', marginRight: 6 }} />}
                Save Appearance Settings
              </button>
            </div>
          </>
        )}
      </div>

      {/* Global Success Save Toast */}
      <div className={`ew-settings-toast${showToast ? ' show' : ''}`}>
        <Check size={16} />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};

export default SettingsView;
