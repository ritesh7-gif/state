import React from 'react';
import { Search, CalendarCheck, CheckSquare, Users, TrendingUp, BarChart3, MessageCircle, Bot, Cpu } from 'lucide-react';

const PlatformFeatures = () => {
  const features = [
    { icon: <Search size={20} />, title: "Natural Language Search" },
    { icon: <CalendarCheck size={20} />, title: "Smart Booking Automation" },
    { icon: <CheckSquare size={20} />, title: "Real-time Inventory Validation" },
    { icon: <Users size={20} />, title: "Customer CRM" },
    { icon: <TrendingUp size={20} />, title: "Financial Insights" },
    { icon: <BarChart3 size={20} />, title: "Sales Analytics" },
    { icon: <MessageCircle size={20} />, title: "Conversation Memory" },
    { icon: <Bot size={20} />, title: "LangGraph Orchestration" }
  ];

  return (
    <section id="features" className="section-white">
      <div className="container">
        <div className="lp-section-header animate-fade-up">
          <div className="lp-section-eyebrow">Enterprise Capabilities</div>
          <h2>Powerful Features</h2>
          <p>Everything you need to automate your real estate operations, integrated into a single platform.</p>
        </div>
        
        <div className="lp-features-grid">
          {features.map((feat, idx) => (
            <div className={`lp-feature-card premium-hover animate-fade-up delay-${(idx % 4 + 1) * 100}`} key={idx}>
              <div className="lp-feature-icon">{feat.icon}</div>
              <h4>{feat.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
