import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { listArticles } from "@/lib/articles.functions";
import { curateNow, curateNowPublic } from "@/lib/ai.functions";
import { ArticleCard } from "@/components/article-card";
import { CategoryModal } from "@/components/CategoryModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { categoryLabel } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";
import type { ArticleSummary } from "@/lib/types";

const homeQuery = (category: string | undefined, country: string | undefined) =>
  queryOptions({
    queryKey: ["home", category ?? "all", country ?? "world"],
    queryFn: () => listArticles({ data: { limit: 24, category, country, todayOnly: true } }),
    staleTime: 30_000,
  });

const COUNTRY_LABELS: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", CA: "Canada",
  AU: "Australia", CN: "China", JP: "Japan", BR: "Brazil", FR: "France",
  DE: "Germany", AE: "UAE", SG: "Singapore", ZA: "South Africa",
};

const PAGE_SIZE = 24;

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: Math.min(i % 6, 5) * 0.06, ease: [0.2, 0.7, 0.2, 1] as const },
  }),
};

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>) => ({
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "The United Hell — Today" },
      { name: "description", content: "The Discovery Engine — explore beyond what you came for." },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "The United Hell — Today" },
      { property: "og:description", content: "The Discovery Engine — explore beyond what you came for." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/") },
      { property: "og:image", content: SITE_LOGO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The United Hell — Today" },
      { name: "twitter:description", content: "The Discovery Engine — explore beyond what you came for." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/") }],
  }),
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(homeQuery(undefined, undefined));
  },
  component: Home,
  errorComponent: ({ error }) => (
    <div className="container-edit py-20 text-center">
      <p className="dek">We couldn't load the front page. {error.message}</p>
    </div>
  ),
  notFoundComponent: () => null,
});

function Home() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate();
  const [active, setActive] = useState<string | undefined>(search.category);
  const [showModal, setShowModal] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [country, setCountry] = useState<string>("WORLD");
  const ingestAuth = useServerFn(curateNow);
  const ingestPublic = useServerFn(curateNowPublic);

  // Single unified list — no split between "base" and "extra"
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const cursorRef = useRef<string | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const articlesQuery = useQuery(homeQuery(active, country === "WORLD" ? undefined : country));

  // When the base query resolves, seed the articles list from it
  useEffect(() => {
    const result = articlesQuery.data;
    if (!result) return;
    const items = (result as any).items ?? (Array.isArray(result) ? result : []);
    if (items.length === 0) {
      setArticles([]);
      setHasMore(false);
      cursorRef.current = undefined;
      return;
    }
    // Only seed if this is a fresh query (different articles than what we have)
    const currentIds = new Set(articles.map((a) => a.id));
    const newIds = items.map((a: ArticleSummary) => a.id);
    const isSamePage = newIds.length > 0 && newIds.every((id: string) => currentIds.has(id));
    if (!isSamePage) {
      setArticles(items);
      cursorRef.current = (result as any).nextCursor;
      setHasMore((result as any).hasMore ?? false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articlesQuery.data]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const readPrefs = () => setCountry(window.localStorage.getItem("tuh-country") || "WORLD");
    readPrefs();
    window.addEventListener("tuh-preferences", readPrefs);
    return () => window.removeEventListener("tuh-preferences", readPrefs);
  }, []);

  useEffect(() => { setActive(search.category); }, [search.category]);

  // Reset everything when filters change
  useEffect(() => {
    setArticles([]);
    setHasMore(true);
    cursorRef.current = undefined;
  }, [active, country]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoadingMore(true);
    try {
      const result = await listArticles({
        data: {
          limit: PAGE_SIZE,
          cursor: cursorRef.current,
          category: active,
          country: country === "WORLD" ? undefined : country,
          todayOnly: true,
        },
      });
      const newItems = (result as any).items ?? [];
      const newHasMore = (result as any).hasMore ?? false;

      if (newItems.length > 0) {
        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const unique = newItems.filter((a: ArticleSummary) => !existingIds.has(a.id));
          return [...prev, ...unique];
        });
        cursorRef.current = (result as any).nextCursor;
      }
      if (!newHasMore || newItems.length === 0) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore, active, country]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) loadMore();
      },
      { rootMargin: "800px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loadingMore, hasMore]);

  async function topUp() {
    setGenerating(true);
    try {
      let result: { inserted: number };
      if (signedIn) {
        result = await ingestAuth({ data: { maxItems: 60, category: active } });
      } else {
        result = await ingestPublic({ data: { maxItems: 12, category: active } });
      }
      if (result.inserted > 0) {
        toast.success(`${result.inserted} new stories added`);
        setArticles([]);
        setHasMore(true);
        cursorRef.current = undefined;
        articlesQuery.refetch();
      } else {
        toast.message("No new stories found right now — try again in a few minutes");
      }
    } catch (error) {
      toast.error("Could not curate stories: " + (error as Error).message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="container-edit py-6 md:py-8">
      {country !== "WORLD" && (
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => {
              setActive(undefined);
              navigate({ to: "/", search: { category: undefined } });
            }}
            className={`border rule px-4 py-2 text-xs uppercase tracking-widest ${!active ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`}
          >
            {COUNTRY_LABELS[country] ?? country} news
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b rule pb-3 mb-8">
        <div className="kicker">
          {active
            ? categoryLabel(active)
            : country === "WORLD"
              ? "Latest from all sections"
              : `Latest from ${COUNTRY_LABELS[country] ?? country}`}
        </div>
        <button
          onClick={topUp}
          disabled={generating}
          className="inline-flex items-center gap-2 border border-foreground px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
        >
          <Sparkles className="h-3.5 w-3.5" /> {generating ? "Curating…" : "Curate more"}
        </button>
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
        <div className="text-center py-16">
          <p className="dek">No stories found. Try curating fresh content below.</p>
          <button
            onClick={topUp}
            disabled={generating}
            className="mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
          >
            {generating ? "Curating…" : "Curate now"}
          </button>
        </div>
      )}

      {articlesQuery.isError && (
        <div className="text-center py-16">
          <p className="dek">We couldn't load stories right now. {(articlesQuery.error as Error)?.message}</p>
          <button
            onClick={() => articlesQuery.refetch()}
            className="mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition"
          >
            Try again
          </button>
        </div>
      )}

      {articlesQuery.isLoading && (
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] w-full bg-foreground/10" />
              <div className="mt-4 h-4 w-1/3 bg-foreground/10" />
              <div className="mt-3 h-6 w-full bg-foreground/10" />
              <div className="mt-2 h-4 w-2/3 bg-foreground/10" />
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasMore && articles.length > 0 && (
        <div className="text-center py-12">
          <p className="kicker">You've reached the end of today's news</p>
        </div>
      )}

      <div className="mt-16 text-center">
        <Link to="/map" className="kicker hover:opacity-60">
          Or explore by country →
        </Link>
      </div>

      <CategoryModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <ScrollToTop />
    </div>
  );
}
