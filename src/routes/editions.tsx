import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { BookOpen, ArrowRight, ArrowDown, Star, Sparkles, Search, X, ShoppingBag, Eye, Heart, Share2, ChevronRight } from "lucide-react";
import { BOOKS, AUTHOR, COLLECTIONS, type EditionBook } from "@/lib/editions-data";
import { canonicalUrl, SITE_NAME, SITE_LOGO } from "@/lib/seo";

export const Route = createFileRoute("/editions")({
  head: () => ({
    meta: [
      { title: "Editions | Altair Veda" },
      { name: "description", content: "Discover every edition of the Powerful Mind Series by Altair Veda, a premium collection exploring intelligence, focus, discipline, strategic thinking, and leadership." },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: "Editions | Altair Veda" },
      { property: "og:description", content: "Discover every edition of the Powerful Mind Series by Altair Veda, a premium collection exploring intelligence, focus, discipline, strategic thinking, and leadership." },
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

type SortMode = "latest" | "popular" | "title" | "publication" | "az" | "za";
type ViewMode = "grid" | "shelf" | "list";

function EditionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortMode>("latest");
  const [activeCollection, setActiveCollection] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewBook, setPreviewBook] = useState<EditionBook | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    if (activeCollection) {
      result = result.filter((b) => b.collections.includes(activeCollection));
    }
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
      case "publication": result.sort((a, b) => a.publicationDate.kindle.localeCompare(b.publicationDate.kindle)); break;
      case "az": result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za": result.sort((a, b) => b.title.localeCompare(a.title)); break;
    }
    return result;
  }, [activeCollection, searchTerm, sortBy]);

  const featuredBook = BOOKS[0];

  return (
    <div className="editions-page bg-[#090705] text-white min-h-screen relative overflow-hidden">
      {/* Layered Background */}
      <EditionsBackground scrollY={scrollY} />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-20 z-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#F4B860]/5 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[#C49752]/5 blur-[100px]" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto" style={{ transform: `translateY(${scrollY * 0.15}px)` }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#E6C17D]/30 rounded-full bg-[#E6C17D]/5 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-[#E6C17D]" />
            <span className="text-[0.7rem] uppercase tracking-[0.25em] text-[#E6C17D]">The Powerful Mind Series</span>
          </div>

          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.95] mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-b from-[#FFF2D8] via-[#E6C17D] to-[#C49752] bg-clip-text text-transparent">EDITIONS</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#FFF2D8]/70 max-w-2xl mx-auto leading-relaxed mb-10 font-sans animate-fade-in-up animation-delay-200">
            A timeless collection of books, journals, research, art, and ideas created to inspire knowledge, curiosity, creativity, wisdom, and lifelong learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
            <a
              href="#collection"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] font-medium text-sm uppercase tracking-[0.15em] rounded-sm hover:shadow-[0_0_30px_rgba(230,193,125,0.4)] transition-all duration-500"
            >
              Explore Collection
              <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <Link
              to="/editions/$slug"
              params={{ slug: featuredBook.slug }}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#E6C17D]/40 text-[#E6C17D] font-medium text-sm uppercase tracking-[0.15em] rounded-sm hover:bg-[#E6C17D]/10 transition-all duration-500"
            >
              Latest Release
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <ArrowDown className="h-5 w-5 text-[#E6C17D]/50" />
        </div>
      </section>

      {/* Featured Book */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E6C17D]/40 to-transparent" />
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]">Featured Edition</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E6C17D]/40 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#F4B860]/10 to-[#C49752]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative aspect-[2/3] max-w-sm mx-auto">
                <div className="absolute inset-0 rounded-sm shadow-2xl shadow-[#F4B860]/10 group-hover:shadow-[#F4B860]/30 transition-shadow duration-700" />
                <img
                  src={featuredBook.coverImage}
                  alt={featuredBook.title}
                  className="relative w-full h-full object-cover rounded-sm border border-[#E6C17D]/20 group-hover:scale-[1.02] transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-sm bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#E6C17D]/30 rounded-full">
                <Star className="h-3 w-3 text-[#E6C17D]" />
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#E6C17D]">Edition {String(featuredBook.editionNumber).padStart(2, "0")}</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-[#FFF2D8]">{featuredBook.title}</h2>
              <p className="text-lg text-[#E6C17D]/80 font-serif italic">{featuredBook.subtitle}</p>
              <p className="text-sm text-[#FFF2D8]/60 leading-relaxed line-clamp-4">{featuredBook.description}</p>
              <div className="flex flex-wrap gap-3 pt-4">
                <Link
                  to="/editions/$slug"
                  params={{ slug: featuredBook.slug }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(230,193,125,0.3)] transition-all"
                >
                  Buy Now <ShoppingBag className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/editions/$slug"
                  params={{ slug: featuredBook.slug }}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Link>
                <button
                  onClick={() => setPreviewBook(featuredBook)}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all"
                >
                  Read Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="collection" className="relative z-10 py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" />
              <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]">The Collection</span>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#FFF2D8]">Every Edition</h2>
            <p className="text-sm text-[#FFF2D8]/50 mt-4 max-w-xl mx-auto">Explore every masterpiece in the Powerful Mind Series.</p>
          </div>

          {/* Search + Sort + View */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-10">
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E6C17D]/40" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search editions..."
                className="w-full bg-[#0F0906] border border-[#E6C17D]/20 pl-10 pr-4 py-2.5 text-sm text-[#FFF2D8] placeholder:text-[#FFF2D8]/30 rounded-sm focus:border-[#E6C17D]/50 focus:outline-none transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-[#E6C17D]/40 hover:text-[#E6C17D]" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="bg-[#0F0906] border border-[#E6C17D]/20 text-xs uppercase tracking-widest text-[#FFF2D8] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#E6C17D]/50"
              >
                <option value="latest">Latest</option>
                <option value="popular">Popular</option>
                <option value="title">Title</option>
                <option value="publication">Publication</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>

              <div className="flex border border-[#E6C17D]/20 rounded-sm overflow-hidden">
                {(["grid", "shelf", "list"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`px-3 py-2.5 text-xs uppercase tracking-widest transition ${viewMode === v ? "bg-[#E6C17D] text-[#090705]" : "text-[#E6C17D] hover:bg-[#E6C17D]/10"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collections Filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <button
              onClick={() => setActiveCollection(undefined)}
              className={`px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] border rounded-sm transition ${!activeCollection ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`}
            >
              All
            </button>
            {COLLECTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCollection(c === activeCollection ? undefined : c)}
                className={`px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] border rounded-sm transition ${activeCollection === c ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <p className="text-center text-[#FFF2D8]/40 py-20">No editions match your search.</p>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
              {filteredBooks.map((book, i) => (
                <BookCard
                  key={book.slug}
                  book={book}
                  index={i}
                  isFavorite={favorites.has(book.slug)}
                  onFavorite={() => toggleFavorite(book.slug)}
                  onPreview={() => setPreviewBook(book)}
                />
              ))}
            </div>
          ) : viewMode === "shelf" ? (
            <ShelfView books={filteredBooks} favorites={favorites} onFavorite={toggleFavorite} onPreview={setPreviewBook} />
          ) : (
            <div className="space-y-4">
              {filteredBooks.map((book, i) => (
                <BookListRow key={book.slug} book={book} index={i} isFavorite={favorites.has(book.slug)} onFavorite={() => toggleFavorite(book.slug)} onPreview={() => setPreviewBook(book)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Series Timeline */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" />
              <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]">Inside the Series</span>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#FFF2D8]">The Powerful Mind Series</h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E6C17D]/40 to-transparent -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {BOOKS.map((book, i) => (
                <div key={book.slug} className={`relative flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="hidden md:block flex-1" />
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E6C17D] shadow-[0_0_15px_rgba(230,193,125,0.5)] hidden md:block z-10" />
                  <div className="flex-1 group">
                    <Link to="/editions/$slug" params={{ slug: book.slug }} className="block">
                      <div className="flex items-start gap-4 p-5 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50 backdrop-blur-sm hover:border-[#E6C17D]/40 hover:bg-[#0F0906] transition-all duration-500">
                        <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded-sm border border-[#E6C17D]/10" loading="lazy" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1">Book {book.seriesOrder}</div>
                          <h3 className="font-serif text-lg font-bold text-[#FFF2D8] truncate group-hover:text-[#E6C17D] transition-colors">{book.title}</h3>
                          <p className="text-xs text-[#FFF2D8]/50 mt-1 line-clamp-2">{book.subtitle}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-[#E6C17D]/40 group-hover:text-[#E6C17D] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" />
            <span className="text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]">Meet the Author</span>
            <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" />
          </div>

          <div className="relative inline-block mb-8">
            <div className="absolute -inset-6 bg-gradient-to-br from-[#F4B860]/10 to-[#C49752]/10 blur-2xl rounded-full" />
            <img
              src={AUTHOR.logo}
              alt={AUTHOR.name}
              className="relative w-32 h-32 object-contain rounded-full border border-[#E6C17D]/30 mx-auto"
            />
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#FFF2D8] mb-6">{AUTHOR.name}</h2>
          <p className="text-base text-[#FFF2D8]/60 leading-relaxed max-w-2xl mx-auto mb-8">{AUTHOR.shortBio}</p>

          <div className="relative max-w-3xl mx-auto p-8 border border-[#E6C17D]/20 rounded-sm bg-[#0F0906]/50 backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-[#090705]">
              <Sparkles className="h-5 w-5 text-[#E6C17D]" />
            </div>
            <p className="font-serif text-lg md:text-xl italic text-[#E6C17D]/90 leading-relaxed">"{AUTHOR.quote}"</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {AUTHOR.topics.map((t) => (
              <span key={t} className="px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] border border-[#E6C17D]/15 text-[#E6C17D]/60 rounded-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-[#F4B860]/5 blur-[120px]" />
          </div>
          <h2 className="relative font-serif text-3xl md:text-5xl font-bold text-[#FFF2D8] mb-6 leading-tight">
            Begin Your Journey Toward<br />a More Powerful Mind
          </h2>
          <p className="relative text-sm text-[#FFF2D8]/50 mb-10 max-w-xl mx-auto">
            Every edition is an invitation to think more deeply, act more intentionally, and contribute something meaningful.
          </p>
          <div className="relative flex flex-col sm:flex-row justify-center gap-4">
            <a href="#collection" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_30px_rgba(230,193,125,0.4)] transition-all">
              Explore Editions <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/editions/$slug" params={{ slug: featuredBook.slug }} className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all">
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

function EditionsBackground({ scrollY }: { scrollY: number }) {
  const stars = useMemo(
    () => Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    })),
    []
  );
  const particles = useMemo(
    () => Array.from({ length: 25 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 6,
    })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090705] via-[#0F0906] to-[#140B07]" />
      {/* Stars */}
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#FFF2D8]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0.4,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      {/* Golden dust particles */}
      {particles.map((p, i) => (
        <div
          key={`p-${i}`}
          className="absolute rounded-full bg-[#F4B860]/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      {/* Nebula glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#C49752]/3 blur-[150px]"
        style={{ transform: `translate(-50%, ${scrollY * 0.1}px)` }}
      />
    </div>
  );
}

function BookCard({ book, index, isFavorite, onFavorite, onPreview }: {
  book: EditionBook;
  index: number;
  isFavorite: boolean;
  onFavorite: () => void;
  onPreview: () => void;
}) {
  return (
    <div
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute -inset-2 bg-gradient-to-br from-[#F4B860]/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 rounded-sm" />
      <Link to="/editions/$slug" params={{ slug: book.slug }} className="block relative">
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#E6C17D]/5 to-transparent pointer-events-none" />
        </div>
      </Link>

      {/* Quick actions */}
      <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => { e.preventDefault(); onFavorite(); }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all"
          aria-label="Add to favorites"
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}`} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); onPreview(); }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all"
          aria-label="Quick preview"
        >
          <Eye className="h-3.5 w-3.5 text-[#E6C17D]" />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]/60">Edition {String(book.editionNumber).padStart(2, "0")} · {book.series}</div>
        <Link to="/editions/$slug" params={{ slug: book.slug }}>
          <h3 className="font-serif text-sm font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors leading-tight">{book.title}</h3>
        </Link>
        <p className="text-[0.7rem] text-[#FFF2D8]/40 line-clamp-1">{book.subtitle}</p>
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
    <div className="space-y-12">
      {books.map((book, i) => (
        <div key={book.slug} className="flex items-end justify-center gap-2 lg:gap-4 flex-wrap animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
          <Link to="/editions/$slug" params={{ slug: book.slug }} className="group relative">
            <div className="absolute -inset-2 bg-gradient-to-t from-[#F4B860]/10 to-transparent opacity-0 group-hover:opacity-100 blur-lg transition-opacity rounded-sm" />
            <div className="relative w-28 md:w-36 lg:w-44 aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500 group-hover:-translate-y-2">
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            </div>
            {/* Shelf */}
            <div className="h-1.5 bg-gradient-to-r from-[#C49752]/30 via-[#E6C17D]/30 to-[#C49752]/30 rounded-sm" />
          </Link>
          <div className="max-w-xs">
            <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1">Book {book.seriesOrder}</div>
            <h3 className="font-serif text-lg font-bold text-[#FFF2D8]">{book.title}</h3>
            <p className="text-xs text-[#FFF2D8]/50 mt-1">{book.subtitle}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => onFavorite(book.slug)} className="w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition">
                <Heart className={`h-3 w-3 ${favorites.has(book.slug) ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}`} />
              </button>
              <button onClick={() => onPreview(book)} className="w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition">
                <Eye className="h-3 w-3 text-[#E6C17D]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BookListRow({ book, index, isFavorite, onFavorite, onPreview }: {
  book: EditionBook;
  index: number;
  isFavorite: boolean;
  onFavorite: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="group flex items-center gap-6 p-5 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50 backdrop-blur-sm hover:border-[#E6C17D]/40 hover:bg-[#0F0906] transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
      <Link to="/editions/$slug" params={{ slug: book.slug }} className="shrink-0">
        <img src={book.coverImage} alt={book.title} className="w-16 h-24 md:w-20 md:h-30 object-cover rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition" loading="lazy" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1">Edition {String(book.editionNumber).padStart(2, "0")} · {book.readingTime}</div>
        <Link to="/editions/$slug" params={{ slug: book.slug }}>
          <h3 className="font-serif text-lg md:text-xl font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors">{book.title}</h3>
        </Link>
        <p className="text-sm text-[#FFF2D8]/50 mt-1 line-clamp-1">{book.subtitle}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {book.genre.slice(0, 3).map((g) => (
            <span key={g} className="text-[0.55rem] uppercase tracking-widest text-[#E6C17D]/50 border border-[#E6C17D]/15 px-2 py-0.5 rounded-sm">{g}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <button onClick={onFavorite} className="w-8 h-8 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition" aria-label="Favorite">
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}`} />
        </button>
        <button onClick={onPreview} className="w-8 h-8 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition" aria-label="Preview">
          <Eye className="h-3.5 w-3.5 text-[#E6C17D]" />
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
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-[#090705]/90 backdrop-blur-md" />
      <div
        className="relative max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#E6C17D]/25 rounded-sm bg-[#0F0906] p-6 md:p-10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition" aria-label="Close">
          <X className="h-4 w-4 text-[#E6C17D]" />
        </button>
        <div className="grid md:grid-cols-[160px_1fr] gap-6">
          <img src={book.coverImage} alt={book.title} className="w-full max-w-[160px] aspect-[2/3] object-cover rounded-sm border border-[#E6C17D]/20 mx-auto" />
          <div>
            <div className="text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-2">Edition {String(book.editionNumber).padStart(2, "0")}</div>
            <h3 className="font-serif text-2xl font-bold text-[#FFF2D8] mb-2">{book.title}</h3>
            <p className="text-sm text-[#E6C17D]/80 font-serif italic mb-4">{book.subtitle}</p>
            <p className="text-xs text-[#FFF2D8]/60 leading-relaxed line-clamp-6 mb-6">{book.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/editions/$slug" params={{ slug: book.slug }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(230,193,125,0.3)] transition-all">
                View Details
              </Link>
              <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all">
                Buy Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
