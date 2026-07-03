import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, CalendarCheck, CheckSquare, Users, TrendingUp, BarChart3, MessageCircle, Bot } from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    { icon: <Search size={32} />, title: "Natural Language Search", desc: "Clients can describe what they want in plain English, and our agents find the perfect matches." },
    { icon: <CalendarCheck size={32} />, title: "Smart Booking Automation", desc: "Automate scheduling, send calendar invites, and manage cancellations effortlessly." },
    { icon: <CheckSquare size={32} />, title: "Real-time Inventory", desc: "Live syncing with your property database ensures you never double-book or show sold properties." },
    { icon: <Users size={32} />, title: "Customer CRM", desc: "Automatically build detailed client profiles based on their conversations and preferences." },
    { icon: <TrendingUp size={32} />, title: "Financial Insights", desc: "Instant ROI calculations and mortgage estimations based on live market data." },
    { icon: <BarChart3 size={32} />, title: "Sales Analytics", desc: "Track conversions, agent performance, and market trends in real-time." },
    { icon: <MessageCircle size={32} />, title: "Conversation Memory", desc: "Our agents remember every interaction, providing a seamless, ongoing experience." },
    { icon: <Bot size={32} />, title: "LangGraph Orchestration", desc: "Complex multi-agent workflows handled smoothly in the background." }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      <div style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>Everything you need to scale</h1>
          <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
            RealState AI provides a comprehensive suite of tools powered by autonomous agents to handle your entire real estate lifecycle.
          </p>
        </div>
      </div>

      <section style={{ padding: '0 2rem 120px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ color: '#0052FF', marginBottom: '1.5rem' }}>{feat.icon}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>{feat.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
