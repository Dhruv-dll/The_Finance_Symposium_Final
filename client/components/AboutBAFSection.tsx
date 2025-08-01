import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, BookOpen, Briefcase, FileText } from "lucide-react";

const bafFeatures = [
  {
    icon: BookOpen,
    title: "Programme Overview",
    description: "Comprehensive 3-year undergraduate program in accounting and finance",
    gradient: "from-finance-gold to-orange-400",
  },
  {
    icon: FileText,
    title: "Curriculum Structure",
    description: "Updated content designed for professional development",
    gradient: "from-finance-electric to-blue-400",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description: "Transform yourself through professional expertise",
    gradient: "from-finance-green to-emerald-400",
  },
  {
    icon: GraduationCap,
    title: "University Affiliation",
    description: "Affiliated to the University of Mumbai",
    gradient: "from-purple-500 to-finance-gold",
  },
];

export default function AboutBAFSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section
      ref={sectionRef}
      id="about-baf"
      className="relative py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)",
      }}
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-finance-electric to-finance-gold bg-clip-text text-transparent">
            About BAF
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-finance-electric to-finance-gold mx-auto mb-6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-finance-electric mb-6">
              Bachelor of Accounting and Finance
            </h3>
            <div className="space-y-6 text-foreground/80 leading-relaxed">
              <div>
                <h4 className="text-xl font-semibold text-finance-gold mb-3">BAF Programme Foundation</h4>
                <p className="text-lg">
                  "The BAF programme was effectively initiated at St. Xavier's College from start of academic year 2022-23, as a self –financed 3-year undergraduate program affiliated to the University of Mumbai. The aim is to provide solid platform of updated content in the domain field to students who wish to transform themselves through professional in the field of accounting and finance."
                </p>
              </div>
              
              <div>
                <h4 className="text-xl font-semibold text-finance-electric mb-3">TFS Connection</h4>
                <p className="text-lg">
                  "The Finance Symposium is not merely an event; it is an invaluable experience where all the different dimensions of finance are explored effortlessly converging with knowledge based amusement, knowledge which fosters innovation, networking which cultivates opportunities. Get ready to be engrossed in stimulating discussions, gaining insights from the industry stalwarts and top business leaders, and enjoy an invigorating atmosphere designed to both inspire and educate."
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {bafFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="relative group"
              >
                <div
                  className={`bg-gradient-to-br ${feature.gradient} p-6 rounded-xl text-center transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl`}
                >
                  <feature.icon className="w-8 h-8 mx-auto mb-3 text-white drop-shadow-lg" />
                  <div className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </div>
                  <div className="text-white/90 text-xs leading-tight">
                    {feature.description}
                  </div>
                </div>

                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10 blur-xl`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Additional BAF Information */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-finance-navy/30 backdrop-blur-sm p-6 rounded-xl border border-finance-electric/20">
            <h4 className="text-xl font-semibold text-finance-electric mb-3">Programme Duration</h4>
            <p className="text-foreground/80">3-year undergraduate program with comprehensive curriculum</p>
          </div>
          
          <div className="bg-finance-navy/30 backdrop-blur-sm p-6 rounded-xl border border-finance-gold/20">
            <h4 className="text-xl font-semibold text-finance-gold mb-3">University Affiliation</h4>
            <p className="text-foreground/80">Affiliated to the University of Mumbai with recognized degree</p>
          </div>
          
          <div className="bg-finance-navy/30 backdrop-blur-sm p-6 rounded-xl border border-finance-green/20">
            <h4 className="text-xl font-semibold text-finance-green mb-3">Professional Focus</h4>
            <p className="text-foreground/80">Designed for career transformation in accounting and finance</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
