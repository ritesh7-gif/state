import React from 'react';

// Design 20 premium SVG real estate, proptech, and mortgage company logos (Scaled, Bolded, and Colorized on hover)
const CustomerLogos = [
  {
    id: 'rocket-mortgage',
    title: 'Rocket Mortgage',
    color: '#f43f5e', // Rocket Red/Rose
    node: (
      <svg viewBox="0 0 200 48" className="re-logo-svg" height="40" width="200" aria-hidden="true">
        <circle cx="24" cy="24" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M24 15 L31 24 L27 24 L27 31 L21 31 L21 24 L17 24 Z" fill="currentColor" />
        <text x="50" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="0.04em" fill="currentColor">ROCKET</text>
      </svg>
    )
  },
  {
    id: 'zillow',
    title: 'Zillow',
    color: '#3b82f6', // Zillow Blue
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <path d="M6 12 L26 12 L6 36 L26 36" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 21 L22 21" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        <text x="40" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="-0.04em" fill="currentColor">zillow</text>
      </svg>
    )
  },
  {
    id: 'compass',
    title: 'Compass',
    color: '#888888', // Compass Muted Charcoal
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <circle cx="22" cy="24" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M22 16 L25 24 L22 32 L19 24 Z" fill="currentColor" />
        <text x="48" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="0.08em" fill="currentColor">COMPASS</text>
      </svg>
    )
  },
  {
    id: 'cbre',
    title: 'CBRE',
    color: '#10b981', // CBRE Green
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <rect x="6" y="8" width="28" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
        <rect x="13" y="15" width="14" height="18" fill="currentColor" />
        <text x="46" y="33" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="25" letterSpacing="-0.02em" fill="currentColor">CBRE</text>
      </svg>
    )
  },
  {
    id: 'remax',
    title: 'RE/MAX',
    color: '#ef4444', // RE/MAX Red
    node: (
      <svg viewBox="0 0 190 48" className="re-logo-svg" height="40" width="190" aria-hidden="true">
        <path d="M6 10 L28 10 L28 26 C28 32 22 36 17 36 C12 36 6 32 6 26 Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M17 10 L17 36" stroke="currentColor" strokeWidth="2.5" />
        <text x="42" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="0.04em" fill="currentColor">RE/MAX</text>
      </svg>
    )
  },
  {
    id: 'coldwell-banker',
    title: 'Coldwell Banker',
    color: '#2563eb', // Coldwell Blue
    node: (
      <svg viewBox="0 0 210 48" className="re-logo-svg" height="40" width="210" aria-hidden="true">
        <rect x="6" y="8" width="32" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M14 24 L26 24 M20 16 L20 32" stroke="currentColor" strokeWidth="3" />
        <text x="48" y="30" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.04em" fill="currentColor">COLDWELL BANKER</text>
      </svg>
    )
  },
  {
    id: 'vanguard',
    title: 'Vanguard Builders',
    color: '#e11d48', // Vanguard Crimson
    node: (
      <svg viewBox="0 0 190 48" className="re-logo-svg" height="40" width="190" aria-hidden="true">
        <path d="M8 8 L22 3 L36 8 L36 21 C36 30 22 39 22 39 C22 39 8 30 8 21 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M14 13 L22 8 L30 13 L30 21 C30 27 22 33 22 33 C22 33 14 27 14 21 Z" fill="currentColor" />
        <text x="46" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="0.08em" fill="currentColor">VANGUARD</text>
      </svg>
    )
  },
  {
    id: 'sothebys',
    title: 'Sothebys',
    color: '#d97706', // Sotheby's Gold
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <text x="6" y="32" fontFamily="Georgia, serif" fontWeight="700" fontSize="25" letterSpacing="0.04em" fill="currentColor">Sotheby's</text>
      </svg>
    )
  },
  {
    id: 'redfin',
    title: 'Redfin',
    color: '#dc2626', // Redfin Red
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <path d="M6 26 L22 11 L38 26 L38 38 L6 38 Z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M16 26 L22 20 L28 26 M22 20 L22 35" stroke="currentColor" strokeWidth="2.5" />
        <text x="48" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="-0.04em" fill="currentColor">redfin</text>
      </svg>
    )
  },
  {
    id: 'opendoor',
    title: 'Opendoor',
    color: '#2563eb', // Opendoor Blue
    node: (
      <svg viewBox="0 0 200 48" className="re-logo-svg" height="40" width="200" aria-hidden="true">
        <path d="M6 26 L22 10 L38 26 L38 38 L6 38 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="22" cy="26" r="4.5" fill="currentColor" />
        <text x="48" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="23" letterSpacing="-0.03em" fill="currentColor">opendoor</text>
      </svg>
    )
  },
  {
    id: 'pacaso',
    title: 'Pacaso',
    color: '#14b8a6', // Pacaso Teal
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <path d="M6 8 L26 8 L26 28 C26 34 20 38 15 38 L6 38 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M13 15 L19 15 L19 30" stroke="currentColor" strokeWidth="3" />
        <text x="36" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="0.08em" fill="currentColor">PACASO</text>
      </svg>
    )
  },
  {
    id: 'matterport',
    title: 'Matterport',
    color: '#f97316', // Matterport Orange
    node: (
      <svg viewBox="0 0 200 48" className="re-logo-svg" height="40" width="200" aria-hidden="true">
        <circle cx="14" cy="24" r="7" fill="currentColor" />
        <circle cx="31" cy="16" r="4.5" fill="currentColor" />
        <circle cx="31" cy="32" r="4.5" fill="currentColor" />
        <text x="48" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.03em" fill="currentColor">matterport</text>
      </svg>
    )
  },
  {
    id: 'costar',
    title: 'CoStar',
    color: '#eab308', // CoStar Gold
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <polygon points="18,4 22,16 34,16 25,23 28,35 18,27 8,35 11,23 2,16 14,16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <text x="42" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.02em" fill="currentColor">CoStar</text>
      </svg>
    )
  },
  {
    id: 'appfolio',
    title: 'AppFolio',
    color: '#10b981', // AppFolio Green
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <path d="M6 24 C6 15 15 6 24 6 L24 24 Z" fill="currentColor" />
        <path d="M15 33 C15 24 24 15 33 15 L33 33 Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <text x="44" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.02em" fill="currentColor">appfolio</text>
      </svg>
    )
  },
  {
    id: 'hines',
    title: 'Hines',
    color: '#be123c', // Hines Maroon
    node: (
      <svg viewBox="0 0 170 48" className="re-logo-svg" height="40" width="170" aria-hidden="true">
        <path d="M6 8 L6 38 M6 23 L26 23 M26 8 L26 38" stroke="currentColor" strokeWidth="3" />
        <text x="38" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="0.08em" fill="currentColor">Hines</text>
      </svg>
    )
  },
  {
    id: 'adt',
    title: 'ADT',
    color: '#0284c7', // ADT Blue
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <polygon points="18,6 32,15 32,33 18,42 4,33 4,15" fill="none" stroke="currentColor" strokeWidth="3" />
        <text x="44" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="25" letterSpacing="0.05em" fill="currentColor">ADT</text>
      </svg>
    )
  },
  {
    id: 'century21',
    title: 'Century 21',
    color: '#be9f55', // Century 21 Bronze Gold
    node: (
      <svg viewBox="0 0 210 48" className="re-logo-svg" height="40" width="210" aria-hidden="true">
        <path d="M6 24 L22 9 L38 24 M22 9 L22 39" stroke="currentColor" strokeWidth="3" />
        <text x="48" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="19" letterSpacing="0.04em" fill="currentColor">CENTURY 21</text>
      </svg>
    )
  },
  {
    id: 'trulia',
    title: 'Trulia',
    color: '#22c55e', // Trulia Green
    node: (
      <svg viewBox="0 0 170 48" className="re-logo-svg" height="40" width="170" aria-hidden="true">
        <path d="M6 26 L18 14 L30 26 L30 38 L6 38 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <text x="40" y="32" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="24" letterSpacing="-0.03em" fill="currentColor">trulia</text>
      </svg>
    )
  },
  {
    id: 'loopnet',
    title: 'LoopNet',
    color: '#3b82f6', // LoopNet Blue
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <path d="M8 24 C8 16 16 8 24 24 C32 40 40 32 40 24 C40 16 32 24 24 24 C16 24 8 32 8 24 Z" fill="none" stroke="currentColor" strokeWidth="3" />
        <text x="50" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="21" letterSpacing="-0.02em" fill="currentColor">LoopNet</text>
      </svg>
    )
  },
  {
    id: 'procore',
    title: 'Procore',
    color: '#ff6b00', // Procore Orange
    node: (
      <svg viewBox="0 0 180 48" className="re-logo-svg" height="40" width="180" aria-hidden="true">
        <rect x="6" y="12" width="24" height="24" fill="currentColor" />
        <text x="40" y="31" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="20" letterSpacing="0.04em" fill="currentColor">PROCORE</text>
      </svg>
    )
  }
];

const TrustSection = () => {
  return (
    <section className="lp-trust">
      <p>Trusted by top builders & developers worldwide</p>
      <div className="lp-trust-grid">
        {CustomerLogos.map((logo) => (
          <div
            key={logo.id}
            className="lp-trust-grid-item"
            style={{ '--hover-color': logo.color }}
            title={logo.title}
          >
            {logo.node}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;

