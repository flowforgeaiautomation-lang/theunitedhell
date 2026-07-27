import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, BookOpen } from "lucide-react";
import { BOOKS } from "@/lib/editions-data";

const ROTATION_MS = 17000;
const STORAGE_INDEX_KEY = "tuh-book-anchor-index";

export function BookAnchorCard() {
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
    const id = setInterval(rotate, ROTATION_MS);
    return () => clearInterval(id);
  }, [rotate]);

  function handleClick() {
    navigate({ to: "/editions" });
  }

  const book = BOOKS[index];

  return (
    <div className="w-full bg-black border-b border-white/20">
      <div className="container-edit">
        <div
          className="flex items-center gap-4 sm:gap-5 py-4 sm:py-5 cursor-pointer select-none"
          role="button"
          tabIndex={0}
          aria-label={`View ${book.title} in Editions`}
          onClick={handleClick}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onFocus={() => { pausedRef.current = true; }}
          onBlur={() => { pausedRef.current = false; }}
        >
          {/* Book cover */}
          <div className="shrink-0 w-14 h-20 sm:w-16 sm:h-24 border border-white/20 overflow-hidden bg-neutral-900 rounded">
            <img
              src={book.coverImage}
              alt=""
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title + subtitle */}
          <div className={`flex-1 min-w-0 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-white/50 shrink-0" />
              <span className="text-[0.6rem] sm:text-xs uppercase tracking-[0.18em] text-white/40">From the Editions</span>
            </div>
            <div className="font-serif text-lg sm:text-xl font-bold text-white leading-tight truncate">{book.title}</div>
            <div className="text-xs sm:text-sm text-white/60 leading-tight truncate hidden sm:block">{book.subtitle}</div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/40 text-white rounded hover:bg-white hover:text-black transition min-h-[40px]">
              View Editions
            </span>
            <a
              href={book.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-white text-black rounded hover:bg-white/90 transition min-h-[40px]"
              aria-label={`Buy ${book.title} on Amazon`}
            >
              Buy <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
