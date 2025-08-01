import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, Award, Calendar, TrendingUp, Users, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "Platinum" | "Gold" | "Silver" | "Bronze";
  industry: string;
  partnershipYear: number;
  partnershipDuration?: string;
  description: string;
  achievements?: string[];
  website?: string;
  isActive: boolean;
  statistics?: {
    studentsPlaced?: number;
    eventsSponsored?: number;
    scholarshipsProvided?: number;
  };
}

const sponsors: Sponsor[] = [
  // Current Sponsors
  {
    id: "hdfc-bank",
    name: "HDFC Bank",
    logo: "/api/placeholder/150/80",
    tier: "Platinum",
    industry: "Banking",
    partnershipYear: 2020,
    description: "Leading private sector bank providing comprehensive financial solutions and career opportunities for TFS students.",
    achievements: ["Campus recruitment partner", "Guest lecture series", "Internship program"],
    isActive: true,
    statistics: {
      studentsPlaced: 45,
      eventsSponsored: 12,
      scholarshipsProvided: 8
    },
    website: "https://hdfcbank.com"
  },
  {
    id: "icici-bank",
    name: "ICICI Bank",
    logo: "/api/placeholder/150/80",
    tier: "Gold",
    industry: "Banking",
    partnershipYear: 2021,
    description: "Premier banking partner supporting innovation in financial education and technology.",
    achievements: ["FinTech workshop series", "Student projects funding", "Mentorship program"],
    isActive: true,
    statistics: {
      studentsPlaced: 32,
      eventsSponsored: 8,
      scholarshipsProvided: 5
    },
    website: "https://icicibank.com"
  },
  {
    id: "kotak-mahindra",
    name: "Kotak Mahindra Bank",
    logo: "/api/placeholder/150/80",
    tier: "Gold",
    industry: "Banking",
    partnershipYear: 2022,
    description: "Innovative banking solutions partner fostering entrepreneurship and financial literacy.",
    achievements: ["Innovation challenges", "Research grants", "Industry exposure programs"],
    isActive: true,
    statistics: {
      studentsPlaced: 28,
      eventsSponsored: 6,
      scholarshipsProvided: 4
    },
    website: "https://kotak.com"
  },
  {
    id: "axis-bank",
    name: "Axis Bank",
    logo: "/api/placeholder/150/80",
    tier: "Silver",
    industry: "Banking",
    partnershipYear: 2023,
    description: "Strategic partner in digital banking initiatives and financial technology research.",
    achievements: ["Digital banking seminars", "Technology partnerships", "Career guidance"],
    isActive: true,
    statistics: {
      studentsPlaced: 18,
      eventsSponsored: 4,
      scholarshipsProvided: 3
    },
    website: "https://axisbank.com"
  },
  // Past Sponsors
  {
    id: "sbi",
    name: "State Bank of India",
    logo: "/api/placeholder/150/80",
    tier: "Platinum",
    industry: "Banking",
    partnershipYear: 2018,
    partnershipDuration: "2018 - 2020",
    description: "India's largest public sector bank, our founding partner in establishing TFS legacy.",
    achievements: ["Flagship event sponsor", "Research collaboration", "Faculty exchange program"],
    isActive: false,
    statistics: {
      studentsPlaced: 65,
      eventsSponsored: 15,
      scholarshipsProvided: 12
    },
    website: "https://sbi.co.in"
  },
  {
    id: "bob",
    name: "Bank of Baroda",
    logo: "/api/placeholder/150/80",
    tier: "Gold",
    industry: "Banking",
    partnershipYear: 2019,
    partnershipDuration: "2019 - 2021",
    description: "International banking partner supporting global finance education initiatives.",
    achievements: ["International exchange programs", "Global market insights", "Cultural events"],
    isActive: false,
    statistics: {
      studentsPlaced: 40,
      eventsSponsored: 10,
      scholarshipsProvided: 7
    },
    website: "https://bankofbaroda.in"
  },
  {
    id: "yes-bank",
    name: "Yes Bank",
    logo: "/api/placeholder/150/80",
    tier: "Silver",
    industry: "Banking",
    partnershipYear: 2019,
    partnershipDuration: "2019 - 2022",
    description: "Technology-focused banking partner in digital transformation initiatives.",
    achievements: ["Digital banking workshops", "Tech innovation support", "Startup mentoring"],
    isActive: false,
    statistics: {
      studentsPlaced: 25,
      eventsSponsored: 7,
      scholarshipsProvided: 4
    },
    website: "https://yesbank.in"
  }
];

const tierColors = {
  Platinum: {
    gradient: "from-purple-500 to-pink-500",
    border: "border-purple-500/60",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    text: "text-purple-300"
  },
  Gold: {
    gradient: "from-yellow-500 to-orange-500",
    border: "border-yellow-500/60",
    glow: "shadow-[0_0_30px_rgba(255,215,0,0.4)]",
    text: "text-yellow-300"
  },
  Silver: {
    gradient: "from-gray-400 to-gray-600",
    border: "border-gray-500/60",
    glow: "shadow-[0_0_30px_rgba(156,163,175,0.4)]",
    text: "text-gray-300"
  },
  Bronze: {
    gradient: "from-orange-600 to-amber-700",
    border: "border-orange-600/60",
    glow: "shadow-[0_0_30px_rgba(234,88,12,0.4)]",
    text: "text-orange-300"
  }
};

export default function SponsorsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [hoveredSponsor, setHoveredSponsor] = useState<string | null>(null);

  const currentSponsors = sponsors.filter(s => s.isActive);
  const pastSponsors = sponsors.filter(s => !s.isActive);
  
  const filteredSponsors = (activeTab === "current" ? currentSponsors : pastSponsors)
    .filter(sponsor => 
      sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedIndustry === "all" || sponsor.industry === selectedIndustry)
    );

  const industries = [...new Set(sponsors.map(s => s.industry))];

  const SponsorCard = ({ sponsor, index }: { sponsor: Sponsor; index: number }) => {
    const tierStyle = tierColors[sponsor.tier];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredSponsor(sponsor.id)}
        onMouseLeave={() => setHoveredSponsor(null)}
      >
        {/* 3D Card Container */}
        <motion.div
          className={`relative h-80 perspective-1000 overflow-hidden rounded-xl border-2 ${tierStyle.border}`}
          style={{
            background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 26, 46, 0.9) 100%)",
            backdropFilter: "blur(20px)",
          }}
          whileHover={{ 
            scale: 1.05,
            rotateY: hoveredSponsor === sponsor.id ? 3 : 0,
            rotateX: hoveredSponsor === sponsor.id ? -2 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Tier Badge */}
          <div className="absolute top-4 right-4 z-20">
            <Badge 
              className={`bg-gradient-to-r ${tierStyle.gradient} text-white font-bold px-3 py-1 ${tierStyle.glow}`}
            >
              {sponsor.tier}
            </Badge>
          </div>

          {/* Active Partnership Badge */}
          {sponsor.isActive && (
            <motion.div
              className="absolute top-4 left-4 z-20"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-finance-green/20 border-finance-green/50 text-finance-green">
                Active Partnership
              </Badge>
            </motion.div>
          )}

          {/* Card Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Logo Section */}
            <div className="text-center">
              <motion.div 
                className="w-24 h-16 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-finance-gold font-bold text-lg">{sponsor.name}</span>
              </motion.div>
              <h3 className="text-xl font-bold text-finance-gold mb-2">{sponsor.name}</h3>
              <p className="text-finance-electric text-sm">{sponsor.industry}</p>
            </div>

            {/* Partnership Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Partnership:</span>
                <span className="text-finance-gold">
                  {sponsor.partnershipDuration || `${sponsor.partnershipYear} - Present`}
                </span>
              </div>
              
              {sponsor.statistics && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-finance-green font-bold">{sponsor.statistics.studentsPlaced}</div>
                    <div className="text-muted-foreground">Placed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-finance-electric font-bold">{sponsor.statistics.eventsSponsored}</div>
                    <div className="text-muted-foreground">Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-finance-gold font-bold">{sponsor.statistics.scholarshipsProvided}</div>
                    <div className="text-muted-foreground">Scholarships</div>
                  </div>
                </div>
              )}
            </div>

            {/* Hover Information Panel */}
            <motion.div
              className={`absolute inset-0 bg-finance-navy/95 backdrop-blur-sm p-6 flex flex-col justify-center transition-opacity duration-300 ${
                hoveredSponsor === sponsor.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <h4 className="text-lg font-bold text-finance-gold mb-3">{sponsor.name}</h4>
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                {sponsor.description}
              </p>

              {sponsor.achievements && (
                <div className="space-y-2 mb-4">
                  <div className="text-xs font-semibold text-finance-electric">Key Achievements:</div>
                  {sponsor.achievements.slice(0, 2).map((achievement, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs">
                      <Award className="w-3 h-3 text-finance-gold" />
                      <span className="text-foreground/70">{achievement}</span>
                    </div>
                  ))}
                </div>
              )}

              {sponsor.website && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform duration-200"
                >
                  Visit Website
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              )}
            </motion.div>

            {/* Glow Effect */}
            <motion.div
              className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 ${tierStyle.glow}`}
              style={{
                background: `linear-gradient(135deg, ${tierStyle.gradient})`,
                filter: "blur(20px)",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="sponsors"
      className="relative py-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
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
          <h2 
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #00FFFF 50%, #FFD700 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
            }}
          >
            OUR STRATEGIC PARTNERS
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-finance-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Building strong partnerships with industry leaders to enhance financial education and career opportunities.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex bg-finance-navy/50 backdrop-blur-sm rounded-xl p-2 border border-finance-gold/20">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                activeTab === "current"
                  ? "bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy shadow-lg"
                  : "text-finance-gold hover:bg-finance-gold/10"
              }`}
            >
              Current Sponsors
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium ${
                activeTab === "past"
                  ? "bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy shadow-lg"
                  : "text-finance-gold hover:bg-finance-gold/10"
              }`}
            >
              Past Sponsors
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="flex flex-col md:flex-row gap-4 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex-1">
            <Input
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-finance-navy/50 border-finance-gold/20 text-foreground placeholder-foreground/50 focus:border-finance-gold"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-4 py-2 bg-finance-navy/50 border border-finance-gold/20 rounded-lg text-foreground focus:border-finance-gold focus:outline-none"
          >
            <option value="all">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </motion.div>

        {/* Sponsors Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "current" ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "current" ? 50 : -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredSponsors.map((sponsor, index) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredSponsors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-muted-foreground text-lg">
                No sponsors found matching your criteria.
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Partnership Statistics */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-finance-electric mb-8">Partnership Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Total Students Placed", value: "233+", icon: Users },
              { label: "Events Sponsored", value: "62+", icon: Calendar },
              { label: "Scholarships Provided", value: "43+", icon: Award },
              { label: "Years of Partnership", value: "15+", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="bg-finance-navy/30 backdrop-blur-sm rounded-xl p-6 border border-finance-gold/20 hover:border-finance-gold/40 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-finance-gold mx-auto mb-3" />
                <div className="text-3xl font-bold text-finance-electric mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
