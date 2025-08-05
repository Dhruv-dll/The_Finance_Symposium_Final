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
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Eye,
  Share,
  Star,
  ExternalLink,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Globe,
  Zap,
  Brain,
  Target,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SectionMorphingElements } from "./Morphing3DElements";

interface Magazine {
  id: string;
  title: string;
  edition: string;
  date: string;
  coverImage: string;
  description: string;
  featured: boolean;
  articles: number;
  downloads: number;
  readTime: string;
  categories: string[];
  highlights: string[];
}

// Sample magazine data
const magazines: Magazine[] = [
  {
    id: "vol-1",
    title: "Finsight Magazine Vol. 1",
    edition: "Volume 1",
    date: "2024",
    coverImage: "/placeholder.svg",
    description:
      "Our inaugural edition featuring comprehensive insights into finance, markets, and emerging technologies shaping the financial world.",
    featured: true,
    articles: 15,
    downloads: 3500,
    readTime: "50 min",
    categories: ["Finance", "Markets", "Technology", "Analysis"],
    highlights: [
      "Market trends and analysis",
      "Investment strategies for students",
      "Industry expert interviews",
      "Financial technology insights",
    ],
  },
];

export default function ModernFinsightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const magazineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(
    null,
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // 3D transformations for magazine
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-20, 0, 20]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);
  const perspective = useTransform(scrollYProgress, [0, 1], [1000, 1200]);

  // Mouse movement for 3D effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 10 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 10 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (magazineRef.current) {
        const rect = magazineRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) / 20);
        mouseY.set((e.clientY - centerY) / 20);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const featuredMagazine =
    magazines.find((mag) => mag.featured) || magazines[0];

  const Magazine3D = ({
    magazine,
    featured = false,
  }: {
    magazine: Magazine;
    featured?: boolean;
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className={`relative ${featured ? "w-80 h-96" : "w-64 h-80"} perspective-1000 cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() =>
          window.open(
            "https://heyzine.com/flip-book/3f3a9a2239.html#page/1",
            "_blank",
          )
        }
        style={{
          perspective: featured ? perspective : 1000,
        }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d"
          style={{
            rotateY: featured ? springX : isHovered ? 5 : 0,
            rotateX: featured
              ? useTransform(springY, (y) => -y * 0.5)
              : isHovered
                ? -2
                : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{
            scale: featured ? 1.05 : 1.02,
          }}
        >
          {/* Magazine Front Cover */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl backface-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
              boxShadow: featured
                ? "0 25px 60px rgba(0, 0, 0, 0.4), 0 0 50px rgba(59, 130, 246, 0.3)"
                : "0 15px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Magazine Cover Design */}
            <div className="relative h-full p-6 flex flex-col">
              {/* Header */}
              <div className="text-center mb-4">
                <motion.h3
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  FINSIGHT
                </motion.h3>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold">
                  {magazine.edition}
                </Badge>
              </div>

              {/* Featured Article */}
              <div className="flex-1 flex flex-col justify-center space-y-4">
                <motion.h4
                  className="text-lg font-bold text-white text-center leading-tight"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {magazine.title}
                </motion.h4>

                {/* Visual Elements */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <TrendingUp className="w-16 h-16 text-blue-400/60" />
                    </motion.div>
                  </div>

                  {/* Floating elements */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-xs text-white/70">
                  <span>{magazine.articles} Articles</span>
                  <span>{magazine.readTime} Read</span>
                  <span>{magazine.downloads} Downloads</span>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 justify-center">
                {magazine.categories.slice(0, 3).map((category) => (
                  <span
                    key={category}
                    className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80"
                  >
                    {category}
                  </span>
                ))}
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
                className="absolute inset-0 rounded-2xl"
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

          {/* Magazine Back (for flip effect) */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl backface-hidden"
            style={{
              rotateY: 180,
              background:
                "linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)",
            }}
          >
            <div className="h-full p-6 flex flex-col justify-center items-center text-center text-white">
              <BookOpen className="w-16 h-16 text-white/60 mb-4" />
              <h4 className="text-lg font-bold mb-2">Table of Contents</h4>
              <div className="space-y-2 text-sm text-white/80">
                {magazine.highlights.slice(0, 3).map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3D Shadow */}
          <motion.div
            className="absolute inset-0 rounded-2xl -z-10"
            style={{
              background:
                "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
              filter: "blur(20px)",
              transform: "translateZ(-20px) scale(0.9)",
            }}
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="insights"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)",
      }}
    >
      {/* Morphing 3D Financial Elements */}
      <SectionMorphingElements />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Financial Charts */}
        <motion.div
          className="absolute top-20 right-10"
          style={{
            x: springX,
            y: springY,
            rotateZ: useTransform(scrollYProgress, [0, 1], [0, 360]),
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <BarChart3 className="w-16 h-16 text-blue-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-10"
          style={{
            x: useTransform(springX, (x) => -x * 0.5),
            y: useTransform(springY, (y) => -y * 0.5),
            rotateY,
          }}
        >
          <motion.div
            animate={{
              rotateX: [0, 360],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <PieChart className="w-12 h-12 text-purple-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute top-1/2 right-1/4"
          style={{
            x: useTransform(springX, (x) => x * 0.8),
            y: useTransform(springY, (y) => y * 0.8),
            rotateX,
          }}
        >
          <motion.div
            animate={{
              rotateZ: [0, -360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-28 h-28 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center"
          >
            <LineChart className="w-14 h-14 text-green-400" />
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center space-x-3 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <div className="text-left">
              <h2
                className="text-6xl md:text-8xl font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 25%, #06b6d4 50%, #10b981 75%, #f59e0b 100%)",
                  backgroundSize: "300% 100%",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                FINSIGHT
              </h2>
              <motion.p
                className="text-xl text-white/70 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Financial Intelligence Magazine
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-6 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              animate={{
                scaleX: [0.5, 1, 0.5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="flex space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <Award className="w-5 h-5 text-purple-400" />
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
              animate={{
                scaleX: [0.5, 1, 0.5],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
          </motion.div>

          <motion.p
            className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Dive deep into the world of finance with our quarterly digital
            magazine. Featuring cutting-edge insights, expert perspectives, and
            exclusive interviews from industry leaders and rising stars.
          </motion.p>
        </motion.div>

        {/* Featured Magazine 3D Display */}
        <motion.div
          ref={magazineRef}
          className="flex justify-center mb-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="relative">
            <Magazine3D magazine={featuredMagazine} featured={true} />
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-white/80 mb-6">
              Get notified when new editions are released and never miss out on
              the latest financial insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                onClick={() =>
                  window.open(
                    "https://heyzine.com/flip-book/3f3a9a2239.html#page/1",
                    "_blank",
                  )
                }
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Read Magazine
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Share className="w-5 h-5 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Magazine Detail Modal */}
      <AnimatePresence>
        {selectedMagazine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMagazine(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {selectedMagazine.title}
                        </h3>
                        <p className="text-xl text-blue-300 mb-4">
                          {selectedMagazine.edition}
                        </p>
                        <p className="text-white/80 leading-relaxed">
                          {selectedMagazine.description}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMagazine(null)}
                      className="text-white hover:bg-white/10"
                    >
                      ✕
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      {
                        label: "Articles",
                        value: selectedMagazine.articles,
                        icon: BookOpen,
                      },
                      {
                        label: "Downloads",
                        value: selectedMagazine.downloads.toLocaleString(),
                        icon: Download,
                      },
                      {
                        label: "Read Time",
                        value: selectedMagazine.readTime,
                        icon: Calendar,
                      },
                      { label: "Rating", value: "4.9/5", icon: Star },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-sm text-white/70">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-4">
                      Key Highlights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMagazine.highlights.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                          <span className="text-white/90">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Read Online
                    </Button>
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
