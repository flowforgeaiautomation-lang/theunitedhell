import { supabase } from "./supabase";
import type { Article } from "../types";

const SAFE_COLS = "id,slug,title,dek,category,subcategory,cover_image_url,read_time_minutes,country_code,featured_slot,published_at,created_at,view_count,like_count,bookmark_count,comment_count";

const CATEGORY_VIDEOS: Record<string, string> = {
  "artificial-intelligence": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
  "books": "https://videos.pexels.com/video-files/2765448/2765448-uhd_2560_1440_30fps.mp4",
  "business": "https://videos.pexels.com/video-files/3195874/3195874-uhd_2560_1440_30fps.mp4",
  "climate": "https://videos.pexels.com/video-files/1405922/1405922-uhd_2560_1440_30fps.mp4",
  "cricket": "https://videos.pexels.com/video-files/4765242/4765242-uhd_2560_1440_30fps.mp4",
  "economics": "https://videos.pexels.com/video-files/3195874/3195874-uhd_2560_1440_30fps.mp4",
  "electric-vehicles": "https://videos.pexels.com/video-files/1709115/1709115-uhd_2560_1440_30fps.mp4",
  "environment": "https://videos.pexels.com/video-files/1405922/1405922-uhd_2560_1440_30fps.mp4",
  "football": "https://videos.pexels.com/video-files/4765242/4765242-uhd_2560_1440_30fps.mp4",
  "gaming": "https://videos.pexels.com/video-files/2765448/2765448-uhd_2560_1440_30fps.mp4",
  "health": "https://videos.pexels.com/video-files/4211718/4211718-uhd_2560_1440_30fps.mp4",
  "india": "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
  "markets": "https://videos.pexels.com/video-files/3195874/3195874-uhd_2560_1440_30fps.mp4",
  "movies": "https://videos.pexels.com/video-files/2765448/2765448-uhd_2560_1440_30fps.mp4",
  "music": "https://videos.pexels.com/video-files/2765448/2765448-uhd_2560_1440_30fps.mp4",
  "physics": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
  "politics": "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
  "robotics": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
  "science": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
  "space": "https://videos.pexels.com/video-files/1869990/1869990-uhd_2560_1440_30fps.mp4",
  "sport": "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
  "sustainability": "https://videos.pexels.com/video-files/1405922/1405922-uhd_2560_1440_30fps.mp4",
  "technology": "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4",
  "world": "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4",
};

const DEFAULT_VIDEO = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";

function assignVideo<T extends { category?: string | null; cover_video_url?: string | null }>(row: T): T {
  return {
    ...row,
    cover_video_url: row.cover_video_url || (row.category && CATEGORY_VIDEOS[row.category]) || DEFAULT_VIDEO,
  };
}

export async function fetchArticles(limit: number, offset: number, category?: string): Promise<Article[]> {
  let query = supabase.from("articles").select(SAFE_COLS).eq("is_published", true);
  if (category) query = query.eq("category", category);
  const { data, error } = await query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) { console.error("fetchArticles:", error.message); return []; }
  return ((data ?? []) as Article[]).map(assignVideo);
}

export async function fetchTodaysArticles(limit: number, offset: number): Promise<Article[]> {
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
  const { data, error } = await supabase.from("articles").select(SAFE_COLS).eq("is_published", true).gte("published_at", startOfDay.toISOString()).order("published_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) { console.error("fetchTodaysArticles:", error.message); return []; }
  return ((data ?? []) as Article[]).map(assignVideo);
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select(SAFE_COLS).eq("slug", slug).eq("is_published", true).maybeSingle();
  if (error) { console.error("fetchArticleBySlug:", error.message); return null; }
  if (!data) return null;
  return assignVideo(data as Article);
}

export async function fetchRelatedArticles(article: Article, limit = 4): Promise<Article[]> {
  const { data, error } = await supabase.from("articles").select(SAFE_COLS).eq("is_published", true).eq("category", article.category).neq("id", article.id).order("published_at", { ascending: false }).limit(limit);
  if (error) { console.error("fetchRelated:", error.message); return []; }
  return ((data ?? []) as Article[]).map(assignVideo);
}

export async function searchArticles(query: string, limit = 24): Promise<Article[]> {
  const { data, error } = await supabase.from("articles").select(SAFE_COLS).eq("is_published", true).or(`title.ilike.%${query}%,dek.ilike.%${query}%`).order("published_at", { ascending: false }).limit(limit);
  if (error) { console.error("searchArticles:", error.message); return []; }
  return ((data ?? []) as Article[]).map(assignVideo);
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
const PAGE_SIZE = 12;
