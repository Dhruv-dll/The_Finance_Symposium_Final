import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Target } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "1000+",
    label: "Active Members",
    gradient: "from-finance-gold to-orange-400",
  },
  {
    icon: TrendingUp,
    value: "50+",
    label: "Industry Partners",
    gradient: "from-finance-electric to-blue-400",
  },
  {
    icon: Award,
    value: "25+",
    label: "Annual Events",
    gradient: "from-finance-green to-emerald-400",
  },
  {
    icon: Target,
    value: "5+",
    label: "Years of Excellence",
    gradient: "from-purple-500 to-finance-gold",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
            About TFS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-finance-gold to-finance-electric mx-auto mb-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={isMobile ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-finance-gold mb-6">
              Bridging Theory and Practice in Finance
            </h3>
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <div>
                <h4 className="text-xl font-semibold text-finance-electric mb-3">
                  Our Story
                </h4>
                <p className="text-lg">
                  The Finance Symposium is not merely an event; it is an
                  invaluable experience where all the different dimensions of
                  finance are explored effortlessly converging with knowledge
                  based amusement, knowledge which fosters innovation,
                  networking which cultivates opportunities. Get ready to be
                  engrossed in stimulating discussions, gaining insights from
                  the industry stalwarts and top business leaders, and enjoy an
                  invigorating atmosphere designed to both inspire and educate.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="relative group"
              >
                <div
                  className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl text-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-white drop-shadow-lg" />
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/90 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>

                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 blur-xl`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
