declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      definePlaceholder: (g: number, d: number) => void;
      showAds: (g?: number) => void;
      destroy: () => void;
      refresh: () => void;
    };
  }
}

export function initEzoicAds() {
  if (typeof window === "undefined") return;
  if (window.ezstandalone) return;
  const script = document.createElement("script");
  script.src = "https://www.ezojs.com/ezoic/sa.min.js";
  script.async = true;
  script.id = "ezoic-script";
  document.head.appendChild(script);
  window.ezstandalone = window.ezstandalone || { cmd: [] };
  window.ezstandalone.cmd.push(function () {
    if (!window.ezstandalone) return;
    window.ezstandalone.showAds();
  });
}

export function defineAdPlaceholder(placeholderId: number, divId: number) {
  if (typeof window === "undefined" || !window.ezstandalone) return;
  window.ezstandalone.cmd.push(function () {
    if (!window.ezstandalone) return;
    window.ezstandalone.definePlaceholder(placeholderId, divId);
  });
}

export function refreshEzoicAds() {
  if (typeof window === "undefined" || !window.ezstandalone) return;
  window.ezstandalone.cmd.push(function () {
    if (!window.ezstandalone) return;
    window.ezstandalone.refresh();
  });
}
