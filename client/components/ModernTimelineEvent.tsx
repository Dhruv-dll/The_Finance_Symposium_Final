import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Users,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registrationLink: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
}

interface ModernTimelineEventProps {
  event: UpcomingEvent;
  index: number;
  isInView: boolean;
}

export const ModernTimelineEvent: React.FC<ModernTimelineEventProps> = ({
  event,
  index,
  isInView,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [daysLeft, setDaysLeft] = useState(event.countdown.days);

  // Function to calculate actual days left from the date string
  const calculateRealDaysLeft = (): number => {
    try {
      // Try to parse the date string
      const eventDate = new Date(event.date);
      const currentDate = new Date();

      // Reset time to midnight for accurate day calculation
      currentDate.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);

      const timeDifference = eventDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      return daysDifference; // Allow negative for past events
    } catch (error) {
      // If date parsing fails, fall back to the stored countdown
      return event.countdown.days;
    }
  };

  const isEventPast = daysLeft < 0;
  const isEventToday = daysLeft === 0;
  const isEventSoon = daysLeft > 0 && daysLeft <= 7;
  const isEventThisMonth = daysLeft > 7 && daysLeft <= 30;

  // Update days left on mount and periodically
  useEffect(() => {
    const updateDays = () => {
      const realDaysLeft = calculateRealDaysLeft();
      setDaysLeft(realDaysLeft);
    };

    // Update immediately
    updateDays();

    // Update every hour to keep it fresh
    const interval = setInterval(updateDays, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [event.date, event.countdown.days]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      animate={
        isInView
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 0, x: -100, scale: 0.8 }
      }
      transition={{
        duration: 0.8,
        delay: 0.2 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex items-start mb-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline Line */}
      <div className="absolute left-6 top-16 w-0.5 h-full">
        <motion.div
          className="w-full bg-gradient-to-b from-amber-400/80 via-cyan-400/60 to-transparent"
          initial={{ height: 0 }}
          animate={isInView ? { height: "100%" } : { height: 0 }}
          transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
        />
      </div>

      {/* Timeline Node */}
      <motion.div
        className="relative z-10 flex-shrink-0"
        animate={{
          scale: isHovered ? 1.2 : 1,
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #06b6d4, #f59e0b)",
          }}
          animate={{
            boxShadow: isHovered
              ? [
                  "0 0 0 0 rgba(245, 158, 11, 0.4)",
                  "0 0 0 20px rgba(245, 158, 11, 0)",
                  "0 0 0 0 rgba(245, 158, 11, 0.4)",
                ]
              : "0 0 0 0 rgba(245, 158, 11, 0.4)",
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: isHovered ? -360 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <Calendar className="w-6 h-6 text-black" />
          </motion.div>

          {/* Node Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: isHovered
                ? "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
                : "transparent",
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* Event Card */}
      <motion.div
        className="ml-8 flex-1 max-w-2xl"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/10"
          style={{
            background:
              "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)",
          }}
          animate={{
            borderColor: isHovered ? "rgba(245, 158, 11, 0.5)" : "rgba(255, 255, 255, 0.1)",
            boxShadow: isHovered
              ? "0 20px 60px rgba(245, 158, 11, 0.3), 0 8px 25px rgba(0, 0, 0, 0.2)"
              : "0 10px 30px rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10"
              style={{
                background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
              }}
              animate={{
                scale: isHovered ? 1.3 : 1,
                rotate: isHovered ? 45 : 0,
              }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full opacity-10"
              style={{
                background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
              }}
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? -30 : 0,
              }}
              transition={{ duration: 0.8, delay: 0.1 }}
            />
          </div>

          {/* Card Content */}
          <div className="relative p-6">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <motion.h4
                  className="text-2xl font-bold text-white mb-3"
                  animate={{
                    color: isHovered ? "#f59e0b" : "#ffffff",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {event.title}
                </motion.h4>

                {/* Event Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Countdown Badge */}
              <motion.div
                className="text-center ml-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Badge
                  className={`${
                    isEventPast
                      ? "bg-gradient-to-r from-gray-600 to-gray-700"
                      : isEventToday
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 animate-bounce"
                      : isEventSoon
                      ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
                      : isEventThisMonth
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-gradient-to-r from-amber-500 to-orange-500"
                  } text-black font-bold px-4 py-2 mb-2`}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {isEventPast
                    ? `${Math.abs(daysLeft)} Days Ago`
                    : isEventToday
                    ? "TODAY!"
                    : `${daysLeft} Days Left`
                  }
                </Badge>
                <div className={`text-xs ${
                  isEventPast
                    ? "text-gray-400"
                    : isEventToday
                    ? "text-green-300 font-bold animate-pulse"
                    : isEventSoon
                    ? "text-red-300 font-semibold"
                    : "text-white/60"
                }`}>
                  {isEventPast
                    ? "Event Completed"
                    : isEventToday
                    ? "🟢 HAPPENING NOW!"
                    : isEventSoon
                    ? "⚡ Very Soon!"
                    : "Until Event"
                  }
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              className="text-white/80 leading-relaxed mb-6"
              animate={{
                opacity: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              {event.description}
            </motion.p>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="flex items-center space-x-2 text-sm text-white/60"
                  animate={{
                    opacity: isHovered ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="w-4 h-4" />
                  <span>Join the event</span>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold rounded-xl transition-all duration-300"
                  size="lg"
                  onClick={() =>
                    event.registrationLink &&
                    window.open(event.registrationLink, "_blank")
                  }
                  disabled={!event.registrationLink}
                >
                  {event.registrationLink ? (
                    <>
                      <span>Register Now</span>
                      <motion.div
                        animate={{
                          x: isHovered ? 4 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Registration Coming Soon</span>
                    </>
                  )}
                </Button>
              </motion.div>
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
      </motion.div>
    </motion.div>
  );
};

export default ModernTimelineEvent;
