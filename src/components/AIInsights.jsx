import React from 'react';

const AIInsights = () => {
  return (
    <section id="insights" className="section-light">
      <div className="container">
        <div className="lp-insights-wrapper animate-fade-up">
          <div>
            <h2 className="animate-fade-up delay-100">Data turned into action</h2>
            <p className="animate-fade-up delay-200">Instead of dashboards that you have to decipher, your AI agents proactively tell you what's happening and what to do next.</p>
          </div>
          
          <div className="lp-chat-container">
            <div className="lp-chat-msg lp-chat-manager animate-fade-up delay-300">
              Show me today's pending bookings.
            </div>
            <div className="lp-chat-msg lp-chat-agent animate-fade-up delay-500" style={{ background: '#2563eb' }}>
              <strong>You have 6 pending bookings.</strong><br/><br/>
              3 customers require follow-up today.<br/>
              Revenue is up 14% compared to yesterday.<br/><br/>
              Would you like me to send reminders to the 3 customers?
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
