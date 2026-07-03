import React from 'react';
import { Calendar, Search, Users, MapPin, DollarSign, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIAgents = () => {
  const agents = [
    {
      title: "Booking Agent",
      description: "Automatically schedules and coordinates property viewings with clients and sales teams.",
      icon: <Calendar size={24} />
    },
    {
      title: "Property Search Agent",
      description: "Understands natural language queries to find the exact properties your clients are looking for.",
      icon: <Search size={24} />
    },
    {
      title: "CRM Agent",
      description: "Maintains customer profiles, logs interactions, and suggests follow-up actions automatically.",
      icon: <Users size={24} />
    },
    {
      title: "Site Visit Agent",
      description: "Provides on-demand property details and localized information to clients during their visits.",
      icon: <MapPin size={24} />
    },
    {
      title: "Financial Agent",
      description: "Calculates mortgages, payment plans, and ROI instantly based on real-time data.",
      icon: <DollarSign size={24} />
    },
    {
      title: "Recommendation Agent",
      description: "Analyzes client preferences and market trends to suggest high-conversion properties.",
      icon: <Lightbulb size={24} />
    }
  ];

  return (
    <section id="agents" className="section-light">
      <div className="container">
        <div className="lp-section-header animate-fade-up">
          <div className="lp-section-eyebrow">Intelligent Workforce</div>
          <h2>Meet Your AI Sales Team</h2>
          <p>Deploy specialized AI agents that handle every stage of the real estate lifecycle, working seamlessly with your human workforce.</p>
        </div>

        <div className="lp-agents-grid">
          {agents.map((agent, idx) => (
            <div className={`lp-agent-card premium-hover animate-fade-up delay-${(idx + 1) * 100}`} key={idx}>
              <div className="lp-agent-icon">
                {agent.icon}
              </div>
              <h3>{agent.title}</h3>
              <p>{agent.description}</p>
              <Link to="/login" className="lp-agent-link">
                Learn More <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIAgents;
