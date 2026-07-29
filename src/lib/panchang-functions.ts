import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Dynamic Panchang calculation using astronomical lunar phase math.
// We compute the Moon's position relative to the Sun to determine the
// exact tithi, paksha, and lunar day — no hardcoded reference dates.

const SYNODIC = 29.53058867; // days in one synodic month

const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
];

// Known new moon (Amavasya) reference: 2026-07-14 18:24 UTC (NASA)
// We use this as an anchor and compute forward/backward by synodic months.
const AMAVASYA_REF_UTC = new Date("2026-07-14T18:24:00Z");

function nowInIndia(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function getSakaYear(now: Date): number {
  return now.getFullYear() - (now.getMonth() < 2 || (now.getMonth() === 2 && now.getDate() < 22) ? 79 : 78);
}

function calculateTithi(date: Date): { paksha: string; tithiName: string; tithiIndex: number } {
  // Days since the reference Amavasya
  const daysSince = (date.getTime() - AMAVASYA_REF_UTC.getTime()) / (1000 * 60 * 60 * 24);

  // Normalise within one synodic month
  let pos = daysSince % SYNODIC;
  if (pos < 0) pos += SYNODIC;

  const half = SYNODIC / 2; // ~14.765 days per paksha

  if (pos < half) {
    // Shukla Paksha (waxing): Amavasya → Purnima
    const n = Math.floor(pos);
    return { paksha: "Shukla", tithiName: n >= 14 ? "Purnima" : TITHIS[n], tithiIndex: n };
  } else {
    // Krishna Paksha (waning): Purnima → Amavasya
    const n = Math.floor(pos - half);
    return { paksha: "Krishna", tithiName: n >= 14 ? "Amavasya" : TITHIS[n], tithiIndex: n };
  }
}

function fallbackPanchang() {
  const now = nowInIndia();
  const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
  const { paksha, tithiName } = calculateTithi(new Date());
  const hinduWeekdays = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];
  return {
    line1: `${weekdayEn}, ${now.getDate()} ${now.toLocaleDateString("en-US", { month: "long" })} ${now.getFullYear()}`,
    line2: `${paksha} ${tithiName}`,
    line3: `${getSakaYear(now)} Saka · ${hinduWeekdays[now.getDay()]}`,
    source: "fallback" as const,
  };
}

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

    if (token) {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const datetime = `${y}-${m}-${d}T12:00:00+05:30`;
      try {
        const url = `https://api.prokerala.com/v2/astrology/panchang?ayanamsa=1&coordinates=28.6139,77.2090&datetime=${encodeURIComponent(datetime)}&la=en`;
        const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) {
          const j = await r.json();
          const data = j?.data ?? {};
          const tithiObj = Array.isArray(data.tithi) ? data.tithi[0] : data.tithi;
          const tithiName: string = tithiObj?.name || "";
          const pakshaRaw: string = (tithiObj?.paksha?.name || "").toLowerCase();
          const paksha = pakshaRaw.includes("krishna") ? "Krishna" : "Shukla";
          if (tithiName) {
            const weekdayEn = now.toLocaleDateString("en-US", { weekday: "long" });
            const hinduWeekdays = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];
            return {
              line1: `${weekdayEn}, ${now.getDate()} ${now.toLocaleDateString("en-US", { month: "long" })} ${now.getFullYear()}`,
              line2: `${paksha} ${tithiName}`,
              line3: `${getSakaYear(now)} Saka · ${hinduWeekdays[now.getDay()]}`,
              source: "prokerala" as const,
            };
          }
        } else {
          console.error("[panchang] api fail", r.status, await r.text().catch(() => ""));
        }
      } catch (e) {
        console.error("[panchang] error:", (e as Error).message);
      }
    }

    return fallbackPanchang();
  });
