import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getCurrentPanchang } from "@/lib/panchang-functions";

function nowInIndia() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

export function PanchangDisplay() {
  const [panchang, setPanchang] = useState<any>(null);
  const fetchPanchang = useServerFn(getCurrentPanchang);

  const fetchData = async () => {
    try {
      setPanchang(await fetchPanchang({ data: {} }));
    } catch (error) {
      setPanchang(getFallbackPanchang());
    }
  };

  useEffect(() => {
    fetchData();

    let timeoutId: number | null = null;
    let intervalId: number | null = null;

    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
      );
      
      const timeUntilMidnight = midnight.getTime() - now.getTime();
      
      timeoutId = window.setTimeout(() => {
        fetchData();
        scheduleMidnightRefresh();
      }, timeUntilMidnight);
    };

    let lastDate = new Date().getDate();
    intervalId = window.setInterval(() => {
      const currentDate = new Date().getDate();
      if (currentDate !== lastDate) {
        lastDate = currentDate;
        fetchData();
      }
    }, 60000);

    scheduleMidnightRefresh();
    
    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [fetchPanchang]);

  if (!panchang) return null;

  return (
    <div className="text-left flex flex-col gap-0.5 leading-tight">
      <span className="kicker text-[0.65rem] md:text-xs">{panchang.line1}</span>
      <span className="kicker text-[0.65rem] md:text-xs">{panchang.line2}</span>
      <span className="kicker text-[0.65rem] md:text-xs">{panchang.line3}</span>
    </div>
  );
}

// Known reference: June 14, 2026 at noon IST was Amavasya transitioning to Shukla Pratipada
const KNOWN_AMAVASYA_END = new Date("2026-06-14T12:00:00+05:30");
const LUNAR_MONTH_DAYS = 29.53058867; // Synodic month in days

function calculateTithi(date: Date): { paksha: string; tithiName: string } {
  const daysSinceAmavasya = (date.getTime() - KNOWN_AMAVASYA_END.getTime()) / (1000 * 60 * 60 * 24);
  let lunarDay = daysSinceAmavasya % LUNAR_MONTH_DAYS;
  if (lunarDay < 0) lunarDay += LUNAR_MONTH_DAYS;

  const tithis = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"
  ];

  if (lunarDay < 15) {
    const tithiNumber = Math.floor(lunarDay) + 1;
    const tithiName = tithis[tithiNumber - 1];
    return { paksha: "Shukla", tithiName };
  } else if (lunarDay < 16) {
    return { paksha: "Shukla", tithiName: "Purnima" };
  } else {
    const krishnaDay = lunarDay - 15;
    const tithiNumber = Math.min(15, Math.floor(krishnaDay) + 1);
    const tithiName = tithiNumber === 15 ? "Amavasya" : tithis[tithiNumber - 1];
    return { paksha: "Krishna", tithiName };
  }
}

function getFallbackPanchang() {
  const now = nowInIndia();

  const weekdayEn = now.toLocaleDateString('en-US', { weekday: 'long' });
  const day = String(now.getDate());
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();

  const { paksha, tithiName } = calculateTithi(now);
  const sakaYear = getSakaYear(now);

  const hinduWeekdays = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];
  const hinduWeekday = hinduWeekdays[now.getDay()];

  return {
    line1: `${weekdayEn}, ${day} ${month} ${year}`,
    line2: `${paksha} ${tithiName}`,
    line3: `${sakaYear} Saka · ${hinduWeekday}`
  };
}

function getSakaYear(now: Date) {
  return now.getFullYear() - (now.getMonth() < 2 || (now.getMonth() === 2 && now.getDate() < 22) ? 79 : 78);
}
