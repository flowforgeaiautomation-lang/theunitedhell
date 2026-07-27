import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X, ExternalLink, BookOpen } from "lucide-react";
import { BOOKS } from "@/lib/editions-data";

const ROTATION_MS = 17000;
const STORAGE_INDEX_KEY = "tuh-book-anchor-index";

export function BookAnchorCard() {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const pausedRef = useRef(false);
  const navigate = useNavigate();



  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(STORAGE_INDEX_KEY) || 0);
      if (saved >= 0 && saved < BOOKS.length) setIndex(saved);
    } catch {}
  }, []);

  const rotate = useCallback(() => {
    if (pausedRef.current) return;
    setFade(false);
    setTimeout(() => {
      setIndex((i) => {
        const next = (i + 1) % BOOKS.length;
        try { localStorage.setItem(STORAGE_INDEX_KEY, String(next)); } catch {}
        return next;
      });
      setFade(true);
    }, 350);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(rotate, ROTATION_MS);
    return () => clearInterval(id);
  }, [visible, rotate]);

  function dismiss() {
    setVisible(false);
  }

  function viewBook(slug: string) {
    navigate({ to: "/editions", search: { book: slug } });
  }

  if (!visible) return null;
  const book = BOOKS[index];

  return (
    <div className="w-full bg-black border-b border-white/20">
      <div className="container-edit">
        <div
          className="flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3"
          role="region"
          aria-label="Featured publication"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onFocus={() => { pausedRef.current = true; }}
          onBlur={() => { pausedRef.current = false; }}
        >
          {/* Book cover */}
          <div className="shrink-0 w-10 h-14 sm:w-12 sm:h-16 border border-white/20 overflow-hidden bg-neutral-900 rounded">
            <img
              src={book.coverImage}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title + subtitle */}
          <div className={`flex-1 min-w-0 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3 w-3 text-white/50 shrink-0" />
              <span className="text-[0.5rem] sm:text-[0.55rem] uppercase tracking-[0.18em] text-white/40">From the Editions</span>
            </div>
            <div className="font-serif text-sm sm:text-base font-bold text-white leading-tight truncate">{book.title}</div>
            <div className="text-[0.65rem] sm:text-xs text-white/60 leading-tight truncate hidden sm:block">{book.subtitle}</div>
          </div>

          {/* Buttons */}
          <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => viewBook(book.slug)}
              className="px-2.5 sm:px-3 py-1.5 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider border border-white/40 text-white rounded hover:bg-white hover:text-black transition min-h-[36px]"
              aria-label={`View ${book.title} in Editions`}
            >
              View
            </button>
            <a
              href={book.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider bg-white text-black rounded hover:bg-white/90 transition min-h-[36px]"
              aria-label={`Buy ${book.title} on Amazon`}
            >
              Buy <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={dismiss}
              className="p-1.5 text-white/40 hover:text-white transition rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
