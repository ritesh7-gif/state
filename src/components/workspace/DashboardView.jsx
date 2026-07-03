import React from 'react';
import { Landmark, Users, Calendar, Home, Search, Phone, FileText, TrendingUp, AlertCircle, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import '../../styles/workspace.css';

const DashboardView = ({ bookings, onQuickAction }) => {
  const confirmedCount = bookings ? bookings.filter(b => b.status === 'Confirmed').length : 0;
  
  // Hardcoded for demo of Sales Manager View
  const revenueMTD = "$2.4M";
  const pipelineValue = "$8.1M";
  const conversionRate = "14.2%";
  
  const kpis = [
    { label: "Revenue (MTD)", value: revenueMTD, icon: <Landmark size={18} />, color: "var(--success)", sub: "+12% vs last month", up: true },
    { label: "Pipeline Value", value: pipelineValue, icon: <TrendingUp size={18} />, color: "var(--accent)", sub: "Active deals", up: true },
    { label: "Conversion Rate", value: conversionRate, icon: <BarChart3 size={18} />, color: "var(--primary)", sub: "+2.1% this week", up: true },
    { label: "New Leads Today", value: 12, icon: <Users size={18} />, color: "var(--secondary)", sub: "3 high priority", up: true }
  ];

  const quickActions = [
    { id: 'book', label: 'Book Property', icon: <Landmark size={24} /> },
    { id: 'search', label: 'Search Inventory', icon: <Search size={24} /> },
    { id: 'customer', label: 'Find Customer', icon: <Users size={24} /> },
    { id: 'history', label: 'All Bookings', icon: <FileText size={24} /> }
  ];

  return (
    <div className="ew-dashboard-body">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>Manager Overview</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Real-time sales performance and pipeline analytics.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="ew-kpi-grid">
        {kpis.map((kpi, idx) => (
          <div className="ew-kpi-card" key={idx}>
            <div className="ew-kpi-card-header">
              <span className="ew-kpi-card-label">{kpi.label}</span>
              <div className="ew-kpi-card-icon" style={{ color: kpi.color, background: 'var(--bg-elevated)' }}>
                {kpi.icon}
              </div>
            </div>
            <div className="ew-kpi-card-value">{kpi.value}</div>
            <div className={`ew-kpi-card-sub ${kpi.up ? 'up' : 'down'}`}>
              <TrendingUp size={12} /> {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Pipeline & Actions */}
      <div className="ew-dashboard-row">
        
        {/* Sales Pipeline Funnel */}
        <div className="ew-dashboard-panel">
          <div className="ew-dashboard-panel-header">
            <span className="ew-dashboard-panel-title">Sales Pipeline</span>
          </div>
          <div className="ew-dashboard-panel-body" style={{ gap: '16px', padding: '20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><Users size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Leads Acquired</span>
                  <span style={{ color: 'var(--text-muted)' }}>1,240</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'var(--text-muted)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><Calendar size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Site Visits</span>
                  <span style={{ color: 'var(--text-muted)' }}>320 (25%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', background: 'var(--accent)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}><Phone size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Negotiations</span>
                  <span style={{ color: 'var(--text-muted)' }}>85 (6%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '6%', height: '100%', background: 'var(--warning)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}><CheckCircle2 size={18} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Closed Won</span>
                  <span style={{ color: 'var(--text-muted)' }}>18 (1.4%)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', background: 'var(--success)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Items / Follow-ups */}
        <div className="ew-dashboard-panel">
          <div className="ew-dashboard-panel-header">
            <span className="ew-dashboard-panel-title">Urgent Action Items</span>
          </div>
          <div className="ew-dashboard-panel-body" style={{ padding: '0 18px' }}>
            <div className="ew-followup-item">
              <div className="ew-followup-avatar" style={{ background: 'var(--danger-light)', color: 'var(--danger)' }}><AlertCircle size={16} /></div>
              <div className="ew-followup-info">
                <div className="ew-followup-name">Approve 5% Discount</div>
                <div className="ew-followup-detail">Unit A-402 • Requested by Priya S.</div>
              </div>
              <button className="ew-btn ew-btn-sm ew-btn-primary">Review</button>
            </div>
            
            <div className="ew-followup-item">
              <div className="ew-followup-avatar"><Clock size={16} /></div>
              <div className="ew-followup-info">
                <div className="ew-followup-name">Overdue Follow-up: Ritesh Yadav</div>
                <div className="ew-followup-detail">High Value Lead • $1.2M potential</div>
              </div>
              <button className="ew-btn ew-btn-sm ew-btn-secondary">Reassign</button>
            </div>

            <div className="ew-followup-item">
              <div className="ew-followup-avatar" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}><FileText size={16} /></div>
              <div className="ew-followup-info">
                <div className="ew-followup-name">3 Pending Bookings</div>
                <div className="ew-followup-detail">Awaiting Manager Sign-off</div>
              </div>
              <button className="ew-btn ew-btn-sm ew-btn-secondary">View All</button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: Team Performance */}
      <div className="ew-dashboard-panel">
        <div className="ew-dashboard-panel-header">
          <span className="ew-dashboard-panel-title">Team Performance</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="ew-booking-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Agent Name</th>
                <th>Active Leads</th>
                <th>Site Visits</th>
                <th>Closed Deals</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="ew-followup-avatar" style={{ width: '26px', height: '26px' }}>PS</div> <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Priya Sharma</span></div></td>
                <td>42</td>
                <td>12</td>
                <td>3</td>
                <td><span className="ew-badge ew-badge-success">7.1%</span></td>
              </tr>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="ew-followup-avatar" style={{ width: '26px', height: '26px' }}>AM</div> <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Amit Patel</span></div></td>
                <td>38</td>
                <td>14</td>
                <td>2</td>
                <td><span className="ew-badge ew-badge-success">5.2%</span></td>
              </tr>
              <tr>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div className="ew-followup-avatar" style={{ width: '26px', height: '26px' }}>RK</div> <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Ravi Kumar</span></div></td>
                <td>29</td>
                <td>6</td>
                <td>0</td>
                <td><span style={{ color: 'var(--text-muted)' }}>0.0%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Tools</h3>
        <div className="ew-quick-actions">
          {quickActions.map(action => (
            <div className="ew-quick-action-btn" key={action.id} onClick={() => onQuickAction && onQuickAction(action.id)}>
              <div className="ew-quick-action-icon">{action.icon}</div>
              <div className="ew-quick-action-label">{action.label}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardView;
