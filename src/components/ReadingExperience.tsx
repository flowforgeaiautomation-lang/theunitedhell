import { useEffect, useState, useRef, useCallback } from "react";
import { useReadingPrefs } from "@/hooks/use-reading-prefs";
import { supabase } from "@/integrations/supabase/client";
import { type ReadingNote } from "@/lib/reading-prefs";

/**
 * ReadingExperience — invisible controller that adds reading features to the article page.
 * Renders: progress bar, reading ruler, auto-scroll, wake lock, scroll position memory,
 * focus timer, paragraph highlight, narration, text selection for notes.
 * Place once inside the article page, scoped to the article content element.
 */
export function ReadingExperience({
  articleSlug,
  articleContentRef,
  readingTimeSeconds,
}: {
  articleSlug: string;
  articleContentRef: React.RefObject<HTMLElement | null>;
  readingTimeSeconds: number;
}) {
  const { prefs, loaded, signedIn } = useReadingPrefs();
  const [progress, setProgress] = useState(0);
  const [readSeconds, setReadSeconds] = useState(0);
  const [rulerY, setRulerY] = useState(0);
  const [showNoteMenu, setShowNoteMenu] = useState(false);
  const [noteMenuPos, setNoteMenuPos] = useState({ x: 0, y: 0 });
  const [savedNotes, setSavedNotes] = useState<ReadingNote[]>([]);
  const wakeLockRef = useRef<any>(null);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressSavedRef = useRef(false);

  // Load saved notes for this article
  useEffect(() => {
    if (!signedIn) return;
    (async () => {
      const { data } = await supabase
        .from("reading_notes")
        .select("id, article_slug, selected_text, note, color, created_at")
        .eq("article_slug", articleSlug);
      if (data) setSavedNotes(data as ReadingNote[]);
    })();
  }, [signedIn, articleSlug]);

  // Reading progress bar
  useEffect(() => {
    if (!prefs.readingProgressBar) {
      setProgress(0);
      return;
    }
    function onScroll() {
      const el = articleContentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [prefs.readingProgressBar, articleContentRef]);

  // Reading time tracker
  useEffect(() => {
    if (!prefs.focusTimer && !prefs.continueWhereLeftOff) return;
    readTimerRef.current = setInterval(() => {
      setReadSeconds((s) => s + 1);
    }, 1000);
    return () => { if (readTimerRef.current) clearInterval(readTimerRef.current); };
  }, [prefs.focusTimer, prefs.continueWhereLeftOff]);

  // Save reading progress periodically
  useEffect(() => {
    if (!signedIn || !prefs.continueWhereLeftOff) return;
    const interval = setInterval(async () => {
      if (progress > 0) {
        await supabase.from("reading_progress").upsert({
          article_slug: articleSlug,
          scroll_percent: Math.round(progress),
          read_seconds: readSeconds,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id,article_slug" });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [signedIn, prefs.continueWhereLeftOff, progress, readSeconds, articleSlug]);

  // Restore scroll position
  useEffect(() => {
    if (!signedIn || !prefs.rememberScrollPosition || !loaded) return;
    (async () => {
      const { data } = await supabase
        .from("reading_progress")
        .select("scroll_percent")
        .eq("article_slug", articleSlug)
        .maybeSingle();
      if (data?.scroll_percent && data.scroll_percent > 5) {
        const el = articleContentRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const target = window.scrollY + rect.top + (rect.height * data.scroll_percent / 100) - window.innerHeight / 2;
          window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
        }
      }
    })();
  }, [signedIn, prefs.rememberScrollPosition, loaded, articleSlug]);

  // Auto scroll
  useEffect(() => {
    if (!prefs.autoScroll) {
      if (autoScrollRef.current) { clearInterval(autoScrollRef.current); autoScrollRef.current = null; }
      return;
    }
    const pxPerSec = prefs.scrollSpeed * 20;
    autoScrollRef.current = setInterval(() => {
      window.scrollBy({ top: pxPerSec / 10, behavior: "auto" });
    }, 100);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [prefs.autoScroll, prefs.scrollSpeed]);

  // Wake lock
  useEffect(() => {
    if (!prefs.keepScreenAwake) {
      if (wakeLockRef.current) { wakeLockRef.current.release(); wakeLockRef.current = null; }
      return;
    }
    let active = true;
    (async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        }
      } catch {}
    })();
    return () => {
      active = false;
      if (wakeLockRef.current) { wakeLockRef.current.release(); wakeLockRef.current = null; }
    };
  }, [prefs.keepScreenAwake]);

  // Reading ruler
  useEffect(() => {
    if (!prefs.readingRuler) return;
    function onMove(e: MouseEvent) {
      setRulerY(e.clientY - 40);
    }
    window.addEventListener("mousemove", onMove);
    document.documentElement.classList.add("tuh-reading-ruler-active");
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("tuh-reading-ruler-active");
    };
  }, [prefs.readingRuler]);

  // Highlight current paragraph
  useEffect(() => {
    if (!prefs.highlightCurrentParagraph) return;
    const el = articleContentRef.current;
    if (!el) return;
    const paragraphs = el.querySelectorAll("p");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            paragraphs.forEach((p) => p.classList.remove("tuh-current-paragraph"));
            entry.target.classList.add("tuh-current-paragraph");
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    paragraphs.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, [prefs.highlightCurrentParagraph, articleContentRef]);

  // Text selection for notes
  useEffect(() => {
    if (!prefs.enableTextHighlighting) return;
    function onMouseUp(e: MouseEvent) {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.toString().trim().length < 3) {
        setShowNoteMenu(false);
        return;
      }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setNoteMenuPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
      setShowNoteMenu(true);
    }
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [prefs.enableTextHighlighting]);

  const saveNote = useCallback(async () => {
    const sel = window.getSelection();
    if (!sel || sel.toString().trim().length < 3) return;
    const text = sel.toString().trim();
    if (signedIn) {
      const { data } = await supabase
        .from("reading_notes")
        .insert({ article_slug: articleSlug, selected_text: text })
        .select("id, article_slug, selected_text, note, color, created_at")
        .single();
      if (data) setSavedNotes((n) => [...n, data as ReadingNote]);
    } else {
      const note: ReadingNote = {
        id: crypto.randomUUID(),
        article_slug: articleSlug,
        selected_text: text,
        note: null,
        color: "yellow",
        created_at: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem("tuh-reading-notes") || "[]");
      existing.push(note);
      localStorage.setItem("tuh-reading-notes", JSON.stringify(existing));
      setSavedNotes((n) => [...n, note]);
    }
    setShowNoteMenu(false);
    window.getSelection()?.removeAllRanges();
  }, [articleSlug, signedIn]);

  const copySelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel) {
      navigator.clipboard.writeText(sel.toString());
      setShowNoteMenu(false);
    }
  }, []);

  const shareQuote = useCallback(() => {
    const sel = window.getSelection();
    if (!sel) return;
    const text = `"${sel.toString()}" — The United Hell`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
    setShowNoteMenu(false);
  }, []);

  const pronounceWord = useCallback(() => {
    const sel = window.getSelection();
    if (!sel) return;
    const utter = new SpeechSynthesisUtterance(sel.toString().trim());
    utter.rate = prefs.narrationSpeed;
    window.speechSynthesis.speak(utter);
    setShowNoteMenu(false);
  }, [prefs.narrationSpeed]);

  const readAloud = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.toString().trim().length < 3) return;
    const utter = new SpeechSynthesisUtterance(sel.toString().trim());
    utter.rate = prefs.narrationSpeed;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setShowNoteMenu(false);
  }, [prefs.narrationSpeed]);

  if (!loaded) return null;

  return (
    <>
      {/* Reading progress bar */}
      {prefs.readingProgressBar && (
        <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
      )}

      {/* Reading ruler */}
      {prefs.readingRuler && (
        <div className="reading-ruler" style={{ top: `${rulerY}px` }} />
      )}

      {/* Focus timer display */}
      {prefs.focusTimer && (
        <div className="fixed bottom-6 left-6 z-40 border rule bg-background px-3 py-2 text-xs tabular-nums rounded-sm shadow-sm">
          {Math.floor(readSeconds / 60)}:{String(readSeconds % 60).padStart(2, "0")} read
          {readingTimeSeconds > 0 && (
            <span className="text-muted-foreground ml-2">
              ~{Math.max(0, Math.ceil((readingTimeSeconds - readSeconds) / 60))} min left
            </span>
          )}
        </div>
      )}

      {/* Text selection menu */}
      {showNoteMenu && (
        <div
          className="fixed z-50 flex gap-1 border rule bg-background shadow-lg rounded-sm p-1"
          style={{ left: `${noteMenuPos.x}px`, top: `${noteMenuPos.y}px`, transform: "translate(-50%, -100%)" }}
        >
          <button onClick={saveNote} className="px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm" title="Save as note">Save</button>
          <button onClick={copySelection} className="px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm" title="Copy">Copy</button>
          <button onClick={shareQuote} className="px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm" title="Share">Share</button>
          <button onClick={pronounceWord} className="px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm" title="Pronounce">Say</button>
          <button onClick={readAloud} className="px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm" title="Read aloud">Read</button>
        </div>
      )}

      {/* Saved notes list (if any) */}
      {savedNotes.length > 0 && (
        <div className="mt-8 border-t rule pt-6 tuh-hide-on-focus">
          <div className="kicker mb-3">Your notes &amp; highlights</div>
          <div className="space-y-2">
            {savedNotes.map((n) => (
              <div key={n.id} className="border-l-2 border-foreground/30 pl-3 text-sm">
                <p className="italic text-muted-foreground">&ldquo;{n.selected_text}&rdquo;</p>
                {n.note && <p className="mt-1">{n.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
