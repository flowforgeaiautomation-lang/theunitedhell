import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ExternalLink, BookOpen } from "lucide-react";
import { BOOKS } from "@/lib/editions-data";

const ROTATION_MS = 7000;
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
    }, 300);
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
    <div className="w-full bg-black border-b-2 border-white/30">
      <div className="container-edit">
        <div
          className="flex items-center gap-5 sm:gap-6 py-6 sm:py-7 cursor-pointer select-none group"
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
          <div className="shrink-0 w-20 h-28 sm:w-24 sm:h-34 border-2 border-white/30 overflow-hidden bg-neutral-900 rounded shadow-lg shadow-white/10 group-hover:scale-105 transition-transform duration-300">
            <img
              src={book.coverImage}
              alt=""
              loading="eager"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title + subtitle */}
          <div className={`flex-1 min-w-0 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-white/50 shrink-0" />
              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/40 font-semibold">From the Editions</span>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight truncate">{book.title}</div>
            <div className="text-sm sm:text-base text-white/60 leading-tight truncate hidden sm:block mt-1">{book.subtitle}</div>
          </div>

          {/* CTA */}
          <div className="shrink-0 flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider border-2 border-white/40 text-white rounded group-hover:bg-white group-hover:text-black transition min-h-[48px]">
              View Editions
            </span>
            <a
              href={book.amazonLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold uppercase tracking-wider bg-white text-black rounded hover:bg-white/90 transition min-h-[48px]"
              aria-label={`Buy ${book.title} on Amazon`}
            >
              Buy <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
