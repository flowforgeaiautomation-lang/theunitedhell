import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { X, ExternalLink, BookOpen } from "lucide-react";
import { BOOKS } from "@/lib/editions-data";

const DISMISS_KEY = "tuh-book-anchor-dismissed";
const ROTATION_MS = 17000;
const STORAGE_INDEX_KEY = "tuh-book-anchor-index";

function isDismissed(): boolean {
  try {
    const ts = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (!ts) return false;
    return Date.now() - ts < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function BookAnchorCard() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const pausedRef = useRef(false);
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { book?: string };

  useEffect(() => {
    if (isDismissed()) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

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
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
  }

  function viewBook(slug: string) {
    navigate({ to: "/editions", search: { book: slug } });
  }

  if (!visible) return null;
  const book = BOOKS[index];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-3 pb-3 pointer-events-none"
      role="region"
      aria-label="Featured publication"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 w-full max-w-2xl bg-black border border-white/30 text-white rounded-xl shadow-2xl overflow-hidden"
        style={{ height: "68px" }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
        onFocus={() => { pausedRef.current = true; }}
        onBlur={() => { pausedRef.current = false; }}
      >
        <div className="shrink-0 w-12 h-16 ml-2 border border-white/20 overflow-hidden bg-neutral-900 rounded">
          <img
            src={book.coverImage}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <div className={`flex-1 min-w-0 transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3 w-3 text-white/60 shrink-0" />
            <span className="text-[0.55rem] uppercase tracking-[0.18em] text-white/50">Edition</span>
          </div>
          <div className="font-serif text-sm font-bold leading-tight truncate">{book.title}</div>
          <div className="text-[0.7rem] text-white/60 leading-tight truncate">{book.subtitle}</div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 pr-2">
          <button
            onClick={() => viewBook(book.slug)}
            className="px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider border border-white/40 rounded hover:bg-white hover:text-black transition min-h-[36px]"
            aria-label={`View ${book.title}`}
          >
            View
          </button>
          <a
            href={book.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider bg-white text-black rounded hover:bg-white/90 transition min-h-[36px]"
            aria-label={`Buy ${book.title} on Amazon`}
          >
            Buy <ExternalLink className="h-3 w-3" />
          </a>
          <button
            onClick={dismiss}
            className="p-1.5 text-white/50 hover:text-white transition rounded min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
