import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Prokerala OAuth2 credentials (server-only)
const PROKERALA_CLIENT_ID = "d0236a06-47f5-4500-9a45-740cdb8e4c55";
const PROKERALA_CLIENT_SECRET = "q96ztifezJaD94heZdYdhtLiuGoKHMYYXENdQ7k7";

// In-memory token cache (per worker instance)
let cachedToken: { token: string; exp: number } | null = null;

async function getProkeralaToken(): Promise<string | null> {
  if (cachedToken && cachedToken.exp > Date.now() + 30_000) return cachedToken.token;
  try {
    const r = await fetch("https://api.prokerala.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: PROKERALA_CLIENT_ID,
        client_secret: PROKERALA_CLIENT_SECRET,
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

export const getCurrentPanchang = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({}).parse(d ?? {}))
  .handler(async () => {
    const now = nowInIndia();
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
