import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, CheckSquare, Users, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { Warp } from "@paper-design/shaders-react";
const getShaderConfig = (index) => {
  const configs = [
    {
      proportion: 0.3,
      softness: 0.8,
      distortion: 0.15,
      swirl: 0.6,
      swirlIterations: 4,
      shape: "checks",
      shapeScale: 0.08,
      colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"],
    },
    {
      proportion: 0.4,
      softness: 1.2,
      distortion: 0.2,
      swirl: 0.9,
      swirlIterations: 4,
      shape: "dots",
      shapeScale: 0.12,
      colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"],
    },
    {
      proportion: 0.35,
      softness: 0.9,
      distortion: 0.18,
      swirl: 0.7,
      swirlIterations: 4,
      shape: "checks",
      shapeScale: 0.1,
      colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"],
    },
    {
      proportion: 0.45,
      softness: 1.1,
      distortion: 0.22,
      swirl: 0.8,
      swirlIterations: 4,
      shape: "dots",
      shapeScale: 0.09,
      colors: ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"],
    },
    {
      proportion: 0.38,
      softness: 0.95,
      distortion: 0.16,
      swirl: 0.85,
      swirlIterations: 4,
      shape: "checks",
      shapeScale: 0.11,
      colors: ["hsl(250, 100%, 30%)", "hsl(270, 100%, 65%)", "hsl(260, 90%, 35%)", "hsl(265, 100%, 70%)"],
    },
    {
      proportion: 0.42,
      softness: 1.0,
      distortion: 0.19,
      swirl: 0.75,
      swirlIterations: 4,
      shape: "dots",
      shapeScale: 0.13,
      colors: ["hsl(330, 100%, 30%)", "hsl(350, 100%, 60%)", "hsl(340, 90%, 35%)", "hsl(345, 100%, 75%)"],
    },
  ];
  return configs[index % configs.length];
};

const ShaderCard = ({ icon: Icon, title, description, index, delay, onClick }) => {
  const shaderConfig = getShaderConfig(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="relative group h-[320px] cursor-pointer"
      style={{
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
      }}
    >
      <div className="absolute inset-0 rounded-[28px] overflow-hidden">
        <div className="absolute inset-0" style={{ opacity: 0.85, transform: 'scale(1.05)' }}>
          <Warp
            style={{ height: "100%", width: "100%" }}
            proportion={shaderConfig.proportion}
            softness={shaderConfig.softness}
            distortion={shaderConfig.distortion}
            swirl={shaderConfig.swirl}
            swirlIterations={shaderConfig.swirlIterations}
            shape={shaderConfig.shape}
            shapeScale={shaderConfig.shapeScale}
            scale={1}
            rotation={0}
            speed={0.8}
            colors={shaderConfig.colors}
          />
        </div>
      </div>

      <div className="relative z-10 p-6 md:p-8 rounded-[28px] h-full flex flex-col justify-between bg-black/40 backdrop-blur-sm border border-white/10">
        <div>
          <div className="mb-5 filter drop-shadow-lg">
            <Icon size={38} strokeWidth={2.5} style={{ color: '#ffffff' }} />
          </div>
          <h3 className="text-[22px] font-bold mb-3 tracking-tight drop-shadow-md" style={{ color: '#ffffff' }}>
            {title}
          </h3>
          <p className="text-[15px] leading-relaxed font-medium max-w-sm drop-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {description}
          </p>
        </div>
        
        <div className="mt-8 flex items-center gap-2 font-bold text-[14px] uppercase tracking-wider group-hover:gap-3 transition-all" style={{ color: '#ffffff' }}>
          Learn more <ChevronRight size={16} strokeWidth={3} />
        </div>
      </div>
    </motion.div>
  );
};

export default function FeaturesCards() {
  const navigate = useNavigate();

  const getFeatureId = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  const features = [
    { 
      icon: Search, 
      title: "Natural Language Search", 
      desc: "Instantly find properties by describing them. Our AI understands nuanced queries like '3BHK near downtown'.",
    },
    { 
      icon: CalendarCheck, 
      title: "Smart Booking", 
      desc: "Autonomously coordinate schedules, handle conflicts, and confirm property tours with clients 24/7.",
    },
    { 
      icon: CheckSquare, 
      title: "Real-time Validation", 
      desc: "Ensure 100% accuracy with instant MLS synchronization and real-time inventory availability checks.",
    },
    { 
      icon: Users, 
      title: "AI-Powered CRM", 
      desc: "Automatically capture leads, qualify prospects, and enrich profiles with actionable insights.",
    },
    { 
      icon: TrendingUp, 
      title: "Predictive Insights", 
      desc: "Forecast market trends and identify high-value investment opportunities using advanced predictive models.",
    },
    { 
      icon: BarChart3, 
      title: "Performance Analytics", 
      desc: "Visualize your entire sales funnel with dynamic dashboards and actionable conversational metrics.",
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
        {features.map((feat, idx) => (
          <ShaderCard 
            key={idx}
            icon={feat.icon}
            title={feat.title}
            description={feat.desc}
            index={idx}
            delay={idx * 0.08}
            onClick={() => navigate(`/feature/${getFeatureId(feat.title)}`)}
          />
        ))}
      </div>
    </div>
  );
}
