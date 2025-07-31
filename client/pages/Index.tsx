import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import TerminalLoader from "../components/TerminalLoader";
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
  Download
} from "lucide-react";

export default function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Color temperature transformation based on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["rgb(0, 0, 18)", "rgb(26, 26, 46)", "rgb(51, 51, 77)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const aboutSections = [
    {
      id: "baf",
      title: "BAF Introduction",
      description: "Bachelor of Accounting & Finance - Building Future Financial Leaders",
      icon: BookOpen,
      color: "from-blue-600 to-cyan-400",
      stats: [
        { label: "Years of Excellence", value: "25+" },
        { label: "Alumni Network", value: "2000+" },
        { label: "Industry Partners", value: "50+" },
      ]
    },
    {
      id: "story",
      title: "TFS Story",
      description: "Our Journey in Shaping Financial Education",
      icon: Award,
      color: "from-finance-gold to-yellow-400",
      milestones: [
        { year: "2018", event: "TFS Foundation", description: "Inception of The Finance Symposium" },
        { year: "2019", event: "First Conclave", description: "Inaugural flagship event with 500+ participants" },
        { year: "2020", event: "Digital Transformation", description: "Successful transition to virtual events" },
        { year: "2021", event: "Industry Partnership", description: "Collaboration with leading financial institutions" },
        { year: "2022", event: "Global Reach", description: "International speakers and participants" },
        { year: "2023", event: "Innovation Hub", description: "Launch of FinTech initiatives" },
      ]
    },
    {
      id: "aspirations",
      title: "Aspirations",
      description: "Vision for the Future of Finance Education",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-400",
      goals: [
        { title: "Industry Leadership", description: "Become the premier finance education platform in India" },
        { title: "Global Network", description: "Expand international partnerships and collaborations" },
        { title: "Innovation Center", description: "Establish a FinTech research and development hub" },
        { title: "Student Success", description: "100% placement rate for program graduates" },
      ]
    }
  ];

  const events = {
    upcoming: [
      {
        title: "Annual Finance Conclave 2024",
        date: "March 15-16, 2024",
        type: "Flagship Event",
        description: "Two-day premier finance event featuring industry leaders",
        category: "conclave",
        status: "Open"
      },
      {
        title: "Saturday Session: Crypto & Blockchain",
        date: "February 24, 2024",
        type: "Educational",
        description: "Deep dive into cryptocurrency and blockchain technology",
        category: "session",
        status: "Open"
      },
      {
        title: "Networking Mixer: Alumni Connect",
        date: "March 2, 2024",
        type: "Networking",
        description: "Connect with successful BAF alumni in the industry",
        category: "networking",
        status: "Open"
      }
    ],
    past: [
      {
        title: "Digital Banking Revolution",
        date: "January 20, 2024",
        type: "Saturday Session",
        description: "Exploring the future of digital banking",
        category: "session"
      },
      {
        title: "Investment Strategies Workshop",
        date: "December 15, 2023",
        type: "Workshop",
        description: "Hands-on investment portfolio management",
        category: "session"
      }
    ]
  };

  const finsightIssues = [
    {
      title: "Future of FinTech",
      issue: "Issue 15",
      date: "January 2024",
      cover: "/api/placeholder/300/400",
      topics: ["AI in Banking", "Crypto Regulations", "Digital Payments"]
    },
    {
      title: "ESG Investing Trends",
      issue: "Issue 14",
      date: "December 2023",
      cover: "/api/placeholder/300/400",
      topics: ["Sustainable Finance", "Green Bonds", "Impact Investing"]
    },
    {
      title: "Market Analysis 2024",
      issue: "Issue 13",
      date: "November 2023",
      cover: "/api/placeholder/300/400",
      topics: ["Market Predictions", "Economic Outlook", "Investment Opportunities"]
    }
  ];

  const sponsors = {
    present: [
      { name: "HDFC Bank", logo: "/api/placeholder/150/80", tier: "Platinum" },
      { name: "ICICI Bank", logo: "/api/placeholder/150/80", tier: "Gold" },
      { name: "Axis Bank", logo: "/api/placeholder/150/80", tier: "Gold" },
      { name: "Kotak Mahindra", logo: "/api/placeholder/150/80", tier: "Silver" },
    ],
    past: [
      { name: "State Bank of India", logo: "/api/placeholder/150/80", tier: "Platinum" },
      { name: "Bank of Baroda", logo: "/api/placeholder/150/80", tier: "Gold" },
      { name: "Yes Bank", logo: "/api/placeholder/150/80", tier: "Silver" },
    ]
  };

  const teamGroups = [
    {
      name: "Faculty",
      theme: "academic",
      color: "from-blue-500 to-indigo-600",
      members: [
        { name: "Dr. Rajesh Sharma", role: "Head of Department", image: "/api/placeholder/200/200" },
        { name: "Prof. Priya Mehta", role: "Senior Faculty", image: "/api/placeholder/200/200" },
        { name: "Dr. Anil Kumar", role: "Associate Professor", image: "/api/placeholder/200/200" },
      ]
    },
    {
      name: "Trio Leadership",
      theme: "leadership",
      color: "from-purple-500 to-pink-500",
      members: [
        { name: "Arjun Patel", role: "President", image: "/api/placeholder/200/200" },
        { name: "Sneha Reddy", role: "Vice President", image: "/api/placeholder/200/200" },
        { name: "Rahul Singh", role: "Secretary", image: "/api/placeholder/200/200" },
      ]
    },
    {
      name: "Networking Team",
      theme: "networking",
      color: "from-green-500 to-teal-500",
      members: [
        { name: "Kavya Joshi", role: "Networking Head", image: "/api/placeholder/200/200" },
        { name: "Rohan Gupta", role: "Industry Relations", image: "/api/placeholder/200/200" },
        { name: "Anisha Shah", role: "Alumni Coordinator", image: "/api/placeholder/200/200" },
      ]
    },
    {
      name: "Management",
      theme: "executive",
      color: "from-finance-gold to-yellow-500",
      members: [
        { name: "Vikram Agarwal", role: "Event Manager", image: "/api/placeholder/200/200" },
        { name: "Isha Bansal", role: "Marketing Head", image: "/api/placeholder/200/200" },
        { name: "Karan Malhotra", role: "Operations Manager", image: "/api/placeholder/200/200" },
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Terminal Loader */}
      {showLoader && (
        <TerminalLoader onComplete={() => setShowLoader(false)} />
      )}

      {/* Main Content */}
      {!showLoader && (
        <>
          <Navigation scrolled={scrolled} />

          {/* Hero Section */}
          <HeroSection />

      {/* About TFS Section */}
      <motion.section 
        className="py-20 px-6"
        style={{ backgroundColor }}
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
              About The Finance Symposium
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Illuminating the path to financial excellence through education, innovation, and industry collaboration
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="glassmorphism p-8 rounded-2xl border border-border/20 market-glow group-hover:scale-105 transition-all duration-500">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${section.color} mb-6`}>
                    <section.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-finance-gold">{section.title}</h3>
                  <p className="text-muted-foreground mb-6">{section.description}</p>
                  
                  {section.stats && (
                    <div className="grid grid-cols-3 gap-4">
                      {section.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold text-finance-electric">{stat.value}</div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.milestones && (
                    <div className="space-y-4">
                      {section.milestones.slice(0, 3).map((milestone, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <div className="w-12 h-8 bg-finance-gold text-finance-navy text-sm font-bold rounded flex items-center justify-center">
                            {milestone.year}
                          </div>
                          <div>
                            <div className="font-medium text-finance-gold">{milestone.event}</div>
                            <div className="text-sm text-muted-foreground">{milestone.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.goals && (
                    <div className="space-y-3">
                      {section.goals.slice(0, 2).map((goal, idx) => (
                        <div key={idx} className="p-3 bg-finance-navy-light/50 rounded-lg">
                          <div className="font-medium text-finance-green">{goal.title}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Events Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-finance-navy-light to-finance-navy">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-finance-electric to-finance-green bg-clip-text text-transparent">
              Market Activities
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Engaging events that connect theory with practical finance insights
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-8 text-finance-green">Upcoming Events</h3>
              <div className="space-y-6">
                {events.upcoming.map((event, index) => (
                  <div key={index} className="glassmorphism p-6 rounded-xl border border-finance-green/20 market-glow hover:scale-105 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-finance-gold mb-2">{event.title}</h4>
                        <p className="text-finance-electric">{event.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-finance-green/20 text-finance-green rounded-full text-sm">
                        {event.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <button className="flex items-center space-x-2 text-finance-gold hover:text-finance-electric transition-colors">
                      <span>Register Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Past Events */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-8 text-finance-electric">Past Events</h3>
              <div className="space-y-6">
                {events.past.map((event, index) => (
                  <div key={index} className="glassmorphism p-6 rounded-xl border border-finance-electric/20 opacity-80 hover:opacity-100 transition-opacity duration-300">
                    <h4 className="text-xl font-bold text-finance-gold mb-2">{event.title}</h4>
                    <p className="text-finance-electric mb-2">{event.date}</p>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Finsight Section */}
      <section className="py-20 px-6 bg-mesh-gradient">
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
              Your gateway to cutting-edge financial knowledge and market analysis
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
                      <div className="text-finance-electric text-sm font-medium mb-2">{issue.issue}</div>
                      <h3 className="text-2xl font-bold text-finance-gold mb-4">{issue.title}</h3>
                      <div className="text-muted-foreground text-sm">{issue.date}</div>
                    </div>
                    
                    <div>
                      <div className="space-y-2 mb-6">
                        {issue.topics.map((topic, idx) => (
                          <div key={idx} className="text-sm text-foreground/80 flex items-center space-x-2">
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

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-finance-navy to-finance-navy-light">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
              Connect & Illuminate
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our community of finance enthusiasts and industry professionals
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-8 text-finance-gold">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-finance-gold to-finance-electric rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-finance-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-finance-gold">Address</div>
                    <div className="text-muted-foreground">St. Xavier's College, Mumbai, Maharashtra 400001</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-finance-electric to-finance-green rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-finance-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-finance-electric">Email</div>
                    <div className="text-muted-foreground">tfs@xaviers.edu</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-finance-green to-finance-gold rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-finance-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-finance-green">Phone</div>
                    <div className="text-muted-foreground">+91 22 2262 7661</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 glassmorphism p-6 rounded-xl border border-finance-gold/20">
                <h4 className="text-xl font-bold mb-4 text-finance-gold">Follow Us</h4>
                <div className="flex space-x-4">
                  {['Instagram', 'LinkedIn', 'Twitter', 'YouTube'].map((platform, index) => (
                    <button
                      key={platform}
                      className="w-10 h-10 bg-finance-navy-light rounded-lg flex items-center justify-center hover:bg-finance-gold hover:text-finance-navy transition-all duration-300 market-glow"
                    >
                      <Globe className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="glassmorphism p-8 rounded-2xl border border-finance-electric/20">
                <h3 className="text-2xl font-bold mb-6 text-finance-electric">Send us a Message</h3>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-finance-gold mb-2">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-finance-navy-light border border-finance-gold/20 rounded-lg focus:outline-none focus:border-finance-gold focus:ring-2 focus:ring-finance-gold/20 transition-all duration-300" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-finance-gold mb-2">Last Name</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-finance-navy-light border border-finance-gold/20 rounded-lg focus:outline-none focus:border-finance-gold focus:ring-2 focus:ring-finance-gold/20 transition-all duration-300" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-finance-gold mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-finance-navy-light border border-finance-gold/20 rounded-lg focus:outline-none focus:border-finance-gold focus:ring-2 focus:ring-finance-gold/20 transition-all duration-300" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-finance-gold mb-2">Subject</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 bg-finance-navy-light border border-finance-gold/20 rounded-lg focus:outline-none focus:border-finance-gold focus:ring-2 focus:ring-finance-gold/20 transition-all duration-300" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-finance-gold mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 bg-finance-navy-light border border-finance-gold/20 rounded-lg focus:outline-none focus:border-finance-gold focus:ring-2 focus:ring-finance-gold/20 transition-all duration-300 resize-none" 
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy font-bold rounded-lg market-glow hover:scale-105 transition-all duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-finance-navy border-t border-finance-gold/20">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-finance-gold to-finance-electric rounded-lg flex items-center justify-center market-glow">
                <span className="text-finance-navy font-bold text-xl">TFS</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-finance-gold">The Finance Symposium</h3>
                <p className="text-sm text-muted-foreground">St. Xavier's College Mumbai</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Illuminating the future of finance through education, innovation, and industry collaboration. 
              Join us in shaping the next generation of financial leaders.
            </p>
            
            <div className="text-finance-gold/60 text-sm">
              © 2024 The Finance Symposium. All rights reserved. | Designed with ❤️ by TFS Team
            </div>
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}
