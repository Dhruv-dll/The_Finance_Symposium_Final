import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart3, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  finnhubMarketDataService,
  FinnhubStockData,
  MarketSentiment,
  safeFormatTimestamp,
} from "../services/finnhubMarketData";

interface FloatingMarketIconProps {
  className?: string;
}

export default function FloatingMarketIcon({
  className,
}: FloatingMarketIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [marketData, setMarketData] = useState<{
    stocks: FinnhubStockData[];
    sentiment: MarketSentiment;
  }>({
    stocks: [],
    sentiment: {
      sentiment: "neutral",
      advanceDeclineRatio: 0.5,
      positiveStocks: 0,
      totalStocks: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "loading" | "error">("loading");
  const [dataJustUpdated, setDataJustUpdated] = useState(false);

  useEffect(() => {
    setConnectionStatus("loading");
    const unsubscribe = finnhubMarketDataService.subscribeToUpdates((data) => {
      setMarketData(data);
      setLastUpdate(new Date());
      setConnectionStatus("connected");
      setIsLoading(false);
      
      // Flash effect when new data arrives
      setDataJustUpdated(true);
      setTimeout(() => setDataJustUpdated(false), 1000);
    });

    return unsubscribe;
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setConnectionStatus("loading");
    finnhubMarketDataService.updateAllData();
  };

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

  const formatPrice = (symbol: string, price: number) => {
    if (symbol.includes("^")) {
      return price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return `₹${price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
              <span className={getSentimentColor(marketData.sentiment.sentiment)}>
                {marketData.sentiment.sentiment.toUpperCase()}
              </span>
              <span className="text-muted-foreground">
                {marketData.sentiment.positiveStocks}/{marketData.sentiment.totalStocks}
              </span>
            </div>
            <div className="text-xs text-finance-electric mt-1">
              Updated: {safeFormatTimestamp(lastUpdate)}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Dialog with slide-up animation */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-6xl max-h-[90vh] bg-finance-navy/95 backdrop-blur-xl border border-finance-gold/20 text-foreground"
          style={{
            background: "linear-gradient(135deg, rgba(0, 0, 18, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
          }}
          aria-describedby="market-dashboard-description"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <BarChart3 className="w-6 h-6 text-finance-gold" />
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
                    📈 Live data powered by Yahoo Finance API
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-finance-green/20 border-finance-green/50 text-finance-green animate-pulse"
                  >
                    🟢 YAHOO LIVE
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="border-finance-gold/30 text-finance-gold hover:bg-finance-gold/10"
                  >
                    <motion.div
                      animate={isLoading ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Activity className="w-4 h-4" />
                    </motion.div>
                    <span className="ml-2">
                      {isLoading ? "Fetching Yahoo Finance data..." : "Refresh"}
                    </span>
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {/* Market Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Market Sentiment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`w-5 h-5 ${getSentimentColor(marketData.sentiment.sentiment)}`} />
                      <span className={`font-bold capitalize ${getSentimentColor(marketData.sentiment.sentiment)}`}>
                        {marketData.sentiment.sentiment}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Gainers/Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-finance-gold">
                      {marketData.sentiment.positiveStocks}/{marketData.sentiment.totalStocks}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Advance/Decline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-finance-electric">
                      {(marketData.sentiment.advanceDeclineRatio * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Last Update</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-finance-electric">
                      {safeFormatTimestamp(lastUpdate)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="bg-finance-gold/20" />

              {/* Stock List */}
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {marketData.stocks.map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-lg bg-finance-navy-light/30 border border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-finance-gold">{stock.name}</div>
                          <div className="text-sm text-muted-foreground">{stock.symbol}</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            {formatPrice(stock.symbol, stock.price)}
                          </div>
                          <div className={`text-sm flex items-center space-x-1 ${
                            stock.change > 0 ? "text-finance-green" : 
                            stock.change < 0 ? "text-finance-red" : "text-finance-electric"
                          }`}>
                            <span>{stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}</span>
                            <span>({stock.changePercent > 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                        <span>Updated: {safeFormatTimestamp(stock.timestamp)}</span>
                        <span className="text-finance-electric">{stock.marketState}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
