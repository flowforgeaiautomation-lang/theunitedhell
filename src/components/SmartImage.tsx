import { useState, useEffect } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  className?: string;
  placeholder?: string;
  aspectClass?: string;
};

/**
 * Image that displays instantly. No fade-in delay — the image is visible
 * immediately at opacity-100 if cached, and snaps in the moment it loads.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  loading = "eager",
  className = "",
  placeholder,
  aspectClass = "",
}: SmartImageProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-foreground/[0.06] ${aspectClass} ${className}`}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {!error && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          decoding="sync"
          // @ts-expect-error fetchPriority is valid HTML but not in React types
          fetchPriority="high"
          onError={() => setError(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.04]">
          <svg className="h-8 w-8 text-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="m21 15-5-5L5 21" />
            <circle cx="9" cy="9" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
