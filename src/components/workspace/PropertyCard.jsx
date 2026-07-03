import React from 'react';
import { CheckCircle } from 'lucide-react';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'RE';

const GRADIENTS = [
  'linear-gradient(135deg, #1a2a4a 0%, #2563eb 100%)',
  'linear-gradient(135deg, #162038 0%, #1d4ed8 100%)',
  'linear-gradient(135deg, #0f1f3a 0%, #3b82f6 100%)',
  'linear-gradient(135deg, #131a2e 0%, #1e40af 100%)',
  'linear-gradient(135deg, #0c1828 0%, #2563eb 100%)',
];

const PropertyCard = ({ property, index = 0, onSelect, onViewDetails, disabled }) => {
  const { unit, project, price, type, city, status } = property;
  const available = !status || status === 'Available';

  return (
    <div className={`ew-property-card${property.selected ? ' selected' : ''}`}>
      <div className="ew-property-card-img" style={{ background: GRADIENTS[index % GRADIENTS.length] }}>
        <span className="ew-property-card-img-initials">{getInitials(project)}</span>
        <span className={`ew-property-badge${!available ? ' booked' : ''}`}>
          {available ? 'Available' : 'Booked'}
        </span>
      </div>

      <div className="ew-property-card-body">
        <div className="ew-property-card-header">
          <div>
            <div className="ew-property-card-project">{project || 'Property'}</div>
            <div className="ew-property-card-unit">Unit {unit}</div>
          </div>
          <div className="ew-property-card-price">{price || '—'}</div>
        </div>

        <div className="ew-property-card-meta">
          {type && (
            <div className="ew-property-card-meta-item">
              <span className="ew-property-card-meta-label">BHK</span>
              <span className="ew-property-card-meta-value">{type} BHK</span>
            </div>
          )}
          {city && (
            <div className="ew-property-card-meta-item">
              <span className="ew-property-card-meta-label">Location</span>
              <span className="ew-property-card-meta-value">{city}</span>
            </div>
          )}
        </div>

        <div className="ew-property-card-actions">
          {property.selected ? (
            <button className="ew-btn ew-btn-secondary ew-btn-sm" disabled style={{ cursor: 'default' }}>
              <CheckCircle size={12} /> Selected
            </button>
          ) : (
            <button
              id={`prop-select-${unit}`}
              className="ew-btn ew-btn-primary ew-btn-sm"
              onClick={() => !disabled && onSelect && onSelect(property)}
              disabled={disabled || !available}
            >
              Continue Booking
            </button>
          )}
          <button
            id={`prop-details-${unit}`}
            className="ew-btn ew-btn-secondary ew-btn-sm"
            onClick={() => onViewDetails && onViewDetails(property)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
