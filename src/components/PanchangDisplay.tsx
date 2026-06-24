import { useState, useEffect } from 'react';

const API_KEY = "vai_pk_NWMPDXkeSVUCIcGsiZ5x4lTyODuP8f7W";
const API_BASE = "https://api.vedicastroapi.com/v3/json/";

function nowInIndia() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

export function PanchangDisplay() {
  const [panchang, setPanchang] = useState<any>(null);

  const fetchData = async () => {
    try {
      const now = nowInIndia();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const date = String(now.getDate()).padStart(2, "0");
      
      // Add cache buster to always get fresh data
      const cacheBuster = Date.now();
      const apiUrl = `${API_BASE}panchang/panchang?api_key=${API_KEY}&date=${date}/${month}/${year}&lat=28.6139&lon=77.2090&tz=5.5&_=${cacheBuster}`;
      
      const response = await fetch(apiUrl);
      
      let data;
      
      if (response.ok) {
        const apiData = await response.json();
        const weekdayEn = now.toLocaleDateString('en-US', { weekday: 'long' });
        const day = String(now.getDate());
        const monthName = now.toLocaleDateString('en-US', { month: 'long' });
        const yearNum = now.getFullYear();
        
        const tithi = Array.isArray(apiData.response?.tithi) ? apiData.response.tithi[0] : apiData.response?.tithi;
        const tithiName = tithi?.name || tithi?.details?.tithi_name || "Tithi";
        const paksha = String(tithi?.paksha ?? "").toLowerCase().includes("krishna") || tithi?.paksha === 2 ? "Krishna" : "Shukla";
        const sakaYear = apiData.response?.saka?.year || apiData.response?.advanced_details?.saka_year || getSakaYear(now);
        
        const hinduWeekdays = ["Ravivaar", "Somvaar", "Mangalvaar", "Budhvaar", "Guruvaar", "Shukravaar", "Shanivaar"];
        const hinduWeekday = hinduWeekdays[now.getDay()];
        
        data = {
          line1: `${weekdayEn}, ${day} ${monthName} ${yearNum}`,
          line2: `${paksha} ${tithiName}`,
          line3: `${sakaYear} Saka · ${hinduWeekday}`
        };
      } else {
        data = getFallbackPanchang();
      }
      
      setPanchang(data);
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
  }, []);

  if (!panchang) return null;

  return (
    <div className="flex flex-col gap-1 text-left flex-1">
      <span className="kicker text-xs md:text-sm">{panchang.line1}</span>
      <span className="kicker text-xs md:text-sm text-muted-foreground">{panchang.line2}</span>
      <span className="kicker text-xs md:text-sm text-muted-foreground">{panchang.line3}</span>
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
