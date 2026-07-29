import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, n as queryOptions, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BUYmwI0Z.mjs";
import { s as stringType } from "../_libs/zod.mjs";
import { s as listArticles } from "./articles.functions-mUlf6cD6.mjs";
import { Pt as Activity, W as LoaderCircle, h as TrendingDown, m as TrendingUp } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as ArticleCard } from "./article-card-vLHOrR7y.mjs";
import { t as ScrollToTop } from "./ScrollToTop-DwGDiwaR.mjs";
import { t as ArticleCardSkeletonGrid } from "./ArticleCardSkeleton-CFW4eCvQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markets-YThVzUtg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MARKET_SYMBOLS = [
	{
		symbol: "SENSEX",
		name: "Sensex",
		category: "indices",
		region: "India",
		finnhub: "BSESENSEX",
		twelvedata: "BSE:SENSEX",
		fmp: "BSESENSEX"
	},
	{
		symbol: "NIFTY50",
		name: "NIFTY 50",
		category: "indices",
		region: "India",
		finnhub: "NIFTY50",
		twelvedata: "NSE:NIFTY50",
		fmp: "NSEI"
	},
	{
		symbol: "BANKNIFTY",
		name: "Bank NIFTY",
		category: "indices",
		region: "India",
		finnhub: "NIFTYBANK",
		twelvedata: "NSE:BANKNIFTY",
		fmp: "NSEBANKNIFTY"
	},
	{
		symbol: "NIFTYIT",
		name: "NIFTY IT",
		category: "indices",
		region: "India",
		finnhub: "NIFTYIT",
		twelvedata: "NSE:NIFTYIT",
		fmp: "NSENIFTYIT"
	},
	{
		symbol: "IXIC",
		name: "NASDAQ Composite",
		category: "indices",
		region: "US",
		finnhub: "^IXIC",
		twelvedata: "NASDAQ:IXIC",
		fmp: "^IXIC",
		polygon: "^IXIC"
	},
	{
		symbol: "SPX",
		name: "S&P 500",
		category: "indices",
		region: "US",
		finnhub: "^GSPC",
		twelvedata: "SPX",
		fmp: "^GSPC",
		polygon: "^GSPC"
	},
	{
		symbol: "DJI",
		name: "Dow Jones",
		category: "indices",
		region: "US",
		finnhub: "^DJI",
		twelvedata: "DJI",
		fmp: "^DJI",
		polygon: "^DJI"
	},
	{
		symbol: "FTSE100",
		name: "FTSE 100",
		category: "indices",
		region: "Europe",
		finnhub: "^FTSE",
		twelvedata: "FTSE:UKX",
		fmp: "^FTSE"
	},
	{
		symbol: "DAX",
		name: "DAX",
		category: "indices",
		region: "Europe",
		finnhub: "^GDAXI",
		twelvedata: "XETR:DAX",
		fmp: "^GDAXI"
	},
	{
		symbol: "CAC40",
		name: "CAC 40",
		category: "indices",
		region: "Europe",
		finnhub: "^FCHI",
		twelvedata: "Euronext:PX1",
		fmp: "^FCHI"
	},
	{
		symbol: "N225",
		name: "Nikkei 225",
		category: "indices",
		region: "Asia",
		finnhub: "^N225",
		twelvedata: "NIKKEI:NI225",
		fmp: "^N225"
	},
	{
		symbol: "HSI",
		name: "Hang Seng",
		category: "indices",
		region: "Asia",
		finnhub: "^HSI",
		twelvedata: "HKEX:HSI",
		fmp: "^HSI"
	},
	{
		symbol: "SSEC",
		name: "Shanghai Composite",
		category: "indices",
		region: "Asia",
		finnhub: "000001.SS",
		twelvedata: "SSE:000001",
		fmp: "000001.SS"
	},
	{
		symbol: "GOLD",
		name: "Gold",
		category: "commodities",
		finnhub: "OANDA:XAU_USD",
		twelvedata: "XAU/USD",
		fmp: "GCUSD",
		alphavantage: "GC"
	},
	{
		symbol: "SILVER",
		name: "Silver",
		category: "commodities",
		finnhub: "OANDA:XAG_USD",
		twelvedata: "XAG/USD",
		fmp: "SIUSD",
		alphavantage: "SI"
	},
	{
		symbol: "BRENT",
		name: "Brent Crude",
		category: "commodities",
		finnhub: "OANDA:BCO_USD",
		twelvedata: "BRENT",
		fmp: "BRENT"
	},
	{
		symbol: "WTI",
		name: "WTI Crude",
		category: "commodities",
		finnhub: "OANDA:WTI_USD",
		twelvedata: "WTI",
		fmp: "CLUSD",
		alphavantage: "WTI"
	},
	{
		symbol: "NATGAS",
		name: "Natural Gas",
		category: "commodities",
		finnhub: "OANDA:NATGAS_USD",
		twelvedata: "NG",
		fmp: "NGUSD",
		alphavantage: "NATURAL_GAS"
	},
	{
		symbol: "USDINR",
		name: "USD/INR",
		category: "forex",
		finnhub: "OANDA:USD_INR",
		twelvedata: "USD/INR",
		fmp: "USDINR",
		alphavantage: "USD/INR"
	},
	{
		symbol: "EURUSD",
		name: "EUR/USD",
		category: "forex",
		finnhub: "OANDA:EUR_USD",
		twelvedata: "EUR/USD",
		fmp: "EURUSD",
		alphavantage: "EUR/USD"
	},
	{
		symbol: "GBPUSD",
		name: "GBP/USD",
		category: "forex",
		finnhub: "OANDA:GBP_USD",
		twelvedata: "GBP/USD",
		fmp: "GBPUSD",
		alphavantage: "GBP/USD"
	},
	{
		symbol: "USDJPY",
		name: "USD/JPY",
		category: "forex",
		finnhub: "OANDA:USD_JPY",
		twelvedata: "USD/JPY",
		fmp: "USDJPY",
		alphavantage: "USD/JPY"
	},
	{
		symbol: "BTC",
		name: "Bitcoin",
		category: "crypto",
		finnhub: "BINANCE:BTCUSDT",
		twelvedata: "BTC/USD",
		fmp: "BTCUSD",
		polygon: "X:BTCUSD"
	},
	{
		symbol: "ETH",
		name: "Ethereum",
		category: "crypto",
		finnhub: "BINANCE:ETHUSDT",
		twelvedata: "ETH/USD",
		fmp: "ETHUSD",
		polygon: "X:ETHUSD"
	}
];
var MARKET_GROUPS = [
	{
		label: "India",
		items: MARKET_SYMBOLS.filter((m) => m.region === "India")
	},
	{
		label: "United States",
		items: MARKET_SYMBOLS.filter((m) => m.region === "US")
	},
	{
		label: "Europe",
		items: MARKET_SYMBOLS.filter((m) => m.region === "Europe")
	},
	{
		label: "Asia",
		items: MARKET_SYMBOLS.filter((m) => m.region === "Asia")
	},
	{
		label: "Commodities",
		items: MARKET_SYMBOLS.filter((m) => m.category === "commodities")
	},
	{
		label: "Forex",
		items: MARKET_SYMBOLS.filter((m) => m.category === "forex")
	},
	{
		label: "Crypto",
		items: MARKET_SYMBOLS.filter((m) => m.category === "crypto")
	}
];
var cache = /* @__PURE__ */ new Map();
var CACHE_TTL = 2e4;
function getEnv(key) {
	return process.env[key] || {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnRlcWxjZndja2dkb2t6emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjE4OTgsImV4cCI6MjA5ODI5Nzg5OH0.lGAyAxmYrJAag1yONChoqV4-A1QQAkdWKxZp5IMJyII",
		"VITE_SUPABASE_URL": "https://myrteqlcfwckgdokzzhg.supabase.co"
	}[`VITE_${key}`];
}
async function fetchJson(url, timeoutMs = 8e3) {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), timeoutMs);
		const res = await fetch(url, { signal: controller.signal });
		clearTimeout(timer);
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}
function validNum(v) {
	const n = typeof v === "string" ? parseFloat(v) : v;
	return typeof n === "number" && Number.isFinite(n) && n > 0 ? n : null;
}
async function tryFinnhub(cfg) {
	const key = getEnv("FINNHUB_API_KEY");
	if (!key || !cfg.finnhub) return null;
	const data = await fetchJson(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(cfg.finnhub)}&token=${key}`);
	if (!data || !data.c) return null;
	const price = validNum(data.c);
	if (price === null) return null;
	const prevClose = validNum(data.pc) ?? price;
	const change = price - prevClose;
	const changePercent = prevClose > 0 ? change / prevClose * 100 : 0;
	return {
		symbol: cfg.symbol,
		name: cfg.name,
		category: cfg.category,
		region: cfg.region,
		price,
		change,
		changePercent,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: "Finnhub",
		available: true
	};
}
async function tryTwelvedata(cfg) {
	const key = getEnv("TWELVEDATA_API_KEY");
	if (!key || !cfg.twelvedata) return null;
	const data = await fetchJson(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(cfg.twelvedata)}&apikey=${key}`);
	if (!data || data.status === "error" || !data.close) return null;
	const price = validNum(data.close);
	if (price === null) return null;
	const prevClose = validNum(data.previous_close) ?? price;
	const change = price - prevClose;
	const changePercent = prevClose > 0 ? change / prevClose * 100 : 0;
	return {
		symbol: cfg.symbol,
		name: cfg.name,
		category: cfg.category,
		region: cfg.region,
		price,
		change,
		changePercent,
		updatedAt: data.datetime ? new Date(data.datetime).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
		source: "Twelve Data",
		available: true
	};
}
async function tryFmp(cfg) {
	const key = getEnv("FMP_API_KEY");
	if (!key || !cfg.fmp) return null;
	const data = await fetchJson(`https://financialmodelingprep.com/api/v3/quote/${encodeURIComponent(cfg.fmp)}?apikey=${key}`);
	if (!data || !Array.isArray(data) || data.length === 0) return null;
	const d = data[0];
	const price = validNum(d.price);
	if (price === null) return null;
	return {
		symbol: cfg.symbol,
		name: cfg.name,
		category: cfg.category,
		region: cfg.region,
		price,
		change: validNum(d.change) ?? 0,
		changePercent: validNum(d.changesPercentage) ?? 0,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: "FMP",
		available: true
	};
}
async function tryPolygon(cfg) {
	const key = getEnv("POLYGON_API_KEY");
	if (!key || !cfg.polygon) return null;
	const data = await fetchJson(`https://api.polygon.io/v2/aggs/ticker/${encodeURIComponent(cfg.polygon)}/prev?adjusted=true&apiKey=${key}`);
	if (!data || !data.results || data.results.length === 0) return null;
	const r = data.results[0];
	const price = validNum(r.c);
	if (price === null) return null;
	const prevClose = validNum(r.o) ?? price;
	const change = price - prevClose;
	const changePercent = prevClose > 0 ? change / prevClose * 100 : 0;
	return {
		symbol: cfg.symbol,
		name: cfg.name,
		category: cfg.category,
		region: cfg.region,
		price,
		change,
		changePercent,
		updatedAt: new Date(r.t).toISOString(),
		source: "Polygon",
		available: true
	};
}
async function tryAlphavantage(cfg) {
	const key = getEnv("ALPHAVANTAGE_API_KEY");
	if (!key || !cfg.alphavantage) return null;
	const isForex = cfg.category === "forex" || cfg.alphavantage.includes("/");
	const isCrypto = cfg.category === "crypto";
	let url;
	if (isForex) {
		const [from, to] = cfg.alphavantage.split("/");
		url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${key}`;
	} else if (isCrypto) url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${cfg.alphavantage}&market=USD&interval=5min&apikey=${key}`;
	else url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cfg.alphavantage}&apikey=${key}`;
	const data = await fetchJson(url);
	if (!data) return null;
	let price = null;
	let change = null;
	let changePercent = null;
	if (isForex && data["Realtime Currency Exchange Rate"]) price = validNum(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
	else if (!isForex && !isCrypto && data["Global Quote"]) {
		const gq = data["Global Quote"];
		price = validNum(gq["05. price"]);
		change = validNum(gq["09. change"]);
		changePercent = validNum(gq["10. change percent"]?.replace("%", ""));
	}
	if (price === null) return null;
	return {
		symbol: cfg.symbol,
		name: cfg.name,
		category: cfg.category,
		region: cfg.region,
		price,
		change: change ?? 0,
		changePercent: changePercent ?? 0,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source: "Alpha Vantage",
		available: true
	};
}
var PROVIDERS = [
	tryFinnhub,
	tryTwelvedata,
	tryFmp,
	tryPolygon,
	tryAlphavantage
];
async function fetchQuote(cfg) {
	const cacheKey = cfg.symbol;
	const cached = cache.get(cacheKey);
	if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
	for (const provider of PROVIDERS) {
		const result = await provider(cfg);
		if (result) {
			cache.set(cacheKey, {
				data: result,
				ts: Date.now()
			});
			return result;
		}
	}
	const unavailable = {
		symbol: cfg.symbol,
		name: cfg.name,
		category: cfg.category,
		region: cfg.region,
		price: null,
		change: null,
		changePercent: null,
		updatedAt: null,
		source: null,
		available: false
	};
	cache.set(cacheKey, {
		data: unavailable,
		ts: Date.now()
	});
	return unavailable;
}
var getMarketQuotes = createServerFn({ method: "GET" })(async () => {
	return await Promise.all(MARKET_SYMBOLS.map(fetchQuote));
});
createServerFn({ method: "GET" }).validator(stringType().optional()).handler(createSsrRpc("2a1f113cbdb886d2c68b9200c1dc4af1d98b2c1ff7424cfd6b647b0364c1f635"));
createServerFn({ method: "GET" }).validator(stringType()).handler(createSsrRpc("0cf478f57999ae0e616425ce952e7ceeaa11cdcdca9a6fb19520a9856b80238a"));
var quotesQuery = queryOptions({
	queryKey: ["market-quotes-page"],
	queryFn: () => getMarketQuotes(),
	staleTime: 15e3,
	refetchInterval: 3e4
});
var PAGE_SIZE = 24;
var ASSET_TO_CATEGORY = {
	SENSEX: [
		"markets",
		"economics",
		"india"
	],
	NIFTY50: [
		"markets",
		"economics",
		"india"
	],
	BANKNIFTY: [
		"markets",
		"economics",
		"india"
	],
	NIFTYIT: [
		"markets",
		"technology",
		"india"
	],
	IXIC: [
		"markets",
		"technology",
		"economics"
	],
	SPX: ["markets", "economics"],
	DJI: ["markets", "economics"],
	FTSE100: ["markets", "economics"],
	DAX: ["markets", "economics"],
	CAC40: ["markets", "economics"],
	N225: ["markets", "economics"],
	HSI: ["markets", "economics"],
	SSEC: ["markets", "economics"],
	GOLD: [
		"markets",
		"economics",
		"investing"
	],
	SILVER: [
		"markets",
		"economics",
		"investing"
	],
	BRENT: ["markets", "economics"],
	WTI: ["markets", "economics"],
	NATGAS: ["markets", "economics"],
	USDINR: ["markets", "economics"],
	EURUSD: ["markets", "economics"],
	GBPUSD: ["markets", "economics"],
	USDJPY: ["markets", "economics"],
	BTC: [
		"markets",
		"technology",
		"artificial-intelligence"
	],
	ETH: ["markets", "technology"]
};
function formatPrice(price) {
	if (price === null) return "—";
	if (price >= 1e3) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
	if (price >= 1) return price.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
	return price.toLocaleString("en-US", {
		minimumFractionDigits: 4,
		maximumFractionDigits: 6
	});
}
function MarketsPage() {
	const search = useSearch({ from: "/markets" });
	const navigate = useNavigate();
	const fetchQuotes = useServerFn(getMarketQuotes);
	const quotes = useQuery({
		...quotesQuery,
		queryFn: () => fetchQuotes()
	}).data ?? [];
	const [articles, setArticles] = (0, import_react.useState)([]);
	const [hasMore, setHasMore] = (0, import_react.useState)(true);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const offsetRef = (0, import_react.useRef)(0);
	const sentinelRef = (0, import_react.useRef)(null);
	const isFetchingRef = (0, import_react.useRef)(false);
	const activeAsset = search.asset;
	const newsCategories = activeAsset && ASSET_TO_CATEGORY[activeAsset] ? ASSET_TO_CATEGORY[activeAsset] : [
		"markets",
		"economics",
		"investing",
		"technology"
	];
	const articlesQuery = useQuery(queryOptions({
		queryKey: ["markets-articles", activeAsset ?? "all"],
		queryFn: () => listArticles({ data: {
			limit: PAGE_SIZE,
			category: newsCategories[0]
		} }),
		staleTime: 3e4
	}));
	(0, import_react.useEffect)(() => {
		const result = articlesQuery.data;
		if (!result) return;
		const items = result.items ?? (Array.isArray(result) ? result : []);
		setArticles(items);
		offsetRef.current = items.length;
		setHasMore(result.hasMore ?? true);
	}, [articlesQuery.data]);
	const loadMore = (0, import_react.useCallback)(async () => {
		if (isFetchingRef.current || !hasMore) return;
		isFetchingRef.current = true;
		setLoadingMore(true);
		try {
			const result = await listArticles({ data: {
				limit: PAGE_SIZE,
				offset: offsetRef.current,
				category: newsCategories[0]
			} });
			const newItems = result.items ?? [];
			if (newItems.length > 0) {
				setArticles((prev) => {
					const ids = new Set(prev.map((a) => a.id));
					return [...prev, ...newItems.filter((a) => !ids.has(a.id))];
				});
				offsetRef.current += newItems.length;
			}
			setHasMore(result.hasMore ?? false);
		} catch {
			setHasMore(false);
		} finally {
			setLoadingMore(false);
			isFetchingRef.current = false;
		}
	}, [hasMore, newsCategories]);
	(0, import_react.useEffect)(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !loadingMore && hasMore) loadMore();
		}, { rootMargin: "800px" });
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [
		loadMore,
		loadingMore,
		hasMore
	]);
	function selectAsset(symbol) {
		navigate({
			to: "/markets",
			search: { asset: symbol }
		});
	}
	const cardVariants = {
		hidden: {
			opacity: 0,
			y: 24
		},
		visible: (i) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: .4,
				delay: Math.min(i % 6, 5) * .06
			}
		})
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-8 md:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b rule pb-6 mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker",
						children: "Live Global Markets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "display-1 mt-3",
						children: "Markets"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek mt-3 max-w-2xl",
						children: "Real-time data from major global indices, commodities, forex, and crypto — with financial news from around the world."
					})
				]
			}),
			activeAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center gap-3 border rule p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Filtered by"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-lg font-semibold",
						children: MARKET_SYMBOLS.find((m) => m.symbol === activeAsset)?.name ?? activeAsset
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({
							to: "/markets",
							search: { asset: void 0 }
						}),
						className: "ml-auto text-xs uppercase tracking-widest border rule px-3 py-1.5 hover:bg-foreground hover:text-background transition",
						children: "Clear filter"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-8 mb-12",
				children: MARKET_GROUPS.map((group) => {
					const groupQuotes = quotes.filter((q) => group.items.some((m) => m.symbol === q.symbol));
					if (groupQuotes.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between border-b rule pb-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-3",
							children: group.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "kicker",
							children: [groupQuotes.length, " instruments"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: groupQuotes.map((q) => {
							const positive = (q.change ?? 0) >= 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => selectAsset(q.symbol),
								className: `border rule p-4 text-left hover:bg-foreground/[0.03] transition ${activeAsset === q.symbol ? "ring-1 ring-foreground" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold uppercase tracking-wide",
											children: q.name
										}), q.available && (positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-green-600 dark:text-green-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4 text-red-600 dark:text-red-400" }))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl font-serif font-medium tabular-nums",
										children: q.available ? formatPrice(q.price) : "—"
									}),
									q.available ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-sm tabular-nums mt-1 ${positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`,
										children: [
											q.change !== null ? `${q.change >= 0 ? "+" : ""}${q.change.toFixed(2)}` : "—",
											" ",
											"(",
											q.changePercent !== null ? `${q.changePercent >= 0 ? "+" : ""}${q.changePercent.toFixed(2)}%` : "—",
											")"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Data temporarily unavailable"
									}),
									q.source && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[0.55rem] uppercase tracking-wider text-muted-foreground/50 mt-2",
										children: ["via ", q.source]
									})
								]
							}, q.symbol);
						})
					})] }, group.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t rule pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between border-b rule pb-3 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "display-3",
							children: "Market News"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker",
								children: activeAsset ? `Filtered: ${MARKET_SYMBOLS.find((m) => m.symbol === activeAsset)?.name ?? activeAsset}` : "All market news"
							})]
						})]
					}),
					articles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-3",
						children: articles.map((article, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							custom: i,
							variants: cardVariants,
							initial: "hidden",
							animate: "visible",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
								article,
								variant: "default"
							})
						}, article.id))
					}),
					articles.length === 0 && !articlesQuery.isLoading && !articlesQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek text-center py-12",
						children: "No market news found right now."
					}),
					articlesQuery.isLoading && articles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCardSkeletonGrid, { count: 6 }),
					articlesQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "dek text-center py-12",
						children: ["Could not load news. ", articlesQuery.error?.message]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: sentinelRef,
						className: "h-1"
					}),
					loadingMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center py-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollToTop, {})
		]
	});
}
//#endregion
export { MarketsPage as component };
