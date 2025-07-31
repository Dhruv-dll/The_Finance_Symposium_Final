// Market Data Service for real-time stock prices
// Using Alpha Vantage API as primary, with fallback to mock data

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
}

export interface MarketDataService {
  getStockData: (symbols: string[]) => Promise<StockData[]>;
  subscribeToUpdates: (callback: (data: StockData[]) => void) => () => void;
}

// Alpha Vantage API service
class AlphaVantageService implements MarketDataService {
  private apiKey: string;
  private baseUrl: string;
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: ((data: StockData[]) => void)[] = [];

  constructor(apiKey?: string) {
    this.apiKey = apiKey || "demo"; // Use demo key for development
    this.baseUrl = "https://www.alphavantage.co/query";
  }

  async getStockData(symbols: string[]): Promise<StockData[]> {
    try {
      // For Indian stocks, we'll use a simplified approach
      // In production, you'd want to use proper Indian market APIs
      const stockData: StockData[] = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(
              `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`,
              {
                method: "GET",
                headers: {
                  Accept: "application/json",
                },
              },
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const quote = data["Global Quote"];

            if (!quote || Object.keys(quote).length === 0) {
              throw new Error("No data received");
            }

            return {
              symbol,
              price: parseFloat(quote["05. price"]) || 0,
              change: parseFloat(quote["09. change"]) || 0,
              changePercent:
                parseFloat(quote["10. change percent"].replace("%", "")) || 0,
              lastUpdate: new Date(),
            };
          } catch (error) {
            console.warn(
              `Failed to fetch data for ${symbol}, using mock data:`,
              error,
            );
            return this.getMockData(symbol);
          }
        }),
      );

      return stockData;
    } catch (error) {
      console.warn("API unavailable, using mock data:", error);
      return symbols.map((symbol) => this.getMockData(symbol));
    }
  }

  private getMockData(symbol: string): StockData {
    // Mock data with realistic Indian stock prices
    const mockPrices: Record<string, { base: number; range: number }> = {
      SENSEX: { base: 73000, range: 1000 },
      NIFTY: { base: 22000, range: 300 },
      "RELIANCE.BSE": { base: 2450, range: 100 },
      "TCS.BSE": { base: 3900, range: 200 },
      "HDFCBANK.BSE": { base: 1680, range: 50 },
      "INFY.BSE": { base: 1540, range: 80 },
      "ICICIBANK.BSE": { base: 1200, range: 60 },
      "HINDUNILVR.BSE": { base: 2300, range: 100 },
      "ITC.BSE": { base: 460, range: 20 },
      "KOTAKBANK.BSE": { base: 1750, range: 75 },
    };

    const config = mockPrices[symbol] || { base: 1000, range: 100 };
    const basePrice = config.base;
    const variation = (Math.random() - 0.5) * config.range * 0.1;
    const price = basePrice + variation;
    const change = variation;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol: symbol.replace(".BSE", ""),
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      lastUpdate: new Date(),
    };
  }

  subscribeToUpdates(callback: (data: StockData[]) => void): () => void {
    this.subscribers.push(callback);

    // Start update interval if not already running
    if (!this.updateInterval) {
      const symbols = [
        "SENSEX",
        "NIFTY",
        "RELIANCE.BSE",
        "TCS.BSE",
        "HDFCBANK.BSE",
        "INFY.BSE",
      ];

      this.updateInterval = setInterval(async () => {
        try {
          const data = await this.getStockData(symbols);
          this.subscribers.forEach((sub) => sub(data));
        } catch (error) {
          console.error("Failed to fetch market updates:", error);
        }
      }, 10000); // Update every 10 seconds

      // Initial fetch
      this.getStockData(symbols).then((data) => {
        this.subscribers.forEach((sub) => sub(data));
      });
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

// Yahoo Finance alternative (CORS-friendly)
class YahooFinanceService implements MarketDataService {
  private baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart";

  async getStockData(symbols: string[]): Promise<StockData[]> {
    try {
      const yahooSymbols = symbols.map((s) => {
        // Convert to Yahoo Finance symbol format
        if (s === "SENSEX") return "^BSESN";
        if (s === "NIFTY") return "^NSEI";
        return s.includes(".") ? s : `${s}.BO`; // Add Bombay Stock Exchange suffix
      });

      const stockData = await Promise.all(
        yahooSymbols.map(async (symbol, index) => {
          try {
            const response = await fetch(
              `${this.baseUrl}/${symbol}?interval=1d&range=1d`,
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const result = data.chart?.result?.[0];

            if (!result) {
              throw new Error("No data received");
            }

            const meta = result.meta;
            const currentPrice = meta.regularMarketPrice || 0;
            const previousClose = meta.previousClose || currentPrice;
            const change = currentPrice - previousClose;
            const changePercent = (change / previousClose) * 100;

            return {
              symbol: symbols[index],
              price: Math.round(currentPrice * 100) / 100,
              change: Math.round(change * 100) / 100,
              changePercent: Math.round(changePercent * 100) / 100,
              lastUpdate: new Date(),
            };
          } catch (error) {
            console.warn(`Failed to fetch Yahoo data for ${symbol}:`, error);
            return new AlphaVantageService().getMockData(symbols[index]);
          }
        }),
      );

      return stockData;
    } catch (error) {
      console.warn("Yahoo Finance API unavailable, using mock data:", error);
      return symbols.map((symbol) =>
        new AlphaVantageService().getMockData(symbol),
      );
    }
  }

  subscribeToUpdates(callback: (data: StockData[]) => void): () => void {
    const symbols = ["SENSEX", "NIFTY", "RELIANCE", "TCS", "HDFCBANK", "INFY"];

    const interval = setInterval(async () => {
      try {
        const data = await this.getStockData(symbols);
        callback(data);
      } catch (error) {
        console.error("Failed to fetch market updates:", error);
      }
    }, 15000); // Update every 15 seconds

    // Initial fetch
    this.getStockData(symbols).then(callback);

    return () => clearInterval(interval);
  }
}

// Market data factory
export function createMarketDataService(): MarketDataService {
  // Try Yahoo Finance first (better CORS support), fallback to Alpha Vantage
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    console.log("Using mock market data service for development");
    return new AlphaVantageService(); // Will use mock data
  }

  return new YahooFinanceService();
}

// Export the service instance
export const marketDataService = createMarketDataService();
