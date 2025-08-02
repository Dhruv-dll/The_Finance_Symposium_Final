import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Trophy,
  ChevronRight,
  Sparkles,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface EventCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  backgroundGradient: string;
  hoverColor: string;
  isPremium?: boolean;
}

interface ModernEventCardProps {
  event: EventCard;
  index: number;
  onClick: (eventId: string) => void;
  isInView: boolean;
}

export const ModernEventCard: React.FC<ModernEventCardProps> = ({
  event,
  index,
  onClick,
  isInView,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Icon mapping for different events
  const IconComponent = event.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.8 }
      }
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Card Container */}
      <motion.div
        className="relative h-96 rounded-2xl overflow-hidden cursor-pointer"
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => onClick(event.id)}
        style={{
          background: `linear-gradient(135deg, ${event.backgroundGradient})`,
        }}
      >
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: isHovered ? 1.2 : 1,
              rotate: isHovered ? 45 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
            }}
            animate={{
              scale: isHovered ? 1.3 : 1,
              rotate: isHovered ? -30 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0"
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

        {/* Premium Badge */}
        <AnimatePresence>
          {event.isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 180 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="absolute top-4 right-4 z-20"
            >
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-3 py-1.5 shadow-lg">
                <Sparkles className="w-3 h-3 mr-1.5" />
                FLAGSHIP
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Content */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Icon Section */}
          <motion.div
            className="flex items-center justify-center"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotateY: isHovered ? 10 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              }}
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <IconComponent
                className="w-10 h-10 text-white drop-shadow-lg"
                style={{
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                }}
              />
              
              {/* Icon Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: isHovered
                    ? `0 0 30px ${event.hoverColor}`
                    : "0 0 0px transparent",
                }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          </motion.div>

          {/* Content Section */}
          <div className="text-center text-white space-y-4">
            <motion.h3
              className="text-2xl font-bold leading-tight"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              animate={{
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {event.title}
            </motion.h3>
            
            <motion.p
              className="text-white/90 text-sm leading-relaxed"
              animate={{
                opacity: isHovered ? 1 : 0.9,
              }}
              transition={{ duration: 0.3 }}
            >
              {event.description}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="group/btn bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                <span>View Details</span>
                <motion.div
                  animate={{
                    x: isHovered ? 4 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            background: isHovered
              ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
              : "transparent",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Bottom Gradient Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Card Shadow */}
      <motion.div
        className="absolute inset-0 rounded-2xl -z-10"
        animate={{
          scale: isHovered ? 1.02 : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background: `linear-gradient(135deg, ${event.backgroundGradient})`,
          filter: "blur(20px)",
        }}
      />
    </motion.div>
  );
};

export default ModernEventCard;
