import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { a as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/panchang-functions-sEa4SbB5.js
var PURNIMA_END_UTC = /* @__PURE__ */ new Date("2026-06-29T18:00:00Z");
var SYNODIC = 29.53058867;
var TITHIS = [
	"Pratipada",
	"Dwitiya",
	"Tritiya",
	"Chaturthi",
	"Panchami",
	"Shashthi",
	"Saptami",
	"Ashtami",
	"Navami",
	"Dashami",
	"Ekadashi",
	"Dwadashi",
	"Trayodashi",
	"Chaturdashi"
];
function nowInIndia() {
	return new Date((/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}
function getSakaYear(now) {
	return now.getFullYear() - (now.getMonth() < 2 || now.getMonth() === 2 && now.getDate() < 22 ? 79 : 78);
}
function calculateTithi(date) {
	let pos = (date.getTime() - PURNIMA_END_UTC.getTime()) / (1e3 * 60 * 60 * 24) % SYNODIC;
	if (pos < 0) pos += SYNODIC;
	const half = SYNODIC / 2;
	if (pos < half) {
		const n = Math.floor(pos);
		return {
			paksha: "Krishna",
			tithiName: n >= 14 ? "Amavasya" : TITHIS[n]
		};
	} else {
		const n = Math.floor(pos - half);
		return {
			paksha: "Shukla",
			tithiName: n >= 14 ? "Purnima" : TITHIS[n]
		};
	}
}
function fallbackPanchang() {
	const now = nowInIndia();
	const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
	const { paksha, tithiName } = calculateTithi(/* @__PURE__ */ new Date());
	return {
		line1: `${weekdayEn}, ${now.getDate()} ${now.toLocaleDateString("en-US", { month: "long" })} ${now.getFullYear()}`,
		line2: `${paksha} ${tithiName}`,
		line3: `${getSakaYear(now)} Saka · ${[
			"Ravivaar",
			"Somvaar",
			"Mangalvaar",
			"Budhvaar",
			"Guruvaar",
			"Shukravaar",
			"Shanivaar"
		][now.getDay()]}`,
		source: "fallback"
	};
}
var cachedToken = null;
async function getProkeralaToken() {
	if (cachedToken && cachedToken.exp > Date.now() + 3e4) return cachedToken.token;
	const clientId = process.env.PROKERALA_CLIENT_ID;
	const clientSecret = process.env.PROKERALA_CLIENT_SECRET;
	if (!clientId || !clientSecret) return null;
	try {
		const r = await fetch("https://api.prokerala.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "client_credentials",
				client_id: clientId,
				client_secret: clientSecret
			})
		});
		if (!r.ok) {
			console.error("[panchang] token fetch failed:", r.status, await r.text().catch(() => ""));
			return null;
		}
		const d = await r.json();
		if (!d?.access_token) return null;
		cachedToken = {
			token: d.access_token,
			exp: Date.now() + (d.expires_in ?? 3600) * 1e3
		};
		return d.access_token;
	} catch (e) {
		console.error("[panchang] token error:", e.message);
		return null;
	}
}
var getCurrentPanchang_createServerFn_handler = createServerRpc({
	id: "87c613e3bc9e08ccf8247c65872fb34b0db7d6e8b58bb76a75d648a6f5cf34d7",
	name: "getCurrentPanchang",
	filename: "src/lib/panchang-functions.ts"
}, (opts) => getCurrentPanchang.__executeServer(opts));
var getCurrentPanchang = createServerFn({ method: "GET" }).inputValidator((d) => objectType({}).parse(d ?? {})).handler(getCurrentPanchang_createServerFn_handler, async () => {
	const now = nowInIndia();
	const token = await getProkeralaToken();
	if (token) {
		const datetime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T12:00:00+05:30`;
		try {
			const url = `https://api.prokerala.com/v2/astrology/panchang?ayanamsa=1&coordinates=28.6139,77.2090&datetime=${encodeURIComponent(datetime)}&la=en`;
			const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
			if (r.ok) {
				const data = (await r.json())?.data ?? {};
				const tithiObj = Array.isArray(data.tithi) ? data.tithi[0] : data.tithi;
				const tithiName = tithiObj?.name || "";
				const paksha = (tithiObj?.paksha?.name || "").toLowerCase().includes("krishna") ? "Krishna" : "Shukla";
				if (tithiName) return {
					line1: `${now.toLocaleDateString("en-US", { weekday: "long" })}, ${now.getDate()} ${now.toLocaleDateString("en-US", { month: "long" })} ${now.getFullYear()}`,
					line2: `${paksha} ${tithiName}`,
					line3: `${getSakaYear(now)} Saka · ${[
						"Ravivaar",
						"Somvaar",
						"Mangalvaar",
						"Budhvaar",
						"Guruvaar",
						"Shukravaar",
						"Shanivaar"
					][now.getDay()]}`,
					source: "prokerala"
				};
			} else console.error("[panchang] api fail", r.status, await r.text().catch(() => ""));
		} catch (e) {
			console.error("[panchang] error:", e.message);
		}
	}
	return fallbackPanchang();
});
//#endregion
export { getCurrentPanchang_createServerFn_handler };
