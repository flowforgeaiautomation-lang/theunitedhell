import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { translateVisibleText } from "@/lib/translation.functions";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "NOSCRIPT"]);

function currentLanguage() {
  return window.localStorage.getItem("tuh-language") || "en";
}

function showTranslationBanner(msg: string, isError: boolean) {
  const existing = document.getElementById("tuh-translation-banner");
  if (existing) existing.remove();
  const banner = document.createElement("div");
  banner.id = "tuh-translation-banner";
  banner.style.cssText = `position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:9999;padding:8px 20px;border-radius:6px;font-size:14px;font-family:system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.15);${isError ? "background:#fee;color:#c33;border:1px solid #c33;" : "background:#1f1b16;color:#fbf8f0;border:1px solid #1f1b16;"}transition:opacity 0.3s;`;
  banner.textContent = msg;
  document.body.appendChild(banner);
  if (isError) setTimeout(() => { banner.style.opacity = "0"; setTimeout(() => banner.remove(), 300); }, 4000);
}

function removeTranslationBanner() {
  const existing = document.getElementById("tuh-translation-banner");
  if (existing) existing.remove();
}

export function useLiveTranslation() {
  const translate = useServerFn(translateVisibleText);
  const router = useRouter();
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let scheduled: number | null = null;

    async function applyTranslation() {
      const lang = currentLanguage();
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" || lang === "he" ? "rtl" : "ltr";

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          const text = node.textContent?.trim() ?? "";
          if (!parent || SKIP_TAGS.has(parent.tagName) || text.length < 2 || /^\d+$/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);

      if (lang === "en") {
        for (const node of nodes) {
          const original = node.parentElement?.dataset.originalText;
          if (original) node.textContent = original;
        }
        removeTranslationBanner();
        return;
      }

      const originals = nodes.map((node) => {
        const parent = node.parentElement!;
        if (!parent.dataset.originalText) parent.dataset.originalText = node.textContent?.trim() ?? "";
        return parent.dataset.originalText;
      });
      const unique = [...new Set(originals)];
      if (!unique.length) return;

      setTranslating(true);
      showTranslationBanner("Translating…", false);

      const allTranslations: Record<string, string> = {};
      const BATCH = 50;
      let failedBatches = 0;
      const totalBatches = Math.ceil(unique.length / BATCH);

      for (let i = 0; i < unique.length; i += BATCH) {
        const batch = unique.slice(i, i + BATCH);
        try {
          const result = await translate({ data: { target: lang as never, texts: batch } });
          if (cancelled) return;
          Object.assign(allTranslations, result);
          for (const node of nodes) {
            const original = node.parentElement?.dataset.originalText;
            if (original && allTranslations[original]) node.textContent = allTranslations[original];
          }
        } catch (err) {
          failedBatches++;
          console.error("[translation] batch failed:", err);
        }
      }

      if (cancelled) return;
      for (const node of nodes) {
        const original = node.parentElement?.dataset.originalText;
        if (original && allTranslations[original]) node.textContent = allTranslations[original];
      }
      setTranslating(false);
      if (failedBatches === totalBatches && totalBatches > 0) {
        showTranslationBanner("Translation unavailable. Showing original.", true);
      } else if (failedBatches > 0) {
        showTranslationBanner("Partially translated. Some sections may show original text.", true);
      } else {
        removeTranslationBanner();
      }
    }

    const run = () => {
      if (scheduled !== null) window.clearTimeout(scheduled);
      scheduled = window.setTimeout(applyTranslation, 200);
    };
    run();

    window.addEventListener("tuh-preferences", run);
    window.addEventListener("tuh-language-change", run);

    const unsubscribe = router.subscribe("onResolved", () => run());

    return () => {
      cancelled = true;
      if (scheduled !== null) window.clearTimeout(scheduled);
      window.removeEventListener("tuh-preferences", run);
      window.removeEventListener("tuh-language-change", run);
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [translate, router]);

  return { translating };
}
