import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import {
  Newspaper, Clock, TrendingUp, TrendingDown, Sun, Moon, Type,
  ArrowRight, Quote, CalendarDays, Camera, BarChart3,
  Globe, Sparkles,
} from "lucide-react";
import { getEpaperData, type EpaperData, type EpaperSection } from "@/lib/epaper.functions";
import { ArticleCard } from "@/components/article-card";
import { ScrollToTop } from "@/components/ScrollToTop";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";
import { fallbackCoverUrl } from "@/lib/article-images";
import { SmartImage } from "@/components/SmartImage";
import type { ArticleSummary } from "@/lib/types";
import { formatPrice, formatChange, CURRENCY_SYMBOLS, type Currency } from "@/lib/market-utils";

const epaperQ = queryOptions({ queryKey: ["epaper"], queryFn: () => getEpaperData() });

export const Route = createFileRoute("/editions/epaper")({
  head: () => ({
    meta: [
      { title: "The Daily Discovery Edition — The United Hell" },
      { name: "description", content: "Beyond Headlines. Beyond Discovery. Your daily digital newspaper — the world's most important stories, science, innovation, and knowledge in one premium edition." },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "The Daily Discovery Edition — The United Hell" },
      { property: "og:description", content: "Beyond Headlines. Beyond Discovery. Your daily digital newspaper." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/editions/epaper") },
      { property: "og:image", content: SITE_LOGO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Daily Discovery Edition — The United Hell" },
      { name: "twitter:description", content: "Beyond Headlines. Beyond Discovery." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/editions/epaper") }],
  }),
  component: EpaperPage,
  errorComponent: ({ error }) => (
    <div className="container-read py-20">
      <p className="dek text-center">Could not load today's edition: {error.message}</p>
    </div>
  ),
  notFoundComponent: () => null,
});

function EpaperPage() {
  const { data: epaper } = useSuspenseQuery(epaperQ);
  const [fontSize, setFontSize] = useState<number>(1);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("front");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [darkMode]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  function scrollToSection(id: string) {
    setActiveSection(id);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const navItems = [{ id: "front", label: "Front Page" }, ...epaper.sections.map((s) => ({ id: s.id, label: s.label }))];

  return (
    <div className="bg-background text-foreground min-h-screen" style={{ fontSize: `${fontSize}rem` }}>
      <ScrollToTop />

      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Premium Masthead */}
      <Masthead dateDisplay={epaper.dateDisplay} totalArticles={epaper.totalArticles} />

      {/* Sticky section nav */}
      <SectionNav items={navItems} active={activeSection} onSelect={scrollToSection} />

      {/* Toolbar */}
      <div className="border-b rule sticky top-[48px] z-30 bg-background/95 backdrop-blur-sm">
        <div className="container-edit flex items-center justify-between py-2 gap-4">
          <span className="kicker hidden sm:inline">The Daily Discovery Edition</span>
          <div className="flex items-center gap-3 ml-auto">
            <button onClick={() => setFontSize((f) => Math.max(0.9, f - 0.05))} className="p-1.5 hover:bg-muted rounded-sm transition" aria-label="Decrease font size">
              <Type className="h-4 w-4" /><span className="sr-only">Smaller</span>
            </button>
            <button onClick={() => setFontSize((f) => Math.min(1.3, f + 0.05))} className="p-1.5 hover:bg-muted rounded-sm transition" aria-label="Increase font size">
              <Type className="h-5 w-5" /><span className="sr-only">Larger</span>
            </button>
            <div className="w-px h-5 bg-border" />
            <button onClick={() => setDarkMode((d) => !d)} className="p-1.5 hover:bg-muted rounded-sm transition" aria-label="Toggle dark mode">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* FRONT PAGE */}
      <section ref={(el) => { sectionRefs.current["front"] = el; }} id="front" className="container-edit py-8 md:py-12">
        {/* The Big Picture — Hero */}
        {epaper.topStories[0] && (
          <div className="border-b rule pb-10 mb-10">
            <div className="kicker mb-4 flex items-center gap-2">
              <Globe className="h-3.5 w-3.5" /> The Big Picture — What humanity needs to know today
            </div>
            <BigHero article={epaper.topStories[0]} />
          </div>
        )}

        {/* Top 10 Stories */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between border-b rule pb-3 mb-6">
            <h2 className="display-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> Today's Top 10
            </h2>
            <span className="kicker">{epaper.topStories.length} stories</span>
          </div>
          <ol className="grid gap-x-8 gap-y-4 md:grid-cols-2">
            {epaper.topStories.slice(0, 10).map((article, i) => (
              <li key={article.id} className="flex gap-4 border-b rule pb-4">
                <span className="font-serif text-2xl text-muted-foreground tabular-nums leading-none w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link to="/article/$slug" params={{ slug: article.slug }} className="font-serif text-base md:text-lg leading-snug hover:underline underline-offset-4 decoration-1">
                  {article.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {/* Editor's Picks */}
        {epaper.editorsPicks.length > 0 && (
          <div className="mb-10">
            <div className="flex items-baseline justify-between border-b rule pb-3 mb-6">
              <h2 className="display-3">Editor's Picks</h2>
              <span className="kicker">Curated</span>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {epaper.editorsPicks.map((article, i) => (
                <div key={article.id} className="animate-card-reveal" style={{ animationDelay: `${i * 80}ms` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* DAILY WIDGETS */}
      <DailyWidgets epaper={epaper} />

      {/* SECTION PAGES */}
      {epaper.sections.map((section, idx) => (
        <SectionPage key={section.id} section={section} index={idx} refMap={sectionRefs} />
      ))}

      {/* FOOTER */}
      <footer className="border-t-2 rule mt-16 py-12">
        <div className="container-edit text-center">
          <img src={SITE_LOGO} alt={SITE_NAME} className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <p className="font-serif text-xl mb-2">The United Hell</p>
          <p className="kicker mb-4">Beyond Headlines. Beyond Discovery.</p>
          <p className="text-xs text-muted-foreground">{epaper.dateDisplay} · {epaper.totalArticles} stories curated today</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/" search={{ category: undefined }} className="hover:text-foreground transition">Home</Link>
            <Link to="/briefing" className="hover:text-foreground transition">Daily Briefing</Link>
            <Link to="/markets" search={{ asset: undefined }} className="hover:text-foreground transition">Markets</Link>
            <Link to="/trending" className="hover:text-foreground transition">Trending</Link>
            <Link to="/editions" className="hover:text-foreground transition">Editions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ────────── Masthead ────────── */
function Masthead({ dateDisplay, totalArticles }: { dateDisplay: string; totalArticles: number }) {
  return (
    <header className="border-b-2 rule">
      <div className="container-edit pt-6 pb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span className="kicker">{dateDisplay}</span>
          <span className="kicker">{totalArticles} Stories</span>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="hidden md:block flex-1 border-t rule" />
            <Newspaper className="h-6 w-6 text-muted-foreground" />
            <span className="kicker">Daily Discovery Edition</span>
            <Newspaper className="h-6 w-6 text-muted-foreground" />
            <div className="hidden md:block flex-1 border-t rule" />
          </div>
          <h1 className="display-1 mb-1">The United Hell</h1>
          <p className="dek">Beyond Headlines. Beyond Discovery.</p>
        </div>
      </div>
    </header>
  );
}

/* ────────── Section Navigation ────────── */
function SectionNav({ items, active, onSelect }: { items: { id: string; label: string }[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav className="sticky top-0 z-40 border-b rule bg-background/95 backdrop-blur-sm overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center gap-1 px-4 py-0 min-w-max">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
              active === item.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ────────── Reading Progress ────────── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-transparent">
      <div className="h-full bg-foreground transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* ────────── Big Hero ────────── */
function BigHero({ article }: { article: ArticleSummary }) {
  const cover = article.cover_image_url || fallbackCoverUrl(article);
  return (
    <Link to="/article/$slug" params={{ slug: article.slug }} preload="intent" className="group block">
      <div className="grid gap-6 md:grid-cols-12 items-start">
        <div className="md:col-span-8">
          <SmartImage
            src={cover}
            alt={article.title}
            width={900}
            height={560}
            loading="eager"
            aspectClass="aspect-[16/10] w-full"
            className="rounded-sm"
          />
        </div>
        <div className="md:col-span-4 flex flex-col gap-4">
          <span className="kicker">Lead Story</span>
          <h2 className="display-2 group-hover:underline decoration-1 underline-offset-4">{article.title}</h2>
          {article.dek && <p className="dek">{article.dek}</p>}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
            {article.read_time_minutes && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.read_time_minutes} min</span>}
            <span className="border-b border-foreground pb-0.5 font-medium text-foreground">Read the story</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ────────── Daily Widgets ────────── */
function DailyWidgets({ epaper }: { epaper: EpaperData }) {
  const marketData = epaper.marketSnapshot.slice(0, 12);
  return (
    <section className="bg-muted/40 border-y rule py-10">
      <div className="container-edit">
        <div className="kicker text-center mb-8">Daily Briefing — Data & Discovery</div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Market Snapshot */}
          <div className="border rule p-5 bg-background rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="kicker">Market Snapshot</h3>
            </div>
            <div className="space-y-2">
              {marketData.length === 0 ? (
                <p className="text-xs text-muted-foreground">Loading live prices...</p>
              ) : marketData.map((m) => (
                <div key={m.symbol} className="flex items-center justify-between text-xs">
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{m.name}</span>
                    <span className="text-[0.5rem] text-muted-foreground/60 uppercase tracking-wider">{m.exchange ?? m.region ?? ""}</span>
                  </div>
                  <span className="flex items-center gap-1.5 tabular-nums">
                    {m.available && m.price !== null ? (
                      <>
                        <span>{formatPrice(m.price, "USD", m.currency, m.unit)}</span>
                        <span className={m.change !== null && m.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                          {m.change !== null && m.change_percent !== null ? `${m.change >= 0 ? "▲+" : "▼"}${m.change_percent.toFixed(2)}%` : ""}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote of the Day */}
          <div className="border rule p-5 bg-background rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <Quote className="h-4 w-4 text-muted-foreground" />
              <h3 className="kicker">Quote of the Day</h3>
            </div>
            <blockquote className="font-serif text-lg italic leading-snug mb-3">"{epaper.quoteOfDay.text}"</blockquote>
            <p className="text-xs text-muted-foreground">— {epaper.quoteOfDay.author}</p>
          </div>

          {/* Today in History */}
          <div className="border rule p-5 bg-background rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <h3 className="kicker">Today in History</h3>
            </div>
            <p className="text-sm leading-relaxed">{epaper.thisDayHistory[0]}</p>
          </div>

          {/* Photo of the Day */}
          <div className="border rule p-5 bg-background rounded-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-4 w-4 text-muted-foreground" />
              <h3 className="kicker">Photo of the Day</h3>
            </div>
            {epaper.photoOfDay.url ? (
              <>
                <SmartImage src={epaper.photoOfDay.url} alt={epaper.photoOfDay.caption} width={300} height={200} loading="lazy" aspectClass="w-full aspect-[3/2]" className="rounded-sm mb-3" />
                <p className="text-xs text-muted-foreground line-clamp-2">{epaper.photoOfDay.caption}</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Today's featured photo is being selected.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Section Page ────────── */
function SectionPage({ section, index, refMap }: { section: EpaperSection; index: number; refMap: React.MutableRefObject<Record<string, HTMLElement | null>> }) {
  const [hero, ...rest] = section.articles;
  if (!hero) return null;

  return (
    <section
      ref={(el) => { refMap.current[section.id] = el; }}
      id={section.id}
      className={`container-edit py-10 md:py-14 ${index % 2 === 1 ? "bg-muted/20" : ""}`}
    >
      {/* Section divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-foreground/20" />
        <div className="text-center">
          <div className="kicker">{section.kicker}</div>
          <h2 className="display-2 mt-1">{section.label}</h2>
        </div>
        <div className="h-px flex-1 bg-foreground/20" />
      </div>

      {/* Featured + grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ArticleCard article={hero} variant="hero" />
        </div>
        <div className="lg:col-span-5 grid gap-6 content-start">
          {rest.slice(0, 4).map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      {/* More from this section */}
      {rest.length > 4 && (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(4).map((article, i) => (
            <div key={article.id} className="animate-card-reveal" style={{ animationDelay: `${i * 60}ms` }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-4 border-t rule flex items-center justify-between">
        <span className="kicker">{section.articles.length} stories in {section.label}</span>
        <Link to="/" search={{ category: section.id }} className="text-sm font-medium border-b border-foreground pb-0.5 hover:opacity-70 transition flex items-center gap-1">
          More from {section.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
