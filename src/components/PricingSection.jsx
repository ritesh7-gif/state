import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pricing.css';

const plans = [
  {
    name: 'Starter',
    description: 'For independent agents getting started with AI automation.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    buttonText: 'Get Started',
    href: '/login',
    isPopular: false,
    features: [
      'Booking Agent — automated scheduling',
      'Property Search Agent — up to 1K queries/mo',
      'Basic CRM with lead capture',
      'Up to 500 client interactions/mo',
      'Email & chat support',
      'Standard analytics dashboard',
    ],
  },
  {
    name: 'Professional',
    description: 'For growing agencies that need the full AI agent suite.',
    monthlyPrice: 199,
    yearlyPrice: 159,
    buttonText: 'Start Free Trial',
    href: '/login',
    isPopular: true,
    features: [
      'All 6 AI Agents included',
      'Unlimited client interactions',
      'Advanced CRM with lead scoring',
      'Financial Agent — mortgage & ROI tools',
      'Recommendation Engine — AI property matching',
      'Custom property database & MLS sync',
      'Team workspace with role-based access',
      'Priority support & onboarding',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large brokerages & developers with custom needs.',
    monthlyPrice: null,
    yearlyPrice: null,
    buttonText: 'Contact Sales',
    href: 'mailto:sales@realstate.ai',
    isPopular: false,
    features: [
      'Everything in Professional',
      'Custom AI fine-tuning on your data',
      'Dedicated infrastructure & SLA',
      'SSO, RBAC & advanced security',
      'White-label agent interface',
      'API access & custom integrations',
      '24/7 priority support & CSM',
    ],
  },
];

/* ── Animated Number Component ── */
function AnimatedPrice({ value, duration = 500 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);
  const animationRef = useRef(null);

  useEffect(() => {
    if (prevValue.current === value) return;

    const startValue = prevValue.current;
    const endValue = value;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    prevValue.current = value;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <span>${displayValue}</span>;
}

/* ── Confetti Burst ── */
function triggerConfetti(buttonRect) {
  const canvas = document.createElement('canvas');
  canvas.className = 'pricing-confetti-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#2563eb', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899'];
  const particles = [];
  const originX = buttonRect.left + buttonRect.width / 2;
  const originY = buttonRect.top + buttonRect.height / 2;

  for (let i = 0; i < 50; i++) {
    const angle = (Math.random() * Math.PI * 2);
    const speed = 3 + Math.random() * 6;
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: 0.015 + Math.random() * 0.01,
      gravity: 0.12,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    }

    if (alive) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}

/* ── Main Pricing Section Component ── */
const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const gridRef = useRef(null);
  const toggleRef = useRef(null);

  // Intersection Observer — watches the pricing grid itself
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleToggle = useCallback(() => {
    const newIsYearly = !isYearly;
    setIsYearly(newIsYearly);

    if (newIsYearly && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      triggerConfetti(rect);
    }
  }, [isYearly]);

  // Map card index to directional class
  const cardDirection = ['card-left', 'card-center', 'card-right'];

  return (
    <section id="pricing" className="pricing-section">
      {/* Decorative curved line background */}
      <div className="pricing-decorative-line">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path d="M-100,400 C200,100 400,700 600,300 C800,-50 1000,600 1300,250" />
          <path d="M-100,500 C300,200 500,800 700,350 C900,0 1100,500 1400,300" />
        </svg>
      </div>

      <div className="container">
        {/* Header */}
        <div className="pricing-header animate-fade-up">
          <div className="pricing-eyebrow">Predictable Pricing</div>
          <h2>Choose your plan</h2>
          <p>Scale seamlessly as you grow. No hidden fees.</p>
        </div>

        {/* Billing Toggle */}
        <div className="pricing-toggle-wrapper">
          <span
            className={`pricing-toggle-label ${!isYearly ? 'active' : ''}`}
            onClick={() => isYearly && handleToggle()}
          >
            Monthly
          </span>

          <button
            ref={toggleRef}
            className={`pricing-toggle ${isYearly ? 'yearly' : ''}`}
            onClick={handleToggle}
            aria-label="Toggle billing period"
          >
            <div className="pricing-toggle-knob" />
          </button>

          <span
            className={`pricing-toggle-label ${isYearly ? 'active' : ''}`}
            onClick={() => !isYearly && handleToggle()}
          >
            Yearly
          </span>

          <span className={`pricing-save-badge ${isYearly ? 'visible' : ''}`}>
            Save 20%
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid" ref={gridRef}>
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.isPopular ? 'popular' : 'standard'} ${cardDirection[index]} ${
                cardsVisible ? 'visible' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="pricing-popular-badge">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="pricing-plan-name">{plan.name}</div>

              {/* Plan Description */}
              <div className="pricing-plan-desc">{plan.description}</div>

              {/* Price */}
              <div className="pricing-price-row">
                <span className="pricing-price-value">
                  {plan.monthlyPrice !== null ? (
                    <AnimatedPrice
                      value={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    />
                  ) : (
                    'Custom'
                  )}
                </span>
                {plan.monthlyPrice !== null && (
                  <span className="pricing-price-period">/mo</span>
                )}
              </div>

              {/* Billing Note */}
              {plan.monthlyPrice !== null && (
                <div className="pricing-billing-note">
                  {isYearly ? 'billed annually' : 'billed monthly'}
                </div>
              )}
              {plan.monthlyPrice === null && (
                <div className="pricing-billing-note">&nbsp;</div>
              )}

              {/* CTA Button */}
              {plan.href.startsWith('mailto') ? (
                <a href={plan.href} className="pricing-cta">
                  {plan.buttonText}
                </a>
              ) : (
                <Link to={plan.href} className="pricing-cta">
                  {plan.buttonText}
                </Link>
              )}

              {/* Features */}
              <ul className="pricing-features">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="pricing-feature-item">
                    <Check className="pricing-feature-icon" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
