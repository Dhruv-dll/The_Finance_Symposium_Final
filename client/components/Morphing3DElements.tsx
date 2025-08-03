import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  LineChart,
  Target,
  Zap,
  Globe,
  Brain,
  Coins,
  CreditCard,
  Building2,
  Briefcase,
  Calculator,
  Activity,
  Award,
  Gem,
  Shield,
  Clock,
} from "lucide-react";

interface FinancialElement {
  id: string;
  icon: React.ComponentType<any>;
  color: string;
  size: number;
  shape: "circle" | "square" | "diamond" | "hexagon";
  concept: string;
}

const financialElements: FinancialElement[] = [
  { id: "trending-up", icon: TrendingUp, color: "#10b981", size: 32, shape: "circle", concept: "Growth" },
  { id: "trending-down", icon: TrendingDown, color: "#ef4444", size: 32, shape: "circle", concept: "Volatility" },
  { id: "dollar", icon: DollarSign, color: "#fbbf24", size: 36, shape: "diamond", concept: "Currency" },
  { id: "pie-chart", icon: PieChart, color: "#8b5cf6", size: 30, shape: "circle", concept: "Analytics" },
  { id: "bar-chart", icon: BarChart3, color: "#06b6d4", size: 34, shape: "square", concept: "Data" },
  { id: "line-chart", icon: LineChart, color: "#f59e0b", size: 32, shape: "hexagon", concept: "Trends" },
  { id: "target", icon: Target, color: "#ec4899", size: 28, shape: "circle", concept: "Goals" },
  { id: "zap", icon: Zap, color: "#84cc16", size: 30, shape: "diamond", concept: "Innovation" },
  { id: "globe", icon: Globe, color: "#0ea5e9", size: 32, shape: "circle", concept: "Global" },
  { id: "brain", icon: Brain, color: "#a855f7", size: 30, shape: "square", concept: "Intelligence" },
  { id: "coins", icon: Coins, color: "#f59e0b", size: 32, shape: "circle", concept: "Assets" },
  { id: "credit-card", icon: CreditCard, color: "#6366f1", size: 30, shape: "square", concept: "Fintech" },
  { id: "building", icon: Building2, color: "#64748b", size: 34, shape: "square", concept: "Banking" },
  { id: "briefcase", icon: Briefcase, color: "#7c3aed", size: 32, shape: "hexagon", concept: "Business" },
  { id: "calculator", icon: Calculator, color: "#059669", size: 30, shape: "square", concept: "Calculation" },
  { id: "activity", icon: Activity, color: "#dc2626", size: 32, shape: "diamond", concept: "Market" },
  { id: "award", icon: Award, color: "#fbbf24", size: 30, shape: "circle", concept: "Excellence" },
  { id: "gem", icon: Gem, color: "#e11d48", size: 28, shape: "diamond", concept: "Value" },
  { id: "shield", icon: Shield, color: "#16a34a", size: 32, shape: "hexagon", concept: "Security" },
  { id: "clock", icon: Clock, color: "#ea580c", size: 30, shape: "circle", concept: "Timing" },
];

interface Morphing3DElementsProps {
  density?: "low" | "medium" | "high";
  speed?: "slow" | "medium" | "fast";
  interactive?: boolean;
}

export default function Morphing3DElements({
  density = "medium",
  speed = "medium",
  interactive = true,
}: Morphing3DElementsProps) {
  const [elements, setElements] = useState<Array<FinancialElement & { 
    x: number; 
    y: number; 
    rotation: number;
    scale: number;
    morphing: boolean;
  }>>([]);

  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springMouseX = useSpring(mouseX, { stiffness: 100, damping: 10 });
  const springMouseY = useSpring(mouseY, { stiffness: 100, damping: 10 });

  // Density mapping
  const elementCount = {
    low: 8,
    medium: 12,
    high: 16,
  }[density];

  // Speed mapping
  const animationDuration = {
    slow: 12,
    medium: 8,
    fast: 5,
  }[speed];

  // Initialize elements
  useEffect(() => {
    const initElements = Array.from({ length: elementCount }, (_, i) => {
      const element = financialElements[i % financialElements.length];
      return {
        ...element,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.7 + Math.random() * 0.6,
        morphing: false,
      };
    });
    setElements(initElements);
  }, [elementCount]);

  // Mouse tracking
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) / 50);
      mouseY.set((e.clientY - window.innerHeight / 2) / 50);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, interactive]);

  // Random morphing effect
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * elements.length);
      setElements(prev => prev.map((el, i) => 
        i === randomIndex 
          ? { ...el, morphing: true }
          : el
      ));

      // Stop morphing after animation
      setTimeout(() => {
        setElements(prev => prev.map((el, i) => 
          i === randomIndex 
            ? { ...el, morphing: false }
            : el
        ));
      }, 2000);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [elements.length]);

  const getShapeVariants = (shape: string) => {
    switch (shape) {
      case "circle":
        return {
          clipPath: "circle(50% at 50% 50%)",
        };
      case "square":
        return {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        };
      case "diamond":
        return {
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        };
      case "hexagon":
        return {
          clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <AnimatePresence>
        {elements.map((element, index) => {
          const Icon = element.icon;
          
          return (
            <motion.div
              key={`${element.id}-${index}`}
              className="absolute"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                x: interactive ? springMouseX : 0,
                y: interactive ? springMouseY : 0,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: element.scale }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Container with 3D perspective */}
              <motion.div
                className="relative"
                style={{
                  perspective: 1000,
                }}
                animate={{
                  rotateX: [0, 360],
                  rotateY: [0, 360],
                  rotateZ: element.rotation + (scrollY.get() * 0.01),
                }}
                transition={{
                  duration: animationDuration + Math.random() * 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Shape Background */}
                <motion.div
                  className="absolute inset-0 backdrop-blur-sm border border-white/20"
                  style={{
                    width: element.size + 16,
                    height: element.size + 16,
                    background: `linear-gradient(135deg, ${element.color}20, ${element.color}10)`,
                    ...getShapeVariants(element.shape),
                  }}
                  animate={{
                    scale: element.morphing ? [1, 1.5, 1] : 1,
                    rotate: element.morphing ? [0, 180, 360] : 0,
                    borderRadius: element.morphing ? ["0%", "50%", "0%"] : "8px",
                  }}
                  transition={{
                    duration: element.morphing ? 2 : 0.5,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  style={{
                    width: element.size + 16,
                    height: element.size + 16,
                  }}
                  animate={{
                    scale: element.morphing ? [1, 0.5, 1] : 1,
                    rotate: element.morphing ? [0, 360, 720] : 0,
                  }}
                  transition={{
                    duration: element.morphing ? 2 : 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Icon
                    style={{ 
                      color: element.color,
                      filter: `drop-shadow(0 0 8px ${element.color}40)`,
                    }}
                    size={element.size}
                  />
                </motion.div>

                {/* Concept Label (appears on morph) */}
                <AnimatePresence>
                  {element.morphing && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white/80 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/20"
                      initial={{ opacity: 0, y: -10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {element.concept}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: `radial-gradient(circle, ${element.color}30 0%, transparent 70%)`,
                    filter: "blur(8px)",
                  }}
                  animate={{
                    scale: element.morphing ? [1, 2, 1] : [0.8, 1.2, 0.8],
                    opacity: element.morphing ? [0.3, 0.8, 0.3] : [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: element.morphing ? 2 : 4,
                    repeat: element.morphing ? 0 : Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Particle Effects */}
                {element.morphing && (
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          background: element.color,
                          left: "50%",
                          top: "50%",
                        }}
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 100],
                          y: [0, (Math.random() - 0.5) * 100],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.1,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Preset configurations for different sections
export const HeroMorphingElements = () => (
  <Morphing3DElements density="high" speed="medium" interactive={true} />
);

export const SectionMorphingElements = () => (
  <Morphing3DElements density="medium" speed="slow" interactive={false} />
);

export const LightMorphingElements = () => (
  <Morphing3DElements density="low" speed="fast" interactive={true} />
);
