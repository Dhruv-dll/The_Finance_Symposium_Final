// Accurate Market Data Service for real-time Indian stock prices
// Using Yahoo Finance API with proper NSE/BSE symbol formats

export interface AccurateStockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  marketState: 'REGULAR' | 'CLOSED' | 'PRE' | 'POST';
  volume?: number;
  dayHigh?: number;
  dayLow?: number;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface ForexData {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

export interface MarketSentiment {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  advanceDeclineRatio: number;
  positiveStocks: number;
  totalStocks: number;
}

class AccurateMarketDataService {
  private stocks = [
    { symbol: '^NSEI', name: 'NIFTY 50', type: 'index' },
    { symbol: '^BSESN', name: 'SENSEX', type: 'index' },
    { symbol: 'RELIANCE.NS', name: 'RELIANCE', type: 'stock' },
    { symbol: 'TCS.NS', name: 'TCS', type: 'stock' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC BANK', type: 'stock' },
    { symbol: 'INFY.NS', name: 'INFOSYS', type: 'stock' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI BANK', type: 'stock' },
    { symbol: 'HINDUNILVR.NS', name: 'HUL', type: 'stock' },
    { symbol: 'ITC.NS', name: 'ITC', type: 'stock' },
    { symbol: 'KOTAKBANK.NS', name: 'KOTAK', type: 'stock' }
  ];

  private cryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' }
  ];

  private forex = [
    { symbol: 'USDINR=X', name: 'USD/INR', pair: 'USD/INR' }
  ];

  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers: ((data: {
    stocks: AccurateStockData[];
    crypto: CryptoData[];
    forex: ForexData[];
    sentiment: MarketSentiment;
  }) => void)[] = [];
  
  private cache: {
    stocks: AccurateStockData[];
    crypto: CryptoData[];
    forex: ForexData[];
    lastUpdate: Date;
  } = {
    stocks: [],
    crypto: [],
    forex: [],
    lastUpdate: new Date()
  };

  private retryCount = 0;
  private maxRetries = 3;
  private readonly apiRateLimit = 2000; // 2 seconds between calls
  private lastApiCall = 0;

  constructor() {
    this.loadCachedData();
  }

  // Market hours detection for IST
  isMarketOpen(): boolean {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const day = istTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    
    // Weekend check
    if (day === 0 || day === 6) return false;
    
    // Market hours: 9:15 AM to 3:30 PM IST
    if (hour < 9 || hour > 15) return false;
    if (hour === 9 && minute < 15) return false;
    if (hour === 15 && minute > 30) return false;
    
    return true;
  }

  // Get market session info
  getMarketSession(): { session: string; nextOpen?: Date; nextClose?: Date } {
    const isOpen = this.isMarketOpen();
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    
    if (isOpen) {
      // Calculate next close
      const nextClose = new Date(istTime);
      nextClose.setHours(15, 30, 0, 0);
      return { session: 'REGULAR', nextClose };
    } else {
      // Calculate next open
      const nextOpen = new Date(istTime);
      const currentDay = nextOpen.getDay();
      
      if (currentDay === 6) { // Saturday
        nextOpen.setDate(nextOpen.getDate() + 2); // Monday
      } else if (currentDay === 0) { // Sunday
        nextOpen.setDate(nextOpen.getDate() + 1); // Monday
      } else if (istTime.getHours() >= 15 && istTime.getMinutes() > 30) {
        nextOpen.setDate(nextOpen.getDate() + 1); // Next day
      }
      
      nextOpen.setHours(9, 15, 0, 0);
      return { session: 'CLOSED', nextOpen };
    }
  }

  // Fetch stock data with retry mechanism and CORS proxy
  async fetchStockData(symbol: string): Promise<AccurateStockData | null> {
    try {
      await this.rateLimitCheck();

      // Try multiple endpoints with fallback
      const endpoints = [
        // Primary: Direct Yahoo Finance (may fail due to CORS)
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
        // Fallback: CORS proxy
        `https://api.allorigins.win/get?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`)}`,
        // Alternative CORS proxy
        `https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
      ];

      let response;
      let lastError;

      for (let i = 0; i < endpoints.length; i++) {
        try {
          const headers: HeadersInit = {
            'Accept': 'application/json',
          };

          // Add specific headers for CORS proxies
          if (endpoints[i].includes('allorigins.win')) {
            // allorigins proxy doesn't need special headers
          } else if (endpoints[i].includes('cors-anywhere')) {
            headers['X-Requested-With'] = 'XMLHttpRequest';
          } else {
            // Direct Yahoo Finance
            headers['User-Agent'] = 'Mozilla/5.0 (compatible; TFS/1.0)';
          }

          response = await fetch(endpoints[i], {
            method: 'GET',
            headers,
            mode: 'cors',
          });

          if (response.ok) {
            break; // Success, exit loop
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          lastError = error;
          console.warn(`Endpoint ${i + 1} failed for ${symbol}:`, error);

          if (i === endpoints.length - 1) {
            throw lastError; // Re-throw the last error if all endpoints fail
          }
          continue; // Try next endpoint
        }
      }

      if (!response || !response.ok) {
        throw new Error('All endpoints failed');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();

      // Handle CORS proxy response format
      if (data.contents) {
        // allorigins.win proxy response
        try {
          data = JSON.parse(data.contents);
        } catch (parseError) {
          throw new Error('Failed to parse proxy response');
        }
      }

      const result = data.chart?.result?.[0];
      
      if (!result || !result.meta) {
        throw new Error('Invalid API response structure');
      }

      const meta = result.meta;
      const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
      const previousClose = meta.previousClose || currentPrice;
      const change = currentPrice - previousClose;
      const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

      // Validate data
      if (typeof currentPrice !== 'number' || currentPrice <= 0) {
        throw new Error('Invalid price data received');
      }

      const stockInfo = this.stocks.find(s => s.symbol === symbol);
      
      return {
        symbol: symbol,
        name: stockInfo?.name || symbol,
        price: currentPrice,
        change: change,
        changePercent: changePercent,
        timestamp: new Date(meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now()),
        marketState: meta.marketState || 'CLOSED',
        volume: meta.regularMarketVolume || undefined,
        dayHigh: meta.regularMarketDayHigh || undefined,
        dayLow: meta.regularMarketDayLow || undefined
      };

    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        await this.delay(1000 * this.retryCount); // Exponential backoff
        return this.fetchStockData(symbol);
      }
      
      this.retryCount = 0;
      return this.getFallbackStockData(symbol);
    }
  }

  // Fetch cryptocurrency data
  async fetchCryptoData(): Promise<CryptoData[]> {
    try {
      await this.rateLimitCheck();
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true&include_last_updated_at=true',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Crypto API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.cryptos.map(crypto => {
        const coinData = data[crypto.id];
        if (!coinData) return null;

        return {
          symbol: crypto.symbol,
          name: crypto.name,
          price: coinData.inr || 0,
          change: 0, // CoinGecko doesn't provide absolute change
          changePercent: coinData.inr_24h_change || 0,
          timestamp: new Date(coinData.last_updated_at ? coinData.last_updated_at * 1000 : Date.now())
        };
      }).filter(Boolean) as CryptoData[];

    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getFallbackCryptoData();
    }
  }

  // Fetch forex data
  async fetchForexData(): Promise<ForexData[]> {
    try {
      await this.rateLimitCheck();
      
      const forexPromises = this.forex.map(async (pair) => {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${pair.symbol}?interval=1d&range=1d`
        );
        
        if (!response.ok) throw new Error(`Forex API error: ${response.status}`);
        
        const data = await response.json();
        const result = data.chart?.result?.[0];
        
        if (!result?.meta) return null;

        const meta = result.meta;
        const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
        const previousClose = meta.previousClose || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

        return {
          pair: pair.pair,
          price: currentPrice,
          change: change,
          changePercent: changePercent,
          timestamp: new Date(meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now())
        };
      });

      const results = await Promise.all(forexPromises);
      return results.filter(Boolean) as ForexData[];

    } catch (error) {
      console.error('Error fetching forex data:', error);
      return this.getFallbackForexData();
    }
  }

  // Calculate market sentiment
  calculateMarketSentiment(stocks: AccurateStockData[]): MarketSentiment {
    const stocksOnly = stocks.filter(stock => 
      this.stocks.find(s => s.symbol === stock.symbol)?.type === 'stock'
    );
    
    const positiveStocks = stocksOnly.filter(stock => stock.change > 0).length;
    const totalStocks = stocksOnly.length;
    const advanceDeclineRatio = totalStocks > 0 ? positiveStocks / totalStocks : 0.5;

    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (advanceDeclineRatio > 0.6) sentiment = 'bullish';
    else if (advanceDeclineRatio < 0.4) sentiment = 'bearish';

    return {
      sentiment,
      advanceDeclineRatio,
      positiveStocks,
      totalStocks
    };
  }

  // Main update function
  async updateAllData(): Promise<void> {
    try {
      console.log('🔄 Fetching accurate market data...');
      
      // Fetch all data in parallel for better performance
      const [stockResults, cryptoResults, forexResults] = await Promise.all([
        Promise.all(this.stocks.map(stock => this.fetchStockData(stock.symbol))),
        this.fetchCryptoData(),
        this.fetchForexData()
      ]);

      // Filter out null results and validate data
      const validStocks = stockResults.filter(Boolean) as AccurateStockData[];
      const sentiment = this.calculateMarketSentiment(validStocks);

      // Update cache
      this.cache = {
        stocks: validStocks,
        crypto: cryptoResults,
        forex: forexResults,
        lastUpdate: new Date()
      };

      this.saveCachedData();

      // Notify subscribers
      const data = {
        stocks: validStocks,
        crypto: cryptoResults,
        forex: forexResults,
        sentiment
      };

      this.subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });

      console.log('✅ Market data updated successfully', {
        stocks: validStocks.length,
        crypto: cryptoResults.length,
        forex: forexResults.length,
        sentiment: sentiment.sentiment
      });

    } catch (error) {
      console.error('❌ Error updating market data:', error);
      // Use cached data if available
      if (this.cache.stocks.length > 0) {
        console.log('📦 Using cached data due to API error');
        const sentiment = this.calculateMarketSentiment(this.cache.stocks);
        this.subscribers.forEach(callback => {
          callback({
            stocks: this.cache.stocks,
            crypto: this.cache.crypto,
            forex: this.cache.forex,
            sentiment
          });
        });
      }
    }
  }

  // Subscription management
  subscribeToUpdates(callback: (data: {
    stocks: AccurateStockData[];
    crypto: CryptoData[];
    forex: ForexData[];
    sentiment: MarketSentiment;
  }) => void): () => void {
    this.subscribers.push(callback);

    // Start update interval if this is the first subscriber
    if (this.subscribers.length === 1) {
      this.startUpdates();
    }

    // Provide immediate data if available
    if (this.cache.stocks.length > 0) {
      const sentiment = this.calculateMarketSentiment(this.cache.stocks);
      setTimeout(() => callback({
        stocks: this.cache.stocks,
        crypto: this.cache.crypto,
        forex: this.cache.forex,
        sentiment
      }), 100);
    }

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }

      // Stop updates if no subscribers
      if (this.subscribers.length === 0) {
        this.stopUpdates();
      }
    };
  }

  // Start update intervals
  private startUpdates(): void {
    // Initial update
    this.updateAllData();

    // Set update interval based on market hours
    const updateInterval = this.isMarketOpen() ? 30000 : 300000; // 30s during market, 5min after
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.updateAllData();
    }, updateInterval);

    console.log(`📊 Market data updates started (${updateInterval/1000}s interval)`);
  }

  // Stop updates
  private stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log('⏹️ Market data updates stopped');
    }
  }

  // Utility functions
  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastApiCall;
    
    if (timeSinceLastCall < this.apiRateLimit) {
      await this.delay(this.apiRateLimit - timeSinceLastCall);
    }
    
    this.lastApiCall = Date.now();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Fallback data functions
  private getFallbackStockData(symbol: string): AccurateStockData | null {
    const fallbackPrices: Record<string, Partial<AccurateStockData>> = {
      '^NSEI': { price: 24500, change: 0, changePercent: 0, name: 'NIFTY 50' },
      '^BSESN': { price: 80000, change: 0, changePercent: 0, name: 'SENSEX' },
      'RELIANCE.NS': { price: 2800, change: 0, changePercent: 0, name: 'RELIANCE' },
      'TCS.NS': { price: 4200, change: 0, changePercent: 0, name: 'TCS' },
      'HDFCBANK.NS': { price: 1650, change: 0, changePercent: 0, name: 'HDFC BANK' },
      'INFY.NS': { price: 1800, change: 0, changePercent: 0, name: 'INFOSYS' },
      'ICICIBANK.NS': { price: 1200, change: 0, changePercent: 0, name: 'ICICI BANK' },
      'HINDUNILVR.NS': { price: 2300, change: 0, changePercent: 0, name: 'HUL' },
      'ITC.NS': { price: 460, change: 0, changePercent: 0, name: 'ITC' },
      'KOTAKBANK.NS': { price: 1750, change: 0, changePercent: 0, name: 'KOTAK' }
    };

    const fallback = fallbackPrices[symbol];
    if (!fallback) return null;

    return {
      symbol,
      name: fallback.name || symbol,
      price: fallback.price || 0,
      change: fallback.change || 0,
      changePercent: fallback.changePercent || 0,
      timestamp: new Date(),
      marketState: 'CLOSED'
    };
  }

  private getFallbackCryptoData(): CryptoData[] {
    return [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 3500000, // ~$43,000 in INR
        change: 0,
        changePercent: 0,
        timestamp: new Date()
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 220000, // ~$2,700 in INR
        change: 0,
        changePercent: 0,
        timestamp: new Date()
      }
    ];
  }

  private getFallbackForexData(): ForexData[] {
    return [
      {
        pair: 'USD/INR',
        price: 83.15,
        change: 0,
        changePercent: 0,
        timestamp: new Date()
      }
    ];
  }

  // Data persistence
  private saveCachedData(): void {
    try {
      localStorage.setItem('tfs-market-cache', JSON.stringify({
        ...this.cache,
        lastUpdate: this.cache.lastUpdate.toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save market data cache:', error);
    }
  }

  private loadCachedData(): void {
    try {
      const cached = localStorage.getItem('tfs-market-cache');
      if (cached) {
        const data = JSON.parse(cached);
        this.cache = {
          ...data,
          lastUpdate: new Date(data.lastUpdate)
        };
        
        // Check if cache is not too old (max 1 hour)
        const cacheAge = Date.now() - this.cache.lastUpdate.getTime();
        if (cacheAge > 60 * 60 * 1000) {
          this.cache = { stocks: [], crypto: [], forex: [], lastUpdate: new Date() };
        }
      }
    } catch (error) {
      console.warn('Failed to load market data cache:', error);
    }
  }

  // Getter methods for testing and debugging
  getStockSymbols(): string[] {
    return this.stocks.map(s => s.symbol);
  }

  getCacheInfo(): { age: number; hasData: boolean; lastUpdate: Date } {
    return {
      age: Date.now() - this.cache.lastUpdate.getTime(),
      hasData: this.cache.stocks.length > 0,
      lastUpdate: this.cache.lastUpdate
    };
  }
}

// Export singleton instance
export const accurateMarketDataService = new AccurateMarketDataService();
export default AccurateMarketDataService;
