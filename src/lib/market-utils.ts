import { useEffect, useState, useRef, useCallback } from "react";

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
  updated_at: string;
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

export async function fetchMarketPrices(): Promise<MarketPrice[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/market_prices?select=symbol,name,category,region,price,change,change_percent,source,available,updated_at,day_high,day_low,prev_close,open_price,volume,market_cap,currency,exchange,unit,market_timezone&order=symbol.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
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

    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [refreshMs]);

  return { prices, loading, lastUpdate };
}

export function convertPrice(
  price: number | null,
  fromCurrency: string | null | undefined,
  toCurrency: Currency,
): number | null {
  if (price === null) return null;
  const from = (fromCurrency || "USD") as Currency;
  const usdValue = price / (FX_RATES[from] || 1);
  return usdValue * FX_RATES[toCurrency];
}

export function formatPrice(
  price: number | null,
  currency: Currency,
  originalCurrency?: string | null,
  unit?: string | null,
): string {
  if (price === null) return "—";
  const symbol = CURRENCY_SYMBOLS[currency];
  const converted = convertPrice(price, originalCurrency, currency);
  if (converted === null) return "—";

  let decimals: number;
  if (converted >= 100_000) decimals = 0;
  else if (converted >= 1_000) decimals = 2;
  else if (converted >= 1) decimals = 2;
  else decimals = 4;

  const formatted = converted.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}${unit ? unit : ""}`;
}

export function formatChange(
  change: number | null,
  changePercent: number | null,
  currency: Currency,
  originalCurrency?: string | null,
): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (change === null && changePercent === null) {
    return { text: "—", isPositive: false, isNeutral: true };
  }
  const symbol = CURRENCY_SYMBOLS[currency];
  const convertedChange = convertPrice(change, originalCurrency, currency);
  const chgStr =
    convertedChange !== null
      ? `${convertedChange >= 0 ? "+" : ""}${symbol}${Math.abs(convertedChange).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "";
  const pctStr =
    changePercent !== null
      ? `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`
      : "";
  const arrow = convertedChange !== null ? (convertedChange >= 0 ? "▲" : "▼") : "";
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
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: timezone || undefined,
    });
  } catch {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
}

export function getMarketStatus(
  timezone: string | null,
  category: string,
): "open" | "closed" | "pre" | "after" | "always" {
  if (category === "crypto" || category === "forex") return "always";

  if (!timezone) return "closed";

  try {
    const now = new Date();
    const localStr = now.toLocaleString("en-US", { timeZone: timezone, hour12: false });
    const local = new Date(localStr);
    const day = local.getDay();
    const hour = local.getHours();
    const minutes = local.getMinutes();
    const totalMinutes = hour * 60 + minutes;
    const isWeekday = day >= 1 && day <= 5;

    if (!isWeekday) return "closed";

    if (totalMinutes >= 540 && totalMinutes < 600) return "pre";
    if (totalMinutes >= 600 && totalMinutes < 960) return "open";
    if (totalMinutes >= 960 && totalMinutes < 1200) return "after";
    return "closed";
  } catch {
    return "closed";
  }
}

export function formatVolume(vol: number | null): string {
  if (vol === null) return "—";
  if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
  if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(2)}M`;
  if (vol >= 1_000) return `${(vol / 1_000).toFixed(2)}K`;
  return vol.toLocaleString("en-US");
}

export function formatMarketCap(cap: number | null, currency: Currency): string {
  if (cap === null) return "—";
  const symbol = CURRENCY_SYMBOLS[currency];
  const converted = convertPrice(cap, "USD", currency);
  if (converted === null) return "—";
  if (converted >= 1_000_000_000_000)
    return `${symbol}${(converted / 1_000_000_000_000).toFixed(2)}T`;
  if (converted >= 1_000_000_000) return `${symbol}${(converted / 1_000_000_000).toFixed(2)}B`;
  if (converted >= 1_000_000) return `${symbol}${(converted / 1_000_000).toFixed(2)}M`;
  return `${symbol}${converted.toLocaleString("en-US")}`;
}
