import { useEffect, type CSSProperties } from "react";

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

function definePlaceholder(placeholderId: number, divId: number) {
  if (typeof window === "undefined" || !window.ezstandalone) return;
  window.ezstandalone.cmd.push(function () {
    if (!window.ezstandalone) return;
    window.ezstandalone.definePlaceholder(placeholderId, divId);
  });
}

interface EzoicAdProps {
  placeholderId: number;
  divId: number;
  className?: string;
  style?: CSSProperties;
}

export function EzoicAd({ placeholderId, divId, className, style }: EzoicAdProps) {
  useEffect(() => {
    definePlaceholder(placeholderId, divId);
  }, [placeholderId, divId]);
  return (
    <div
      id={`ezoic-pub-ad-placeholder-${divId}`}
      data-ezoic-placeholder-id={placeholderId}
      className={className}
      style={{ minHeight: "0px", width: "100%", ...style }}
    />
  );
}

export function EzoicAdHeader() {
  return <EzoicAd placeholderId={100} divId={100} className="ezoic-ad-header" />;
}

export function EzoicAdFooter() {
  return <EzoicAd placeholderId={101} divId={101} className="ezoic-ad-footer" />;
}

export function EzoicAdSidebar() {
  return <EzoicAd placeholderId={102} divId={102} className="ezoic-ad-sidebar" />;
}

export function EzoicAdInArticle() {
  return <EzoicAd placeholderId={103} divId={103} className="ezoic-ad-in-article" />;
}

export function EzoicAdBetweenArticles() {
  return <EzoicAd placeholderId={104} divId={104} className="ezoic-ad-between-articles" />;
}
