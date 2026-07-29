import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

type MarketPrice = {
  symbol: string;
  name: string;
  category: string;
  region: string | null;
  price: number | null;
  change: number | null;
  change_percent: number | null;
  source: string | null;
  available: boolean;
  updated_at: string;
};

// Hardcoded fallback — always visible, never disappears
const FALLBACK: MarketPrice[] = [
  { symbol: "SENSEX", name: "Sensex", category: "indices", region: "India", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "NIFTY50", name: "NIFTY 50", category: "indices", region: "India", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "BANKNIFTY", name: "Bank NIFTY", category: "indices", region: "India", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "NIFTYIT", name: "NIFTY IT", category: "indices", region: "India", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "IXIC", name: "NASDAQ", category: "indices", region: "US", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "SPX", name: "S&P 500", category: "indices", region: "US", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "DJI", name: "Dow Jones", category: "indices", region: "US", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "FTSE100", name: "FTSE 100", category: "indices", region: "Europe", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "DAX", name: "DAX", category: "indices", region: "Europe", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "CAC40", name: "CAC 40", category: "indices", region: "Europe", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "N225", name: "Nikkei 225", category: "indices", region: "Asia", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "HSI", name: "Hang Seng", category: "indices", region: "Asia", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "SSEC", name: "Shanghai", category: "indices", region: "Asia", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "GOLD", name: "Gold", category: "commodities", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "SILVER", name: "Silver", category: "commodities", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "BRENT", name: "Brent Crude", category: "commodities", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "WTI", name: "WTI Crude", category: "commodities", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "NATGAS", name: "Natural Gas", category: "commodities", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "USDINR", name: "USD/INR", category: "forex", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "EURUSD", name: "EUR/USD", category: "forex", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "GBPUSD", name: "GBP/USD", category: "forex", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "USDJPY", name: "USD/JPY", category: "forex", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "BTC", name: "Bitcoin", category: "crypto", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
  { symbol: "ETH", name: "Ethereum", category: "crypto", region: "Global", price: null, change: null, change_percent: null, source: null, available: false, updated_at: "" },
];

const SUPABASE_URL = "https://myrteqlcfwckgdokzzhg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnRlcWxjZndja2dkb2t6emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjE4OTgsImV4cCI6MjA5ODI5Nzg5OH0.lGAyAxmYrJAag1yONChoqV4-A1QQAkdWKxZp5IMJyII";

// Direct fetch to Supabase REST API — works in both SSR and client, no client singleton
async function fetchPrices(): Promise<MarketPrice[] | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/market_prices?select=symbol,name,category,region,price,change,change_percent,source,available,updated_at&order=symbol.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data as MarketPrice[];
  } catch {
    return null;
  }
}

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatTime(ts: string): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function Sparkline({ positive, seed }: { positive: boolean; seed: number }) {
  const color = positive ? "#22c55e" : "#ef4444";
  const points = useMemo(() => {
    const pts: string[] = [];
    let y = positive ? 12 : 4;
    for (let i = 0; i <= 40; i += 8) {
      const variance = ((Math.sin(i * 0.5 + seed) + 1) / 2) * 4;
      y = positive ? 12 - variance - (i / 40) * 6 : 4 + variance + (i / 40) * 6;
      pts.push(`${i},${Math.max(2, Math.min(14, y))}`);
    }
    return pts.join(" ");
  }, [positive, seed]);
  return (
    <svg width="40" height="16" viewBox="0 0 40 16" className="shrink-0" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MarketCard({ quote, index }: { quote: MarketPrice; index: number }) {
  const navigate = useNavigate();
  const positive = (quote.change ?? 0) >= 0;
  const colorClass = quote.available
    ? positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    : "text-muted-foreground";
  const changeText = quote.available && quote.change !== null && quote.change_percent !== null
    ? `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.change >= 0 ? "+" : ""}${quote.change_percent.toFixed(2)}%)`
    : null;

  function handleClick() {
    navigate({ to: "/markets", search: { asset: quote.symbol } });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="flex items-center gap-3 px-4 py-2 border-r rule shrink-0 whitespace-nowrap hover:bg-foreground/[0.03] transition-colors text-left min-w-[220px] focus:outline-none focus:ring-2 focus:ring-foreground/40"
      aria-label={`${quote.name}, ${quote.available ? `price ${formatPrice(quote.price)}, ${changeText ?? "no change data"}` : "data temporarily unavailable"}. Click to view ${quote.name} market news.`}
      tabIndex={0}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wide truncate">{quote.name}</span>
        <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wider">{quote.region ?? quote.category}</span>
      </div>
      <div className="flex flex-col items-end ml-auto">
        <span className="text-sm font-medium tabular-nums">
          {quote.available ? formatPrice(quote.price) : "Unavailable"}
        </span>
        <span className={`text-xs tabular-nums ${colorClass} flex items-center gap-1`}>
          {quote.available && (positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
          {quote.available && changeText ? changeText : "Data temporarily unavailable"}
        </span>
        {quote.available && quote.updated_at && (
          <span className="text-[0.5rem] text-muted-foreground/50 tabular-nums">{formatTime(quote.updated_at)}</span>
        )}
      </div>
      {quote.available && <Sparkline positive={positive} seed={index} />}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-r rule shrink-0 min-w-[220px] animate-pulse">
      <div className="h-3 w-16 bg-foreground/10 rounded" />
      <div className="h-3 w-20 bg-foreground/10 rounded ml-auto" />
    </div>
  );
}

export function MarketTicker() {
  // Start with fallback immediately — ticker is ALWAYS visible, no blank state
  const [quotes, setQuotes] = useState<MarketPrice[]>(FALLBACK);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await fetchPrices();
      if (mounted && data && data.length > 0) {
        setQuotes(data);
        setLoaded(true);
      } else if (mounted) {
        setLoaded(true);
      }
    }

    load();
    const interval = setInterval(load, 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Auto-rotation every 6 seconds
  useEffect(() => {
    if (paused || quotes.length === 0) return;
    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = 220;
      const visibleCards = Math.max(1, Math.floor(el.clientWidth / cardWidth));
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const currentPos = el.scrollLeft;
      const nextPos = currentPos + visibleCards * cardWidth >= maxScroll - 10
        ? 0
        : currentPos + visibleCards * cardWidth;
      el.scrollTo({ left: nextPos, behavior: "smooth" });
    }, 6000);
    return () => clearInterval(id);
  }, [paused, quotes.length]);

  function handleManualScroll() {
    setPaused(true);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => setPaused(false), 10_000);
  }

  useEffect(() => {
    return () => { if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current); };
  }, []);

  return (
    <section
      className="border-b rule bg-background overflow-hidden"
      aria-label="Live Global Markets"
      role="region"
    >
      <div className="container-edit">
        <div className="flex items-center gap-3 py-2">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r rule" aria-hidden="true">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[0.6rem] uppercase tracking-widest font-semibold text-muted-foreground hidden sm:inline">
              Live Markets
            </span>
          </div>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide flex-1 scroll-smooth"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onScroll={handleManualScroll}
            style={{ scrollbarWidth: "none" }}
            role="marquee"
            aria-live="polite"
          >
            {!loaded
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : quotes.map((q, i) => <MarketCard key={q.symbol} quote={q} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
