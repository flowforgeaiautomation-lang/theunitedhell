import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { listArticles, searchArticles } from "@/lib/articles.functions";
import { searchEditions } from "@/lib/editions-data";
import { searchMarkets, MARKET_SYMBOLS } from "@/lib/markets.functions";
import { ArticleCard } from "@/components/article-card";
import { Search as SearchIcon, SlidersHorizontal, X, BookOpen, TrendingUp, TrendingDown } from "lucide-react";
import { ArticleCardSkeletonGrid } from "@/components/ArticleCardSkeleton";
import { categoryLabel, CATEGORIES } from "@/lib/categories";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";

const COUNTRY_LABELS: Record<string, string> = {
  IN: "India", US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia",
  CN: "China", JP: "Japan", BR: "Brazil", FR: "France", DE: "Germany", AE: "UAE",
  SG: "Singapore", ZA: "South Africa",
};

type SortMode = "recent" | "trending" | "most_read" | "most_saved";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s.q === "string" ? s.q : "",
  }),
  loader: async ({ context }) => {
    try {
      await context.queryClient.prefetchQuery(
        queryOptions({
          queryKey: ["search", "", undefined, undefined, "recent"],
          queryFn: async () => (await listArticles({ data: { limit: 36 } })).items,
        }),
      );
    } catch {}
  },
  head: () => ({
    meta: [
      { title: "Search — The United Hell" },
      { name: "description", content: "Search across topics, places, people, and discoveries." },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Search — The United Hell" },
      { property: "og:description", content: "Search across topics, places, people, and discoveries." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/search") },
      { property: "og:image", content: SITE_LOGO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Search — The United Hell" },
      { name: "twitter:description", content: "Search across topics, places, people, and discoveries." },
    ],
    links: [
      { rel: "canonical", href: canonicalUrl("/search") },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const initial = Route.useSearch().q ?? "";
  const [q, setQ] = useState(initial);
  const [submitted, setSubmitted] = useState(initial);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<SortMode>("recent");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQ(initial);
    setSubmitted(initial);
  }, [initial]);

  const searchFn = useServerFn(searchArticles);
  const listFn = useServerFn(listArticles);

  const isSearching = !!submitted.trim();
  const query = useQuery(
    queryOptions({
      queryKey: ["search", submitted, category, country, sort],
      queryFn: async () => {
        if (isSearching) {
          return searchFn({ data: { q: submitted } });
        }
        const result = await listFn({
          data: {
            limit: 36,
            category,
            country,
            sort,
          },
        });
        return result.items;
      },
    }),
  );

  const results = (query.data ?? []) as any[];
  const filtered = category && !isSearching ? results : results;
  const displayed = isSearching
    ? (category ? results.filter((a) => a.category === category) : results)
    : results;
  const editionResults = isSearching ? searchEditions(submitted) : [];
  const marketResults = isSearching && submitted.length >= 2
    ? MARKET_SYMBOLS.filter((m) =>
        m.name.toLowerCase().includes(submitted.toLowerCase()) ||
        m.symbol.toLowerCase().includes(submitted.toLowerCase()) ||
        (m.region ?? "").toLowerCase().includes(submitted.toLowerCase()) ||
        (m.category ?? "").toLowerCase().includes(submitted.toLowerCase()),
      )
    : [];

  function reset() {
    setCategory(undefined);
    setCountry(undefined);
    setSort("recent");
  }

  return (
    <div className="container-read py-10 md:py-16">
      <div className="text-center border-b rule pb-10 mb-10">
        <div className="kicker">Search the archive</div>
        <h1 className="display-1 mt-3">Find a story.</h1>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(q.trim()); }}
        className="relative"
      >
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Topics, people, places, technologies…"
          className="w-full bg-transparent border-b-2 border-foreground pl-10 pr-4 py-4 text-xl font-serif focus:outline-none"
        />
      </form>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        {(category || country || sort !== "recent") && (
          <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-4 border rule p-5 rounded-lg space-y-5">
          <div>
            <div className="kicker mb-3">Topic</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory(undefined)}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${!category ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
              >
                All
              </button>
              {CATEGORIES.filter((c) => c.slug !== "all").map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${category === c.slug ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="kicker mb-3">Country</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCountry(undefined)}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${!country ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
              >
                All
              </button>
              {Object.entries(COUNTRY_LABELS).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setCountry(code)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${country === code ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="kicker mb-3">Sort by</div>
            <div className="flex flex-wrap gap-2">
              {([
                { id: "recent", label: "Most Recent" },
                { id: "trending", label: "Trending" },
                { id: "most_read", label: "Most Read" },
                { id: "most_saved", label: "Most Saved" },
              ] as { id: SortMode; label: string }[]).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${sort === s.id ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(submitted || category || country) && (
        <div className="mt-10">
          <div className="kicker mb-6">
            {submitted ? `Results for "${submitted}"` : category ? categoryLabel(category) : "All stories"}
            {displayed.length > 0 && <span className="ml-2 text-muted-foreground/60">({displayed.length})</span>}
          </div>
          {query.isLoading && <ArticleCardSkeletonGrid count={4} />}
          {query.data && displayed.length === 0 && editionResults.length === 0 && marketResults.length === 0 && <p className="dek">No matches. Try different keywords or filters.</p>}
          {marketResults.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Markets & Instruments</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {marketResults.map((m) => (
                  <Link
                    key={m.symbol}
                    to="/markets"
                    search={{ asset: m.symbol }}
                    className="group border rule p-4 hover:bg-foreground/5 transition focus:outline-none focus:ring-2 focus:ring-foreground/40"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold uppercase tracking-wide group-hover:text-foreground transition">{m.name}</span>
                      <span className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">{m.region ?? m.category}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{m.category ?? m.region}</div>
                    <div className="text-[0.6rem] text-muted-foreground/60 mt-2 uppercase tracking-widest">View market news →</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {editionResults.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4 text-[#E6C17D]" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Editions</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {editionResults.map((b) => (
                  <Link key={b.slug} to="/editions/$slug" params={{ slug: b.slug }} className="group flex gap-3 p-4 border rule hover:bg-foreground/5 transition">
                    <img src={b.coverImage} alt={b.title} className="w-12 h-18 object-cover rounded-sm" loading="lazy" />
                    <div>
                      <div className="font-serif text-sm font-bold group-hover:text-[#E6C17D] transition">{b.title}</div>
                      <div className="text-xs text-muted-foreground">{b.subtitle}</div>
                      <div className="text-[0.6rem] uppercase tracking-widest text-muted-foreground/60 mt-1">{b.readingTime} · {b.language}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-10 sm:grid-cols-2">
            {displayed.map((a) => (
              <ArticleCard key={a.id} article={a} variant="default" />
            ))}
          </div>
        </div>
      )}

      {!submitted && !category && !country && (
        <div className="mt-10">
          <div className="kicker mb-6">Trending now</div>
          {query.isLoading && <ArticleCardSkeletonGrid count={4} />}
          <div className="grid gap-10 sm:grid-cols-2">
            {displayed.slice(0, 6).map((a) => (
              <ArticleCard key={a.id} article={a} variant="default" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
