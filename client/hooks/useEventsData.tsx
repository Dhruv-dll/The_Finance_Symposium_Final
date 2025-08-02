import { useState, useEffect } from 'react';

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
          description: "Exploring the intersection of data analytics and financial decision-making"
        },
        {
          title: "Saturday Seminar 2: Banking 101: Demystifying India's Backbone",
          description: "Understanding the fundamentals of India's banking system"
        }
      ]
    },
    "networking-events": {
      comingSoon: true
    },
    "flagship-event": {
      comingSoon: true
    }
  },
  upcomingEvents: []
};

export function useEventsData() {
  const [eventsConfig, setEventsConfig] = useState<EventsConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from local storage first (for admin changes)
    const savedConfig = localStorage.getItem('tfs-events-config');
    if (savedConfig) {
      try {
        setEventsConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.warn('Failed to parse saved events config, using default');
        setEventsConfig(defaultConfig);
      }
    } else {
      // Try to load from JSON file
      fetch('/client/data/eventsConfig.json')
        .then(response => response.json())
        .then(data => {
          setEventsConfig(data);
          // Save to local storage for future admin edits
          localStorage.setItem('tfs-events-config', JSON.stringify(data));
        })
        .catch(error => {
          console.warn('Failed to load events config, using default');
          setEventsConfig(defaultConfig);
        });
    }
    setLoading(false);
  }, []);

  // Convert config to EventDetails format
  const getEventDetails = (): EventDetails[] => {
    return Object.entries(eventsConfig.pastEvents).map(([id, config]) => ({
      id,
      title: getTitleFromId(id),
      events: config.events,
      comingSoon: config.comingSoon
    }));
  };

  const getTitleFromId = (id: string): string => {
    const titleMap: { [key: string]: string } = {
      'saturday-sessions': 'Saturday Sessions',
      'networking-events': 'Networking Events',
      'flagship-event': 'Flagship Conclave'
    };
    return titleMap[id] || id;
  };

  // Admin functions to update events
  const addSaturdaySession = (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents['saturday-sessions'].events) {
      newConfig.pastEvents['saturday-sessions'].events = [];
    }
    newConfig.pastEvents['saturday-sessions'].events!.push(event);
    newConfig.pastEvents['saturday-sessions'].comingSoon = false;
    
    setEventsConfig(newConfig);
    localStorage.setItem('tfs-events-config', JSON.stringify(newConfig));
  };

  const addNetworkingEvent = (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents['networking-events'].events) {
      newConfig.pastEvents['networking-events'].events = [];
    }
    newConfig.pastEvents['networking-events'].events!.push(event);
    newConfig.pastEvents['networking-events'].comingSoon = false;
    
    setEventsConfig(newConfig);
    localStorage.setItem('tfs-events-config', JSON.stringify(newConfig));
  };

  const addFlagshipEvent = (event: EventItem) => {
    const newConfig = { ...eventsConfig };
    if (!newConfig.pastEvents['flagship-event'].events) {
      newConfig.pastEvents['flagship-event'].events = [];
    }
    newConfig.pastEvents['flagship-event'].events!.push(event);
    newConfig.pastEvents['flagship-event'].comingSoon = false;
    
    setEventsConfig(newConfig);
    localStorage.setItem('tfs-events-config', JSON.stringify(newConfig));
  };

  const addUpcomingEvent = (event: UpcomingEvent) => {
    const newConfig = { ...eventsConfig };
    newConfig.upcomingEvents.push(event);
    
    setEventsConfig(newConfig);
    localStorage.setItem('tfs-events-config', JSON.stringify(newConfig));
  };

  const removeUpcomingEvent = (eventId: string) => {
    const newConfig = { ...eventsConfig };
    newConfig.upcomingEvents = newConfig.upcomingEvents.filter(e => e.id !== eventId);
    
    setEventsConfig(newConfig);
    localStorage.setItem('tfs-events-config', JSON.stringify(newConfig));
  };

  const updateEventConfig = (newConfig: EventsConfig) => {
    setEventsConfig(newConfig);
    localStorage.setItem('tfs-events-config', JSON.stringify(newConfig));
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
    updateEventConfig,
    rawConfig: eventsConfig
  };
}
