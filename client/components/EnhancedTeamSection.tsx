import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Linkedin,
  Twitter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  detailedBio?: string; // For expanded "Learn More" section
  email?: string;
  linkedin?: string;
  twitter?: string;
  achievements?: string[];
}

interface TeamGroup {
  name: string;
  theme: string;
  color: string;
  description: string;
  members: TeamMember[];
}

export default function EnhancedTeamSection() {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const teamGroups: TeamGroup[] = [
    {
      name: "Faculty",
      theme: "academic",
      color: "from-blue-500 to-indigo-600",
      description:
        "Distinguished faculty leading financial education excellence",
      members: [
        {
          name: "Dr. Sanjay Parab",
          role: "Vice Principal and Associate Professor",
          image: "/api/placeholder/200/200",
          bio: "Dr. Sanjay Parab is Vice Principal and Associate Professor with over 21 years of teaching experience. He has a keen research interest in Corporate Governance, Business Administration, and Corporate Finance, and was a university topper in Company Law during his LLB.",
          email: "sanjay.parab@xaviers.edu",
          linkedin: "#",
          achievements: [
            "M.Com., M.A., M.Phil., Ph.D., LL.M., and FCS",
            "21+ years of teaching experience",
            "University topper in Company Law",
            "Expert in Corporate Governance",
          ],
        },
        {
          name: "Mr. Pratik Purohit",
          role: "Assistant Professor",
          image: "/api/placeholder/200/200",
          bio: "Mr. Pratik Purohit is an Assistant Professor with 6 years of teaching experience. He holds an M.Com. in Accountancy, PGDFM, and M.Phil., and is currently pursuing a Ph.D. His research interests lie in Accountancy and Finance, Business Policy and Administration, and Management.",
          email: "pratik.purohit@xaviers.edu",
          linkedin: "#",
          achievements: [
            "M.Com. in Accountancy, PGDFM, M.Phil.",
            "6 years of teaching experience",
            "Currently pursuing Ph.D.",
            "Expert in Business Policy and Administration",
          ],
        },
        {
          name: "Ms. Kamalika Ray",
          role: "Assistant Professor",
          image: "/api/placeholder/200/200",
          bio: "Ms. Kamalika Ray is an Assistant Professor with 3 years of teaching experience. She holds an M.Com. in Accountancy, PGDBA (Finance), EPG in Data Analytics, and is a Certified TRP, currently pursuing a Ph.D. Her research interests include Accountancy and Finance, ESG, and Personal Finance.",
          email: "kamalika.ray@xaviers.edu",
          linkedin: "#",
          achievements: [
            "M.Com. in Accountancy, PGDBA (Finance)",
            "EPG in Data Analytics, Certified TRP",
            "3 years of teaching experience",
            "Expert in ESG and Personal Finance",
          ],
        },
        {
          name: "Mr. Vinayak Thool",
          role: "Assistant Professor",
          image: "/api/placeholder/200/200",
          bio: "Mr. Vinayak Thool is an Assistant Professor with 2 years of teaching experience. He holds an M.Com. degree and his research interests include Accountancy, Finance, and Digital Governance.",
          email: "vinayak.thool@xaviers.edu",
          linkedin: "#",
          achievements: [
            "M.Com. degree",
            "2 years of teaching experience",
            "Expert in Digital Governance",
            "Specialist in Accountancy and Finance",
          ],
        },
        {
          name: "Mr. Lloyd Serrao",
          role: "Assistant Professor",
          image: "/api/placeholder/200/200",
          bio: "Mr. Lloyd Serrao is an Assistant Professor and C.S., L.L.B., and Associate Member of ICSI with over five years of experience in corporate filings, FEMA, IBC, and compliances. With 2 years of teaching experience, his research interests include Finance, Corporate and Commercial Laws, and Banking.",
          email: "lloyd.serrao@xaviers.edu",
          linkedin: "#",
          achievements: [
            "C.S., L.L.B., Associate Member of ICSI",
            "5+ years in corporate filings and compliances",
            "2 years of teaching experience",
            "Expert in FEMA, IBC, and Commercial Laws",
          ],
        },
      ],
    },
    {
      name: "Trio",
      theme: "leadership",
      color: "from-purple-500 to-pink-500",
      description: "Dynamic student leadership driving TFS vision forward",
      members: [
        {
          name: "Aaradhy Mehra",
          role: "Chairperson – The Finance Symposium (TFS)",
          image: "/api/placeholder/200/200",
          bio: "Chairperson – The Finance Symposium (TFS), St. Xavier's College (Autonomous), Mumbai\nSBI Securities Summer Intern | CUET 98%iler | Editor-in-Chief – Currency of Change | Digital Creator – 1.5M+ Views | 5,000+ LinkedIn Followers.",
          detailedBio:
            "Aaradhy Mehra is a driven student-leader and aspiring entrepreneur from the BAF batch of 2026–27 at St. Xavier's College, Mumbai. As Chairperson of The Finance Symposium, he curates strategic initiatives that connect finance, innovation, and enterprise through student-led forums and industry collaborations. He serves as Editor-in-Chief of Currency of Change, leading its editorial vision while mentoring contributors. A former Summer Intern at SBI Securities and a CUET 98%iler, Aaradhy pairs strong analytical thinking with a forward-looking approach to market trends and institutional strategy. His deep interests in technology, automobiles, and design reflect in his digital presence, where he has garnered over 1.5 million views on YouTube and built a professional network of 5,000+ followers on LinkedIn. As Sub-Head of Design for The Business Conference 2023–24, he led visual storytelling that elevated the conference's brand experience. Balancing entrepreneurial curiosity with creative insight and a passion for sport, Aaradhy exemplifies next-gen leadership rooted in impact, innovation, and influence.",
          email: "aaradhy.mehra@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Chairperson – The Finance Symposium (TFS)",
            "SBI Securities Summer Intern",
            "CUET 98%iler",
            "Editor-in-Chief – Currency of Change",
            "Digital Creator – 1.5M+ Views",
          ],
        },
        {
          name: "Akarsh Ojha",
          role: "Vice Chairperson – Networking",
          image: "/api/placeholder/200/200",
          bio: "Vice Chairperson – Networking, The Finance Society (TFS) 2025 | Godha Family Scholar (2023) | University of Oxford Visiting Student (Trinity Term 2025) | Betty and Keating Scholarship Recipient | Author – 'Nothing but Only You' | All India Rank 1 – National Reasoning Challenge",
          detailedBio:
            "Akarsh Ojha is currently pursuing a Bachelor's in Accounting and Finance at St. Xavier's College, Mumbai, and serves as the Vice Chairperson – Networking at The Finance Society (TFS) 2025. In this role, he leads strategic outreach, fostering connections with alumni, industry experts, and institutions across India and abroad. A Godha Family Scholar (2023) and Visiting Student at the University of Oxford (Trinity Term 2025) under the Betty and Keating Scholarship, Akarsh blends academic excellence with cross-disciplinary curiosity. He is the author of Nothing but Only You, a nationally acclaimed poetry collection, and a winner of multiple national literary and aptitude competitions, including an All India Rank 1 in a reasoning challenge. Raised in a remote village in Bihar, his journey from limited resources to global platforms reflects resilience, vision, and a deep belief in education as a force for transformation. He aspires to pursue an MBA at Oxford, combining finance, policy, and ethical leadership for inclusive development.",
          email: "akarsh.ojha@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Vice Chairperson – Networking, TFS 2025",
            "Godha Family Scholar (2023)",
            "University of Oxford Visiting Student",
            "Author – 'Nothing but Only You'",
            "All India Rank 1 – National Reasoning Challenge",
          ],
        },
        {
          name: "Jatin Phulwani",
          role: "Vice Chairperson – Management",
          image: "/api/placeholder/200/200",
          bio: "Vice Chairperson – Management, The Finance Symposium (TFS), St. Xavier's College (Autonomous), Mumbai\nOrganiser (OG) – Admin, Malhar 2025 | Mr. DPS | Certified by IIM-B, Wharton & BCG | Intern – Chtrbox | National Bronze Medalist – Cycle Polo | NCC 'A' Certificate Holder | State Rank #1 – Spell Bee",
          detailedBio:
            "Jatin Phulwani is the only second-year student in the core trio of The Finance Symposium (TFS), where he serves as Vice Chairperson – Management. He is a two-time elected Course Representative of the BAF batch and a member of the Student Council at St. Xavier's College, Mumbai. Jatin has consistently led from the front, playing a pivotal role in streamlining internal operations, enabling team synergy, and ensuring flawless execution of the committee's flagship initiatives. As Organiser (OG) – Admin for Malhar 2025, one of India's largest student-run college festivals, he contributes with strategic foresight and unmatched precision — ensuring smooth coordination across diverse verticals of the fest's backbone. Crowned Mr. DPS at his school convocation — the highest honour awarded to a student — Jatin's leadership journey began early. He has earned certifications from IIM Bangalore, Wharton, and BCG, with expertise spanning strategy, consulting, and finance. Professionally, he has interned at Chtrbox, where he gained hands-on experience in marketing and creative strategy. A national bronze medalist in Cycle Polo, NCC 'A' certificate holder, and State Rank #1 in Spell Bee, Jatin combines discipline with creativity. He was one of the very few first-year students to earn a core committee position and stood out as one of the most active members of his batch, contributing to nearly every major fest or committee at Xavier's — including Malhar, SSL, TFS, Zephyrus, Commercium, IMG, and FinCell. With collaborative leadership and a deep commitment to impact, Jatin is a changemaker with an eye on the future.",
          email: "jatin.phulwani@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Vice Chairperson – Management, TFS",
            "Organiser (OG) – Admin, Malhar 2025",
            "Mr. DPS Award Recipient",
            "Certified by IIM-B, Wharton & BCG",
            "National Bronze Medalist – Cycle Polo",
          ],
        },
      ],
    },
  ];

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "academic":
        return {
          primary: "text-blue-400",
          secondary: "text-indigo-300",
          bg: "from-blue-600/20 to-indigo-600/20",
          border: "border-blue-400/30",
          glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
        };
      case "leadership":
        return {
          primary: "text-purple-400",
          secondary: "text-pink-300",
          bg: "from-purple-600/20 to-pink-600/20",
          border: "border-purple-400/30",
          glow: "shadow-[0_0_30px_rgba(147,51,234,0.3)]",
        };
      default:
        return {
          primary: "text-finance-gold",
          secondary: "text-finance-electric",
          bg: "from-finance-gold/20 to-finance-electric/20",
          border: "border-finance-gold/30",
          glow: "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
        };
    }
  };

  const nextMember = () => {
    const currentGroup = teamGroups[selectedGroup];
    setCurrentMemberIndex((prev) => (prev + 1) % currentGroup.members.length);
  };

  const prevMember = () => {
    const currentGroup = teamGroups[selectedGroup];
    setCurrentMemberIndex(
      (prev) =>
        (prev - 1 + currentGroup.members.length) % currentGroup.members.length,
    );
  };

  const toggleExpandedBio = (memberName: string) => {
    setExpandedMember(expandedMember === memberName ? null : memberName);
  };

  const currentGroup = teamGroups[selectedGroup];
  const themeColors = getThemeColors(currentGroup.theme);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-finance-navy via-finance-navy-light to-finance-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${themeColors.bg}`}
        ></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
            Meet Our Luminaries
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The brilliant minds behind The Finance Symposium's success
          </p>
        </motion.div>

        {/* Group Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {teamGroups.map((group, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setSelectedGroup(index);
                setCurrentMemberIndex(0);
                setExpandedMember(null);
              }}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                selectedGroup === index
                  ? `bg-gradient-to-r ${group.color} text-white ${getThemeColors(group.theme).glow}`
                  : "bg-finance-navy/50 text-muted-foreground hover:text-foreground border border-finance-gold/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{group.name}</span>
              {selectedGroup === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Group Description */}
        <motion.div
          key={selectedGroup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className={`text-lg ${themeColors.primary} font-medium`}>
            {currentGroup.description}
          </p>
        </motion.div>

        {/* Conditional rendering based on group type */}
        {currentGroup.name === "Trio" ? (
          // Special layout for Trio with larger cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {currentGroup.members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`backdrop-blur-xl bg-gradient-to-br ${themeColors.bg} rounded-2xl p-8 border ${themeColors.border} ${themeColors.glow} hover:scale-105 transition-all duration-500`}
              >
                <div className="text-center">
                  <div className="relative mb-6 mx-auto w-40 h-40">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentGroup.color} rounded-full opacity-20 blur-lg`}
                    ></div>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-full h-full object-cover rounded-full border-2 border-finance-gold/30"
                    />
                  </div>

                  <h3
                    className={`text-2xl font-bold ${themeColors.primary} mb-3`}
                  >
                    {member.name}
                  </h3>
                  <p className={`${themeColors.secondary} mb-6 text-lg`}>
                    {member.role}
                  </p>

                  {/* Brief Bio */}
                  <div className="mb-6">
                    <p className="text-foreground/90 leading-relaxed text-sm whitespace-pre-line">
                      {member.bio}
                    </p>
                  </div>

                  {/* Learn More Section */}
                  {member.detailedBio && (
                    <div className="mb-6">
                      <button
                        onClick={() => toggleExpandedBio(member.name)}
                        className={`flex items-center gap-2 mx-auto px-4 py-2 bg-gradient-to-r ${currentGroup.color} text-white rounded-lg hover:scale-105 transition-all duration-300`}
                      >
                        Learn More
                        {expandedMember === member.name ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedMember === member.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="p-4 bg-finance-navy/30 rounded-lg border border-finance-gold/20">
                              <p className="text-foreground/80 leading-relaxed text-sm">
                                {member.detailedBio}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className={`p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300`}
                      >
                        <Mail className={`w-5 h-5 ${themeColors.primary}`} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className={`p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300`}
                      >
                        <Linkedin
                          className={`w-5 h-5 ${themeColors.primary}`}
                        />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        className={`p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300`}
                      >
                        <Twitter className={`w-5 h-5 ${themeColors.primary}`} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // 3D Carousel for other groups
          <div className="relative h-96 mb-12">
            <div className="flex items-center justify-center h-full perspective-1000">
              <div className="relative w-full max-w-6xl">
                {/* Navigation Buttons */}
                <button
                  onClick={prevMember}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300 ${themeColors.glow}`}
                >
                  <ChevronLeft className={`w-6 h-6 ${themeColors.primary}`} />
                </button>

                <button
                  onClick={nextMember}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300 ${themeColors.glow}`}
                >
                  <ChevronRight className={`w-6 h-6 ${themeColors.primary}`} />
                </button>

                {/* Member Cards Carousel */}
                <div className="flex items-center justify-center space-x-8">
                  {currentGroup.members.map((member, index) => {
                    const isActive = index === currentMemberIndex;
                    const isPrev =
                      index ===
                      (currentMemberIndex - 1 + currentGroup.members.length) %
                        currentGroup.members.length;
                    const isNext =
                      index ===
                      (currentMemberIndex + 1) % currentGroup.members.length;

                    let transform = "translateX(0px) rotateY(0deg) scale(0.7)";
                    let zIndex = 1;
                    let opacity = 0.5;

                    if (isActive) {
                      transform = "translateX(0px) rotateY(0deg) scale(1)";
                      zIndex = 10;
                      opacity = 1;
                    } else if (isPrev) {
                      transform =
                        "translateX(-100px) rotateY(25deg) scale(0.85)";
                      zIndex = 5;
                      opacity = 0.7;
                    } else if (isNext) {
                      transform =
                        "translateX(100px) rotateY(-25deg) scale(0.85)";
                      zIndex = 5;
                      opacity = 0.7;
                    }

                    return (
                      <motion.div
                        key={index}
                        className={`absolute w-80 cursor-pointer ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
                        style={{
                          transform,
                          zIndex,
                          opacity,
                        }}
                        animate={{
                          transform,
                          opacity,
                          zIndex,
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        whileHover={isActive ? { scale: 1.05 } : {}}
                        onClick={() => isActive && setSelectedMember(member)}
                      >
                        <div
                          className={`backdrop-blur-xl bg-gradient-to-br ${themeColors.bg} rounded-2xl p-6 border ${themeColors.border} ${isActive ? themeColors.glow : ""} transition-all duration-500`}
                        >
                          <div className="text-center">
                            <div className="relative mb-4 mx-auto w-32 h-32">
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${currentGroup.color} rounded-full opacity-20 blur-lg`}
                              ></div>
                              <img
                                src={member.image}
                                alt={member.name}
                                className="relative w-full h-full object-cover rounded-full border-2 border-finance-gold/30"
                              />
                              {isActive && (
                                <motion.div
                                  className={`absolute inset-0 rounded-full border-2 ${themeColors.primary} opacity-50`}
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />
                              )}
                            </div>

                            <h3
                              className={`text-xl font-bold ${themeColors.primary} mb-2`}
                            >
                              {member.name}
                            </h3>
                            <p className={`${themeColors.secondary} mb-4`}>
                              {member.role}
                            </p>

                            {isActive && (
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`px-4 py-2 bg-gradient-to-r ${currentGroup.color} text-white rounded-lg hover:scale-105 transition-all duration-300`}
                                onClick={() => setSelectedMember(member)}
                              >
                                Learn More
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Member Indicator Dots */}
            <div className="flex justify-center space-x-3 mt-8">
              {currentGroup.members.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMemberIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentMemberIndex
                      ? `${themeColors.primary.replace("text-", "bg-")} ${themeColors.glow}`
                      : "bg-finance-navy border border-finance-gold/30"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`max-w-2xl w-full backdrop-blur-xl bg-gradient-to-br ${themeColors.bg} rounded-2xl p-8 border ${themeColors.border} ${themeColors.glow} relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-finance-red/20 transition-colors"
              >
                <X className="w-6 h-6 text-finance-red" />
              </button>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Member Image */}
                <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 mx-auto md:mx-0">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${currentGroup.color} rounded-xl opacity-20 blur-xl`}
                    ></div>
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="relative w-full h-full object-cover rounded-xl border border-finance-gold/30"
                    />
                    <motion.div
                      className={`absolute inset-0 rounded-xl border-2 ${themeColors.primary} opacity-30`}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>

                {/* Member Details */}
                <div className="flex-1">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-3xl font-bold ${themeColors.primary} mb-2`}
                  >
                    {selectedMember.name}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`text-xl ${themeColors.secondary} mb-6`}
                  >
                    {selectedMember.role}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-invert max-w-none mb-6"
                  >
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                      {selectedMember.detailedBio || selectedMember.bio}
                    </p>
                  </motion.div>

                  {/* Achievements */}
                  {selectedMember.achievements && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <h4
                        className={`text-lg font-semibold ${themeColors.primary} mb-3`}
                      >
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {selectedMember.achievements.map(
                          (achievement, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex items-start space-x-3"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${themeColors.primary.replace("text-", "bg-")} mt-2 flex-shrink-0`}
                              ></div>
                              <span className="text-foreground/80">
                                {achievement}
                              </span>
                            </motion.li>
                          ),
                        )}
                      </ul>
                    </motion.div>
                  )}

                  {/* Social Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex space-x-4"
                  >
                    {selectedMember.email && (
                      <a
                        href={`mailto:${selectedMember.email}`}
                        className={`p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300`}
                      >
                        <Mail className={`w-5 h-5 ${themeColors.primary}`} />
                      </a>
                    )}
                    {selectedMember.linkedin && (
                      <a
                        href={selectedMember.linkedin}
                        className={`p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300`}
                      >
                        <Linkedin
                          className={`w-5 h-5 ${themeColors.primary}`}
                        />
                      </a>
                    )}
                    {selectedMember.twitter && (
                      <a
                        href={selectedMember.twitter}
                        className={`p-3 rounded-full backdrop-blur-md bg-finance-navy/50 ${themeColors.border} border hover:scale-110 transition-all duration-300`}
                      >
                        <Twitter className={`w-5 h-5 ${themeColors.primary}`} />
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
