import React from 'react';
import { Home, Users, Search } from 'lucide-react';

const PlatformPreviewMockup = () => {
  return (
    <section className="section-light" style={{ padding: '80px 2rem 140px' }}>
      <div className="container">
        <div className="lp-section-header">
          <div className="lp-section-eyebrow">The Workspace</div>
          <h2>A Unified Command Center</h2>
          <p>Everything your team needs, unified in one elegant interface.</p>
        </div>

        <div className="lp-mockup-main" style={{ margin: '0 auto', animation: 'fadeUp 1s ease-out' }}>
          <div className="lp-mockup-header">
            <div className="lp-mockup-dot" style={{ background: '#ff5f56' }} />
            <div className="lp-mockup-dot" style={{ background: '#ffbd2e' }} />
            <div className="lp-mockup-dot" style={{ background: '#27c93f' }} />
          </div>
          <div className="lp-mockup-content">
            <div className="lp-mockup-sidebar" style={{ gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', fontWeight: 600, color: '#0f172a' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0052FF' }} />
                Active Workspace
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,82,255,0.1)', color: '#0052FF', fontWeight: 600, fontSize: '0.9rem' }}>
                <Home size={18} /> CRM Dashboard
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                <Users size={18} /> Customers
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem', color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                <Search size={18} /> Properties
              </div>
            </div>
            <div className="lp-mockup-body" style={{ background: '#f8fafc', padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
                <div style={{ flex: 1, background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 600 }}>Chat Interface</div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="lp-mockup-chat-bubble lp-mockup-chat-user">Show me properties in downtown.</div>
                    <div className="lp-mockup-chat-bubble lp-mockup-chat-ai">Found 3 properties matching your criteria.</div>
                  </div>
                </div>
                <div style={{ width: '320px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontWeight: 600 }}>Customer Profile</div>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Name</div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>Sarah Jenkins</div>
                  </div>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Budget</div>
                    <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>$1.5M - $2M</div>
                  </div>
                  <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Status</div>
                    <div style={{ fontWeight: 600, color: '#0052FF', marginTop: '0.25rem' }}>High Intent Lead</div>
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
