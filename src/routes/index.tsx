import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { listArticles } from "@/lib/articles.functions";
import { curateNow, curateNowPublic } from "@/lib/ai.functions";
import { ArticleCard } from "@/components/article-card";
import { CategoryModal } from "@/components/CategoryModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { categoryLabel } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";

const COUNTRY_LABELS: Record<string, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  CN: "China",
  JP: "Japan",
  BR: "Brazil",
  FR: "France",
  DE: "Germany",
  AE: "UAE",
  SG: "Singapore",
  ZA: "South Africa",
};

const PAGE_SIZE = 24;

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
    links: [
      { rel: "canonical", href: canonicalUrl("/") },
    ],
  }),
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

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(!!session),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const readPrefs = () => setCountry(window.localStorage.getItem("tuh-country") || "WORLD");
    readPrefs();
    window.addEventListener("tuh-preferences", readPrefs);
    return () => window.removeEventListener("tuh-preferences", readPrefs);
  }, []);

  useEffect(() => {
    setActive(search.category);
  }, [search.category]);

  const fetchPage = useCallback(async (offset: number) => {
    return listArticles({
      data: {
        limit: PAGE_SIZE,
        offset,
        category: active,
        country: country === "WORLD" ? undefined : country,
        todayOnly: true,
      },
    });
  }, [active, country]);

  const reset = useCallback(async () => {
    setLoading(true);
    setArticles([]);
    setHasMore(true);
    offsetRef.current = 0;
    isFetchingRef.current = true;
    try {
      const data = await fetchPage(0);
      setArticles(data);
      offsetRef.current = data.length;
      if (data.length < PAGE_SIZE) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoadingMore(true);
    const offset = offsetRef.current;
    try {
      const newArticles = await fetchPage(offset);
      if (newArticles.length < PAGE_SIZE) setHasMore(false);
      if (newArticles.length > 0) {
        setArticles((prev) => {
          const existingIds = new Set(prev.map((a) => a.id));
          const unique = newArticles.filter((a) => !existingIds.has(a.id));
          return [...prev, ...unique];
        });
        offsetRef.current = offset + newArticles.length;
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [fetchPage, hasMore]);

  useEffect(() => { reset(); }, [reset]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) loadMore();
      },
      { rootMargin: "800px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, loading, loadingMore, hasMore]);

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
        reset();
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

      {loading && (
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] bg-foreground/10 mb-4" />
              <div className="h-3 w-20 bg-foreground/10 mb-3" />
              <div className="h-5 w-full bg-foreground/10 mb-2" />
              <div className="h-5 w-2/3 bg-foreground/10" />
            </div>
          ))}
        </div>
      )}

      {!loading && articles.length > 0 && (
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <div
              key={article.id}
              className="animate-fade-in"
              style={{ animationDelay: `${Math.min(i % 6, 5) * 60}ms` }}
            >
              <ArticleCard article={article} variant="default" />
            </div>
          ))}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-16">
          <p className="dek">Nothing here yet — fetching live stories now.</p>
          <button
            onClick={topUp}
            disabled={generating}
            className="mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
          >
            {generating ? "Curating…" : "Curate now"}
          </button>
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!hasMore && !loading && articles.length > 0 && (
        <div className="text-center py-12">
          <p className="kicker">You've reached the end of today's edition</p>
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
