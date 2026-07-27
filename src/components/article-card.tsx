import { Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import type { ArticleSummary } from "@lib/types";
import { categoryLabel } from "@/lib/categories";
import { fallbackCoverUrl } from "@/lib/article-images";
import { SmartImage } from "@/components/SmartImage";
import { PlayCircle } from "lucide-react";

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: ArticleSummary;
  variant?: "default" | "hero" | "compact" | "wide";
}) {
  if (variant === "hero") return <HeroCard article={article} />;
  if (variant === "compact") return <CompactCard article={article} />;
  if (variant === "wide") return <WideCard article={article} />;
  return <DefaultCard article={article} />;
}

function Meta({ article }: { article: ArticleSummary }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="kicker">{categoryLabel(article.category)}</span>
    </div>
  );
}

function VideoBadge() {
  return (
    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground/80">
      <PlayCircle className="h-4 w-4" /> Video
    </div>
  );
}

function HoverVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (playing) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [playing]);

  return (
    <div
      className="absolute inset-0 z-10"
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => setPlaying(false)}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="none"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function HeroCard({ article }: { article: ArticleSummary }) {
  const cover = article.cover_image_url || fallbackCoverUrl(article);
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      preload="intent"
      className="group block hover-lift"
    >
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-7 relative">
          <SmartImage
            src={cover}
            alt={article.title}
            width={800}
            height={500}
            loading="eager"
            aspectClass="aspect-[16/10] w-full"
            className="rounded-sm"
          />
          {article.cover_video_url && (
            <>
              <VideoBadge />
              <HoverVideo src={article.cover_video_url} poster={cover} />
            </>
          )}
        </div>
        <div className="md:col-span-5 flex flex-col justify-center">
          <Meta article={article} />
          <h2 className="display-1 mt-4">{article.title}</h2>
          {article.dek && <p className="dek mt-4">{article.dek}</p>}
          <span className="mt-6 inline-block border-b border-foreground pb-0.5 text-sm font-medium w-fit">
            Read the story
          </span>
        </div>
      </div>
    </Link>
  );
}

function DefaultCard({ article }: { article: ArticleSummary }) {
  const cover = article.cover_image_url || fallbackCoverUrl(article);
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      preload="intent"
      className="group flex flex-col hover-lift"
    >
      <div className="relative">
        <SmartImage
          src={cover}
          alt={article.title}
          width={600}
          height={450}
          loading="lazy"
          aspectClass="w-full"
          className="rounded-sm"
        />
        {article.cover_video_url && (
          <>
            <VideoBadge />
            <HoverVideo src={article.cover_video_url} poster={cover} />
          </>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <Meta article={article} />
        <h3 className="display-3 group-hover:underline decoration-1 underline-offset-4">
          {article.title}
        </h3>
        {article.dek && <p className="text-sm text-muted-foreground line-clamp-2">{article.dek}</p>}
      </div>
    </Link>
  );
}

function WideCard({ article }: { article: ArticleSummary }) {
  const cover = article.cover_image_url || fallbackCoverUrl(article);
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      preload="intent"
      className="group grid gap-6 md:grid-cols-12 hover-lift border-t rule pt-8"
    >
      <div className="md:col-span-5 relative">
        <SmartImage
          src={cover}
          alt={article.title}
          width={600}
          height={450}
          loading="lazy"
          aspectClass="w-full"
          className="rounded-sm"
        />
        {article.cover_video_url && (
          <>
            <VideoBadge />
            <HoverVideo src={article.cover_video_url} poster={cover} />
          </>
        )}
      </div>
      <div className="md:col-span-7 flex flex-col justify-center">
        <Meta article={article} />
        <h3 className="display-2 mt-3">{article.title}</h3>
        {article.dek && <p className="dek mt-3">{article.dek}</p>}
      </div>
    </Link>
  );
}

function CompactCard({ article }: { article: ArticleSummary }) {
  const cover = article.cover_image_url || fallbackCoverUrl(article);
  return (
    <Link
      to="/article/$slug"
      params={{ slug: article.slug }}
      preload="intent"
      className="group flex gap-4 items-start border-t rule pt-4"
    >
      <div className="relative h-20 w-20 flex-none">
        <SmartImage
          src={cover}
          alt={article.title}
          width={80}
          height={80}
          loading="lazy"
          className="h-20 w-20 rounded-sm"
        />
        {article.cover_video_url && (
          <div className="absolute bottom-1 right-1 z-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm w-5 h-5">
            <PlayCircle className="h-3 w-3 text-foreground/80" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <span className="kicker text-[0.65rem]">{categoryLabel(article.category)}</span>
        <h4 className="font-serif font-medium text-base leading-snug mt-1 group-hover:underline decoration-1 underline-offset-2">
          {article.title}
        </h4>
      </div>
    </Link>
  );
}
