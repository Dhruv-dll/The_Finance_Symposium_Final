import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  finnhubMarketDataService,
  FinnhubStockData,
} from "../services/finnhubMarketData";

interface TerminalLoaderProps {
  onComplete: () => void;
}

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showClickPrompt, setShowClickPrompt] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [marketData, setMarketData] = useState<FinnhubStockData[]>([]);
  const [marketStatus, setMarketStatus] = useState<string>("LOADING");
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const audioContextRef = useRef<AudioContext | null>(null);

  const getTerminalSteps = () => [
    "TFS_FINANCIAL_TERMINAL v3.1.4 initializing...",
    "Fetching live market data...",
    marketData.length > 0
      ? `SENSEX: ₹${marketData.find((s) => s.symbol === "^BSESN")?.price?.toLocaleString("en-IN") || "81,234"} | NIFTY: ₹${marketData.find((s) => s.symbol === "^NSEI")?.price?.toLocaleString("en-IN") || "24,789"}`
      : "Connecting to BSE/NSE feeds...",
    marketData.length > 2
      ? `RELIANCE: ₹${marketData.find((s) => s.symbol === "RELIANCE.NS")?.price?.toFixed(2) || "2,847.65"} ●●● LOADED`
      : "Initializing real-time analytics...",
    marketData.length > 3
      ? `TCS: ₹${marketData.find((s) => s.symbol === "TCS.NS")?.price?.toFixed(2) || "4,156.30"} ●●● LOADED`
      : "Loading portfolio management system...",
    "System is Testing Any Known Vulnerability....... Please Be Patient.....",
    `${marketStatus === "OPEN" ? "🟢 MARKETS OPEN" : "🔴 MARKETS CLOSED"}`,
    `Authenticating with Yahoo Finance API...`,
    lastUpdate
      ? `Last updated: ${lastUpdate} IST`
      : "Market data synchronized.",
    "Market feed synchronized ✓",
    "SYSTEM READY.",
  ];

  const terminalSteps = getTerminalSteps();

  // Mechanical keyboard sound simulation
  const playKeystrokeSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(
      800 + Math.random() * 200,
      ctx.currentTime,
    );
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      playKeystrokeSound();
      setCurrentStep((prev) => {
        if (prev >= terminalSteps.length - 1) {
          clearInterval(timer);
          setTimeout(() => setShowClickPrompt(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // Market data fetching effect
  useEffect(() => {
    const unsubscribe = finnhubMarketDataService.subscribeToUpdates((data) => {
      setMarketData(data.stocks);
      setMarketStatus(
        finnhubMarketDataService.isMarketOpen() ? "OPEN" : "CLOSED",
      );
      setLastUpdate(new Date().toLocaleTimeString("en-IN"));
    });

    return unsubscribe;
  }, []);

  const handleClick = () => {
    if (showClickPrompt && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          {/* Matrix-style background effect */}
          <div className="absolute inset-0 opacity-10">
            <div className="matrix-bg"></div>
          </div>

          {/* Terminal Window */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-4xl w-full mx-4"
          >
            {/* Terminal Header */}
            <div className="bg-gray-900 border border-finance-gold/30 rounded-t-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-finance-gold font-mono text-sm">
                  TFS_FINANCIAL_TERMINAL
                </span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="bg-black border-l border-r border-finance-gold/30 p-6 min-h-[400px] font-mono text-sm">
              {/* System Info */}
              <div className="text-finance-electric mb-4">
                <div> .████████....███████.....███████</div>
                <div> ....██.......██.........██</div>
                <div> ....██.......██████......███████</div>
                <div> ....██.......██................██</div>
                <div> ....██.......██..........███████</div>
                <div className="mt-2 text-finance-gold">
                  THE FINANCE SYMPOSIUM
                </div>
              </div>

              {/* Loading Steps */}
              <div className="space-y-2 mb-6">
                {terminalSteps.slice(0, currentStep + 1).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-finance-green">$</span>
                    <span className="text-finance-gold">{step}</span>
                    {index === currentStep && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-finance-gold"
                      >
                        |
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress Bar */}
              {currentStep < terminalSteps.length - 1 && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-finance-electric">
                    <span>Progress:</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-finance-gold to-finance-electric h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((currentStep + 1) / terminalSteps.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <span>
                      {Math.round(
                        ((currentStep + 1) / terminalSteps.length) * 100,
                      )}
                      %
                    </span>
                  </div>
                </div>
              )}

              {/* Click to Continue */}
              {showClickPrompt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      textShadow: [
                        "0 0 10px rgba(255, 215, 0, 0.5)",
                        "0 0 20px rgba(255, 215, 0, 0.8)",
                        "0 0 10px rgba(255, 215, 0, 0.5)",
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-finance-gold text-lg font-bold"
                  >
                    CLICK ANYWHERE TO START
                  </motion.div>
                  <div className="text-finance-electric text-sm mt-2">
                    Enter the world of financial excellence
                  </div>
                </motion.div>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="bg-gray-900 border border-t-0 border-finance-gold/30 rounded-b-lg p-2">
              <div className="flex items-center justify-between text-xs text-finance-electric">
                <span>TFS Terminal v3.1.4</span>
                <span>Secure Connection Established</span>
              </div>
            </div>
          </motion.div>

          {/* Glowing border effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-finance-gold/20 rounded-lg animate-pulse"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
