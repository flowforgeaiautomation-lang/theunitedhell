import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const supportedLanguages = [
  "nb","nn","hi","bn","ta","te","mr","gu","kn","ml","pa","ur","or","as","sa",
  "es","fr","de","ar","zh","ja","ru","pt","it","ko","tr","nl","pl","sv","da",
  "fi","is","id","vi","th","uk","he","el","cs","hu","ro","bg","hr","sk","sl",
  "lt","lv","et","fa","ms","tl","sw","af","sq","az","be","bs","ca","cy",
  "eo","eu","gl","ka","ga","la","lb","mk","mn","ne","ps","sd","si","sr",
  "tg","uz","yi","zu","xh","st","sn","so","tk","tt","ug","yo",
] as const;

const languageNames: Record<string, string> = {
  en: "English", nb: "Norwegian Bokmål", nn: "Norwegian Nynorsk",
  hi: "Hindi", bn: "Bengali", ta: "Tamil", te: "Telugu", mr: "Marathi",
  gu: "Gujarati", kn: "Kannada", ml: "Malayalam", pa: "Punjabi", ur: "Urdu",
  or: "Odia", as: "Assamese", sa: "Sanskrit",
  es: "Spanish", fr: "French", de: "German", ar: "Arabic",
  zh: "Chinese", ja: "Japanese", ru: "Russian", pt: "Portuguese",
  it: "Italian", ko: "Korean", tr: "Turkish", nl: "Dutch", pl: "Polish",
  sv: "Swedish", da: "Danish", fi: "Finnish", is: "Icelandic",
  id: "Indonesian", vi: "Vietnamese", th: "Thai",
  uk: "Ukrainian", he: "Hebrew", el: "Greek", cs: "Czech", hu: "Hungarian",
  ro: "Romanian", bg: "Bulgarian", hr: "Croatian", sk: "Slovak", sl: "Slovenian",
  lt: "Lithuanian", lv: "Latvian", et: "Estonian", fa: "Persian",
  ms: "Malay", tl: "Filipino", sw: "Swahili", af: "Afrikaans",
  sq: "Albanian", az: "Azerbaijani", be: "Belarusian", bs: "Bosnian",
  ca: "Catalan", cy: "Welsh", eo: "Esperanto", eu: "Basque",
  gl: "Galician", ka: "Georgian", ga: "Irish", la: "Latin",
  lb: "Luxembourgish", mk: "Macedonian", mn: "Mongolian", ne: "Nepali",
  ps: "Pashto", sd: "Sindhi", si: "Sinhala", sr: "Serbian",
  tg: "Tajik", uz: "Uzbek", yi: "Yiddish", zu: "Zulu",
  xh: "Xhosa", st: "Southern Sotho", sn: "Shona", so: "Somali",
  tk: "Turkmen", tt: "Tatar", ug: "Uyghur", yo: "Yoruba",
};

const nativeNames: Record<string, string> = {
  en: "English", nb: "Bokmål", nn: "Nynorsk",
  hi: "हिन्दी", bn: "বাংলা", ta: "தமிழ்", te: "తెలుగు", mr: "मराठी",
  gu: "ગુજરાતી", kn: "ಕನ್ನಡ", ml: "മലയാളം", pa: "ਪੰਜਾਬੀ", ur: "اردو",
  or: "ଓଡ଼ିଆ", as: "অসমীয়া", sa: "संस्कृतम्",
  es: "Español", fr: "Français", de: "Deutsch", ar: "العربية",
  zh: "中文", ja: "日本語", ru: "Русский", pt: "Português",
  it: "Italiano", ko: "한국어", tr: "Türkçe", nl: "Nederlands", pl: "Polski",
  sv: "Svenska", da: "Dansk", fi: "Suomi", is: "Íslenska",
  id: "Bahasa Indonesia", vi: "Tiếng Việt", th: "ไทย",
  uk: "Українська", he: "עברית", el: "Ελληνικά", cs: "Čeština", hu: "Magyar",
  ro: "Română", bg: "Български", hr: "Hrvatski", sk: "Slovenčina", sl: "Slovenščina",
  lt: "Lietuvių", lv: "Latviešu", et: "Eesti", fa: "فارسی",
  ms: "Bahasa Melayu", tl: "Filipino", sw: "Kiswahili", af: "Afrikaans",
  sq: "Shqip", az: "Azərbaycan", be: "Беларуская", bs: "Bosanski",
  ca: "Català", cy: "Cymraeg", eo: "Esperanto", eu: "Euskara",
  gl: "Galego", ka: "ქართული", ga: "Gaeilge", la: "Latina",
  lb: "Lëtzebuergesch", mk: "Македонски", mn: "Монгол", ne: "नेपाली",
  ps: "پښتو", sd: "سنڌي", si: "සිංහල", sr: "Српски",
  tg: "Тоҷикӣ", uz: "Oʻzbek", yi: "ייִדיש", zu: "isiZulu",
  xh: "isiXhosa", st: "Sesotho", sn: "chiShona", so: "Soomaali",
  tk: "Türkmen", tt: "Татар", ug: "ئۇيغۇر", yo: "Yorùbá",
};

const flags: Record<string, string> = {
  en: "🇬🇧", nb: "🇳🇴", nn: "🇳🇴",
  hi: "🇮🇳", bn: "🇧🇩", ta: "🇮🇳", te: "🇮🇳", mr: "🇮🇳",
  gu: "🇮🇳", kn: "🇮🇳", ml: "🇮🇳", pa: "🇮🇳", ur: "🇵🇰",
  or: "🇮🇳", as: "🇮🇳", sa: "🇮🇳",
  es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", ar: "🇸🇦",
  zh: "🇨🇳", ja: "🇯🇵", ru: "🇷🇺", pt: "🇵🇹",
  it: "🇮🇹", ko: "🇰🇷", tr: "🇹🇷", nl: "🇳🇱", pl: "🇵🇱",
  sv: "🇸🇪", da: "🇩🇰", fi: "🇫🇮", is: "🇮🇸",
  id: "🇮🇩", vi: "🇻🇳", th: "🇹🇭",
  uk: "🇺🇦", he: "🇮🇱", el: "🇬🇷", cs: "🇨🇿", hu: "🇭🇺",
  ro: "🇷🇴", bg: "🇧🇬", hr: "🇭🇷", sk: "🇸🇰", sl: "🇸🇮",
  lt: "🇱🇹", lv: "🇱🇻", et: "🇪🇪", fa: "🇮🇷",
  ms: "🇲🇾", tl: "🇵🇭", sw: "🇰🇪", af: "🇿🇦",
  sq: "🇦🇱", az: "🇦🇿", be: "🇧🇾", bs: "🇧🇦",
  ca: "🇪🇸", cy: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", eo: "🌍", eu: "🇪🇸",
  gl: "🇪🇸", ka: "🇬🇪", ga: "🇮🇪", la: "🇻🇦",
  lb: "🇱🇺", mk: "🇲🇰", mn: "🇲🇳", ne: "🇳🇵",
  ps: "🇦🇫", sd: "🇵🇰", si: "🇱🇰", sr: "🇷🇸",
  tg: "🇹🇯", uz: "🇺🇿", yi: "🇮🇱", zu: "🇿🇦",
  xh: "🇿🇦", st: "🇿🇦", sn: "🇿🇼", so: "🇸🇴",
  tk: "🇹🇲", tt: "🇷🇺", ug: "🇨🇳", yo: "🇳🇬",
};

export function getLanguageInfo() {
  return supportedLanguages.map((code) => ({
    code,
    name: languageNames[code] || code,
    nativeName: nativeNames[code] || code,
    flag: flags[code] || "🌐",
  }));
}

function serverClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function getLibreTranslateUrl(): string | null {
  const explicit = process.env.LIBRETRANSLATE_URL;
  if (explicit) return explicit;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  if (supabaseUrl) return `${supabaseUrl}/functions/v1/libretranslate-proxy`;
  return null;
}

async function libreTranslate(texts: string[], source: string, target: string): Promise<string[] | null> {
  const url = getLibreTranslateUrl();
  if (!url) return null;
  const apiKey = process.env.LIBRETRANSLATE_API_KEY;
  const src = source === "auto" ? "auto" : source;
  const results: string[] = [];
  // Send in batches of 50 to keep request size reasonable
  for (let i = 0; i < texts.length; i += 25) {
    const batch = texts.slice(i, i + 25);
    try {
      const body: Record<string, any> = {
        q: batch.length === 1 ? batch[0] : batch,
        source: src,
        target,
        format: "text",
      };
      if (apiKey) body.api_key = apiKey;
      const r = await fetch(`${url}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });
      if (!r.ok) return null;
      const d = await r.json();
      // LibreTranslate returns translatedText (string for single q) or translatedText (array for array q)
      if (Array.isArray(d?.translatedText)) {
        results.push(...d.translatedText);
      } else if (typeof d?.translatedText === "string") {
        results.push(d.translatedText);
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
  return results.length === texts.length ? results : null;
}

async function googleTranslateFree(texts: string[], target: string): Promise<string[] | null> {
  try {
    const results = await Promise.all(
      texts.map(async (text) => {
        try {
          const truncated = text.slice(0, 4500);
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(truncated)}`;
          const r = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; TheUnitedHell/1.0)" },
            signal: AbortSignal.timeout(15000),
          });
          if (!r.ok) return text;
          const d = await r.json();
          if (!Array.isArray(d) || !Array.isArray(d[0])) return text;
          const translated = (d[0] as any[][])
            .map((seg) => (Array.isArray(seg) && seg[0]) ? seg[0] : "")
            .join("");
          return translated || text;
        } catch {
          return text;
        }
      }),
    );
    return results;
  } catch {
    return null;
  }
}

async function aiTranslate(texts: string[], target: string): Promise<string[]> {
  const { orChat } = await import("./openrouter.server");
  const langName = languageNames[target] ?? target;
  const allTranslations: string[] = [];
  const BATCH_SIZE = 25;

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const chunk = texts.slice(i, i + BATCH_SIZE);
    try {
      const content = await orChat({
        json: true,
        temperature: 0.1,
        system: `You are a professional translator. Translate each English string into ${langName}. Preserve names, numbers, URLs, HTML tags, and formatting. Return STRICT JSON: {"translations":["...","..."]} with exactly ${chunk.length} entries in the same order. Do not skip any entry.`,
        prompt: JSON.stringify({ texts: chunk }),
      });
      let parsed: unknown;
      try { parsed = JSON.parse(content); } catch {
        const m = content.match(/\{[\s\S]*\}/);
        parsed = m ? JSON.parse(m[0]) : null;
      }
      const arr = Array.isArray((parsed as { translations?: unknown })?.translations)
        ? (parsed as { translations: string[] }).translations
        : Array.isArray(parsed) ? (parsed as string[]) : [];

      if (arr.length === chunk.length) {
        allTranslations.push(...arr);
      } else if (arr.length > 0) {
        // Mismatch — map by best effort, pad with originals
        for (let j = 0; j < chunk.length; j++) {
          allTranslations.push(arr[j] ?? chunk[j]);
        }
      } else {
        // AI returned nothing useful — fall back to per-text for this chunk
        const perText = await Promise.all(
          chunk.map(async (text) => {
            try {
              const c = await orChat({
                json: true,
                temperature: 0.1,
                system: `You are a professional translator. Translate the English text into ${langName}. Preserve names, numbers, URLs, HTML tags, and formatting. Return STRICT JSON: {"translation":"..."}.`,
                prompt: JSON.stringify({ text }),
              });
              let p: unknown;
              try { p = JSON.parse(c); } catch {
                const m = c.match(/\{[\s\S]*\}/);
                p = m ? JSON.parse(m[0]) : null;
              }
              const t = (p as { translation?: string })?.translation
                ?? (Array.isArray(p) ? (p as string[])[0] : null)
                ?? (typeof p === "string" ? p : null);
              return t?.trim() ? t : text;
            } catch {
              return text;
            }
          }),
        );
        allTranslations.push(...perText);
      }
    } catch {
      // Batch failed entirely — try per-text fallback
      const perText = await Promise.all(
        chunk.map(async (text) => {
          try {
            const c = await orChat({
              json: true,
              temperature: 0.1,
              system: `You are a professional translator. Translate the English text into ${langName}. Preserve names, numbers, URLs, HTML tags, and formatting. Return STRICT JSON: {"translation":"..."}.`,
              prompt: JSON.stringify({ text }),
            });
            let p: unknown;
            try { p = JSON.parse(c); } catch {
              const m = c.match(/\{[\s\S]*\}/);
              p = m ? JSON.parse(m[0]) : null;
            }
            const t = (p as { translation?: string })?.translation
              ?? (Array.isArray(p) ? (p as string[])[0] : null)
              ?? (typeof p === "string" ? p : null);
            return t?.trim() ? t : text;
          } catch {
            return text;
          }
        }),
      );
      allTranslations.push(...perText);
    }
  }
  return allTranslations;
}

async function myMemoryTranslate(texts: string[], target: string): Promise<string[] | null> {
  try {
    const results = await Promise.all(
      texts.map(async (text) => {
        try {
          const truncated = text.slice(0, 500);
          const r = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncated)}&langpair=en|${target}`,
            { signal: AbortSignal.timeout(8000) },
          );
          if (!r.ok) return text;
          const d = await r.json();
          const translated = d?.responseData?.translatedText;
          return translated || text;
        } catch {
          return text;
        }
      }),
    );
    return results;
  } catch {
    return null;
  }
}

async function doTranslate(texts: string[], source: string, target: string): Promise<string[]> {
  const errors: string[] = [];

  // 1. Google Translate free (instant, parallel, no API key, works for all languages)
  try {
    const gf = await googleTranslateFree(texts, target);
    if (gf && gf.some((t, i) => t !== texts[i])) return gf;
  } catch (e) { errors.push(`GoogleFree: ${(e as Error).message}`); }

  // 2. LibreTranslate proxy (edge function) — fallback if Google free fails
  const ltUrl = getLibreTranslateUrl();
  if (ltUrl) {
    try {
      const lt = await libreTranslate(texts, source, target);
      if (lt && lt.some((t, i) => t !== texts[i])) return lt;
    } catch (e) { errors.push(`LibreTranslate: ${(e as Error).message}`); }
  }

  // 3. AI translation (slower but high quality) — fallback when free providers fail
  try {
    return await aiTranslate(texts, target);
  } catch (e) { errors.push(`AI: ${(e as Error).message}`); }

  // 4. MyMemory (last resort, 500 char limit)
  try {
    const mm = await myMemoryTranslate(texts, target);
    if (mm && mm.some((t, i) => t !== texts[i])) return mm;
  } catch (e) { errors.push(`MyMemory: ${(e as Error).message}`); }

  throw new Error(`All translation providers failed: ${errors.join("; ")}`);
}

export const translateVisibleText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      target: z.string().min(2).max(10),
      texts: z.array(z.string().min(1).max(800)).min(1).max(50),
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
    const stringKeys = [
      "summary", "main_story", "background", "bigger_picture", "did_you_know",
      "why_it_matters", "expert_analysis", "historical_context", "future_outlook",
      "what_happens_next",
      "what_happened", "how_it_happened", "who_and_where",
      "what_came_before",
    ];
    const arrayKeys = [
      "reader_takeaways", "key_developments", "timeline", "tags", "quick_insights",
      "key_facts",
    ];
    if (data.story && typeof data.story === "object") {
      const story = data.story as Record<string, any>;
      for (const key of stringKeys) {
        if (story[key] && typeof story[key] === "string") storyTexts.push(story[key]);
      }
      for (const key of arrayKeys) {
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
      for (const key of stringKeys) {
        if (translatedStory[key] && typeof translatedStory[key] === "string") {
          translatedStory[key] = translatedStoryTexts[storyIdx++] || translatedStory[key];
        }
      }
      for (const key of arrayKeys) {
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
    const url = getLibreTranslateUrl();
    if (!url) {
      return {
        status: "degraded",
        libretranslate: false,
        message: "Translation proxy URL not configured. Using fallback providers.",
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
        message: `Translation proxy unreachable: ${(e as Error).message}. Using fallback providers.`,
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
