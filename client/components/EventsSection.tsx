import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useEventPopup } from "../hooks/useEventPopup";
import { useEventsData } from "../hooks/useEventsData";
import { ModernEventCard } from "./ModernEventCard";
import { ModernTimelineEvent } from "./ModernTimelineEvent";

interface EventCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  backgroundGradient: string;
  hoverColor: string;
  isPremium?: boolean;
}

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

const pastEvents: EventCard[] = [
  {
    id: "saturday-sessions",
    title: "Saturday Sessions",
    description:
      "Weekly learning sessions that bridge theoretical knowledge with practical insights from industry experts.",
    icon: Calendar,
    backgroundGradient: "from-blue-900 via-blue-700 to-finance-gold",
    hoverColor: "rgba(255, 215, 0, 0.8)",
  },
  {
    id: "networking-events",
    title: "Networking Events",
    description:
      "Connect with industry professionals, alumni, and peers in structured networking sessions.",
    icon: Users,
    backgroundGradient: "from-emerald-900 via-emerald-700 to-finance-electric",
    hoverColor: "rgba(0, 255, 255, 0.8)",
  },
  {
    id: "flagship-event",
    title: "Flagship Conclave",
    description:
      "Our premier annual event featuring top industry leaders, workshops, and competitions.",
    icon: Trophy,
    backgroundGradient: "from-purple-900 via-purple-700 to-finance-gold",
    hoverColor: "rgba(255, 215, 0, 1)",
    isPremium: true,
  },
];

export default function EventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(false);
  const {
    selectedEvent,
    setSelectedEvent,
    openEventPopup,
    setEventDetailsData,
  } = useEventPopup();
  const { upcomingEvents, loading, eventDetails } = useEventsData();

  // Update popup context with event details when they change
  useEffect(() => {
    if (setEventDetailsData && eventDetails) {
      setEventDetailsData(eventDetails);
    }
  }, [eventDetails, setEventDetailsData]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle event card click
  const handleEventCardClick = (eventId: string) => {
    if (openEventPopup) {
      openEventPopup(eventId);
    }
  };

  const TimelineEvent = ({
    event,
    index,
  }: {
    event: UpcomingEvent;
    index: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
        className="relative flex items-center mb-8 group"
      >
        {/* Timeline Line */}
        <div className="absolute left-4 top-12 w-0.5 h-full bg-gradient-to-b from-finance-gold to-transparent opacity-50" />

        {/* Timeline Node */}
        <motion.div
          className="relative w-8 h-8 bg-gradient-to-r from-finance-gold to-finance-electric rounded-full flex items-center justify-center z-10"
          whileHover={{ scale: 1.2 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(255, 215, 0, 0.4)",
              "0 0 0 10px rgba(255, 215, 0, 0)",
              "0 0 0 0 rgba(255, 215, 0, 0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Clock className="w-4 h-4 text-finance-navy" />
        </motion.div>

        {/* Event Card */}
        <motion.div
          className="ml-8 flex-1 bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-finance-gold/20 group-hover:border-finance-gold/40 transition-all duration-300"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 20px 40px -10px rgba(255, 215, 0, 0.3)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold text-finance-gold mb-2">
                {event.title}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-finance-electric">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </span>
              </div>
            </div>

            {/* Countdown */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                Days Left
              </div>
              <motion.div
                className="text-2xl font-bold text-finance-gold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {event.countdown.days}
              </motion.div>
            </div>
          </div>

          <p className="text-foreground/80 mb-4">{event.description}</p>

          <Button
            className="bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform duration-200"
            size="sm"
            onClick={() =>
              event.registrationLink &&
              window.open(event.registrationLink, "_blank")
            }
            disabled={!event.registrationLink}
          >
            {event.registrationLink
              ? "Register Now"
              : "Registration Coming Soon"}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative min-h-screen py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #000012 0%, #0a0a23 50%, #1a1a2e 100%)",
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={isMobile ? { duration: 0 } : { duration: 0.8 }}
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
            TFS EVENTS PORTFOLIO
          </motion.h2>
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-transparent via-finance-gold to-transparent mx-auto mb-6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Discover our comprehensive portfolio of financial education events,
            from intimate learning sessions to grand industry conclaves.
          </p>
        </motion.div>

        {/* Past Events Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 mb-4">
              Past Events Excellence
            </h3>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <ModernEventCard
                key={event.id}
                event={event}
                index={index}
                onClick={handleEventCardClick}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          {/* Enhanced Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-16"
          >
            <motion.h3
              className="text-5xl font-bold mb-4"
              style={{
                background:
                  "linear-gradient(135deg, #06b6d4 0%, #f59e0b 50%, #06b6d4 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Upcoming Events Timeline
            </motion.h3>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-lg text-white/70 max-w-2xl mx-auto"
            >
              Stay updated with our exciting upcoming events and secure your
              spot!
            </motion.p>
          </motion.div>

          {/* Timeline Container */}
          <div className="max-w-5xl mx-auto relative">
            {upcomingEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="relative max-w-lg mx-auto">
                  {/* Animated Background */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-20"
                    animate={{
                      background: [
                        "linear-gradient(45deg, #06b6d4, #f59e0b)",
                        "linear-gradient(45deg, #f59e0b, #06b6d4)",
                        "linear-gradient(45deg, #06b6d4, #f59e0b)",
                      ],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-8xl mb-6"
                    >
                      🚀
                    </motion.div>
                    <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 mb-6">
                      Amazing Events Coming Soon
                    </h4>
                    <p className="text-white/70 text-lg leading-relaxed">
                      We're crafting incredible experiences for our community.
                      Get ready for some spectacular announcements!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {upcomingEvents.map((event, index) => (
                  <ModernTimelineEvent
                    key={event.id}
                    event={event}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Event Details Popup */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header with gradient overlay */}
                <div className="relative p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-amber-600/20">
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>

                  {/* Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl font-bold text-white mb-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #00FFFF 50%, #FFD700 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {selectedEvent.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-white/70 text-lg"
                  >
                    Explore our collection of events in this category
                  </motion.p>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {selectedEvent.comingSoon ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="text-center py-16"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-8xl mb-6"
                      >
                        🚧
                      </motion.div>
                      <h4 className="text-3xl font-bold text-amber-400 mb-6">
                        Coming Soon
                      </h4>
                      <p className="text-white/70 text-lg max-w-md mx-auto leading-relaxed">
                        We're currently planning exciting events for this
                        category. Stay tuned for amazing announcements!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <motion.h4
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl font-semibold text-cyan-400 mb-6"
                      >
                        Events in this category:
                      </motion.h4>

                      {selectedEvent.events?.map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -30, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.4 + index * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="group relative overflow-hidden"
                        >
                          <div className="relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                            {/* Event number badge */}
                            <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-black">
                              {index + 1}
                            </div>

                            {/* Hover glow effect */}
                            <motion.div
                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background:
                                  "linear-gradient(45deg, rgba(255,215,0,0.05) 0%, rgba(0,255,255,0.05) 100%)",
                              }}
                            />

                            <div className="relative z-10">
                              <h5 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors duration-300">
                                {event.title}
                              </h5>
                              {event.description && (
                                <p className="text-white/80 leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-8 pt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={() => setSelectedEvent(null)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
                    >
                      Close
                    </Button>
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
