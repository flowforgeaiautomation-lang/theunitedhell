import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type SymbolCfg = {
  symbol: string;
  name: string;
  category: string;
  region: string;
  currency: string;
  unit?: string;
  exchange: string;
  marketTz: string;
  yahoo?: string;
  coingecko?: string;
};

const SYMBOLS: SymbolCfg[] = [
  { symbol: "SENSEX", name: "Sensex", category: "indices", region: "India", currency: "INR", exchange: "BSE", marketTz: "Asia/Kolkata", yahoo: "^BSESN" },
  { symbol: "NIFTY50", name: "NIFTY 50", category: "indices", region: "India", currency: "INR", exchange: "NSE", marketTz: "Asia/Kolkata", yahoo: "^NSEI" },
  { symbol: "BANKNIFTY", name: "Bank NIFTY", category: "indices", region: "India", currency: "INR", exchange: "NSE", marketTz: "Asia/Kolkata", yahoo: "^NSEBANK" },
  { symbol: "NIFTYIT", name: "NIFTY IT", category: "indices", region: "India", currency: "INR", exchange: "NSE", marketTz: "Asia/Kolkata", yahoo: "^CNXIT" },
  { symbol: "IXIC", name: "NASDAQ Composite", category: "indices", region: "US", currency: "USD", exchange: "NASDAQ", marketTz: "America/New_York", yahoo: "^IXIC" },
  { symbol: "SPX", name: "S&P 500", category: "indices", region: "US", currency: "USD", exchange: "NYSE", marketTz: "America/New_York", yahoo: "^GSPC" },
  { symbol: "DJI", name: "Dow Jones", category: "indices", region: "US", currency: "USD", exchange: "NYSE", marketTz: "America/New_York", yahoo: "^DJI" },
  { symbol: "FTSE100", name: "FTSE 100", category: "indices", region: "Europe", currency: "GBP", exchange: "LSE", marketTz: "Europe/London", yahoo: "^FTSE" },
  { symbol: "DAX", name: "DAX", category: "indices", region: "Europe", currency: "EUR", exchange: "XETRA", marketTz: "Europe/Berlin", yahoo: "^GDAXI" },
  { symbol: "CAC40", name: "CAC 40", category: "indices", region: "Europe", currency: "EUR", exchange: "Euronext", marketTz: "Europe/Paris", yahoo: "^FCHI" },
  { symbol: "N225", name: "Nikkei 225", category: "indices", region: "Asia", currency: "JPY", exchange: "TSE", marketTz: "Asia/Tokyo", yahoo: "^N225" },
  { symbol: "HSI", name: "Hang Seng", category: "indices", region: "Asia", currency: "HKD", exchange: "HKEX", marketTz: "Asia/Hong_Kong", yahoo: "^HSI" },
  { symbol: "SSEC", name: "Shanghai Composite", category: "indices", region: "Asia", currency: "CNY", exchange: "SSE", marketTz: "Asia/Shanghai", yahoo: "000001.SS" },
  { symbol: "GOLD", name: "Gold", category: "commodities", region: "Global", currency: "USD", unit: "/oz", exchange: "COMEX", marketTz: "America/New_York", yahoo: "GC=F" },
  { symbol: "SILVER", name: "Silver", category: "commodities", region: "Global", currency: "USD", unit: "/oz", exchange: "COMEX", marketTz: "America/New_York", yahoo: "SI=F" },
  { symbol: "BRENT", name: "Brent Crude", category: "commodities", region: "Global", currency: "USD", unit: "/bbl", exchange: "ICE", marketTz: "Europe/London", yahoo: "BZ=F" },
  { symbol: "WTI", name: "WTI Crude", category: "commodities", region: "Global", currency: "USD", unit: "/bbl", exchange: "NYMEX", marketTz: "America/New_York", yahoo: "CL=F" },
  { symbol: "NATGAS", name: "Natural Gas", category: "commodities", region: "Global", currency: "USD", unit: "/MMBtu", exchange: "NYMEX", marketTz: "America/New_York", yahoo: "NG=F" },
  { symbol: "USDINR", name: "USD/INR", category: "forex", region: "Global", currency: "INR", exchange: "Forex", marketTz: "UTC", yahoo: "INR=X" },
  { symbol: "EURUSD", name: "EUR/USD", category: "forex", region: "Global", currency: "USD", exchange: "Forex", marketTz: "UTC", yahoo: "EURUSD=X" },
  { symbol: "GBPUSD", name: "GBP/USD", category: "forex", region: "Global", currency: "USD", exchange: "Forex", marketTz: "UTC", yahoo: "GBPUSD=X" },
  { symbol: "USDJPY", name: "USD/JPY", category: "forex", region: "Global", currency: "JPY", exchange: "Forex", marketTz: "UTC", yahoo: "JPY=X" },
  { symbol: "BTC", name: "Bitcoin", category: "crypto", region: "Global", currency: "USD", exchange: "CoinGecko", marketTz: "UTC", coingecko: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", category: "crypto", region: "Global", currency: "USD", exchange: "CoinGecko", marketTz: "UTC", coingecko: "ethereum" },
];

async function fetchJson(url: string, timeoutMs = 8000): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; MarketUpdater/1.0)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function validNum(v: unknown): number | null {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : null;
}

type PriceResult = {
  price: number;
  change: number;
  changePercent: number;
  dayHigh: number | null;
  dayLow: number | null;
  prevClose: number | null;
  openPrice: number | null;
  volume: number | null;
  marketCap: number | null;
  source: string;
};

async function tryYahoo(cfg: SymbolCfg): Promise<PriceResult | null> {
  if (!cfg.yahoo) return null;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cfg.yahoo)}?interval=1d&range=1d`;
  const data = await fetchJson(url);
  if (!data?.chart?.result?.[0]) return null;
  const result = data.chart.result[0];
  const meta = result.meta;
  const price = validNum(meta.regularMarketPrice);
  if (price === null) return null;
  const prevClose = validNum(meta.chartPreviousClose) ?? validNum(meta.previousClose) ?? price;
  const change = price - prevClose;
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
  const dayHigh = validNum(meta.regularMarketDayHigh);
  const dayLow = validNum(meta.regularMarketDayLow);
  const openPrice = validNum(meta.regularMarketDayOpen) ?? validNum(result.indicators?.quote?.[0]?.open?.[0]);
  const volume = typeof meta.regularMarketVolume === "number" ? meta.regularMarketVolume : null;
  return {
    price, change, changePercent,
    dayHigh, dayLow, prevClose, openPrice,
    volume, marketCap: null, source: "Yahoo Finance",
  };
}

async function tryCoinGecko(cfg: SymbolCfg): Promise<PriceResult | null> {
  if (!cfg.coingecko) return null;
  const url = `https://api.coingecko.com/api/v3/coins/${cfg.coingecko}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;
  const data = await fetchJson(url);
  if (!data?.market_data?.current_price?.usd) return null;
  const md = data.market_data;
  const price = validNum(md.current_price.usd);
  if (price === null) return null;
  const change = validNum(md.price_change_24h) ?? 0;
  const changePercent = validNum(md.price_change_percentage_24h) ?? 0;
  const dayHigh = validNum(md.high_24h?.usd);
  const dayLow = validNum(md.low_24h?.usd);
  const prevClose = price - (change ?? 0);
  const openPrice = validNum(md.open_24h?.usd);
  const volume = validNum(md.total_volume?.usd);
  const marketCap = validNum(md.market_cap?.usd);
  return {
    price, change, changePercent,
    dayHigh, dayLow, prevClose, openPrice,
    volume, marketCap, source: "CoinGecko",
  };
}

async function fetchPrice(cfg: SymbolCfg): Promise<PriceResult | null> {
  if (cfg.coingecko) {
    return await tryCoinGecko(cfg);
  }
  return await tryYahoo(cfg);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey);

    const BATCH_SIZE = 6;
    let updated = 0;
    let failed = 0;

    for (let i = 0; i < SYMBOLS.length; i += BATCH_SIZE) {
      const batch = SYMBOLS.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(async (cfg) => {
        const result = await fetchPrice(cfg);
        return { cfg, result };
      }));

      for (const { cfg, result } of results) {
        if (result) {
          const { error } = await supabase
            .from("market_prices")
            .upsert({
              symbol: cfg.symbol,
              name: cfg.name,
              category: cfg.category,
              region: cfg.region,
              price: result.price,
              change: result.change,
              change_percent: result.changePercent,
              source: result.source,
              updated_at: new Date().toISOString(),
              available: true,
              day_high: result.dayHigh,
              day_low: result.dayLow,
              prev_close: result.prevClose,
              open_price: result.openPrice,
              volume: result.volume,
              market_cap: result.marketCap,
              currency: cfg.currency,
              exchange: cfg.exchange,
              unit: cfg.unit ?? null,
              market_timezone: cfg.marketTz,
            });
          if (error) failed++;
          else updated++;
        } else {
          await supabase
            .from("market_prices")
            .update({ updated_at: new Date().toISOString(), available: false })
            .eq("symbol", cfg.symbol);
          failed++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, updated, failed, total: SYMBOLS.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
