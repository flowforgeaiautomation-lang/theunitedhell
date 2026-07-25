import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as CATEGORIES } from "./categories-BEROsZZ5.mjs";
import { r as lookupWords } from "./dictionary.server-CJ6qJACk.mjs";
import { n as orJson, r as pexelsImage, t as getCategoryFallbackImage } from "./openrouter.server-CyJoPfDo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ingestion.server-Ck-adzBE.js
var ALLOWED_SLUGS = CATEGORIES.filter((c) => c.slug !== "all").map((c) => c.slug);
var CATEGORY_QUERY_MAP = new Map([
	{
		slug: "billionaires",
		q: "Elon Musk OR Jeff Bezos OR Mark Zuckerberg OR Bernard Arnault OR Mukesh Ambani OR Gautam Adani OR billionaire"
	},
	{
		slug: "entrepreneurs",
		q: "founder OR startup CEO OR entrepreneur"
	},
	{
		slug: "startups",
		q: "startup funding OR Series A OR Series B OR YCombinator OR venture capital"
	},
	{
		slug: "success-stories",
		q: "success story OR self-made OR breakthrough founder"
	},
	{
		slug: "investing",
		q: "investor OR hedge fund OR private equity OR investment"
	},
	{
		slug: "markets",
		q: "stock market OR S&P 500 OR Nasdaq OR Dow Jones"
	},
	{
		slug: "economics",
		q: "Federal Reserve OR ECB OR inflation OR GDP"
	},
	{
		slug: "personal-finance",
		q: "personal finance OR savings OR retirement OR mortgage"
	},
	{
		slug: "business-leaders",
		q: "CEO OR chairman OR executive leadership"
	},
	{
		slug: "artificial-intelligence",
		q: "OpenAI OR Anthropic OR Google DeepMind OR LLM OR generative AI"
	},
	{
		slug: "technology",
		q: "Apple OR Microsoft OR Nvidia OR Google OR technology"
	},
	{
		slug: "robotics",
		q: "robot OR humanoid OR Boston Dynamics OR robotics"
	},
	{
		slug: "future-technology",
		q: "future technology OR breakthrough innovation"
	},
	{
		slug: "quantum-computing",
		q: "quantum computing OR qubit OR IBM quantum"
	},
	{
		slug: "cybersecurity",
		q: "cyberattack OR ransomware OR data breach OR hacker"
	},
	{
		slug: "software",
		q: "software release OR open source OR developer tool"
	},
	{
		slug: "hardware",
		q: "chip OR processor OR semiconductor OR GPU"
	},
	{
		slug: "innovation",
		q: "innovation OR patent OR breakthrough"
	},
	{
		slug: "space",
		q: "NASA OR SpaceX OR ISRO OR rocket launch OR James Webb"
	},
	{
		slug: "astronomy",
		q: "astronomy OR telescope OR galaxy OR star"
	},
	{
		slug: "space-missions",
		q: "Artemis OR Mars mission OR ISS OR lunar lander"
	},
	{
		slug: "exoplanets",
		q: "exoplanet OR habitable planet OR Kepler OR TESS"
	},
	{
		slug: "science",
		q: "scientists OR research OR study published OR Nature journal"
	},
	{
		slug: "physics",
		q: "physics OR CERN OR particle OR LIGO"
	},
	{
		slug: "biology",
		q: "biology OR cell OR DNA OR gene"
	},
	{
		slug: "genetics",
		q: "CRISPR OR gene editing OR genome"
	},
	{
		slug: "neuroscience",
		q: "brain OR neuron OR neuroscience OR cognition"
	},
	{
		slug: "medicine",
		q: "medicine OR clinical trial OR drug approval OR treatment"
	},
	{
		slug: "research",
		q: "peer reviewed OR research findings OR new study"
	},
	{
		slug: "health",
		q: "WHO OR vaccine OR clinical trial OR FDA"
	},
	{
		slug: "fitness",
		q: "fitness OR workout OR exercise science"
	},
	{
		slug: "nutrition",
		q: "nutrition OR diet OR food science"
	},
	{
		slug: "wellness",
		q: "wellness OR mental health OR mindfulness"
	},
	{
		slug: "wildlife",
		q: "endangered species OR wildlife conservation OR tiger OR elephant"
	},
	{
		slug: "nature",
		q: "rainforest OR Amazon OR biodiversity OR ecosystem"
	},
	{
		slug: "marine-life",
		q: "whale OR shark OR coral OR marine life"
	},
	{
		slug: "ocean-exploration",
		q: "deep sea OR submersible OR ocean exploration"
	},
	{
		slug: "conservation",
		q: "conservation project OR protected area OR rewilding"
	},
	{
		slug: "archaeology",
		q: "archaeologists OR ancient discovery OR excavation"
	},
	{
		slug: "ancient-civilizations",
		q: "ancient civilization OR Mesopotamia OR Indus Valley OR Maya"
	},
	{
		slug: "historical-mysteries",
		q: "ancient mystery OR lost city OR unsolved historical"
	},
	{
		slug: "cricket",
		q: "cricket IPL OR ICC OR Test match OR Virat Kohli OR Rohit Sharma"
	},
	{
		slug: "football",
		q: "Premier League OR Champions League OR FIFA OR Messi OR Ronaldo"
	},
	{
		slug: "olympics",
		q: "Olympics OR IOC OR Paralympics"
	},
	{
		slug: "movies",
		q: "Hollywood OR box office OR film premiere OR Oscar"
	},
	{
		slug: "music",
		q: "Grammy OR album release OR Taylor Swift OR concert tour"
	},
	{
		slug: "gaming",
		q: "video game release OR PlayStation OR Xbox OR Nintendo"
	},
	{
		slug: "celebrities",
		q: "celebrity OR Hollywood star OR red carpet"
	},
	{
		slug: "web-series",
		q: "Netflix series OR HBO series OR Prime Video"
	},
	{
		slug: "world",
		q: "world news OR international OR breaking"
	},
	{
		slug: "geopolitics",
		q: "United Nations OR NATO OR China US OR Russia"
	},
	{
		slug: "global-affairs",
		q: "global summit OR G20 OR G7 OR diplomacy"
	},
	{
		slug: "politics",
		q: "election OR parliament OR president OR prime minister"
	},
	{
		slug: "climate",
		q: "climate change OR COP OR emissions OR global warming"
	},
	{
		slug: "renewable-energy",
		q: "solar OR wind energy OR renewable OR battery storage"
	},
	{
		slug: "sustainability",
		q: "sustainability OR ESG OR circular economy"
	},
	{
		slug: "nuclear-energy",
		q: "nuclear reactor OR fusion OR SMR"
	},
	{
		slug: "india",
		q: "India OR Modi OR Delhi OR Mumbai OR Bengaluru"
	},
	{
		slug: "electric-vehicles",
		q: "Tesla OR EV OR electric car OR BYD"
	},
	{
		slug: "aviation",
		q: "Boeing OR Airbus OR airline OR aviation"
	},
	{
		slug: "autonomous-vehicles",
		q: "Waymo OR autonomous OR self driving"
	},
	{
		slug: "books",
		q: "book release OR author interview OR best seller book"
	},
	{
		slug: "education",
		q: "education policy OR university OR higher education"
	},
	{
		slug: "astrology",
		q: "astrology OR horoscope OR zodiac OR panchang"
	},
	{
		slug: "luxury-brands",
		q: "LVMH OR Hermes OR Rolex OR luxury brand"
	},
	{
		slug: "smart-cities",
		q: "smart city OR urban tech OR megaproject"
	}
].map((item) => [item.slug, item.q]));
var TOPIC_CATEGORY_MAP = {
	nation: "politics",
	business: "markets",
	sport: "football",
	sports: "football",
	arts: "culture",
	books: "books",
	environment: "climate",
	top: "trending-now",
	Futurology: "future",
	UpliftingNews: "inspirational-stories",
	todayilearned: "curiosity",
	Damnthatsinteresting: "curiosity",
	EarthPorn: "nature",
	worldnews: "world",
	news: "breaking-news"
};
function categoryFromHint(raw) {
	const hint = raw.forcedCategory || raw.topicHint;
	if (!hint) return void 0;
	if (ALLOWED_SLUGS.includes(hint)) return hint;
	const mapped = TOPIC_CATEGORY_MAP[hint] || TOPIC_CATEGORY_MAP[hint.toLowerCase()];
	return mapped && ALLOWED_SLUGS.includes(mapped) ? mapped : void 0;
}
function expandedCategoryQueries(priorityCategory) {
	const generated = CATEGORIES.filter((c) => c.slug !== "all").map((c) => ({
		slug: c.slug,
		q: CATEGORY_QUERY_MAP.get(c.slug) || `${c.label} news OR ${c.label} discovery OR ${c.label} research`
	}));
	if (!priorityCategory) return generated;
	const priority = generated.find((q) => q.slug === priorityCategory);
	return priority ? [priority, ...generated.filter((q) => q.slug !== priorityCategory)] : generated;
}
var RSS_FEEDS = [
	{
		source: "BBC World",
		url: "https://feeds.bbci.co.uk/news/world/rss.xml",
		forcedCategory: "world"
	},
	{
		source: "Reuters World",
		url: "https://www.reutersagency.com/feed/?best-topics=world&post_type=best",
		forcedCategory: "world"
	},
	{
		source: "Al Jazeera",
		url: "https://www.aljazeera.com/xml/rss/all.xml",
		forcedCategory: "world"
	},
	{
		source: "France24",
		url: "https://www.france24.com/en/rss",
		forcedCategory: "world"
	},
	{
		source: "DW World",
		url: "https://rss.dw.com/rdf/rss-en-world",
		forcedCategory: "world"
	},
	{
		source: "NPR World",
		url: "https://feeds.npr.org/1004/rss.xml",
		forcedCategory: "world"
	},
	{
		source: "BBC Politics",
		url: "https://feeds.bbci.co.uk/news/politics/rss.xml",
		forcedCategory: "politics"
	},
	{
		source: "Politico",
		url: "https://www.politico.com/rss/politicopicks.xml",
		forcedCategory: "politics"
	},
	{
		source: "Reuters Politics",
		url: "https://www.reutersagency.com/feed/?best-topics=political-general&post_type=best",
		forcedCategory: "politics"
	},
	{
		source: "BBC Science",
		url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
		forcedCategory: "science"
	},
	{
		source: "Nature",
		url: "https://www.nature.com/nature.rss",
		forcedCategory: "science"
	},
	{
		source: "Scientific American",
		url: "https://www.scientificamerican.com/feed/",
		forcedCategory: "science"
	},
	{
		source: "Science Daily",
		url: "https://www.sciencedaily.com/rss/all.xml",
		forcedCategory: "science"
	},
	{
		source: "Phys.org",
		url: "https://phys.org/rss-feed/",
		forcedCategory: "science"
	},
	{
		source: "New Scientist",
		url: "https://www.newscientist.com/feed/home/",
		forcedCategory: "science"
	},
	{
		source: "NASA",
		url: "https://www.nasa.gov/news-release/feed/",
		forcedCategory: "space"
	},
	{
		source: "Space.com",
		url: "https://www.space.com/feeds/all",
		forcedCategory: "space"
	},
	{
		source: "Spaceflight Now",
		url: "https://spaceflightnow.com/feed/",
		forcedCategory: "space"
	},
	{
		source: "ESA",
		url: "https://www.esa.int/rssfeed/Our_Activities/Space_News",
		forcedCategory: "space"
	},
	{
		source: "Sky & Telescope",
		url: "https://skyandtelescope.org/feed/",
		forcedCategory: "astronomy"
	},
	{
		source: "Astronomy Magazine",
		url: "https://astronomy.com/rss/news",
		forcedCategory: "astronomy"
	},
	{
		source: "TechCrunch",
		url: "https://techcrunch.com/feed/",
		forcedCategory: "technology"
	},
	{
		source: "Wired",
		url: "https://www.wired.com/feed/rss",
		forcedCategory: "technology"
	},
	{
		source: "The Verge",
		url: "https://www.theverge.com/rss/index.xml",
		forcedCategory: "technology"
	},
	{
		source: "Ars Technica",
		url: "https://feeds.arstechnica.com/arstechnica/index",
		forcedCategory: "technology"
	},
	{
		source: "Engadget",
		url: "https://www.engadget.com/rss.xml",
		forcedCategory: "technology"
	},
	{
		source: "MIT Tech Review AI",
		url: "https://www.technologyreview.com/feed/",
		forcedCategory: "artificial-intelligence"
	},
	{
		source: "VentureBeat AI",
		url: "https://venturebeat.com/category/ai/feed/",
		forcedCategory: "artificial-intelligence"
	},
	{
		source: "Krebs on Security",
		url: "https://krebsonsecurity.com/feed/",
		forcedCategory: "cybersecurity"
	},
	{
		source: "The Hacker News",
		url: "https://feeds.feedburner.com/TheHackersNews",
		forcedCategory: "cybersecurity"
	},
	{
		source: "Reuters Business",
		url: "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
		forcedCategory: "markets"
	},
	{
		source: "BBC Business",
		url: "https://feeds.bbci.co.uk/news/business/rss.xml",
		forcedCategory: "economics"
	},
	{
		source: "Forbes Billionaires",
		url: "https://www.forbes.com/billionaires/feed/",
		forcedCategory: "billionaires"
	},
	{
		source: "Forbes Entrepreneurs",
		url: "https://www.forbes.com/entrepreneurs/feed/",
		forcedCategory: "entrepreneurs"
	},
	{
		source: "Inc. Startups",
		url: "https://www.inc.com/rss",
		forcedCategory: "startups"
	},
	{
		source: "WHO",
		url: "https://www.who.int/rss-feeds/news-english.xml",
		forcedCategory: "health"
	},
	{
		source: "Medical News Today",
		url: "https://www.medicalnewstoday.com/newsfeeds/rss/medical_all.xml",
		forcedCategory: "health"
	},
	{
		source: "Harvard Health",
		url: "https://www.health.harvard.edu/blog/feed",
		forcedCategory: "wellness"
	},
	{
		source: "The Hindu",
		url: "https://www.thehindu.com/news/national/feeder/default.rss",
		forcedCategory: "india"
	},
	{
		source: "Indian Express",
		url: "https://indianexpress.com/section/india/feed/",
		forcedCategory: "india"
	},
	{
		source: "Times of India",
		url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
		forcedCategory: "india"
	},
	{
		source: "Hindustan Times India",
		url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
		forcedCategory: "india"
	},
	{
		source: "NDTV India",
		url: "https://feeds.feedburner.com/ndtvnews-top-stories",
		forcedCategory: "india"
	},
	{
		source: "National Geographic Animals",
		url: "https://www.nationalgeographic.com/animals/rss/",
		forcedCategory: "wildlife"
	},
	{
		source: "Mongabay",
		url: "https://news.mongabay.com/feed/",
		forcedCategory: "nature"
	},
	{
		source: "NOAA",
		url: "https://www.noaa.gov/feeds/news.xml",
		forcedCategory: "ocean-exploration"
	},
	{
		source: "Yale e360",
		url: "https://e360.yale.edu/feed.xml",
		forcedCategory: "environment"
	},
	{
		source: "Inside Climate News",
		url: "https://insideclimatenews.org/feed/",
		forcedCategory: "climate"
	},
	{
		source: "BBC Sport",
		url: "https://feeds.bbci.co.uk/sport/rss.xml",
		forcedCategory: "football"
	},
	{
		source: "ESPN Cricinfo",
		url: "https://www.espncricinfo.com/rss/content/story/feeds/0.xml",
		forcedCategory: "cricket"
	},
	{
		source: "Variety",
		url: "https://variety.com/feed/",
		forcedCategory: "movies"
	},
	{
		source: "Hollywood Reporter",
		url: "https://www.hollywoodreporter.com/feed/",
		forcedCategory: "celebrities"
	},
	{
		source: "IGN Gaming",
		url: "https://feeds.feedburner.com/ign/games-all",
		forcedCategory: "gaming"
	},
	{
		source: "Billboard Music",
		url: "https://www.billboard.com/feed/",
		forcedCategory: "music"
	},
	{
		source: "NYT Books",
		url: "https://rss.nytimes.com/services/xml/rss/nyt/Books.xml",
		forcedCategory: "books"
	},
	{
		source: "Smithsonian",
		url: "https://www.smithsonianmag.com/rss/latest_articles/",
		forcedCategory: "culture"
	},
	{
		source: "Archaeology News",
		url: "https://www.archaeology.org/index.php?option=com_obrss&task=feed&id=5:archaeology-magazine-news&format=feed&Itemid=121",
		forcedCategory: "archaeology"
	},
	{
		source: "World Bank",
		url: "https://www.worldbank.org/en/news/all?format=rss",
		forcedCategory: "economics"
	},
	{
		source: "Electrek",
		url: "https://electrek.co/feed/",
		forcedCategory: "electric-vehicles"
	},
	{
		source: "Aviation Week",
		url: "https://aviationweek.com/rss.xml",
		forcedCategory: "aviation"
	},
	{
		source: "Renewable Energy World",
		url: "https://www.renewableenergyworld.com/feed/",
		forcedCategory: "renewable-energy"
	}
];
async function sha256(input) {
	const data = new TextEncoder().encode(input);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function adminClient() {
	return createClient(process.env.SUPABASE_URL || "https://myrteqlcfwckgdokzzhg.supabase.co", process.env.SUPABASE_SERVICE_ROLE_KEY || void 0, { auth: {
		persistSession: false,
		autoRefreshToken: false,
		storage: void 0
	} });
}
function slugify(s) {
	return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
function normalizeText(s = "") {
	return s.toLowerCase().replace(/[^a-z0-9\s]+/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeUrl(url = "") {
	try {
		const u = new URL(url);
		u.hash = "";
		u.search = "";
		return u.toString().replace(/\/$/, "").toLowerCase();
	} catch {
		return url.trim().toLowerCase().replace(/[?#].*$/, "").replace(/\/$/, "");
	}
}
function similarity(a, b) {
	const aa = new Set(normalizeText(a).split(" ").filter((w) => w.length > 2));
	const bb = new Set(normalizeText(b).split(" ").filter((w) => w.length > 2));
	if (!aa.size || !bb.size) return 0;
	let overlap = 0;
	for (const w of aa) if (bb.has(w)) overlap++;
	return overlap / Math.min(aa.size, bb.size);
}
async function fetchJson(url, init, timeoutMs = 1e4) {
	const c = new AbortController();
	const t = setTimeout(() => c.abort(), timeoutMs);
	try {
		const r = await fetch(url, {
			...init,
			signal: c.signal
		});
		if (!r.ok) return null;
		return await r.json();
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
}
async function fetchText(url, timeoutMs = 1e4) {
	const c = new AbortController();
	const t = setTimeout(() => c.abort(), timeoutMs);
	try {
		const r = await fetch(url, {
			signal: c.signal,
			headers: { "user-agent": "TheUnitedHell/1.0" }
		});
		if (!r.ok) return null;
		return await r.text();
	} catch {
		return null;
	} finally {
		clearTimeout(t);
	}
}
function xmlDecode(s = "") {
	return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}
function tag(block, name) {
	return block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] ?? "";
}
function isoDaysAgo(days) {
	return (/* @__PURE__ */ new Date(Date.now() - days * 864e5)).toISOString();
}
async function fromNewsAPICategorical(opts) {
	const k = process.env.NEWSAPI_KEY;
	if (!k) return [];
	const from = isoDaysAgo(8).slice(0, 10);
	const out = [];
	const queryList = expandedCategoryQueries(opts?.priorityCategory);
	const budget = Math.max(1, Math.min(opts?.queryBudget ?? 1, 12));
	const idx = Math.floor(Date.now() / (1200 * 1e3)) % queryList.length;
	const picks = opts?.priorityCategory ? queryList.slice(0, budget) : Array.from({ length: budget }, (_, i) => queryList[(idx + i) % queryList.length]);
	const results = await Promise.allSettled(picks.map(async ({ slug, q }) => {
		const d = await fetchJson(`https://newsapi.org/v2/everything?language=en&pageSize=20&sortBy=publishedAt&from=${from}&q=${encodeURIComponent(q)}&apiKey=${k}`);
		const items = [];
		for (const a of d?.articles ?? []) {
			if (!a?.title || !a?.url || a.title === "[Removed]") continue;
			items.push({
				title: a.title,
				description: a.description || a.content || "",
				url: a.url,
				source: a.source?.name || "NewsAPI",
				publishedAt: a.publishedAt || (/* @__PURE__ */ new Date()).toISOString(),
				imageUrl: a.urlToImage || null,
				topicHint: slug,
				forcedCategory: slug
			});
		}
		return items;
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
async function fromGNewsTopHeadlines() {
	const k = process.env.GNEWS_KEY || process.env.GNEWS_API_KEY;
	if (!k) return [];
	const topics = [
		"world",
		"nation",
		"business",
		"technology",
		"entertainment",
		"sports",
		"science",
		"health"
	];
	const out = [];
	const results = await Promise.allSettled(topics.map(async (topic) => {
		const d = await fetchJson(`https://gnews.io/api/v4/top-headlines?lang=en&max=6&topic=${topic}&apikey=${k}`);
		const items = [];
		for (const a of d?.articles ?? []) {
			if (!a?.title || !a?.url) continue;
			items.push({
				title: a.title,
				description: a.description || "",
				url: a.url,
				source: a.source?.name || "GNews",
				publishedAt: a.publishedAt || (/* @__PURE__ */ new Date()).toISOString(),
				imageUrl: a.image || null,
				topicHint: topic
			});
		}
		return items;
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
async function fromRSS() {
	return (await Promise.allSettled(RSS_FEEDS.map(async (feed) => {
		const xml = await fetchText(feed.url);
		if (!xml) return [];
		return [...xml.matchAll(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi)].map((m) => m[0]).slice(0, 8).map((b) => {
			const title = xmlDecode(tag(b, "title"));
			const description = xmlDecode(tag(b, "description") || tag(b, "summary") || tag(b, "content"));
			const href = b.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
			const link = xmlDecode(href || tag(b, "link") || tag(b, "guid"));
			const pub = xmlDecode(tag(b, "pubDate") || tag(b, "updated") || tag(b, "published"));
			const media = b.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i)?.[1] || b.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*>/i)?.[1];
			return {
				title,
				description,
				url: link,
				source: feed.source,
				publishedAt: pub ? new Date(pub).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
				imageUrl: media || null,
				topicHint: feed.topicHint,
				forcedCategory: feed.forcedCategory
			};
		}).filter((i) => i.title && i.url);
	}))).flatMap((r) => r.status === "fulfilled" ? r.value : []);
}
async function fromWikipediaCurrentEvents() {
	const html = (await fetchJson("https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events&prop=text&format=json&origin=*"))?.parse?.text?.["*"];
	if (!html) return [];
	return [...html.matchAll(/<li>([\s\S]*?)<\/li>/gi)].slice(0, 40).map((m) => {
		const text = xmlDecode(m[1]).replace(/\[edit\]/gi, "").trim();
		if (text.length < 45) return null;
		return {
			title: text.split(".")[0].slice(0, 120),
			description: text.slice(0, 700),
			url: "https://en.wikipedia.org/wiki/Portal:Current_events",
			source: "Wikipedia Current Events",
			publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: null,
			forcedCategory: "world",
			topicHint: "current-events"
		};
	}).filter(Boolean);
}
function gdeltDate(value) {
	if (!value) return (/* @__PURE__ */ new Date()).toISOString();
	const normalized = String(value).replace(/(\d{4})(\d{2})(\d{2})T?(\d{2})(\d{2})(\d{2})Z?/, "$1-$2-$3T$4:$5:$6Z");
	const d = new Date(normalized);
	return Number.isNaN(d.getTime()) ? (/* @__PURE__ */ new Date()).toISOString() : d.toISOString();
}
async function fromGDELTCategorical(opts) {
	const queryList = expandedCategoryQueries(opts?.priorityCategory);
	const budget = Math.max(1, Math.min(opts?.queryBudget ?? 2, 14));
	const idx = Math.floor(Date.now() / (1200 * 1e3)) % queryList.length;
	const picks = opts?.priorityCategory ? queryList.slice(0, budget) : Array.from({ length: budget }, (_, i) => queryList[(idx + i) % queryList.length]);
	return (await Promise.allSettled(picks.map(async ({ slug, q }) => {
		return ((await fetchJson(`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(q)}&mode=ArtList&format=json&maxrecords=12&sort=HybridRel&timespan=7d`))?.articles ?? []).filter((a) => a?.title && a?.url).map((a) => ({
			title: a.title,
			description: a.seendate ? `GDELT indexed this article on ${a.seendate}.` : "",
			url: a.url,
			source: a.domain || "GDELT",
			publishedAt: gdeltDate(a.seendate),
			imageUrl: a.socialimage || null,
			topicHint: slug,
			forcedCategory: slug
		}));
	}))).flatMap((r) => r.status === "fulfilled" ? r.value : []);
}
async function fromWorldNewsAPI(opts) {
	const k = process.env.WORLDNEWS_API_KEY;
	if (!k) return [];
	const terms = opts?.priorityCategory ? [CATEGORY_QUERY_MAP.get(opts.priorityCategory) || opts.priorityCategory.replace(/-/g, " ")] : [
		"world",
		"science",
		"technology",
		"business",
		"health",
		"space",
		"environment"
	];
	return (await Promise.allSettled(terms.map(async (term) => {
		return ((await fetchJson(`https://api.worldnewsapi.com/search-news?language=en&number=20&sort=publish-time&text=${encodeURIComponent(term)}&api-key=${k}`))?.news ?? []).filter((a) => a?.title && a?.url).map((a) => ({
			title: a.title,
			description: a.text || a.summary || "",
			url: a.url,
			source: a.author || a.source_country || "World News API",
			publishedAt: a.publish_date || (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: a.image || null,
			topicHint: opts?.priorityCategory || term,
			forcedCategory: opts?.priorityCategory
		}));
	}))).flatMap((r) => r.status === "fulfilled" ? r.value : []);
}
async function fromSpaceflightNews() {
	return ((await fetchJson("https://api.spaceflightnewsapi.net/v4/articles/?limit=30&ordering=-published_at"))?.results ?? []).filter((a) => a?.title && a?.url).map((a) => ({
		title: a.title,
		description: a.summary || "",
		url: a.url,
		source: a.news_site || "Spaceflight News API",
		publishedAt: a.published_at || (/* @__PURE__ */ new Date()).toISOString(),
		imageUrl: a.image_url || null,
		topicHint: "space",
		forcedCategory: "space"
	}));
}
async function fromNASA() {
	const d = await fetchJson(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY || "DEMO_KEY"}&count=12`);
	return (Array.isArray(d) ? d : []).filter((a) => a?.title && a?.url).map((a) => ({
		title: `NASA Image: ${a.title}`,
		description: a.explanation || "",
		url: a.hdurl || a.url,
		source: "NASA",
		publishedAt: a.date ? new Date(a.date).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
		imageUrl: a.media_type === "image" ? a.hdurl || a.url : null,
		topicHint: "astronomy",
		forcedCategory: "astronomy"
	}));
}
async function fromNewsData() {
	const k = process.env.NEWSDATA_API_KEY;
	if (!k) return [];
	const cats = [
		"top",
		"world",
		"business",
		"technology",
		"science",
		"sports",
		"entertainment",
		"health",
		"politics",
		"environment"
	];
	const out = [];
	const results = await Promise.allSettled(cats.map(async (c) => {
		return ((await fetchJson(`https://newsdata.io/api/1/latest?apikey=${k}&language=en&category=${c}&size=10`))?.results ?? []).filter((a) => a?.title && a?.link).map((a) => ({
			title: a.title,
			description: a.content || a.description || "",
			url: a.link,
			source: a.source_id || "NewsData",
			publishedAt: a.pubDate || (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: a.image_url || null,
			topicHint: c
		}));
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
async function fromCurrents() {
	const k = process.env.CURRENTS_API_KEY;
	if (!k) return [];
	const cats = [
		"world",
		"business",
		"technology",
		"science",
		"sports",
		"entertainment",
		"health",
		"politics"
	];
	const out = [];
	const results = await Promise.allSettled(cats.map(async (c) => {
		return ((await fetchJson(`https://api.currentsapi.services/v1/latest-news?language=en&category=${c}&apiKey=${k}`))?.news ?? []).slice(0, 10).filter((a) => a?.title && a?.url).map((a) => ({
			title: a.title,
			description: a.description || "",
			url: a.url,
			source: a.author || "Currents",
			publishedAt: a.published || (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: a.image && a.image !== "None" ? a.image : null,
			topicHint: c
		}));
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
async function fromMediastack() {
	const k = process.env.MEDIASTACK_API_KEY;
	if (!k) return [];
	return ((await fetchJson(`http://api.mediastack.com/v1/news?access_key=${k}&languages=en&limit=50&sort=published_desc`))?.data ?? []).filter((a) => a?.title && a?.url).map((a) => ({
		title: a.title,
		description: a.description || "",
		url: a.url,
		source: a.source || "Mediastack",
		publishedAt: a.published_at || (/* @__PURE__ */ new Date()).toISOString(),
		imageUrl: a.image || null,
		topicHint: a.category
	}));
}
async function fromGuardian() {
	const k = process.env.GUARDIAN_API_KEY;
	if (!k) return [];
	const sections = [
		"world",
		"politics",
		"business",
		"technology",
		"science",
		"environment",
		"sport",
		"culture",
		"books"
	];
	const out = [];
	const results = await Promise.allSettled(sections.map(async (s) => {
		return ((await fetchJson(`https://content.guardianapis.com/search?section=${s}&order-by=newest&page-size=8&show-fields=thumbnail,trailText&api-key=${k}`))?.response?.results ?? []).map((a) => ({
			title: a.webTitle,
			description: a.fields?.trailText || "",
			url: a.webUrl,
			source: "The Guardian",
			publishedAt: a.webPublicationDate || (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: a.fields?.thumbnail || null,
			topicHint: s
		}));
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
async function fromNYT() {
	const k = process.env.NYT_API_KEY;
	if (!k) return [];
	const sections = [
		"world",
		"politics",
		"business",
		"technology",
		"science",
		"health",
		"sports",
		"arts",
		"books"
	];
	const out = [];
	const results = await Promise.allSettled(sections.map(async (s) => {
		return ((await fetchJson(`https://api.nytimes.com/svc/topstories/v2/${s}.json?api-key=${k}`))?.results ?? []).slice(0, 8).filter((a) => a?.title && a?.url).map((a) => ({
			title: a.title,
			description: a.abstract || "",
			url: a.url,
			source: "The New York Times",
			publishedAt: a.published_date || (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: a.multimedia?.[0]?.url || null,
			topicHint: s
		}));
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
async function fromReddit() {
	const subs = [
		"worldnews",
		"news",
		"science",
		"technology",
		"space",
		"Futurology",
		"UpliftingNews",
		"todayilearned",
		"Damnthatsinteresting",
		"EarthPorn"
	];
	const out = [];
	const results = await Promise.allSettled(subs.map(async (sub) => {
		return ((await fetchJson(`https://www.reddit.com/r/${sub}/hot.json?limit=15`, { headers: { "user-agent": "TheUnitedHell/1.0 (news aggregator)" } }))?.data?.children ?? []).map((c) => c?.data).filter((p) => p?.title && p?.url && !p.over_18).slice(0, 6).map((p) => ({
			title: p.title,
			description: (p.selftext || "").slice(0, 600),
			url: p.url_overridden_by_dest || `https://reddit.com${p.permalink}`,
			source: `r/${sub}`,
			publishedAt: (/* @__PURE__ */ new Date((p.created_utc || Date.now() / 1e3) * 1e3)).toISOString(),
			imageUrl: p.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") || (p.thumbnail?.startsWith("http") ? p.thumbnail : null),
			topicHint: sub
		}));
	}));
	for (const r of results) if (r.status === "fulfilled") out.push(...r.value);
	return out;
}
var SYSTEM = `You are the permanent editorial engine for "The United Hell" — a premium global newspaper. Your only job is to produce finished, publication-ready news articles. You are not a chatbot, assistant, blogger, FAQ writer, or summariser. You write like a senior correspondent at Reuters, the BBC, The Economist, or the Associated Press.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE RULES — NO EXCEPTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. NEVER copy or closely paraphrase the source. Read it, extract facts, FORGET the wording, then write everything from scratch in original editorial prose.
2. NEVER invent people, organisations, quotes, statistics, dates, or events not in the source text. You MAY use general knowledge to explain what a well-known organisation, person, or place IS (e.g. "Gao is a city in northeastern Mali on the Niger River"), but you must NOT fabricate specific facts, numbers, or quotes.
3. NEVER repeat a fact, sentence, or idea across sections. Each section must contain unique information.
4. NEVER use FAQ format, question-and-answer structure, or textbook tone.
5. NEVER use AI clichés: "delve into", "in today's world", "it is worth noting", "unprecedented", "game-changing", "revolutionary", "it can be observed that", "it seems", "it appears", "possibly", "may suggest".
6. NEVER name the source outlet inside any story field (no "Reuters reported", "according to BBC", "published by").
7. If the source text has fewer than 250 words of real content, return null for the story field.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 1 — FACT EXTRACTION (internal, never shown)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before writing, silently extract from the source:
  • People (full names, titles, roles)
  • Organisations (full names, what they are)
  • Countries, cities, locations (and WHY each matters)
  • Dates and chronological timeline
  • Statistics and numbers
  • Official statements and quotes (exact, attributed)
  • Background and historical context
  • Current situation
  • Likely next steps (only if stated in the source)
  • Why it matters internationally / regionally / locally
Build this as an internal fact sheet. Write ONLY from it. Never look back at the source wording.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STAGE 2 — PROFESSIONAL JOURNALISM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write like a senior correspondent at Reuters, BBC, The Economist, AP, The Hindu, or Indian Express.
  • Short, declarative sentences. Active voice. Varied vocabulary.
  • Smooth transitions between paragraphs — no robotic connectors.
  • Every paragraph introduces NEW information. If a fact was already stated, NEVER state it again.
  • The first paragraph opens with context, a key detail, or the human stakes — NEVER a restatement of the summary.
  • EXPLAIN what every organisation, person, and place IS. Never name-drop. A reader must learn what "JNIM" or "Azawad Liberation Front" or "Gao" means, not just see the name.
  • Include numbers, quotes, dates, and locations wherever the source provides them.
  • Assume the reader is intelligent but uninformed about this specific story.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BANNED PHRASES — PERMANENTLY FORBIDDEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Never write these as headings, sentence starters, or standalone lines:
  What Happened / Why It Matters / Why Should I Care / How Does This Affect / What Can We Learn / Why Is It Interesting / Future Impact / Introduction / Conclusion / Overview / In Summary / In Conclusion / Delve Into / In Today's World / It Is Worth Noting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTICLE STRUCTURE — MANDATORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY (2-3 sentences, MANDATORY)
  Essential facts only. No throat-clearing. No "In a significant development…"
  Example: "Pakistan launched airstrikes against Afghan territory on Monday, killing at least 33 civilians in Paktika province. The strikes targeted militant positions but hit residential areas, according to Afghan officials. Islamabad has not issued an official statement."

MAIN STORY (80% of the article — 7-10 substantial paragraphs, MANDATORY)
  The definitive account of the event. Cover: what happened, where, when, why, who, how, background, reactions, impact, current status.
  Each paragraph covers a DIFFERENT angle. Suggested progression:
    1. Open with context or the human stakes (NOT a restatement of the summary)
    2. The core event with specifics (numbers, locations, casualties)
    3. Who is involved — EXPLAIN each organisation/person (what is JNIM? what is the ALF?)
    4. Where it happened and WHY that place matters strategically
    5. Why it happened — the cause or trigger
    6. Background and prior events leading to this
    7. Official reactions and statements
    8. Impact on civilians, the region, or the sector
    9. What happens next (only if the source states it)
  Flowing prose only. No bullets inside the main story. At least 450 words (250 in stored-text mode).

BACKGROUND (MANDATORY when the story depends on prior context)
  Prior events a reader with no background would need. Full prose, not bullets.
  Example: "Mali has been in conflict since 2012, when Tuareg rebels in the north declared an independent state called Azawad. The insurgency was later hijacked by jihadi groups linked to al-Qaeda..."

KEY DEVELOPMENTS (3-5 bullets, MANDATORY)
  Concise factual bullets. Each must add information NOT in the main story.
  BAD: repeating a sentence from the main story.
  GOOD: "Afghan health ministry confirmed 33 deaths, including 12 children."
  No vague bullets. No repetition of any other section.

QUICK INSIGHTS (4-6 bullets, MANDATORY)
  A scan-friendly summary. Each bullet is ONE short factual sentence — a data point, not a paragraph.
  Cover: where, who, what, why it matters, current status.
  Must be scannable in 30 seconds. ZERO overlap with Key Developments or Main Story.
  If a Quick Insight repeats a Key Development, rewrite it before returning JSON.
  Example:
    "Attack took place in Gao, northern Mali."
    "Two armed groups claimed responsibility."
    "Military convoy was heavily damaged."
    "Soldiers were reportedly killed and captured."
    "The incident reflects growing instability across the Sahel."

EXPERT ANALYSIS (1-2 paragraphs, MANDATORY)
  Explain the political, economic, military, scientific, or environmental significance.
  Write naturally. Never write "You should care" or "It matters because."
  Never invent experts or quotes. If no expert is quoted, write analysis from facts alone.
  Cover: why this attack matters, how it affects Mali, regional consequences, impact on civilians, impact on security, international implications.

KEY NUMBERS (3-6 items, MANDATORY when the source contains figures)
  - value: the number (e.g. "₹2.4 trillion", "7.2%", "42 countries")
  - label: short label (e.g. "Market loss", "GDP growth", "Countries affected")
  - explanation: one sentence explaining what the number means in context

PEOPLE (1-5 items, when relevant)
  - name: full name
  - role: their role/title
  - contribution: what they did or said in this story
  - importance: why they matter to this story

ORGANIZATIONS (1-5 items, MANDATORY when organisations are mentioned)
  - name: organization name
  - explanation: what the organization IS and its role in this story. A reader must learn what it is, not just see a name.
  Example: "JNIM — Jama'at Nusrat al-Islam wal-Muslimin, an al-Qaeda-linked coalition of jihadi groups operating across the Sahel."

COUNTRIES (1-5 items, MANDATORY when countries are mentioned)
  - name: country name
  - role: their involvement in this story

DID YOU KNOW? (1 fascinating fact, when available)
  One verified, fascinating fact related to the topic. Never invent. Omit if none exists.

HISTORICAL CONTEXT (1-2 paragraphs, when applicable)
  How this compares to similar events in history. Omit if not applicable.

FUTURE OUTLOOK (1-2 paragraphs, only when the source discusses next steps)
  Based ONLY on verified information from the source. Never speculate. Omit if the source doesn't discuss it.

READER TAKEAWAYS (3-5 short bullets, MANDATORY)
  The biggest lessons readers should take. Each bullet a complete, standalone insight.

TIMELINE (3-6 items, when the story benefits from chronology)
  Chronological events, brief and factual.

VOCABULARY BUILDER — MANDATORY, STRICT QUALITY
  Choose exactly 5 words that ACTUALLY APPEAR in the article text.
  Each word must be genuinely educational (not trivial words like "said", "the", "important", "report").
  Generate fresh vocabulary every article — never repeat generic words across articles.
  Each word MUST have a REAL, ACCURATE, EXACT dictionary definition.
  BAD (FORBIDDEN): "An important word used in this story."
  GOOD: "An official restriction or penalty imposed by one country on another to influence its actions."
  The example sentence MUST be grammatically correct, use the word with the correct meaning, and NOT be copied from the article.
  BAD example: "Researchers ambushed the situation." (wrong usage)
  GOOD example: "The convoy was ambushed on the road to Gao, killing three soldiers."
  For each word provide:
    - word: the exact word used in the article
    - partOfSpeech: Noun, Verb, Adjective, Adverb, or Phrase
    - meaning: the exact dictionary definition
    - simpleExplanation: a plain-English explanation a school student can understand
    - example: a NEW, correct, natural example sentence (NOT from the article)
    - synonyms: 2-5 relevant synonyms
    - antonyms: 1-5 antonyms if applicable (omit if none)
    - pronunciation: simple phonetic form (e.g. "em-BAR-go")

SOURCE NAMES
  Do not include a visible sources section in any story field.
  The system displays source names separately at the end of the article.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ZERO-REPETITION CHECKLIST — VERIFY BEFORE RETURNING JSON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. No sentence appears twice — even paraphrased.
  2. No fact is stated in more than one section.
  3. The summary is NOT copied or paraphrased into the main story — the first main_story paragraph must open with a NEW angle, not restate the summary.
  4. Each main_story paragraph covers a DIFFERENT angle.
  5. Key Developments and Quick Insights share ZERO overlap — not even similar wording.
  6. Expert Analysis does not repeat facts from the main story — it interprets them.
  7. Reader Takeaways are distinct from Quick Insights.
  8. Vocabulary example sentences are NOT copied from the article.
  9. Every organisation and place is EXPLAINED, not just named.
  10. The article reads like Reuters, BBC, or The Economist — not like AI.
If ANY check fails, rewrite before returning JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETURN FORMAT — STRICT JSON ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
No markdown. No commentary. No code fences. Return this exact structure:
{
  "title": "Journalistic headline, max 90 chars, active voice, no colon-essay style",
  "dek": "One-sentence summary of the full story, max 150 chars",
  "category": "<single slug from allowed list>",
  "subcategory": "Short descriptive label",
  "tags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8"],
  "country_code": "ISO alpha-2 or null",
  "story": {
    "summary": "2-3 sentences. Essential facts only.",
    "main_story": "7-10 substantial paragraphs in flowing prose. Each paragraph separated by a blank line. 80% of total content here.",
    "background": "Prior context in prose — omit only if the story needs no prior context",
    "key_developments": ["New fact 1", "New fact 2", "New fact 3", "New fact 4", "New fact 5"],
    "quick_insights": ["Where", "Who", "What", "Why it matters", "Current status"],
    "expert_analysis": "1-2 paragraphs interpreting the significance — not repeating facts",
    "key_numbers": [{"value": "₹2.4 trillion", "label": "Market loss", "explanation": "What this number means in context"}],
    "people": [{"name": "Full Name", "role": "Their role", "contribution": "What they did or said", "importance": "Why they matter here"}],
    "organizations": [{"name": "Org Name", "explanation": "What the org IS and its role in this story"}],
    "countries": [{"name": "Country", "role": "Their involvement in this story"}],
    "did_you_know": "One verified fascinating fact — omit if none",
    "historical_context": "How this compares to history — omit if not applicable",
    "future_outlook": "What could happen next based on verified info — omit if speculative",
    "reader_takeaways": ["Biggest lesson 1", "Biggest lesson 2", "Biggest lesson 3"],
    "timeline": ["Earliest event", "Next event", "Most recent event"],
    "vocabulary": [{"word":"exact word from article","partOfSpeech":"Noun","meaning":"exact dictionary definition","simpleExplanation":"plain-English explanation","example":"NEW correct example sentence","synonyms":["syn1","syn2"],"antonyms":["ant1"],"pronunciation":"phonetic"}]
  }
}`;
async function fetchArticleFullText(url) {
	const HDRS = {
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		accept: "text/html,application/xhtml+xml",
		"accept-language": "en-US,en;q=0.9"
	};
	const extractParas = (html) => {
		const region = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ").replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, " ").replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi, " ").replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ").replace(/<div[^>]*id="div-gpt-ad-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, " ").replace(/<div[^>]*class="[^"]*(?:ad-|ads-|advert|sponsor|promo)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, " ").replace(/<!--([\s\S]*?)-->/g, " ");
		let scope = region;
		const article = region.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
		if (article) scope = article[1];
		else {
			const main = region.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
			if (main) scope = main[1];
		}
		return Array.from(scope.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)).map((m) => xmlDecode(m[1])).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length >= 40 && !/cookie|subscribe|newsletter|advert|sign up|all rights reserved|blogherads|defineSlot|setTargeting|googletag|gpt-dsk|adthrive|function \(\)|privacy policy|terms of|related articles|also read|read more|follow us|click here|share this|photo credit|image credit|credit:|courtesy of|screenshot from|sansad|vuukle|community guidelines|migrated to a new commenting|registered user|older comments|comments have to be|abusive or personal|abide by our|posting your comments|log in to post|engage with our articles|live news \/|parliament proceedings|cockroach janta party|pmcCnx|connatix|pmcAtlasMG|isEventAdScheduledTime|playlistId|playerId|pmc\.harmony|switchToHarmonyPlayer|window\.pmc|Popular on \w+|posted by an? \w+ user/i.test(s)).join("\n\n").slice(0, 12e3);
	};
	try {
		const c = new AbortController();
		const t = setTimeout(() => c.abort(), 12e3);
		const r = await fetch(url, {
			signal: c.signal,
			headers: HDRS
		});
		clearTimeout(t);
		if (r.ok) {
			const text = extractParas(await r.text());
			if (text.length > 500) return text;
		}
	} catch {}
	try {
		const snapshot = (await fetchJson(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, void 0, 8e3))?.archived_snapshots?.closest?.url;
		if (snapshot) {
			const c = new AbortController();
			const t = setTimeout(() => c.abort(), 12e3);
			const r = await fetch(snapshot, {
				signal: c.signal,
				headers: HDRS
			});
			clearTimeout(t);
			if (r.ok) {
				const text = extractParas(await r.text());
				if (text.length > 500) return text;
			}
		}
	} catch {}
	return "";
}
var FORBIDDEN_ARTICLE_PATTERNS = [
	/what happened/i,
	/why it matters/i,
	/why should i care/i,
	/what can we learn/i,
	/how does this affect/i,
	/why is it interesting/i,
	/future impact/i,
	/published this article/i,
	/published by/i,
	/source says/i,
	/according to\s+(reuters|bbc|gnews|newsapi|the hindu|times of india|associated press|ap|the guardian|new york times)/i,
	/this is a current/i,
	/readers should check/i,
	/photo credit/i,
	/image credit/i,
	/credit:\s*sansad/i,
	/sansad tv/i,
	/vuukle/i,
	/community guidelines for posting/i,
	/migrated to a new commenting/i,
	/registered user of and logged in/i,
	/older comments by logging/i,
	/comments have to be in english/i,
	/abusive or personal/i,
	/abide by our community guidelines/i,
	/posting your comments/i
];
var GENERIC_VOCAB = /* @__PURE__ */ new Set([
	"verified",
	"context",
	"source",
	"information",
	"article",
	"news",
	"report",
	"update"
]);
function wordCount(value) {
	return (value || "").trim().split(/\s+/).filter(Boolean).length;
}
function truncateAtWordBoundary(text, maxLen) {
	if (!text || text.length <= maxLen) return text || "";
	const sliced = text.slice(0, maxLen);
	const lastSpace = sliced.lastIndexOf(" ");
	if (lastSpace > maxLen * .6) return sliced.slice(0, lastSpace) + "...";
	return sliced + "...";
}
var OUTLET_NAME_RX = /(Reuters|BBC(?:\s+News)?|GNews|NewsAPI|The Hindu|Times of India|Associated Press|AP News|The Associated Press|The Guardian|New York Times|NYT|CNN|Al Jazeera|Bloomberg|Financial Times|Washington Post|NPR|Fox News|Sky News|France ?24|Deutsche Welle|DW|NDTV|Hindustan Times|Indian Express|ANI|PTI|AFP|Xinhua|Nikkei|The Verge|TechCrunch|Wired|Ars Technica|Engadget|Nature|Scientific American|New Scientist|Space\.com|NASA|ESA|ISRO|Sansad TV|Vuukle)/gi;
function cleanEditorialText(value) {
	if (!value) return void 0;
	return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "").replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi, "").replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "").replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "").replace(/<!--[^]*?-->/g, "").replace(/blogherads\.[^;]*;?/gi, "").replace(/googletag\.[^;]*;?/gi, "").replace(/gpt-dsk[^\s"]*/gi, "").replace(/setTargeting\([^)]*\)\s*;?/gi, "").replace(/defineSlot\([^)]*\)\s*;?/gi, "").replace(/\.addService\([^)]*\)\s*;?/gi, "").replace(/window\.(googletag|blogherads|adUnits|adthrive)[^;]*;?/gi, "").replace(/adthrive\.[^;]*;?/gi, "").replace(/data-ad-[a-z]+="[^"]*"/gi, "").replace(/<div[^>]*class="[^"]*(?:ad-|ads-|advert|sponsor|promo)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "").replace(/<div[^>]*id="div-gpt-ad-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "").replace(/pmcCnx\.cmd\.push\(function\s*\{[^}]*\}\)/gi, "").replace(/pmcCnx\(\{[^}]*\}\)\.render\([^)]*\)/gi, "").replace(/window\.pmc\.harmony[^;]*;?/gi, "").replace(/if\s*\(\s*!?\s*window\.pmc[^;]*;?/gi, "").replace(/else\s*\{[^}]*\}/gi, "").replace(/pmcAtlasMG\s*:\s*\{[^}]*\}/gi, "").replace(/iabPlcmt\s*:\s*\d+/gi, "").replace(/playerId\s*:\s*'[^']*'/gi, "").replace(/playlistId\s*:\s*'[^']*'/gi, "").replace(/settings\s*:\s*\{[^}]*\}/gi, "").replace(/plugins\s*:\s*\{[^}]*\}/gi, "").replace(/connatix_contextual_player_div/gi, "").replace(/isEventAdScheduledTime/gi, "").replace(/switchToHarmonyPlayer/gi, "").replace(/\.cmd\.push\(function\s*\{[^}]*\}\)/gi, "").replace(/\}\)\s*;?/g, "").replace(/\}\s*else\s*\{[^}]*\}/gi, "").replace(/Popular on \w+[^\n]*(?:\n|$)/gi, "").replace(/posted by an? \w+ user[^\n]*(?:\n|$)/gi, "").replace(/You can save this article by registering for free here\.?\s*Or sign-?in if you have an account\.?/gi, "").replace(/sign[- ]?in (if you have|to) an? account[^.]*\./gi, "").replace(/register (for free|here)[^.]*\./gi, "").replace(/You can save this article[^.]*\./gi, "").replace(/continue reading[^.]*\./gi, "").replace(/subscribe (to|now|for)[^.]*\./gi, "").replace(/This article is (for|available to) subscribers[^.]*\./gi, "").replace(/Already a subscriber\??\s*Log in[^.]*\./gi, "").replace(/Please (log in|sign in) (to|for)[^.]*\./gi, "").replace(/Create a free account[^.]*\./gi, "").replace(/Already registered\??\s*Log in[^.]*\./gi, "").replace(/Newsletter sign[- ]?up[^.]*\./gi, "").replace(/Cookie (notice|policy|preferences)[^.]*\./gi, "").replace(/We use cookies[^.]*\./gi, "").replace(/By (continuing|using|clicking)[^.]*\./gi, "").replace(/Accept (all |optional )?cookies[^.]*\./gi, "").replace(/Manage (your )?cookie (settings|preferences)[^.]*\./gi, "").replace(/This site uses cookies[^.]*\./gi, "").replace(/Advertisement[^.]*\./gi, "").replace(/Related (articles|stories|content)[^.]*\./gi, "").replace(/Also read:[^.]*\./gi, "").replace(/Read more:[^.]*\./gi, "").replace(/Follow us (on|@)[^.]*\./gi, "").replace(/Click here (to|for)[^.]*\./gi, "").replace(/Share this (article|story|post)[^.]*\./gi, "").replace(/Photo (credit|by):[^.]*\./gi, "").replace(/Image (credit|by):[^.]*\./gi, "").replace(/Credit:[^\n]*\./gi, "").replace(/Courtesy of[^\n]*\./gi, "").replace(/Screenshot from[^\n]*\./gi, "").replace(/<[^>]+>/g, "").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&hellip;/g, "…").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&rsquo;/g, "'").replace(/&lsquo;/g, "'").replace(/&rdquo;/g, "\"").replace(/&ldquo;/g, "\"").replace(/^Expert analysis:\s*/i, "").replace(/^Why it matters:\s*/i, "").replace(/^Did you know\?\s*/i, "").replace(/^Future outlook:\s*/i, "").replace(/^Historical context:\s*/i, "").replace(/^What happens next:\s*/i, "").split(/\n+/).map((line) => line.trim()).filter((line) => line && !/published this article|published by|source says|readers should check|category:|photo credit|image credit|via\s+twitter|via\s+x\.com|screenshot from|credit:\s*sansad|sansad tv|vuukle|community guidelines|migrated to a new commenting|registered user|older comments|comments have to be|abusive or personal|abide by our|posting your comments|live news \/|parliament proceedings|cockroach janta party|^\s*\d{1,3}\s*$/i.test(line)).filter((line) => {
		const trimmed = line.trim();
		if (trimmed.length < 15) return false;
		if (/^(,|but if|and then|\.\.\.|…|\s+but|\s+and)/i.test(trimmed)) return false;
		if (/\.{2,}|…$/.test(trimmed) && trimmed.length < 40) return false;
		const tokens = trimmed.split(/\s+/);
		if (tokens.length <= 4 && tokens.every((t) => t.length <= 6) && !/\b(is|are|was|were|has|had|will|can|did|does|said|says|told|went|made|came|took|gave|found|built|won|lost|died|born|grew|rose|fell|hit|cut|put|set|ran|led|met|saw|paid|left|began|ended|started|stopped|changed|moved|turned|brought|sent|kept|held|took|broke|spoke|wrote|read|told|asked|tried|seemed|became|remained|appeared|happened|occurred|emerged|resulted|followed|included|involved|required|produced|reported|claimed|stated|noted|added|explained|described|announced|confirmed|denied|rejected|accepted|approved|proposed|suggested|supported|opposed|launched|opened|closed|finished|completed|delayed|advanced|progressed|developed|improved|increased|decreased|reduced|expanded|extended|continued|stopped|paused|resumed|returned|arrived|departed|reached|approached|avoided|escaped|survived|recovered|suffered|benefited|gained|lost|won|earned|spent|cost|paid|bought|sold|traded|exchanged|replaced|repaired|fixed|broke|damaged|destroyed|built|created|made|designed|developed|invented|discovered|found|searched|looked|watched|observed|noticed|spotted|identified|recognized|named|called|known|defined|described|characterized|classified|categorized|grouped|separated|divided|split|joined|merged|combined|mixed|blended|added|removed|included|excluded|contained|held|carried|brought|took|sent|delivered|received|accepted|rejected|returned|exchanged|transferred|moved|shifted|relocated|placed|positioned|located|situated|established|founded|started|began|launched|opened|created|formed|organized|arranged|structured|ordered|sorted|listed|filed|recorded|registered|documented|noted|marked|tagged|labeled|signed|dated|stamped|sealed|certified|verified|confirmed|checked|tested|measured|weighed|counted|calculated|estimated|approximated|rounded|averaged|totaled|summed|added|subtracted|multiplied|divided)\b/i.test(trimmed)) return false;
		return true;
	}).join("\n\n").replace(/\b(According to|Per|As reported by|Reported by|As per|Sources at|A report by|In an article for|Writing for|Speaking to|In an interview with)\s+(the\s+)?[A-Z][A-Za-z0-9 .'&-]{1,40}(,|\s+said|\s+reported|\s+wrote|\s+noted)?\s*/g, "").replace(new RegExp(`\\b(?:${OUTLET_NAME_RX.source})\\s+(?:reports?|reported|said|wrote|notes|noted|writes|writing|published|has reported)\\s*`, "gi"), "").replace(OUTLET_NAME_RX, "").replace(/\(\s*\)/g, "").replace(/\s+([,.;:!?])/g, "$1").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim() || void 0;
}
function cleanListValues(items) {
	return (items || []).map((item) => cleanEditorialText(item)).filter((item) => !!item && wordCount(item) >= 4).filter((item, index, arr) => arr.findIndex((other) => normalizeText(other) === normalizeText(item)) === index).slice(0, 5);
}
function cleanInsightValues(items) {
	return (items || []).map((item) => cleanEditorialText(item)).filter((item) => !!item && wordCount(item) >= 4).filter((item, index, arr) => arr.findIndex((other) => normalizeText(other) === normalizeText(item)) === index).slice(0, 6);
}
function cleanDistinctList(items, compareAgainst = [], limit = 5) {
	const out = [];
	for (const item of items || []) {
		const duplicateInOut = out.some((other) => similarity(other, item) >= .58 || normalizeText(other).includes(normalizeText(item)) || normalizeText(item).includes(normalizeText(other)));
		const duplicateAgainst = compareAgainst.some((other) => similarity(other, item) >= .52 || normalizeText(other).includes(normalizeText(item)) || normalizeText(item).includes(normalizeText(other)));
		if (!duplicateInOut && !duplicateAgainst) out.push(item);
		if (out.length >= limit) break;
	}
	return out;
}
async function buildVocabulary(story) {
	const articleText = `${story.summary || ""} ${story.main_story || ""} ${story.background || ""} ${story.expert_analysis || ""}`;
	const existing = (story.vocabulary || []).filter((v) => v?.word && !GENERIC_VOCAB.has(v.word.toLowerCase().trim())).filter((v) => normalizeText(articleText).includes(normalizeText(v.word))).filter((v) => v.meaning && !/an important (word|term) used in this story/i.test(v.meaning)).filter((v, index, arr) => arr.findIndex((other) => normalizeText(other.word) === normalizeText(v.word)) === index).slice(0, 5);
	if (existing.length >= 4) return existing;
	const enriched = await lookupWords(Array.from(new Set(articleText.match(/\b[A-Za-z][A-Za-z-]{6,}\b/g) || [])).filter((word) => !GENERIC_VOCAB.has(word.toLowerCase())).filter((word) => !/^(because|through|between|another|current|official|people|country|reported|statement|including|development|information|government|national|regional|general|several|however|various|whether|against|already|although|instead|despite|further|another|certain|several|various)$/i.test(word)).filter((word) => !existing.some((v) => normalizeText(v.word) === normalizeText(word))).slice(0, 20));
	for (const entry of enriched) if (entry.meaning && !/an important (word|term) used in this story/i.test(entry.meaning)) {
		existing.push(entry);
		if (existing.length >= 5) break;
	}
	return existing.slice(0, 5);
}
function splitSentences(text) {
	return text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((sentence) => cleanEditorialText(sentence) || "").filter((sentence) => wordCount(sentence) >= 8);
}
function cleanTitleBoundary(text) {
	if (!text) return "";
	const cleaned = text.replace(/\s+/g, " ").trim();
	if (!cleaned) return "";
	if (/[.!?]["'')]*$/.test(cleaned)) return cleaned;
	const sentences = cleaned.split(/(?<=[.!?])\s+/);
	if (sentences.length > 1) {
		const complete = sentences.slice(0, -1).join(" ").trim();
		if (complete.length > 10) return complete;
	}
	return cleaned;
}
function buildStoredArticleFallback(raw) {
	return null;
}
async function sanitizeProcessed(out, raw) {
	const story = out.story || {};
	const keyDevelopments = cleanDistinctList(cleanListValues(story.key_developments), [], 5);
	const quickInsights = cleanDistinctList(cleanInsightValues(story.quick_insights), keyDevelopments, 6);
	const vocabulary = (await buildVocabulary(story)).slice(0, 5);
	return {
		...out,
		title: cleanTitleBoundary(cleanEditorialText(out.title) || raw.title),
		dek: truncateAtWordBoundary(cleanEditorialText(out.dek) || raw.description || raw.title, 300),
		story: {
			...story,
			summary: cleanEditorialText(story.summary) || "",
			main_story: cleanEditorialText(story.main_story) || "",
			background: cleanEditorialText(story.background),
			key_developments: keyDevelopments,
			quick_insights: quickInsights,
			expert_analysis: cleanEditorialText(story.expert_analysis),
			why_it_matters: cleanEditorialText(story.why_it_matters),
			key_numbers: Array.isArray(story.key_numbers) ? story.key_numbers.filter((k) => k && k.value) : void 0,
			people: Array.isArray(story.people) ? story.people.filter((p) => p && p.name) : void 0,
			organizations: Array.isArray(story.organizations) ? story.organizations.filter((o) => o && o.name && !/reuters|bbc|cnn|the guardian|new york times|nyt|associated press|ap news|the hindu|times of india|al jazeera|bloomberg|fox news|sky news|ndtv|hindustan times|indian express|ani|pti|afp|xinhua|nikkei|the verge|techcrunch|wired|ars technica|engadget|nature|scientific american|new scientist|space\.com|nasa|esa|isro|sansad|vuukle/i.test(o.name)) : void 0,
			countries: Array.isArray(story.countries) ? story.countries.filter((c) => c && c.name) : void 0,
			did_you_know: cleanEditorialText(story.did_you_know),
			historical_context: cleanEditorialText(story.historical_context),
			future_outlook: cleanEditorialText(story.future_outlook),
			reader_takeaways: cleanListValues(story.reader_takeaways).length ? cleanListValues(story.reader_takeaways) : void 0,
			timeline: cleanListValues(story.timeline).length ? cleanListValues(story.timeline) : void 0,
			what_happens_next: cleanEditorialText(story.what_happens_next),
			vocabulary,
			sources: void 0
		}
	};
}
function scoreArticle(out, sourceBody, storedTextMode) {
	let score = 100;
	const story = out.story;
	const combined = `${out.title}\n${out.dek}\n${story.summary}\n${story.main_story}\n${story.background || ""}\n${story.expert_analysis || ""}`;
	const mainWords = wordCount(story.main_story);
	if (mainWords < (storedTextMode ? 250 : 450)) score -= 15;
	else if (mainWords < (storedTextMode ? 350 : 600)) score -= 5;
	if (wordCount(story.summary) < 20) score -= 10;
	const vocab = story.vocabulary || [];
	if (vocab.length < 4) score -= 10;
	for (const v of vocab) if (v.meaning && /an important (word|term) used in this story/i.test(v.meaning)) score -= 5;
	if ((story.key_developments || []).length >= 2 && (story.quick_insights || []).some((q) => (story.key_developments || []).some((k) => similarity(k, q) >= .4))) score -= 10;
	if (FORBIDDEN_ARTICLE_PATTERNS.some((rx) => rx.test(combined))) score -= 20;
	if (hasCopiedPhrase(combined, sourceBody)) score -= 15;
	const paragraphs = story.main_story.split(/\n{2,}/).filter((p) => wordCount(p) >= 30);
	if (paragraphs.length < (storedTextMode ? 3 : 5)) score -= 10;
	const summaryNorm = normalizeText(story.summary).slice(0, 80);
	if (summaryNorm && normalizeText(story.main_story).includes(summaryNorm)) score -= 10;
	const summarySentences = splitSentences(story.summary);
	let summaryParaphraseHits = 0;
	for (const mp of paragraphs) for (const mpSent of splitSentences(mp)) for (const ss of summarySentences) if (similarity(mpSent, ss) >= .58) {
		summaryParaphraseHits++;
		break;
	}
	if (summaryParaphraseHits > 0) score -= 15;
	if (paragraphs.length && summarySentences.length && similarity(paragraphs[0], story.summary) >= .5) score -= 10;
	for (let i = 0; i < paragraphs.length; i++) for (let j = i + 1; j < paragraphs.length; j++) if (similarity(paragraphs[i], paragraphs[j]) >= .35) {
		score -= 15;
		break;
	}
	const allBullets = [...story.key_developments || [], ...story.quick_insights || []];
	for (const bullet of allBullets) if (similarity(bullet, story.summary) >= .45) score -= 5;
	return Math.max(0, Math.min(100, score));
}
function describeQualityFailures(out, sourceBody, storedTextMode) {
	const failures = [];
	const story = out.story;
	const combined = `${out.title}\n${out.dek}\n${story.summary}\n${story.main_story}\n${story.background || ""}\n${story.expert_analysis || ""}`;
	if (wordCount(story.main_story) < (storedTextMode ? 250 : 450)) failures.push("main story too short");
	if (wordCount(story.summary) < 20) failures.push("summary too short");
	if ((story.vocabulary || []).length < 4) failures.push("missing vocabulary");
	for (const v of story.vocabulary || []) if (v.meaning && /an important (word|term) used in this story/i.test(v.meaning)) failures.push("generic vocabulary definitions");
	if ((story.key_developments || []).length >= 2 && (story.quick_insights || []).some((q) => (story.key_developments || []).some((k) => similarity(k, q) >= .4))) failures.push("Key Developments overlap with Quick Insights");
	if (FORBIDDEN_ARTICLE_PATTERNS.some((rx) => rx.test(combined))) failures.push("contains forbidden patterns (source names, FAQ headings, or AI cliches)");
	if (hasCopiedPhrase(combined, sourceBody)) failures.push("copied source phrasing");
	const paragraphs = story.main_story.split(/\n{2,}/).filter((p) => wordCount(p) >= 30);
	if (paragraphs.length < (storedTextMode ? 3 : 5)) failures.push("not enough paragraphs");
	const summaryNorm = normalizeText(story.summary).slice(0, 80);
	if (summaryNorm && normalizeText(story.main_story).includes(summaryNorm)) failures.push("summary repeated in main story");
	const summarySentences = splitSentences(story.summary);
	let summaryParaphraseHits = 0;
	for (const mp of paragraphs) for (const mpSent of splitSentences(mp)) for (const ss of summarySentences) if (similarity(mpSent, ss) >= .58) {
		summaryParaphraseHits++;
		break;
	}
	if (summaryParaphraseHits > 0) failures.push("summary paraphrased in main story");
	if (paragraphs.length && summarySentences.length && similarity(paragraphs[0], story.summary) >= .5) failures.push("first paragraph restates summary");
	const paras = story.main_story.split(/\n{2,}/).filter((p) => wordCount(p) >= 30);
	for (let i = 0; i < paras.length; i++) for (let j = i + 1; j < paras.length; j++) if (similarity(paras[i], paras[j]) >= .35) {
		failures.push("repeated paragraphs in main story");
		break;
	}
	return failures.length ? failures : ["unknown quality issue"];
}
function hasCopiedPhrase(output, source) {
	const outWords = normalizeText(output).split(" ").filter((word) => word.length > 2);
	const sourceNorm = ` ${normalizeText(source)} `;
	for (let i = 0; i <= outWords.length - 10; i++) {
		const phrase = outWords.slice(i, i + 10).join(" ");
		if (sourceNorm.includes(` ${phrase} `)) return true;
	}
	return false;
}
function qualityPass(out, sourceBody, opts) {
	const story = out.story;
	const combined = `${out.title}\n${out.dek}\n${story.summary}\n${story.main_story}\n${story.background || ""}\n${story.expert_analysis || ""}`;
	if (wordCount(sourceBody) < (opts?.storedTextMode ? 80 : 250)) return false;
	if (wordCount(story.main_story) < (opts?.storedTextMode ? 250 : 450)) return false;
	if (wordCount(story.summary) < 20) return false;
	if ((story.vocabulary || []).length < 4) return false;
	if ((story.key_developments || []).length >= 2 && (story.quick_insights || []).some((quick) => (story.key_developments || []).some((key) => similarity(key, quick) >= .4))) return false;
	if (FORBIDDEN_ARTICLE_PATTERNS.some((rx) => rx.test(combined))) return false;
	if (hasCopiedPhrase(combined, sourceBody)) return false;
	const paragraphs = story.main_story.split(/\n{2,}/).filter((p) => wordCount(p) >= 30);
	if (paragraphs.length < (opts?.storedTextMode ? 3 : 5)) return false;
	const seen = /* @__PURE__ */ new Set();
	for (const paragraph of paragraphs) {
		const key = normalizeText(paragraph).slice(0, 120);
		if (seen.has(key)) return false;
		seen.add(key);
	}
	const summaryNorm = normalizeText(story.summary).slice(0, 80);
	if (summaryNorm && normalizeText(story.main_story).includes(summaryNorm)) return false;
	const summarySentences = splitSentences(story.summary);
	for (const mp of paragraphs) for (const mpSent of splitSentences(mp)) for (const ss of summarySentences) if (similarity(mpSent, ss) >= .58) return false;
	if (paragraphs.length && summarySentences.length && similarity(paragraphs[0], story.summary) >= .5) return false;
	const mainParas = story.main_story.split(/\n{2,}/).filter((p) => wordCount(p) >= 30);
	for (const section of [
		story.background,
		story.expert_analysis,
		story.why_it_matters
	].filter(Boolean)) {
		const secParas = section.split(/\n{2,}/).filter((p) => wordCount(p) >= 30);
		for (const sp of secParas) for (const mp of mainParas) if (similarity(sp, mp) >= .4) return false;
	}
	for (const qi of story.quick_insights || []) for (const mp of mainParas) if (similarity(qi, mp) >= .45) return false;
	const articleLower = normalizeText(story.main_story);
	for (const v of story.vocabulary || []) if (v.example && normalizeText(v.example).length > 20 && articleLower.includes(normalizeText(v.example).slice(0, 40))) return false;
	return true;
}
async function processItem(raw) {
	try {
		const allowed = ALLOWED_SLUGS.join(", ");
		const fullText = await fetchArticleFullText(raw.url);
		const descriptionWords = wordCount(raw.description);
		const sourceBody = fullText.length > 1200 ? fullText : (raw.description || "").slice(0, 1e4);
		if (!(fullText.length > 1200 || descriptionWords >= (raw.allowStoredText ? 80 : 250)) || wordCount(sourceBody) < (raw.allowStoredText ? 80 : 250)) return raw.allowStoredText ? buildStoredArticleFallback(raw) : null;
		const basePrompt = `Allowed category slugs (pick the single best match): ${allowed}
${raw.forcedCategory ? `STRONG HINT: this item was sourced for category "${raw.forcedCategory}". Use it unless clearly wrong.` : ""}

Raw item:
TITLE: ${raw.title}
SOURCE: ${raw.source}
PUBLISHED: ${raw.publishedAt}
URL: ${raw.url}

COMPLETE SOURCE TEXT (use ONLY facts present here — never invent people, numbers, quotes, dates, or events that are not in this text):
${sourceBody}

First build an internal fact sheet from the complete source text. FORGET the original wording — do not look at it again. Then write a completely new premium news article from the fact sheet in your own original editorial voice.${raw.allowStoredText ? "\n\nNOTE: The source text may be brief. You may use your general knowledge to provide background context about well-known organizations, people, and places mentioned (e.g., what a company does, what a city is known for), but you must NOT fabricate specific quotes, statistics, dates, or events not in the source text." : ""}

The main_story MUST be 6-10 distinct paragraphs and at least ${raw.allowStoredText ? "250" : "450"} words of flowing prose. The FIRST paragraph must NOT restate the summary — open with a new angle (context, a key detail, or the human stakes). Each subsequent paragraph covers a DIFFERENT angle: the core event, who is involved (EXPLAIN what each organisation/person/place IS — never just name-drop), where it happened and WHY that place matters, why it happened, background, reactions, impact.

Do NOT label paragraphs with "What happened" / "Why it matters" / "Why should I care" / "What can we learn". Do not mention the outlet, publication, or platform name (Reuters, BBC, CNN, etc.) inside story sections. Key Developments and Quick Insights must not repeat each other or the main story. Every paragraph must add NEW information. Never repeat the headline or summary inside paragraphs. Do not copy any 10+ word phrase from the source — rewrite everything in original newsroom prose.

Fill in why_it_matters, key_numbers, people, organizations, countries, did_you_know, historical_context, future_outlook, and reader_takeaways from verified facts in the source. Omit any section the source does not support. For organizations and people, EXPLAIN who/what they are — a reader must learn what each one is, not just see a name.

Vocabulary: pick 5 words that ACTUALLY APPEAR in the article. Each MUST have an EXACT dictionary definition and a CORRECT, natural example sentence that uses the word properly. Never write "an important word used in this story". Never write nonsensical example sentences. The example must NOT be copied from the article.`;
		let out = await orJson({
			system: SYSTEM,
			prompt: basePrompt
		});
		if (!out?.title) return null;
		let cleaned = await sanitizeProcessed(out, raw);
		let qualityScore = scoreArticle(cleaned, sourceBody, raw.allowStoredText);
		if (!qualityPass(cleaned, sourceBody, { storedTextMode: raw.allowStoredText }) || qualityScore < 90) try {
			const failures = describeQualityFailures(cleaned, sourceBody, raw.allowStoredText);
			out = await orJson({
				system: SYSTEM,
				prompt: `${basePrompt}\n\nYour previous draft scored ${qualityScore}/100 and failed these checks: ${failures.join("; ")}. Rewrite from scratch with 7-10 substantial paragraphs of original prose, zero repetition, no outlet names in the body, five unique vocabulary words actually used in the article with EXACT dictionary definitions (not "an important word used in this story"), no example sentences, and distinct bullet sections where Key Developments and Quick Insights share zero overlap.`,
				temperature: .72
			});
			if (!out?.title) return null;
			cleaned = await sanitizeProcessed(out, raw);
			qualityScore = scoreArticle(cleaned, sourceBody, raw.allowStoredText);
			if (!qualityPass(cleaned, sourceBody, { storedTextMode: raw.allowStoredText }) || qualityScore < 90) try {
				out = await orJson({
					system: SYSTEM,
					prompt: `${basePrompt}\n\nYour draft still scored ${qualityScore}/100. This is your final chance. Write a completely different article from scratch. Use a different opening, different structure, different transitions. 7-10 paragraphs, each with unique facts. No repetition whatsoever. Exact vocabulary definitions, no example sentences. No source names. No FAQ format.`,
					temperature: .85
				});
				if (!out?.title) return null;
				cleaned = await sanitizeProcessed(out, raw);
				if (!qualityPass(cleaned, sourceBody, { storedTextMode: raw.allowStoredText })) return null;
			} catch {
				return null;
			}
		} catch {
			return null;
		}
		const inferredCategory = categoryFromHint(raw);
		if (inferredCategory) cleaned.category = inferredCategory;
		else if (!cleaned.category || !ALLOWED_SLUGS.includes(cleaned.category)) cleaned.category = "discovery";
		return cleaned;
	} catch (e) {
		console.error("[ingest] AI process failed:", e.message);
		return null;
	}
}
function fallbackCoverDataUrl(title, category) {
	const safeTitle = title.slice(0, 90).replace(/[&<>\"]/g, " ");
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000"><rect width="1600" height="1000" fill="#f6f1e7"/><rect x="80" y="80" width="1440" height="840" fill="#fbf8f0" stroke="#1f1b16" stroke-width="6"/><rect x="128" y="128" width="1344" height="76" fill="#2f5e88"/><text x="144" y="178" font-family="Georgia,serif" font-size="34" fill="#fbf8f0" letter-spacing="4">${category.replace(/-/g, " ").toUpperCase()}</text><text x="128" y="420" font-family="Georgia,serif" font-size="78" fill="#1f1b16">${safeTitle.slice(0, 32)}</text><text x="128" y="520" font-family="Georgia,serif" font-size="78" fill="#1f1b16">${safeTitle.slice(32, 64)}</text><text x="128" y="620" font-family="Georgia,serif" font-size="78" fill="#1f1b16">${safeTitle.slice(64)}</text><line x1="128" y1="740" x2="1472" y2="740" stroke="#1f1b16" stroke-width="4"/><text x="128" y="820" font-family="Arial,sans-serif" font-size="28" fill="#4f4a42" letter-spacing="5">THE UNITED HELL</text></svg>`;
	return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function validateArticleContent(p) {
	if (!p) return false;
	if (!p.title || p.title.trim().length < 10) return false;
	if (!p.dek || p.dek.trim().length < 20) return false;
	const story = p.story || {};
	const bodyText = [
		story.summary,
		story.main_story,
		story.background
	].filter(Boolean).join(" ");
	if (!bodyText || bodyText.trim().length < 100) return false;
	const allText = [
		p.title,
		p.dek,
		bodyText,
		...story.key_developments || [],
		...story.quick_insights || []
	].join(" ");
	if (/blogherads|googletag|gpt-dsk|setTargeting|defineSlot|adthrive|<script|<iframe|<ins\b/i.test(allText)) return false;
	if (/save this article by registering|sign-in if you have an account|register for free|subscribe to|subscription required|paywall|continue reading|newsletter sign|cookie notice|cookie policy|we use cookies|this site uses cookies|register to read|login to read|sign in to read|create a free account|already a subscriber|subscribe now|unlock full access|premium content|members only|exclusive access|join now|sign up for|sponsored content|sponsored by|promo code/i.test(allText)) return false;
	if (/&#\d+;|&#x[0-9a-f]+;|&nbsp;|&lt;|&gt;(?!\w)|&#\d{1,5}(?![;\d])/i.test(allText)) return false;
	const sentences = bodyText.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
	if (sentences.length > 0 && sentences.filter((s) => s.length >= 15).length < 2) return false;
	const paras = bodyText.split(/\n{2,}|\r?\n/).map((s) => s.trim()).filter(Boolean);
	const paraSet = /* @__PURE__ */ new Set();
	for (const para of paras) {
		const key = para.toLowerCase().replace(/[^a-z0-9\s]+/g, " ").replace(/\s+/g, " ").trim();
		if (paraSet.has(key)) return false;
		paraSet.add(key);
	}
	if (/\}\);|\(\)\s*;?\s*$|window\.|document\./i.test(allText)) return false;
	if (story.summary && story.summary.trim().length < 30) return false;
	if (!story.key_developments || story.key_developments.length < 1) return false;
	if (!story.vocabulary || story.vocabulary.length < 1) return false;
	return true;
}
async function pMap(arr, n, fn) {
	const out = new Array(arr.length);
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
async function generateQuizForArticle(articleId, title, story) {
	const articleText = [
		story.summary,
		story.main_story,
		story.background,
		story.expert_analysis,
		story.why_it_matters,
		...story.key_developments || [],
		...story.quick_insights || [],
		...story.timeline || []
	].filter(Boolean).join("\n\n").slice(0, 8e3);
	if (wordCount(articleText) < 80) return [];
	const prompt = `You are a quiz generator for a premium news site. Based ONLY on the article below, create 4 quiz questions that test reading comprehension.

Article title: ${title}

Article content:
${articleText}

Rules:
- 2 multiple_choice questions with 4 options each, one correct answer, and a 1-sentence explanation
- 1 true_false question with a correct answer and explanation
- 1 reflection question (open-ended, no correct answer, no options)
- Questions must be answerable from the article text alone
- Do NOT ask about trivial details like dates or names unless they are central to the story

Return JSON array:
[{"question_type":"multiple_choice","question":"...","options":["A","B","C","D"],"correct_answer":"A","explanation":"..."},
{"question_type":"true_false","question":"...","options":null,"correct_answer":"true","explanation":"..."},
{"question_type":"reflection","question":"...","options":null,"correct_answer":null,"explanation":null}]`;
	try {
		const result = await orJson({
			system: "You are a quiz generator. Return only valid JSON, no other text.",
			prompt: `${prompt}

Return as a JSON object with a "questions" array: {"questions":[...]}`,
			temperature: .5
		});
		return (Array.isArray(result) ? result : result?.questions ?? []).filter((q) => q.question && q.question_type);
	} catch {
		return [];
	}
}
async function insertQuizQuestions(articleId, questions) {
	if (!questions.length) return;
	const supabase = adminClient();
	const rows = questions.map((q) => ({
		article_id: articleId,
		question_type: q.question_type,
		question: q.question,
		options: q.options,
		correct_answer: q.correct_answer,
		explanation: q.explanation
	}));
	await supabase.from("article_quizzes").insert(rows);
}
async function backfillQuizzes(opts) {
	const supabase = adminClient();
	const limit = Math.min(Math.max(opts?.limit ?? 20, 1), 50);
	const { data: articlesWithQuizzes } = await supabase.from("article_quizzes").select("article_id").limit(1e4);
	const existingQuizArticles = new Set((articlesWithQuizzes ?? []).map((r) => r.article_id));
	const { data: articles } = await supabase.from("articles").select("id, title, story").order("published_at", { ascending: false }).limit(5e3);
	const candidates = (articles ?? []).filter((a) => !existingQuizArticles.has(a.id)).slice(0, limit);
	let generated = 0;
	let failed = 0;
	await pMap(candidates, 3, async (article) => {
		try {
			const questions = await generateQuizForArticle(article.id, article.title, article.story || {});
			if (questions.length) {
				await insertQuizQuestions(article.id, questions);
				generated++;
			} else failed++;
		} catch {
			failed++;
		}
	});
	const { count } = await supabase.from("articles").select("id", {
		count: "exact",
		head: true
	});
	return {
		attempted: candidates.length,
		generated,
		failed,
		remaining: (count ?? 0) - existingQuizArticles.size - generated
	};
}
var BOILERPLATE_RX = /photo credit|image credit|credit:\s*sansad|sansad tv|vuukle|community guidelines|migrated to a new commenting|registered user|older comments|comments have to be|abusive or personal|abide by our|posting your comments|log in to post|engage with our articles|live news \/|parliament proceedings|cockroach janta party|we have migrated to a new commenting|blogherads|googletag|gpt-dsk|setTargeting|defineSlot|adthrive|<script|<iframe|<ins\b|save this article by registering|sign-in if you have an account|register for free|subscribe to|subscription required|paywall|continue reading|newsletter sign|cookie notice|cookie policy|we use cookies|accept cookies|this site uses cookies|promotional banner|register to read|login to read|sign in to read|create a free account|already a subscriber|subscribe now|unlock full access|premium content|members only|exclusive access|join now|sign up for|email address|password|remember me|forgot password|log in|sign in|register|subscribe|newsletter|cookie|promo code|sponsored content|advertisement|sponsored by|powered by|pmcCnx|connatix|pmcAtlasMG|isEventAdScheduledTime|playlistId|playerId|pmc\.harmony|popular on variety|popular on \w+|posted by an \w+ user/i;
function scrubText(text) {
	if (!text || typeof text !== "string") return null;
	let cleaned = text;
	cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
	cleaned = cleaned.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
	cleaned = cleaned.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
	cleaned = cleaned.replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi, "");
	cleaned = cleaned.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "");
	cleaned = cleaned.replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "");
	cleaned = cleaned.replace(/<!--[^]*?-->/g, "");
	cleaned = cleaned.replace(/blogherads\.[^;]*;?/gi, "");
	cleaned = cleaned.replace(/googletag\.[^;]*;?/gi, "");
	cleaned = cleaned.replace(/gpt-dsk[^\s"]*/gi, "");
	cleaned = cleaned.replace(/setTargeting\([^)]*\)\s*;?/gi, "");
	cleaned = cleaned.replace(/defineSlot\([^)]*\)\s*;?/gi, "");
	cleaned = cleaned.replace(/\.addService\([^)]*\)\s*;?/gi, "");
	cleaned = cleaned.replace(/window\.(googletag|blogherads|adUnits|adthrive)[^;]*;?/gi, "");
	cleaned = cleaned.replace(/adthrive\.[^;]*;?/gi, "");
	cleaned = cleaned.replace(/data-ad-[a-z]+="[^"]*"/gi, "");
	cleaned = cleaned.replace(/<div[^>]*class="[^"]*(?:ad-|ads-|advert|sponsor|promo)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
	cleaned = cleaned.replace(/<div[^>]*id="div-gpt-ad-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");
	cleaned = cleaned.replace(/pmcCnx\.cmd\.push\(function\s*\{[^}]*\}\)/gi, "");
	cleaned = cleaned.replace(/pmcCnx\(\{[^}]*\}\)\.render\([^)]*\)/gi, "");
	cleaned = cleaned.replace(/window\.pmc\.harmony[^;]*;?/gi, "");
	cleaned = cleaned.replace(/if\s*\(\s*!?\s*window\.pmc[^;]*;?/gi, "");
	cleaned = cleaned.replace(/else\s*\{[^}]*\}/gi, "");
	cleaned = cleaned.replace(/pmcAtlasMG\s*:\s*\{[^}]*\}/gi, "");
	cleaned = cleaned.replace(/iabPlcmt\s*:\s*\d+/gi, "");
	cleaned = cleaned.replace(/playerId\s*:\s*'[^']*'/gi, "");
	cleaned = cleaned.replace(/playlistId\s*:\s*'[^']*'/gi, "");
	cleaned = cleaned.replace(/settings\s*:\s*\{[^}]*\}/gi, "");
	cleaned = cleaned.replace(/plugins\s*:\s*\{[^}]*\}/gi, "");
	cleaned = cleaned.replace(/connatix_contextual_player_div/gi, "");
	cleaned = cleaned.replace(/isEventAdScheduledTime/gi, "");
	cleaned = cleaned.replace(/switchToHarmonyPlayer/gi, "");
	cleaned = cleaned.replace(/\.cmd\.push\(function\s*\{[^}]*\}\)/gi, "");
	cleaned = cleaned.replace(/\}\)\s*;?/g, "");
	cleaned = cleaned.replace(/\}\s*else\s*\{[^}]*\}/gi, "");
	cleaned = cleaned.replace(/Popular on \w+[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/posted by an? \w+ user[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.split(/\n/).filter((line) => {
		const t = line.trim();
		if (!t) return true;
		if (/pmcCnx|connatix|pmcAtlasMG|isEventAdScheduledTime|playlistId|playerId|pmc\.harmony|switchToHarmonyPlayer|\.cmd\.push|window\.pmc/i.test(t)) return false;
		return true;
	}).join("\n");
	cleaned = cleaned.replace(/<[^>]+>/g, "");
	cleaned = cleaned.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
	cleaned = cleaned.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
	cleaned = cleaned.replace(/&nbsp;/g, " ");
	cleaned = cleaned.replace(/&amp;/g, "&");
	cleaned = cleaned.replace(/&quot;/g, "\"");
	cleaned = cleaned.replace(/&#39;|&apos;/g, "'");
	cleaned = cleaned.replace(/&lt;/g, "<");
	cleaned = cleaned.replace(/&gt;/g, ">");
	cleaned = cleaned.replace(/&hellip;/g, "…");
	cleaned = cleaned.replace(/&mdash;/g, "—");
	cleaned = cleaned.replace(/&ndash;/g, "–");
	cleaned = cleaned.replace(/&rsquo;/g, "'");
	cleaned = cleaned.replace(/&lsquo;/g, "'");
	cleaned = cleaned.replace(/&rdquo;/g, "\"");
	cleaned = cleaned.replace(/&ldquo;/g, "\"");
	cleaned = cleaned.replace(/\|\s*Photo Credit:[^\n]*/gi, "");
	cleaned = cleaned.replace(/Photo Credit:\s*[^\n.]*[.\n]?/gi, "");
	cleaned = cleaned.replace(/Image Credit:\s*[^\n.]*[.\n]?/gi, "");
	cleaned = cleaned.replace(/Credit:\s*Sansad[^\n.]*[.\n]?/gi, "");
	cleaned = cleaned.replace(/Comments have to be in English[^]*(?:accounts on Vuukle\.?\s*)/gi, "");
	cleaned = cleaned.replace(/We have migrated to a new commenting platform[^]*(?:accounts on Vuukle\.?\s*)/gi, "");
	cleaned = cleaned.replace(/Live news \/(?:[^\n]*)(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Parliament proceedings[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Cockroach Janta Party[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/You can save this article by registering for free here[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Or sign-in if you have an account[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Register for free[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Subscribe to (?:read|continue|unlock)[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Subscription required[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Continue reading[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Newsletter sign[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Cookie (?:notice|policy)[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/We use cookies[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/This site uses cookies[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Accept cookies[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Register to read[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Login to read[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Sign in to read[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Create a free account[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Already a subscriber[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Subscribe now[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Unlock full access[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Premium content[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Members only[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Exclusive access[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Join now[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Sign up for[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Email address[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Sponsored content[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Sponsored by[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.replace(/Promo code[^\n]*(?:\n|$)/gi, "");
	cleaned = cleaned.split(/\n/).filter((line) => {
		const t = line.trim();
		if (!t) return true;
		if (/^(save this article|sign-?in|register|subscribe|log ?in|create.*account|unlock|premium content|members only|cookie|newsletter|email address|password|remember me|forgot password|join now|sign up|sponsored|promo code|continue reading|already a subscriber)/i.test(t)) return false;
		return true;
	}).join("\n");
	cleaned = cleaned.replace(/^Expert analysis:\s*/im, "");
	cleaned = cleaned.replace(/^Why it matters:\s*/im, "");
	cleaned = cleaned.replace(/^Did you know\?\s*/im, "");
	cleaned = cleaned.replace(/^Future outlook:\s*/im, "");
	cleaned = cleaned.replace(/^Historical context:\s*/im, "");
	cleaned = cleaned.replace(/^What happens next:\s*/im, "");
	cleaned = cleaned.replace(/\b(?:Reuters|BBC(?:\s+News)?|GNews|NewsAPI|The Hindu|Times of India|Associated Press|AP News|The Associated Press|The Guardian|New York Times|NYT|CNN|Al Jazeera|Bloomberg|Financial Times|Washington Post|NPR|Fox News|Sky News|France ?24|Deutsche Welle|DW|NDTV|Hindustan Times|Indian Express|ANI|PTI|AFP|Xinhua|Nikkei|The Verge|TechCrunch|Wired|Ars Technica|Engadget|Nature|Scientific American|New Scientist|Space\.com|NASA|ESA|ISRO|Sansad TV|Vuukle)\b/gi, "");
	cleaned = cleaned.replace(/\(\s*\)/g, "").replace(/\s+([,.;:!?])/g, "$1").replace(/[ \t]{2,}/g, " ").replace(/\n{3,}/g, "\n\n").trim();
	return cleaned || null;
}
function scrubStory(story) {
	if (!story || typeof story !== "object") return story;
	const textFields = [
		"summary",
		"main_story",
		"background",
		"expert_analysis",
		"why_it_matters",
		"did_you_know",
		"future_outlook",
		"historical_context",
		"what_happens_next"
	];
	const listFields = [
		"key_developments",
		"quick_insights",
		"reader_takeaways",
		"timeline",
		"tags"
	];
	const cleaned = { ...story };
	for (const f of textFields) if (cleaned[f]) cleaned[f] = scrubText(cleaned[f]);
	for (const f of listFields) if (Array.isArray(cleaned[f])) {
		cleaned[f] = cleaned[f].map((item) => {
			return scrubText(typeof item === "string" ? item : item?.event ?? String(item ?? ""));
		}).filter((item) => {
			if (!item || typeof item !== "string") return false;
			if (BOILERPLATE_RX.test(item)) return false;
			if (/^\s*\d+\s*$/.test(item)) return false;
			if (!item.trim()) return false;
			return true;
		});
		if (!cleaned[f].length) delete cleaned[f];
	}
	delete cleaned.sources;
	if (Array.isArray(cleaned.organizations)) {
		cleaned.organizations = cleaned.organizations.filter((o) => {
			const name = (o?.name ?? "").toLowerCase();
			return !/reuters|bbc|cnn|the guardian|new york times|nyt|associated press|ap news|the hindu|times of india|al jazeera|bloomberg|fox news|sky news|ndtv|hindustan times|indian express|ani|pti|afp|xinhua|nikkei|the verge|techcrunch|wired|ars technica|engadget|nature|scientific american|new scientist|space\.com|nasa|esa|isro|sansad|vuukle/i.test(name);
		});
		if (!cleaned.organizations.length) delete cleaned.organizations;
	}
	return cleaned;
}
async function cleanExistingArticles(supabase) {
	try {
		const { data: dirty } = await supabase.from("articles").select("id, story, sources, title, dek, cover_image_url, category").or("story.ilike.%Photo Credit%,story.ilike.%Sansad%,story.ilike.%Vuukle%,story.ilike.%community guidelines%,story.ilike.%migrated to a new commenting%,story.ilike.%Comments have to be%,story.ilike.%abusive or personal%,story.ilike.%abide by our%,story.ilike.%registered user%,story.ilike.%older comments%,story.ilike.%Live news /%,story.ilike.%Parliament proceedings%,story.ilike.%Cockroach Janta Party%,story.ilike.%blogherads%,story.ilike.%googletag%,story.ilike.%gpt-dsk%,story.ilike.%setTargeting%,story.ilike.%defineSlot%,story.ilike.%adthrive%,story.ilike.%<script%,story.ilike.%<iframe%,story.ilike.%&amp;%,story.ilike.%&nbsp;%,story.ilike.%&#%,sources.not.is.null").limit(500);
		if (!dirty || dirty.length === 0) return;
		for (const row of dirty) {
			const updates = {};
			let changed = false;
			if (row.story) {
				const cleaned = scrubStory(row.story);
				if (JSON.stringify(cleaned) !== JSON.stringify(row.story)) {
					updates.story = cleaned;
					changed = true;
				}
			}
			if (row.sources) {
				updates.sources = null;
				changed = true;
			}
			if (row.title && BOILERPLATE_RX.test(row.title)) {
				const t = scrubText(row.title);
				if (t && t !== row.title) {
					updates.title = t;
					changed = true;
				}
			}
			if (row.dek && BOILERPLATE_RX.test(row.dek)) {
				const d = scrubText(row.dek);
				if (d && d !== row.dek) {
					updates.dek = d;
					changed = true;
				}
			}
			if (!row.cover_image_url || row.cover_image_url.startsWith("data:image")) {
				const cover = await pexelsImage((row.title || "").replace(/[^A-Za-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4).slice(0, 5).join(" ")) || await pexelsImage(row.category || "news") || getCategoryFallbackImage(row.category || "world");
				if (cover) {
					updates.cover_image_url = cover;
					changed = true;
				}
			}
			if (changed) await supabase.from("articles").update(updates).eq("id", row.id);
		}
	} catch (e) {
		console.error("[cleanExistingArticles] error:", e.message);
	}
}
async function runIngestion(opts) {
	const supabase = adminClient();
	const max = opts?.maxItems ?? 30;
	const queryBudget = opts?.mode === "manual" ? max >= 80 ? 12 : max >= 36 ? 6 : 3 : 1;
	await cleanExistingArticles(supabase);
	try {
		await supabase.rpc("update_trending_scores");
	} catch {}
	const fetched = await Promise.allSettled([
		fromNewsAPICategorical({
			queryBudget,
			priorityCategory: opts?.priorityCategory
		}),
		fromGDELTCategorical({
			queryBudget: opts?.mode === "manual" ? queryBudget : 2,
			priorityCategory: opts?.priorityCategory
		}),
		fromWorldNewsAPI({ priorityCategory: opts?.priorityCategory }),
		fromGNewsTopHeadlines(),
		fromRSS(),
		fromWikipediaCurrentEvents(),
		fromSpaceflightNews(),
		fromNASA(),
		fromNewsData(),
		fromCurrents(),
		fromMediastack(),
		fromGuardian(),
		fromNYT(),
		fromReddit()
	]);
	const all = [];
	for (const r of fetched) if (r.status === "fulfilled") all.push(...r.value);
	const cutoff = Date.now() - 8 * 864e5;
	const seen = /* @__PURE__ */ new Set();
	const queue = all.filter((i) => {
		const k = normalizeText(i.title);
		const u = normalizeUrl(i.url);
		if (!k || !u || seen.has(k) || seen.has(u)) return false;
		const ts = new Date(i.publishedAt).getTime();
		if (isNaN(ts) || ts < cutoff) return false;
		seen.add(k);
		seen.add(u);
		return true;
	});
	const { data: existing } = await supabase.from("articles").select("title,dek,sources,cover_image_url").order("published_at", { ascending: false }).limit(5e3);
	const existingSet = /* @__PURE__ */ new Set();
	const existingTitles = [];
	const existingImages = /* @__PURE__ */ new Set();
	for (const e of existing ?? []) {
		const t = normalizeText(e.title);
		if (t) {
			existingSet.add(t);
			existingTitles.push(e.title);
		}
		if (e.dek) existingSet.add(normalizeText(e.dek));
		if (e.cover_image_url) existingImages.add(e.cover_image_url);
		for (const s of e.sources ?? []) if (s?.url) existingSet.add(normalizeUrl(s.url));
	}
	const processed = await pMap(queue.filter((q) => {
		const titleKey = normalizeText(q.title);
		if (existingSet.has(titleKey) || existingSet.has(normalizeUrl(q.url)) || existingSet.has(normalizeText(q.description))) return false;
		return !existingTitles.some((t) => similarity(t, q.title) >= .75);
	}).slice(0, Math.min(queue.length, Math.max(max, max * 25))), 6, async (raw) => {
		const p = await processItem(raw);
		if (!p) return null;
		let cover = raw.imageUrl || null;
		if (cover && existingImages.has(cover) && !/^https?:\/\//i.test(cover)) cover = null;
		const titleSubject = (p.title || raw.title).replace(/[^A-Za-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4 && !/^(the|and|for|from|with|after|about|into|amid|says|will|been|have|this|that|their|them)$/i.test(w)).slice(0, 5).join(" ");
		if (!cover && titleSubject) cover = await pexelsImage(titleSubject, { excludeUrls: existingImages });
		if (!cover) cover = await pexelsImage(p.title || raw.title, { excludeUrls: existingImages });
		if (!cover) cover = await pexelsImage(`${p.tags?.[0] || ""} ${p.category || raw.topicHint || "news"}`.trim(), { excludeUrls: existingImages });
		if (!cover) cover = getCategoryFallbackImage(p.category || raw.forcedCategory || "world");
		if (cover && existingImages.has(cover) && !/^https?:\/\//i.test(cover)) cover = null;
		return {
			raw,
			p,
			cover
		};
	});
	let inserted = 0;
	let errors = 0;
	const rows = [];
	const batchTitles = /* @__PURE__ */ new Set();
	const batchUrls = /* @__PURE__ */ new Set();
	const batchImages = /* @__PURE__ */ new Set();
	const batchHashes = /* @__PURE__ */ new Set();
	const { data: existingHashes } = await supabase.from("articles").select("content_hash").not("content_hash", "is", null).limit(5e3);
	const existingHashSet = new Set((existingHashes ?? []).map((r) => r.content_hash).filter(Boolean));
	for (const item of processed) {
		if (rows.length >= max) break;
		if (!item) {
			errors++;
			continue;
		}
		const { raw, p } = item;
		let cover = item.cover;
		if (!validateArticleContent(p)) {
			errors++;
			continue;
		}
		const titleKey = normalizeText(p.title);
		const urlKey = normalizeUrl(raw.url);
		const contentHash = await sha256(titleKey + "|" + urlKey);
		if (batchTitles.has(titleKey) || batchUrls.has(urlKey) || batchHashes.has(contentHash) || existingHashSet.has(contentHash)) {
			errors++;
			continue;
		}
		if (cover && batchImages.has(cover)) cover = fallbackCoverDataUrl(p.title || raw.title, p.category || raw.forcedCategory || "world");
		batchTitles.add(titleKey);
		batchUrls.add(urlKey);
		batchHashes.add(contentHash);
		if (cover) batchImages.add(cover);
		rows.push({
			slug: `${slugify(p.title)}-${Math.random().toString(36).slice(2, 6)}`,
			title: p.title,
			dek: p.dek || null,
			category: p.category,
			subcategory: p.subcategory || null,
			cover_image_url: cover,
			read_time_minutes: 4,
			source_count: 1,
			sources: null,
			story: {
				...p.story || {},
				sources: void 0
			},
			country_code: p.country_code || null,
			published_at: (/* @__PURE__ */ new Date()).toISOString(),
			is_published: true,
			content_hash: contentHash
		});
	}
	const insertedIds = [];
	for (const row of rows) {
		const { data: insertedRow, error } = await supabase.from("articles").insert(row).select("id").single();
		if (error) {
			if (!/duplicate|unique|already/i.test(error.message)) console.error("[ingest] insert failed:", error.message);
			errors++;
		} else {
			inserted++;
			if (insertedRow?.id) insertedIds.push(insertedRow.id);
		}
	}
	for (let i = 0; i < rows.length; i++) {
		const articleId = insertedIds[i];
		if (!articleId) continue;
		const row = rows[i];
		const story = row.story || {};
		const title = row.title || "";
		try {
			const questions = await generateQuizForArticle(articleId, title, story);
			if (questions.length) await insertQuizQuestions(articleId, questions);
		} catch {}
	}
	return {
		fetched: all.length,
		inserted,
		skipped: existingSet.size,
		errors,
		pruned: 0
	};
}
async function backfillVocabulary(opts) {
	const supabase = adminClient();
	const limit = Math.min(Math.max(opts?.limit ?? 20, 1), 50);
	const { data: rows } = await supabase.from("articles").select("id, title, story").eq("is_published", true).order("published_at", { ascending: false }).limit(5e3);
	const candidates = (rows ?? []).filter((r) => {
		const vocab = r.story?.vocabulary;
		return !vocab || !Array.isArray(vocab) || vocab.length < 4;
	}).slice(0, limit);
	let updated = 0;
	let failed = 0;
	await pMap(candidates, 5, async (row) => {
		try {
			const story = row.story || {};
			const enriched = await buildVocabulary(story);
			if (enriched.length >= 4) {
				const newStory = {
					...story,
					vocabulary: enriched
				};
				const { error } = await supabase.from("articles").update({ story: newStory }).eq("id", row.id);
				if (error) failed++;
				else updated++;
			} else failed++;
		} catch {
			failed++;
		}
	});
	const { data: remainingRows } = await supabase.from("articles").select("id, story").eq("is_published", true).limit(5e3);
	const remaining = (remainingRows ?? []).filter((r) => {
		const vocab = r.story?.vocabulary;
		return !vocab || !Array.isArray(vocab) || vocab.length < 4;
	}).length;
	return {
		attempted: candidates.length,
		updated,
		failed,
		remaining
	};
}
async function reprocessBatch(opts) {
	const supabase = adminClient();
	const limit = Math.min(Math.max(opts?.limit ?? 12, 1), 20);
	const { data: rows } = await supabase.from("articles").select("id, title, dek, story, sources, category, cover_image_url").is("reprocessed_at", null).order("published_at", { ascending: false }).limit(limit);
	const items = rows ?? [];
	let updated = 0;
	let failed = 0;
	await pMap(items, 5, async (row) => {
		const existingStory = row.story || {};
		const existingArticleText = [
			row.dek,
			existingStory.summary,
			existingStory.main_story,
			existingStory.background,
			...existingStory.key_developments || [],
			...existingStory.quick_insights || [],
			existingStory.expert_analysis,
			...existingStory.timeline || [],
			existingStory.what_happens_next
		].filter(Boolean).join("\n\n");
		if (!existingArticleText.trim()) {
			await supabase.from("articles").update({ reprocessed_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", row.id);
			failed++;
			return;
		}
		const raw = {
			title: row.title,
			description: existingArticleText,
			url: row.sources?.[0]?.url || "",
			source: row.sources?.[0]?.name || "Archive",
			publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
			imageUrl: row.cover_image_url,
			forcedCategory: row.category || void 0,
			allowStoredText: true
		};
		try {
			const p = await processItem(raw);
			if (!p) {
				failed++;
				return;
			}
			const subject = (p.title || row.title).replace(/[^A-Za-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 4 && !/^(the|and|for|from|with|after|about|into|amid|says|will|been|have|this|that|their|them)$/i.test(w)).slice(0, 6).join(" ");
			let cover = row.cover_image_url;
			if (!cover || cover.startsWith("data:image")) cover = await pexelsImage(subject) || await pexelsImage(`${p.category || row.category || "news"} ${subject}`.trim()) || getCategoryFallbackImage(p.category || row.category || "world");
			const { error } = await supabase.from("articles").update({
				title: p.title,
				dek: p.dek || null,
				category: p.category || row.category,
				subcategory: p.subcategory || null,
				cover_image_url: cover,
				read_time_minutes: 4,
				story: {
					...p.story || {},
					sources: void 0
				},
				country_code: p.country_code || null,
				reprocessed_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", row.id);
			if (error) {
				failed++;
				console.error("[reprocess] update failed:", error.message);
			} else updated++;
		} catch (e) {
			failed++;
			console.error("[reprocess] error:", e.message);
		}
	});
	const { count } = await supabase.from("articles").select("id", {
		count: "exact",
		head: true
	}).is("reprocessed_at", null);
	return {
		attempted: items.length,
		updated,
		failed,
		remaining: count ?? 0
	};
}
//#endregion
export { backfillQuizzes, backfillVocabulary, reprocessBatch, runIngestion };
