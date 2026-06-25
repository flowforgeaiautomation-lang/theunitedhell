import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Article, ArticleSummary, Briefing, CommentRow } from "./types";
import { relatedCategorySlugs } from "./categories";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
  );
}

const summaryCols =
  "id,slug,title,dek,category,subcategory,cover_image_url,read_time_minutes,trust_score,source_count,country_code,featured_slot,published_at,view_count,like_count,bookmark_count,comment_count";

function normalizeText(s = "") {
  return s.toLowerCase().replace(/[^a-z0-9\s]+/g, " ").replace(/\s+/g, " ").trim();
}

function dedupeSummaries(rows: ArticleSummary[], limit: number) {
  const seen = new Set<string>();
  const out: ArticleSummary[] = [];
  for (const row of rows) {
    const key = normalizeText(row.title || row.dek || row.slug);
    const softKey = normalizeText(row.dek || row.title).slice(0, 110);
    if (!key || seen.has(row.id) || seen.has(key) || (softKey && seen.has(softKey))) continue;
    seen.add(row.id);
    seen.add(key);
    if (softKey) seen.add(softKey);
    out.push(row);
    if (out.length >= limit) break;
  }
  return out;
}

function looksVague(text?: string | null) {
  if (!text) return true;
  return /original source|the united hell is preserving|broader impact depends|verified new development|reliable, recent information|full primary account|future coverage in this field/i.test(text);
}

function cleanList(items?: (string | null | undefined)[] | null): string[] | undefined {
  if (!Array.isArray(items)) return undefined;
  const cleaned = items
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter((s) => s.length > 0 && !looksVague(s));
  return cleaned.length ? cleaned : undefined;
}

function normalizeArticle(article: Article): Article {
  const currentStory = article.story ?? {};
  return {
    ...article,
    story: {
      ...currentStory,
      // Q&A is intentionally suppressed — articles show direct information only.
      qa: undefined,
      what: looksVague(currentStory.what) ? undefined : currentStory.what,
      why: looksVague(currentStory.why) ? undefined : currentStory.why,
      next: looksVague(currentStory.next) ? undefined : currentStory.next,
      why_should_i_care: looksVague(currentStory.why_should_i_care) ? undefined : currentStory.why_should_i_care,
      how_affects_world: looksVague(currentStory.how_affects_world) ? undefined : currentStory.how_affects_world,
      what_can_we_learn: looksVague(currentStory.what_can_we_learn) ? undefined : currentStory.what_can_we_learn,
      why_interesting: looksVague(currentStory.why_interesting) ? undefined : currentStory.why_interesting,
      how: looksVague(currentStory.how) ? undefined : currentStory.how,
      before: looksVague(currentStory.before) ? undefined : currentStory.before,
      did_you_know: looksVague(currentStory.did_you_know) ? undefined : currentStory.did_you_know,
      future_impact: looksVague(currentStory.future_impact) ? undefined : currentStory.future_impact,
      key_facts: cleanList(currentStory.key_facts),
      quick_facts: cleanList(currentStory.quick_facts),
      key_takeaways: cleanList(currentStory.key_takeaways),
      timeline: cleanList(currentStory.timeline),
      insights: cleanList(currentStory.insights),
    },
  };
}

export const listArticles = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z
      .object({
        category: z.string().optional(),
        country: z.string().optional(),
        limit: z.number().int().min(1).max(60).default(24),
        offset: z.number().int().min(0).default(0),
        sort: z.enum(["recent", "trending", "most_read", "most_saved"]).default("recent"),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const categorySlugs = relatedCategorySlugs(data.category);
    let q = supabase.from("articles").select(summaryCols).eq("is_published", true);
    if (data.category && categorySlugs.length) q = q.in("category", categorySlugs);
    if (data.country) q = q.eq("country_code", data.country);
    if (data.sort === "trending" || data.sort === "most_read")
      q = q.order("view_count", { ascending: false });
    else if (data.sort === "most_saved") q = q.order("bookmark_count", { ascending: false });
    else q = q.order("published_at", { ascending: false });
    const fetchLimit = Math.max(data.limit, 24) + data.offset + 24;
    const { data: rows, error } = await q.range(0, fetchLimit - 1);
    if (error) throw new Error(error.message);
    let result = dedupeSummaries(((rows ?? []) as ArticleSummary[]).slice(data.offset), data.limit);
    if (data.category && !data.country && result.length < Math.min(20, data.limit)) {
      const { data: fallbackRows, error: fallbackError } = await supabase
        .from("articles")
        .select(summaryCols)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(80);
      if (fallbackError) throw new Error(fallbackError.message);
      result = dedupeSummaries([...result, ...((fallbackRows ?? []) as ArticleSummary[])], data.limit);
    }
    return result;
  });

export const getFeatured = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("articles")
    .select(summaryCols)
    .eq("is_published", true)
    .not("featured_slot", "is", null)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  // Keep latest per slot.
  const bySlot = new Map<string, ArticleSummary>();
  for (const a of (data ?? []) as ArticleSummary[]) {
    if (a.featured_slot && !bySlot.has(a.featured_slot)) bySlot.set(a.featured_slot, a);
  }
  return Object.fromEntries(bySlot) as Record<string, ArticleSummary>;
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    // fire-and-forget view bump
    supabase.rpc as unknown;
    await supabase.from("articles").update({ view_count: (row.view_count ?? 0) + 1 }).eq("id", row.id);
    return normalizeArticle(row as unknown as Article);
  });

export const getRelated = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ category: z.string(), excludeSlug: z.string(), limit: z.number().default(4) }).parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("articles")
      .select(summaryCols)
      .eq("is_published", true)
      .eq("category", data.category)
      .neq("slug", data.excludeSlug)
      .order("published_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ArticleSummary[];
  });

export const searchArticles = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ q: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const term = `%${data.q.replace(/[%_]/g, " ")}%`;
    const { data: rows, error } = await supabase
      .from("articles")
      .select(summaryCols)
      .eq("is_published", true)
      .or(`title.ilike.${term},dek.ilike.${term},category.ilike.${term}`)
      .order("published_at", { ascending: false })
      .limit(40);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ArticleSummary[];
  });

export const getCountryStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("articles")
    .select("country_code")
    .eq("is_published", true)
    .not("country_code", "is", null);
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  for (const r of (data ?? []) as { country_code: string }[]) {
    counts[r.country_code] = (counts[r.country_code] ?? 0) + 1;
  }
  return counts;
});

export const getBriefingToday = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("briefings")
    .select("*")
    .order("briefing_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const briefing = (data ?? null) as Briefing | null;

  // Always return a populated briefing, even when none has been generated yet.
  // We assemble it on the fly from the latest published articles so the section is
  // never empty for the reader.
  const pickItems = (rows: ArticleSummary[]) =>
    rows.map((r) => ({ slug: r.slug, title: r.title }));

  const buildFromArticles = async (): Promise<Briefing> => {
    const today = new Date().toISOString().slice(0, 10);
    const fetchCat = async (cats: string[], limit: number) => {
      const { data: rows } = await supabase
        .from("articles")
        .select(summaryCols)
        .eq("is_published", true)
        .in("category", cats)
        .order("published_at", { ascending: false })
        .limit(limit);
      return dedupeSummaries((rows ?? []) as ArticleSummary[], limit);
    };
    const { data: latest } = await supabase
      .from("articles")
      .select(summaryCols)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(80);
    const latestRows = dedupeSummaries((latest ?? []) as ArticleSummary[], 60);

    const top = latestRows.slice(0, 8);
    const [discoveries, science, success, tech] = await Promise.all([
      fetchCat(["discovery", "world-discovery", "exploration", "amazing-places"], 6),
      fetchCat(["science", "scientific-discoveries", "physics", "biology", "medicine", "breakthroughs"], 6),
      fetchCat(["success-stories", "entrepreneurs", "startups", "billionaires", "business-leaders"], 6),
      fetchCat(["technology", "artificial-intelligence", "innovation", "future-technology", "robotics"], 6),
    ]);

    return {
      id: "live",
      briefing_date: today,
      intro:
        briefing?.intro ??
        "Today's most important stories, drawn from the latest published articles.",
      sections: {
        top_stories: pickItems(top),
        discoveries: pickItems(discoveries.length ? discoveries : latestRows.slice(8, 14)),
        science: pickItems(science.length ? science : latestRows.slice(14, 20)),
        success: pickItems(success.length ? success : latestRows.slice(20, 26)),
        tech: pickItems(tech.length ? tech : latestRows.slice(26, 32)),
        facts: briefing?.sections?.facts,
      },
    } as Briefing;
  };

  if (!briefing) return buildFromArticles();

  const sections = briefing.sections ?? ({} as Briefing["sections"]);
  const isEmpty =
    !sections.top_stories?.length &&
    !sections.discoveries?.length &&
    !sections.science?.length &&
    !sections.success?.length &&
    !sections.tech?.length;
  if (isEmpty) return buildFromArticles();
  return briefing;
});

export const listComments = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ articleId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("comments")
      .select("id,article_id,user_id,parent_id,prompt_type,body,like_count,created_at,profiles!comments_user_id_fkey(username,display_name,avatar_url)")
      .eq("article_id", data.articleId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) {
      // join hint may differ; fall back without profile join
      const { data: alt } = await supabase
        .from("comments")
        .select("id,article_id,user_id,parent_id,prompt_type,body,like_count,created_at")
        .eq("article_id", data.articleId)
        .eq("is_hidden", false)
        .order("created_at", { ascending: true })
        .limit(200);
      return (alt ?? []) as CommentRow[];
    }
    return (rows ?? []).map((r: Record<string, unknown>) => ({
      ...(r as object),
      author: (r as { profiles?: CommentRow["author"] }).profiles ?? null,
    })) as CommentRow[];
  });
