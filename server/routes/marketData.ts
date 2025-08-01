import { RequestHandler } from "express";

interface YahooFinanceData {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice?: number;
        previousClose?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        symbol: string;
        longName?: string;
      };
    }>;
  };
}

interface StockData {
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

interface CurrencyData {
  symbol: string;
  name: string;
  rate: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume24h: number;
  marketCap: number;
  timestamp: Date;
}

// Stock symbols mapping for accurate data
const STOCK_SYMBOLS = [
  { symbol: "RELIANCE.NS", name: "RELIANCE", displayName: "Reliance Industries" },
  { symbol: "TCS.NS", name: "TCS", displayName: "Tata Consultancy Services" },
  { symbol: "HDFCBANK.NS", name: "HDFC BANK", displayName: "HDFC Bank Ltd" },
  { symbol: "INFY.NS", name: "INFOSYS", displayName: "Infosys Limited" },
  { symbol: "ICICIBANK.NS", name: "ICICI BANK", displayName: "ICICI Bank Ltd" },
  { symbol: "HINDUNILVR.NS", name: "HUL", displayName: "Hindustan Unilever" },
  { symbol: "ITC.NS", name: "ITC", displayName: "ITC Limited" },
  { symbol: "KOTAKBANK.NS", name: "KOTAK", displayName: "Kotak Mahindra Bank" },
  { symbol: "^NSEI", name: "NIFTY 50", displayName: "NIFTY 50 Index" },
  { symbol: "^BSESN", name: "SENSEX", displayName: "BSE Sensex" },
];

// Currency pairs for exchange rates
const CURRENCY_SYMBOLS = [
  { symbol: "USDINR=X", name: "USD/INR" },
  { symbol: "EURINR=X", name: "EUR/INR" },
  { symbol: "GBPINR=X", name: "GBP/INR" },
  { symbol: "JPYINR=X", name: "JPY/INR" },
];

// Cryptocurrency symbols
const CRYPTO_SYMBOLS = [
  { symbol: "BTC-USD", name: "Bitcoin", inrMultiplier: 84.25 },
  { symbol: "ETH-USD", name: "Ethereum", inrMultiplier: 84.25 },
  { symbol: "ADA-USD", name: "Cardano", inrMultiplier: 84.25 },
  { symbol: "DOT-USD", name: "Polkadot", inrMultiplier: 84.25 },
];

// Check if Indian market is open
function isMarketOpen(): boolean {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
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

// Fetch real stock data from Yahoo Finance
async function fetchStockData(symbol: string): Promise<StockData | null> {
  try {
    console.log(`🔍 Fetching real data for ${symbol}...`);
    
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: YahooFinanceData = await response.json();
    const result = data.chart?.result?.[0];

    if (!result || !result.meta) {
      throw new Error("No data received from Yahoo Finance");
    }

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice || meta.previousClose || 0;
    const previousClose = meta.previousClose || currentPrice;
    
    if (currentPrice <= 0) {
      throw new Error("Invalid price data");
    }

    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
    const dayHigh = meta.regularMarketDayHigh || currentPrice;
    const dayLow = meta.regularMarketDayLow || currentPrice;

    const stockInfo = STOCK_SYMBOLS.find(s => s.symbol === symbol);

    return {
      symbol,
      name: stockInfo?.name || meta.longName || symbol,
      displayName: stockInfo?.displayName || stockInfo?.name || meta.longName || symbol,
      price: Math.round(currentPrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      timestamp: new Date(),
      marketState: isMarketOpen() ? "REGULAR" : "CLOSED",
      dayHigh: Math.round(dayHigh * 100) / 100,
      dayLow: Math.round(dayLow * 100) / 100,
    };
  } catch (error) {
    console.warn(`❌ Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

// Fetch currency exchange rate
async function fetchCurrencyData(symbol: string): Promise<CurrencyData | null> {
  try {
    console.log(`💱 Fetching currency data for ${symbol}...`);

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        timeout: 8000,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: YahooFinanceData = await response.json();
    const result = data.chart?.result?.[0];

    if (!result || !result.meta) {
      throw new Error("No currency data received");
    }

    const meta = result.meta;
    const currentRate = meta.regularMarketPrice || meta.previousClose || 0;
    const previousClose = meta.previousClose || currentRate;

    if (currentRate <= 0) {
      throw new Error("Invalid currency rate");
    }

    const change = currentRate - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
    const currencyInfo = CURRENCY_SYMBOLS.find(c => c.symbol === symbol);

    return {
      symbol,
      name: currencyInfo?.name || symbol,
      rate: Math.round(currentRate * 10000) / 10000,
      change: Math.round(change * 10000) / 10000,
      changePercent: Math.round(changePercent * 100) / 100,
      timestamp: new Date(),
    };
  } catch (error) {
    console.warn(`❌ Failed to fetch currency ${symbol}:`, error.message);
    return null;
  }
}

// Fetch cryptocurrency data
async function fetchCryptoData(symbol: string, name: string, inrMultiplier: number): Promise<CryptoData | null> {
  try {
    console.log(`₿ Fetching crypto data for ${symbol}...`);

    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        timeout: 8000,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: YahooFinanceData = await response.json();
    const result = data.chart?.result?.[0];

    if (!result || !result.meta) {
      throw new Error("No crypto data received");
    }

    const meta = result.meta;
    const currentPriceUSD = meta.regularMarketPrice || meta.previousClose || 0;
    const previousCloseUSD = meta.previousClose || currentPriceUSD;

    if (currentPriceUSD <= 0) {
      throw new Error("Invalid crypto price");
    }

    // Convert to INR
    const currentPriceINR = currentPriceUSD * inrMultiplier;
    const previousCloseINR = previousCloseUSD * inrMultiplier;
    const changeINR = currentPriceINR - previousCloseINR;
    const changePercent = previousCloseINR > 0 ? (changeINR / previousCloseINR) * 100 : 0;

    // Mock volume and market cap data (in INR)
    const volume24h = Math.random() * 5000000000; // Random volume
    const marketCap = currentPriceINR * 20000000; // Estimated market cap

    return {
      symbol: symbol.replace('-USD', '-INR'),
      name,
      price: Math.round(currentPriceINR),
      change: Math.round(changeINR),
      changePercent: Math.round(changePercent * 100) / 100,
      volume24h: Math.round(volume24h),
      marketCap: Math.round(marketCap),
      timestamp: new Date(),
    };
  } catch (error) {
    console.warn(`❌ Failed to fetch crypto ${symbol}:`, error.message);
    return null;
  }
}

// API endpoint to get all market data
export const getMarketData: RequestHandler = async (req, res) => {
  try {
    console.log("📊 Fetching comprehensive market data from server...");

    // Fetch stocks, currencies, and crypto in parallel
    const stockPromises = STOCK_SYMBOLS.map(stock =>
      fetchStockData(stock.symbol)
    );

    const currencyPromises = CURRENCY_SYMBOLS.map(currency =>
      fetchCurrencyData(currency.symbol)
    );

    const cryptoPromises = CRYPTO_SYMBOLS.map(crypto =>
      fetchCryptoData(crypto.symbol, crypto.name, crypto.inrMultiplier)
    );

    const [stockResults, currencyResults, cryptoResults] = await Promise.all([
      Promise.all(stockPromises),
      Promise.all(currencyPromises),
      Promise.all(cryptoPromises)
    ]);

    const stocks = stockResults.filter((stock): stock is StockData => stock !== null);
    const currencies = currencyResults.filter((currency): currency is CurrencyData => currency !== null);
    const crypto = cryptoResults.filter((cryptoData): cryptoData is CryptoData => cryptoData !== null);
    
    // Calculate market sentiment
    const stocksOnly = stocks.filter(
      stock => !["^NSEI", "^BSESN"].includes(stock.symbol)
    );
    
    const positiveStocks = stocksOnly.filter(stock => stock.change > 0).length;
    const totalStocks = stocksOnly.length;
    const advanceDeclineRatio = totalStocks > 0 ? positiveStocks / totalStocks : 0.5;
    
    let sentiment: "bullish" | "bearish" | "neutral";
    if (advanceDeclineRatio >= 0.6) {
      sentiment = "bullish";
    } else if (advanceDeclineRatio <= 0.4) {
      sentiment = "bearish";
    } else {
      sentiment = "neutral";
    }
    
    const marketSentiment = {
      sentiment,
      advanceDeclineRatio,
      positiveStocks,
      totalStocks,
    };
    
    console.log(`✅ Successfully fetched ${stocks.length} stocks, ${currencies.length} currencies, ${crypto.length} crypto with ${sentiment} sentiment`);

    res.json({
      stocks,
      currencies,
      crypto,
      sentiment: marketSentiment,
      timestamp: new Date(),
      marketState: isMarketOpen() ? "OPEN" : "CLOSED",
    });
    
  } catch (error) {
    console.error("❌ Error fetching comprehensive market data:", error);
    res.status(500).json({
      error: "Failed to fetch market data",
      message: error.message,
      timestamp: new Date()
    });
  }
};
