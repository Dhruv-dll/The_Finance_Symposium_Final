import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart3, Activity, CheckCircle, AlertTriangle, DollarSign, Bitcoin, Building2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  finnhubMarketDataService,
  FinnhubStockData,
  MarketSentiment,
  CurrencyRate,
  CryptoData,
  safeFormatTimestamp,
} from "../services/finnhubMarketData";
import { MarketDataLoader } from "./MarketDataErrorBoundary";

interface TabbedMarketDashboardProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TabbedMarketDashboard({ isOpen, onOpenChange }: TabbedMarketDashboardProps) {
  const [marketData, setMarketData] = useState<{
    stocks: FinnhubStockData[];
    sentiment: MarketSentiment;
    currencies: CurrencyRate[];
    crypto: CryptoData[];
  }>({
    stocks: [],
    sentiment: {
      sentiment: "neutral",
      advanceDeclineRatio: 0.5,
      positiveStocks: 0,
      totalStocks: 0,
    },
    currencies: [],
    crypto: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "loading" | "error">("loading");
  const [dataJustUpdated, setDataJustUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState("stocks");

  useEffect(() => {
    if (!isOpen) return;
    
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
          crypto: data.crypto || [],
        });
        setLastUpdate(new Date());
        setConnectionStatus("connected");
        setIsLoading(false);
        setErrorMessage("");
        
        // Flash effect when new data arrives
        setDataJustUpdated(true);
        setTimeout(() => setDataJustUpdated(false), 1000);
      } catch (error) {
        console.error("Error processing market data:", error);
        setConnectionStatus("error");
        setErrorMessage(error.message || "Failed to process market data");
      }
    });

    return unsubscribe;
  }, [isOpen]);

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

  // Ensure percentage is properly displayed
  const formatPercentage = (changePercent: number | undefined | null) => {
    if (changePercent === undefined || changePercent === null || isNaN(changePercent)) {
      return "0.00%";
    }
    return `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%`;
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-7xl max-h-[95vh] bg-finance-navy/95 backdrop-blur-xl border border-finance-gold/20 text-foreground"
        style={{
          background: "linear-gradient(135deg, rgba(0, 0, 18, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)",
        }}
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
                  📈 Live Market Dashboard
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
                    {isLoading ? "Refreshing..." : "Refresh"}
                  </span>
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Error State */}
          {connectionStatus === "error" && (
            <div className="mt-4 p-4 bg-finance-red/10 border border-finance-red/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-finance-red" />
                <span className="text-sm font-medium text-finance-red">Connection Error</span>
              </div>
              <div className="text-xs text-foreground/70 mb-3">
                {errorMessage || "Unable to fetch market data"}
              </div>
              <Button
                onClick={handleRefresh}
                size="sm"
                className="bg-finance-red/20 text-finance-red hover:bg-finance-red/30 border border-finance-red/30"
              >
                Retry Connection
              </Button>
            </div>
          )}

          {/* Loading State */}
          {connectionStatus === "loading" && (
            <MarketDataLoader message="Fetching comprehensive market data..." />
          )}

          {/* Tabbed Content */}
          {connectionStatus === "connected" && (
            <div className="mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-finance-navy-light/50">
                  <TabsTrigger 
                    value="stocks" 
                    className="data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Stocks
                  </TabsTrigger>
                  <TabsTrigger 
                    value="currencies"
                    className="data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Currencies
                  </TabsTrigger>
                  <TabsTrigger 
                    value="crypto"
                    className="data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy"
                  >
                    <Bitcoin className="w-4 h-4 mr-2" />
                    Crypto
                  </TabsTrigger>
                  <TabsTrigger 
                    value="summary"
                    className="data-[state=active]:bg-finance-gold data-[state=active]:text-finance-navy"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stocks" className="mt-6">
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-finance-gold mb-4">📈 Indian Market Stocks</h3>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {marketData.stocks.map((stock) => (
                            <motion.div
                              key={stock.symbol}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 rounded-lg bg-finance-navy-light/30 border border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-finance-gold">{stock.displayName || stock.name}</div>
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
                                    <span>({formatPercentage(stock.changePercent)})</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                                <span>H: {formatPrice(stock.symbol, stock.dayHigh)} L: {formatPrice(stock.symbol, stock.dayLow)}</span>
                                <span className={`px-2 py-1 rounded ${
                                  stock.marketState === "REGULAR" ? "bg-finance-green/20 text-finance-green" : "bg-finance-red/20 text-finance-red"
                                }`}>
                                  {stock.marketState}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="currencies" className="mt-6">
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-finance-gold mb-4">💱 Currency Exchange Rates</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {marketData.currencies.map((currency) => (
                          <motion.div
                            key={currency.symbol}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-finance-navy-light/30 border border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-finance-gold">{currency.name}</div>
                                <div className="text-sm text-muted-foreground">{currency.symbol}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-foreground">
                                  ₹{currency.rate.toFixed(4)}
                                </div>
                                <div className={`text-xs flex items-center space-x-1 ${
                                  currency.change > 0 ? "text-finance-green" : 
                                  currency.change < 0 ? "text-finance-red" : "text-finance-electric"
                                }`}>
                                  <span>{currency.change > 0 ? "+" : ""}{currency.change.toFixed(4)}</span>
                                  <span>({formatPercentage(currency.changePercent)})</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="crypto" className="mt-6">
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-finance-gold mb-4">₿ Cryptocurrency Prices (INR)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {marketData.crypto.map((crypto) => (
                          <motion.div
                            key={crypto.symbol}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-lg bg-finance-navy-light/30 border border-finance-gold/10 hover:border-finance-gold/30 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-bold text-finance-gold">{crypto.name}</div>
                                <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-foreground">
                                  ₹{crypto.price.toLocaleString('en-IN')}
                                </div>
                                <div className={`text-sm flex items-center space-x-1 ${
                                  crypto.change > 0 ? "text-finance-green" : 
                                  crypto.change < 0 ? "text-finance-red" : "text-finance-electric"
                                }`}>
                                  <span>{crypto.change > 0 ? "+" : ""}{crypto.change.toLocaleString('en-IN')}</span>
                                  <span>({formatPercentage(crypto.changePercent)})</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex justify-between">
                              <span>Vol: ₹{(crypto.volume24h / 1000000000).toFixed(1)}B</span>
                              <span>MCap: ₹{(crypto.marketCap / 1000000000000).toFixed(1)}T</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="summary" className="mt-6">
                    <motion.div
                      variants={tabVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
                            <CardTitle className="text-sm text-muted-foreground">Total Gainers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-bold text-finance-green">
                              {marketData.sentiment.positiveStocks}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              of {marketData.sentiment.totalStocks} stocks
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-finance-navy-light/50 border-finance-gold/20">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-muted-foreground">Total Losers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-lg font-bold text-finance-red">
                              {marketData.sentiment.totalStocks - marketData.sentiment.positiveStocks}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              of {marketData.sentiment.totalStocks} stocks
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

                      <div className="text-center text-muted-foreground">
                        <p>Switch between tabs to view detailed information about stocks, currencies, and cryptocurrencies.</p>
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
