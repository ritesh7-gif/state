import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const featureData = {
  "natural-language-search": {
    title: "Natural Language Search",
    description: "Instantly find properties by describing them. Our AI understands nuanced queries like '3BHK near downtown'.",
    content: [
      "Our Natural Language Search revolutionizes how clients discover properties. Instead of rigid filters and drop-downs, users can simply type or speak their exact needs in everyday language. Powered by advanced natural language processing models, our platform parses complex criteria, understands location nuances, and even captures subjective requirements like 'lots of natural light' or 'close to good schools'.",
      "This semantic understanding goes far beyond basic keyword matching. The system contextually understands proximity, architectural styles, and lifestyle requirements. For example, a search for 'a quiet place for a growing family' automatically prioritizes properties in cul-de-sacs, near highly-rated schools, and with multiple bedrooms, even if those exact words aren't in the listing description.",
      "The result is a radically more intuitive search experience. Clients spend less time wrestling with clunky interfaces and more time viewing properties that actually match their dream criteria. This leads to significantly higher engagement rates, longer session durations, and faster property matches, completely transforming the traditional real estate discovery process into a fluid, conversational journey."
    ]
  },
  "smart-booking": {
    title: "Smart Booking",
    description: "Autonomously coordinate schedules, handle conflicts, and confirm property tours with clients 24/7.",
    content: [
      "Smart Booking eliminates the endless back-and-forth emails and calls traditionally required to schedule property viewings. Our intelligent agent acts as an autonomous assistant, directly coordinating with both agents and clients. It cross-references calendars in real-time, intelligently suggests optimal viewing times based on travel distance and traffic patterns, handles rescheduling requests effortlessly, and sends automated SMS and email reminders.",
      "Operating 24/7, Smart Booking ensures you never miss a lead due to after-hours inquiries. If a prospective buyer is browsing at 11 PM and decides they want to view a property, they can book it instantly without waiting for business hours. The system automatically holds the slot, notifies the listing agent, and updates all synchronized calendars.",
      "Beyond just scheduling, the system handles complex logic like grouping multiple viewings into a logical route, padding times for travel, and respecting agent preferences for buffer times between meetings. By removing this administrative friction, agents can focus entirely on relationship building and closing deals, maximizing tour volume while minimizing operational overhead."
    ]
  },
  "real-time-validation": {
    title: "Real-time Validation",
    description: "Ensure 100% accuracy with instant MLS synchronization and real-time inventory availability checks.",
    content: [
      "In the fast-paced real estate market, outdated information can cost you clients. Real-time Validation integrates directly with Multiple Listing Services (MLS) and proprietary databases to ensure every property shown on your platform is currently available and accurate. It instantly flags status changes, price adjustments, and contingent offers the second they occur.",
      "Traditional periodic syncing often leaves a gap of hours or even days where properties that are under contract still appear active. Our real-time infrastructure uses webhooks and direct API integrations to push updates instantly. If a seller accepts an offer, that property is immediately marked as pending across all your digital touchpoints.",
      "This guarantees that your agents and clients are always working with the single source of truth. It builds profound trust with your clientele, prevents the deep frustration of inquiring about unavailable properties, and protects your brokerage's reputation as a reliable, authoritative source of market data."
    ]
  },
  "ai-powered-crm": {
    title: "AI-Powered CRM",
    description: "Automatically capture leads, qualify prospects, and enrich profiles with actionable insights.",
    content: [
      "Our AI-Powered CRM takes relationship management from a manual data-entry chore to a proactive strategic advantage. It doesn't just store contacts; it actively understands them. By analyzing interactions, website search behaviors, and communication patterns across email and SMS, the AI automatically segments your leads and scores their readiness to buy or sell.",
      "The system autonomously enriches client profiles by gathering publicly available data, giving agents a comprehensive understanding of their prospect's demographic and financial profile before they even pick up the phone. It flags important life events that often trigger real estate transactions, such as job changes, growing families, or retirement.",
      "Furthermore, the CRM acts as a co-pilot for your agents. It suggests personalized follow-up actions, drafts hyper-relevant check-in emails based on the client's recent viewing history, and alerts agents when a cold lead suddenly becomes active again. This ensures that no opportunity falls through the cracks and every client receives a personalized, white-glove experience."
    ]
  },
  "predictive-insights": {
    title: "Predictive Insights",
    description: "Forecast market trends and identify high-value investment opportunities using advanced predictive models.",
    content: [
      "Stay ahead of the market with Predictive Insights. By leveraging vast amounts of historical transaction data, current active market indicators, and macroeconomic trends like interest rate fluctuations and employment data, our machine learning algorithms provide highly accurate forecasts of localized property values and neighborhood appreciation rates.",
      "This isn't just about general market health; it's about micro-market intelligence. The system can predict which specific neighborhoods are poised for rapid gentrification, which types of properties (e.g., 2-bedroom condos vs. single-family homes) will see the highest demand in the next quarter, and flag properties that are statistically undervalued compared to their predicted trajectory.",
      "This empowers real estate professionals and institutional investors to make confident, data-driven decisions. You can pinpoint emerging neighborhoods and high-yield investment opportunities long before they become obvious to the broader market, allowing you to advise clients with unparalleled authority and secure the best possible returns."
    ]
  },
  "performance-analytics": {
    title: "Performance Analytics",
    description: "Visualize your entire sales funnel with dynamic dashboards and actionable conversational metrics.",
    content: [
      "Performance Analytics offers unprecedented visibility into your brokerage's operations from the top down. Move beyond static, simple spreadsheets with dynamic, real-time dashboards that track every stage of the sales funnel, from initial lead capture to the final closing signature.",
      "Our platform provides granular metrics on individual agent performance, team-wide lead conversion rates, and the precise ROI of various marketing campaigns. You can drill down to see exactly how long leads sit in each stage of the pipeline, identifying systemic bottlenecks that are slowing down revenue generation.",
      "More importantly, the system turns raw data into actionable strategic insights. It doesn't just tell you that conversions are down; it highlights that response times on weekend leads have slipped, and recommends staffing adjustments. By surfacing these hidden operational inefficiencies, brokerage leaders can make targeted adjustments to optimize efficiency, enforce best practices, and maximize overall revenue."
    ]
  }
};

const FeatureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const feature = featureData[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [feature]);

  if (!feature) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Feature not found</h1>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-500 font-medium">
            Return to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full mt-24 lg:mt-32 mb-20 px-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-12 self-start text-sm uppercase tracking-wider font-semibold"
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight leading-tight text-slate-900">
          {feature.title}
        </h1>

        <p className="text-2xl md:text-3xl text-slate-600 leading-normal md:leading-relaxed mb-12 font-light border-l-4 border-indigo-500 pl-6 md:pl-8">
          {feature.description}
        </p>

        <div className="text-xl text-slate-700 space-y-8 font-normal leading-loose tracking-wide">
          {feature.content.map((paragraph, index) => (
            <p key={index}>
              {paragraph}
            </p>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FeatureDetailPage;
