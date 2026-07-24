import { useEffect, useState } from "react";
import { Type, AlignLeft, Eye, Accessibility, X } from "lucide-react";

type FontSize = "small" | "medium" | "large" | "xlarge";
type LineSpacing = "compact" | "normal" | "relaxed" | "loose";

const FONT_SIZES: Record<FontSize, string> = {
  small: "15px",
  medium: "17px",
  large: "19px",
  xlarge: "21px",
};

const LINE_SPACINGS: Record<LineSpacing, string> = {
  compact: "1.4",
  normal: "1.6",
  relaxed: "1.8",
  loose: "2.0",
};

export function AccessibilitySettings() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [lineSpacing, setLineSpacing] = useState<LineSpacing>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("tuh-a11y");
    if (saved) {
      try {
        const prefs = JSON.parse(saved);
        setFontSize(prefs.fontSize ?? "medium");
        setLineSpacing(prefs.lineSpacing ?? "normal");
        setHighContrast(prefs.highContrast ?? false);
        setDyslexiaFont(prefs.dyslexiaFont ?? false);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const prefs = { fontSize, lineSpacing, highContrast, dyslexiaFont };
    window.localStorage.setItem("tuh-a11y", JSON.stringify(prefs));
    applyPrefs(prefs);
  }, [fontSize, lineSpacing, highContrast, dyslexiaFont]);

  function applyPrefs(prefs: typeof fontSize extends never ? never : { fontSize: FontSize; lineSpacing: LineSpacing; highContrast: boolean; dyslexiaFont: boolean }) {
    const root = document.documentElement;
    root.style.setProperty("--article-font-size", FONT_SIZES[prefs.fontSize]);
    root.style.setProperty("--article-line-height", LINE_SPACINGS[prefs.lineSpacing]);
    root.classList.toggle("tuh-high-contrast", prefs.highContrast);
    root.classList.toggle("tuh-dyslexia-font", prefs.dyslexiaFont);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Accessibility settings"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-background shadow-lg hover:bg-foreground hover:text-background transition"
      >
        <Accessibility className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/20" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-lg border rule bg-background p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl flex items-center gap-2"><Accessibility className="h-5 w-5" /> Reading Settings</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="kicker mb-3 flex items-center gap-2"><Type className="h-3.5 w-3.5" /> Font Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["small", "medium", "large", "xlarge"] as FontSize[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setFontSize(s)}
                      className={`border rule py-2 text-sm capitalize transition ${fontSize === s ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/[0.05]"}`}
                    >
                      {s === "xlarge" ? "X-Large" : s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="kicker mb-3 flex items-center gap-2"><AlignLeft className="h-3.5 w-3.5" /> Line Spacing</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["compact", "normal", "relaxed", "loose"] as LineSpacing[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setLineSpacing(s)}
                      className={`border rule py-2 text-sm capitalize transition ${lineSpacing === s ? "bg-foreground text-background border-foreground" : "hover:bg-foreground/[0.05]"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`flex w-full items-center justify-between border rule px-4 py-3 transition ${highContrast ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
                >
                  <span className="flex items-center gap-2 text-sm"><Eye className="h-4 w-4" /> High Contrast Mode</span>
                  <span className={`h-5 w-9 rounded-full border transition relative ${highContrast ? "bg-background/30" : "bg-foreground/10"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-current transition-all ${highContrast ? "left-4" : "left-0.5"}`} />
                  </span>
                </button>

                <button
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  className={`flex w-full items-center justify-between border rule px-4 py-3 transition ${dyslexiaFont ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
                >
                  <span className="flex items-center gap-2 text-sm"><Type className="h-4 w-4" /> Dyslexia-Friendly Font</span>
                  <span className={`h-5 w-9 rounded-full border transition relative ${dyslexiaFont ? "bg-background/30" : "bg-foreground/10"}`}>
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-current transition-all ${dyslexiaFont ? "left-4" : "left-0.5"}`} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
