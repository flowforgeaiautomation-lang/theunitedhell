import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { translateVisibleText } from "@/lib/translation.functions";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "SELECT", "OPTION", "NOSCRIPT"]);

function currentLanguage() {
  return window.localStorage.getItem("tuh-language") || "en";
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
      // Show translating indicator on body
      document.body.style.opacity = "1";

      // Process in smaller batches (50) for faster first-paint
      const allTranslations: Record<string, string> = {};
      const BATCH = 50;
      for (let i = 0; i < unique.length; i += BATCH) {
        const batch = unique.slice(i, i + BATCH);
        try {
          const result = await translate({ data: { target: lang as never, texts: batch } });
          if (cancelled) return;
          Object.assign(allTranslations, result);
          // Apply incrementally as each batch completes
          for (const node of nodes) {
            const original = node.parentElement?.dataset.originalText;
            if (original && allTranslations[original]) node.textContent = allTranslations[original];
          }
        } catch (err) {
          console.error("[translation] batch failed:", err);
        }
      }

      if (cancelled) return;
      // Final pass to ensure all nodes are translated
      for (const node of nodes) {
        const original = node.parentElement?.dataset.originalText;
        if (original && allTranslations[original]) node.textContent = allTranslations[original];
      }
      setTranslating(false);
    }

    const run = () => {
      if (scheduled !== null) window.clearTimeout(scheduled);
      scheduled = window.setTimeout(applyTranslation, 200);
    };
    run();

    window.addEventListener("tuh-preferences", run);
    window.addEventListener("tuh-language-change", run);

    // Re-run on navigation
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
