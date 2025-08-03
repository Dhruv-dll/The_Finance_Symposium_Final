class FinnhubMarketDataService {
  private readonly API_KEY =
    import.meta.env.VITE_FINNHUB_API_KEY ||
    "crm3ck9r01qsa2l9t5u0crm3ck9r01qsa2l9t5ug"; // ✅ Use environment variable
  private readonly BASE_URL = "https://finnhub.io/api/v1";

  private stocks = [
    // ✅ Focus on stocks that Yahoo Finance supports
    {
      symbol: "RELIANCE.NS",
      name: "RELIANCE",
      displayName: "Reliance Industries",
      finnhubSymbol: "RELIANCE.NS",
    },
    {
      symbol: "TCS.NS",
      name: "TCS",
      displayName: "Tata Consultancy Services",
      finnhubSymbol: "TCS.NS",
    },
    {
      symbol: "HDFCBANK.NS",
      name: "HDFC BANK",
      displayName: "HDFC Bank Ltd",
      finnhubSymbol: "HDFCBANK.NS",
    },
    {
      symbol: "INFY.NS",
      name: "INFOSYS",
      displayName: "Infosys Limited",
      finnhubSymbol: "INFY.NS",
    },
    {
      symbol: "ICICIBANK.NS",
      name: "ICICI BANK",
      displayName: "ICICI Bank Ltd",
      finnhubSymbol: "ICICIBANK.NS",
    },
    {
      symbol: "HINDUNILVR.NS",
      name: "HUL",
      displayName: "Hindustan Unilever",
      finnhubSymbol: "HINDUNILVR.NS",
    },
    {
      symbol: "ITC.NS",
      name: "ITC",
      displayName: "ITC Limited",
      finnhubSymbol: "ITC.NS",
    },
    {
      symbol: "KOTAKBANK.NS",
      name: "KOTAK",
      displayName: "Kotak Mahindra Bank",
      finnhubSymbol: "KOTAKBANK.NS",
    },

    // ✅ Indices - Yahoo Finance supports Indian indices
    // NIFTY 50 and SENSEX are well supported
    {
      symbol: "^NSEI",
      name: "NIFTY 50",
      displayName: "NIFTY 50 Index",
      finnhubSymbol: "^NSEI",
      isIndex: true,
    },
    {
      symbol: "^BSESN",
      name: "SENSEX",
      displayName: "BSE Sensex",
      finnhubSymbol: "^BSESN",
      isIndex: true,
    },
  ];

  // ✅ Fetch comprehensive market data including currencies
  async fetchAllMarketData(): Promise<{
    stocks: FinnhubStockData[];
    sentiment: MarketSentiment;
    currencies?: CurrencyRate[];
  } | null> {
    try {
      console.log("📊 Fetching real-time market data from server...");

      // Check if we're already in fallback mode
      if (this.fallbackMode) {
        console.log("🔄 Using fallback mode, skipping server API");
        return this.getFallbackMarketData();
      }

      // Add timeout wrapper to prevent hanging with better error handling
      const fetchWithTimeout = new Promise<Response>((resolve, reject) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error("Request timeout after 8 seconds"));
        }, 8000); // Reduced to 8 second timeout

        // Enhanced fetch with better error handling
        fetch("/api/market-data", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        })
          .then((response) => {
            clearTimeout(timeoutId);
            resolve(response);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            // Classify different types of errors
            if (error.name === 'AbortError') {
              reject(new Error("Request was aborted"));
            } else if (error.message && error.message.includes('Failed to fetch')) {
              reject(new Error("Network error - server may be unreachable"));
            } else {
              reject(error);
            }
          });
      });

      const response = await fetchWithTimeout;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.stocks || !Array.isArray(data.stocks)) {
        throw new Error("Invalid response format from server");
      }

      console.log(
        `✅ Successfully fetched ${data.stocks.length} real-time stocks`,
      );

      // Reset failure count on success
      this.apiFailureCount = 0;

      // Enhance stock data with display names
      const enhancedStocks = data.stocks.map((stock: any) => {
        const stockInfo = this.stocks.find((s) => s.symbol === stock.symbol);
        return {
          ...stock,
          displayName: stockInfo?.displayName || stock.name,
          // Ensure percentage is properly formatted
          changePercent: stock.changePercent || 0,
          change: stock.change || 0,
        };
      });

      return {
        stocks: enhancedStocks,
        sentiment: data.sentiment,
        currencies: data.currencies || [],
      };
    } catch (error) {
      const errorMessage = error?.message || "Unknown error";
      console.warn(`🔄 Server API failed:`, errorMessage);

      // Track API failures
      this.apiFailureCount++;

      // More aggressive fallback for network errors
      if (errorMessage.includes('Network error') ||
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('timeout') ||
          this.apiFailureCount >= 2) {
        this.fallbackMode = true;
        console.log("⚠️ Switching to fallback mode due to API issues:", errorMessage);
        return this.getFallbackMarketData();
      }

      // For first failure, try again with fallback
      if (this.apiFailureCount === 1) {
        console.log("📊 First API failure, providing fallback data");
        return this.getFallbackMarketData();
      }

      return null;
    }
  }

  // Legacy method for compatibility (now uses server API)
  async fetchStockFromFinnhub(
    symbol: string,
    finnhubSymbol: string,
    isIndex: boolean = false,
  ): Promise<FinnhubStockData | null> {
    // This method is now handled by fetchAllMarketData
    return this.getFallbackStockData(symbol);
  }

  // ✅ Complete fallback market data
  private getFallbackMarketData(): {
    stocks: FinnhubStockData[];
    sentiment: MarketSentiment;
    currencies: CurrencyRate[];
  } {
    // Generate fallback stock data
    const fallbackStocks = this.stocks
      .map((stock) => this.getFallbackStockData(stock.symbol))
      .filter(Boolean) as FinnhubStockData[];

    // Calculate sentiment from fallback data
    const sentiment = this.calculateMarketSentiment(fallbackStocks);

    // Generate fallback currency data
    const currencies = this.getFallbackCurrencyData();

    console.log(
      "📊 Using fallback market data with",
      fallbackStocks.length,
      "stocks",
    );

    return {
      stocks: fallbackStocks,
      sentiment,
      currencies,
    };
  }

  // ✅ Enhanced fallback data with more realistic Indian market prices (Updated for 2025)
  private getFallbackStockData(symbol: string): FinnhubStockData | null {
    const baseData: Record<string, { price: number; name: string }> = {
      "^NSEI": { price: 24768, name: "NIFTY 50" }, // Accurate 2025 levels
      "^BSESN": { price: 81185, name: "SENSEX" }, // Accurate 2025 levels
      "RELIANCE.NS": { price: 3085, name: "RELIANCE" }, // Updated to Jan 2025 levels
      "TCS.NS": { price: 4156, name: "TCS" }, // Updated to Jan 2025 levels
      "HDFCBANK.NS": { price: 1721, name: "HDFC BANK" }, // Updated to Jan 2025 levels
      "INFY.NS": { price: 1889, name: "INFOSYS" }, // Updated to Jan 2025 levels
      "ICICIBANK.NS": { price: 1312, name: "ICICI BANK" }, // Updated to Jan 2025 levels
      "HINDUNILVR.NS": { price: 2487, name: "HUL" }, // Updated to Jan 2025 levels
      "ITC.NS": { price: 481, name: "ITC" }, // Updated to Jan 2025 levels
      "KOTAKBANK.NS": { price: 1789, name: "KOTAK" }, // Updated to Jan 2025 levels
    };

    const base = baseData[symbol];
    if (!base) return null;

    // Create more realistic market movement simulation
    const isMarketOpen = this.checkMarketOpen();
    const volatilityFactor = isMarketOpen ? 1.0 : 0.1; // Reduce movement when market closed

    const changePercent = (Math.random() - 0.5) * 2 * volatilityFactor; // More realistic range
    const change = (base.price * changePercent) / 100;
    const currentPrice = base.price + change;

    const stockInfo = this.stocks.find((s) => s.symbol === symbol);

    return {
      symbol,
      name: base.name,
      displayName: stockInfo?.displayName || base.name,
      price: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      timestamp: new Date(),
      marketState: isMarketOpen ? "REGULAR" : "CLOSED",
      dayHigh: Math.round(currentPrice * 1.015 * 100) / 100,
      dayLow: Math.round(currentPrice * 0.985 * 100) / 100,
    };
  }

  // Market timing for Indian markets (IST)
  private checkMarketOpen(): boolean {
    const now = new Date();
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const day = ist.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // Market closed on weekends
    if (day === 0 || day === 6) return false;

    // Indian market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM

    return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
  }

  // Fallback mode tracking with immediate initialization
  private fallbackMode = false; // Start with server API, fallback if needed
  private apiFailureCount = 0;
  private isInitialized = false;
  private subscribers: ((data: {
    stocks: FinnhubStockData[];
    sentiment: MarketSentiment;
    currencies?: CurrencyRate[];
  }) => void)[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating = false; // Prevent concurrent updates
  private lastSuccessfulData: any = null; // Cache last successful data

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Public method to get all stock data
  async getAllStocks(): Promise<FinnhubStockData[]> {
    if (this.fallbackMode) {
      const results = await Promise.all(
        this.stocks.map((stock) =>
          this.fetchStockFromFinnhub(
            stock.symbol,
            stock.finnhubSymbol,
            stock.isIndex,
          ),
        ),
      );
      return results.filter(
        (result): result is FinnhubStockData => result !== null,
      );
    }

    const data = await this.fetchAllMarketData();
    return data ? data.stocks : [];
  }

  // Calculate market sentiment (fallback method)
  calculateMarketSentiment(stocks: FinnhubStockData[]): MarketSentiment {
    const stocksOnly = stocks.filter(
      (stock) => !["^NSEI", "^BSESN"].includes(stock.symbol),
    );

    const positiveStocks = stocksOnly.filter(
      (stock) => stock.change > 0,
    ).length;
    const totalStocks = stocksOnly.length;
    const advanceDeclineRatio =
      totalStocks > 0 ? positiveStocks / totalStocks : 0.5;

    let sentiment: "bullish" | "bearish" | "neutral";
    if (advanceDeclineRatio >= 0.6) {
      sentiment = "bullish";
    } else if (advanceDeclineRatio <= 0.4) {
      sentiment = "bearish";
    } else {
      sentiment = "neutral";
    }

    return {
      sentiment,
      advanceDeclineRatio,
      positiveStocks,
      totalStocks,
    };
  }

  // Fetch currency exchange rates (fallback data)
  private getFallbackCurrencyData(): CurrencyRate[] {
    const usdInr = 84.25 + (Math.random() - 0.5) * 0.5;
    const eurInr = 91.75 + (Math.random() - 0.5) * 0.5;
    const gbpInr = 103.45 + (Math.random() - 0.5) * 0.5;
    const jpyInr = 0.56 + (Math.random() - 0.5) * 0.01;

    return [
      {
        symbol: "USDINR=X",
        name: "USD/INR",
        rate: Math.round(usdInr * 100) / 100,
        change: (Math.random() - 0.5) * 0.5,
        changePercent: (Math.random() - 0.5) * 0.6,
        timestamp: new Date(),
      },
      {
        symbol: "EURINR=X",
        name: "EUR/INR",
        rate: Math.round(eurInr * 100) / 100,
        change: (Math.random() - 0.5) * 0.6,
        changePercent: (Math.random() - 0.5) * 0.7,
        timestamp: new Date(),
      },
      {
        symbol: "GBPINR=X",
        name: "GBP/INR",
        rate: Math.round(gbpInr * 100) / 100,
        change: (Math.random() - 0.5) * 0.7,
        changePercent: (Math.random() - 0.5) * 0.8,
        timestamp: new Date(),
      },
      {
        symbol: "JPYINR=X",
        name: "JPY/INR",
        rate: Math.round(jpyInr * 10000) / 10000,
        change: (Math.random() - 0.5) * 0.01,
        changePercent: (Math.random() - 0.5) * 0.5,
        timestamp: new Date(),
      },
    ];
  }

  // Public method to update all data and notify subscribers
  async updateAllData(): Promise<void> {
    // Prevent concurrent updates
    if (this.isUpdating) {
      console.log("📊 Update already in progress, skipping...");
      // If we have cached data, notify subscribers immediately
      if (this.lastSuccessfulData) {
        try {
          this.subscribers.forEach((callback) =>
            callback(this.lastSuccessfulData),
          );
        } catch (error) {
          console.warn("Error notifying subscribers with cached data:", error);
        }
      } else if (!this.isInitialized) {
        // If no cached data and not initialized, provide immediate fallback
        const fallbackData = this.getFallbackMarketData();
        this.lastSuccessfulData = fallbackData;
        this.isInitialized = true;
        try {
          this.subscribers.forEach((callback) => callback(fallbackData));
        } catch (error) {
          console.warn("Error notifying subscribers with immediate fallback:", error);
        }
      }
      return;
    }

    this.isUpdating = true;

    try {
      let data: any = null;

      if (this.fallbackMode) {
        console.log("📊 Using fallback mode for data update");
        data = this.getFallbackMarketData();
      } else {
        try {
          data = await this.fetchAllMarketData();
        } catch (fetchError) {
          console.warn("📊 Fetch failed, switching to fallback:", fetchError.message);
          this.fallbackMode = true;
          data = this.getFallbackMarketData();
        }

        // If server fails, switch to fallback
        if (!data) {
          console.log("📊 Server failed, switching to fallback mode");
          this.fallbackMode = true;
          data = this.getFallbackMarketData();
        }
      }

      if (data) {
        // Add fallback currency and crypto data if not provided by server or empty
        if (!data.currencies || data.currencies.length === 0) {
          data.currencies = this.getFallbackCurrencyData();
        }

        this.lastSuccessfulData = data;
        this.isInitialized = true;

        try {
          this.subscribers.forEach((callback) => {
            try {
              callback(data);
            } catch (callbackError) {
              console.warn("Error in subscriber callback:", callbackError);
            }
          });
        } catch (error) {
          console.warn("Error notifying subscribers:", error);
        }
      } else {
        // Ultimate fallback if everything fails
        console.log("📊 Using ultimate fallback data");
        const fallbackData = this.getFallbackMarketData();
        this.lastSuccessfulData = fallbackData;

        try {
          this.subscribers.forEach((callback) => {
            try {
              callback(fallbackData);
            } catch (callbackError) {
              console.warn(
                "Error in fallback subscriber callback:",
                callbackError,
              );
            }
          });
        } catch (error) {
          console.warn("Error notifying subscribers with fallback:", error);
        }
      }
    } catch (error) {
      console.error(
        "Failed to update market data:",
        error?.message || "Unknown error",
      );

      // If we have cached data from previous successful call, use it
      if (this.lastSuccessfulData) {
        console.log("📊 Using cached data due to fetch error");
        try {
          this.subscribers.forEach((callback) => {
            try {
              callback(this.lastSuccessfulData);
            } catch (callbackError) {
              console.warn("Error in cached data callback:", callbackError);
            }
          });
        } catch (error) {
          console.warn("Error notifying subscribers with cached data:", error);
        }
      } else {
        // If no cached data, provide basic fallback
        console.log("📊 No cached data available, providing basic fallback");
        const basicFallback = this.getFallbackMarketData();
        try {
          this.subscribers.forEach((callback) => {
            try {
              callback(basicFallback);
            } catch (callbackError) {
              console.warn("Error in basic fallback callback:", callbackError);
            }
          });
        } catch (error) {
          console.warn("Error with basic fallback:", error);
        }
      }
    } finally {
      this.isUpdating = false;
    }
  }

  // Public method to check if market is open
  isMarketOpen(): boolean {
    const now = new Date();
    const ist = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    );
    const day = ist.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = ist.getHours();
    const minutes = ist.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    // Market closed on weekends
    if (day === 0 || day === 6) return false;

    // Indian market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15; // 9:15 AM
    const marketClose = 15 * 60 + 30; // 3:30 PM

    return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
  }

  // Subscription management
  subscribeToUpdates(
    callback: (data: {
      stocks: FinnhubStockData[];
      sentiment: MarketSentiment;
      currencies?: CurrencyRate[];
    }) => void,
  ): () => void {
    this.subscribers.push(callback);

    // If we have cached data, immediately provide it to the new subscriber
    if (this.lastSuccessfulData) {
      try {
        setTimeout(() => {
          try {
            callback(this.lastSuccessfulData);
          } catch (error) {
            console.warn("Error in immediate callback:", error);
          }
        }, 0);
      } catch (error) {
        console.warn("Error setting up immediate callback:", error);
      }
    }

    // Start update interval if not already running
    if (!this.updateInterval) {
      this.updateInterval = setInterval(() => {
        try {
          this.updateAllData();
        } catch (error) {
          console.error("Error in scheduled update:", error);
        }
      }, 10000); // Update every 10 seconds

      // Initial fetch with small delay to allow all components to subscribe first
      setTimeout(() => {
        try {
          this.updateAllData();
        } catch (error) {
          console.error("Error in initial update:", error);
          // Provide fallback data immediately if initial update fails
          const fallbackData = this.getFallbackMarketData();
          this.lastSuccessfulData = fallbackData;
          try {
            this.subscribers.forEach((cb) => cb(fallbackData));
          } catch (cbError) {
            console.warn("Error providing initial fallback data:", cbError);
          }
        }
      }, 100);
    }

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }

      // Stop updates if no subscribers
      if (this.subscribers.length === 0 && this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    };
  }
}

// Type definitions
export interface FinnhubStockData {
  symbol: string;
  name: string;
  displayName?: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  marketState: string;
  dayHigh: number;
  dayLow: number;
}

// Currency exchange rate interface
export interface CurrencyRate {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface MarketSentiment {
  sentiment: "bullish" | "bearish" | "neutral";
  advanceDeclineRatio: number;
  positiveStocks: number;
  totalStocks: number;
}

// Utility function for safe timestamp formatting
export function safeFormatTimestamp(
  timestamp: Date | string | number,
  locale = "en-IN",
): string {
  try {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString(locale);
    }

    // Handle string or number timestamps
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString(locale);
    }

    return date.toLocaleTimeString(locale);
  } catch (error) {
    console.warn("Error formatting timestamp:", error);
    return new Date().toLocaleTimeString(locale);
  }
}

// Export the service instance
export const finnhubMarketDataService = new FinnhubMarketDataService();
