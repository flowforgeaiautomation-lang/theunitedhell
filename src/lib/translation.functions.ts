import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const supportedLanguages = ["hi", "es", "fr", "de", "ar", "zh", "ja", "ru", "pt", "it", "ko", "tr", "nl", "pl", "sv", "id", "vi", "th", "uk", "he"] as const;

const languageNames: Record<string, string> = {
  hi: "Hindi", es: "Spanish", fr: "French", de: "German", ar: "Arabic",
  zh: "Chinese", ja: "Japanese", ru: "Russian", pt: "Portuguese",
  it: "Italian", ko: "Korean", tr: "Turkish", nl: "Dutch", pl: "Polish",
  sv: "Swedish", id: "Indonesian", vi: "Vietnamese", th: "Thai",
  uk: "Ukrainian", he: "Hebrew", en: "English",
};

const nativeNames: Record<string, string> = {
  hi: "हिन्दी", es: "Español", fr: "Français", de: "Deutsch", ar: "العربية",
  zh: "中文", ja: "日本語", ru: "Русский", pt: "Português",
  it: "Italiano", ko: "한국어", tr: "Türkçe", nl: "Nederlands", pl: "Polski",
  sv: "Svenska", id: "Bahasa Indonesia", vi: "Tiếng Việt", th: "ไทย",
  uk: "Українська", he: "עברית", en: "English",
};

const flags: Record<string, string> = {
  hi: "🇮🇳", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", ar: "🇸🇦",
  zh: "🇨🇳", ja: "🇯🇵", ru: "🇷🇺", pt: "🇵🇹",
  it: "🇮🇹", ko: "🇰🇷", tr: "🇹🇷", nl: "🇳🇱", pl: "🇵🇱",
  sv: "🇸🇪", id: "🇮🇩", vi: "🇻🇳", th: "🇹🇭",
  uk: "🇺🇦", he: "🇮🇱", en: "🇬🇧",
};

export function getLanguageInfo() {
  return supportedLanguages.map((code) => ({
    code,
    name: languageNames[code] || code,
    nativeName: nativeNames[code] || code,
    flag: flags[code] || "",
  }));
}

function serverClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function libreTranslate(texts: string[], source: string, target: string): Promise<string[] | null> {
  const url = process.env.LIBRETRANSLATE_URL;
  if (!url) return null;
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  try {
    const results: string[] = [];
    for (const text of texts) {
      const body: Record<string, string> = {
        q: text,
        source: source === "auto" ? "auto" : source,
        target,
        format: "text",
      };
      if (apiKey) body.api_key = apiKey;
      const r = await fetch(`${url}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) return null;
      const d = await r.json();
      results.push(d?.translatedText || text);
    }
    return results;
  } catch {
    return null;
  }
}

async function googleTranslate(texts: string[], target: string): Promise<string[] | null> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texts, target, format: "text", source: "en" }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const arr = d?.data?.translations;
    if (!Array.isArray(arr) || arr.length !== texts.length) return null;
    return arr.map((t: { translatedText: string }) => t.translatedText);
  } catch {
    return null;
  }
}

async function deeplTranslate(texts: string[], target: string): Promise<string[] | null> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) return null;
  const map: Record<string, string> = { zh: "ZH", hi: "EN", ar: "EN" };
  const upper = map[target] ?? target.toUpperCase();
  if (["HI", "AR"].includes(upper)) return null;
  try {
    const form = new URLSearchParams();
    for (const t of texts) form.append("text", t);
    form.append("target_lang", upper);
    form.append("source_lang", "EN");
    const r = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: { Authorization: `DeepL-Auth-Key ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const arr = d?.translations;
    if (!Array.isArray(arr) || arr.length !== texts.length) return null;
    return arr.map((t: { text: string }) => t.text);
  } catch {
    return null;
  }
}

async function aiTranslate(texts: string[], target: string): Promise<string[]> {
  const { orChat } = await import("./openrouter.server");
  const content = await orChat({
    json: true,
    temperature: 0.1,
    system: `You are a professional translator. Translate each English string into ${languageNames[target] ?? target}. Preserve names, numbers, URLs. Return STRICT JSON: {"translations":[ ... ]} with the same length and order.`,
    prompt: JSON.stringify({ texts }),
  });
  let parsed: unknown;
  try { parsed = JSON.parse(content); } catch {
    const m = content.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : null;
  }
  const arr = Array.isArray((parsed as { translations?: unknown })?.translations)
    ? (parsed as { translations: string[] }).translations
    : Array.isArray(parsed) ? (parsed as string[]) : [];
  return texts.map((t, i) => arr[i] || t);
}

async function myMemoryTranslate(texts: string[], target: string): Promise<string[] | null> {
  try {
    const results: string[] = [];
    for (const text of texts) {
      const truncated = text.slice(0, 500);
      const r = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncated)}&langpair=en|${target}`,
        { signal: AbortSignal.timeout(8000) },
      );
      if (!r.ok) return null;
      const d = await r.json();
      const translated = d?.responseData?.translatedText;
      if (!translated) return null;
      results.push(translated);
    }
    return results;
  } catch {
    return null;
  }
}

async function doTranslate(texts: string[], source: string, target: string): Promise<string[]> {
  return (await libreTranslate(texts, source, target)) ??
    (await googleTranslate(texts, target)) ??
    (await deeplTranslate(texts, target)) ??
    (await myMemoryTranslate(texts, target)) ??
    (await aiTranslate(texts, target));
}

export const translateVisibleText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      target: z.enum(supportedLanguages),
      texts: z.array(z.string().min(1).max(800)).min(1).max(200),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const unique = [...new Set(data.texts.map((t) => t.trim()).filter(Boolean))];
    const translations = await doTranslate(unique, "en", data.target);
    return Object.fromEntries(unique.map((text, i) => [text, translations[i] || text]));
  });

export const translateArticle = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      slug: z.string().min(1),
      target: z.string().min(2).max(10),
      title: z.string(),
      dek: z.string().optional(),
      body: z.string().optional(),
      story: z.any().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const { data: cached } = await supabase
      .from("article_translations")
      .select("*")
      .eq("article_slug", data.slug)
      .eq("language", data.target)
      .eq("status", "completed")
      .maybeSingle();
    if (cached) {
      return {
        cached: true,
        title: cached.translated_title,
        dek: cached.translated_dek,
        body: cached.translated_body,
        story: cached.translated_story,
      };
    }

    const textsToTranslate = [data.title, data.dek, data.body].filter(Boolean) as string[];
    const storyTexts: string[] = [];
    if (data.story && typeof data.story === "object") {
      const story = data.story as Record<string, any>;
      for (const key of ["summary", "main_story", "bigger_picture", "did_you_know", "why_it_matters"]) {
        if (story[key] && typeof story[key] === "string") storyTexts.push(story[key]);
      }
      for (const key of ["reader_takeaways", "key_developments", "timeline", "tags"]) {
        if (Array.isArray(story[key])) storyTexts.push(...story[key].filter((x: any) => typeof x === "string"));
      }
    }
    const allTexts = [...textsToTranslate, ...storyTexts];
    if (allTexts.length === 0) return { cached: false, title: data.title, dek: data.dek, body: data.body, story: data.story };

    const translations = await doTranslate(allTexts, "en", data.target);
    let idx = 0;
    const translatedTitle = translations[idx++] || data.title;
    const translatedDek = data.dek ? (translations[idx++] || data.dek) : undefined;
    const translatedBody = data.body ? (translations[idx++] || data.body) : undefined;
    const translatedStoryTexts = translations.slice(idx);
    let storyIdx = 0;
    const translatedStory = data.story ? JSON.parse(JSON.stringify(data.story)) : undefined;
    if (translatedStory && typeof translatedStory === "object") {
      for (const key of ["summary", "main_story", "bigger_picture", "did_you_know", "why_it_matters"]) {
        if (translatedStory[key] && typeof translatedStory[key] === "string") {
          translatedStory[key] = translatedStoryTexts[storyIdx++] || translatedStory[key];
        }
      }
      for (const key of ["reader_takeaways", "key_developments", "timeline", "tags"]) {
        if (Array.isArray(translatedStory[key])) {
          translatedStory[key] = translatedStory[key].map((item: any) =>
            typeof item === "string" ? (translatedStoryTexts[storyIdx++] || item) : item
          );
        }
      }
    }

    await supabase.from("article_translations").upsert({
      article_slug: data.slug,
      language: data.target,
      translated_title: translatedTitle,
      translated_dek: translatedDek || null,
      translated_body: translatedBody || null,
      translated_story: translatedStory || null,
      status: "completed",
      updated_at: new Date().toISOString(),
    }, { onConflict: "article_slug,language" }).then(() => {});

    return { cached: false, title: translatedTitle, dek: translatedDek, body: translatedBody, story: translatedStory };
  });

export const getTranslationHealth = createServerFn({ method: "GET" })
  .handler(async () => {
    const url = process.env.LIBRETRANSLATE_URL;
    if (!url) {
      return {
        status: "degraded",
        libretranslate: false,
        message: "LibreTranslate URL not configured. Using fallback providers (Google/DeepL/AI).",
        languages: getLanguageInfo(),
      };
    }
    try {
      const r = await fetch(`${url}/languages`, { signal: AbortSignal.timeout(5000) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const langs = await r.json();
      return {
        status: "healthy",
        libretranslate: true,
        url,
        languages: getLanguageInfo(),
        libretranslateLanguages: Array.isArray(langs) ? langs.length : 0,
      };
    } catch (e) {
      return {
        status: "degraded",
        libretranslate: false,
        message: `LibreTranslate unreachable: ${(e as Error).message}. Using fallback providers.`,
        languages: getLanguageInfo(),
      };
    }
  });

export const getTranslationStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = serverClient();
    const { count: total } = await supabase.from("article_translations").select("*", { count: "exact", head: true });
    const { count: completed } = await supabase.from("article_translations").select("*", { count: "exact", head: true }).eq("status", "completed");
    const { count: failed } = await supabase.from("article_translations").select("*", { count: "exact", head: true }).eq("status", "failed");
    const { count: queued } = await supabase.from("translation_queue").select("*", { count: "exact", head: true }).eq("status", "queued");
    return { total: total || 0, completed: completed || 0, failed: failed || 0, queued: queued || 0 };
  });
