import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  type ReadingPreferences,
  DEFAULT_READING_PREFS,
} from "@/lib/reading-prefs";

const LS_KEY = "tuh-reading-prefs";

function loadFromLS(): Partial<ReadingPreferences> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToLS(prefs: ReadingPreferences) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(prefs));
  } catch {}
}

/**
 * useReadingPrefs — single source of truth for reading preferences.
 * - Logged-out: localStorage only.
 * - Logged-in: Supabase reading_preferences table (synced across devices).
 * - On login: migrates any localStorage prefs into Supabase, then clears LS.
 */
export function useReadingPrefs() {
  const [prefs, setPrefs] = useState<ReadingPreferences>(DEFAULT_READING_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (cancelled) return;
      const isSignedIn = !!sessionData.session;
      setSignedIn(isSignedIn);

      if (isSignedIn) {
        // Try to load from Supabase
        const { data, error } = await supabase
          .from("reading_preferences")
          .select("prefs")
          .maybeSingle();

        if (!cancelled && data?.prefs && !error) {
          const merged = { ...DEFAULT_READING_PREFS, ...(data.prefs as Partial<ReadingPreferences>) };
          setPrefs(merged);
        } else if (!cancelled) {
          // Migrate from localStorage if present
          const ls = loadFromLS();
          if (Object.keys(ls).length > 0) {
            const merged = { ...DEFAULT_READING_PREFS, ...ls };
            setPrefs(merged);
            await supabase.from("reading_preferences").upsert({
              user_id: sessionData.session!.user.id,
              prefs: merged,
            });
            window.localStorage.removeItem(LS_KEY);
          }
        }
      } else {
        // Not signed in — load from localStorage
        const ls = loadFromLS();
        if (!cancelled) {
          setPrefs({ ...DEFAULT_READING_PREFS, ...ls });
        }
      }
      if (!cancelled) setLoaded(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (event === "SIGNED_IN" && session) {
          setSignedIn(true);
          const ls = loadFromLS();
          const { data } = await supabase
            .from("reading_preferences")
            .select("prefs")
            .maybeSingle();
          if (data?.prefs) {
            const merged = { ...DEFAULT_READING_PREFS, ...(data.prefs as Partial<ReadingPreferences>), ...ls };
            setPrefs(merged);
            await supabase.from("reading_preferences").upsert({
              user_id: session.user.id,
              prefs: merged,
            });
            window.localStorage.removeItem(LS_KEY);
          } else if (Object.keys(ls).length > 0) {
            const merged = { ...DEFAULT_READING_PREFS, ...ls };
            setPrefs(merged);
            await supabase.from("reading_preferences").upsert({
              user_id: session.user.id,
              prefs: merged,
            });
            window.localStorage.removeItem(LS_KEY);
          }
        } else if (event === "SIGNED_OUT") {
          setSignedIn(false);
          setPrefs({ ...DEFAULT_READING_PREFS, ...loadFromLS() });
        }
      })();
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Persist on change (debounced)
  const update = useCallback(
    (patch: Partial<ReadingPreferences>) => {
      setPrefs((prev) => {
        const next = { ...prev, ...patch };
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          if (signedIn) {
            const { data: s } = await supabase.auth.getSession();
            if (s.session) {
              await supabase.from("reading_preferences").upsert({
                user_id: s.session.user.id,
                prefs: next,
                updated_at: new Date().toISOString(),
              });
            }
          } else {
            saveToLS(next);
          }
        }, 300);
        return next;
      });
    },
    [signedIn]
  );

  const reset = useCallback(() => {
    setPrefs(DEFAULT_READING_PREFS);
    if (signedIn) {
      (async () => {
        const { data: s } = await supabase.auth.getSession();
        if (s.session) {
          await supabase.from("reading_preferences").upsert({
            user_id: s.session.user.id,
            prefs: DEFAULT_READING_PREFS,
            updated_at: new Date().toISOString(),
          });
        }
      })();
    } else {
      window.localStorage.removeItem(LS_KEY);
    }
  }, [signedIn]);

  const exportPrefs = useCallback(() => {
    const blob = new Blob([JSON.stringify(prefs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tuh-reading-prefs.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [prefs]);

  const importPrefs = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      const merged = { ...DEFAULT_READING_PREFS, ...parsed };
      update(merged);
    } catch {
      throw new Error("Invalid preferences file");
    }
  }, [update]);

  return { prefs, update, reset, exportPrefs, importPrefs, loaded, signedIn };
}
