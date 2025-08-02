import { useState, useEffect } from "react";

interface EventItem {
  title: string;
  description?: string;
}

interface EventDetails {
  id: string;
  title: string;
  events?: EventItem[];
  comingSoon?: boolean;
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

interface EventsConfig {
  pastEvents: {
    [key: string]: {
      events?: EventItem[];
      comingSoon?: boolean;
    };
  };
  upcomingEvents: UpcomingEvent[];
}

const defaultConfig: EventsConfig = {
  pastEvents: {
    "saturday-sessions": {
      events: [
        {
          title: "Saturday Seminar 1: Data Meets Finance",
          description:
            "Exploring the intersection of data analytics and financial decision-making",
        },
        {
          title:
            "Saturday Seminar 2: Banking 101: Demystifying India's Backbone",
          description:
            "Understanding the fundamentals of India's banking system",
        },
      ],
    },
    "networking-events": {
      comingSoon: true,
    },
    "flagship-event": {
      comingSoon: true,
    },
  },
  upcomingEvents: [],
};

export function useEventsData() {
  const [eventsConfig, setEventsConfig] = useState<EventsConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  // Function to load events config from localStorage or fallback
  const loadEventsConfig = () => {
    const savedConfig = localStorage.getItem("tfs-events-config");
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setEventsConfig(parsedConfig);
        return true;
      } catch (error) {
        console.warn("Failed to parse saved events config, using default");
        setEventsConfig(defaultConfig);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    // Try to load from local storage first (for admin changes)
    const loadedFromStorage = loadEventsConfig();

    if (!loadedFromStorage) {
      // Try to load from JSON file
      fetch("/client/data/eventsConfig.json")
        .then((response) => response.json())
        .then((data) => {
          setEventsConfig(data);
          // Save to local storage for future admin edits
          localStorage.setItem("tfs-events-config", JSON.stringify(data));
        })
        .catch((error) => {
          console.warn("Failed to load events config, using default");
          setEventsConfig(defaultConfig);
        });
    }
    setLoading(false);
  }, []);

  // Listen for localStorage changes from admin panel
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "tfs-events-config" && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          setEventsConfig(newConfig);
        } catch (error) {
          console.warn("Failed to parse updated events config");
        }
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events within the same tab
    const handleCustomStorageChange = () => {
      loadEventsConfig();
    };

    window.addEventListener("tfs-events-updated", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tfs-events-updated", handleCustomStorageChange);
    };
  }, []);

  // Convert config to EventDetails format
  const getEventDetails = (): EventDetails[] => {
    return Object.entries(eventsConfig.pastEvents).map(([id, config]) => ({
      id,
      title: getTitleFromId(id),
      events: config.events,
      comingSoon: config.comingSoon,
    }));
  };

  const getTitleFromId = (id: string): string => {
    const titleMap: { [key: string]: string } = {
      "saturday-sessions": "Saturday Sessions",
      "networking-events": "Networking Events",
      "flagship-event": "Flagship Conclave",
    };
    return titleMap[id] || id;
  };

  // Helper function to save config and notify other components
  const saveConfig = (newConfig: EventsConfig) => {
    setEventsConfig(newConfig);
    localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("tfs-events-updated"));
  };

  // Admin functions to update events
  const addSaturdaySession = (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents["saturday-sessions"].events) {
      newConfig.pastEvents["saturday-sessions"].events = [];
    }
    newConfig.pastEvents["saturday-sessions"].events!.push(event);
    newConfig.pastEvents["saturday-sessions"].comingSoon = false;

    saveConfig(newConfig);
  };

  const addNetworkingEvent = (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents["networking-events"].events) {
      newConfig.pastEvents["networking-events"].events = [];
    }
    newConfig.pastEvents["networking-events"].events!.push(event);
    newConfig.pastEvents["networking-events"].comingSoon = false;

    saveConfig(newConfig);
  };

  const addFlagshipEvent = (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents["flagship-event"].events) {
      newConfig.pastEvents["flagship-event"].events = [];
    }
    newConfig.pastEvents["flagship-event"].events!.push(event);
    newConfig.pastEvents["flagship-event"].comingSoon = false;

    saveConfig(newConfig);
  };

  const addUpcomingEvent = (event: UpcomingEvent) => {
    const newConfig = { ...eventsConfig };
    newConfig.upcomingEvents.push(event);

    saveConfig(newConfig);
  };

  const removeUpcomingEvent = (eventId: string) => {
    const newConfig = { ...eventsConfig };
    newConfig.upcomingEvents = newConfig.upcomingEvents.filter(
      (e) => e.id !== eventId,
    );

    saveConfig(newConfig);
  };

  // Remove functions for past events
  const removeSaturdaySession = (eventIndex: number) => {
    const newConfig = { ...eventsConfig };
    if (newConfig.pastEvents["saturday-sessions"].events) {
      newConfig.pastEvents["saturday-sessions"].events.splice(eventIndex, 1);
      if (newConfig.pastEvents["saturday-sessions"].events.length === 0) {
        newConfig.pastEvents["saturday-sessions"].comingSoon = true;
        delete newConfig.pastEvents["saturday-sessions"].events;
      }
    }
    setEventsConfig(newConfig);
    localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));
  };

  const removeNetworkingEvent = (eventIndex: number) => {
    const newConfig = { ...eventsConfig };
    if (newConfig.pastEvents["networking-events"].events) {
      newConfig.pastEvents["networking-events"].events.splice(eventIndex, 1);
      if (newConfig.pastEvents["networking-events"].events.length === 0) {
        newConfig.pastEvents["networking-events"].comingSoon = true;
        delete newConfig.pastEvents["networking-events"].events;
      }
    }
    setEventsConfig(newConfig);
    localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));
  };

  const removeFlagshipEvent = (eventIndex: number) => {
    const newConfig = { ...eventsConfig };
    if (newConfig.pastEvents["flagship-event"].events) {
      newConfig.pastEvents["flagship-event"].events.splice(eventIndex, 1);
      if (newConfig.pastEvents["flagship-event"].events.length === 0) {
        newConfig.pastEvents["flagship-event"].comingSoon = true;
        delete newConfig.pastEvents["flagship-event"].events;
      }
    }
    setEventsConfig(newConfig);
    localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));
  };

  const updateEventConfig = (newConfig: EventsConfig) => {
    setEventsConfig(newConfig);
    localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));
  };

  return {
    loading,
    eventDetails: getEventDetails(),
    upcomingEvents: eventsConfig.upcomingEvents,
    addSaturdaySession,
    addNetworkingEvent,
    addFlagshipEvent,
    addUpcomingEvent,
    removeUpcomingEvent,
    removeSaturdaySession,
    removeNetworkingEvent,
    removeFlagshipEvent,
    updateEventConfig,
    rawConfig: eventsConfig,
  };
}
