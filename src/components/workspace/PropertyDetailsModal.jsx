import React from 'react';
import { X, Shield, Award, Maximize2, Tag } from 'lucide-react';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'RE';

const GRADIENTS = [
  'linear-gradient(135deg, #1a2a4a 0%, #2563eb 100%)',
  'linear-gradient(135deg, #162038 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #0f1f3a 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #131a2e 0%, #1e40af 100%)',
  'linear-gradient(135deg, #0c1828 0%, #2563eb 100%)',
];

const PropertyDetailsModal = ({ property, onClose, onSelect }) => {
  const { unit, project, price, type, city, status, builder, area, amenities = [] } = property;
  const available = !status || status === 'Available';
  const bannerBg = GRADIENTS[Math.abs(unit.charCodeAt(0) + unit.charCodeAt(unit.length - 1)) % GRADIENTS.length];

  return (
    <div className="ew-modal-backdrop" onClick={onClose}>
      <div className="ew-modal-content" onClick={e => e.stopPropagation()}>

        {/* Banner */}
        <div className="ew-modal-header-banner" style={{ background: bannerBg }}>
          <span className="ew-modal-header-initials">{getInitials(project)}</span>
          <span className={`ew-modal-badge${!available ? ' booked' : ''}`}>
            {available ? 'Available' : 'Booked'}
          </span>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Body */}
        <div className="ew-modal-body">
          <div className="ew-modal-title-row">
            <div>
              <div className="ew-modal-project">{project}</div>
              <div className="ew-modal-unit">Unit {unit} · {city}</div>
            </div>
            <div className="ew-modal-price">{price}</div>
          </div>

          {/* Grid specifications */}
          <div className="ew-modal-grid">
            <div className="ew-modal-grid-item">
              <span className="ew-modal-grid-label">
                <Award size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                Builder
              </span>
              <span className="ew-modal-grid-val">{builder || 'Premium Builder'}</span>
            </div>
            <div className="ew-modal-grid-item">
              <span className="ew-modal-grid-label">
                <Maximize2 size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                Super Area
              </span>
              <span className="ew-modal-grid-val">{area || '1200 sqft'}</span>
            </div>
            <div className="ew-modal-grid-item">
              <span className="ew-modal-grid-label">
                <Shield size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                Configuration
              </span>
              <span className="ew-modal-grid-val">{type} BHK Apartment</span>
            </div>
            <div className="ew-modal-grid-item">
              <span className="ew-modal-grid-label">
                <Tag size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                Status
              </span>
              <span className="ew-modal-grid-val">{status || 'Available'}</span>
            </div>
          </div>

          {/* Amenities tags */}
          {amenities.length > 0 && (
            <div>
              <div className="ew-modal-section-title">Amenities & Features</div>
              <div className="ew-modal-amenities-tags">
                {amenities.map((amenity, i) => (
                  <span key={i} className="ew-modal-amenity-tag">{amenity}</span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="ew-modal-actions">
            <button className="ew-btn ew-btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Close
            </button>
            <button
              className="ew-btn ew-btn-primary"
              onClick={() => onSelect(property)}
              disabled={!available}
              style={{ flex: 1.5 }}
            >
              Continue Booking
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PropertyDetailsModal;
