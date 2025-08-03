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
  lastModified?: number;
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
  lastModified: Date.now(),
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

  // Load events data with server sync
  const loadEventsFromServer = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setEventsConfig(result.data);
          // Update local storage with server data
          localStorage.setItem(
            "tfs-events-config",
            JSON.stringify(result.data),
          );
          return true;
        }
      }
      throw new Error("Server request failed");
    } catch (error) {
      console.warn(
        "Failed to load events from server, using local/default data",
      );
      return false;
    }
  };

  // Check if local data needs sync with server
  const checkServerSync = async () => {
    try {
      const localConfig = localStorage.getItem("tfs-events-config");
      const localLastModified = localConfig
        ? JSON.parse(localConfig).lastModified || 0
        : 0;

      const response = await fetch(
        `/api/events/sync?lastModified=${localLastModified}`,
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.needsUpdate) {
          console.log("Server has newer events data, syncing...");
          await loadEventsFromServer();
        }
      }
    } catch (error) {
      console.warn("Failed to check server sync:", error);
    }
  };

  useEffect(() => {
    const initializeEvents = async () => {
      // First try to load from local storage
      const loadedFromStorage = loadEventsConfig();

      if (!loadedFromStorage) {
        // No local data, load from server
        const loadedFromServer = await loadEventsFromServer();
        if (!loadedFromServer) {
          // Fallback to default if server fails
          setEventsConfig(defaultConfig);
        }
      } else {
        // Have local data, check if server has updates
        await checkServerSync();
      }

      setLoading(false);
    };

    initializeEvents();

    // Set up periodic sync check every 30 seconds
    const syncInterval = setInterval(checkServerSync, 30000);

    return () => clearInterval(syncInterval);
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
      window.removeEventListener(
        "tfs-events-updated",
        handleCustomStorageChange,
      );
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

  // Helper function to save config and sync with server
  const saveConfig = async (newConfig: EventsConfig) => {
    try {
      // Add timestamp
      newConfig.lastModified = Date.now();

      // Update local state immediately
      setEventsConfig(newConfig);
      localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));

      // Sync with server
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: newConfig }),
      });

      if (response.ok) {
        console.log("Events data synced with server successfully");
      } else {
        console.warn("Failed to sync events data with server");
      }

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("tfs-events-updated"));
    } catch (error) {
      console.error("Error saving events config:", error);
      // Still update local state even if server sync fails
      setEventsConfig(newConfig);
      localStorage.setItem("tfs-events-config", JSON.stringify(newConfig));
      window.dispatchEvent(new CustomEvent("tfs-events-updated"));
    }
  };

  // Admin functions to update events
  const addSaturdaySession = async (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents["saturday-sessions"].events) {
      newConfig.pastEvents["saturday-sessions"].events = [];
    }
    newConfig.pastEvents["saturday-sessions"].events!.push(event);
    newConfig.pastEvents["saturday-sessions"].comingSoon = false;

    await saveConfig(newConfig);
  };

  const addNetworkingEvent = async (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents["networking-events"].events) {
      newConfig.pastEvents["networking-events"].events = [];
    }
    newConfig.pastEvents["networking-events"].events!.push(event);
    newConfig.pastEvents["networking-events"].comingSoon = false;

    await saveConfig(newConfig);
  };

  const addFlagshipEvent = async (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents["flagship-event"].events) {
      newConfig.pastEvents["flagship-event"].events = [];
    }
    newConfig.pastEvents["flagship-event"].events!.push(event);
    newConfig.pastEvents["flagship-event"].comingSoon = false;

    await saveConfig(newConfig);
  };

  const addUpcomingEvent = async (event: UpcomingEvent) => {
    const newConfig = { ...eventsConfig };
    newConfig.upcomingEvents.push(event);

    await saveConfig(newConfig);
  };

  const removeUpcomingEvent = async (eventId: string) => {
    const newConfig = { ...eventsConfig };
    newConfig.upcomingEvents = newConfig.upcomingEvents.filter(
      (e) => e.id !== eventId,
    );

    await saveConfig(newConfig);
  };

  // Remove functions for past events
  const removeSaturdaySession = async (eventIndex: number) => {
    const newConfig = { ...eventsConfig };
    if (newConfig.pastEvents["saturday-sessions"].events) {
      newConfig.pastEvents["saturday-sessions"].events.splice(eventIndex, 1);
      if (newConfig.pastEvents["saturday-sessions"].events.length === 0) {
        newConfig.pastEvents["saturday-sessions"].comingSoon = true;
        delete newConfig.pastEvents["saturday-sessions"].events;
      }
    }
    await saveConfig(newConfig);
  };

  const removeNetworkingEvent = async (eventIndex: number) => {
    const newConfig = { ...eventsConfig };
    if (newConfig.pastEvents["networking-events"].events) {
      newConfig.pastEvents["networking-events"].events.splice(eventIndex, 1);
      if (newConfig.pastEvents["networking-events"].events.length === 0) {
        newConfig.pastEvents["networking-events"].comingSoon = true;
        delete newConfig.pastEvents["networking-events"].events;
      }
    }
    await saveConfig(newConfig);
  };

  const removeFlagshipEvent = async (eventIndex: number) => {
    const newConfig = { ...eventsConfig };
    if (newConfig.pastEvents["flagship-event"].events) {
      newConfig.pastEvents["flagship-event"].events.splice(eventIndex, 1);
      if (newConfig.pastEvents["flagship-event"].events.length === 0) {
        newConfig.pastEvents["flagship-event"].comingSoon = true;
        delete newConfig.pastEvents["flagship-event"].events;
      }
    }
    await saveConfig(newConfig);
  };

  const updateEventConfig = async (newConfig: EventsConfig) => {
    await saveConfig(newConfig);
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
