import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getMarketQuotes, type MarketQuote } from "@/lib/markets.functions";

const quotesQuery = queryOptions({
  queryKey: ["market-quotes"],
  queryFn: () => getMarketQuotes(),
  staleTime: 15_000,
  refetchInterval: 30_000,
});

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatChange(change: number | null, percent: number | null): { text: string; positive: boolean } {
  if (change === null || percent === null) return { text: "—", positive: false };
  const sign = change >= 0 ? "+" : "";
  const pct = `${sign}${percent.toFixed(2)}%`;
  const chg = `${sign}${change.toFixed(2)}`;
  return { text: `${chg} (${pct})`, positive: change >= 0 };
}

function Sparkline({ positive }: { positive: boolean }) {
  const color = positive ? "#22c55e" : "#ef4444";
  return (
    <svg width="40" height="16" viewBox="0 0 40 16" className="shrink-0" aria-hidden="true">
      <polyline
        points="0,12 8,8 16,10 24,4 32,6 40,2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarketCard({ quote }: { quote: MarketQuote }) {
  const navigate = useNavigate();
  const { text, positive } = formatChange(quote.change, quote.changePercent);
  const colorClass = quote.available ? (positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400") : "text-muted-foreground";

  function handleClick() {
    navigate({ to: "/markets", search: { asset: quote.symbol } });
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-3 px-4 py-2 border-r rule shrink-0 whitespace-nowrap hover:bg-foreground/[0.03] transition-colors text-left min-w-[200px]"
      aria-label={`${quote.name} ${quote.available ? formatPrice(quote.price) : "data unavailable"}`}
    >
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide truncate">{quote.name}</span>
        <span className="text-[0.6rem] text-muted-foreground uppercase tracking-wider">{quote.region ?? quote.category}</span>
      </div>
      <div className="flex flex-col items-end ml-auto">
        <span className="text-sm font-medium tabular-nums">
          {quote.available ? formatPrice(quote.price) : "Unavailable"}
        </span>
        <span className={`text-xs tabular-nums ${colorClass} flex items-center gap-1`}>
          {quote.available && (positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
          {quote.available ? text : "Data temporarily unavailable"}
        </span>
      </div>
      {quote.available && <Sparkline positive={positive} />}
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 px-4 py-2 border-r rule shrink-0 min-w-[200px] animate-pulse">
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

  const autoScroll = useCallback(() => {
    if (paused) return;
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    el.scrollBy({ left: 1, behavior: "auto" });
    if (el.scrollLeft >= maxScroll) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [paused]);

  useEffect(() => {
    const id = setInterval(autoScroll, 30);
    return () => clearInterval(id);
  }, [autoScroll]);

  const quotes = (query.data ?? []) as MarketQuote[];
  const showSkeletons = query.isLoading && quotes.length === 0;
  const showError = query.isError && quotes.length === 0;

  return (
    <section
      className="border-b rule bg-background overflow-hidden"
      aria-label="Live Global Markets"
    >
      <div className="container-edit">
        <div className="flex items-center gap-3 py-2">
          <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r rule">
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[0.6rem] uppercase tracking-widest font-semibold text-muted-foreground hidden sm:inline">
              Live Markets
            </span>
          </div>
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide flex-1"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{ scrollbarWidth: "none" }}
          >
            {showSkeletons
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : showError
                ? <div className="px-4 py-2 text-xs text-muted-foreground">Market data loading…</div>
                : quotes.map((q) => <MarketCard key={q.symbol} quote={q} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
