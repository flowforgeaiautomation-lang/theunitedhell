import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/markets.functions-ChB-egZN.js
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
var getMarketQuotesByCategory_createServerFn_handler = createServerRpc({
	id: "2a1f113cbdb886d2c68b9200c1dc4af1d98b2c1ff7424cfd6b647b0364c1f635",
	name: "getMarketQuotesByCategory",
	filename: "src/lib/markets.functions.ts"
}, (opts) => getMarketQuotesByCategory.__executeServer(opts));
var getMarketQuotesByCategory = createServerFn({ method: "GET" }).validator(stringType().optional()).handler(getMarketQuotesByCategory_createServerFn_handler, async ({ data }) => {
	const filter = data;
	const symbols = filter ? MARKET_SYMBOLS.filter((m) => m.category === filter) : MARKET_SYMBOLS;
	return Promise.all(symbols.map(fetchQuote));
});
var searchMarkets_createServerFn_handler = createServerRpc({
	id: "0cf478f57999ae0e616425ce952e7ceeaa11cdcdca9a6fb19520a9856b80238a",
	name: "searchMarkets",
	filename: "src/lib/markets.functions.ts"
}, (opts) => searchMarkets.__executeServer(opts));
var searchMarkets = createServerFn({ method: "GET" }).validator(stringType()).handler(searchMarkets_createServerFn_handler, async ({ data }) => {
	const q = data.toLowerCase().trim();
	if (!q) return [];
	return MARKET_SYMBOLS.filter((m) => m.name.toLowerCase().includes(q) || m.symbol.toLowerCase().includes(q)).map((m) => ({
		symbol: m.symbol,
		name: m.name,
		category: m.category,
		region: m.region
	}));
});
//#endregion
export { getMarketQuotesByCategory_createServerFn_handler, searchMarkets_createServerFn_handler };
