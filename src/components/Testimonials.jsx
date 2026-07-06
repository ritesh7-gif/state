import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsColumn = ({ testimonials, className = "", duration = 15 }) => {
  return (
    <div className={`flex flex-col overflow-hidden ${className}`}>
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
        }}
        className="flex flex-col"
        style={{ willChange: "transform" }}
      >
        {[0, 1].map((group) => (
          <div key={group} className="flex flex-col gap-6 pb-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-6 border rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-4 w-[350px]">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-gray-900">{testimonial.name}</span>
                    <span className="text-xs text-gray-500">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const testimonials = [
  {
    text: "PropAgentOS revolutionized our property management, streamlining valuations and tenant screening. The cloud platform keeps our agents productive everywhere.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Briana Patton",
    role: "Property Manager",
  },
  {
    text: "Implementing this AI platform was smooth and quick. The conversational AI agents made training our realtors effortless and boosted our lead conversions.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Bilal Ahmed",
    role: "Brokerage Director",
  },
  {
    text: "The real-time market analytics provided by this platform are exceptional. It guides our acquisitions team through complex deals with perfect accuracy.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Saman Malik",
    role: "Acquisitions Lead",
  },
  {
    text: "This AI's seamless integration enhanced our commercial leasing operations. I highly recommend it for its intuitive interface and deep CRM sync.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Omar Raza",
    role: "Real Estate CEO",
  },
  {
    text: "Its robust virtual tour capabilities and 24/7 AI support have transformed our workflow, making our residential sales team significantly more efficient.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Zainab Hussain",
    role: "Sales Director",
  },
  {
    text: "The smooth implementation exceeded expectations. It completely automated our tenant inquiries, improving overall portfolio performance instantly.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Aliza Khan",
    role: "Leasing Analyst",
  },
  {
    text: "Our property marketing improved overnight with the AI-generated listings and incredibly positive feedback from our prospective buyers.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "They delivered an AI solution that truly understands the real estate market. It completely removed the busywork from our daily operations.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Sana Sheikh",
    role: "Realtor",
  },
  {
    text: "Using PropAgentOS, our online property views and lead qualification rates significantly improved, vastly boosting our firm's annual performance.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Hassan Ali",
    role: "Commercial Agent",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-white my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-gray-900 text-center">
            What our users say
          </h2>
          <p className="text-center mt-5 text-gray-600 text-lg">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:flex" duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:flex" duration={22} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
