import { useState, createContext, useContext, ReactNode } from 'react';
import { useEventsData } from './useEventsData';

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

export function EventPopupProvider({ children }: { children: ReactNode }) {
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const { eventDetails } = useEventsData();

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
