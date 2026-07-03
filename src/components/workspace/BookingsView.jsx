import React from 'react';
import { Landmark, Search, FileText } from 'lucide-react';
import '../../styles/workspace.css';

const BookingsView = ({ bookings, onQuickAction }) => {
  return (
    <div className="ws-view-container" style={{ padding: '2.5rem', overflowY: 'auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>Booking History</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage and view all reservations.</p>
        </div>
        <button 
          onClick={() => onQuickAction && onQuickAction('book')}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', background: 'var(--primary)', color: 'var(--white)',
            borderRadius: 'var(--r-md)', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer'
          }}
        >
          <Landmark size={16} /> New Booking
        </button>
      </div>

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Booking ID</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer Name</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Property Unit</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((b, i) => (
                <tr key={b.id || i} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color 0.2s ease' }}>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{b.id}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--primary)' }}>{b.customerName}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: 500 }}>{b.unit}</td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--primary)' }}>{b.amount || '₹—'}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '4px',
                      background: b.status === 'Confirmed' ? '#DCFCE7' : '#FEF3C7',
                      color: b.status === 'Confirmed' ? '#166534' : '#92400E'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{b.timestamp || 'Recent'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <FileText size={32} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                  <p>No booking history found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsView;
