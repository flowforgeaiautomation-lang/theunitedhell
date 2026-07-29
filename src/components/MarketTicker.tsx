import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getMarketQuotes, type MarketQuote } from "@/lib/markets.functions";

const quotesQuery = queryOptions({
  queryKey: ["market-quotes"],
  queryFn: () => getMarketQuotes(),
  staleTime: 10_000,
  refetchInterval: (query: any) => {
    const data = query?.state?.data as MarketQuote[] | undefined;
    if (!data || data.length === 0) return 15_000;
    const now = Date.now();
    const anyUpdatedRecently = data.some((q) => q.lastUpdated && (now - q.lastUpdated) < 60_000);
    return anyUpdatedRecently ? 20_000 : 60_000;
  },
  refetchIntervalInBackground: false,
});

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatTime(ts: number | null): string {
  if (!ts) return "";
  const d = new Date(ts);
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

export function MarketTicker() {
  const fetchQuotes = useServerFn(getMarketQuotes);
  const query = useQuery({
    ...quotesQuery,
    queryFn: () => fetchQuotes(),
    retry: 1,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [page, setPage] = useState(0);

  const quotes = (query.data ?? []) as MarketQuote[];
  const showSkeletons = query.isLoading && quotes.length === 0;
  const showError = query.isError && quotes.length === 0;

  // Page-based auto-rotation every 6 seconds
  useEffect(() => {
    if (paused || showSkeletons || showError || quotes.length === 0) return;
    const id = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const cardWidth = 220;
      const visibleCards = Math.floor(el.clientWidth / cardWidth);
      const maxPage = Math.ceil(quotes.length / Math.max(1, visibleCards));
      setPage((p) => {
        const next = (p + 1) % maxPage;
        el.scrollTo({ left: next * visibleCards * cardWidth, behavior: "smooth" });
        return next;
      });
    }, 6000);
    return () => clearInterval(id);
  }, [paused, showSkeletons, showError, quotes.length]);

  const resetPage = useCallback(() => {
    setPage(0);
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0, behavior: "smooth" });
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
            onScroll={resetPage}
            style={{ scrollbarWidth: "none" }}
            role="marquee"
            aria-live="polite"
          >
            {showSkeletons
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : showError
                ? <div className="px-4 py-2 text-xs text-muted-foreground">Market data loading…</div>
                : quotes.map((q, i) => <MarketCard key={q.symbol} quote={q} index={i} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
