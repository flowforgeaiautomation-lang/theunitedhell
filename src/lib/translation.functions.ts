import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const supportedLanguages = ["hi", "es", "fr", "de", "ar", "zh", "ja", "ru", "pt"] as const;

const languageNames: Record<(typeof supportedLanguages)[number], string> = {
  hi: "Hindi",
  es: "Spanish",
  fr: "French",
  de: "German",
  ar: "Arabic",
  zh: "Chinese",
  ja: "Japanese",
  ru: "Russian",
  pt: "Portuguese",
};

export const translateVisibleText = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        target: z.enum(supportedLanguages),
        texts: z.array(z.string().min(1).max(500)).min(1).max(120),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { orChat } = await import("./openrouter.server");
    const unique = [...new Set(data.texts.map((t) => t.trim()).filter(Boolean))];
    const content = await orChat({
      json: true,
      temperature: 0.1,
      system: `You are a professional news translation desk. Translate UI and article text naturally into ${languageNames[data.target]}. Preserve names, dates, numbers, URLs, and brand names. Return strict JSON only.`,
      prompt: JSON.stringify({ texts: unique }),
    });
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }
    const translations = Array.isArray((parsed as { translations?: unknown })?.translations)
      ? (parsed as { translations: string[] }).translations
      : Array.isArray(parsed)
        ? (parsed as string[])
        : [];
    return Object.fromEntries(unique.map((text, i) => [text, translations[i] || text]));
  });
