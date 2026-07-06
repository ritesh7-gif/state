import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Terminal, 
  MessageSquare, 
  TrendingUp, 
  Database, 
  Clock, 
  Eye, 
  Shield, 
  Sparkles 
} from 'lucide-react';

// Custom tailwind class merger utility
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-slate-200",
        (index === 0 || index === 4) && "lg:border-l",
        index < 4 && "lg:border-b"
      )}
    >
      {/* Background Gradient Hover Highlight */}
      {index < 4 ? (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-slate-100/80 to-transparent pointer-events-none" />
      ) : (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-slate-100/80 to-transparent pointer-events-none" />
      )}

      {/* Floating Icon */}
      <div className="mb-4 relative z-10 px-10 text-slate-500 group-hover/feature:text-blue-500 transition-colors duration-200">
        {icon}
      </div>

      {/* Title with vertical accent line */}
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 w-1 rounded-tr-full rounded-br-full bg-slate-200 group-hover/feature:bg-blue-600 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-slate-800 group-hover/feature:text-blue-600">
          {title}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 max-w-xs relative z-10 px-10 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const WhyUs = () => {
  const features = [
    {
      title: "Built for Developers",
      description: "PropAgentOS integrates seamlessly with your custom CRM, lead capture portals, and enterprise website architectures.",
      icon: <Terminal className="w-6 h-6" />,
    },
    {
      title: "Instant Lead Response",
      description: "AI agents engage buyers in under 2 minutes, qualifying their intent and answering complex project questions instantly.",
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      title: "Double Conversions",
      description: "Auto-schedule site visits while client interest is at its absolute peak, maximizing sales conversions.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Automated CRM Sync",
      description: "Every user preference, conversation summary, and contact detail is structured and pushed to HubSpot or Salesforce.",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "24/7 Lead Nurturing",
      description: "Your digital sales office never closes. Engage global buyers in any timezone, day or night.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Immersive Virtual Tours",
      description: "AI-driven virtual walk-throughs that guide clients through building materials, sizing, and project highlights.",
      icon: <Eye className="w-6 h-6" />,
    },
    {
      title: "SOC2 Security Guardrails",
      description: "Zero-knowledge security guardrails to ensure client communication and developer documents are fully protected.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Real-time Demand Analytics",
      description: "Predict project sales velocity and unit valuation metrics using localized market machine learning models.",
      icon: <Sparkles className="w-6 h-6" />,
    },
  ];

  return (
    <section className="section-white pt-16 pb-20 relative">
      <div className="container mx-auto">
        {/* Eyebrow and Headers */}
        <div className="lp-section-header animate-fade-up text-center mb-12">
          <div className="lp-section-eyebrow">The Advantage</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mt-2">
            Why Builders Choose Us
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto">
            Real estate developers use our platform to accelerate sales and automate manual tasks.
          </p>
        </div>

        {/* Features Hover Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
