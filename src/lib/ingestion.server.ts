// Server-only news ingestion + AI processing pipeline.
// Pulls REAL, RECENT news per category, processes with Qwen via OpenRouter,
// fetches Pexels cover when source lacks one, and inserts into `articles`.
// Concurrency parallelised so manual "Curate More" returns fast.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { orJson, pexelsImage } from "./openrouter.server";
import { CATEGORIES } from "./categories";

type RawItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string | null;
  topicHint?: string;
  forcedCategory?: string;
};

const ALLOWED_SLUGS = CATEGORIES.filter((c) => c.slug !== "all").map((c) => c.slug);

// Category-specific keyword queries — these drive REAL targeted searches per topic.
// Subset of high-value slugs; the AI still classifies into any allowed slug.
const CATEGORY_QUERIES: { slug: string; q: string }[] = [
  // Money & Success
  { slug: "billionaires", q: "Elon Musk OR Jeff Bezos OR Mark Zuckerberg OR Bernard Arnault OR Mukesh Ambani OR Gautam Adani OR billionaire" },
  { slug: "entrepreneurs", q: "founder OR startup CEO OR entrepreneur" },
  { slug: "startups", q: "startup funding OR Series A OR Series B OR YCombinator OR venture capital" },
  { slug: "success-stories", q: "success story OR self-made OR breakthrough founder" },
  { slug: "investing", q: "investor OR hedge fund OR private equity OR investment" },
  { slug: "markets", q: "stock market OR S&P 500 OR Nasdaq OR Dow Jones" },
  { slug: "economics", q: "Federal Reserve OR ECB OR inflation OR GDP" },
  { slug: "personal-finance", q: "personal finance OR savings OR retirement OR mortgage" },
  { slug: "business-leaders", q: "CEO OR chairman OR executive leadership" },
  // Tech & AI
  { slug: "artificial-intelligence", q: "OpenAI OR Anthropic OR Google DeepMind OR LLM OR generative AI" },
  { slug: "technology", q: "Apple OR Microsoft OR Nvidia OR Google OR technology" },
  { slug: "robotics", q: "robot OR humanoid OR Boston Dynamics OR robotics" },
  { slug: "future-technology", q: "future technology OR breakthrough innovation" },
  { slug: "quantum-computing", q: "quantum computing OR qubit OR IBM quantum" },
  { slug: "cybersecurity", q: "cyberattack OR ransomware OR data breach OR hacker" },
  { slug: "software", q: "software release OR open source OR developer tool" },
  { slug: "hardware", q: "chip OR processor OR semiconductor OR GPU" },
  { slug: "innovation", q: "innovation OR patent OR breakthrough" },
  // Space
  { slug: "space", q: "NASA OR SpaceX OR ISRO OR rocket launch OR James Webb" },
  { slug: "astronomy", q: "astronomy OR telescope OR galaxy OR star" },
  { slug: "space-missions", q: "Artemis OR Mars mission OR ISS OR lunar lander" },
  { slug: "exoplanets", q: "exoplanet OR habitable planet OR Kepler OR TESS" },
  // Science
  { slug: "science", q: "scientists OR research OR study published OR Nature journal" },
  { slug: "physics", q: "physics OR CERN OR particle OR LIGO" },
  { slug: "biology", q: "biology OR cell OR DNA OR gene" },
  { slug: "genetics", q: "CRISPR OR gene editing OR genome" },
  { slug: "neuroscience", q: "brain OR neuron OR neuroscience OR cognition" },
  { slug: "medicine", q: "medicine OR clinical trial OR drug approval OR treatment" },
  { slug: "research", q: "peer reviewed OR research findings OR new study" },
  // Health
  { slug: "health", q: "WHO OR vaccine OR clinical trial OR FDA" },
  { slug: "fitness", q: "fitness OR workout OR exercise science" },
  { slug: "nutrition", q: "nutrition OR diet OR food science" },
  { slug: "wellness", q: "wellness OR mental health OR mindfulness" },
  // Wildlife / Nature / Oceans
  { slug: "wildlife", q: "endangered species OR wildlife conservation OR tiger OR elephant" },
  { slug: "nature", q: "rainforest OR Amazon OR biodiversity OR ecosystem" },
  { slug: "marine-life", q: "whale OR shark OR coral OR marine life" },
  { slug: "ocean-exploration", q: "deep sea OR submersible OR ocean exploration" },
  { slug: "conservation", q: "conservation project OR protected area OR rewilding" },
  // History / Mysteries
  { slug: "archaeology", q: "archaeologists OR ancient discovery OR excavation" },
  { slug: "ancient-civilizations", q: "ancient civilization OR Mesopotamia OR Indus Valley OR Maya" },
  { slug: "historical-mysteries", q: "ancient mystery OR lost city OR unsolved historical" },
  // Sports
  { slug: "cricket", q: "cricket IPL OR ICC OR Test match OR Virat Kohli OR Rohit Sharma" },
  { slug: "football", q: "Premier League OR Champions League OR FIFA OR Messi OR Ronaldo" },
  { slug: "olympics", q: "Olympics OR IOC OR Paralympics" },
  // Entertainment
  { slug: "movies", q: "Hollywood OR box office OR film premiere OR Oscar" },
  { slug: "music", q: "Grammy OR album release OR Taylor Swift OR concert tour" },
  { slug: "gaming", q: "video game release OR PlayStation OR Xbox OR Nintendo" },
  { slug: "celebrities", q: "celebrity OR Hollywood star OR red carpet" },
  { slug: "web-series", q: "Netflix series OR HBO series OR Prime Video" },
  // World / Geopolitics
  { slug: "world", q: "world news OR international OR breaking" },
  { slug: "geopolitics", q: "United Nations OR NATO OR China US OR Russia" },
  { slug: "global-affairs", q: "global summit OR G20 OR G7 OR diplomacy" },
  { slug: "politics", q: "election OR parliament OR president OR prime minister" },
  // Climate / Energy / Environment
  { slug: "climate", q: "climate change OR COP OR emissions OR global warming" },
  { slug: "renewable-energy", q: "solar OR wind energy OR renewable OR battery storage" },
  { slug: "sustainability", q: "sustainability OR ESG OR circular economy" },
  { slug: "nuclear-energy", q: "nuclear reactor OR fusion OR SMR" },
  // India focus
  { slug: "india", q: "India OR Modi OR Delhi OR Mumbai OR Bengaluru" },
  // Transportation
  { slug: "electric-vehicles", q: "Tesla OR EV OR electric car OR BYD" },
  { slug: "aviation", q: "Boeing OR Airbus OR airline OR aviation" },
  { slug: "autonomous-vehicles", q: "Waymo OR autonomous OR self driving" },
  // Books / Knowledge / Education
  { slug: "books", q: "book release OR author interview OR best seller book" },
  { slug: "education", q: "education policy OR university OR higher education" },
  // Misc
  { slug: "astrology", q: "astrology OR horoscope OR zodiac OR panchang" },
  { slug: "luxury-brands", q: "LVMH OR Hermes OR Rolex OR luxury brand" },
  { slug: "smart-cities", q: "smart city OR urban tech OR megaproject" },
];


const RSS_FEEDS: { source: string; url: string; topicHint?: string; forcedCategory?: string }[] = [
  // World / Geopolitics
  { source: "BBC World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", forcedCategory: "world" },
  { source: "Reuters World", url: "https://www.reutersagency.com/feed/?best-topics=world&post_type=best", forcedCategory: "world" },
  { source: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml", forcedCategory: "world" },
  { source: "France24", url: "https://www.france24.com/en/rss", forcedCategory: "world" },
  { source: "DW World", url: "https://rss.dw.com/rdf/rss-en-world", forcedCategory: "world" },
  { source: "NPR World", url: "https://feeds.npr.org/1004/rss.xml", forcedCategory: "world" },
  // Politics
  { source: "BBC Politics", url: "https://feeds.bbci.co.uk/news/politics/rss.xml", forcedCategory: "politics" },
  { source: "Politico", url: "https://www.politico.com/rss/politicopicks.xml", forcedCategory: "politics" },
  { source: "Reuters Politics", url: "https://www.reutersagency.com/feed/?best-topics=political-general&post_type=best", forcedCategory: "politics" },
  // Science
  { source: "BBC Science", url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", forcedCategory: "science" },
  { source: "Nature", url: "https://www.nature.com/nature.rss", forcedCategory: "science" },
  { source: "Scientific American", url: "https://www.scientificamerican.com/feed/", forcedCategory: "science" },
  { source: "Science Daily", url: "https://www.sciencedaily.com/rss/all.xml", forcedCategory: "science" },
  { source: "Phys.org", url: "https://phys.org/rss-feed/", forcedCategory: "science" },
  { source: "New Scientist", url: "https://www.newscientist.com/feed/home/", forcedCategory: "science" },
  // Space
  { source: "NASA", url: "https://www.nasa.gov/news-release/feed/", forcedCategory: "space" },
  { source: "Space.com", url: "https://www.space.com/feeds/all", forcedCategory: "space" },
  { source: "Spaceflight Now", url: "https://spaceflightnow.com/feed/", forcedCategory: "space" },
  { source: "ESA", url: "https://www.esa.int/rssfeed/Our_Activities/Space_News", forcedCategory: "space" },
  // Astronomy
  { source: "Sky & Telescope", url: "https://skyandtelescope.org/feed/", forcedCategory: "astronomy" },
  { source: "Astronomy Magazine", url: "https://astronomy.com/rss/news", forcedCategory: "astronomy" },
  // Technology
  { source: "TechCrunch", url: "https://techcrunch.com/feed/", forcedCategory: "technology" },
  { source: "Wired", url: "https://www.wired.com/feed/rss", forcedCategory: "technology" },
  { source: "The Verge", url: "https://www.theverge.com/rss/index.xml", forcedCategory: "technology" },
  { source: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", forcedCategory: "technology" },
  { source: "Engadget", url: "https://www.engadget.com/rss.xml", forcedCategory: "technology" },
  // AI
  { source: "MIT Tech Review AI", url: "https://www.technologyreview.com/feed/", forcedCategory: "artificial-intelligence" },
  { source: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/", forcedCategory: "artificial-intelligence" },
  // Cybersecurity
  { source: "Krebs on Security", url: "https://krebsonsecurity.com/feed/", forcedCategory: "cybersecurity" },
  { source: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", forcedCategory: "cybersecurity" },
  // Business / Markets / Money
  { source: "Reuters Business", url: "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best", forcedCategory: "markets" },
  { source: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml", forcedCategory: "economics" },
  { source: "Forbes Billionaires", url: "https://www.forbes.com/billionaires/feed/", forcedCategory: "billionaires" },
  { source: "Forbes Entrepreneurs", url: "https://www.forbes.com/entrepreneurs/feed/", forcedCategory: "entrepreneurs" },
  { source: "Inc. Startups", url: "https://www.inc.com/rss", forcedCategory: "startups" },
  // Health
  { source: "WHO", url: "https://www.who.int/rss-feeds/news-english.xml", forcedCategory: "health" },
  { source: "Medical News Today", url: "https://www.medicalnewstoday.com/newsfeeds/rss/medical_all.xml", forcedCategory: "health" },
  { source: "Harvard Health", url: "https://www.health.harvard.edu/blog/feed", forcedCategory: "wellness" },
  // India
  { source: "The Hindu", url: "https://www.thehindu.com/news/national/feeder/default.rss", forcedCategory: "india" },
  { source: "Indian Express", url: "https://indianexpress.com/section/india/feed/", forcedCategory: "india" },
  { source: "Times of India", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", forcedCategory: "india" },
  { source: "Hindustan Times India", url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", forcedCategory: "india" },
  { source: "NDTV India", url: "https://feeds.feedburner.com/ndtvnews-top-stories", forcedCategory: "india" },
  // Wildlife / Nature / Oceans / Environment
  { source: "National Geographic Animals", url: "https://www.nationalgeographic.com/animals/rss/", forcedCategory: "wildlife" },
  { source: "Mongabay", url: "https://news.mongabay.com/feed/", forcedCategory: "nature" },
  { source: "NOAA", url: "https://www.noaa.gov/feeds/news.xml", forcedCategory: "ocean-exploration" },
  { source: "Yale e360", url: "https://e360.yale.edu/feed.xml", forcedCategory: "environment" },
  { source: "Inside Climate News", url: "https://insideclimatenews.org/feed/", forcedCategory: "climate" },
  // Sports
  { source: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml", forcedCategory: "football" },
  { source: "ESPN Cricinfo", url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml", forcedCategory: "cricket" },
  // Entertainment
  { source: "Variety", url: "https://variety.com/feed/", forcedCategory: "movies" },
  { source: "Hollywood Reporter", url: "https://www.hollywoodreporter.com/feed/", forcedCategory: "celebrities" },
  { source: "IGN Gaming", url: "https://feeds.feedburner.com/ign/games-all", forcedCategory: "gaming" },
  { source: "Billboard Music", url: "https://www.billboard.com/feed/", forcedCategory: "music" },
  // Books / Education / Culture
  { source: "NYT Books", url: "https://rss.nytimes.com/services/xml/rss/nyt/Books.xml", forcedCategory: "books" },
  { source: "Smithsonian", url: "https://www.smithsonianmag.com/rss/latest_articles/", forcedCategory: "culture" },
  { source: "Archaeology News", url: "https://www.archaeology.org/index.php?option=com_obrss&task=feed&id=5:archaeology-magazine-news&format=feed&Itemid=121", forcedCategory: "archaeology" },
  // Economics
  { source: "World Bank", url: "https://www.worldbank.org/en/news/all?format=rss", forcedCategory: "economics" },
  // EVs / Transport
  { source: "Electrek", url: "https://electrek.co/feed/", forcedCategory: "electric-vehicles" },
  { source: "Aviation Week", url: "https://aviationweek.com/rss.xml", forcedCategory: "aviation" },
  // Energy
  { source: "Renewable Energy World", url: "https://www.renewableenergyworld.com/feed/", forcedCategory: "renewable-energy" },
];

function adminClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

async function fetchJson(url: string, init?: RequestInit, timeoutMs = 10000): Promise<any> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...init, signal: c.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchText(url: string, timeoutMs = 10000): Promise<string | null> {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), timeoutMs);
  try {
    const r = await fetch(url, { signal: c.signal, headers: { "user-agent": "TheUnitedHell/1.0" } });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function xmlDecode(s = "") {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block: string, name: string) {
  return block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] ?? "";
}

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400_000).toISOString();
}

async function fromNewsAPICategorical(): Promise<RawItem[]> {
  const k = process.env.NEWSAPI_KEY;
  if (!k) return [];
  const from = isoDaysAgo(2).slice(0, 10);
  const out: RawItem[] = [];
  // NewsAPI developer plan: 100 req/day. Cron runs every 20 min = 72 runs/day.
  // Rotate through CATEGORY_QUERIES so each run uses only 1 query (~72/day, well under limit).
  const idx = Math.floor(Date.now() / (20 * 60 * 1000)) % CATEGORY_QUERIES.length;
  const picks = [CATEGORY_QUERIES[idx]];
  const results = await Promise.allSettled(
    picks.map(async ({ slug, q }) => {
      const d = await fetchJson(
        `https://newsapi.org/v2/everything?language=en&pageSize=20&sortBy=publishedAt&from=${from}&q=${encodeURIComponent(q)}&apiKey=${k}`,
      );
      const items: RawItem[] = [];
      for (const a of d?.articles ?? []) {
        if (!a?.title || !a?.url || a.title === "[Removed]") continue;
        items.push({
          title: a.title,
          description: a.description || a.content || "",
          url: a.url,
          source: a.source?.name || "NewsAPI",
          publishedAt: a.publishedAt || new Date().toISOString(),
          imageUrl: a.urlToImage || null,
          topicHint: slug,
          forcedCategory: slug,
        });
      }
      return items;
    }),
  );
  for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
  return out;
}

async function fromGNewsTopHeadlines(): Promise<RawItem[]> {
  const k = process.env.GNEWS_KEY || process.env.GNEWS_API_KEY;
  if (!k) return [];
  const topics = ["world", "nation", "business", "technology", "entertainment", "sports", "science", "health"];
  const out: RawItem[] = [];
  const results = await Promise.allSettled(
    topics.map(async (topic) => {
      const d = await fetchJson(
        `https://gnews.io/api/v4/top-headlines?lang=en&max=6&topic=${topic}&apikey=${k}`,
      );
      const items: RawItem[] = [];
      for (const a of d?.articles ?? []) {
        if (!a?.title || !a?.url) continue;
        items.push({
          title: a.title,
          description: a.description || "",
          url: a.url,
          source: a.source?.name || "GNews",
          publishedAt: a.publishedAt || new Date().toISOString(),
          imageUrl: a.image || null,
          topicHint: topic,
        });
      }
      return items;
    }),
  );
  for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
  return out;
}

async function fromRSS(): Promise<RawItem[]> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const xml = await fetchText(feed.url);
      if (!xml) return [] as RawItem[];
      const blocks = [...xml.matchAll(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi)].map((m) => m[0]);
      return blocks.slice(0, 8).map((b) => {
        const title = xmlDecode(tag(b, "title"));
        const description = xmlDecode(tag(b, "description") || tag(b, "summary") || tag(b, "content"));
        const href = b.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
        const link = xmlDecode(href || tag(b, "link") || tag(b, "guid"));
        const pub = xmlDecode(tag(b, "pubDate") || tag(b, "updated") || tag(b, "published"));
        const media = b.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i)?.[1]
          || b.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*>/i)?.[1];
        return {
          title,
          description,
          url: link,
          source: feed.source,
          publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString(),
          imageUrl: media || null,
          topicHint: feed.topicHint,
          forcedCategory: feed.forcedCategory,
        } satisfies RawItem;
      }).filter((i) => i.title && i.url);
    }),
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

type Processed = {
  title: string;
  dek: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  trust_score: number;
  read_time_minutes: number;
  story: {
    what: string;
    why: string;
    key_facts: string[];
    insights?: string[];
    next?: string;
    future_impact?: string;
    why_should_i_care?: string;
    how_affects_world?: string;
    what_can_we_learn?: string;
    why_interesting?: string;
    key_takeaways?: string[];
    quick_facts?: string[];
    timeline?: string[];
    did_you_know?: string;
    people_mentioned?: string[];
    organizations_mentioned?: string[];
    countries_mentioned?: string[];
    vocabulary?: { word: string; meaning: string }[];
  };
  country_code?: string | null;
};

const SYSTEM = `You are a senior wire-service editor at "The United Hell", a premium global newspaper. You write like Reuters, AP, BBC, The Hindu, NYT, WSJ, Indian Express, Nature, and Scientific American.

ABSOLUTE STYLE RULES — violating these = your output is rejected:
- Headlines MUST be plain news headlines a real journalist would write. Use concrete subjects, verbs, and outcomes. Examples of GOOD headlines: "ISRO Successfully Tests Reusable Launch Vehicle", "India's Tiger Population Reaches Record High", "NASA Releases New Jupiter Images From Juno", "Scientists Discover Ancient Temple Beneath Egyptian Desert".
- NEVER use these academic / AI-essay patterns: "The Architecture of …", "The Renaissance of …", "Sovereignty of …", "Silicon Monoliths", "Linguistic Sovereignty", "The Silent Scripts of …", "Decentralized Intelligence in …", "Computational X and Y", "The Digital Twin of the …", colon-then-grand-abstract-noun titles, "Indo-Gangetic", "Krishna-Godavari", "Deccan" framed metaphors, any title built from abstract nouns chained together.
- NEVER invent events, people, companies, studies, quotes, discoveries, numbers, dates, or context that is not present in the raw source. If a fact is missing, leave that field general or omit specifics — do not fabricate.
- Write at age-13 reading level. Simple English. Short sentences. Real names, real places, real numbers from the source.
- No hype words like "revolutionary", "game-changing", "unprecedented" unless the source itself uses them.

Return STRICT JSON ONLY (no markdown, no commentary):
{
  "title": "natural journalistic headline, max 90 chars, no colon-essay style",
  "dek": "one-line summary, max 150 chars",
  "category": "<slug from allowed list>",
  "subcategory": "short label",
  "tags": ["..","..","..","..","..","..","..",".."],
  "trust_score": 70-98,
  "read_time_minutes": 5-10,
  "country_code": "ISO alpha-2 or null",
  "story": {
    "what": "3-5 short paragraphs with names, places, dates, numbers, source-bound facts only",
    "why": "Why is this important? (clear, source-bound)",
    "why_should_i_care": "Why should I care?",
    "how_affects_world": "How does this affect the world?",
    "what_can_we_learn": "What can we learn from it?",
    "why_interesting": "Why is it interesting?",
    "key_facts": ["..","..","..",".."],
    "key_takeaways": ["..","..",".."],
    "quick_facts": ["..","..",".."],
    "timeline": ["..",".."],
    "did_you_know": "one verified educational fact related to the topic",
    "insights": ["expert-style context with NO fabricated quotes", "another useful insight"],
    "next": "what likely happens next, based ONLY on the source",
    "future_impact": "1-2 sentences",
    "people_mentioned": [".."],
    "organizations_mentioned": [".."],
    "countries_mentioned": [".."],
    "vocabulary": [{"word":"..","meaning":"simple plain-English meaning"}]
  }
}`;

async function processItem(raw: RawItem): Promise<Processed | null> {
  try {
    const allowed = ALLOWED_SLUGS.join(", ");
    const out = await orJson<Processed>({
      system: SYSTEM,
      prompt: `Allowed category slugs (pick the single best match): ${allowed}
${raw.forcedCategory ? `STRONG HINT: this item was sourced for category "${raw.forcedCategory}". Use it unless clearly wrong.` : ""}

Raw item:
TITLE: ${raw.title}
SOURCE: ${raw.source}
PUBLISHED: ${raw.publishedAt}
URL: ${raw.url}
DESCRIPTION: ${(raw.description || "").slice(0, 1400) || "(none)"}

Process it.`,
    });
    if (!out?.title) return null;
    // ENFORCE the forced category from the source query so every slug actually fills.
    // The AI is otherwise prone to collapsing everything into a few broad buckets.
    if (raw.forcedCategory && ALLOWED_SLUGS.includes(raw.forcedCategory)) {
      out.category = raw.forcedCategory;
    } else if (!out.category || !ALLOWED_SLUGS.includes(out.category)) {
      out.category = "discovery";
    }
    return out;
  } catch (e) {
    console.error("[ingest] AI process failed:", (e as Error).message);
    return fallbackProcessed(raw);
  }
}

function fallbackProcessed(raw: RawItem): Processed {
  const category = raw.forcedCategory && ALLOWED_SLUGS.includes(raw.forcedCategory) ? raw.forcedCategory : "world";
  const title = raw.title.replace(/\s[-|–|—]\s.*$/, "").replace(/^\s*Live updates?:\s*/i, "").slice(0, 95);
  const summary = raw.description || `A verified report from ${raw.source} published on ${new Date(raw.publishedAt).toUTCString()}.`;
  const sourceLine = `${raw.source} reported this story on ${new Date(raw.publishedAt).toUTCString()}.`;
  return {
    title,
    dek: summary.slice(0, 150),
    category,
    subcategory: raw.topicHint || category,
    tags: [category, raw.source, ...(raw.topicHint ? [raw.topicHint] : [])].slice(0, 8),
    trust_score: 82,
    read_time_minutes: 5,
    country_code: category === "india" ? "IN" : null,
    story: {
      what: `${summary}\n\n${sourceLine} The United Hell is preserving the report as a factual news brief and linking readers back to the original source for the complete primary account.`,
      why: "This matters because it adds a verified new development to a wider public story and helps readers follow what changed, who is involved, and why the update is being reported now.",
      why_should_i_care: "You should care because reliable, recent information helps you understand decisions, discoveries, risks, opportunities, and events that can shape daily life and the wider world.",
      how_affects_world: "The broader impact depends on how governments, companies, researchers, communities, or markets respond next. The original source should be read for the full detail.",
      what_can_we_learn: "The key lesson is to follow verified sources, compare new updates with context, and separate confirmed facts from claims that still need more evidence.",
      why_interesting: "It is interesting because it captures a current real-world change rather than a generic background topic, making it useful for readers who want fresh knowledge.",
      key_facts: [title, sourceLine, `Category: ${category}`, "This brief is based on a real external source and does not invent extra claims."],
      key_takeaways: ["A real source published a new update.", "The story is recent and source-linked.", "Readers can open the source for full reporting."],
      quick_facts: [`Source: ${raw.source}`, `Published: ${new Date(raw.publishedAt).toUTCString()}`, `Topic: ${category}`],
      timeline: [`${new Date(raw.publishedAt).toUTCString()}: ${raw.source} published the report.`],
      did_you_know: "Professional newsrooms update stories as more verified information becomes available, which is why source links and publication dates matter.",
      insights: ["Verified source links are more important than decorative summaries.", "A concise brief should make the main update clear without adding unsupported claims."],
      next: "The next step is to watch for follow-up reporting, official statements, data releases, or expert analysis connected to the original source.",
      future_impact: "If the development continues, it may influence public discussion and future coverage in this field.",
      people_mentioned: [],
      organizations_mentioned: [raw.source],
      countries_mentioned: category === "india" ? ["India"] : [],
      vocabulary: [
        { word: "Verified", meaning: "Checked against a real source or reliable evidence." },
        { word: "Context", meaning: "Background information that helps explain why a story matters." },
        { word: "Source", meaning: "The publication, institution, or record where information comes from." },
      ],
    },
  };
}

// Simple concurrency-limited map
async function pMap<T, R>(arr: T[], n: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(arr.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= arr.length) return;
      out[idx] = await fn(arr[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, arr.length) }, worker));
  return out;
}

export async function runIngestion(opts?: { maxItems?: number }): Promise<{
  fetched: number;
  inserted: number;
  skipped: number;
  errors: number;
  pruned: number;
}> {
  const supabase = adminClient();
  const max = opts?.maxItems ?? 30;

  // 1. Pull live sources in parallel. RSS keeps content flowing even when a metered API is throttled.
  const [na, gn, rss] = await Promise.allSettled([
    fromNewsAPICategorical(),
    fromGNewsTopHeadlines(),
    fromRSS(),
  ]);
  const all: RawItem[] = [];
  for (const r of [na, gn, rss]) if (r.status === "fulfilled") all.push(...r.value);

  // 2. Filter: recent useful items, valid title, dedupe by title and URL.
  const cutoff = Date.now() - 8 * 86400_000;
  const seen = new Set<string>();
  const queue = all.filter((i) => {
    const k = i.title?.trim().toLowerCase().replace(/\s+/g, " ");
    const u = i.url?.trim().toLowerCase();
    if (!k || !u || seen.has(k) || seen.has(u)) return false;
    const ts = new Date(i.publishedAt).getTime();
    if (isNaN(ts) || ts < cutoff) return false;
    seen.add(k); seen.add(u);
    return true;
  });

  // 3. Skip those already in DB
  const titles = queue.map((q) => q.title);
  const { data: existing } = await supabase
    .from("articles")
    .select("title,sources")
    .in("title", titles.length ? titles : ["__none__"]);
  const existingSet = new Set<string>();
  for (const e of (existing ?? []) as { title: string; sources?: { url?: string }[] }[]) {
    existingSet.add(e.title?.toLowerCase().replace(/\s+/g, " "));
    for (const s of e.sources ?? []) if (s?.url) existingSet.add(s.url.toLowerCase());
  }
  const fresh = queue.filter((q) => !existingSet.has(q.title.toLowerCase().replace(/\s+/g, " ")) && !existingSet.has(q.url.toLowerCase())).slice(0, max);

  // 4. Process in parallel (concurrency 6)
  const processed = await pMap(fresh, 6, async (raw) => {
    const p = await processItem(raw);
    if (!p) return null;
    let cover = raw.imageUrl || null;
    if (!cover) {
      cover = await pexelsImage(p.tags?.[0] || p.category || raw.topicHint || "news");
    }
    return { raw, p, cover };
  });

  let inserted = 0;
  let errors = 0;
  const rows: Database["public"]["Tables"]["articles"]["Insert"][] = [];
  for (const item of processed) {
    if (!item) { errors++; continue; }
    const { raw, p, cover } = item;
    rows.push({
      slug: `${slugify(p.title)}-${Math.random().toString(36).slice(2, 6)}`,
      title: p.title,
      dek: p.dek || null,
      category: p.category,
      subcategory: p.subcategory || null,
      cover_image_url: cover,
      read_time_minutes: Math.max(2, Math.min(12, p.read_time_minutes || 4)),
      trust_score: Math.max(60, Math.min(99, p.trust_score || 85)),
      source_count: 1,
      sources: [{ name: raw.source, url: raw.url }] as unknown as Database["public"]["Tables"]["articles"]["Insert"]["sources"],
      story: (p.story || {}) as unknown as Database["public"]["Tables"]["articles"]["Insert"]["story"],
      country_code: p.country_code || null,
      published_at: raw.publishedAt,
      is_published: true,
    });
  }
  if (rows.length) {
    const { error, count } = await supabase.from("articles").insert(rows, { count: "exact" });
    if (error) {
      console.error("[ingest] batch insert failed:", error.message);
      errors += rows.length;
    } else {
      inserted = count ?? rows.length;
    }
  }

  return {
    fetched: all.length,
    inserted,
    skipped: existingSet.size,
    errors,
    pruned: 0,
  };
}
