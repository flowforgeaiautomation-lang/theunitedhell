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
 * Image with eager loading, no layout shift, and instant display.
 * Images load immediately with high priority to avoid blank/vague states during scroll.
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
          loading="eager"
          decoding="async"
          // @ts-expect-error fetchPriority is valid HTML but not in React types
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
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
