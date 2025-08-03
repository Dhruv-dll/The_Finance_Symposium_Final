import React, { createContext, useContext, useState, ReactNode } from "react";

interface MarketDashboardContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleOpen: () => void;
}

const MarketDashboardContext = createContext<
  MarketDashboardContextType | undefined
>(undefined);

export function MarketDashboardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <MarketDashboardContext.Provider value={{ isOpen, setIsOpen, toggleOpen }}>
      {children}
    </MarketDashboardContext.Provider>
  );
}

export function useMarketDashboard() {
  const context = useContext(MarketDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useMarketDashboard must be used within a MarketDashboardProvider",
    );
  }
  return context;
}
