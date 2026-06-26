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
    <div className="text-left flex-1">
      <span className="kicker text-xs md:text-sm">{panchang.line1} {panchang.line2} {panchang.line3}</span>
    </div>
  );
}

function getFallbackPanchang() {
  const now = nowInIndia();
  
  const weekdayEn = now.toLocaleDateString('en-US', { weekday: 'long' });
  const day = String(now.getDate());
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();
  
  const tithis = ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima", "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"];
  const tithiIndex = (now.getDate() - 1) % 30;
  const paksha = tithiIndex < 15 ? "Shukla" : "Krishna";
  const tithiName = tithis[tithiIndex];
  
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
