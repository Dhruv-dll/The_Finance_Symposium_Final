import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Target,
  Globe,
  Coins,
  Building2,
  Award,
  Zap,
} from "lucide-react";

interface FinancialElement {
  id: string;
  icon: React.ComponentType<any>;
  color: string;
  size: number;
  concept: string;
}

const lightFinancialElements: FinancialElement[] = [
  { id: "trending-up", icon: TrendingUp, color: "#10b981", size: 24, concept: "Growth" },
  { id: "dollar", icon: DollarSign, color: "#fbbf24", size: 26, concept: "Currency" },
  { id: "pie-chart", icon: PieChart, color: "#8b5cf6", size: 22, concept: "Analytics" },
  { id: "bar-chart", icon: BarChart3, color: "#06b6d4", size: 24, concept: "Data" },
  { id: "target", icon: Target, color: "#ec4899", size: 20, concept: "Goals" },
  { id: "globe", icon: Globe, color: "#0ea5e9", size: 22, concept: "Global" },
  { id: "coins", icon: Coins, color: "#f59e0b", size: 24, concept: "Assets" },
  { id: "building", icon: Building2, color: "#64748b", size: 26, concept: "Banking" },
  { id: "award", icon: Award, color: "#fbbf24", size: 22, concept: "Excellence" },
  { id: "zap", icon: Zap, color: "#84cc16", size: 20, concept: "Innovation" },
];

interface LightMorphingElementsProps {
  density?: "low" | "medium";
  speed?: "slow" | "medium";
  mobile?: boolean;
}

export default function LightMorphingElements({
  density = "low",
  speed = "slow",
  mobile = false,
}: LightMorphingElementsProps) {
  const [elements, setElements] = useState<Array<FinancialElement & { 
    x: number; 
    y: number; 
    rotation: number;
    scale: number;
    active: boolean;
  }>>([]);

  // Reduced density for performance
  const elementCount = mobile ? 4 : (density === "low" ? 6 : 8);
  
  // Slower animations for better performance
  const animationDuration = speed === "slow" ? 8 : 6;

  // Initialize elements
  useEffect(() => {
    const initElements = Array.from({ length: elementCount }, (_, i) => {
      const element = lightFinancialElements[i % lightFinancialElements.length];
      return {
        ...element,
        x: 10 + Math.random() * 80, // Keep away from edges
        y: 10 + Math.random() * 80,
        rotation: Math.random() * 360,
        scale: mobile ? 0.7 : 0.8 + Math.random() * 0.4,
        active: false,
      };
    });
    setElements(initElements);
  }, [elementCount, mobile]);

  // Simplified activation cycle
  useEffect(() => {
    if (elements.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * elements.length);
      setElements(prev => prev.map((el, i) => 
        i === randomIndex 
          ? { ...el, active: true }
          : { ...el, active: false }
      ));
    }, 4000); // Slower cycle for better performance

    return () => clearInterval(interval);
  }, [elements.length]);

  // Skip rendering on very small screens or if reduced motion is preferred
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || (window.innerWidth < 640 && mobile)) {
      setElements([]);
    }
  }, [mobile]);

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
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
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.3, scale: element.scale }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Simplified container */}
              <motion.div
                className="relative"
                animate={{
                  rotate: element.rotation,
                }}
                transition={{
                  duration: animationDuration,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* Simple background */}
                <motion.div
                  className="absolute inset-0 rounded-lg backdrop-blur-sm border border-white/10"
                  style={{
                    width: element.size + 8,
                    height: element.size + 8,
                    background: `${element.color}15`,
                  }}
                  animate={{
                    scale: element.active ? 1.2 : 1,
                    opacity: element.active ? 0.6 : 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  style={{
                    width: element.size + 8,
                    height: element.size + 8,
                  }}
                  animate={{
                    scale: element.active ? 1.1 : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  <Icon
                    style={{ 
                      color: element.color,
                      filter: element.active ? `drop-shadow(0 0 6px ${element.color}60)` : 'none',
                    }}
                    size={element.size}
                  />
                </motion.div>

                {/* Simple glow effect */}
                {element.active && (
                  <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: `radial-gradient(circle, ${element.color}20 0%, transparent 70%)`,
                      filter: "blur(4px)",
                    }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0.4 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Preset configurations for different use cases
export const MobileLightElements = () => (
  <LightMorphingElements density="low" speed="slow" mobile={true} />
);

export const DesktopLightElements = () => (
  <LightMorphingElements density="medium" speed="medium" mobile={false} />
);
