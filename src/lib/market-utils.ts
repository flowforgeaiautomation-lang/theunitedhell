import { useEffect, useState, useRef } from "react";

export type MarketPrice = {
  symbol: string;
  name: string;
  category: string;
  region: string | null;
  price: number | null;
  change: number | null;
  change_percent: number | null;
  source: string | null;
  available: boolean;
  updated_at: string | null;
  day_high?: number | null;
  day_low?: number | null;
  prev_close?: number | null;
  open_price?: number | null;
  volume?: number | null;
  market_cap?: number | null;
  currency?: string | null;
  exchange?: string | null;
  unit?: string | null;
  market_timezone?: string | null;
};

export type Currency = "USD" | "INR" | "EUR" | "GBP" | "JPY";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  INR: "₹",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
};

export const CURRENCY_OPTIONS: { code: Currency; label: string; symbol: string }[] = [
  { code: "USD", label: "USD — US Dollar", symbol: "$" },
  { code: "INR", label: "INR — Indian Rupee", symbol: "₹" },
  { code: "EUR", label: "EUR — Euro", symbol: "€" },
  { code: "GBP", label: "GBP — British Pound", symbol: "£" },
  { code: "JPY", label: "JPY — Japanese Yen", symbol: "¥" },
];

const FX_RATES: Record<Currency, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 152.0,
};

const SUPABASE_URL = "https://myrteqlcfwckgdokzzhg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnRlcWxjZndja2dkb2t6emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjE4OTgsImV4cCI6MjA5ODI5Nzg5OH0.lGAyAxmYrJAag1yONChoqV4-A1QQAkdWKxZp5IMJyII";

const SELECT_COLS =
  "symbol,name,category,region,price,change,change_percent,source,available,updated_at,day_high,day_low,prev_close,open_price,volume,market_cap,currency,exchange,unit,market_timezone";

export async function fetchMarketPrices(): Promise<MarketPrice[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/market_prices?select=${SELECT_COLS}&order=symbol.asc`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function useMarketPrices(refreshMs = 15_000) {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let timer: ReturnType<typeof setInterval>;

    async function load() {
      const data = await fetchMarketPrices();
      if (mountedRef.current && data.length > 0) {
        setPrices(data);
        setLastUpdate(new Date());
        setLoading(false);
      } else if (mountedRef.current) {
        setLoading(false);
      }
    }

    load();
    timer = setInterval(load, refreshMs);
    return () => { mountedRef.current = false; clearInterval(timer); };
  }, [refreshMs]);

  return { prices, loading, lastUpdate };
}

export function convertPrice(price: number | null, from: string | null | undefined, to: Currency): number | null {
  if (price === null) return null;
  const fromCur = (from || "USD") as Currency;
  const usd = price / (FX_RATES[fromCur] || 1);
  return usd * FX_RATES[to];
}

export function formatPrice(price: number | null, currency: Currency, origCurrency?: string | null, unit?: string | null): string {
  if (price === null) return "—";
  const sym = CURRENCY_SYMBOLS[currency];
  const converted = convertPrice(price, origCurrency, currency);
  if (converted === null) return "—";
  let decimals: number;
  if (converted >= 100_000) decimals = 0;
  else if (converted >= 1_000) decimals = 2;
  else if (converted >= 1) decimals = 2;
  else decimals = 4;
  const formatted = converted.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${sym}${formatted}${unit ?? ""}`;
}

export function formatChange(
  change: number | null,
  changePercent: number | null,
  currency: Currency,
  origCurrency?: string | null,
): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (change === null && changePercent === null) return { text: "—", isPositive: false, isNeutral: true };
  const sym = CURRENCY_SYMBOLS[currency];
  const converted = convertPrice(change, origCurrency, currency);
  const arrow = converted !== null ? (converted >= 0 ? "▲" : "▼") : "";
  const chgStr = converted !== null
    ? `${converted >= 0 ? "+" : "-"}${sym}${Math.abs(converted).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "";
  const pctStr = changePercent !== null ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%` : "";
  return {
    text: `${arrow} ${chgStr} (${pctStr})`.trim(),
    isPositive: (changePercent ?? 0) > 0,
    isNeutral: changePercent === 0 || (changePercent === null && change === null),
  };
}

export function formatTime(ts: string | null, timezone?: string | null): string {
  if (!ts) return "";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return "";
  try {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timezone || undefined });
  } catch {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
}

export type MarketStatus = "open" | "closed" | "pre" | "after" | "always";

export function getMarketStatus(timezone: string | null, category: string): MarketStatus {
  if (category === "crypto" || category === "forex") return "always";
  if (!timezone) return "closed";
  try {
    const now = new Date();
    const localStr = now.toLocaleString("en-US", { timeZone: timezone, hour12: false });
    const local = new Date(localStr);
    const day = local.getDay();
    const totalMin = local.getHours() * 60 + local.getMinutes();
    const isWeekday = day >= 1 && day <= 5;
    if (!isWeekday) return "closed";
    if (totalMin >= 540 && totalMin < 600) return "pre";
    if (totalMin >= 600 && totalMin < 960) return "open";
    if (totalMin >= 960 && totalMin < 1200) return "after";
    return "closed";
  } catch {
    return "closed";
  }
}

export const MARKET_STATUS_CONFIG: Record<MarketStatus, { label: string; dot: string; text: string }> = {
  open: { label: "Market Open", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
  closed: { label: "Market Closed", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  pre: { label: "Pre-Market", dot: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  after: { label: "After Hours", dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
  always: { label: "Live 24/7", dot: "bg-green-500", text: "text-green-600 dark:text-green-400" },
};

export function formatVolume(vol: number | null): string {
  if (vol === null || vol <= 0) return "—";
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(2)}K`;
  return vol.toLocaleString("en-US");
}

export function formatMarketCap(cap: number | null, currency: Currency): string {
  if (cap === null || cap <= 0) return "—";
  const sym = CURRENCY_SYMBOLS[currency];
  const converted = convertPrice(cap, "USD", currency);
  if (converted === null) return "—";
  if (converted >= 1_000_000_000_000) return `${sym}${(converted / 1_000_000_000_000).toFixed(2)}T`;
  if (converted >= 1_000_000_000) return `${sym}${(converted / 1_000_000_000).toFixed(2)}B`;
  if (converted >= 1_000_000) return `${sym}${(converted / 1_000_000).toFixed(2)}M`;
  return `${sym}${converted.toLocaleString("en-US")}`;
}
