import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Authenticated AI top-up. Any signed-in user can generate fresh articles from real ingestion only.
export const generateArticles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        category: z.string().optional(),
        count: z.number().int().min(1).max(4).default(2),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { runIngestion } = await import("./ingestion.server");
    const result = await runIngestion({ maxItems: Math.max(6, data.count * 6) });
    return { inserted: result.inserted };
  });

// Authenticated "Curate Now" — runs the real ingestion pipeline immediately.
// Pulls fresh items from NewsAPI + GNews + RSS + Wikipedia, processes with Qwen,
// fetches Pexels covers when missing, and inserts new articles.
export const curateNow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ maxItems: z.number().int().min(1).max(80).default(24) }).parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const { runIngestion } = await import("./ingestion.server");
    return await runIngestion({ maxItems: data.maxItems });
  });
