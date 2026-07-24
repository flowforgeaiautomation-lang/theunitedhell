import { supabase } from "./supabase";
import type { Article } from "../types";

const PAGE_SIZE = 12;

export async function fetchArticles(limit: number, offset: number, category?: string): Promise<Article[]> {
  let query = supabase.from("articles").select("*").eq("is_published", true).order("published_at", { ascending: false }).range(offset, offset + limit - 1);
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) { console.error("fetchArticles:", error.message); return []; }
  return (data || []) as Article[];
}

export async function fetchTodaysArticles(limit: number, offset: number): Promise<Article[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
  const { data, error } = await supabase.from("articles").select("*").eq("is_published", true).gte("published_at", startOfDay).lte("published_at", endOfDay).order("published_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) { console.error("fetchTodaysArticles:", error.message); return []; }
  return (data || []) as Article[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) { console.error("fetchArticleBySlug:", error.message); return null; }
  return data as Article | null;
}

export async function fetchRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const { data, error } = await supabase.from("articles").select("*").eq("is_published", true).eq("category", article.category).neq("id", article.id).order("published_at", { ascending: false }).limit(limit);
  if (error) { console.error("fetchRelated:", error.message); return []; }
  return (data || []) as Article[];
}

export async function searchArticles(query: string, limit = 24): Promise<Article[]> {
  const { data, error } = await supabase.from("articles").select("*").eq("is_published", true).or(`title.ilike.%${query}%,dek.ilike.%${query}%`).order("published_at", { ascending: false }).limit(limit);
  if (error) { console.error("searchArticles:", error.message); return []; }
  return (data || []) as Article[];
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
