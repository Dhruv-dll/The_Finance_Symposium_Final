import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Eye,
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

// Lightweight mobile-optimized event card
const MobileEventCard: React.FC<{
  event: EventCard;
  index: number;
  onClick: (eventId: string) => void;
  isInView: boolean;
}> = ({ event, index, onClick, isInView }) => {
  const IconComponent = event.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <motion.div
        className="relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden cursor-pointer mobile-tap-highlight"
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(event.id)}
        style={{
          background: `linear-gradient(135deg, ${event.backgroundGradient})`,
        }}
      >
        {/* Simplified background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />

        {/* Premium Badge */}
        {event.isPremium && (
          <div className="absolute top-3 right-3 z-20">
            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold px-2 py-1 text-xs">
              FLAGSHIP
            </Badge>
          </div>
        )}

        {/* Card Content */}
        <div className="relative h-full p-4 sm:p-6 flex flex-col justify-between">
          {/* Icon Section */}
          <div className="flex items-center justify-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20">
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center text-white space-y-3">
            <h3 className="text-lg sm:text-xl font-bold leading-tight">
              {event.title}
            </h3>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {event.description}
            </p>

            {/* CTA Button */}
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300 mobile-touch-target"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span>View Details</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

// Simplified timeline event for mobile
const MobileTimelineEvent: React.FC<{
  event: UpcomingEvent;
  index: number;
  isInView: boolean;
}> = ({ event, index, isInView }) => {
  const [daysLeft, setDaysLeft] = useState(event.countdown.days);

  // Calculate actual days left
  const calculateRealDaysLeft = (): number => {
    try {
      const eventDate = new Date(event.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      const timeDifference = eventDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return daysDifference;
    } catch (error) {
      return event.countdown.days;
    }
  };

  useEffect(() => {
    setDaysLeft(calculateRealDaysLeft());
  }, [event.date]);

  const isEventPast = daysLeft < 0;
  const isEventToday = daysLeft === 0;
  const isEventSoon = daysLeft > 0 && daysLeft <= 7;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative flex items-start mb-8 group"
    >
      {/* Timeline line - simplified for mobile */}
      <div className="absolute left-4 top-12 w-0.5 h-full bg-gradient-to-b from-amber-400/60 to-transparent" />

      {/* Timeline node */}
      <div className="relative z-10 flex-shrink-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
        </div>
      </div>

      {/* Event card - mobile optimized */}
      <div className="ml-6 flex-1 mobile-container">
        <div className="relative overflow-hidden rounded-xl bg-slate-900/80 backdrop-blur-sm border border-white/10 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2 truncate">
                {event.title}
              </h4>

              {/* Event meta - stacked on mobile */}
              <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 text-xs sm:text-sm">
                <div className="flex items-center text-cyan-400">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">{event.date}</span>
                </div>
                <div className="flex items-center text-green-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">{event.time}</span>
                </div>
                <div className="flex items-center text-purple-400">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Countdown badge */}
            <div className="ml-3 text-center flex-shrink-0">
              <Badge
                className={`${
                  isEventPast
                    ? "bg-gradient-to-r from-gray-600 to-gray-700"
                    : isEventToday
                      ? "bg-gradient-to-r from-green-500 to-emerald-500"
                      : isEventSoon
                        ? "bg-gradient-to-r from-red-500 to-pink-500"
                        : "bg-gradient-to-r from-amber-500 to-orange-500"
                } text-black font-bold px-2 py-1 text-xs`}
              >
                {isEventPast
                  ? `${Math.abs(daysLeft)}d ago`
                  : isEventToday
                    ? "TODAY"
                    : `${daysLeft}d left`}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Action button */}
          <div className="flex justify-end">
            <Button
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all duration-300 mobile-touch-target"
              size="sm"
              onClick={() =>
                event.registrationLink &&
                window.open(event.registrationLink, "_blank")
              }
              disabled={!event.registrationLink}
            >
              {event.registrationLink ? (
                <>
                  <span>Register</span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span>Soon</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MobileOptimizedEventsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
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

  // Handle event card click
  const handleEventCardClick = (eventId: string) => {
    if (openEventPopup) {
      openEventPopup(eventId);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="events"
      className="relative min-h-screen py-12 sm:py-16 md:py-20 overflow-hidden mobile-container"
      style={{
        background:
          "linear-gradient(135deg, #000012 0%, #0a0a23 50%, #1a1a2e 100%)",
      }}
    >
      {/* Simplified background particles for mobile */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-finance-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 mobile-safe-area">
        {/* Section Header - mobile optimized */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-finance-gold via-finance-electric to-finance-gold bg-clip-text text-transparent">
            TFS EVENTS PORTFOLIO
          </h2>
          <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-transparent via-finance-gold to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto px-4">
            Discover our comprehensive portfolio of financial education events,
            from intimate learning sessions to grand industry conclaves.
          </p>
        </motion.div>

        {/* Past Events Section - mobile grid */}
        <motion.div
          className="mb-16 sm:mb-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 mb-3">
              Past Events Excellence
            </h3>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
          </div>

          {/* Mobile-first grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {pastEvents.map((event, index) => (
              <MobileEventCard
                key={event.id}
                event={event}
                index={index}
                onClick={handleEventCardClick}
                isInView={isInView}
              />
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events Timeline Section - mobile optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative"
        >
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
              Upcoming Events Timeline
            </h3>
            <div className="w-20 sm:w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-3" />
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto px-4">
              Stay updated with our exciting upcoming events and secure your
              spot!
            </p>
          </div>

          {/* Timeline Container - mobile optimized */}
          <div className="max-w-4xl mx-auto relative">
            {upcomingEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12 sm:py-16 md:py-20"
              >
                <div className="relative max-w-lg mx-auto mobile-container px-4">
                  <div className="relative bg-slate-900/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10">
                    <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6">
                      🚀
                    </div>
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 mb-4 sm:mb-6">
                      Amazing Events Coming Soon
                    </h4>
                    <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
                      We're crafting incredible experiences for our community.
                      Get ready for some spectacular announcements!
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {upcomingEvents.map((event, index) => (
                  <MobileTimelineEvent
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

      {/* Event Details Popup - mobile optimized */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 mobile-container"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl w-full max-h-[90vh] overflow-hidden mobile-scroll-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative p-6 sm:p-8 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-amber-600/20">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20 mobile-touch-target"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 pr-12 bg-gradient-to-r from-finance-gold via-finance-electric to-finance-gold bg-clip-text text-transparent">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base md:text-lg">
                    Explore our collection of events in this category
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {selectedEvent.comingSoon ? (
                    <div className="text-center py-8 sm:py-12 md:py-16">
                      <div className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-6">
                        🚧
                      </div>
                      <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-400 mb-4 sm:mb-6">
                        Coming Soon
                      </h4>
                      <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed">
                        We're currently planning exciting events for this
                        category. Stay tuned for amazing announcements!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-lg sm:text-xl font-semibold text-cyan-400 mb-4 sm:mb-6">
                        Events in this category:
                      </h4>

                      {selectedEvent.events?.map((event, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden"
                        >
                          <div className="relative bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-black">
                              {index + 1}
                            </div>

                            <div className="relative z-10">
                              <h5 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 pr-8 group-hover:text-amber-300 transition-colors duration-300">
                                {event.title}
                              </h5>
                              {event.description && (
                                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 sm:p-8 pt-0">
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setSelectedEvent(null)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25 mobile-touch-target"
                    >
                      Close
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
