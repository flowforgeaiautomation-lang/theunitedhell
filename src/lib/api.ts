import { supabase } from "./supabase";
import type { Article } from "../types";

const PAGE_SIZE = 12;

export async function fetchArticles(limit: number, offset: number, category?: string): Promise<Article[]> {
  const { data, error } = await supabase.rpc("get_briefing_articles", { p_limit: limit + offset });
  if (error) { console.error("fetchArticles:", error.message); return []; }
  const rows = (data ?? []) as Article[];
  return rows.slice(offset, offset + limit);
}

export async function fetchTodaysArticles(limit: number, offset: number): Promise<Article[]> {
  const { data, error } = await supabase.rpc("get_articles_by_category", {
    p_limit: limit + offset,
    p_today_only: true,
  });
  if (error) { console.error("fetchTodaysArticles:", error.message); return []; }
  const rows = (data ?? []) as Article[];
  return rows.slice(offset, offset + limit);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.rpc("get_article_full_by_slug", { p_slug: slug });
  if (error) { console.error("fetchArticleBySlug:", error.message); return null; }
  return data as Article | null;
}

export async function fetchRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const { data, error } = await supabase.rpc("get_related_articles", {
    p_category: article.category,
    p_exclude_slug: article.slug,
    p_limit: limit,
  });
  if (error) { console.error("fetchRelated:", error.message); return []; }
  return (data ?? []) as Article[];
}

export async function searchArticles(query: string, limit = 24): Promise<Article[]> {
  const term = `%${query.replace(/[%_]/g, " ")}%`;
  const { data, error } = await supabase.rpc("search_articles", {
    p_search_term: term,
    p_limit: limit,
  });
  if (error) { console.error("searchArticles:", error.message); return []; }
  return (data ?? []) as Article[];
}

export function getHeroImage(article: Article): string {
  if (article.cover_image_url) return article.cover_image_url;
  const seed = encodeURIComponent(article.slug || article.title || "news");
  return `https://picsum.photos/seed/${seed}/1200/600`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date(); const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime(); const diffHrs = Math.floor(diffMs / (1000 * 60 * 60)); const diffDays = Math.floor(diffHrs / 24);
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export { PAGE_SIZE };
