import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, ChevronRight, ChevronLeft, BookOpen, Clock, Globe, Calendar, FileText, Check, User } from "lucide-react";
import { getBookBySlug, getRelatedBooks, BOOKS, AUTHOR } from "@/lib/editions-data";
import { canonicalUrl, SITE_NAME } from "@/lib/seo";

export const Route = createFileRoute("/editions/$slug")({
  head: ({ params }) => {
    const book = getBookBySlug(params.slug);
    if (!book) return { meta: [], links: [] };
    return {
      meta: [
        { title: `${book.title} | Altair Veda` },
        { name: "description", content: book.description },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: `${book.title} — ${book.subtitle}` },
        { property: "og:description", content: book.description },
        { property: "og:type", content: "book" },
        { property: "og:url", content: canonicalUrl(`/editions/${book.slug}`) },
        { property: "og:image", content: book.coverImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${book.title} | Altair Veda` },
        { name: "twitter:description", content: book.description },
      ],
      links: [{ rel: "canonical", href: canonicalUrl(`/editions/${book.slug}`) }],
    };
  },
  component: BookDetailPage,
  notFoundComponent: () => (
    <div className="max-w-2xl mx-auto py-20 text-center px-4">
      <h1 className="font-serif text-2xl mb-4">Edition not found</h1>
      <Link to="/editions" className="text-white/60 hover:text-white underline underline-offset-4 text-sm">Back to Editions</Link>
    </div>
  ),
});

function BookDetailPage() {
  const { slug } = Route.useParams();
  const book = getBookBySlug(slug);
  if (!book) return null;

  const related = getRelatedBooks(slug);
  const seriesIndex = book.seriesOrder - 1;
  const prevBook = seriesIndex > 0 ? BOOKS[seriesIndex - 1] : null;
  const nextBook = seriesIndex < BOOKS.length - 1 ? BOOKS[seriesIndex + 1] : null;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b border-white/10 px-4 py-3">
        <nav className="max-w-4xl mx-auto flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
          <Link to="/" search={{ category: undefined }} className="hover:text-white">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/editions" className="hover:text-white">Editions</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/70">{book.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="px-4 py-8 md:py-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[200px_1fr] gap-6 md:gap-10 items-start">
          <div className="mx-auto md:mx-0">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-40 h-60 md:w-48 md:h-72 object-contain rounded-sm border border-white/15"
              loading="eager"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3">
              <BookOpen className="h-3 w-3 text-white/40" strokeWidth={1.5} />
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40">
                Edition {String(book.editionNumber).padStart(2, "0")} · {book.series}
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-2">{book.title}</h1>
            <p className="text-base text-white/50 font-serif italic mb-4">{book.subtitle}</p>

            <div className="flex items-center gap-3 mb-4">
              <img src={AUTHOR.logo} alt={AUTHOR.name} className="w-7 h-7 rounded-full border border-white/15 object-cover" />
              <span className="text-sm text-white/60">by <Link to="/editions" className="text-white hover:underline">{AUTHOR.name}</Link></span>
            </div>

            <p className="text-sm text-white/60 leading-relaxed max-w-lg mb-5">{book.description}</p>

            <div className="grid grid-cols-2 gap-2 mb-5 max-w-md">
              {[
                { icon: Clock, label: "Reading Time", value: book.readingTime },
                { icon: Globe, label: "Language", value: book.language },
                { icon: Calendar, label: "Published", value: book.publicationDate.kindle },
                { icon: FileText, label: "Pages", value: book.pages.kindle },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2 p-2.5 border border-white/10 rounded-sm">
                  <m.icon className="h-3.5 w-3.5 text-white/40 shrink-0" strokeWidth={1.5} />
                  <div>
                    <div className="text-[0.5rem] uppercase tracking-[0.15em] text-white/30">{m.label}</div>
                    <div className="text-xs text-white/70">{m.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={book.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-medium uppercase tracking-[0.15em] rounded-sm hover:bg-white/90 transition-all"
            >
              Buy on Amazon <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <div className="flex flex-wrap gap-1.5 mt-4">
              {book.formats.filter((f) => f.available).map((f) => (
                <span key={f.type} className="px-2.5 py-1 text-[0.55rem] uppercase tracking-widest border border-white/15 text-white/50 rounded-sm">
                  {f.type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Description */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="About the Book" />
          <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{book.fullDescription}</p>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="What You'll Learn" />
          <ul className="grid sm:grid-cols-2 gap-2">
            {book.whatYouWillLearn.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                <Check className="h-3.5 w-3.5 text-white/40 shrink-0 mt-0.5" strokeWidth={1.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Topics */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="Key Topics" />
          <div className="flex flex-wrap gap-1.5">
            {book.keyTopics.map((t) => (
              <span key={t} className="px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.12em] border border-white/15 text-white/50 rounded-sm hover:border-white/30 hover:text-white/70 transition">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="Who Should Read This" />
          <ul className="space-y-2">
            {book.targetAudience.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                <User className="h-3.5 w-3.5 text-white/40 shrink-0 mt-0.5" strokeWidth={1.5} />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Read */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="Why Read This Book" />
          <p className="text-sm text-white/60 leading-relaxed">{book.whyRead}</p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="Table of Contents" />
          <ol className="space-y-1.5">
            {book.tableOfContents.map((ch, i) => (
              <li key={i} className="flex items-baseline gap-3 border-b border-white/5 pb-1.5">
                <span className="font-serif text-base text-white/30 tabular-nums w-7">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm text-white/60">{ch}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Reading Level */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="Reading Level" />
          <p className="text-sm text-white/60 leading-relaxed">{book.readingLevel}</p>
        </div>
      </section>

      {/* Series */}
      <section className="px-4 py-8 border-t border-white/10">
        <div className="max-w-2xl mx-auto">
          <Divider label="The Powerful Mind Series" />
          <div className="space-y-1">
            {BOOKS.map((b) => (
              <Link
                key={b.slug}
                to="/editions/$slug"
                params={{ slug: b.slug }}
                className={`flex items-center gap-3 p-2.5 border rounded-sm transition ${b.slug === slug ? "border-white/25 bg-white/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}`}
              >
                <img src={b.coverImage} alt={b.title} className="w-8 h-12 object-contain rounded-sm border border-white/10" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.5rem] uppercase tracking-widest text-white/40">Book {b.seriesOrder}</div>
                  <div className={`font-serif text-sm font-bold truncate ${b.slug === slug ? "text-white" : "text-white/70"}`}>{b.title}</div>
                </div>
                {b.slug === slug && <span className="text-[0.5rem] uppercase tracking-widest text-white/50">Current</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="px-4 py-8 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <Divider label="Related Editions" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((b) => (
                <Link key={b.slug} to="/editions/$slug" params={{ slug: b.slug }} className="group">
                  <img src={b.coverImage} alt={b.title} className="w-full aspect-[2/3] object-contain rounded-sm border border-white/10 group-hover:border-white/25 transition" loading="lazy" />
                  <h3 className="font-serif text-xs font-bold mt-2 group-hover:text-white/90 transition text-white/70">{b.title}</h3>
                  <p className="text-[0.6rem] text-white/30 truncate">{b.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Author */}
      <section className="px-4 py-8 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <img src={AUTHOR.logo} alt={AUTHOR.name} className="w-16 h-16 rounded-full border border-white/15 object-cover mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold mb-2">{AUTHOR.name}</h3>
          <p className="text-sm text-white/50 leading-relaxed line-clamp-3 max-w-md mx-auto mb-3">{AUTHOR.shortBio}</p>
          <Link to="/editions" className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition">
            View Author <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </section>

      {/* Prev/Next */}
      <section className="px-4 py-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto flex justify-between gap-3">
          {prevBook ? (
            <Link to="/editions/$slug" params={{ slug: prevBook.slug }} className="group flex items-center gap-2 p-3 border border-white/10 rounded-sm hover:border-white/20 transition flex-1">
              <ChevronLeft className="h-4 w-4 text-white/40 group-hover:text-white transition" />
              <div>
                <div className="text-[0.5rem] uppercase tracking-widest text-white/30">Previous</div>
                <div className="font-serif text-sm text-white/70 group-hover:text-white transition">{prevBook.title}</div>
              </div>
            </Link>
          ) : <div className="flex-1" />}
          {nextBook ? (
            <Link to="/editions/$slug" params={{ slug: nextBook.slug }} className="group flex items-center gap-2 p-3 border border-white/10 rounded-sm hover:border-white/20 transition flex-1 text-right justify-end">
              <div>
                <div className="text-[0.5rem] uppercase tracking-widest text-white/30">Next</div>
                <div className="font-serif text-sm text-white/70 group-hover:text-white transition">{nextBook.title}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white transition" />
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </section>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white/40">{label}</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}
