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
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  marketState: string;
  dayHigh: number;
  dayLow: number;
}

// Stock symbols mapping for accurate data
const STOCK_SYMBOLS = [
  { symbol: "RELIANCE.NS", name: "RELIANCE" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "HDFCBANK.NS", name: "HDFC BANK" },
  { symbol: "INFY.NS", name: "INFOSYS" },
  { symbol: "ICICIBANK.NS", name: "ICICI BANK" },
  { symbol: "HINDUNILVR.NS", name: "HUL" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "KOTAKBANK.NS", name: "KOTAK" },
  { symbol: "^NSEI", name: "NIFTY 50" },
  { symbol: "^BSESN", name: "SENSEX" },
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

// API endpoint to get all stock data
export const getMarketData: RequestHandler = async (req, res) => {
  try {
    console.log("📊 Fetching real-time market data from server...");
    
    // Fetch all stocks in parallel
    const stockPromises = STOCK_SYMBOLS.map(stock => 
      fetchStockData(stock.symbol)
    );
    
    const results = await Promise.all(stockPromises);
    const stocks = results.filter((stock): stock is StockData => stock !== null);
    
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
    
    console.log(`✅ Successfully fetched ${stocks.length} stocks with ${sentiment} sentiment`);
    
    res.json({
      stocks,
      sentiment: marketSentiment,
      timestamp: new Date(),
      marketState: isMarketOpen() ? "OPEN" : "CLOSED",
    });
    
  } catch (error) {
    console.error("❌ Error fetching market data:", error);
    res.status(500).json({ 
      error: "Failed to fetch market data",
      message: error.message 
    });
  }
};
