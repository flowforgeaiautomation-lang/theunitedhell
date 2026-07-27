import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { BookOpen, Search, X, ArrowRight, ExternalLink } from "lucide-react";
import { BOOKS, AUTHOR, type EditionBook } from "@/lib/editions-data";
import { canonicalUrl, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/editions")({
  head: () => ({
    meta: [
      { title: "Editions | Altair Veda" },
      { name: "description", content: "Discover every edition of the Powerful Mind Series by Altair Veda — a premium collection exploring intelligence, focus, discipline, strategic thinking, and leadership." },
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

function EditionsPage() {
  const [selectedBook, setSelectedBook] = useState<EditionBook>(BOOKS[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return BOOKS;
    const q = searchTerm.toLowerCase();
    return BOOKS.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.keywords.some((k) => k.toLowerCase().includes(q)) ||
        String(b.editionNumber).includes(q)
    );
  }, [searchTerm]);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero — Compact */}
      <header className="border-b border-white/10 px-4 py-10 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 mb-3">
            <BookOpen className="h-3.5 w-3.5 text-white/40" strokeWidth={1.5} />
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/40">The Powerful Mind Series</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1] mb-2">
            Editions
          </h1>
          <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            A timeless collection of books, journals, research, art, and ideas created to inspire knowledge, curiosity, and lifelong learning.
          </p>
        </div>
      </header>

      {/* Featured Book — Interactive */}
      <section className="border-b border-white/10 px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[180px_1fr] gap-6 md:gap-8 items-start">
            {/* Cover */}
            <div className="relative mx-auto md:mx-0">
              <div className="w-36 h-52 md:w-44 md:h-64 relative">
                <img
                  key={selectedBook.slug}
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-full h-full object-contain rounded-sm border border-white/15 animate-fade-in"
                  loading="eager"
                />
              </div>
            </div>

            {/* Info */}
            <div key={selectedBook.slug} className="animate-fade-in">
              <div className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-2">
                Edition {String(selectedBook.editionNumber).padStart(2, "0")} · {selectedBook.series}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-1">{selectedBook.title}</h2>
              <p className="text-sm text-white/50 font-serif italic mb-3">{selectedBook.subtitle}</p>
              <p className="text-sm text-white/60 leading-relaxed line-clamp-3 mb-4">{selectedBook.description}</p>

              <div className="flex flex-wrap gap-3 text-[0.65rem] text-white/40 mb-4">
                <span>{selectedBook.publicationDate.kindle}</span>
                <span className="text-white/20">·</span>
                <span>{selectedBook.language}</span>
                <span className="text-white/20">·</span>
                <span>{selectedBook.readingTime}</span>
              </div>

              <a
                href={selectedBook.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-medium uppercase tracking-[0.15em] rounded-sm hover:bg-white/90 transition-all"
              >
                Buy on Amazon <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="px-4 py-4 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" strokeWidth={1.5} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, keyword, or edition number..."
              className="w-full bg-transparent border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 rounded-sm focus:border-white/40 focus:outline-none transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Clear search">
                <X className="h-4 w-4 text-white/30 hover:text-white" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Book List */}
      <section className="px-4 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">All Editions</span>
            <span className="text-[0.6rem] text-white/20">({filteredBooks.length})</span>
          </div>

          {filteredBooks.length === 0 ? (
            <p className="text-sm text-white/30 py-8 text-center">No editions match your search.</p>
          ) : (
            <div className="space-y-1">
              {filteredBooks.map((book, i) => (
                <BookRow
                  key={book.slug}
                  book={book}
                  index={i}
                  isSelected={selectedBook.slug === book.slug}
                  onSelect={() => setSelectedBook(book)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Author — Compact */}
      <section className="border-t border-white/10 px-4 py-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <img
            src={AUTHOR.logo}
            alt={AUTHOR.name}
            className="w-16 h-16 rounded-full border border-white/15 object-cover mb-3"
          />
          <h3 className="font-serif text-xl font-bold mb-1">{AUTHOR.name}</h3>
          <p className="text-sm text-white/50 leading-relaxed line-clamp-3 max-w-md mb-3">{AUTHOR.shortBio}</p>
          <Link
            to="/editions/$slug"
            params={{ slug: BOOKS[0].slug }}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition"
          >
            View Author <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function BookRow({ book, index, isSelected, onSelect }: {
  book: EditionBook;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group flex items-center gap-4 p-3 border rounded-sm cursor-pointer transition-all duration-300 animate-fade-in ${
        isSelected
          ? "border-white/30 bg-white/5"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Cover */}
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-12 h-18 md:w-14 md:h-21 object-contain rounded-sm border border-white/10 shrink-0"
        loading="lazy"
        style={{ aspectRatio: "2/3" }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[0.55rem] uppercase tracking-[0.2em] text-white/40 tabular-nums">
            {String(book.editionNumber).padStart(2, "0")}
          </span>
          <span className="text-white/15">·</span>
          <span className="text-[0.55rem] text-white/30">{book.publicationDate.kindle}</span>
          <span className="text-white/15">·</span>
          <span className="text-[0.55rem] text-white/30">{book.language}</span>
        </div>
        <h3 className="font-serif text-sm md:text-base font-bold leading-tight truncate">{book.title}</h3>
        <p className="text-xs text-white/40 truncate">{book.subtitle}</p>
        <p className="text-[0.7rem] text-white/30 line-clamp-1 mt-0.5 hidden sm:block">{book.description}</p>
      </div>

      {/* Buy */}
      <a
        href={book.amazonLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-black text-[0.6rem] font-medium uppercase tracking-widest rounded-sm hover:bg-white/90 transition-all shrink-0"
      >
        <ExternalLink className="h-3 w-3" /> Buy
      </a>
    </div>
  );
}
