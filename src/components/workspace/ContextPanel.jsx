import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const BOOKING_STEPS = [
  { id: 1, label: 'Property Selection' },
  { id: 2, label: 'Customer Info' },
  { id: 3, label: 'Booking Review' },
  { id: 4, label: 'Confirmed' },
];

const getStepState = (stepId, activeStep) => {
  if (stepId < activeStep) return 'done';
  if (stepId === activeStep) return 'active';
  return '';
};

const getStatusClass = (status) => {
  if (!status) return 'ew-badge-accent';
  const s = status.toLowerCase();
  if (s === 'confirmed') return 'ew-badge-success';
  if (s === 'pending') return 'ew-badge-warning';
  if (s === 'cancelled') return 'ew-badge-danger';
  return 'ew-badge-accent';
};

const ContextPanel = ({
  customerContext,
  propertyContext,
  bookingContext,
  activeAgentStep,
  bookings,
}) => {
  const hasCustomer = customerContext?.name;
  const hasProperty = propertyContext?.project || propertyContext?.unit;
  const hasBooking  = bookingContext?.status;
  const showProgress = hasProperty || hasCustomer || hasBooking;

  const recentBookings = (bookings || []).slice(-4).reverse();

  return (
    <aside className="ew-context-panel">
      {/* Header */}
      <div className="ew-context-header">
        <span className="ew-context-header-title">Live Context</span>
      </div>

      <div className="ew-context-body">

        {/* Current Customer */}
        <div className="ew-context-section">
          <div className="ew-context-section-label">Current Customer</div>
          {hasCustomer ? (
            <div className="ew-context-card">
              <div className="ew-context-field">
                <span className="ew-context-field-label">Name</span>
                <span className="ew-context-field-value">{customerContext.name}</span>
              </div>
              {customerContext.phone && (
                <div className="ew-context-field">
                  <span className="ew-context-field-label">Phone</span>
                  <span className="ew-context-field-value">{customerContext.phone}</span>
                </div>
              )}
              {customerContext.email && (
                <div className="ew-context-field">
                  <span className="ew-context-field-label">Email</span>
                  <span className="ew-context-field-value" style={{ wordBreak: 'break-all', fontSize: '0.75rem' }}>
                    {customerContext.email}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="ew-context-empty">No customer selected</div>
          )}
        </div>

        {/* Selected Property */}
        <div className="ew-context-section">
          <div className="ew-context-section-label">Selected Property</div>
          {hasProperty ? (
            <div className="ew-context-card">
              {propertyContext.project && (
                <div className="ew-context-field">
                  <span className="ew-context-field-label">Project</span>
                  <span className="ew-context-field-value">{propertyContext.project}</span>
                </div>
              )}
              {propertyContext.unit && (
                <div className="ew-context-field">
                  <span className="ew-context-field-label">Unit</span>
                  <span className="ew-context-field-value">{propertyContext.unit}</span>
                </div>
              )}
              {propertyContext.price && (
                <div className="ew-context-field">
                  <span className="ew-context-field-label">Price</span>
                  <span className="ew-context-field-value" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {propertyContext.price}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="ew-context-empty">No property selected</div>
          )}
        </div>

        {/* Booking Progress */}
        {showProgress && (
          <div className="ew-context-section">
            <div className="ew-context-section-label">Booking Progress</div>
            <div className="ew-progress-steps">
              {BOOKING_STEPS.map((step) => {
                const state = getStepState(step.id, activeAgentStep);
                return (
                  <div key={step.id} className={`ew-progress-step${state ? ` ${state}` : ''}`}>
                    <div className="ew-progress-step-num">
                      {state === 'done' ? (
                        <CheckCircle size={11} strokeWidth={3} />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="ew-progress-step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        <div className="ew-context-section">
          <div className="ew-context-section-label">Recent Bookings</div>
          {recentBookings.length > 0 ? (
            <div className="ew-context-card" style={{ padding: 'var(--sp-2) var(--sp-3)' }}>
              {recentBookings.map((b, i) => (
                <div key={b.id || i} className="ew-activity-item">
                  <div className="ew-activity-item-main">
                    <span className="ew-activity-item-name">{b.customerName || b.customer_name}</span>
                    <span className="ew-activity-item-amount">{b.amount}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="ew-activity-item-sub">Unit {b.unit || b.property_unit}</span>
                    <span className={`ew-badge ${getStatusClass(b.status)}`} style={{ fontSize: '0.625rem' }}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ew-context-empty">No bookings yet</div>
          )}
        </div>

        {/* Current Workflow */}
        {hasBooking && (
          <div className="ew-context-section">
            <div className="ew-context-section-label">Current Workflow</div>
            <div className="ew-context-card">
              <div className="ew-context-field">
                <span className="ew-context-field-label">Status</span>
                <span className={`ew-badge ${getStatusClass(bookingContext.status)}`} style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                  {bookingContext.status}
                </span>
              </div>
              {bookingContext.amount && (
                <div className="ew-context-field">
                  <span className="ew-context-field-label">Token Amount</span>
                  <span className="ew-context-field-value" style={{ color: 'var(--success)', fontWeight: 600 }}>
                    {bookingContext.amount}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </aside>
  );
};

export default ContextPanel;
