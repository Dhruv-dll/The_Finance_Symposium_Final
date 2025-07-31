import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
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

  const teamGroups: TeamGroup[] = [
    {
      name: "Faculty",
      theme: "academic",
      color: "from-blue-500 to-indigo-600",
      description:
        "Distinguished faculty leading financial education excellence",
      members: [
        {
          name: "Dr. Rajesh Sharma",
          role: "Head of Department",
          image: "/api/placeholder/200/200",
          bio: "Dr. Sharma brings over 20 years of academic and industry experience in finance. His research focuses on behavioral finance and emerging market dynamics. He has published extensively in leading finance journals and regularly consults for major financial institutions.",
          email: "rajesh.sharma@xaviers.edu",
          linkedin: "#",
          achievements: [
            "PhD in Finance from IIM Bangalore",
            "Author of 15+ research papers",
            "Consultant to RBI",
          ],
        },
        {
          name: "Prof. Priya Mehta",
          role: "Senior Faculty - Investment Banking",
          image: "/api/placeholder/200/200",
          bio: "Prof. Mehta is a former investment banker with Goldman Sachs who transitioned to academia. She specializes in corporate finance and mergers & acquisitions, bringing real-world experience to the classroom.",
          email: "priya.mehta@xaviers.edu",
          linkedin: "#",
          achievements: [
            "15 years at Goldman Sachs",
            "MBA from Wharton",
            "Expert in M&A transactions",
          ],
        },
        {
          name: "Dr. Anil Kumar",
          role: "Associate Professor - Risk Management",
          image: "/api/placeholder/200/200",
          bio: "Dr. Kumar's expertise lies in financial risk management and derivatives. He has worked with major banks in developing risk assessment models and regularly speaks at international finance conferences.",
          email: "anil.kumar@xaviers.edu",
          linkedin: "#",
          achievements: [
            "CFA Charter holder",
            "Risk management expert",
            "Published author on derivatives",
          ],
        },
      ],
    },
    {
      name: "Trio Leadership",
      theme: "leadership",
      color: "from-purple-500 to-pink-500",
      description: "Dynamic student leadership driving TFS vision forward",
      members: [
        {
          name: "Arjun Patel",
          role: "President",
          image: "/api/placeholder/200/200",
          bio: "Final year BAF student with exceptional leadership skills. Arjun has spearheaded multiple successful initiatives including the digital transformation of TFS events and expansion of industry partnerships.",
          email: "arjun.patel@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "President of Finance Club",
            "Goldman Sachs Summer Intern",
            "Dean's List for 3 consecutive years",
          ],
        },
        {
          name: "Sneha Reddy",
          role: "Vice President",
          image: "/api/placeholder/200/200",
          bio: "Known for her strategic thinking and organizational excellence, Sneha has been instrumental in planning and executing large-scale events. She's passionate about sustainable finance and ESG investing.",
          email: "sneha.reddy@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "National Finance Olympiad Winner",
            "JPMorgan Chase Scholarship Recipient",
            "ESG Research Publication",
          ],
        },
        {
          name: "Rahul Singh",
          role: "Secretary",
          image: "/api/placeholder/200/200",
          bio: "Rahul combines technical expertise with communication skills. He manages all TFS communications and has developed innovative digital platforms for member engagement and event management.",
          email: "rahul.singh@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Full-stack developer",
            "Created TFS mobile app",
            "McKinsey Insight Series participant",
          ],
        },
      ],
    },
    {
      name: "Networking Team",
      theme: "networking",
      color: "from-green-500 to-teal-500",
      description: "Building bridges between academia and industry",
      members: [
        {
          name: "Kavya Joshi",
          role: "Networking Head",
          image: "/api/placeholder/200/200",
          bio: "Kavya has built an extensive network of industry professionals and alumni. She coordinates guest lectures, industry visits, and internship opportunities for students.",
          email: "kavya.joshi@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Connected 500+ students with industry",
            "Organized 50+ networking events",
            "KPMG Scholarship Recipient",
          ],
        },
        {
          name: "Rohan Gupta",
          role: "Industry Relations",
          image: "/api/placeholder/200/200",
          bio: "Rohan manages relationships with corporate partners and organizes industry-academic collaboration programs. His efforts have secured multiple sponsorships and partnership deals.",
          email: "rohan.gupta@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Secured 20+ corporate partnerships",
            "Investment banking internship at UBS",
            "National debate champion",
          ],
        },
        {
          name: "Anisha Shah",
          role: "Alumni Coordinator",
          image: "/api/placeholder/200/200",
          bio: "Anisha maintains strong connections with TFS alumni who are now successful professionals in the finance industry. She organizes alumni events and mentorship programs.",
          email: "anisha.shah@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Manages 1000+ alumni network",
            "Established mentorship program",
            "Deloitte internship recipient",
          ],
        },
      ],
    },
    {
      name: "Management",
      theme: "executive",
      color: "from-finance-gold to-yellow-500",
      description: "Operational excellence and strategic planning",
      members: [
        {
          name: "Vikram Agarwal",
          role: "Event Manager",
          image: "/api/placeholder/200/200",
          bio: "Vikram orchestrates all TFS events with meticulous attention to detail. His project management skills ensure seamless execution of complex multi-day conferences and workshops.",
          email: "vikram.agarwal@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Managed 25+ successful events",
            "Project Management Certification",
            "Ernst & Young internship",
          ],
        },
        {
          name: "Isha Bansal",
          role: "Marketing Head",
          image: "/api/placeholder/200/200",
          bio: "Isha leads TFS's digital marketing and brand management efforts. Her creative campaigns have significantly increased TFS's visibility and engagement across social media platforms.",
          email: "isha.bansal@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Grew social media following by 300%",
            "Digital marketing expert",
            "PwC Digital Academy graduate",
          ],
        },
        {
          name: "Karan Malhotra",
          role: "Operations Manager",
          image: "/api/placeholder/200/200",
          bio: "Karan ensures smooth day-to-day operations of TFS activities. His systematic approach and attention to detail keep all initiatives running efficiently and on schedule.",
          email: "karan.malhotra@student.xaviers.edu",
          linkedin: "#",
          achievements: [
            "Operations excellence award",
            "Six Sigma Yellow Belt",
            "Accenture Strategy internship",
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
      case "networking":
        return {
          primary: "text-green-400",
          secondary: "text-teal-300",
          bg: "from-green-600/20 to-teal-600/20",
          border: "border-green-400/30",
          glow: "shadow-[0_0_30px_rgba(34,197,94,0.3)]",
        };
      case "executive":
        return {
          primary: "text-finance-gold",
          secondary: "text-yellow-300",
          bg: "from-finance-gold/20 to-yellow-600/20",
          border: "border-finance-gold/30",
          glow: "shadow-[0_0_30px_rgba(255,215,0,0.3)]",
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

        {/* 3D Carousel */}
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
                    transform = "translateX(-100px) rotateY(25deg) scale(0.85)";
                    zIndex = 5;
                    opacity = 0.7;
                  } else if (isNext) {
                    transform = "translateX(100px) rotateY(-25deg) scale(0.85)";
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
                    <p className="text-foreground/90 leading-relaxed">
                      {selectedMember.bio}
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
