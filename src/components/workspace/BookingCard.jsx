import React, { useState } from 'react';
import { FileText, CheckCircle, X, User, Building2 } from 'lucide-react';

const BookingCard = ({ payload, onConfirm, onCancel }) => {
  const [clicked, setClicked] = useState(false);

  if (!payload) return null;

  const {
    customer_name,
    customerName,
    property_unit,
    unit,
    project_name,
    project,
    price,
    token_amount,
    amount,
    booking_id,
    id,
    status
  } = payload;

  const c_name = customer_name || customerName;
  const p_unit = property_unit || unit;
  const p_name = project_name || project;
  const p_amount = token_amount || amount;
  const b_id = booking_id || id;

  if (status === 'confirmed' || status === 'CONFIRMED') {
    return (
      <div className="ew-booking-success-card" style={{
        background: 'var(--success-light)',
        border: '1px solid var(--success-border)',
        borderRadius: 'var(--r-xl)',
        padding: '20px',
        maxWidth: '440px',
        margin: '16px 0 8px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--success)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckCircle size={16} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--success)' }}>Booking Confirmed</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {b_id && (
            <div style={{ marginBottom: '12px' }}>
              <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Booking ID:</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{b_id}</span>
            </div>
          )}
          <p style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontWeight: '500' }}>
            The booking has been successfully registered.
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-muted)' }}>
            A confirmation has been recorded and the property status has been updated.
          </p>
        </div>
      </div>
    );
  }

  const rows = [
    { label: 'Customer',        value: c_name },
    { label: 'Property',        value: p_unit ? `Unit ${p_unit}` : null },
    { label: 'Project',         value: p_name },
    { label: 'Price',           value: price, price: true },
    { label: 'Booking Amount',  value: p_amount, price: true },
    { label: 'Sales Executive', value: 'Rahul Mehta' },
    { label: 'Date & Time',     value: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
    { label: 'Status',          value: status || 'Ready for Confirmation' },
  ].filter(r => r.value);

  const handleConfirm = () => {
    setClicked(true);
    if (onConfirm) {
      onConfirm(payload);
    }
  };

  const handleCancel = () => {
    setClicked(true);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="ew-booking-review-card">
      {/* Header */}
      <div className="ew-booking-review-header">
        <div className="ew-booking-review-icon">
          <FileText size={16} strokeWidth={2} />
        </div>
        <div>
          <div className="ew-booking-review-title">Booking Summary</div>
          <div className="ew-booking-review-subtitle">Review details before confirming</div>
        </div>
      </div>

      {/* Rows */}
      <div className="ew-booking-review-body">
        {rows.map(({ label, value, price: isPrice }) => (
          <div key={label} className="ew-booking-review-row">
            <span className="ew-booking-review-row-label">{label}</span>
            <span className={`ew-booking-review-row-value${isPrice ? ' price' : ''}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="ew-booking-review-actions">
        <button
          id="booking-confirm-btn"
          className="ew-btn ew-btn-primary ew-btn-sm"
          onClick={handleConfirm}
          disabled={clicked}
          style={{ flex: 1 }}
        >
          <CheckCircle size={13} strokeWidth={2.5} />
          Confirm Booking
        </button>
        <button
          id="booking-cancel-btn"
          className="ew-btn ew-btn-secondary ew-btn-sm"
          onClick={handleCancel}
          disabled={clicked}
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <X size={13} strokeWidth={2.5} style={{ display: 'none' }} />
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
