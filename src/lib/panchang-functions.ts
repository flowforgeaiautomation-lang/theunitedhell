import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// In-memory token cache (per worker instance)
let cachedToken: { token: string; exp: number } | null = null;

async function getProkeralaToken(): Promise<string | null> {
  if (cachedToken && cachedToken.exp > Date.now() + 30_000) return cachedToken.token;
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
        client_secret: clientSecret,
      }),
    });
    if (!r.ok) {
      console.error("[panchang] token fetch failed:", r.status, await r.text().catch(() => ""));
      return null;
    }
    const d = await r.json();
    if (!d?.access_token) return null;
    cachedToken = { token: d.access_token, exp: Date.now() + (d.expires_in ?? 3600) * 1000 };
    return d.access_token;
  } catch (e) {
    console.error("[panchang] token error:", (e as Error).message);
    return null;
  }
}

function nowInIndia(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function getSakaYear(now: Date) {
  // Saka era starts 22 March. Before that we're in previous Saka year.
  return now.getFullYear() - (now.getMonth() < 2 || (now.getMonth() === 2 && now.getDate() < 22) ? 79 : 78);
}

function fallbackPanchang() {
  const now = nowInIndia();
  const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
  const day = String(now.getDate());
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const year = now.getFullYear();
  const tithis = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima","Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Amavasya"];
  const idx = (now.getDate() - 1) % 30;
  const paksha = idx < 15 ? "Shukla" : "Krishna";
  const hinduWeekdays = ["Ravivaar","Somvaar","Mangalvaar","Budhvaar","Guruvaar","Shukravaar","Shanivaar"];
  return {
    line1: `${weekdayEn}, ${day} ${month} ${year}`,
    line2: `${paksha} ${tithis[idx]}`,
    line3: `${getSakaYear(now)} Saka · ${hinduWeekdays[now.getDay()]}`,
    source: "fallback" as const,
  };
}

async function getVedicPanchang(now: Date) {
  const key = process.env.VEDIC_ASTRO_API_KEY;
  if (!key) return null;
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const url = `https://api.vedicastroapi.com/v3/json/panchang/panchang?api_key=${encodeURIComponent(key)}&date=${d}/${m}/${y}&lat=28.6139&lon=77.2090&tz=5.5`;
  const r = await fetch(url);
  
const apiData = await r.json();

console.log("VEDIC API RESPONSE:", apiData);

if (!r.ok || apiData.status === false || !apiData.response) {
  console.error("VEDIC API FAILED:", apiData);
  return null;
}
  const tithi = Array.isArray(apiData.response?.tithi) ? apiData.response.tithi[0] : apiData.response?.tithi;
  const tithiName = tithi?.name || tithi?.details?.tithi_name || "Tithi";
  const paksha = String(tithi?.paksha ?? "").toLowerCase().includes("krishna") || tithi?.paksha === 2 ? "Krishna" : "Shukla";
  const sakaYear = apiData.response?.saka?.year || apiData.response?.advanced_details?.saka_year || getSakaYear(now);
  const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = now.toLocaleDateString("en-US", { month: "long" });
  const hinduWeekdays = ["Ravivaar","Somvaar","Mangalvaar","Budhvaar","Guruvaar","Shukravaar","Shanivaar"];
  return {
    line1: `${weekdayEn}, ${String(now.getDate())} ${monthName} ${now.getFullYear()}`,
    line2: `${paksha} ${tithiName}`,
    line3: `${sakaYear} Saka · ${hinduWeekdays[now.getDay()]}`,
    source: "vedicastro" as const,
  };
}

export const getCurrentPanchang = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({}).parse(d ?? {}))
  .handler(async () => {
    const now = nowInIndia();
    const vedic = await getVedicPanchang(now).catch(() => null);
    if (vedic) return vedic;
    const token = await getProkeralaToken();
    if (!token) return fallbackPanchang();
    // Prokerala expects ISO 8601 with timezone offset; use IST +05:30 noon today
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const datetime = `${y}-${m}-${d}T12:00:00+05:30`;
    try {
      const url = `https://api.prokerala.com/v2/astrology/panchang?ayanamsa=1&coordinates=28.6139,77.2090&datetime=${encodeURIComponent(datetime)}&la=en`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) {
        console.error("[panchang] api fail", r.status, await r.text().catch(() => ""));
        return fallbackPanchang();
      }
      const j = await r.json();
      const data = j?.data ?? {};
      // Tithi: data.tithi is an array [{name, paksha:{name}}, ...]
      const tithiObj = Array.isArray(data.tithi) ? data.tithi[0] : data.tithi;
      const tithiName: string = tithiObj?.name || "Tithi";
      const pakshaRaw: string = (tithiObj?.paksha?.name || "").toLowerCase();
      const paksha = pakshaRaw.includes("krishna") ? "Krishna" : "Shukla";

      const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
      const day = String(now.getDate());
      const monthName = now.toLocaleDateString("en-US", { month: "long" });
      const year = now.getFullYear();
      const hinduWeekdays = ["Ravivaar","Somvaar","Mangalvaar","Budhvaar","Guruvaar","Shukravaar","Shanivaar"];
      return {
        line1: `${weekdayEn}, ${day} ${monthName} ${year}`,
        line2: `${paksha} ${tithiName}`,
        line3: `${getSakaYear(now)} Saka · ${hinduWeekdays[now.getDay()]}`,
        source: "prokerala" as const,
      };
    } catch (e) {
      console.error("[panchang] error:", (e as Error).message);
      return fallbackPanchang();
    }
  });
