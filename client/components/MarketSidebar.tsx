import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketDashboard } from "../contexts/MarketDashboardContext";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  accurateMarketDataService,
  AccurateStockData,
  MarketSentiment,
  ForexData,
  safeFormatTimestamp,
} from "../services/accurateMarketData";

export default function MarketSidebar() {
  const { isOpen: isVisible, setIsOpen: setIsVisible } = useMarketDashboard();
  const [stockData, setStockData] = useState<AccurateStockData[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment>({
    sentiment: "neutral",
    advanceDeclineRatio: 0.5,
    positiveStocks: 0,
    totalStocks: 0,
  });

  const [forexData, setForexData] = useState<ForexData[]>([]);
  const [topPerformers, setTopPerformers] = useState<AccurateStockData[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "reconnecting"
  >("connected");

  useEffect(() => {
    setConnectionStatus("reconnecting");
    const unsubscribe = accurateMarketDataService.subscribeToUpdates((data) => {
      setStockData(data.stocks);
      setMarketSentiment(data.sentiment);

      setForexData(data.forex);
      setLastUpdate(new Date());
      setConnectionStatus("connected");

      // Get top performers from stocks only (not indices)
      const stocksOnly = data.stocks.filter(
        (stock) => !stock.symbol.includes("^"),
      );
      const sorted = [...stocksOnly].sort(
        (a, b) => b.changePercent - a.changePercent,
      );
      setTopPerformers(sorted.slice(0, 3));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getSentimentColor = () => {
    switch (marketSentiment.sentiment) {
      case "bullish":
        return {
          bg: "from-finance-green/20 to-finance-green/5",
          border: "border-finance-green/30",
          glow: "shadow-[0_0_30px_rgba(0,255,0,0.2)]",
        };
      case "bearish":
        return {
          bg: "from-finance-red/20 to-finance-red/5",
          border: "border-finance-red/30",
          glow: "shadow-[0_0_30px_rgba(255,68,68,0.2)]",
        };
      default:
        return {
          bg: "from-finance-electric/20 to-finance-electric/5",
          border: "border-finance-electric/30",
          glow: "shadow-[0_0_30px_rgba(0,255,255,0.2)]",
        };
    }
  };

  const formatPrice = (price: number, currency = "") => {
    return `${currency}${price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-finance-green";
    if (change < 0) return "text-finance-red";
    return "text-finance-electric";
  };

  const economicEvents = [
    { date: "Today", event: "RBI Policy Meeting", impact: "high" },
    { date: "Tomorrow", event: "GDP Data Release", impact: "medium" },
    { date: "Dec 28", event: "Banking Results", impact: "high" },
    { date: "Dec 30", event: "Market Holiday", impact: "low" },
  ];

  if (!isVisible) return null;

  const sentimentColors = getSentimentColor();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed right-2 sm:right-4 top-20 sm:top-24 bottom-2 sm:bottom-4 ${
          isMinimized ? "w-12 sm:w-16" : "w-72 sm:w-80"
        } z-40 transition-all duration-500`}
      >
        <motion.div
          className={`h-full backdrop-blur-xl bg-gradient-to-b ${sentimentColors.bg} ${sentimentColors.border} ${sentimentColors.glow} border rounded-2xl overflow-hidden transition-all duration-500`}
          animate={{
            boxShadow: [
              sentimentColors.glow.replace("0.2", "0.1"),
              sentimentColors.glow.replace("0.2", "0.3"),
              sentimentColors.glow.replace("0.2", "0.1"),
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="p-2 sm:p-4 border-b border-finance-gold/20 bg-finance-navy/50">
            <div className="flex items-center justify-between">
              {!isMinimized && (
                <motion.h3
                  className="font-bold text-finance-gold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Market Dashboard
                </motion.h3>
              )}
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded-lg hover:bg-finance-gold/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? (
                    <Eye className="w-4 h-4 text-finance-gold" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-finance-gold" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsVisible(false)}
                  className="p-1 rounded-lg hover:bg-finance-red/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-4 h-4 text-finance-red" />
                </motion.button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-2 sm:p-4 space-y-4 sm:space-y-6 h-full overflow-y-auto custom-scrollbar"
            >
              {/* Market Sentiment Indicator */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-finance-electric">
                  Market Sentiment
                </h4>
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-r ${sentimentColors.bg} border ${sentimentColors.border}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {marketSentiment.sentiment === "bullish" ? (
                        <TrendingUp className="w-5 h-5 text-finance-green" />
                      ) : marketSentiment.sentiment === "bearish" ? (
                        <TrendingDown className="w-5 h-5 text-finance-red" />
                      ) : (
                        <Activity className="w-5 h-5 text-finance-electric" />
                      )}
                      <div>
                        <span className="font-medium capitalize text-foreground">
                          {marketSentiment.sentiment}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {marketSentiment.positiveStocks}/
                          {marketSentiment.totalStocks} up (
                          {(marketSentiment.advanceDeclineRatio * 100).toFixed(
                            1,
                          )}
                          %)
                        </div>
                      </div>
                    </div>
                    <motion.div
                      className={`w-3 h-3 rounded-full ${
                        marketSentiment.sentiment === "bullish"
                          ? "bg-finance-green"
                          : marketSentiment.sentiment === "bearish"
                            ? "bg-finance-red"
                            : "bg-finance-electric"
                      }`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Top Performers */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-finance-electric">
                  Top Performers
                </h4>
                <div className="space-y-2">
                  {topPerformers.map((stock, index) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-2 sm:p-3 rounded-lg bg-finance-navy/30 border border-finance-gold/20 hover:border-finance-gold/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-finance-gold text-xs sm:text-sm">
                          {stock.symbol}
                        </span>
                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-semibold text-foreground">
                            {formatPrice(
                              stock.price,
                              stock.symbol.includes("SENSEX") ||
                                stock.symbol.includes("NIFTY")
                                ? ""
                                : "₹",
                            )}
                          </div>
                          <div
                            className={`text-xs sm:text-sm font-bold ${getChangeColor(stock.changePercent)}`}
                          >
                            {formatChange(stock.changePercent)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Forex Exchange Rates */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-finance-electric">
                  Forex
                </h4>
                <div className="space-y-2">
                  {forexData.map((forex, index) => (
                    <motion.div
                      key={forex.pair}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-finance-navy/30 border border-finance-green/20 hover:border-finance-green/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-finance-gold" />
                          <span className="font-medium text-finance-green text-sm">
                            {forex.pair}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-foreground">
                            ₹{formatPrice(forex.price)}
                          </div>
                          <div
                            className={`text-xs ${getChangeColor(forex.changePercent)}`}
                          >
                            {formatChange(forex.changePercent)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {safeFormatTimestamp(forex.timestamp)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Economic Calendar */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-finance-electric">
                  Economic Calendar
                </h4>
                <div className="space-y-2">
                  {economicEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-finance-navy/30 border border-finance-gold/20 hover:border-finance-gold/40 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-finance-gold" />
                          <div>
                            <div className="text-xs text-finance-gold font-medium">
                              {event.date}
                            </div>
                            <div className="text-xs text-foreground">
                              {event.event}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            event.impact === "high"
                              ? "bg-finance-red"
                              : event.impact === "medium"
                                ? "bg-finance-gold"
                                : "bg-finance-green"
                          }`}
                        ></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Minimized View */}
          {isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4"
            >
              {/* Sentiment indicator only */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  marketSentiment.sentiment === "bullish"
                    ? "bg-finance-green"
                    : marketSentiment.sentiment === "bearish"
                      ? "bg-finance-red"
                      : "bg-finance-electric"
                }`}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    `0 0 10px ${
                      marketSentiment.sentiment === "bullish"
                        ? "rgba(0,255,0,0.5)"
                        : marketSentiment.sentiment === "bearish"
                          ? "rgba(255,68,68,0.5)"
                          : "rgba(0,255,255,0.5)"
                    }`,
                    `0 0 20px ${
                      marketSentiment.sentiment === "bullish"
                        ? "rgba(0,255,0,0.8)"
                        : marketSentiment.sentiment === "bearish"
                          ? "rgba(255,68,68,0.8)"
                          : "rgba(0,255,255,0.8)"
                    }`,
                    `0 0 10px ${
                      marketSentiment.sentiment === "bullish"
                        ? "rgba(0,255,0,0.5)"
                        : marketSentiment.sentiment === "bearish"
                          ? "rgba(255,68,68,0.5)"
                          : "rgba(0,255,255,0.5)"
                    }`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {marketSentiment.sentiment === "bullish" ? (
                  <TrendingUp className="w-4 h-4 text-finance-navy" />
                ) : marketSentiment.sentiment === "bearish" ? (
                  <TrendingDown className="w-4 h-4 text-finance-navy" />
                ) : (
                  <Activity className="w-4 h-4 text-finance-navy" />
                )}
              </motion.div>

              {/* Quick stats */}
              <div className="space-y-2">
                {stockData.slice(0, 2).map((stock, index) => (
                  <div key={stock.symbol} className="text-center">
                    <div className="text-xs text-finance-gold font-medium">
                      {stock.name}
                    </div>
                    <div
                      className={`text-xs ${getChangeColor(stock.changePercent)}`}
                    >
                      {formatChange(stock.changePercent)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
