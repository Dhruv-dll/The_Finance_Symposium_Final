import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Save, Settings, Calendar, Users, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEventsData } from "../hooks/useEventsData";

interface AdminEventsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminEventsPanel({
  isOpen,
  onClose,
}: AdminEventsPanelProps) {
  const {
    addSaturdaySession,
    addNetworkingEvent,
    addFlagshipEvent,
    addUpcomingEvent,
    removeUpcomingEvent,
    removeSaturdaySession,
    removeNetworkingEvent,
    removeFlagshipEvent,
    upcomingEvents,
    eventDetails,
  } = useEventsData();

  const [newSaturdaySession, setNewSaturdaySession] = useState({
    title: "",
    description: "",
  });
  const [newNetworkingEvent, setNewNetworkingEvent] = useState({
    title: "",
    description: "",
  });
  const [newFlagshipEvent, setNewFlagshipEvent] = useState({
    title: "",
    description: "",
  });
  const [newUpcomingEvent, setNewUpcomingEvent] = useState({
    id: "",
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    registrationLink: "",
    countdown: { days: 0, hours: 0, minutes: 0 },
  });

  const handleAddSaturdaySession = () => {
    if (newSaturdaySession.title.trim()) {
      addSaturdaySession(newSaturdaySession);
      setNewSaturdaySession({ title: "", description: "" });
      alert("Saturday Session added successfully!");
    }
  };

  const handleAddNetworkingEvent = () => {
    if (newNetworkingEvent.title.trim()) {
      addNetworkingEvent(newNetworkingEvent);
      setNewNetworkingEvent({ title: "", description: "" });
      alert("Networking Event added successfully!");
    }
  };

  const handleAddFlagshipEvent = () => {
    if (newFlagshipEvent.title.trim()) {
      addFlagshipEvent(newFlagshipEvent);
      setNewFlagshipEvent({ title: "", description: "" });
      alert("Flagship Event added successfully!");
    }
  };

  const handleAddUpcomingEvent = () => {
    if (newUpcomingEvent.title.trim() && newUpcomingEvent.date.trim()) {
      const eventWithId = {
        ...newUpcomingEvent,
        id: newUpcomingEvent.id || `event-${Date.now()}`,
      };
      addUpcomingEvent(eventWithId);
      setNewUpcomingEvent({
        id: "",
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        registrationLink: "",
        countdown: { days: 0, hours: 0, minutes: 0 },
      });
      alert("Upcoming Event added successfully!");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl w-full h-[90vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-finance-navy/90 to-finance-navy-light/90 rounded-2xl p-8 border border-finance-gold/30 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Settings className="w-8 h-8 text-finance-gold" />
                <h2 className="text-3xl font-bold text-finance-gold">
                  Admin Events Panel
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-finance-red/20 transition-colors"
              >
                <X className="w-6 h-6 text-finance-red" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Saturday Sessions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-blue-400">
                    Saturday Sessions
                  </h3>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Session Title (e.g., Saturday Seminar 3: Crypto Fundamentals)"
                    value={newSaturdaySession.title}
                    onChange={(e) =>
                      setNewSaturdaySession((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-blue-500/20"
                  />
                  <Input
                    placeholder="Session Description"
                    value={newSaturdaySession.description}
                    onChange={(e) =>
                      setNewSaturdaySession((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-blue-500/20"
                  />
                  <Button
                    onClick={handleAddSaturdaySession}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Saturday Session
                  </Button>
                </div>
              </motion.div>

              {/* Networking Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Users className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">
                    Networking Events
                  </h3>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Event Title (e.g., Alumni Mixer 2025)"
                    value={newNetworkingEvent.title}
                    onChange={(e) =>
                      setNewNetworkingEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-green-500/20"
                  />
                  <Input
                    placeholder="Event Description"
                    value={newNetworkingEvent.description}
                    onChange={(e) =>
                      setNewNetworkingEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-green-500/20"
                  />
                  <Button
                    onClick={handleAddNetworkingEvent}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Networking Event
                  </Button>
                </div>
              </motion.div>

              {/* Flagship Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-purple-400">
                    Flagship Conclave
                  </h3>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Event Title (e.g., Annual Finance Conclave 2025)"
                    value={newFlagshipEvent.title}
                    onChange={(e) =>
                      setNewFlagshipEvent((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-purple-500/20"
                  />
                  <Input
                    placeholder="Event Description"
                    value={newFlagshipEvent.description}
                    onChange={(e) =>
                      setNewFlagshipEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-purple-500/20"
                  />
                  <Button
                    onClick={handleAddFlagshipEvent}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flagship Event
                  </Button>
                </div>
              </motion.div>

              {/* Upcoming Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-finance-navy/40 backdrop-blur-sm rounded-xl p-6 border border-finance-gold/20"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-finance-gold" />
                  <h3 className="text-xl font-bold text-finance-gold">
                    Upcoming Events Timeline
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      placeholder="Event Title"
                      value={newUpcomingEvent.title}
                      onChange={(e) =>
                        setNewUpcomingEvent((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="bg-finance-navy/50 border-finance-gold/20"
                    />
                    <Input
                      placeholder="Date (e.g., March 15, 2025)"
                      value={newUpcomingEvent.date}
                      onChange={(e) =>
                        setNewUpcomingEvent((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      className="bg-finance-navy/50 border-finance-gold/20"
                    />
                    <Input
                      placeholder="Time (e.g., 10:00 AM - 6:00 PM)"
                      value={newUpcomingEvent.time}
                      onChange={(e) =>
                        setNewUpcomingEvent((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      className="bg-finance-navy/50 border-finance-gold/20"
                    />
                    <Input
                      placeholder="Location"
                      value={newUpcomingEvent.location}
                      onChange={(e) =>
                        setNewUpcomingEvent((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="bg-finance-navy/50 border-finance-gold/20"
                    />
                  </div>
                  <Input
                    placeholder="Event Description"
                    value={newUpcomingEvent.description}
                    onChange={(e) =>
                      setNewUpcomingEvent((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-finance-navy/50 border-finance-gold/20"
                  />
                  <Input
                    placeholder="Days until event (for countdown)"
                    type="number"
                    value={newUpcomingEvent.countdown.days}
                    onChange={(e) =>
                      setNewUpcomingEvent((prev) => ({
                        ...prev,
                        countdown: {
                          ...prev.countdown,
                          days: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="bg-finance-navy/50 border-finance-gold/20"
                  />
                  <Button
                    onClick={handleAddUpcomingEvent}
                    className="bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy hover:scale-105 transition-transform"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Upcoming Event
                  </Button>
                </div>

                {/* Current Upcoming Events */}
                {upcomingEvents.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-finance-electric mb-3">
                      Current Upcoming Events:
                    </h4>
                    <div className="space-y-2">
                      {upcomingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between bg-finance-navy/30 p-3 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-finance-gold">
                              {event.title}
                            </div>
                            <div className="text-sm text-finance-electric">
                              {event.date} • {event.location}
                            </div>
                          </div>
                          <Button
                            onClick={() => removeUpcomingEvent(event.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-finance-electric/70">
                💡 All changes are saved automatically in local storage. Changes
                will persist until cleared.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
