import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getMarketQuotes, type MarketQuote } from "@/lib/markets.functions";

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatTime(ts: number | null): string {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
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

function MarketCard({ quote, index }: { quote: MarketQuote; index: number }) {
  const navigate = useNavigate();
  const positive = (quote.change ?? 0) >= 0;
  const colorClass = quote.available
    ? positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    : "text-muted-foreground";
  const changeText = quote.available && quote.change !== null && quote.changePercent !== null
    ? `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.change >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)`
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
        {quote.available && quote.lastUpdated && (
          <span className="text-[0.5rem] text-muted-foreground/50 tabular-nums">{formatTime(quote.lastUpdated)}</span>
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

// Static fallback so the ticker NEVER disappears even if all APIs fail
const FALLBACK_QUOTES: MarketQuote[] = [
  { symbol: "SENSEX", name: "Sensex", category: "indices", region: "India", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "NIFTY50", name: "NIFTY 50", category: "indices", region: "India", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "BANKNIFTY", name: "Bank NIFTY", category: "indices", region: "India", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "NIFTYIT", name: "NIFTY IT", category: "indices", region: "India", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "IXIC", name: "NASDAQ Composite", category: "indices", region: "US", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "SPX", name: "S&P 500", category: "indices", region: "US", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "DJI", name: "Dow Jones", category: "indices", region: "US", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "FTSE100", name: "FTSE 100", category: "indices", region: "Europe", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "DAX", name: "DAX", category: "indices", region: "Europe", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "CAC40", name: "CAC 40", category: "indices", region: "Europe", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "N225", name: "Nikkei 225", category: "indices", region: "Asia", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "HSI", name: "Hang Seng", category: "indices", region: "Asia", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "SSEC", name: "Shanghai Composite", category: "indices", region: "Asia", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "GOLD", name: "Gold", category: "commodities", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "SILVER", name: "Silver", category: "commodities", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "BRENT", name: "Brent Crude", category: "commodities", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "WTI", name: "WTI Crude", category: "commodities", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "NATGAS", name: "Natural Gas", category: "commodities", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "USDINR", name: "USD/INR", category: "forex", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "EURUSD", name: "EUR/USD", category: "forex", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "GBPUSD", name: "GBP/USD", category: "forex", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "USDJPY", name: "USD/JPY", category: "forex", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "BTC", name: "Bitcoin", category: "crypto", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
  { symbol: "ETH", name: "Ethereum", category: "crypto", region: "Global", price: null, change: null, changePercent: null, updatedAt: null, lastUpdated: null, source: null, available: false },
];

export function MarketTicker() {
  const fetchQuotes = useServerFn(getMarketQuotes);
  const query = useQuery({
    queryKey: ["market-quotes"],
    queryFn: () => fetchQuotes(),
    staleTime: 15_000,
    gcTime: 5 * 60_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    retry: 2,
    retryDelay: 5_000,
    placeholderData: (prev: any) => prev,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always have quotes to show — never let the ticker be empty
  const quotes = (query.data ?? FALLBACK_QUOTES) as MarketQuote[];
  const showSkeletons = query.isLoading && !query.data;

  // Auto-rotation every 6 seconds — scroll one "page" of cards
  useEffect(() => {
    if (paused || showSkeletons || quotes.length === 0) return;
    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = 220;
      const visibleCards = Math.max(1, Math.floor(el.clientWidth / cardWidth));
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      const currentPos = el.scrollLeft;
      // If near end, wrap to start; otherwise advance one page
      const nextPos = currentPos + visibleCards * cardWidth >= maxScroll - 10
        ? 0
        : currentPos + visibleCards * cardWidth;
      el.scrollTo({ left: nextPos, behavior: "smooth" });
    }, 6000);
    return () => clearInterval(id);
  }, [paused, showSkeletons, quotes.length]);

  // When user manually scrolls, pause auto-rotation temporarily
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
            {showSkeletons
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : quotes.map((q, i) => <MarketCard key={q.symbol} quote={q} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
