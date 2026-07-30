import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, TrendingUp, TrendingDown, Activity, X, Info } from "lucide-react";
import { motion } from "framer-motion";
import { MARKET_GROUPS, MARKET_SYMBOLS } from "@/lib/markets.functions";
import { listArticles } from "@/lib/articles.functions";
import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeletonGrid } from "@/components/ArticleCardSkeleton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";
import type { ArticleSummary } from "@/lib/types";
import {
  useMarketPrices,
  formatPrice,
  formatChange,
  formatTime,
  getMarketStatus,
  formatVolume,
  formatMarketCap,
  CURRENCY_SYMBOLS,
  type MarketPrice,
  type Currency,
} from "@/lib/market-utils";

const PAGE_SIZE = 24;

const ASSET_TO_CATEGORY: Record<string, string[]> = {
  SENSEX: ["markets", "economics", "india"], NIFTY50: ["markets", "economics", "india"],
  BANKNIFTY: ["markets", "economics", "india"], NIFTYIT: ["markets", "technology", "india"],
  IXIC: ["markets", "technology", "economics"], SPX: ["markets", "economics"],
  DJI: ["markets", "economics"], FTSE100: ["markets", "economics"],
  DAX: ["markets", "economics"], CAC40: ["markets", "economics"],
  N225: ["markets", "economics"], HSI: ["markets", "economics"],
  SSEC: ["markets", "economics"], GOLD: ["markets", "economics", "investing"],
  SILVER: ["markets", "economics", "investing"], BRENT: ["markets", "economics"],
  WTI: ["markets", "economics"], NATGAS: ["markets", "economics"],
  USDINR: ["markets", "economics"], EURUSD: ["markets", "economics"],
  GBPUSD: ["markets", "economics"], USDJPY: ["markets", "economics"],
  BTC: ["markets", "technology"], ETH: ["markets", "technology"],
};

const ASSET_TO_LABEL: Record<string, string> = {
  SENSEX: "Indian Markets", NIFTY50: "Indian Markets", BANKNIFTY: "Indian Markets", NIFTYIT: "Indian Markets",
  IXIC: "US Markets", SPX: "US Markets", DJI: "US Markets",
  FTSE100: "European Markets", DAX: "European Markets", CAC40: "European Markets",
  N225: "Asian Markets", HSI: "Asian Markets", SSEC: "Asian Markets",
  GOLD: "Commodities", SILVER: "Commodities", BRENT: "Commodities", WTI: "Commodities", NATGAS: "Commodities",
  USDINR: "Forex", EURUSD: "Forex", GBPUSD: "Forex", USDJPY: "Forex",
  BTC: "Crypto", ETH: "Crypto",
};

const CURRENCY_OPTIONS: { code: Currency; label: string; symbol: string }[] = [
  { code: "USD", label: "USD ($)", symbol: "$" },
  { code: "INR", label: "INR (₹)", symbol: "₹" },
  { code: "EUR", label: "EUR (€)", symbol: "€" },
  { code: "GBP", label: "GBP (£)", symbol: "£" },
  { code: "JPY", label: "JPY (¥)", symbol: "¥" },
];

const MARKET_STATUS_CONFIG = {
  open: { label: "Market Open", color: "bg-green-500", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
  closed: { label: "Market Closed", color: "bg-red-500", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
  pre: { label: "Pre-Market", color: "bg-yellow-500", text: "text-yellow-700 dark:text-yellow-400", dot: "bg-yellow-500" },
  after: { label: "After Hours", color: "bg-orange-500", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  always: { label: "Live 24/7", color: "bg-green-500", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
} as const;

export const Route = createFileRoute("/markets")({
  validateSearch: (s: Record<string, unknown>) => ({
    asset: typeof s.asset === "string" ? s.asset : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Markets — The United Hell" },
      { name: "description", content: "Live global market data, financial news, stocks, indices, commodities, forex, and crypto." },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Markets — The United Hell" },
      { property: "og:description", content: "Live global market data and financial news." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/markets") },
      { property: "og:image", content: SITE_LOGO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Markets — The United Hell" },
      { name: "twitter:description", content: "Live global market data and financial news." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/markets") }],
  }),
  component: MarketsPage,
});

function MarketCard({
  quote,
  currency,
  isActive,
  onClick,
}: {
  quote: MarketPrice;
  currency: Currency;
  isActive: boolean;
  onClick: () => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const status = getMarketStatus(quote.market_timezone ?? null, quote.category);
  const statusConfig = MARKET_STATUS_CONFIG[status];
  const { text: changeText, isPositive, isNeutral } = formatChange(
    quote.change, quote.change_percent, currency, quote.currency,
  );
  const changeColor = isNeutral
    ? "text-muted-foreground"
    : isPositive
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  return (
    <div
      className={`group relative border rule p-5 cursor-pointer transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-foreground/40 ${
        isActive ? "ring-1 ring-foreground bg-muted/30" : ""
      }`}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      aria-label={`${quote.name}, ${quote.available ? formatPrice(quote.price, currency, quote.currency, quote.unit) : "data unavailable"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">{quote.name}</h3>
          <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
            {quote.category === "forex" ? "Foreign Exchange" : quote.category.charAt(0).toUpperCase() + quote.category.slice(1)}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-[0.55rem] font-semibold uppercase tracking-wider ${statusConfig.text}`}>
          <span className={`inline-block w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
          {statusConfig.label}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-2xl font-serif font-medium tabular-nums">
          {quote.available
            ? formatPrice(quote.price, currency, quote.currency, quote.unit)
            : "—"}
        </div>
      </div>

      {quote.available ? (
        <div className={`text-sm tabular-nums font-medium ${changeColor}`}>
          {changeText}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground mt-1">Data temporarily unavailable</div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t rule">
        <span className="text-[0.55rem] uppercase tracking-wider text-muted-foreground">
          {quote.exchange ?? "—"}
        </span>
        {quote.available && quote.updated_at ? (
          <span className="text-[0.55rem] text-muted-foreground/70 tabular-nums">
            {formatTime(quote.updated_at, quote.market_timezone)}
          </span>
        ) : null}
      </div>

      <div className="text-[0.5rem] uppercase tracking-wider text-muted-foreground/40 mt-1">
        via {quote.source ?? "—"}
      </div>

      {showTooltip && quote.available && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 mx-2 bg-background border rule shadow-lg p-4 text-xs space-y-2 animate-in fade-in duration-150">
          <div className="flex justify-between"><span className="text-muted-foreground">Current Price</span><span className="font-medium tabular-nums">{formatPrice(quote.price, currency, quote.currency, quote.unit)}</span></div>
          {quote.open_price !== null && quote.open_price !== undefined && (
            <div className="flex justify-between"><span className="text-muted-foreground">Open</span><span className="font-medium tabular-nums">{formatPrice(quote.open_price, currency, quote.currency, quote.unit)}</span></div>
          )}
          {quote.day_high !== null && quote.day_high !== undefined && (
            <div className="flex justify-between"><span className="text-muted-foreground">Day High</span><span className="font-medium tabular-nums text-green-600 dark:text-green-400">{formatPrice(quote.day_high, currency, quote.currency, quote.unit)}</span></div>
          )}
          {quote.day_low !== null && quote.day_low !== undefined && (
            <div className="flex justify-between"><span className="text-muted-foreground">Day Low</span><span className="font-medium tabular-nums text-red-600 dark:text-red-400">{formatPrice(quote.day_low, currency, quote.currency, quote.unit)}</span></div>
          )}
          {quote.prev_close !== null && quote.prev_close !== undefined && (
            <div className="flex justify-between"><span className="text-muted-foreground">Previous Close</span><span className="font-medium tabular-nums">{formatPrice(quote.prev_close, currency, quote.currency, quote.unit)}</span></div>
          )}
          {quote.volume !== null && quote.volume !== undefined && quote.volume > 0 && (
            <div className="flex justify-between"><span className="text-muted-foreground">Volume</span><span className="font-medium tabular-nums">{formatVolume(quote.volume)}</span></div>
          )}
          {quote.market_cap !== null && quote.market_cap !== undefined && quote.market_cap > 0 && (
            <div className="flex justify-between"><span className="text-muted-foreground">Market Cap</span><span className="font-medium tabular-nums">{formatMarketCap(quote.market_cap, currency)}</span></div>
          )}
          <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span className="font-medium">{quote.currency ?? "USD"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Exchange</span><span className="font-medium">{quote.exchange ?? "—"}</span></div>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border rule p-5 animate-pulse">
      <div className="h-4 w-24 bg-foreground/10 rounded mb-3" />
      <div className="h-8 w-32 bg-foreground/10 rounded mb-2" />
      <div className="h-4 w-28 bg-foreground/10 rounded" />
      <div className="h-3 w-20 bg-foreground/10 rounded mt-3" />
    </div>
  );
}

function MarketsPage() {
  const search = useSearch({ from: "/markets" });
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem("market-currency");
      return (saved as Currency) || "USD";
    } catch {
      return "USD";
    }
  });

  useEffect(() => {
    try { localStorage.setItem("market-currency", currency); } catch { /* ignore */ }
  }, [currency]);

  const { prices, loading, lastUpdate } = useMarketPrices(15_000);
  const activeAsset = search.asset;

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const newsCategories = activeAsset && ASSET_TO_CATEGORY[activeAsset]
    ? ASSET_TO_CATEGORY[activeAsset]
    : ["markets", "economics", "investing", "technology"];

  const articlesQuery = useQuery(
    queryOptions({
      queryKey: ["markets-articles", activeAsset ?? "all"],
      queryFn: () => listArticles({ data: { limit: PAGE_SIZE, category: newsCategories[0] } }),
      staleTime: 30_000,
    }),
  );

  useEffect(() => {
    const result = articlesQuery.data as any;
    if (!result) return;
    const items = result.items ?? (Array.isArray(result) ? result : []);
    setArticles(items);
    offsetRef.current = items.length;
    setHasMore(result.hasMore ?? true);
  }, [articlesQuery.data]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoadingMore(true);
    try {
      const result = await listArticles({ data: { limit: PAGE_SIZE, offset: offsetRef.current, category: newsCategories[0] } });
      const newItems = (result as any).items ?? [];
      if (newItems.length > 0) {
        setArticles((prev) => {
          const ids = new Set(prev.map((a) => a.id));
          return [...prev, ...newItems.filter((a: ArticleSummary) => !ids.has(a.id))];
        });
        offsetRef.current += newItems.length;
      }
      setHasMore((result as any).hasMore ?? false);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, newsCategories]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && !loadingMore && hasMore) loadMore(); },
      { rootMargin: "800px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loadingMore, hasMore]);

  function selectAsset(symbol: string) {
    navigate({ to: "/markets", search: { asset: symbol } });
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.4, delay: Math.min(i % 6, 5) * 0.06 },
    }),
  };

  return (
    <div className="container-edit py-8 md:py-12">
      <header className="border-b rule pb-6 mb-8">
        <div className="kicker">Live Global Markets</div>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-3">
          <div>
            <h1 className="display-1">Markets</h1>
            <p className="dek mt-3 max-w-2xl">Real-time data from major global indices, commodities, forex, and crypto — with financial news from around the world.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Display Currency</label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="appearance-none border rule bg-background px-4 py-2.5 pr-10 text-sm font-medium cursor-pointer hover:bg-muted/30 transition focus:outline-none focus:ring-2 focus:ring-foreground/40"
                aria-label="Select display currency"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-xs">▼</span>
            </div>
          </div>
        </div>
        {lastUpdate && (
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Live</span>
            <span>·</span>
            <span>Updated {lastUpdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}</span>
            <span>·</span>
            <span>Auto-refreshes every 15 seconds</span>
          </div>
        )}
      </header>

      {activeAsset && (
        <div className="mb-6 flex items-center gap-3 border rule p-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Filtered by</span>
          <span className="font-serif text-lg font-semibold">{MARKET_SYMBOLS.find((m) => m.symbol === activeAsset)?.name ?? activeAsset}</span>
          <span className="text-xs text-muted-foreground">{ASSET_TO_LABEL[activeAsset] ?? ""}</span>
          <button
            onClick={() => navigate({ to: "/markets", search: { asset: undefined } })}
            className="ml-auto inline-flex items-center gap-1 text-xs uppercase tracking-widest border rule px-3 py-1.5 hover:bg-foreground hover:text-background transition"
            aria-label="Clear asset filter"
          >
            <X className="h-3 w-3" /> Clear filter
          </button>
        </div>
      )}

      <div className="space-y-8 mb-12">
        {MARKET_GROUPS.map((group) => {
          const groupQuotes = prices.filter((q) => group.items.some((m) => m.symbol === q.symbol));
          if (groupQuotes.length === 0 && !loading) return null;
          return (
            <div key={group.label}>
              <div className="flex items-baseline justify-between border-b rule pb-2 mb-4">
                <h2 className="display-3">{group.label}</h2>
                <span className="kicker">{groupQuotes.length || group.items.length} instruments</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading
                  ? Array.from({ length: group.items.length }).map((_, i) => <SkeletonCard key={i} />)
                  : groupQuotes.map((q) => (
                      <MarketCard
                        key={q.symbol}
                        quote={q}
                        currency={currency}
                        isActive={activeAsset === q.symbol}
                        onClick={() => selectAsset(q.symbol)}
                      />
                    ))}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && prices.length === 0 && (
        <div className="text-center py-16 border rule mb-12">
          <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="dek">Market data is being updated. Please check back shortly.</p>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5" />
        <span>Hover over any card for detailed price information. Data shown in {CURRENCY_SYMBOLS[currency]} ({currency}). Forex rates are approximate for display purposes.</span>
      </div>

      <div className="border-t rule pt-8">
        <div className="flex items-baseline justify-between border-b rule pb-3 mb-8">
          <h2 className="display-3">Market News</h2>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="kicker">{activeAsset ? `Filtered: ${MARKET_SYMBOLS.find((m) => m.symbol === activeAsset)?.name ?? activeAsset}` : "All market news"}</span>
          </div>
        </div>

        {articles.length > 0 && (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <motion.div key={article.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                <ArticleCard article={article} variant="default" />
              </motion.div>
            ))}
          </div>
        )}

        {articles.length === 0 && !articlesQuery.isLoading && !articlesQuery.isError && (
          <p className="dek text-center py-12">No market news found right now.</p>
        )}

        {articlesQuery.isLoading && articles.length === 0 && <ArticleCardSkeletonGrid count={6} />}

        {articlesQuery.isError && (
          <p className="dek text-center py-12">Could not load news. {(articlesQuery.error as Error)?.message}</p>
        )}

        <div ref={sentinelRef} className="h-1" />
        {loadingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}
