import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  RefreshCw,
  X,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface MarketDashboardDialogProps {
  className?: string;
}

export default function MarketDashboardDialog({
  className,
}: MarketDashboardDialogProps) {
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
  const [filter, setFilter] = useState<"all" | "gainers" | "losers">("all");

  useEffect(() => {
    if (isOpen) {
      const unsubscribe = finnhubMarketDataService.subscribeToUpdates(
        (data) => {
          setMarketData(data);
          setIsLoading(false);
        },
      );

      return unsubscribe;
    }
  }, [isOpen]);

  const handleRefresh = () => {
    setIsLoading(true);
    finnhubMarketDataService.updateAllData();
  };

  const filteredStocks = marketData.stocks.filter((stock) => {
    if (filter === "gainers") return stock.change > 0;
    if (filter === "losers") return stock.change < 0;
    return true;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-green-400";
      case "bearish":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="w-4 h-4" />;
      case "bearish":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={className}
        >
          <Button
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-finance-gold to-finance-electric text-finance-navy font-bold px-8 py-4 rounded-xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,215,0,0.8)] transition-all duration-500 hover:scale-105"
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-finance-electric to-finance-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-finance-gold to-finance-electric rounded-xl opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative z-10 flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="w-6 h-6" />
              </motion.div>
              <span className="text-lg">Market Dashboard</span>
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                📈
              </motion.div>
            </div>
          </Button>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[90vh] bg-finance-navy/95 backdrop-blur-xl border border-finance-gold/20 text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Activity className="w-6 h-6 text-finance-gold" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent">
                Live Market Dashboard
              </span>
              <Badge
                variant="outline"
                className="bg-blue-500/20 border-blue-500/50 text-blue-400 animate-pulse"
              >
                LIVE • Market Data
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                className="border-finance-gold/30 hover:border-finance-gold hover:bg-finance-gold/10"
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : {}}
                  transition={{
                    duration: 1,
                    repeat: isLoading ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <RefreshCw className="w-4 h-4 text-finance-gold" />
                </motion.div>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    {getSentimentIcon(marketData.sentiment.sentiment)}
                    <span>Market Sentiment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${getSentimentColor(marketData.sentiment.sentiment)} capitalize`}
                  >
                    {marketData.sentiment.sentiment}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {marketData.sentiment.positiveStocks}/
                    {marketData.sentiment.totalStocks} stocks advancing
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span>Gainers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {marketData.stocks.filter((s) => s.change > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Stocks in green
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span>Losers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    {marketData.stocks.filter((s) => s.change < 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Stocks in red
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-finance-gold" />
              <span className="text-sm font-medium">Filter:</span>
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "All Stocks", icon: "📊" },
                  { key: "gainers", label: "Gainers", icon: "📈" },
                  { key: "losers", label: "Losers", icon: "📉" },
                ].map((filterOption) => (
                  <Button
                    key={filterOption.key}
                    variant={
                      filter === filterOption.key ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setFilter(filterOption.key as any)}
                    className={
                      filter === filterOption.key
                        ? "bg-finance-gold text-finance-navy hover:bg-finance-gold/90"
                        : "border-finance-gold/30 hover:border-finance-gold hover:bg-finance-gold/10"
                    }
                  >
                    <span className="mr-1">{filterOption.icon}</span>
                    {filterOption.label}
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-finance-gold/20" />

            {/* Stock List */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredStocks.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="bg-finance-navy-light/30 border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-finance-gold">
                                {stock.symbol.includes("^") ? "📈" : "🏢"}
                              </div>
                            </div>

                            <div>
                              <div className="font-semibold text-foreground">
                                {stock.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {stock.symbol}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {safeFormatTimestamp(stock.timestamp)}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">
                              ₹
                              {stock.price.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                              })}
                            </div>
                            <div
                              className={`flex items-center space-x-1 ${
                                stock.change >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {stock.change >= 0 ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {stock.change >= 0 ? "+" : ""}
                                {stock.change.toFixed(2)}
                              </span>
                              <span className="text-sm">
                                ({stock.changePercent >= 0 ? "+" : ""}
                                {stock.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                            {stock.dayHigh && stock.dayLow && (
                              <div className="text-xs text-muted-foreground mt-1">
                                H: ₹{stock.dayHigh} L: ₹{stock.dayLow}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredStocks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No stocks match the current filter</p>
              </div>
            )}

            {/* Last Updated */}
            <div className="text-center text-sm text-muted-foreground pt-4 border-t border-finance-gold/20">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Updates every 60 seconds • Live Market Data</span>
              </div>
              <div className="mt-1">
                Market{" "}
                {finnhubMarketDataService.isMarketOpen() ? "OPEN" : "CLOSED"}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
