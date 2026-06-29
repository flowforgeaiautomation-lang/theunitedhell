import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Known reference: June 14, 2026 at noon IST was Amavasya transitioning to Shukla Pratipada
// Shukla Paksha starts after Amavasya, Krishna Paksha starts after Purnima
const KNOWN_AMAVASYA_END = new Date("2026-06-14T12:00:00+05:30");
const LUNAR_MONTH_DAYS = 29.53058867; // Synodic month in days

function nowInIndia(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function getSakaYear(now: Date) {
  // Saka era starts 22 March. Before that we're in previous Saka year.
  return now.getFullYear() - (now.getMonth() < 2 || (now.getMonth() === 2 && now.getDate() < 22) ? 79 : 78);
}

function calculateTithi(date: Date): { paksha: string; tithiName: string; tithiNumber: number } {
  // Calculate days since known Amavasya end (noon on June 14, 2026)
  const daysSinceAmavasya = (date.getTime() - KNOWN_AMAVASYA_END.getTime()) / (1000 * 60 * 60 * 24);

  // Normalize to current lunar cycle
  let lunarDay = daysSinceAmavasya % LUNAR_MONTH_DAYS;
  if (lunarDay < 0) lunarDay += LUNAR_MONTH_DAYS;

  // Tithi calculation:
  // Shukla Paksha: days 0 to 14.99 → tithi 1-14
  // Purnima: around day 15
  // Krishna Paksha: days 15+ → tithi 1-15 (Amavasya at end)
  const tithis = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"
  ];

  if (lunarDay < 15) {
    // Shukla Paksha: tithi 1-14
    const tithiNumber = Math.floor(lunarDay) + 1;
    const tithiName = tithis[tithiNumber - 1];
    return { paksha: "Shukla", tithiName, tithiNumber };
  } else if (lunarDay < 16) {
    // Purnima: day 15
    return { paksha: "Shukla", tithiName: "Purnima", tithiNumber: 15 };
  } else {
    // Krishna Paksha: starts after Purnima
    const krishnaDay = lunarDay - 15;
    const tithiNumber = Math.min(15, Math.floor(krishnaDay) + 1);
    const tithiName = tithiNumber === 15 ? "Amavasya" : tithis[tithiNumber - 1];
    return { paksha: "Krishna", tithiName, tithiNumber };
  }
}

function fallbackPanchang() {
  const now = nowInIndia();
  const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
  const day = String(now.getDate());
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const year = now.getFullYear();

  const { paksha, tithiName } = calculateTithi(now);
  const hinduWeekdays = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];

  return {
    line1: `${weekdayEn}, ${day} ${month} ${year}`,
    line2: `${paksha} ${tithiName}`,
    line3: `${getSakaYear(now)} Saka · ${hinduWeekdays[now.getDay()]}`,
    source: "fallback" as const,
  };
}

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
      const hinduWeekdays = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];

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
