import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, TrendingUp, TrendingDown, Activity, X } from "lucide-react";
import { motion } from "framer-motion";
import { MARKET_GROUPS, MARKET_SYMBOLS } from "@/lib/markets.functions";
import { supabase } from "@/integrations/supabase/client";
import { listArticles } from "@/lib/articles.functions";
import { ArticleCard } from "@/components/article-card";
import { ArticleCardSkeletonGrid } from "@/components/ArticleCardSkeleton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";
import type { ArticleSummary } from "@/lib/types";

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
  BTC: ["markets", "technology", "artificial-intelligence"], ETH: ["markets", "technology"],
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

const NEWS_GROUPS = [
  { label: "Global Markets", categories: ["markets", "economics"] },
  { label: "India", categories: ["india", "indian-startups", "indian-innovation"] },
  { label: "US", categories: ["technology", "artificial-intelligence", "innovation"] },
  { label: "Europe", categories: ["world", "politics", "government"] },
  { label: "Asia", categories: ["world", "geopolitics"] },
  { label: "Commodities", categories: ["investing", "economics"] },
  { label: "Crypto", categories: ["technology", "artificial-intelligence"] },
  { label: "Economy", categories: ["economics", "personal-finance"] },
  { label: "Companies", categories: ["startups", "entrepreneurs", "business-leaders"] },
];

function formatPrice(price: number | null): string {
  if (price === null) return "—";
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

function formatTime(ts: string | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function Sparkline({ positive, seed }: { positive: boolean; seed: number }) {
  const color = positive ? "#22c55e" : "#ef4444";
  const points: string[] = [];
  let y = positive ? 24 : 8;
  for (let i = 0; i <= 60; i += 12) {
    const variance = ((Math.sin(i * 0.5 + seed) + 1) / 2) * 6;
    y = positive ? 24 - variance - (i / 60) * 12 : 8 + variance + (i / 60) * 12;
    points.push(`${i},${Math.max(4, Math.min(28, y))}`);
  }
  return (
    <svg width="60" height="32" viewBox="0 0 60 32" className="shrink-0" aria-hidden="true">
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

function MarketsPage() {
  const search = useSearch({ from: "/markets" });
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<any[]>([]);

  // Fetch prices from Supabase — instant, no external API calls
  useEffect(() => {
    let mounted = true;
    async function fetchPrices() {
      try {
        const { data } = await supabase
          .from("market_prices")
          .select("symbol, name, category, region, price, change, change_percent, source, available, updated_at")
          .order("symbol");
        if (mounted && data) setQuotes(data);
      } catch {
        // keep empty
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const activeAsset = search.asset;

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
      const result = await listArticles({
        data: { limit: PAGE_SIZE, offset: offsetRef.current, category: newsCategories[0] },
      });
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
        <h1 className="display-1 mt-3">Markets</h1>
        <p className="dek mt-3 max-w-2xl">Real-time data from major global indices, commodities, forex, and crypto — with financial news from around the world.</p>
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

      {/* Live price cards by group */}
      <div className="space-y-8 mb-12">
        {MARKET_GROUPS.map((group) => {
          const groupQuotes = quotes.filter((q) => group.items.some((m) => m.symbol === q.symbol));
          if (groupQuotes.length === 0) return null;
          return (
            <div key={group.label}>
              <div className="flex items-baseline justify-between border-b rule pb-2 mb-4">
                <h2 className="display-3">{group.label}</h2>
                <span className="kicker">{groupQuotes.length} instruments</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {groupQuotes.map((q, qi) => {
                  const positive = (q.change ?? 0) >= 0;
                  return (
                    <button
                      key={q.symbol}
                      onClick={() => selectAsset(q.symbol)}
                      className={`border rule p-4 text-left hover:bg-foreground/[0.03] transition ${activeAsset === q.symbol ? "ring-1 ring-foreground" : ""} focus:outline-none focus:ring-2 focus:ring-foreground/40`}
                      aria-label={`${q.name}, ${q.available ? `price ${formatPrice(q.price)}` : "data unavailable"}. Click to filter news.`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold uppercase tracking-wide">{q.name}</span>
                        {q.available && (positive ? <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" /> : <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />)}
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-serif font-medium tabular-nums">
                            {q.available ? formatPrice(q.price) : "—"}
                          </div>
                          {q.available ? (
                            <div className={`text-sm tabular-nums mt-1 ${positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                              {q.change !== null ? `${q.change >= 0 ? "+" : ""}${q.change.toFixed(2)}` : "—"}
                              {" "}
                              ({q.change_percent !== null ? `${q.change_percent >= 0 ? "+" : ""}${q.change_percent.toFixed(2)}%` : "—"})
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground mt-1">Data temporarily unavailable</div>
                          )}
                          {q.available && q.updated_at && (
                            <div className="text-[0.55rem] text-muted-foreground/50 mt-1">Updated {formatTime(q.updated_at)}</div>
                          )}
                        </div>
                        {q.available && <Sparkline positive={positive} seed={qi} />}
                      </div>
                      {q.source && <div className="text-[0.55rem] uppercase tracking-wider text-muted-foreground/50 mt-2">via {q.source}</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* News section */}
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
