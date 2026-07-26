import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { BookOpen, ArrowRight, ArrowDown, Star, Sparkles, Search, X, ShoppingBag, Eye, Heart, ChevronRight } from "lucide-react";
import { BOOKS, AUTHOR, COLLECTIONS, type EditionBook } from "@/lib/editions-data";
import { canonicalUrl, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/editions")({
  head: () => ({
    meta: [
      { title: "Editions | Altair Veda" },
      { name: "description", content: "Discover every edition of the Powerful Mind Series by Altair Veda, a premium collection exploring intelligence, focus, discipline, strategic thinking, and leadership." },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Editions | Altair Veda" },
      { property: "og:description", content: "Discover every edition of the Powerful Mind Series by Altair Veda." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl("/editions") },
      { property: "og:image", content: BOOKS[0].coverImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Editions | Altair Veda" },
      { name: "twitter:description", content: "Discover every edition of the Powerful Mind Series by Altair Veda." },
    ],
    links: [{ rel: "canonical", href: canonicalUrl("/editions") }],
  }),
  component: EditionsPage,
});

type SortMode = "latest" | "popular" | "title" | "az" | "za";
type ViewMode = "grid" | "shelf" | "list";

function EditionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortMode>("latest");
  const [activeCollection, setActiveCollection] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewBook, setPreviewBook] = useState<EditionBook | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("edition-favorites");
      if (saved) setFavorites(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  function toggleFavorite(slug: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try { localStorage.setItem("edition-favorites", JSON.stringify([...next])); } catch {}
      return next;
    });
  }

  const filteredBooks = useMemo(() => {
    let result = [...BOOKS];
    if (activeCollection) result = result.filter((b) => b.collections.includes(activeCollection));
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.subtitle.toLowerCase().includes(q) ||
          b.genre.some((g) => g.toLowerCase().includes(q)) ||
          b.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case "latest": result.sort((a, b) => b.editionNumber - a.editionNumber); break;
      case "popular": result.sort((a, b) => a.editionNumber - b.editionNumber); break;
      case "title": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za": result.sort((a, b) => b.title.localeCompare(a.title)); break;
    }
    return result;
  }, [activeCollection, searchTerm, sortBy]);

  const featuredBook = BOOKS[0];

  return (
    <div className="editions-page bg-[#090705] text-white min-h-screen relative overflow-hidden">
      <EditionsBackground />

      {/* Compact Hero */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 z-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#F4B860]/5 blur-[120px]" />
        </div>

        <div className="relative text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E6C17D]/30 rounded-full bg-[#E6C17D]/5 backdrop-blur-sm mb-5 animate-fade-in">
            <Sparkles className="h-3 w-3 text-[#E6C17D]" />
            <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[#E6C17D]">The Powerful Mind Series</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-4 animate-fade-in-up">
            <span className="bg-gradient-to-b from-[#FFF2D8] via-[#E6C17D] to-[#C49752] bg-clip-text text-transparent">EDITIONS</span>
          </h1>

          <p className="text-sm md:text-base text-[#FFF2D8]/70 max-w-xl mx-auto leading-relaxed mb-6 animate-fade-in-up animation-delay-200">
            A timeless collection of books, journals, research, art, and ideas created to inspire knowledge, curiosity, creativity, wisdom, and lifelong learning.
          </p>

          <div className="flex items-center justify-center gap-3 animate-fade-in-up animation-delay-400">
            <a href="#collection" className="group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] font-medium text-xs uppercase tracking-[0.15em] rounded-sm hover:shadow-[0_0_25px_rgba(230,193,125,0.4)] transition-all duration-500">
              Explore Collection <ArrowDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <Link to="/editions/$slug" params={{ slug: featuredBook.slug }} className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#E6C17D]/40 text-[#E6C17D] font-medium text-xs uppercase tracking-[0.15em] rounded-sm hover:bg-[#E6C17D]/10 transition-all duration-500">
              Latest Release
            </Link>
          </div>
        </div>
      </section>

      {/* Featured + Author — Side by Side, Compact */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          {/* Featured Book */}
          <div className="flex gap-4 items-center">
            <Link to="/editions/$slug" params={{ slug: featuredBook.slug }} className="group relative shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#F4B860]/10 to-[#C49752]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm" />
              <img src={featuredBook.coverImage} alt={featuredBook.title} className="relative w-24 h-36 md:w-28 md:h-42 object-cover rounded-sm border border-[#E6C17D]/20 group-hover:scale-[1.03] transition-transform duration-500" loading="lazy" />
            </Link>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 mb-1.5">
                <Star className="h-3 w-3 text-[#E6C17D]" />
                <span className="text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]">Featured</span>
              </div>
              <Link to="/editions/$slug" params={{ slug: featuredBook.slug }}>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors leading-tight">{featuredBook.title}</h2>
              </Link>
              <p className="text-xs text-[#E6C17D]/70 font-serif italic mt-1">{featuredBook.subtitle}</p>
              <p className="text-xs text-[#FFF2D8]/50 mt-2 line-clamp-2">{featuredBook.description}</p>
              <div className="flex gap-2 mt-3">
                <Link to="/editions/$slug" params={{ slug: featuredBook.slug }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_15px_rgba(230,193,125,0.3)] transition-all">
                  Buy <ShoppingBag className="h-3 w-3" />
                </Link>
                <button onClick={() => setPreviewBook(featuredBook)} className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E6C17D]/40 text-[#E6C17D] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all">
                  <Eye className="h-3 w-3" /> Sample
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-40 bg-gradient-to-b from-transparent via-[#E6C17D]/30 to-transparent" />

          {/* Author */}
          <div className="flex gap-4 items-center">
            <img src={AUTHOR.logo} alt={AUTHOR.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border border-[#E6C17D]/30 shrink-0" />
            <div className="min-w-0">
              <div className="text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1">The Author</div>
              <h3 className="font-serif text-xl font-bold text-[#FFF2D8]">{AUTHOR.name}</h3>
              <p className="text-xs text-[#FFF2D8]/50 mt-1 line-clamp-2">{AUTHOR.shortBio}</p>
              <p className="font-serif text-sm italic text-[#E6C17D]/80 mt-2 line-clamp-1">"{AUTHOR.quote}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section — Compact */}
      <section id="collection" className="relative z-10 py-8 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Search + Sort + View — Single Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#E6C17D]/40" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search editions..."
                className="w-full bg-[#0F0906] border border-[#E6C17D]/20 pl-9 pr-4 py-2 text-sm text-[#FFF2D8] placeholder:text-[#FFF2D8]/30 rounded-sm focus:border-[#E6C17D]/50 focus:outline-none transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-[#E6C17D]/40 hover:text-[#E6C17D]" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortMode)} className="bg-[#0F0906] border border-[#E6C17D]/20 text-[0.65rem] uppercase tracking-widest text-[#FFF2D8] px-3 py-2 rounded-sm focus:outline-none focus:border-[#E6C17D]/50">
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
                <option value="title">Title</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
              <div className="flex border border-[#E6C17D]/20 rounded-sm overflow-hidden">
                {(["grid", "shelf", "list"] as ViewMode[]).map((v) => (
                  <button key={v} onClick={() => setViewMode(v)} className={`px-2.5 py-2 text-[0.6rem] uppercase tracking-widest transition ${viewMode === v ? "bg-[#E6C17D] text-[#090705]" : "text-[#E6C17D] hover:bg-[#E6C17D]/10"}`}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Collections — Compact Pills */}
          <div className="flex flex-wrap gap-1.5 mb-6 justify-center">
            <button onClick={() => setActiveCollection(undefined)} className={`px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] border rounded-sm transition ${!activeCollection ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`}>All</button>
            {COLLECTIONS.map((c) => (
              <button key={c} onClick={() => setActiveCollection(c === activeCollection ? undefined : c)} className={`px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] border rounded-sm transition ${activeCollection === c ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`}>{c}</button>
            ))}
          </div>

          {/* Books — Compact Grid */}
          {filteredBooks.length === 0 ? (
            <p className="text-center text-[#FFF2D8]/40 py-12">No editions match your search.</p>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {filteredBooks.map((book, i) => (
                <CompactBookCard key={book.slug} book={book} index={i} isFavorite={favorites.has(book.slug)} onFavorite={() => toggleFavorite(book.slug)} onPreview={() => setPreviewBook(book)} />
              ))}
            </div>
          ) : viewMode === "shelf" ? (
            <ShelfView books={filteredBooks} favorites={favorites} onFavorite={toggleFavorite} onPreview={setPreviewBook} />
          ) : (
            <div className="space-y-2">
              {filteredBooks.map((book, i) => (
                <CompactListRow key={book.slug} book={book} index={i} isFavorite={favorites.has(book.slug)} onFavorite={() => toggleFavorite(book.slug)} onPreview={() => setPreviewBook(book)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Series Timeline — Compact Horizontal */}
      <section className="relative z-10 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" />
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-[#E6C17D]">The Series</span>
            <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" />
          </div>

          {/* Horizontal Timeline */}
          <div className="relative overflow-x-auto pb-4">
            <div className="relative flex items-center gap-2 min-w-max px-4">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E6C17D]/30 to-transparent -translate-y-1/2" />
              {BOOKS.map((book) => (
                <Link key={book.slug} to="/editions/$slug" params={{ slug: book.slug }} className="group relative flex flex-col items-center gap-2 z-10">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#E6C17D]/30 bg-[#0F0906] flex items-center justify-center group-hover:border-[#E6C17D] group-hover:shadow-[0_0_15px_rgba(230,193,125,0.4)] transition-all duration-500">
                    <span className="font-serif text-lg text-[#E6C17D]">{book.seriesOrder}</span>
                  </div>
                  <span className="text-[0.55rem] uppercase tracking-widest text-[#FFF2D8]/50 group-hover:text-[#E6C17D] transition-colors max-w-[80px] text-center leading-tight">{book.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA — Compact */}
      <section className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="relative font-serif text-2xl md:text-3xl font-bold text-[#FFF2D8] mb-3 leading-tight">
            Begin Your Journey Toward a More Powerful Mind
          </h2>
          <p className="relative text-xs text-[#FFF2D8]/50 mb-5 max-w-md mx-auto">
            Every edition is an invitation to think more deeply, act more intentionally, and contribute something meaningful.
          </p>
          <div className="relative flex flex-col sm:flex-row justify-center gap-3">
            <a href="#collection" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_25px_rgba(230,193,125,0.4)] transition-all">
              Explore Editions <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link to="/editions/$slug" params={{ slug: featuredBook.slug }} className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all">
              Read Sample
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {previewBook && <PreviewModal book={previewBook} onClose={() => setPreviewBook(null)} />}
    </div>
  );
}

function EditionsBackground() {
  const stars = useMemo(
    () => Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    })),
    []
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#090705] via-[#0F0906] to-[#140B07]" />
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-[#FFF2D8]" style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}px`, height: `${s.size}px`, opacity: 0.3, animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite` }} />
      ))}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#C49752]/3 blur-[150px]" />
    </div>
  );
}

function CompactBookCard({ book, index, isFavorite, onFavorite, onPreview }: {
  book: EditionBook;
  index: number;
  isFavorite: boolean;
  onFavorite: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <Link to="/editions/$slug" params={{ slug: book.slug }} className="block relative">
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      {/* Quick actions — appear on hover */}
      <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button onClick={(e) => { e.preventDefault(); onFavorite(); }} className="w-6 h-6 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all" aria-label="Favorite">
          <Heart className={`h-3 w-3 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}`} />
        </button>
        <button onClick={(e) => { e.preventDefault(); onPreview(); }} className="w-6 h-6 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all" aria-label="Preview">
          <Eye className="h-3 w-3 text-[#E6C17D]" />
        </button>
      </div>
      <div className="mt-2">
        <div className="text-[0.5rem] uppercase tracking-[0.18em] text-[#E6C17D]/60">Ed. {String(book.editionNumber).padStart(2, "0")}</div>
        <Link to="/editions/$slug" params={{ slug: book.slug }}>
          <h3 className="font-serif text-xs font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors leading-tight line-clamp-2">{book.title}</h3>
        </Link>
        <p className="text-[0.6rem] text-[#FFF2D8]/40 line-clamp-1 mt-0.5">{book.subtitle}</p>
      </div>
    </div>
  );
}

function ShelfView({ books, favorites, onFavorite, onPreview }: {
  books: EditionBook[];
  favorites: Set<string>;
  onFavorite: (slug: string) => void;
  onPreview: (book: EditionBook) => void;
}) {
  return (
    <div className="flex items-end justify-center gap-3 lg:gap-5 flex-wrap">
      {books.map((book, i) => (
        <div key={book.slug} className="flex flex-col items-center gap-2 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
          <Link to="/editions/$slug" params={{ slug: book.slug }} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-t from-[#F4B860]/10 to-transparent opacity-0 group-hover:opacity-100 blur-lg transition-opacity rounded-sm" />
            <div className="relative w-24 md:w-28 aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500 group-hover:-translate-y-2">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            </div>
            <div className="h-1 bg-gradient-to-r from-[#C49752]/30 via-[#E6C17D]/30 to-[#C49752]/30 rounded-sm" />
          </Link>
          <div className="text-center max-w-[100px]">
            <div className="text-[0.5rem] uppercase tracking-widest text-[#E6C17D]/50">Book {book.seriesOrder}</div>
            <h3 className="font-serif text-xs font-bold text-[#FFF2D8] leading-tight line-clamp-2">{book.title}</h3>
            <div className="flex gap-1.5 justify-center mt-1.5">
              <button onClick={() => onFavorite(book.slug)} className="w-6 h-6 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition">
                <Heart className={`h-2.5 w-2.5 ${favorites.has(book.slug) ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}`} />
              </button>
              <button onClick={() => onPreview(book)} className="w-6 h-6 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition">
                <Eye className="h-2.5 w-2.5 text-[#E6C17D]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompactListRow({ book, index, isFavorite, onFavorite, onPreview }: {
  book: EditionBook;
  index: number;
  isFavorite: boolean;
  onFavorite: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group flex items-center gap-3 p-3 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50 hover:border-[#E6C17D]/40 hover:bg-[#0F0906] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
      <Link to="/editions/$slug" params={{ slug: book.slug }} className="shrink-0">
        <img src={book.coverImage} alt={book.title} className="w-12 h-18 object-cover rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition" loading="lazy" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[0.5rem] uppercase tracking-widest text-[#E6C17D]/60">Ed. {String(book.editionNumber).padStart(2, "0")} · {book.readingTime}</div>
        <Link to="/editions/$slug" params={{ slug: book.slug }}>
          <h3 className="font-serif text-sm font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors">{book.title}</h3>
        </Link>
        <p className="text-xs text-[#FFF2D8]/40 line-clamp-1">{book.subtitle}</p>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button onClick={onFavorite} className="w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition" aria-label="Favorite">
          <Heart className={`h-3 w-3 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}`} />
        </button>
        <button onClick={onPreview} className="w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition" aria-label="Preview">
          <Eye className="h-3 w-3 text-[#E6C17D]" />
        </button>
      </div>
    </div>
  );
}

function PreviewModal({ book, onClose }: { book: EditionBook; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-[#090705]/90 backdrop-blur-md" />
      <div className="relative max-w-lg w-full max-h-[80vh] overflow-y-auto border border-[#E6C17D]/25 rounded-sm bg-[#0F0906] p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition" aria-label="Close">
          <X className="h-3.5 w-3.5 text-[#E6C17D]" />
        </button>
        <div className="grid grid-cols-[100px_1fr] gap-4">
          <img src={book.coverImage} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-sm border border-[#E6C17D]/20" />
          <div>
            <div className="text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1">Edition {String(book.editionNumber).padStart(2, "0")}</div>
            <h3 className="font-serif text-xl font-bold text-[#FFF2D8] mb-1">{book.title}</h3>
            <p className="text-xs text-[#E6C17D]/80 font-serif italic mb-3">{book.subtitle}</p>
            <p className="text-xs text-[#FFF2D8]/60 leading-relaxed line-clamp-5 mb-4">{book.description}</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/editions/$slug" params={{ slug: book.slug }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_15px_rgba(230,193,125,0.3)] transition-all">
                Details
              </Link>
              <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#E6C17D]/40 text-[#E6C17D] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all">
                Buy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
