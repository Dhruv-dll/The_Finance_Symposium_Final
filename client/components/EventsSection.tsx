import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
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
  const { selectedEvent, setSelectedEvent, openEventPopup } = useEventPopup();
  const { upcomingEvents, loading } = useEventsData();

  const EventCard3D = ({
    event,
    index,
  }: {
    event: EventCard;
    index: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: -15 }}
        animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
        className="relative group perspective-1000"
      >
        {/* 3D Card Container */}
        <motion.div
          className="relative h-80 preserve-3d cursor-pointer rounded-xl overflow-hidden"
          whileHover={{
            scale: 1.02,
            y: -5,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: `linear-gradient(135deg, ${event.backgroundGradient})`,
            boxShadow:
              "0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          }}
          onClick={() => openEventPopup(event.id)}
        >
          {/* Premium Badge */}
          {event.isPremium && (
            <motion.div
              className="absolute -top-3 -right-3 z-20"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Badge className="bg-gradient-to-r from-finance-gold to-yellow-400 text-finance-navy font-bold px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                FLAGSHIP
              </Badge>
            </motion.div>
          )}

          {/* Card Content */}
          <div className="absolute inset-0 p-6 flex flex-col justify-between rounded-xl overflow-hidden">
            {/* Background Particles */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
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

            {/* Icon with 3D Effect */}
            <motion.div
              className="relative z-10"
              whileHover={{
                scale: 1.1,
                rotate: 5,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <event.icon
                  className="w-8 h-8 text-white drop-shadow-lg"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-white">
              <motion.h3
                className="text-2xl font-bold mb-3"
                style={{
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {event.title}
              </motion.h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                {event.description}
              </p>

              {/* Click to view details */}
              <div className="flex items-center space-x-2 text-xs opacity-75">
                <span>Click to view details</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Floating Animation */}
          <motion.div
            className="absolute -inset-1 rounded-xl opacity-30 -z-10"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: `linear-gradient(135deg, ${event.backgroundGradient})`,
              filter: "blur(20px)",
            }}
          />
        </motion.div>
      </motion.div>
    );
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
          >
            Register Now
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
          <h3 className="text-3xl font-bold text-finance-gold mb-12 text-center">
            Past Events Excellence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <EventCard3D key={event.id} event={event} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-finance-electric mb-12 text-center">
            Upcoming Events Timeline
          </h3>

          <div className="max-w-4xl mx-auto">
            {upcomingEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto bg-finance-navy/30 backdrop-blur-sm rounded-xl p-8 border border-finance-electric/20">
                  <div className="text-6xl mb-4">📅</div>
                  <h4 className="text-2xl font-bold text-finance-electric mb-4">
                    Coming Soon
                  </h4>
                  <p className="text-foreground/70">
                    We're planning exciting upcoming events for our community.
                    Stay tuned for amazing announcements!
                  </p>
                </div>
              </motion.div>
            ) : (
              upcomingEvents.map((event, index) => (
                <TimelineEvent key={event.id} event={event} index={index} />
              ))
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-2xl w-full backdrop-blur-xl bg-gradient-to-br from-finance-navy/90 to-finance-navy-light/90 rounded-2xl p-8 border border-finance-gold/30 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-finance-red/20 transition-colors"
              >
                <X className="w-6 h-6 text-finance-red" />
              </button>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-finance-gold mb-6">
                  {selectedEvent.title}
                </h3>

                {selectedEvent.comingSoon ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="py-12"
                  >
                    <div className="text-6xl mb-4">🚧</div>
                    <h4 className="text-2xl font-bold text-finance-electric mb-4">
                      Coming Soon
                    </h4>
                    <p className="text-foreground/70 text-lg">
                      We're currently planning exciting events for this category. 
                      Stay tuned for amazing announcements!
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {selectedEvent.events?.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-finance-gold/20 text-left"
                      >
                        <h4 className="text-xl font-bold text-finance-electric mb-3">
                          {event.title}
                        </h4>
                        {event.description && (
                          <p className="text-foreground/80">
                            {event.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => setSelectedEvent(null)}
                  className="mt-8 bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform duration-200"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
