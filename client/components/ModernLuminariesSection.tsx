import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Mail,
  Linkedin,
  Star,
  Users,
  Crown,
  Sparkles,
  Brain,
  Target,
  Zap,
  Globe,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DesktopLightElements,
  MobileLightElements,
} from "./LightMorphingElements";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  email: string;
  linkedin?: string;
  achievements: string[];
  expertise: string[];
  quote: string;
  isLeadership?: boolean;
}

// Enhanced team data with more details
const facultyMembers: TeamMember[] = [
  {
    id: "sanjay-parab",
    name: "Dr. Sanjay Parab",
    title: "Vice Principal and Associate Professor",
    bio: "Dr. Sanjay Parab, Vice Principal and Associate Professor, holds multiple qualifications including M.Com., M.A., M.Phil., Ph.D., LL.M., and FCS, with over 21 years of teaching experience. He has a keen research interest in Corporate Governance, Business Administration, and Corporate Finance, and was a university topper in Company Law during his LLB.",
    image: "/placeholder.svg",
    email: "sanjay.parab@xaviers.edu",
    linkedin: "sanjay-parab",
    achievements: [
      "M.Com., M.A., M.Phil., Ph.D., LL.M., FCS",
      "Over 21 years of teaching experience",
      "University topper in Company Law (LLB)",
      "Vice Principal and Associate Professor",
    ],
    expertise: [
      "Corporate Governance",
      "Business Administration",
      "Corporate Finance",
      "Company Law",
    ],
    quote:
      "Excellence in corporate governance and finance education drives sustainable business growth.",
  },
  {
    id: "pratik-purohit",
    name: "Mr. Pratik Purohit",
    title: "Assistant Professor",
    bio: "Mr. Pratik Purohit, Assistant Professor, holds an M.Com. in Accountancy, PGDFM, and M.Phil., and is currently pursuing a Ph.D. With 6 years of teaching experience, his research interests lie in Accountancy and Finance, Business Policy and Administration, and Management.",
    image: "/placeholder.svg",
    email: "pratik.purohit@xaviers.edu",
    linkedin: "pratik-purohit",
    achievements: [
      "M.Com. in Accountancy, PGDFM, M.Phil.",
      "Currently pursuing Ph.D.",
      "6 years of teaching experience",
      "Assistant Professor",
    ],
    expertise: [
      "Accountancy and Finance",
      "Business Policy and Administration",
      "Management",
    ],
    quote:
      "Integrating theoretical knowledge with practical management approaches creates well-rounded financial professionals.",
  },
  {
    id: "kamalika-ray",
    name: "Ms. Kamalika Ray",
    title: "Assistant Professor",
    bio: "Ms. Kamalika Ray, Assistant Professor, holds an M.Com. in Accountancy, PGDBA (Finance), EPG in Data Analytics, and is a Certified TRP, currently pursuing a Ph.D. With 3 years of teaching experience, her research interests include Accountancy and Finance, ESG, and Personal Finance.",
    image: "/placeholder.svg",
    email: "kamalika.ray@xaviers.edu",
    achievements: [
      "M.Com. in Accountancy, PGDBA (Finance)",
      "EPG in Data Analytics, Certified TRP",
      "Currently pursuing Ph.D.",
      "3 years of teaching experience",
    ],
    expertise: [
      "Accountancy and Finance",
      "ESG",
      "Personal Finance",
      "Data Analytics",
    ],
    quote:
      "Empowering students with data-driven financial insights and sustainable investment practices.",
  },
  {
    id: "vinayak-thool",
    name: "Mr. Vinayak Thool",
    title: "Assistant Professor",
    bio: "Mr. Vinayak Thool, Assistant Professor, holds an M.Com. degree and has 2 years of teaching experience. His research interests include Accountancy, Finance, and Digital Governance.",
    image: "/placeholder.svg",
    email: "vinayak.thool@xaviers.edu",
    achievements: [
      "M.Com. degree",
      "2 years of teaching experience",
      "Assistant Professor",
    ],
    expertise: [
      "Accountancy",
      "Finance",
      "Digital Governance",
    ],
    quote:
      "Digital governance in finance ensures transparency and efficiency in modern financial systems.",
  },
  {
    id: "lloyd-serrao",
    name: "Mr. Lloyd Serrao",
    title: "Faculty & Market Analytics",
    bio: "Specialist in market research and financial analytics with deep expertise in data-driven investment strategies.",
    image: "/placeholder.svg",
    email: "lloyd.serrao@tfs.edu",
    achievements: [
      "Market Research Expert",
      "Data Analytics Specialist",
      "Investment Strategy Advisor",
      "Research Publication Leader",
    ],
    expertise: [
      "Market Analytics",
      "Data Science",
      "Investment Research",
      "Statistical Analysis",
    ],
    quote:
      "In the world of finance, data tells the story that drives successful investment decisions.",
  },
];

const leadershipMembers: TeamMember[] = [
  {
    id: "aaradhy-mehra",
    name: "Aaradhy Mehra",
    title: "Chairperson",
    bio: "Visionary leader driving TFS towards excellence in financial education and community building. Passionate about creating opportunities for student growth.",
    image: "/placeholder.svg",
    email: "aaradhy.mehra@student.tfs.edu",
    linkedin: "aaradhy-mehra",
    achievements: [
      "President's Honor Roll",
      "Finance Competition Winner",
      "Leadership Excellence Award",
      "Community Service Champion",
    ],
    expertise: [
      "Leadership",
      "Strategic Planning",
      "Team Management",
      "Vision Setting",
    ],
    quote:
      "Leading by example and empowering others to achieve their financial dreams.",
    isLeadership: true,
  },
  {
    id: "akarsh-ojha",
    name: "Akarsh Ojha",
    title: "Vice Chairperson - Networking",
    bio: "Master of connections and relationship building, expanding TFS network across industry and academia for maximum student benefit.",
    image: "/placeholder.svg",
    email: "akarsh.ojha@student.tfs.edu",
    linkedin: "akarsh-ojha",
    achievements: [
      "Networking Excellence Award",
      "Industry Connect Leader",
      "Event Management Expert",
      "Alumni Relations Champion",
    ],
    expertise: [
      "Networking",
      "Relationship Building",
      "Event Planning",
      "Industry Connections",
    ],
    quote:
      "Every connection is an opportunity, every conversation is a chance to grow.",
    isLeadership: true,
  },
  {
    id: "jatin-phulwani",
    name: "Jatin Phulwani",
    title: "Vice Chairperson - Management",
    bio: "Operational excellence expert ensuring smooth functioning of all TFS activities and initiatives with precision and efficiency.",
    image: "/placeholder.svg",
    email: "jatin.phulwani@student.tfs.edu",
    linkedin: "jatin-phulwani",
    achievements: [
      "Operations Excellence Award",
      "Project Management Certification",
      "Process Optimization Leader",
      "Team Coordination Expert",
    ],
    expertise: [
      "Operations Management",
      "Project Planning",
      "Process Optimization",
      "Team Coordination",
    ],
    quote:
      "Excellence in execution transforms great ideas into exceptional results.",
    isLeadership: true,
  },
];

export default function ModernLuminariesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeGroup, setActiveGroup] = useState<"faculty" | "leadership">(
    "faculty",
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 3D transformation values based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  // Floating animation for 3D elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 50);
      mouseY.set((e.clientY - window.innerHeight / 2) / 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const currentMembers =
    activeGroup === "faculty" ? facultyMembers : leadershipMembers;

  const MemberCard = ({
    member,
    index,
  }: {
    member: TeamMember;
    index: number;
  }) => {
    const isHovered = hoveredCard === member.id;

    return (
      <div
        className="relative group"
        onMouseEnter={() => setHoveredCard(member.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* 3D Card Container */}
        <motion.div
          className="relative h-80 sm:h-96 perspective-1000"
          style={{
            rotateX: isHovered ? 5 : 0,
            rotateY: isHovered ? 2 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Main Card */}
          <motion.div
            className="relative h-full rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer preserve-3d"
            onClick={() => setSelectedMember(member)}
            style={{
              background: member.isLeadership
                ? "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #fbbf24 100%)"
                : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0ea5e9 100%)",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px -10px rgba(255, 215, 0, 0.3)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Animated Background Mesh */}
            <div className="absolute inset-0 opacity-30">
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%),
                    linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 50%, transparent 50%)
                  `,
                  backgroundSize: "20px 20px",
                }}
                animate={{
                  backgroundPosition: isHovered ? "40px 40px, 0 0" : "0 0, 0 0",
                }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/40 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Card Content */}
            <div className="relative h-full p-4 sm:p-6 flex flex-col justify-between z-10">
              {/* Header with Role Badge */}
              <div className="space-y-4">
                {member.isLeadership && (
                  <div>
                    <Badge className="bg-gradient-to-r from-purple-500 to-amber-500 text-black font-bold">
                      <Crown className="w-3 h-3 mr-1" />
                      Leadership
                    </Badge>
                  </div>
                )}

                {/* Avatar Placeholder with Glow */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center relative overflow-hidden">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white/80" />

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl" />
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="text-center text-white space-y-3">
                <h3
                  className="text-lg sm:text-xl font-bold text-center"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {member.name}
                </h3>

                <p className="text-xs sm:text-sm text-white/90 font-medium text-center">
                  {member.title}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.expertise.slice(0, 2).map((skill, i) => (
                    <span
                      key={skill}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    <span>Learn More</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hover Shine Effect */}
            <motion.div
              className="absolute inset-0 opacity-0 pointer-events-none"
              animate={{
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                }}
                animate={{
                  x: isHovered ? "100%" : "-100%",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* 3D Shadow */}
          <motion.div
            className="absolute inset-0 rounded-3xl -z-10"
            style={{
              background: member.isLeadership
                ? "linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #fbbf24 100%)"
                : "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0ea5e9 100%)",
              filter: "blur(20px)",
              transform: "translateZ(-20px) scale(0.95)",
            }}
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
              scale: isHovered ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #000012 0%, #0a0a23 25%, #1a1a2e 50%, #16213e 75%, #0f3460 100%)",
      }}
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-finance-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Optimized Morphing Elements */}
      {isMobile ? <MobileLightElements /> : <DesktopLightElements />}
      {/* Animated 3D Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Financial Icons */}
        <motion.div
          className="absolute top-20 left-10"
          style={{
            x: springX,
            y: springY,
            rotateX,
            rotateY,
          }}
        >
          <motion.div
            animate={{
              rotateZ: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <Target className="w-12 h-12 text-blue-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-40 right-20"
          style={{
            x: useTransform(springX, (x) => -x * 0.5),
            y: useTransform(springY, (y) => -y * 0.5),
            scale,
          }}
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
              rotateX: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <Globe className="w-16 h-16 text-amber-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-1/4"
          style={{
            x: useTransform(springX, (x) => x * 0.8),
            y: useTransform(springY, (y) => y * 0.8),
            rotateX: useTransform(scrollYProgress, [0, 1], [0, 360]),
          }}
        >
          <motion.div
            animate={{
              rotateZ: [0, -360],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <Zap className="w-10 h-10 text-green-400" />
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              background:
                "linear-gradient(135deg, #FFD700 0%, #00FFFF 50%, #FFD700 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
            }}
          >
            Meet Our Luminaries
          </motion.h2>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-finance-gold to-transparent mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Discover the brilliant minds shaping the future of finance
            education. Our distinguished faculty and visionary student leaders
            are here to guide your journey.
          </p>
        </motion.div>

        {/* Group Selector */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
            <motion.div
              className="absolute inset-y-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
              animate={{
                x: activeGroup === "faculty" ? 2 : "50%",
                width: activeGroup === "faculty" ? "48%" : "48%",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            <div className="relative flex space-x-2">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setActiveGroup("faculty")}
                className={`relative z-10 px-8 py-3 transition-colors duration-300 ${
                  activeGroup === "faculty"
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <Star className="w-5 h-5 mr-2" />
                Faculty Excellence
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => setActiveGroup("leadership")}
                className={`relative z-10 px-8 py-3 transition-colors duration-300 ${
                  activeGroup === "leadership"
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                <Crown className="w-5 h-5 mr-2" />
                Student Leadership
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Members Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGroup}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 px-4 sm:px-0"
          >
            {currentMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                style={{
                  background: selectedMember.isLeadership
                    ? "linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(124, 58, 237, 0.95) 50%, rgba(251, 191, 36, 0.95) 100%)"
                    : "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(14, 165, 233, 0.95) 100%)",
                }}
              >
                {/* Header */}
                <div className="relative p-8 pb-6">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>

                  <div className="flex items-start space-x-6">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                      className="relative"
                    >
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <Users className="w-12 h-12 text-white/80" />
                      </div>
                      {selectedMember.isLeadership && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-gradient-to-r from-purple-500 to-amber-500 text-black font-bold">
                            <Crown className="w-3 h-3" />
                          </Badge>
                        </div>
                      )}
                    </motion.div>

                    <div className="flex-1">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-white mb-2"
                      >
                        {selectedMember.name}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-white/80 mb-4"
                      >
                        {selectedMember.title}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex space-x-3"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white border border-white/30 hover:bg-white/20"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        {selectedMember.linkedin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white border border-white/30 hover:bg-white/20"
                          >
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </Button>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bio & Quote */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <h4 className="text-lg font-semibold text-white mb-3">
                          About
                        </h4>
                        <p className="text-white/80 leading-relaxed">
                          {selectedMember.bio}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="relative p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="text-4xl text-white/20 mb-2">"</div>
                        <p className="text-white/90 italic text-sm">
                          {selectedMember.quote}
                        </p>
                      </motion.div>
                    </div>

                    {/* Achievements & Expertise */}
                    <div className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-amber-400" />
                          Achievements
                        </h4>
                        <div className="space-y-2">
                          {selectedMember.achievements.map(
                            (achievement, index) => (
                              <motion.div
                                key={achievement}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                className="flex items-center space-x-2 text-white/80 text-sm"
                              >
                                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                <span>{achievement}</span>
                              </motion.div>
                            ),
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                          <Brain className="w-5 h-5 mr-2 text-blue-400" />
                          Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedMember.expertise.map((skill, index) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: 1.1 + index * 0.1,
                                type: "spring",
                                bounce: 0.4,
                              }}
                              className="px-3 py-1 text-xs bg-white/10 border border-white/20 rounded-full text-white/90 backdrop-blur-sm"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
