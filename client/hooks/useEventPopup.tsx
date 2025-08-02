import { useState, createContext, useContext, ReactNode } from 'react';

interface EventDetails {
  id: string;
  title: string;
  events?: {
    title: string;
    description?: string;
  }[];
  comingSoon?: boolean;
}

interface EventPopupContextType {
  selectedEvent: EventDetails | null;
  setSelectedEvent: (event: EventDetails | null) => void;
  openEventPopup: (eventId: string) => void;
}

const EventPopupContext = createContext<EventPopupContextType | undefined>(undefined);

const eventDetails: EventDetails[] = [
  {
    id: "saturday-sessions",
    title: "Saturday Sessions",
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
  {
    id: "networking-events",
    title: "Networking Events",
    comingSoon: true
  },
  {
    id: "flagship-event",
    title: "Flagship Conclave",
    comingSoon: true
  }
];

export function EventPopupProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);

  const openEventPopup = (eventId: string) => {
    const eventDetail = eventDetails.find(e => e.id === eventId);
    if (eventDetail) {
      setSelectedEvent(eventDetail);
    }
  };

  return (
    <EventPopupContext.Provider value={{ selectedEvent, setSelectedEvent, openEventPopup }}>
      {children}
    </EventPopupContext.Provider>
  );
}

export function useEventPopup() {
  const context = useContext(EventPopupContext);
  if (context === undefined) {
    throw new Error('useEventPopup must be used within an EventPopupProvider');
  }
  return context;
}
