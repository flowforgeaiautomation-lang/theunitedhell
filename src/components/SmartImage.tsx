import { useState, useEffect } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  className?: string;
  /** Optional tiny blurhash/low-res placeholder URL */
  placeholder?: string;
  /** Aspect ratio class, e.g. "aspect-[4/3]" — applied to wrapper */
  aspectClass?: string;
};

/**
 * Image with blur-up progressive loading, lazy loading, and no layout shift.
 * Shows a muted shimmer placeholder until the image loads, then fades in.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  loading = "lazy",
  className = "",
  placeholder,
  aspectClass = "",
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-foreground/[0.06] ${aspectClass} ${className}`}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-foreground/[0.04] via-foreground/[0.08] to-foreground/[0.04]" />
      )}
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover scale-110 blur-xl opacity-60"
        />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
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
