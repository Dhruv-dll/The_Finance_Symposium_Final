import { useState, useEffect } from "react";
import ModernNavigation from "../components/ModernNavigation";
import EnhancedHeroSection from "../components/EnhancedHeroSection";
import TerminalLoader from "../components/TerminalLoader";
import EnhancedTeamSection from "../components/EnhancedTeamSection";
import MarketDataErrorBoundary, {
  NetworkStatusIndicator,
} from "../components/MarketDataErrorBoundary";
import EventsSection from "../components/EventsSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import SponsorsSection from "../components/SponsorsSection";
import FloatingMarketIcon from "../components/FloatingMarketIcon";
import ScrollProgressIndicator from "../components/ScrollProgressIndicator";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  ChevronRight,
  Play,
  Download,
} from "lucide-react";

export default function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { scrollYProgress } = useScroll();

  // Color temperature transformation based on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgb(0, 0, 18)", "rgb(26, 26, 46)", "rgb(51, 51, 77)"],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const aboutSections = [
    {
      id: "baf",
      title: "BAF Introduction",
      description:
        "Bachelor of Accounting & Finance - Building Future Financial Leaders",
      icon: BookOpen,
      color: "from-blue-600 to-cyan-400",
      stats: [
        { label: "Years of Excellence", value: "25+" },
        { label: "Alumni Network", value: "2000+" },
        { label: "Industry Partners", value: "50+" },
      ],
    },
    {
      id: "story",
      title: "TFS Story",
      description: "Our Journey in Shaping Financial Education",
      icon: Award,
      color: "from-finance-gold to-yellow-400",
      milestones: [
        {
          year: "2018",
          event: "TFS Foundation",
          description: "Inception of The Finance Symposium",
        },
        {
          year: "2019",
          event: "First Conclave",
          description: "Inaugural flagship event with 500+ participants",
        },
        {
          year: "2020",
          event: "Digital Transformation",
          description: "Successful transition to virtual events",
        },
        {
          year: "2021",
          event: "Industry Partnership",
          description: "Collaboration with leading financial institutions",
        },
        {
          year: "2022",
          event: "Global Reach",
          description: "International speakers and participants",
        },
        {
          year: "2023",
          event: "Innovation Hub",
          description: "Launch of FinTech initiatives",
        },
      ],
    },
    {
      id: "aspirations",
      title: "Aspirations",
      description: "Vision for the Future of Finance Education",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-400",
      goals: [
        {
          title: "Industry Leadership",
          description: "Become the premier finance education platform in India",
        },
        {
          title: "Global Network",
          description: "Expand international partnerships and collaborations",
        },
        {
          title: "Innovation Center",
          description: "Establish a FinTech research and development hub",
        },
        {
          title: "Student Success",
          description: "100% placement rate for program graduates",
        },
      ],
    },
  ];

  const events = {
    upcoming: [
      {
        title: "Annual Finance Conclave 2024",
        date: "March 15-16, 2024",
        type: "Flagship Event",
        description: "Two-day premier finance event featuring industry leaders",
        category: "conclave",
        status: "Open",
      },
      {
        title: "Saturday Session: Financial Technology",
        date: "February 24, 2024",
        type: "Educational",
        description: "Exploring fintech innovations and digital financial services",
        category: "session",
        status: "Open",
      },
      {
        title: "Networking Mixer: Alumni Connect",
        date: "March 2, 2024",
        type: "Networking",
        description: "Connect with successful BAF alumni in the industry",
        category: "networking",
        status: "Open",
      },
    ],
    past: [
      {
        title: "Digital Banking Revolution",
        date: "January 20, 2024",
        type: "Saturday Session",
        description: "Exploring the future of digital banking",
        category: "session",
      },
      {
        title: "Investment Strategies Workshop",
        date: "December 15, 2023",
        type: "Workshop",
        description: "Hands-on investment portfolio management",
        category: "session",
      },
    ],
  };

  const finsightIssues = [
    {
      title: "Future of FinTech",
      issue: "Issue 15",
      date: "January 2024",
      cover: "/api/placeholder/300/400",
      topics: ["AI in Banking", "Digital Payments", "Investment Strategies"],
    },
    {
      title: "ESG Investing Trends",
      issue: "Issue 14",
      date: "December 2023",
      cover: "/api/placeholder/300/400",
      topics: ["Sustainable Finance", "Green Bonds", "Impact Investing"],
    },
    {
      title: "Market Analysis 2024",
      issue: "Issue 13",
      date: "November 2023",
      cover: "/api/placeholder/300/400",
      topics: [
        "Market Predictions",
        "Economic Outlook",
        "Investment Opportunities",
      ],
    },
  ];

  const sponsors = {
    present: [
      { name: "HDFC Bank", logo: "/api/placeholder/150/80", tier: "Platinum" },
      { name: "ICICI Bank", logo: "/api/placeholder/150/80", tier: "Gold" },
      { name: "Axis Bank", logo: "/api/placeholder/150/80", tier: "Gold" },
      {
        name: "Kotak Mahindra",
        logo: "/api/placeholder/150/80",
        tier: "Silver",
      },
    ],
    past: [
      {
        name: "State Bank of India",
        logo: "/api/placeholder/150/80",
        tier: "Platinum",
      },
      { name: "Bank of Baroda", logo: "/api/placeholder/150/80", tier: "Gold" },
      { name: "Yes Bank", logo: "/api/placeholder/150/80", tier: "Silver" },
    ],
  };

  const teamGroups = [
    {
      name: "Faculty",
      theme: "academic",
      color: "from-blue-500 to-indigo-600",
      members: [
        {
          name: "Dr. Rajesh Sharma",
          role: "Head of Department",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Prof. Priya Mehta",
          role: "Senior Faculty",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Dr. Anil Kumar",
          role: "Associate Professor",
          image: "/api/placeholder/200/200",
        },
      ],
    },
    {
      name: "Trio Leadership",
      theme: "leadership",
      color: "from-purple-500 to-pink-500",
      members: [
        {
          name: "Arjun Patel",
          role: "President",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Sneha Reddy",
          role: "Vice President",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Rahul Singh",
          role: "Secretary",
          image: "/api/placeholder/200/200",
        },
      ],
    },
    {
      name: "Networking Team",
      theme: "networking",
      color: "from-green-500 to-teal-500",
      members: [
        {
          name: "Kavya Joshi",
          role: "Networking Head",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Rohan Gupta",
          role: "Industry Relations",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Anisha Shah",
          role: "Alumni Coordinator",
          image: "/api/placeholder/200/200",
        },
      ],
    },
    {
      name: "Management",
      theme: "executive",
      color: "from-finance-gold to-yellow-500",
      members: [
        {
          name: "Vikram Agarwal",
          role: "Event Manager",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Isha Bansal",
          role: "Marketing Head",
          image: "/api/placeholder/200/200",
        },
        {
          name: "Karan Malhotra",
          role: "Operations Manager",
          image: "/api/placeholder/200/200",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Terminal Loader */}
      {showLoader && <TerminalLoader onComplete={() => setShowLoader(false)} />}

      {/* Main Content */}
      {!showLoader && (
        <>
          <ModernNavigation scrolled={scrolled} />
          <ScrollProgressIndicator />
          <NetworkStatusIndicator isOnline={isOnline} />
          <FloatingMarketIcon />

          {/* Hero Section */}
          <MarketDataErrorBoundary>
            <section id="hero">
              <EnhancedHeroSection />
            </section>
          </MarketDataErrorBoundary>

          {/* About TFS Section */}
          <section id="about">
            <AboutSection />
          </section>

          {/* Meet the Team Section */}
          <section id="team">
            <EnhancedTeamSection />
          </section>

          {/* Events Section */}
          <section id="events">
            <EventsSection />
          </section>

          {/* Insights Section */}
          <section id="insights" className="py-20 px-6 bg-mesh-gradient">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-finance-gold via-finance-electric to-finance-gold bg-clip-text text-transparent animate-glow">
                  Finsight - Financial Insights
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Your gateway to cutting-edge financial knowledge and market
                  analysis
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {finsightIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative glassmorphism rounded-2xl overflow-hidden market-glow group-hover:scale-105 group-hover:rotate-1 transition-all duration-500">
                      <div className="aspect-[3/4] bg-gradient-to-br from-finance-gold/20 to-finance-electric/20 p-8 flex flex-col justify-between">
                        <div>
                          <div className="text-finance-electric text-sm font-medium mb-2">
                            {issue.issue}
                          </div>
                          <h3 className="text-2xl font-bold text-finance-gold mb-4">
                            {issue.title}
                          </h3>
                          <div className="text-muted-foreground text-sm">
                            {issue.date}
                          </div>
                        </div>

                        <div>
                          <div className="space-y-2 mb-6">
                            {issue.topics.map((topic, idx) => (
                              <div
                                key={idx}
                                className="text-sm text-foreground/80 flex items-center space-x-2"
                              >
                                <div className="w-1 h-1 bg-finance-gold rounded-full"></div>
                                <span>{topic}</span>
                              </div>
                            ))}
                          </div>

                          <button className="flex items-center space-x-2 text-finance-gold hover:text-finance-electric transition-colors group-hover:glow">
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Sponsors Section */}
          <section id="sponsors">
            <SponsorsSection />
          </section>

          {/* Contact Us Section */}
          <section id="contact">
            <ContactSection />
          </section>

          {/* Footer */}
          <footer className="py-12 px-6 bg-finance-navy border-t border-finance-gold/20">
            <div className="container mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-finance-gold to-finance-electric rounded-lg flex items-center justify-center market-glow">
                    <span className="text-finance-navy font-bold text-xl">
                      TFS
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-finance-gold">
                      The Finance Symposium
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      St. Xavier's College Mumbai
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Illuminating the future of finance through education,
                  innovation, and industry collaboration. Join us in shaping the
                  next generation of financial leaders.
                </p>

                <div className="text-finance-gold/60 text-sm">
                  © 2024 The Finance Symposium. All rights reserved. | Designed
                  with ❤️ by TFS Team
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
