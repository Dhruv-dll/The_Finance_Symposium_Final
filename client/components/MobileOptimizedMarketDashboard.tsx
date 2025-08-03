import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Activity,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Building2,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useMobile } from "../hooks/useMobile";
import {
  finnhubMarketDataService,
  FinnhubStockData,
  MarketSentiment,
  CurrencyRate,
  safeFormatTimestamp,
} from "../services/finnhubMarketData";
import { MarketDataLoader } from "./MarketDataErrorBoundary";

interface MobileOptimizedMarketDashboardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileOptimizedMarketDashboard({
  isOpen,
  onOpenChange,
}: MobileOptimizedMarketDashboardProps) {
  const isMobile = useMobile();
  const isTablet = useMobile(1024);

  const [marketData, setMarketData] = useState<{
    stocks: FinnhubStockData[];
    sentiment: MarketSentiment;
    currencies: CurrencyRate[];
  }>({
    stocks: [],
    sentiment: {
      sentiment: "neutral",
      advanceDeclineRatio: 0.5,
      positiveStocks: 0,
      totalStocks: 0,
    },
    currencies: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "loading" | "error"
  >("loading");
  const [dataJustUpdated, setDataJustUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("stocks");

  useEffect(() => {
    setConnectionStatus("loading");
    const unsubscribe = finnhubMarketDataService.subscribeToUpdates((data) => {
      try {
        setMarketData({
          stocks: data.stocks || [],
          sentiment: data.sentiment || {
            sentiment: "neutral",
            advanceDeclineRatio: 0.5,
            positiveStocks: 0,
            totalStocks: 0,
          },
          currencies: data.currencies || [],
        });
        setLastUpdate(new Date());
        setConnectionStatus("connected");
        setIsLoading(false);
        setErrorMessage("");

        setDataJustUpdated(true);
        setTimeout(() => setDataJustUpdated(false), 1000);
      } catch (error) {
        console.error("Error processing market data:", error);
        setConnectionStatus("error");
        setErrorMessage(error.message || "Failed to process market data");
      }
    });

    return unsubscribe;
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    setConnectionStatus("loading");
    setErrorMessage("");

    try {
      await finnhubMarketDataService.updateAllData();
    } catch (error) {
      setConnectionStatus("error");
      setErrorMessage(error.message || "Failed to refresh data");
      setIsLoading(false);
    }
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

  const formatPercentage = (changePercent: number | undefined | null) => {
    if (
      changePercent === undefined ||
      changePercent === null ||
      isNaN(changePercent)
    ) {
      return "0.00%";
    }
    return `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
  };

  const handleStockClick = (stock: FinnhubStockData) => {
    const searchQuery = `${stock.displayName || stock.name} current stock price`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, "_blank");
  };

  const handleCurrencyClick = (currency: CurrencyRate) => {
    const searchQuery = `${currency.name} current exchange rate conversion`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-finance-navy/95 backdrop-blur-xl border border-finance-gold/20 text-foreground ${
          isMobile
            ? "max-w-[95vw] max-h-[95vh] m-2 p-0 rounded-xl"
            : isTablet
              ? "max-w-4xl max-h-[90vh] rounded-2xl"
              : "max-w-7xl max-h-[95vh] rounded-2xl"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 0, 18, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={isMobile ? "h-full overflow-hidden" : ""}
        >
          <DialogHeader className={isMobile ? "p-4 pb-2" : "p-6 pb-4"}>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <BarChart3
                    className={`text-finance-gold ${
                      isMobile ? "w-5 h-5" : "w-6 h-6"
                    }`}
                  />
                </motion.div>
                <span
                  className={`font-bold bg-gradient-to-r from-finance-gold to-finance-electric bg-clip-text text-transparent ${
                    isMobile ? "text-base" : "text-xl"
                  }`}
                >
                  📈 Live Market Dashboard
                </span>
                <Badge
                  variant="outline"
                  className={`bg-finance-green/20 border-finance-green/50 text-finance-green animate-pulse ${
                    isMobile ? "text-xs px-2 py-0.5" : "text-sm"
                  }`}
                >
                  🟢 LIVE
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "sm"}
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={`border-finance-gold/30 text-finance-gold hover:bg-finance-gold/10 ${
                    isMobile ? "px-2 py-1.5 text-xs" : ""
                  }`}
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Activity className={isMobile ? "w-3 h-3" : "w-4 h-4"} />
                  </motion.div>
                  {!isMobile && (
                    <span className="ml-2">
                      {isLoading ? "Refreshing..." : "Refresh"}
                    </span>
                  )}
                </Button>

                {/* Mobile close button */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="p-1.5 min-w-[32px] min-h-[32px]"
                  >
                    <X className="w-4 h-4 text-white" />
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Error State */}
          {connectionStatus === "error" && (
            <div
              className={`p-4 bg-finance-red/10 border border-finance-red/30 rounded-lg ${
                isMobile ? "mx-4 mb-4" : "mx-6 mb-6"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle
                  className={`text-finance-red ${
                    isMobile ? "w-3 h-3" : "w-4 h-4"
                  }`}
                />
                <span
                  className={`font-medium text-finance-red ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  Connection Error
                </span>
              </div>
              <div
                className={`text-foreground/70 mb-3 ${
                  isMobile ? "text-xs" : "text-xs"
                }`}
              >
                {errorMessage || "Unable to fetch market data"}
              </div>
              <Button
                onClick={handleRefresh}
                size="sm"
                className={`bg-finance-red/20 text-finance-red hover:bg-finance-red/30 border border-finance-red/30 ${
                  isMobile ? "text-xs px-2 py-1" : ""
                }`}
              >
                Retry Connection
              </Button>
            </div>
          )}

          {/* Loading State */}
          {connectionStatus === "loading" && (
            <div className={isMobile ? "px-4" : "px-6"}>
              <MarketDataLoader message="Fetching market data..." />
            </div>
          )}

          {/* Tabbed Content */}
          {connectionStatus === "connected" && (
            <div className={isMobile ? "px-4 pb-4" : "px-6 pb-6"}>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList
                  className={`grid w-full grid-cols-3 bg-finance-navy-light/50 ${
                    isMobile ? "h-10" : "h-12"
                  }`}
                >
                  <TabsTrigger
                    value="stocks"
                    className={`data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy ${
                      isMobile ? "text-xs px-2" : "text-sm"
                    }`}
                  >
                    <Building2
                      className={`mr-1 sm:mr-2 ${
                        isMobile ? "w-3 h-3" : "w-4 h-4"
                      }`}
                    />
                    <span className={isMobile ? "hidden xs:inline" : ""}>
                      Stocks
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="currencies"
                    className={`data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy ${
                      isMobile ? "text-xs px-2" : "text-sm"
                    }`}
                  >
                    <DollarSign
                      className={`mr-1 sm:mr-2 ${
                        isMobile ? "w-3 h-3" : "w-4 h-4"
                      }`}
                    />
                    <span className={isMobile ? "hidden xs:inline" : ""}>
                      Currencies
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="summary"
                    className={`data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy ${
                      isMobile ? "text-xs px-2" : "text-sm"
                    }`}
                  >
                    <BarChart3
                      className={`mr-1 sm:mr-2 ${
                        isMobile ? "w-3 h-3" : "w-4 h-4"
                      }`}
                    />
                    <span className={isMobile ? "hidden xs:inline" : ""}>
                      Summary
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="stocks"
                  className={isMobile ? "mt-4" : "mt-6"}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className={`font-semibold text-finance-gold mb-3 sm:mb-4 ${
                        isMobile ? "text-base" : "text-lg"
                      }`}
                    >
                      📈 Indian Market Stocks
                    </h3>
                    <ScrollArea className={isMobile ? "h-[40vh]" : "h-[400px]"}>
                      <div
                        className={`space-y-2 sm:space-y-3 ${isMobile ? "pr-2" : ""}`}
                      >
                        {marketData.stocks.map((stock) => (
                          <motion.div
                            key={stock.symbol}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`rounded-lg bg-finance-navy-light/30 border border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300 cursor-pointer hover:bg-finance-navy-light/50 ${
                              isMobile ? "p-3" : "p-4"
                            }`}
                            onClick={() => handleStockClick(stock)}
                            // Mobile touch optimization
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div
                                  className={`font-bold text-finance-gold truncate ${
                                    isMobile ? "text-sm" : "text-base"
                                  }`}
                                >
                                  {stock.displayName || stock.name}
                                </div>
                                <div
                                  className={`text-muted-foreground ${
                                    isMobile ? "text-xs" : "text-sm"
                                  }`}
                                >
                                  {stock.symbol}
                                </div>
                              </div>

                              <div className="text-right">
                                <div
                                  className={`font-bold text-foreground ${
                                    isMobile ? "text-sm" : "text-lg"
                                  }`}
                                >
                                  {formatPrice(stock.symbol, stock.price)}
                                </div>
                                <div
                                  className={`flex items-center justify-end space-x-1 ${
                                    stock.change > 0
                                      ? "text-finance-green"
                                      : stock.change < 0
                                        ? "text-finance-red"
                                        : "text-finance-electric"
                                  } ${isMobile ? "text-xs" : "text-sm"}`}
                                >
                                  <span>
                                    {stock.change > 0 ? "+" : ""}
                                    {stock.change.toFixed(2)}
                                  </span>
                                  <span>
                                    ({formatPercentage(stock.changePercent)})
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`mt-2 flex justify-between items-center ${
                                isMobile ? "text-xs" : "text-xs"
                              } text-muted-foreground`}
                            >
                              <span className="truncate">
                                H: {formatPrice(stock.symbol, stock.dayHigh)} L:{" "}
                                {formatPrice(stock.symbol, stock.dayLow)}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  stock.marketState === "REGULAR"
                                    ? "bg-finance-green/20 text-finance-green"
                                    : "bg-finance-red/20 text-finance-red"
                                }`}
                              >
                                {stock.marketState}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </motion.div>
                </TabsContent>

                <TabsContent
                  value="currencies"
                  className={isMobile ? "mt-4" : "mt-6"}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3
                      className={`font-semibold text-finance-gold mb-3 sm:mb-4 ${
                        isMobile ? "text-base" : "text-lg"
                      }`}
                    >
                      💱 Currency Exchange Rates
                    </h3>
                    <div
                      className={`grid gap-3 sm:gap-4 ${
                        isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                      }`}
                    >
                      {marketData.currencies.map((currency) => (
                        <motion.div
                          key={currency.symbol}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`rounded-lg bg-finance-navy-light/30 border border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300 cursor-pointer hover:bg-finance-navy-light/50 ${
                            isMobile ? "p-3" : "p-4"
                          }`}
                          onClick={() => handleCurrencyClick(currency)}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-semibold text-finance-gold truncate ${
                                  isMobile ? "text-sm" : "text-base"
                                }`}
                              >
                                {currency.name}
                              </div>
                              <div
                                className={`text-muted-foreground ${
                                  isMobile ? "text-xs" : "text-sm"
                                }`}
                              >
                                {currency.symbol}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`font-bold text-foreground ${
                                  isMobile ? "text-sm" : "text-base"
                                }`}
                              >
                                ₹{currency.rate.toFixed(4)}
                              </div>
                              {currency.change !== 0 && (
                                <div
                                  className={`${
                                    currency.change > 0
                                      ? "text-finance-green"
                                      : currency.change < 0
                                        ? "text-finance-red"
                                        : "text-finance-electric"
                                  } ${isMobile ? "text-xs" : "text-xs"}`}
                                >
                                  <span>
                                    {currency.change > 0 ? "+" : ""}
                                    {currency.change.toFixed(4)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent
                  value="summary"
                  className={isMobile ? "mt-4" : "mt-6"}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`grid gap-3 sm:gap-4 mb-4 sm:mb-6 ${
                        isMobile ? "grid-cols-2" : "grid-cols-1 md:grid-cols-4"
                      }`}
                    >
                      <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                        <CardHeader
                          className={isMobile ? "pb-1 px-3 pt-3" : "pb-2"}
                        >
                          <CardTitle
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            Market Sentiment
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={isMobile ? "px-3 pb-3" : ""}>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <TrendingUp
                              className={`${getSentimentColor(marketData.sentiment.sentiment)} ${
                                isMobile ? "w-4 h-4" : "w-5 h-5"
                              }`}
                            />
                            <span
                              className={`font-bold capitalize ${getSentimentColor(marketData.sentiment.sentiment)} ${
                                isMobile ? "text-xs" : "text-sm"
                              }`}
                            >
                              {marketData.sentiment.sentiment}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                        <CardHeader
                          className={isMobile ? "pb-1 px-3 pt-3" : "pb-2"}
                        >
                          <CardTitle
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            Total Gainers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={isMobile ? "px-3 pb-3" : ""}>
                          <div
                            className={`font-bold text-finance-green ${
                              isMobile ? "text-sm" : "text-lg"
                            }`}
                          >
                            {marketData.sentiment.positiveStocks}
                          </div>
                          <div
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-xs"
                            }`}
                          >
                            of {marketData.sentiment.totalStocks} stocks
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                        <CardHeader
                          className={isMobile ? "pb-1 px-3 pt-3" : "pb-2"}
                        >
                          <CardTitle
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            Total Losers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={isMobile ? "px-3 pb-3" : ""}>
                          <div
                            className={`font-bold text-finance-red ${
                              isMobile ? "text-sm" : "text-lg"
                            }`}
                          >
                            {marketData.sentiment.totalStocks -
                              marketData.sentiment.positiveStocks}
                          </div>
                          <div
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-xs"
                            }`}
                          >
                            of {marketData.sentiment.totalStocks} stocks
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                        <CardHeader
                          className={isMobile ? "pb-1 px-3 pt-3" : "pb-2"}
                        >
                          <CardTitle
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            Last Update
                          </CardTitle>
                        </CardHeader>
                        <CardContent className={isMobile ? "px-3 pb-3" : ""}>
                          <div
                            className={`text-finance-electric ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {safeFormatTimestamp(lastUpdate)}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div
                      className={`text-center text-muted-foreground ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      <p>
                        Switch between tabs to view detailed information about
                        stocks and currencies.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
