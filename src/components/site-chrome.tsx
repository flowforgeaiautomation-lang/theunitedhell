import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Search, Moon, Sun, Menu, X, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PanchangDisplay } from "./PanchangDisplay";
import { SubNav } from "./SubNav";

// Translation handled by browser's built-in "Translate page" (three-dot menu).

const LOCATIONS = [
  { code: "WORLD", label: "World" },
  { code: "IN", label: "India" },
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "CN", label: "China" },
  { code: "JP", label: "Japan" },
  { code: "BR", label: "Brazil" },
  { code: "AE", label: "UAE" },
  { code: "SG", label: "Singapore" },
  { code: "ZA", label: "South Africa" },
];

const NAV = [
  { to: "/", label: "Today" },
  { to: "/briefing", label: "Daily Briefing" },
  { to: "/discover", label: "Discover" },
  { to: "/world", label: "World" },
  { to: "/trending", label: "Trending" },
  { to: "/information", label: "Information" },
];

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [location, setLocation] = useState("WORLD");
  const router = useRouter();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const t = window.localStorage.getItem("tuh-theme");
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    const loc = window.localStorage.getItem("tuh-country") || "WORLD";
    setLocation(loc);
  }, []);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => mounted && setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 100) {
          if (currentScrollY > lastScrollY && !isHidden) setIsHidden(true);
          else if (currentScrollY < lastScrollY && isHidden) setIsHidden(false);
        } else {
          setIsHidden(false);
        }
        setLastScrollY(currentScrollY);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [lastScrollY, isHidden]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("tuh-theme", next ? "dark" : "light");
  }

  function updateLocation(next: string) {
    setLocation(next);
    window.localStorage.setItem("tuh-country", next);
    window.dispatchEvent(new Event("tuh-preferences"));
  }

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className={`border-b rule bg-background/95 backdrop-blur sticky top-0 z-40 transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container-edit">
        {/* Masthead */}
        <div className="flex items-center justify-between py-4 md:py-6 gap-3">
          {/* Left side */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            {/* Desktop date */}
            <div className="hidden md:block">
              <PanchangDisplay />
            </div>
            {/* Mobile / tablet hamburger */}
            <button
              aria-label="menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 border border-foreground/30 hover:bg-foreground hover:text-background transition"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Center: Title */}
          <div className="flex-1 flex items-center justify-center text-center">
            <Link to="/" className="inline-block">
              <div className="font-serif text-2xl md:text-5xl font-semibold tracking-tight leading-tight uppercase whitespace-nowrap">
                THE UNITED HELL
              </div>
              <div className="dek text-[0.65rem] md:text-sm mt-1 not-italic font-sans tracking-wide text-muted-foreground">
                Beyond comfort. Beyond headlines.
              </div>
            </Link>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <select
              aria-label="Location"
              value={location}
              onChange={(e) => updateLocation(e.target.value)}
              className="bg-background border rule px-2 py-1 text-[0.65rem] uppercase tracking-widest"
            >
              {LOCATIONS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <Link to="/search" aria-label="search" className="hidden md:inline-block p-2 hover:opacity-70">
              <Search className="h-4 w-4" />
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="theme"
              className="hidden md:inline-block p-2 hover:opacity-70"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {signedIn ? (
              <Link to="/profile" className="hidden md:inline-block p-2 hover:opacity-70" aria-label="profile">
                <User className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/auth"
                className="ml-1 hidden md:inline-block border border-foreground px-3 py-1.5 text-xs font-medium uppercase tracking-widest hover:bg-foreground hover:text-background transition"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Desktop primary nav — unchanged */}
        <nav className="hidden md:block border-t rule">
          <ul className="flex md:justify-center md:gap-10 py-3 text-[0.82rem] uppercase tracking-[0.18em] font-medium">
            {NAV.map((n) => {
              const active = router.state.location.pathname === n.to;
              return (
                <li key={n.to}>
                  <Link
                    to={n.to}
                    className={`block py-1 hover:opacity-60 ${active ? "underline underline-offset-8 decoration-1" : ""}`}
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
            {signedIn && (
              <li>
                <Link to="/bookmarks" className="block py-1 hover:opacity-60">
                  Library
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile / tablet hamburger panel */}
        {open && (
          <div className="md:hidden border-t rule py-5">
            {/* Date */}
            <div className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground mb-5">
              {dateLabel}
            </div>
            <ul className="flex flex-col gap-4 text-[0.82rem] uppercase tracking-[0.18em] font-medium">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} onClick={() => setOpen(false)} className="block py-1 hover:opacity-60">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/search" onClick={() => setOpen(false)} className="flex items-center gap-3 py-1 hover:opacity-60">
                  <Search className="h-4 w-4" /> Search
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="flex items-center gap-3 py-1 hover:opacity-60 w-full text-left uppercase tracking-[0.18em]"
                >
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Dark
                </button>
              </li>
              <li>
                {signedIn ? (
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-1 hover:opacity-60"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-1 hover:opacity-60"
                  >
                    <User className="h-4 w-4" /> Sign in
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Site-wide subnav (Menu dropdown + Categories popup) on every page */}
      <SubNav />
    </header>
  );
}

interface SiteFooterProps {
  signedIn?: boolean;
}

export function SiteFooter({ signedIn = false }: SiteFooterProps) {
  return (
    <footer className="border-t rule mt-24 py-12">
      <div className="container-edit grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl font-semibold tracking-tight leading-none">The United Hell</div>
          <p className="dek mt-2 max-w-md">
            The United Hell brings together the world's most important stories, discoveries, civilizations, innovations, and ideas — transforming information into understanding, curiosity into exploration, and knowledge into progress.
          </p>
        </div>
        <div>
          <div className="kicker mb-3">Sections</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/briefing" className="hover:underline">Daily Earth Briefing</Link></li>
            <li><Link to="/discover" className="hover:underline">Discover</Link></li>
            <li><Link to="/world" className="hover:underline">World</Link></li>
            <li><Link to="/trending" className="hover:underline">Trending</Link></li>
            <li><Link to="/information" className="hover:underline">Information & Policies</Link></li>
          </ul>
        </div>
        <div>
          <div className="kicker mb-3">Account</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/bookmarks" className="hover:underline">My Library</Link></li>
            <li><Link to="/profile" className="hover:underline">Profile</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-edit mt-10 pt-6 border-t rule flex flex-col gap-2 text-xs text-muted-foreground text-center md:text-left">
        <div>© {new Date().getFullYear()} The United Hell.</div>
        <div>Exploring the world through knowledge, discovery, and truth.</div>
        <div>Powered by verified sources, human oversight, and artificial intelligence.</div>
        <div>All rights reserved.</div>
      </div>
    </footer>
  );
}
