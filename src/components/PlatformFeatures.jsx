import React from 'react';
import { Search, CalendarCheck, CheckSquare, Users, TrendingUp, BarChart3 } from 'lucide-react';

const PlatformFeatures = () => {
  const features = [
    { 
      icon: <Search size={24} />, 
      title: "Natural Language Search", 
      desc: "Instantly find properties by describing them. Our AI understands nuanced queries like '3BHK near downtown under $1.5M'.",
      color: "#0052FF",
      bg: "rgba(0, 82, 255, 0.1)"
    },
    { 
      icon: <CalendarCheck size={24} />, 
      title: "Smart Booking Automation", 
      desc: "Autonomously coordinate schedules, handle conflicts, and confirm property tours with clients 24/7.",
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.1)"
    },
    { 
      icon: <CheckSquare size={24} />, 
      title: "Real-time Validation", 
      desc: "Ensure 100% accuracy with instant MLS synchronization and real-time inventory availability checks.",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)"
    },
    { 
      icon: <Users size={24} />, 
      title: "AI-Powered CRM", 
      desc: "Automatically capture leads, qualify prospects, and enrich profiles with actionable insights.",
      color: "#8b5cf6",
      bg: "rgba(139, 92, 246, 0.1)"
    },
    { 
      icon: <TrendingUp size={24} />, 
      title: "Predictive Insights", 
      desc: "Forecast market trends and identify high-value investment opportunities using advanced predictive models.",
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.1)"
    },
    { 
      icon: <BarChart3 size={24} />, 
      title: "Performance Analytics", 
      desc: "Visualize your entire sales funnel with dynamic dashboards and actionable conversational metrics.",
      color: "#0ea5e9",
      bg: "rgba(14, 165, 233, 0.1)"
    }
  ];

  return (
    <section id="features" className="section-light" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient glows */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,82,255,0.03) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="lp-section-header animate-fade-up">
          <div className="lp-section-eyebrow">Enterprise Capabilities</div>
          <h2>Powerful Features</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>Everything you need to automate your real estate operations, integrated into a single intelligent platform.</p>
        </div>
        
        <div className="lp-features-grid">
          {features.map((feat, idx) => (
            <div className={`lp-feature-card animate-fade-up delay-${(idx % 3 + 1) * 100}`} key={idx}>
              <div 
                className="lp-feature-icon-wrapper" 
                style={{ color: feat.color, background: feat.bg }}
              >
                {feat.icon}
              </div>
              <h4>{feat.title}</h4>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
