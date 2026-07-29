import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { ArticleSummary } from "./types";

const SUPABASE_URL = "https://myrteqlcfwckgdokzzhg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnRlcWxjZndja2dkb2t6emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjE4OTgsImV4cCI6MjA5ODI5Nzg5OH0.lGAyAxmYrJAag1yONChoqV4-A1QQAkdWKxZp5IMJyII";

function publicClient() {
  const url = process.env.SUPABASE_URL || SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

const SUMMARY_COLS =
  "id,slug,title,dek,category,subcategory,cover_image_url,read_time_minutes,country_code,featured_slot,published_at,created_at,view_count,like_count,bookmark_count,comment_count";

export type EpaperSection = {
  id: string;
  label: string;
  kicker: string;
  articles: ArticleSummary[];
};

export type EpaperData = {
  date: string;
  dateDisplay: string;
  topStories: ArticleSummary[];
  editorsPicks: ArticleSummary[];
  sections: EpaperSection[];
  marketSnapshot: MarketSnap[];
  quoteOfDay: { text: string; author: string };
  thisDayHistory: string[];
  photoOfDay: { url: string; caption: string; credit: string };
  totalArticles: number;
};

type MarketSnap = {
  symbol: string;
  name: string;
  category: string;
  region: string | null;
  price: number | null;
  change: number | null;
  change_percent: number | null;
  available: boolean;
};

const SECTION_MAP: { id: string; label: string; kicker: string; cats: string[] }[] = [
  { id: "world", label: "World", kicker: "Planet Earth", cats: ["world", "world-discovery", "global-affairs", "geopolitics", "politics", "government", "diplomacy", "international-relations"] },
  { id: "india", label: "India", kicker: "Nation", cats: ["india", "indian-innovation", "indian-startups", "indian-history", "indian-culture", "indian-science", "indian-wildlife"] },
  { id: "business", label: "Business & Economy", kicker: "Money & Success", cats: ["markets", "economics", "investing", "success-stories", "entrepreneurs", "startups", "business-leaders", "personal-finance", "wealth-creation"] },
  { id: "technology", label: "Technology & AI", kicker: "Future & Innovation", cats: ["technology", "artificial-intelligence", "robotics", "future-technology", "innovation", "cybersecurity", "quantum-computing"] },
  { id: "science", label: "Science", kicker: "Discovery", cats: ["science", "physics", "chemistry", "biology", "genetics", "neuroscience", "medicine", "research", "scientific-discoveries", "breakthroughs"] },
  { id: "space", label: "Space & Astronomy", kicker: "The Universe", cats: ["space", "astronomy", "cosmology", "space-missions", "exoplanets", "black-holes", "future-space-exploration"] },
  { id: "nature", label: "Nature & Climate", kicker: "Earth Chronicle", cats: ["climate", "sustainability", "environmental-protection", "wildlife", "nature", "conservation", "biodiversity", "marine-life", "ocean-exploration"] },
  { id: "history", label: "History & Knowledge", kicker: "Deep Reads", cats: ["history", "ancient-civilizations", "archaeology", "historical-mysteries", "unsolved-mysteries", "books", "education", "explainers"] },
  { id: "health", label: "Health & Lifestyle", kicker: "Living Well", cats: ["health", "fitness", "nutrition", "longevity", "psychology", "wellness", "food-culinary-culture", "travel"] },
  { id: "entertainment", label: "Culture & Entertainment", kicker: "The Arts", cats: ["entertainment", "movies", "music", "gaming", "culture", "art", "photography", "streaming", "web-series"] },
  { id: "sports", label: "Sports", kicker: "The Game", cats: ["cricket", "football", "olympics", "athletes", "sports-science", "major-events", "esports"] },
  { id: "future", label: "Future of Humanity", kicker: "Tomorrow", cats: ["future", "future-of-ai", "future-of-work", "future-of-civilization", "future-predictions", "future-energy", "future-cities"] },
];

async function fetchMarketSnapshot(): Promise<MarketSnap[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/market_prices?select=symbol,name,category,region,price,change,change_percent,available&order=symbol.asc`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const QUOTES = [
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Knowledge is power. Information is liberating.", author: "Kofi Annan" },
  { text: "The universe is not only queerer than we suppose, but queerer than we can suppose.", author: "J.B.S. Haldane" },
  { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
  { text: "The greatest discovery of all time is that a person can change their future by merely changing their attitude.", author: "Oprah Winfrey" },
];

const HISTORY_FACTS = [
  "In 1958, NASA was created, marking the beginning of the space age.",
  "In 1969, Apollo 11 landed humans on the Moon for the first time.",
  "In 1989, the World Wide Web was invented, revolutionizing communication.",
  "In 2001, Wikipedia was launched, democratizing knowledge access.",
  "In 2007, the iPhone was introduced, reshaping mobile technology.",
  "In 2012, the Higgs boson particle was discovered at CERN.",
  "In 2015, gravitational waves were detected, confirming Einstein's prediction.",
  "In 2019, the first image of a black hole was captured.",
];

function pickDaily<T>(arr: T[], dateKey: string): T {
  const seed = dateKey.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
  return arr[seed % arr.length];
}

export const getEpaperData = createServerFn({ method: "GET" }).handler(async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  const dateDisplay = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let deduped: ArticleSummary[] = [];
  try {
    const supabase = publicClient();
    const { data: todayRows, error } = await supabase
      .from("articles")
      .select(SUMMARY_COLS)
      .eq("is_published", true)
      .gte("published_at", new Date(Date.now() - 30 * 86400000).toISOString())
      .order("published_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("[epaper] articles query error:", error.message);
    }

    const allArticles = (todayRows ?? []) as unknown as ArticleSummary[];
    const seen = new Set<string>();
    deduped = allArticles.filter((a) => {
      if (!a.id || seen.has(a.id)) return false;
      seen.add(a.id);
      return true;
    });
  } catch (err) {
    console.error("[epaper] failed to fetch articles:", err);
  }

  const topStories = deduped.slice(0, 10);
  const editorsPicks = [...deduped]
    .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
    .slice(0, 5);

  const usedIds = new Set<string>([
    ...topStories.slice(0, 5).map((a) => a.id),
    ...editorsPicks.map((a) => a.id),
  ]);
  const sections: EpaperSection[] = SECTION_MAP.map((sec) => {
    const articles = deduped
      .filter((a) => sec.cats.includes(a.category) && !usedIds.has(a.id))
      .slice(0, 6);
    articles.forEach((a) => usedIds.add(a.id));
    return { id: sec.id, label: sec.label, kicker: sec.kicker, articles };
  }).filter((s) => s.articles.length > 0);

  let marketSnapshot: MarketSnap[] = [];
  try {
    marketSnapshot = await fetchMarketSnapshot();
  } catch (err) {
    console.error("[epaper] failed to fetch market snapshot:", err);
  }

  const quoteOfDay = pickDaily(QUOTES, dateStr);
  const thisDayHistory = [pickDaily(HISTORY_FACTS, dateStr)];
  const photoArticle = deduped.find((a) => a.cover_image_url);
  const photoOfDay = {
    url: photoArticle?.cover_image_url ?? "",
    caption: photoArticle?.title ?? "Today's featured image",
    credit: "The United Hell",
  };

  return {
    date: dateStr,
    dateDisplay,
    topStories,
    editorsPicks,
    sections,
    marketSnapshot,
    quoteOfDay,
    thisDayHistory,
    photoOfDay,
    totalArticles: deduped.length,
  } as EpaperData;
});
