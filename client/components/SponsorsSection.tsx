import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website?: string;
  isActive: boolean;
}

const sponsors: Sponsor[] = [
  {
    id: "citizen-cooperative-bank",
    name: "Citizen Cooperative Bank",
    logo: "",
    industry: "Banking",
    description:
      "Cooperative banking institution dedicated to financial inclusion and community development.",
    isActive: false,
    website: "https://citizenbankdelhi.com",
  },
  {
    id: "saint-gobain",
    name: "Saint Gobain (through Mahantesh Associates)",
    logo: "",
    industry: "Manufacturing",
    description:
      "Global leader in sustainable construction materials, partnering through Mahantesh Associates to enhance industry exposure.",
    isActive: false,
    website: "https://saint-gobain.com",
  },
  {
    id: "zest-global-education",
    name: "Zest Global Education",
    logo: "",
    industry: "Education",
    description:
      "International education consultancy providing global opportunities and career guidance to students.",
    isActive: false,
    website: "https://zestglobaleducation.com",
  },
  {
    id: "iqas",
    name: "IQAS",
    logo: "",
    industry: "Quality Assurance",
    description:
      "Quality assurance and certification services provider supporting academic excellence standards.",
    isActive: false,
    website: "https://iqas.co.in",
  },
];

export default function SponsorsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [activeTab, setActiveTab] = useState<"current" | "past">("past");
  const [searchTerm, setSearchTerm] = useState("");

  const currentSponsors: Sponsor[] = []; // Empty for now
  const pastSponsors = sponsors.filter((s) => !s.isActive);

  const filteredSponsors = (
    activeTab === "current" ? currentSponsors : pastSponsors
  ).filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SponsorCard = ({
    sponsor,
    index,
  }: {
    sponsor: Sponsor;
    index: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
        className="relative group cursor-pointer"
      >
        <motion.div
          className="relative h-64 overflow-hidden rounded-xl border border-finance-gold/20 bg-gradient-to-br from-finance-navy/50 to-finance-navy-light/30 backdrop-blur-xl"
          whileHover={{
            scale: 1.02,
            y: -5,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Card Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            {/* Logo Section */}
            <div className="text-center flex-1 flex flex-col justify-center">
              <motion.div
                className="w-24 h-16 mx-auto mb-4 bg-white/5 rounded-lg flex items-center justify-center border border-finance-gold/10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {/* Empty space for logo */}
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-finance-gold/10 to-finance-electric/10"></div>
              </motion.div>
              <h3 className="text-lg font-bold text-finance-gold mb-2 leading-tight">
                {sponsor.name}
              </h3>
              <p className="text-finance-electric text-sm mb-3">
                {sponsor.industry}
              </p>
            </div>

            {/* Description - appears on hover */}
            <motion.div className="absolute inset-0 bg-finance-navy/95 backdrop-blur-sm p-6 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto rounded-xl">
              <h4 className="text-lg font-bold text-finance-gold mb-3 text-center">
                {sponsor.name}
              </h4>
              <p className="text-sm text-foreground/80 mb-4 leading-relaxed text-center">
                {sponsor.description}
              </p>

              {sponsor.website && (
                <div className="text-center">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform duration-200"
                    onClick={() => window.open(sponsor.website, "_blank")}
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Elegant glow effect */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(0, 255, 255, 0.1))",
                filter: "blur(20px)",
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
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
      className="relative py-20 overflow-hidden bg-gradient-to-br from-finance-navy via-finance-navy-light to-finance-navy"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
            OUR STRATEGIC PARTNERS
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-finance-gold to-transparent mx-auto mb-6" />
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            {activeTab === "current"
              ? "Building strong partnerships with industry leaders to enhance financial education and career opportunities."
              : "Celebrating our previous sponsors who have supported The Finance Symposium over the years."
            }
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-8"
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

        {/* Search */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-full max-w-md">
            <Input
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-finance-navy/50 border-finance-gold/20 text-foreground placeholder-foreground/50 focus:border-finance-gold backdrop-blur-sm"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
        </motion.div>

        {/* Sponsors Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {activeTab === "current" && currentSponsors.length === 0 && searchTerm === "" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto bg-finance-navy/30 backdrop-blur-sm rounded-xl p-8 border border-finance-gold/20">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-2xl font-bold text-finance-gold mb-4">
                  Coming Soon
                </h3>
                <p className="text-foreground/70">
                  We're currently working on building partnerships with new sponsors.
                  Stay tuned for exciting announcements!
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
              layout
            >
              {filteredSponsors.map((sponsor, index) => (
                <SponsorCard key={sponsor.id} sponsor={sponsor} index={index} />
              ))}
            </motion.div>
          )}

          {filteredSponsors.length === 0 && searchTerm !== "" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-muted-foreground text-lg">
                No sponsors found matching your search.
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Elegant bottom section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="max-w-2xl mx-auto bg-finance-navy/30 backdrop-blur-sm rounded-xl p-8 border border-finance-gold/20">
            <h3 className="text-2xl font-bold text-finance-electric mb-4">
              Partnership Opportunities
            </h3>
            <p className="text-foreground/80 mb-6">
              Join our legacy of successful partnerships. Connect with us to
              explore collaboration opportunities and be part of our growing
              community.
            </p>
            <Button className="bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform duration-200">
              Become a Partner
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
