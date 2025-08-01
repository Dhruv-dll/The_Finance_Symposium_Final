import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, CheckCircle, AlertTriangle } from "lucide-react";
import {
  finnhubMarketDataService,
  MarketSentiment,
  safeFormatTimestamp,
} from "../services/finnhubMarketData";
import TabbedMarketDashboard from "./TabbedMarketDashboard";

interface FloatingMarketIconProps {
  className?: string;
}

export default function FloatingMarketIcon({
  className,
}: FloatingMarketIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment>({
    sentiment: "neutral",
    advanceDeclineRatio: 0.5,
    positiveStocks: 0,
    totalStocks: 0,
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "loading" | "error">("loading");
  const [dataJustUpdated, setDataJustUpdated] = useState(false);

  useEffect(() => {
    setConnectionStatus("loading");
    const unsubscribe = finnhubMarketDataService.subscribeToUpdates((data) => {
      setMarketSentiment(data.sentiment || {
        sentiment: "neutral",
        advanceDeclineRatio: 0.5,
        positiveStocks: 0,
        totalStocks: 0,
      });
      setLastUpdate(new Date());
      setConnectionStatus("connected");
      
      // Flash effect when new data arrives
      setDataJustUpdated(true);
      setTimeout(() => setDataJustUpdated(false), 1000);
    });

    return unsubscribe;
  }, []);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-finance-green";
      case "bearish":
        return "text-finance-red";
      default:
        return "text-finance-electric";
    }
  };

  // Floating icon click animation with haptic feedback
  const handleIconClick = () => {
    // Haptic feedback for mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Short vibration
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Market Dashboard Icon */}
      <motion.div
        className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.button
          onClick={handleIconClick}
          className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-finance-navy/80 backdrop-blur-md border border-finance-gold/30 shadow-2xl flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-finance-gold focus:ring-offset-2 focus:ring-offset-finance-navy"
          style={{
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
          aria-label="Open live market dashboard"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleIconClick();
            }
          }}
          // Idle floating animation
          animate={{
            y: [0, -5, 0],
            boxShadow: [
              "0 0 20px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)",
              "0 0 30px rgba(255, 215, 0, 0.5), 0 12px 40px rgba(0, 0, 0, 0.4)",
              "0 0 20px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)",
            ],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          whileHover={{
            scale: 1.1,
            rotate: 5,
            boxShadow: "0 0 40px rgba(255, 215, 0, 0.8), 0 16px 48px rgba(0, 0, 0, 0.5)",
          }}
          whileTap={{
            scale: 0.95,
            y: -10,
          }}
        >
          {/* Pulse ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-finance-gold/50"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          {/* Data update flash effect */}
          <AnimatePresence>
            {dataJustUpdated && (
              <motion.div
                className="absolute inset-0 rounded-full bg-finance-gold/20"
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>

          {/* Loading spinner */}
          {connectionStatus === "loading" && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-finance-gold"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}

          {/* Status indicators */}
          <div className="absolute -top-1 -right-1">
            {connectionStatus === "connected" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 bg-finance-green rounded-full border border-finance-navy"
              >
                <CheckCircle className="w-3 h-3 text-finance-navy" />
              </motion.div>
            )}
            {connectionStatus === "error" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 bg-finance-red rounded-full border border-finance-navy"
              >
                <AlertTriangle className="w-3 h-3 text-finance-navy" />
              </motion.div>
            )}
          </div>

          {/* Main icon */}
          <motion.div
            className="relative z-10"
            animate={{
              scale: dataJustUpdated ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <BarChart3
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-finance-gold group-hover:text-white transition-colors duration-300"
              style={{
                filter: "drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))",
              }}
              aria-hidden="true"
            />
          </motion.div>

          {/* Ripple effect on click */}
          <motion.div
            className="absolute inset-0 rounded-full bg-finance-gold/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 0, opacity: 0 }}
            whileTap={{ 
              scale: [0, 2], 
              opacity: [0.6, 0],
              transition: { duration: 0.4 }
            }}
          />
        </motion.button>

        {/* Quick stats tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          initial={{ y: 10, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
        >
          <div className="bg-finance-navy/90 backdrop-blur-sm border border-finance-gold/20 rounded-lg p-3 text-xs whitespace-nowrap shadow-xl">
            <div className="font-medium text-finance-gold mb-1">📈 Live Market Data</div>
            <div className="text-foreground flex items-center gap-2">
              <span className={getSentimentColor(marketSentiment.sentiment)}>
                {marketSentiment.sentiment.toUpperCase()}
              </span>
              <span className="text-muted-foreground">
                {marketSentiment.positiveStocks}/{marketSentiment.totalStocks}
              </span>
            </div>
            <div className="text-xs text-finance-electric mt-1">
              Updated: {safeFormatTimestamp(lastUpdate)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tabbed Market Dashboard */}
      <TabbedMarketDashboard 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
      />
    </>
  );
}
