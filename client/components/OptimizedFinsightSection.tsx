import React, { useState, useRef } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Award,
  ArrowUpRight,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

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
    description: "Our inaugural edition featuring comprehensive insights into finance, markets, and emerging technologies shaping the financial world.",
    featured: true,
    articles: 15,
    downloads: 3500,
    readTime: "50 min",
    categories: ["Finance", "Markets", "Technology", "Analysis"],
    highlights: [
      "Market trends and analysis",
      "Investment strategies for students",
      "Industry expert interviews",
      "Financial technology insights"
    ]
  },
  {
    id: "2024-q1",
    title: "Digital Banking Evolution",
    edition: "Q1 2024 Edition",
    date: "March 2024",
    coverImage: "/placeholder.svg",
    description: "The transformation of traditional banking through digital innovation and customer experience.",
    featured: false,
    articles: 9,
    downloads: 1734,
    readTime: "38 min",
    categories: ["Banking", "Digital", "Innovation"],
    highlights: [
      "Neobank business models",
      "Customer experience design",
      "Regulatory compliance",
      "Future of payments"
    ]
  }
];

export default function OptimizedFinsightSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredMagazine = magazines.find(mag => mag.featured) || magazines[0];

  const nextMagazine = () => {
    setCurrentIndex((prev) => (prev + 1) % magazines.length);
  };

  const prevMagazine = () => {
    setCurrentIndex((prev) => (prev - 1 + magazines.length) % magazines.length);
  };

  const MagazineCard = ({ magazine, featured = false }: { magazine: Magazine; featured?: boolean }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className={`relative ${featured ? 'w-full max-w-sm mx-auto' : 'w-64'} cursor-pointer group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setSelectedMagazine(magazine)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={`relative ${featured ? 'h-80' : 'h-72'} rounded-2xl overflow-hidden shadow-xl`}
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
          }}
          animate={{
            boxShadow: isHovered
              ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)"
              : "0 10px 25px rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Simple Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%),
                  linear-gradient(-45deg, transparent 25%, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.05) 50%, transparent 50%)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Magazine Cover Content */}
          <div className="relative h-full p-6 flex flex-col justify-between z-10">
            {/* Header */}
            <div className="text-center mb-4">
              <motion.h3
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                FINSIGHT
              </motion.h3>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold">
                {magazine.edition}
              </Badge>
            </div>

            {/* Featured Article */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <h4 className="text-lg font-bold text-white text-center leading-tight">
                {magazine.title}
              </h4>

              {/* Simple Visual Element */}
              <div className="relative h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10 flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-blue-400/60" />
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

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 rounded-2xl"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Simple Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl -z-10"
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
            filter: "blur(15px)",
          }}
          animate={{
            opacity: isHovered ? 0.4 : 0.2,
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="insights"
      className="relative min-h-screen py-12 sm:py-16 lg:py-20 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
      }}
    >
      {/* Light Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-24 h-24 bg-purple-500/10 rounded-full"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-3 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h2
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold"
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                FINSIGHT
              </h2>
              <motion.p
                className="text-lg sm:text-xl text-white/70 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Financial Intelligence Magazine
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center space-x-4 sm:space-x-6 mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
            <div className="flex space-x-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Dive deep into the world of finance with our quarterly digital magazine. 
            Featuring cutting-edge insights, market analysis, and exclusive interviews 
            from industry leaders and rising stars.
          </motion.p>
        </motion.div>

        {/* Featured Magazine Display */}
        <motion.div
          className="flex justify-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="relative">
            <MagazineCard magazine={featuredMagazine} featured={true} />
            
            {/* Stats - Mobile Responsive */}
            <motion.div
              className="absolute -top-4 -left-4 sm:-top-8 sm:-left-8"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  <div>
                    <div className="text-sm sm:text-lg font-bold">{featuredMagazine.downloads.toLocaleString()}</div>
                    <div className="text-xs text-white/70">Total Reads</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -right-4 sm:-top-8 sm:-right-8"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  <div>
                    <div className="text-sm sm:text-lg font-bold">4.9</div>
                    <div className="text-xs text-white/70">Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 sm:-bottom-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <div>
                    <div className="text-sm sm:text-lg font-bold">{featuredMagazine.articles}</div>
                    <div className="text-xs text-white/70">Expert Articles</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Archive Carousel - Mobile Optimized */}
        <motion.div
          className="mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Magazine Archive</h3>
            <p className="text-white/70 text-base sm:text-lg">Explore our collection of financial insights</p>
          </div>

          <div className="relative">
            {/* Navigation Buttons - Hidden on mobile, shown on larger screens */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevMagazine}
              className="hidden sm:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextMagazine}
              className="hidden sm:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>

            {/* Magazines Display - Responsive Grid/Carousel */}
            <div className="px-4 sm:px-0">
              {/* Mobile: Single column grid */}
              <div className="grid grid-cols-1 gap-6 sm:hidden">
                {magazines.map((magazine) => (
                  <MagazineCard key={magazine.id} magazine={magazine} />
                ))}
              </div>

              {/* Desktop: Carousel */}
              <motion.div
                className="hidden sm:flex justify-center space-x-6 lg:space-x-8 overflow-hidden"
                animate={{
                  x: -currentIndex * 280,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {magazines.map((magazine, index) => (
                  <motion.div
                    key={magazine.id}
                    className="flex-shrink-0"
                    animate={{ 
                      opacity: Math.abs(index - currentIndex) <= 1 ? 1 : 0.5,
                      scale: index === currentIndex ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <MagazineCard magazine={magazine} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-6 sm:hidden">
              {magazines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action - Mobile Responsive */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-white/80 mb-6 text-sm sm:text-base">
              Get notified when new editions are released and never miss out on the latest financial insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Download Latest
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 rounded-xl transition-all duration-300"
              >
                <Share className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Magazine Detail Modal - Mobile Responsive */}
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
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header - Mobile Responsive */}
                <div className="relative p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 lg:w-24 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 truncate">{selectedMagazine.title}</h3>
                        <p className="text-base sm:text-lg lg:text-xl text-blue-300 mb-2 sm:mb-4">{selectedMagazine.edition}</p>
                        <p className="text-white/80 leading-relaxed text-sm sm:text-base hidden sm:block">{selectedMagazine.description}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMagazine(null)}
                      className="text-white hover:bg-white/10 p-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Mobile description */}
                  <p className="text-white/80 leading-relaxed text-sm mt-4 sm:hidden">{selectedMagazine.description}</p>
                </div>

                {/* Content - Mobile Responsive */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {/* Stats - Mobile Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { label: "Articles", value: selectedMagazine.articles, icon: BookOpen },
                      { label: "Downloads", value: selectedMagazine.downloads.toLocaleString(), icon: Download },
                      { label: "Read Time", value: selectedMagazine.readTime, icon: Calendar },
                      { label: "Rating", value: "4.9/5", icon: Star },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="text-center p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/10"
                      >
                        <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-sm sm:text-base lg:text-xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Highlights - Mobile Responsive */}
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-white mb-4">Key Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedMagazine.highlights.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                          <span className="text-white/90 text-sm sm:text-base">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Actions - Mobile Responsive */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Download PDF
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 rounded-xl transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
