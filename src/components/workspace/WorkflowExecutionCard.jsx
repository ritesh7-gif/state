import React from 'react';
import { Building2, CheckCircle, Activity, UserCheck, CreditCard, Bell, MapPin } from 'lucide-react';

const getIconForAgent = (agentName) => {
  const name = agentName.toLowerCase();
  if (name.includes('search') || name.includes('property') || name.includes('inventory')) return <Building2 size={16} />;
  if (name.includes('booking') || name.includes('reserve')) return <CheckCircle size={16} />;
  if (name.includes('crm') || name.includes('customer') || name.includes('lead')) return <UserCheck size={16} />;
  if (name.includes('finance') || name.includes('payment')) return <CreditCard size={16} />;
  if (name.includes('site visit') || name.includes('tour')) return <MapPin size={16} />;
  if (name.includes('notification') || name.includes('sms') || name.includes('mail')) return <Bell size={16} />;
  return <Activity size={16} />;
};

const WorkflowExecutionCard = ({ payload }) => {
  if (!payload) return null;

  return (
    <div className="ew-custom-card" style={{ width: '100%' }}>
      <div className="ew-card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
        <div className="ew-card-icon-wrapper" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <Activity size={18} strokeWidth={2.5} />
        </div>
        <div className="ew-card-title-group">
          <span className="ew-card-title">{payload.request_id || 'Workflow Execution'}</span>
          <span className="ew-card-subtitle">Status: {payload.status} • {payload.progress}% Progress</span>
        </div>
        <span className="ew-card-badge status-completed">
          Success
        </span>
      </div>

      <div className="ew-card-body" style={{ padding: '0 4px' }}>
        <div className="ew-workflow-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          {/* Vertical line connecting steps */}
          <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)', zIndex: 0 }}></div>
          
          {payload.agents && payload.agents.map((agent, index) => (
            <div key={index} className="ew-workflow-step" style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: agent.status === 'Completed' ? 'var(--accent)' : 'var(--bg-hover)', 
                color: agent.status === 'Completed' ? '#fff' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: '4px solid var(--bg-secondary)'
              }}>
                {getIconForAgent(agent.name)}
              </div>
              <div className="ew-workflow-step-content" style={{ flex: 1, background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>{agent.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500 }}>{agent.status}</span>
                </div>
                {agent.actions && agent.actions.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '12px', lineHeight: '1.5' }}>
                    {agent.actions.map((action, actIdx) => (
                      <li key={actIdx} style={{ marginBottom: '4px' }}>{action}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {payload.summary && (
          <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-hover)', borderRadius: '6px', fontSize: '12px', color: 'var(--text-primary)', borderLeft: '3px solid var(--accent)' }}>
            <strong>Summary:</strong> {payload.summary}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowExecutionCard;
