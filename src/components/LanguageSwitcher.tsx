import { useEffect, useState, useRef } from "react";
import { Globe, Search, Check, X } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tuh-language") || "en";
    setCurrent(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === "ar" || saved === "he" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const selectLanguage = (code: string) => {
    setCurrent(code);
    localStorage.setItem("tuh-language", code);
    document.documentElement.lang = code;
    document.documentElement.dir = code === "ar" || code === "he" ? "rtl" : "ltr";
    window.dispatchEvent(new Event("tuh-preferences"));
    setOpen(false);
    if (code !== "en") {
      window.dispatchEvent(new CustomEvent("tuh-language-change", { detail: { language: code } }));
    }
  };

  const filtered = LANGUAGES.filter((l) => {
    const q = search.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q) || l.code.includes(q);
  });

  const currentLang = LANGUAGES.find((l) => l.code === current) || LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-1.5 hover:bg-foreground/[0.08] rounded-sm transition"
        aria-label="Change language"
        title={`Language: ${currentLang.name}`}
      >
        <Globe className="h-4 w-4" />
        {!compact && <span className="text-xs uppercase tracking-widest hidden lg:inline">{currentLang.code}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 border rule bg-background shadow-xl rounded-sm z-50 animate-fade-in">
          <div className="p-3 border-b rule">
            <div className="flex items-center gap-2 border rule px-2 py-1.5 rounded-sm">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search languages..."
                className="bg-transparent text-sm outline-none flex-1"
                autoFocus
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map((l) => (
              <button
                key={l.code}
                onClick={() => selectLanguage(l.code)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-foreground/[0.05] transition text-left ${l.code === current ? "bg-foreground/[0.03]" : ""}`}
              >
                <span className="text-lg">{l.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{l.nativeName}</div>
                  <div className="text-xs text-muted-foreground">{l.name}</div>
                </div>
                {l.code === current && <Check className="h-4 w-4 text-foreground" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
