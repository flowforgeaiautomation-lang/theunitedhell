import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const API_KEYS = {
  finnhub: "d9kccs1r01qq9sqfu130d9kccs1r01qq9sqfu13g",
  polygon: "z9rRBTzme1CqLQbvwmQQcUCI7mesEp3b",
  twelvedata: "35cc7540b81e4d13932cfb931dba4ec1",
  alphavantage: "UCL7D9WS75IGTMQM",
};

// Each symbol maps to ETF proxies that actually work on free API tiers.
// Finnhub free tier: stocks/ETFs only, no CFD indices, no forex.
// Polygon free tier: stocks/ETFs/crypto/forex but 5 req/min.
// Strategy: Finnhub first (fast, 60 req/min), Polygon for forex.
type SymbolCfg = {
  symbol: string;
  name: string;
  category: string;
  region: string;
  finnhub?: string;
  polygon?: string;
};

const SYMBOLS: SymbolCfg[] = [
  // India — use country ETFs as proxies
  { symbol: "SENSEX", name: "Sensex", category: "indices", region: "India", finnhub: "INDA" },
  { symbol: "NIFTY50", name: "NIFTY 50", category: "indices", region: "India", finnhub: "INDY" },
  { symbol: "BANKNIFTY", name: "Bank NIFTY", category: "indices", region: "India", finnhub: "PIN" },
  { symbol: "NIFTYIT", name: "NIFTY IT", category: "indices", region: "India", finnhub: "SMIN" },
  // US — ETF proxies for the major indices
  { symbol: "IXIC", name: "NASDAQ", category: "indices", region: "US", finnhub: "QQQ" },
  { symbol: "SPX", name: "S&P 500", category: "indices", region: "US", finnhub: "SPY" },
  { symbol: "DJI", name: "Dow Jones", category: "indices", region: "US", finnhub: "DIA" },
  // Europe — country ETF proxies
  { symbol: "FTSE100", name: "FTSE 100", category: "indices", region: "Europe", finnhub: "EWU" },
  { symbol: "DAX", name: "DAX", category: "indices", region: "Europe", finnhub: "EWG" },
  { symbol: "CAC40", name: "CAC 40", category: "indices", region: "Europe", finnhub: "EWQ" },
  // Asia — country ETF proxies
  { symbol: "N225", name: "Nikkei 225", category: "indices", region: "Asia", finnhub: "EWJ" },
  { symbol: "HSI", name: "Hang Seng", category: "indices", region: "Asia", finnhub: "EWH" },
  { symbol: "SSEC", name: "Shanghai", category: "indices", region: "Asia", finnhub: "FXI" },
  // Commodities — ETF proxies
  { symbol: "GOLD", name: "Gold", category: "commodities", region: "Global", finnhub: "GLD" },
  { symbol: "SILVER", name: "Silver", category: "commodities", region: "Global", finnhub: "SLV" },
  { symbol: "BRENT", name: "Brent Crude", category: "commodities", region: "Global", finnhub: "BNO" },
  { symbol: "WTI", name: "WTI Crude", category: "commodities", region: "Global", finnhub: "USO" },
  { symbol: "NATGAS", name: "Natural Gas", category: "commodities", region: "Global", finnhub: "UNG" },
  // Forex — Polygon (Finnhub free tier doesn't support forex)
  { symbol: "USDINR", name: "USD/INR", category: "forex", region: "Global", polygon: "C:USDINR" },
  { symbol: "EURUSD", name: "EUR/USD", category: "forex", region: "Global", polygon: "C:EURUSD" },
  { symbol: "GBPUSD", name: "GBP/USD", category: "forex", region: "Global", polygon: "C:GBPUSD" },
  { symbol: "USDJPY", name: "USD/JPY", category: "forex", region: "Global", polygon: "C:USDJPY" },
  // Crypto — Finnhub works for BINANCE pairs
  { symbol: "BTC", name: "Bitcoin", category: "crypto", region: "Global", finnhub: "BINANCE:BTCUSDT", polygon: "X:BTCUSD" },
  { symbol: "ETH", name: "Ethereum", category: "crypto", region: "Global", finnhub: "BINANCE:ETHUSDT", polygon: "X:ETHUSD" },
];

async function fetchJson(url: string, timeoutMs = 5000): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
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

type PriceResult = { price: number; change: number; changePercent: number; source: string };

async function tryFinnhub(cfg: SymbolCfg): Promise<PriceResult | null> {
  if (!cfg.finnhub) return null;
  const data = await fetchJson(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cfg.finnhub)}&token=${API_KEYS.finnhub}`);
  if (!data || !data.c || data.c === 0) return null;
  const price = validNum(data.c);
  if (price === null) return null;
  const prevClose = validNum(data.pc) ?? price;
  const change = validNum(data.d) ?? (price - prevClose);
  const changePercent = validNum(data.dp) ?? (prevClose > 0 ? (change / prevClose) * 100 : 0);
  return { price, change, changePercent, source: "Finnhub" };
}

async function tryPolygon(cfg: SymbolCfg): Promise<PriceResult | null> {
  if (!cfg.polygon) return null;
  const data = await fetchJson(`https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(cfg.polygon)}/prev?adjusted=true&apiKey=${API_KEYS.polygon}`);
  if (!data || !data.results || data.results.length === 0) return null;
  const r = data.results[0];
  const price = validNum(r.c);
  if (price === null) return null;
  const prevClose = validNum(r.o) ?? price;
  const change = price - prevClose;
  const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
  return { price, change, changePercent, source: "Polygon" };
}

const PROVIDERS = [tryFinnhub, tryPolygon];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey);

    // Process in batches to stay within rate limits
    const BATCH_SIZE = 8;
    let updated = 0;
    let failed = 0;

    for (let i = 0; i < SYMBOLS.length; i += BATCH_SIZE) {
      const batch = SYMBOLS.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(batch.map(async (cfg) => {
        for (const provider of PROVIDERS) {
          const result = await provider(cfg);
          if (result) return { cfg, result };
        }
        return { cfg, result: null };
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
