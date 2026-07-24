import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getArticleBySlug, getRelated, listComments, postReflection, bumpLike, deleteCommentAnon } from "@/lib/articles.functions";


import { ArticleActions } from "@/components/article-actions";
import { ArticleCard } from "@/components/article-card";
import { categoryLabel } from "@/lib/categories";

import { toast } from "sonner";
import { Quote, Lightbulb, Clock, TrendingUp, Users, Building2, Globe2, Hash, Sparkles, Info, Bookmark, ChevronRight, ArrowBigUp, MessageCircle, Trash2, CornerDownRight } from "lucide-react";
import type { CommentRow, ArticleStory, KeyNumber, PersonInvolved, OrganizationInvolved, CountryInvolved, VocabEntry } from "@/lib/types";
import { fallbackCoverUrl } from "@/lib/article-images";
import { WordSearch } from "@/components/word-search";
import { KnowledgeCheck } from "@/components/KnowledgeCheck";
import { EnhancedVocabCard } from "@/components/EnhancedVocabCard";
import { canonicalUrl, articleUrl, newsArticleJsonLd, breadcrumbJsonLd, SITE_NAME, SITE_LOGO, SITE_URL } from "@/lib/seo";

const articleQ = (slug: string) =>
  queryOptions({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug({ data: { slug } }),
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });



export const Route = createFileRoute("/article/$slug")({
  loader: async ({ context, params }) => {
    try {
      const a = await context.queryClient.ensureQueryData(articleQ(params.slug));
      if (!a) throw notFound();
      return { article: a };
    } catch (e) {
      if (e && typeof e === 'object' && 'status' in e && (e as any).status === 404) throw e;
      try {
        throw notFound();
      } catch (e2) {
        if (e2 && typeof e2 === 'object' && 'status' in e2 && (e2 as any).status === 404) throw e2;
        console.error("[article loader] SSR fallback failed:", e2);
        return { article: null };
      }
    }
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a)
      return {
        meta: [
          { title: "Story not found — The United Hell" },
        ],
      };
    const url = articleUrl(a.slug);
    const img = a.cover_image_url || SITE_LOGO;
    return {
      meta: [
        { title: `${a.title} — ${SITE_NAME}` },
        { name: "description", content: a.dek ?? a.title },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.dek ?? a.title },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: img },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: a.title },
        { name: "twitter:description", content: a.dek ?? a.title },
        { name: "twitter:image", content: img },
        { name: "article:published_time", content: a.published_at },
        { name: "article:section", content: a.category },
      ],
      links: [
        { rel: "canonical", href: url },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(newsArticleJsonLd(a)),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbJsonLd([
            { name: SITE_NAME, url: SITE_URL },
            { name: a.category, url: canonicalUrl(`/search?q=${encodeURIComponent(a.category)}`) },
            { name: a.title, url },
          ])),
        },
      ],
    };
  },
  component: ArticlePage,
  errorComponent: ({ error }) => (
    <div className="container-read py-24 text-center">
      <p className="dek">We couldn't load this story. {error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-read py-24 text-center">
      <div className="kicker">Missing</div>
      <h1 className="display-1 mt-3">This story isn't here.</h1>
      <Link to="/" search={{ category: undefined }} className="mt-6 inline-block kicker hover:opacity-60">← Front page</Link>
    </div>
  ),
});

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function ReadingProgress() {
  const progress = useScrollProgress();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-foreground transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ArticlePage() {
  const { slug } = Route.useParams();
  const { data: article, isError, refetch } = useQuery(articleQ(slug));

  // All hooks must run unconditionally before any early return,
  // otherwise React throws error #310 (hooks called conditionally).
  const relatedQuery = useQuery({
    queryKey: ["related", article?.category ?? "", article?.slug ?? ""],
    queryFn: () => getRelated({ data: { category: article!.category, excludeSlug: article!.slug } }),
    enabled: !!article,
  });

  if (isError) {
    return (
      <div className="container-read py-24 text-center">
        <div className="kicker">Connection issue</div>
        <h1 className="display-2 mt-3">Couldn't load this story.</h1>
        <p className="dek mt-3">A temporary error occurred. Please try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-6 border border-foreground px-5 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition"
        >
          Try again
        </button>
        <Link to="/" search={{ category: undefined }} className="mt-3 block kicker hover:opacity-60">← Front page</Link>
      </div>
    );
  }
  if (!article) return null;
  const story = article.story ?? {};
  const cover = article.cover_image_url || fallbackCoverUrl(article);
  const related = relatedQuery.data ?? [];

  const tags = (article as any).tags || (story as any).tags || [];

  const addedDate = (article as any).created_at
    ? new Date((article as any).created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article>
      <ReadingProgress />

      {/* Hero */}
      <header className="container-read pt-10 md:pt-16 text-center">
        <div className="kicker">{categoryLabel(article.category)}</div>
        <h1 className="display-1 mt-5">{article.title}</h1>
        {article.dek && <p className="dek mt-6 text-balance">{article.dek}</p>}
        {addedDate && (
          <div className="mt-4 text-sm text-muted-foreground">
            {addedDate}
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <ArticleActions articleId={article.id} title={article.title} />
        </div>
      </header>

      <figure className="container-edit mt-10 group">
        <img
          src={cover}
          alt={article.title}
          className="w-full max-h-[70vh] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          loading="eager"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== fallbackCoverUrl(article)) img.src = fallbackCoverUrl(article);
          }}
        />
      </figure>

      {/* Story Mode */}
      <section className="container-read py-12 md:py-16" style={{ fontSize: "var(--article-font-size, 17px)", lineHeight: "var(--article-line-height, 1.6)" }}>
        <div className="article-content grid gap-10">
          <StoryBlock label="Quick Summary" body={story.summary} />
          <StoryBlock label="Main Story" body={story.main_story} />

          {story.background && <StoryBlock label="Background" body={story.background} />}

          {story.key_developments && story.key_developments.length > 0 && (
            <KeyDevelopmentsBlock items={story.key_developments} />
          )}

          {story.quick_insights && story.quick_insights.length > 0 && (
            <ListBlock label="Quick Insights" items={story.quick_insights} />
          )}

          {story.why_it_matters && (
            <InfoBox label="Why This Matters" body={story.why_it_matters} icon="lightbulb" />
          )}

          {story.expert_analysis && <StoryBlock label="Expert Insights" body={story.expert_analysis} />}

          {story.timeline && story.timeline.length > 0 && (
            <TimelineBlock items={story.timeline} />
          )}

          {story.key_numbers && story.key_numbers.length > 0 && (
            <KeyNumbersBlock items={story.key_numbers} />
          )}

          {story.people && story.people.length > 0 && (
            <PeopleBlock people={story.people} />
          )}

          {story.organizations && story.organizations.length > 0 && (
            <OrganizationsBlock orgs={story.organizations} />
          )}

          {story.countries && story.countries.length > 0 && (
            <CountriesBlock countries={story.countries} />
          )}

          {story.did_you_know && (
            <DidYouKnowBlock fact={story.did_you_know} />
          )}

          {story.historical_context && (
            <StoryBlock label="Historical Context" body={story.historical_context} />
          )}

          {story.future_outlook && (
            <StoryBlock label="Future Outlook" body={story.future_outlook} />
          )}

          {story.reader_takeaways && story.reader_takeaways.length > 0 && (
            <ListBlock label="Reader Takeaways" items={story.reader_takeaways} />
          )}

          {tags.length > 0 && <RelatedTopics tags={tags} />}
        </div>

        {/* Interactive features (outside article-content for Journey compatibility) */}
        <div className="grid gap-10 mt-10">
          <div className="border-y rule py-10">
            <div className="kicker mb-6">Vocabulary Builder</div>
            {story.vocabulary && story.vocabulary.length > 0 ? (
              <div className="grid gap-6">
                {story.vocabulary.map((v, i) => (
                  <EnhancedVocabCard key={`${v.word}-${i}`} entry={v} articleId={article.id} index={i} />
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
                {generateLocalVocabFallback(story.summary || story.main_story || article.dek || article.title || "").map((v, i) => (
                  <EnhancedVocabCard key={`${v.word}-${i}`} entry={v} articleId={article.id} index={i} />
                ))}
              </div>
            )}

            <WordSearch />
          </div>

          <KnowledgeCheckReflection articleId={article.id} story={story} title={article.title} />
        </div>

        <div className="mt-12 flex justify-center">
          <ArticleActions articleId={article.id} title={article.title} />
        </div>

      </section>

      {/* Comments */}
      <Discussion articleId={article.id} />

      {/* Related */}
      {related.length > 0 && (
        <section className="container-edit py-16 border-t rule">
          <h2 className="display-3 mb-8">Keep reading</h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 4).map((a) => (
              <ArticleCard key={a.id} article={a} variant="default" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function StoryBlock({ label, body }: { label: string; body?: string }) {
  if (!body) return null;
  const paragraphs = body.split(/\n{2,}|\r?\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div>
      {label && <div className="kicker mb-3">{label}</div>}
      <div className="grid gap-5">
        {paragraphs.map((paragraph, index) => {
          if (paragraph.startsWith("> ") || paragraph.startsWith('"')) {
            const quoteText = paragraph.replace(/^>\s*/, "").replace(/^"|"$/g, "");
            return <PullQuote key={index} text={quoteText} />;
          }
          return (
            <p key={index} className="font-serif text-xl md:text-2xl leading-snug">{paragraph}</p>
          );
        })}
      </div>
    </div>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="my-8 border-l-[3px] border-foreground pl-6 md:pl-8">
      <p className="font-serif text-2xl md:text-3xl leading-tight italic text-foreground/90">
        {text}
      </p>
    </blockquote>
  );
}

function InfoBox({ label, body, icon = "info" }: { label: string; body?: string; icon?: "info" | "lightbulb" | "sparkles" }) {
  if (!body) return null;
  const Icon = icon === "lightbulb" ? Lightbulb : icon === "sparkles" ? Sparkles : Info;
  return (
    <div className="border-t rule pt-8">
      <div className="rounded-lg border rule bg-foreground/[0.02] p-6 md:p-8">
        <div className="kicker mb-4 flex items-center gap-2">
          <Icon className="h-4 w-4" /> {label}
        </div>
        <div className="grid gap-4">
          {body.split(/\n{2,}|\r?\n/).map((p, i) => (
            <p key={i} className="font-serif text-lg md:text-xl leading-relaxed text-foreground/90">{p.trim()}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function KeyDevelopmentsBlock({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-6">Key Developments</div>
      <div className="grid gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="group flex gap-5 rounded-lg border rule p-5 md:p-6 transition-all duration-300 hover:bg-foreground/[0.02] hover:border-foreground/30"
          >
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border rule font-serif text-lg text-foreground/80 transition-colors group-hover:border-foreground group-hover:text-foreground">
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <p className="font-serif text-lg md:text-xl leading-snug pt-1.5">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineBlock({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-6">Timeline</div>
      <div className="relative pl-8">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-foreground/20" />
        <div className="grid gap-6">
          {items.map((item, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-foreground bg-background" />
              <p className="font-serif text-lg leading-snug">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RelatedTopics({ tags }: { tags: string[] }) {
  if (!tags?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-4">Related Topics</div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            to="/search"
            search={{ q: tag }}
            className="group inline-flex items-center gap-1 rounded-full border rule px-4 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:border-foreground hover:text-foreground"
          >
            {tag}
            <ChevronRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ListBlock({ label, items }: { label: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-4">{label}</div>
      <ul className="grid gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 font-serif text-lg leading-snug">
            <span className="text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KeyNumbersBlock({ items }: { items: KeyNumber[] }) {
  if (!items?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-4 flex items-center gap-2"><Hash className="h-4 w-4" /> Key Numbers</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((kn, i) => (
          <div key={i} className="border rule p-5 transition-colors hover:border-foreground/30">
            <div className="font-serif text-3xl mb-1">{kn.value}</div>
            {kn.label && <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{kn.label}</div>}
            {kn.explanation && <p className="text-sm text-foreground/70 leading-relaxed">{kn.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PeopleBlock({ people }: { people: PersonInvolved[] }) {
  if (!people?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-4 flex items-center gap-2"><Users className="h-4 w-4" /> People Involved</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {people.map((p, i) => (
          <div key={i} className="border rule p-5 transition-colors hover:border-foreground/30">
            <h3 className="font-serif text-xl mb-1">{p.name}</h3>
            {p.role && <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{p.role}</div>}
            {p.contribution && <p className="text-sm text-foreground/80 leading-relaxed mb-1">{p.contribution}</p>}
            {p.importance && <p className="text-sm text-muted-foreground leading-relaxed">{p.importance}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function OrganizationsBlock({ orgs }: { orgs: OrganizationInvolved[] }) {
  if (!orgs?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-4 flex items-center gap-2"><Building2 className="h-4 w-4" /> Organizations</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {orgs.map((o, i) => (
          <div key={i} className="border rule p-5 transition-colors hover:border-foreground/30">
            <h3 className="font-serif text-xl mb-1">{o.name}</h3>
            {o.explanation && <p className="text-sm text-foreground/70 leading-relaxed">{o.explanation}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountriesBlock({ countries }: { countries: CountryInvolved[] }) {
  if (!countries?.length) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="kicker mb-4 flex items-center gap-2"><Globe2 className="h-4 w-4" /> Countries</div>
      <div className="flex flex-wrap gap-2">
        {countries.map((c, i) => (
          <div key={i} className="border rule px-4 py-2">
            <span className="font-serif text-base">{c.name}</span>
            {c.role && <span className="text-sm text-muted-foreground ml-2">— {c.role}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DidYouKnowBlock({ fact }: { fact: string }) {
  if (!fact) return null;
  return (
    <div className="border-t rule pt-8">
      <div className="rounded-xl border rule bg-foreground/[0.02] p-6">
        <div className="kicker mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Did You Know?</div>
        <p className="font-serif text-lg leading-relaxed">{fact}</p>
      </div>
    </div>
  );
}

function EntityBlock({ people, organizations, countries }: { people?: string[]; organizations?: string[]; countries?: string[] }) {
  const groups = [
    { label: "People mentioned", items: people },
    { label: "Organizations mentioned", items: organizations },
    { label: "Countries mentioned", items: countries },
  ].filter((g) => g.items?.length);
  if (!groups.length) return null;
  return (
    <div className="grid gap-6 md:grid-cols-3 border-t rule pt-8">
      {groups.map((g) => (
        <div key={g.label}>
          <div className="kicker mb-3">{g.label}</div>
          <div className="flex flex-wrap gap-2">
            {g.items!.map((item) => <span key={item} className="border rule px-2 py-1 text-xs">{item}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

const STOPWORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","must","can","this","that","these","those","i","you","he","she","it","we","they","me","him","her","us","them","my","your","his","its","our","their","what","which","who","whom","whose","when","where","why","how","all","any","both","each","few","more","most","other","some","such","no","nor","not","only","own","same","so","than","too","very","just","as","if","about","against","between","into","through","during","before","after","above","below","up","down","out","off","over","under","again","further","then","once","here","there","also","said","says","one","two","three","new","said","also","news","report","according","image","photo","getty","reuters","ap","afp","caption","via","advertisement","story","article","read","more","click","subscribe","sign","up","log","in","out","up","down","like","back","make","made","get","got","go","went","take","took","come","came","see","saw","know","knew","think","thought","say","said","told","tell","tells","telling","week","day","year","month","time","today","yesterday","tomorrow","now","then","still","even","well","much","many","such","very","too","so","just","only","also","always","never","often","sometimes","usually","rarely","here","there","where","when","why","how","what","who","which","whose","whom","percent","million","billion","thousand","hundred","people","person","group","world","country","nations","united","states","state","government","president","minister","leader","official","spokesman","spokeswoman","police","military","army","forces","war","attack","strike","crisis","conflict","issue","problem","solution","plan","policy","law","rule","order","court","judge","case","trial","charge","arrest","kill","killed","death","die","died","injure","injured","wound","wounded","damage","destroy","destroyed","loss","lost","win","won","victory","defeat","fail","failed","failure","success","successful","achieve","achieved","goal","target","aim","purpose","reason","cause","effect","result","impact","change","changed","reform","improve","improved","better","best","good","bad","great","small","large","big","little","high","low","long","short","fast","slow","old","new","young","early","late","first","last","next","previous","former","current","present","past","future","local","national","international","global","public","private","general","specific","particular","certain","sure","clear","unclear","simple","complex","easy","difficult","hard","soft","strong","weak","power","powerful","important","significant","major","minor","main","key","central","primary","secondary","final","initial","original","recent","latest","current","modern","traditional","old","new","right","left","center","middle","side","end","start","begin","beginning","close","closed","open","opened","full","empty","complete","incomplete","whole","part","half","quarter","third","section","area","region","zone","place","location","city","town","village","capital","district","neighborhood","street","road","avenue","building","house","home","office","room","space","land","field","farm","forest","mountain","river","lake","sea","ocean","water","air","fire","earth","ground","sky","weather","rain","snow","wind","storm","cloud","sun","moon","star","light","dark","day","night","morning","evening","afternoon","today","tonight","weekend","holiday","season","spring","summer","autumn","fall","winter","january","february","march","april","may","june","july","august","september","october","november","december","monday","tuesday","wednesday","thursday","friday","saturday","sunday","am","pm","hour","minute","second","moment","while","since","until","till","during","through","throughout","across","along","around","about","above","below","beside","behind","beyond","within","without","among","between","against","toward","towards","upon","onto","into","out","off","away","back","forth","forward","backward","ahead","behind","alongside","near","far","close","distant","remote","nearby","here","there","everywhere","nowhere","somewhere","anywhere","thus","therefore","however","moreover","furthermore","nevertheless","nonetheless","although","though","despite","because","since","unless","whether","either","neither","both","each","every","all","none","some","many","much","few","several","various","particular","certain","one","two","three","four","five","six","seven","eight","nine","ten","hundred","thousand","million","billion","zero","first","second","third","fourth","fifth","last","next","previous","following","preceding","succeeding","existing","remaining","leftover","extra","additional","another","other","same","different","similar","opposite","contrary","reverse","inverse","converse","transverse","obverse","reverse","front","back","side","top","bottom","middle","center","edge","corner","angle","point","line","curve","circle","square","round","flat","sharp","dull","smooth","rough","hard","soft","thick","thin","wide","narrow","tall","short","deep","shallow","heavy","light","dark","bright","dim","clear","cloudy","transparent","opaque","solid","liquid","gas","plasma","matter","energy","force","motion","speed","velocity","acceleration","mass","weight","volume","density","pressure","temperature","heat","cold","warm","cool","hot","freeze","frozen","melt","boil","evaporate","condense","solidify","crystallize","dissolve","solution","mixture","compound","element","atom","molecule","ion","electron","proton","neutron","nucleus","cell","tissue","organ","system","body","brain","heart","lung","blood","bone","muscle","skin","eye","ear","nose","mouth","hand","foot","leg","arm","head","face","neck","back","chest","stomach","waist","hip","knee","ankle","wrist","elbow","shoulder","finger","toe","hair","nail","tooth","teeth","tongue","lip","cheek","chin","forehead","temple","ear","eye","nose","mouth","chin","jaw","throat","voice","sound","noise","music","song","speech","word","letter","number","symbol","sign","mark","note","tag","label","title","name","term","phrase","sentence","paragraph","page","book","chapter","volume","issue","edition","version","copy","original","duplicate","replica","model","pattern","design","style","form","format","type","kind","sort","class","category","group","set","collection","series","sequence","order","arrangement","structure","system","network","web","grid","matrix","array","list","table","chart","graph","map","plan","diagram","figure","image","picture","photo","photograph","drawing","painting","art","artist","work","piece","creation","product","result","outcome","consequence","effect","impact","influence","role","function","purpose","use","usage","application","practice","method","technique","process","procedure","step","stage","phase","level","degree","extent","amount","quantity","number","count","total","sum","average","mean","median","mode","range","scope","scale","size","dimension","measure","measurement","unit","standard","criterion","basis","foundation","core","heart","center","middle","point","focus","target","goal","objective","aim","purpose","intent","intention","plan","scheme","strategy","tactic","approach","way","manner","method","mode","fashion","style","form","shape","outline","contour","profile","silhouette","shadow","reflection","mirror","glass","window","door","gate","entrance","exit","passage","corridor","hall","lobby","room","chamber","hall","court","arena","stadium","field","ground","court","ring","track","course","route","path","way","road","street","avenue","boulevard","highway","freeway","bridge","tunnel","station","stop","terminal","airport","port","harbor","dock","pier","wharf","quay","jetty","breakwater","seawall","dam","levee","dike","embankment","barrier","fence","wall","gate","door","window","roof","floor","ceiling","column","pillar","post","beam","arch","vault","dome","tower","spire","steeple","chimney","smokestack","furnace","oven","stove","heater","boiler","engine","motor","machine","device","tool","instrument","implement","utensil","appliance","equipment","gear","apparatus","mechanism","system","network","circuit","wire","cable","cord","line","pipe","tube","channel","duct","vent","flue","chimney","stack","tower","mast","pole","stick","rod","bar","beam","plank","board","panel","sheet","plate","block","brick","stone","rock","sand","gravel","dust","dirt","soil","earth","clay","mud","mud","clay","silt","sand","gravel","pebble","rock","stone","boulder","mountain","hill","valley","canyon","gorge","cliff","bluff","ridge","peak","summit","slope","side","face","wall","surface","layer","level","stratum","bed","floor","ground","bottom","base","foot","top","crest","crown","cap","cover","lid","top","bottom","side","edge","border","margin","rim","brim","lip","mouth","opening","hole","gap","space","room","area","zone","region","district","territory","province","state","country","nation","kingdom","empire","republic","democracy","monarchy","dictatorship","regime","government","rule","control","power","authority","command","order","direction","guidance","leadership","management","administration","organization","association","society","club","union","league","alliance","coalition","partnership","agreement","treaty","pact","deal","contract","arrangement","settlement","resolution","decision","choice","option","alternative","possibility","opportunity","chance","risk","danger","threat","hazard","peril","jeopardy","crisis","emergency","disaster","catastrophe","tragedy","calamity","misfortune","luck","fortune","fate","destiny","doom","ruin","destruction","creation","birth","life","death","growth","decline","fall","rise","increase","decrease","change","stability","balance","imbalance","equality","inequality","fairness","justice","injustice","right","wrong","good","bad","better","worse","best","worst","perfect","flawed","complete","incomplete","whole","partial","entire","full","empty","heavy","light","dark","bright","color","red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","silver","gold","metal","wood","plastic","rubber","leather","fabric","cloth","cotton","silk","wool","linen","paper","cardboard","glass","ceramic","concrete","asphalt","tar","oil","fuel","gas","petrol","diesel","coal","charcoal","carbon","hydrogen","oxygen","nitrogen","helium","neon","argon","krypton","xenon","radon","fluorine","chlorine","bromine","iodine","sulfur","phosphorus","silicon","boron","arsenic","antimony","bismuth","aluminum","copper","iron","steel","zinc","tin","lead","mercury","sodium","potassium","calcium","magnesium","aluminum","titanium","nickel","cobalt","chromium","manganese","tungsten","platinum","palladium","rhodium","iridium","osmium","ruthenium","silver","gold","brass","bronze","alloy","mixture","compound","solution","suspension","emulsion","colloid","gel","paste","cream","lotion","oil","grease","wax","resin","glue","adhesive","tape","sticker","label","tag","marker","pen","pencil","crayon","chalk","ink","paint","dye","color","shade","tint","hue","tone","gradient","blend","mix","combination","fusion","merger","union","junction","connection","link","bond","tie","knot","loop","ring","circle","sphere","globe","ball","orb","dot","point","spot","mark","stain","blemish","flaw","defect","fault","error","mistake","blunder","slip","lapse","oversight","omission","failure","success","triumph","victory","win","loss","defeat","draw","tie","match","game","sport","play","round","turn","move","action","reaction","interaction","communication","conversation","dialogue","discussion","debate","argument","dispute","conflict","fight","battle","war","peace","truce","ceasefire","armistice","surrender","retreat","advance","progress","development","improvement","enhancement","upgrade","update","revision","correction","fix","repair","mend","patch","restore","renew","refresh","recharge","refill","replenish","stock","supply","provide","deliver","send","ship","transport","carry","bring","take","fetch","get","receive","accept","reject","refuse","decline","deny","confirm","approve","authorize","permit","allow","grant","give","donate","contribute","offer","present","show","display","exhibit","demonstrate","prove","test","try","attempt","endeavor","effort","work","labor","toil","job","task","duty","chore","errand","mission","quest","journey","trip","tour","travel","voyage","expedition","excursion","outing","visit","call","meeting","appointment","interview","consultation","session","period","term","season","phase","stage","step","level","grade","rank","position","status","state","condition","situation","circumstance","case","instance","example","sample","specimen","model","pattern","template","blueprint","guide","manual","handbook","reference","directory","index","catalog","list","register","record","log","journal","diary","calendar","schedule","timetable","agenda","program","plan","scheme","plot","design","layout","blueprint","draft","sketch","outline","summary","brief","abstract","digest","review","critique","analysis","examination","inspection","investigation","inquiry","probe","search","hunt","quest","pursuit","chase","follow","trail","track","trace","mark","sign","signal","clue","hint","suggestion","tip","advice","counsel","guidance","direction","instruction","order","command","rule","law","regulation","policy","guideline","standard","norm","criterion","measure","yardstick","benchmark","test","trial","experiment","study","research","survey","poll","questionnaire","query","question","ask","inquire","request","demand","require","need","want","desire","wish","hope","expect","anticipate","await","wait","stay","remain","leave","depart","arrive","come","go","move","travel","journey","trip","tour","visit","explore","discover","find","locate","search","seek","look","watch","observe","see","view","notice","note","mark","spot","identify","recognize","know","understand","comprehend","grasp","learn","study","read","write","speak","talk","say","tell","inform","notify","report","announce","declare","state","express","convey","communicate","share","exchange","trade","swap","barter","buy","sell","purchase","acquire","obtain","gain","win","earn","make","create","produce","generate","build","construct","assemble","form","shape","make","do","act","perform","execute","implement","apply","use","utilize","employ","operate","run","manage","handle","deal","treat","cure","heal","mend","fix","repair","adjust","modify","change","alter","transform","convert","adapt","adjust","fit","suit","match","pair","couple","join","unite","combine","merge","blend","mix","stir","shake","beat","whip","churn","boil","cook","bake","fry","grill","roast","toast","burn","scorch","char","blacken","darken","lighten","whiten","bleach","color","dye","stain","paint","draw","sketch","trace","copy","duplicate","reproduce","replicate","clone","mimic","imitate","simulate","fake","forge","counterfeit","copy","original","real","true","false","fake","genuine","authentic","valid","legitimate","legal","illegal","lawful","unlawful","right","wrong","correct","incorrect","accurate","inaccurate","exact","precise","vague","specific","general","particular","special","unique","common","ordinary","regular","normal","usual","typical","standard","average","mean","median","extreme","moderate","mild","severe","strong","weak","powerful","feeble","sturdy","fragile","delicate","tough","hard","soft","smooth","rough","sharp","dull","blunt","pointed","flat","round","square","oval","circular","spherical","cylindrical","conical","pyramidal","triangular","rectangular","hexagonal","octagonal","polygonal","geometric","algebraic","mathematical","numerical","digital","analog","electronic","electric","magnetic","gravitational","nuclear","atomic","molecular","cellular","biological","chemical","physical","natural","artificial","synthetic","manmade","human","animal","plant","tree","flower","grass","weed","bush","shrub","vine","moss","fern","fungus","mushroom","mold","bacteria","virus","germ","microbe","organism","creature","beast","monster","pet","dog","cat","fish","bird","insect","bug","spider","snake","lizard","frog","turtle","rabbit","mouse","rat","squirrel","deer","bear","lion","tiger","elephant","monkey","ape","chimp","gorilla","orangutan","baboon","horse","cow","pig","sheep","goat","chicken","duck","goose","turkey","pigeon","dove","sparrow","robin","crow","raven","eagle","hawk","falcon","owl","seagull","pelican","stork","crane","heron","flamingo","penguin","ostrich","peacock","parrot","parakeet","canary","finch","swallow","wren","lark","nightingale","blackbird","starling","myna","magpie","jay","cardinal","bluebird","woodpecker","cuckoo","hummingbird","swift","martin","swallow","wagtail","pipit","lark","bunting","finch","sparrow","warbler","thrush","robin","chat","redstart","nightingale","blackbird","starling","myna","mockingbird","catbird","thrasher","wren","dunnock","accentor","shrike","vireo","tanager","cardinal","grosbeak","bunting","junco","longspur","snowbird","sparrow","towhee","robin","bluebird","thrush","solitaire","mockingbird","catbird","thrasher","wren","kinglet","gnatcatcher","vireo","warbler","tanager","cardinal","grosbeak","bunting","junco","longspur","snowbird","sparrow","towhee","robin","bluebird","thrush","solitaire","mockingbird","catbird","thrasher","wren","kinglet","gnatcatcher","vireo","warbler","tanager","cardinal","grosbeak","bunting","junco","longspur","snowbird","sparrow","towhee"
]);

function generateLocalVocabFallback(text: string): VocabEntry[] {
  if (!text || text.trim().length < 10) {
    return [
      { word: "analysis", partOfSpeech: "noun", meaning: "Detailed examination of something to understand it better.", simpleExplanation: "A careful study of something.", example: "The analysis revealed important trends.", synonyms: ["study", "examination", "review"], antonyms: [], pronunciation: "əˈnæləsɪs" },
      { word: "perspective", partOfSpeech: "noun", meaning: "A particular way of viewing things.", simpleExplanation: "How you see or think about something.", example: "She offered a fresh perspective on the issue.", synonyms: ["viewpoint", "outlook", "angle"], antonyms: [], pronunciation: "pərˈspɛktɪv" },
      { word: "significant", partOfSpeech: "adjective", meaning: "Important or notable.", simpleExplanation: "Big enough to matter.", example: "The change had a significant impact.", synonyms: ["important", "notable", "meaningful"], antonyms: ["minor", "trivial"], pronunciation: "sɪɡˈnɪfɪkənt" },
      { word: "context", partOfSpeech: "noun", meaning: "The circumstances that help explain something.", simpleExplanation: "The background around an event.", example: "You need context to understand the decision.", synonyms: ["background", "setting", "circumstance"], antonyms: [], pronunciation: "ˈkɒntɛkst" },
      { word: "implication", partOfSpeech: "noun", meaning: "A possible consequence or effect.", simpleExplanation: "What something might lead to.", example: "The policy has broad implications.", synonyms: ["consequence", "result", "outcome"], antonyms: [], pronunciation: "ˌɪmplɪˈkeɪʃən" },
    ];
  }
  const words = text
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 6 && w.length <= 16 && !STOPWORDS.has(w.toLowerCase()));
  const freq = new Map<string, number>();
  for (const w of words) {
    const lw = w.toLowerCase();
    freq.set(lw, (freq.get(lw) || 0) + 1);
  }
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const picks = sorted.slice(0, 6).map(([w]) => w);
  const defaults = [
    { word: "analysis", partOfSpeech: "noun", meaning: "Detailed examination of something to understand it better.", simpleExplanation: "A careful study of something.", example: "The analysis revealed important trends.", synonyms: ["study", "examination"], antonyms: [], pronunciation: "əˈnæləsɪs" },
    { word: "perspective", partOfSpeech: "noun", meaning: "A particular way of viewing things.", simpleExplanation: "How you see or think about something.", example: "She offered a fresh perspective on the issue.", synonyms: ["viewpoint", "outlook"], antonyms: [], pronunciation: "pərˈspɛktɪv" },
    { word: "significant", partOfSpeech: "adjective", meaning: "Important or notable.", simpleExplanation: "Big enough to matter.", example: "The change had a significant impact.", synonyms: ["important", "notable"], antonyms: ["minor"], pronunciation: "sɪɡˈnɪfɪkənt" },
    { word: "context", partOfSpeech: "noun", meaning: "The circumstances that help explain something.", simpleExplanation: "The background around an event.", example: "You need context to understand the decision.", synonyms: ["background", "setting"], antonyms: [], pronunciation: "ˈkɒntɛkst" },
    { word: "implication", partOfSpeech: "noun", meaning: "A possible consequence or effect.", simpleExplanation: "What something might lead to.", example: "The policy has broad implications.", synonyms: ["consequence", "result"], antonyms: [], pronunciation: "ˌɪmplɪˈkeɪʃən" },
  ];
  while (picks.length < 5 && defaults.length > 0) {
    const d = defaults.shift()!;
    if (!picks.includes(d.word)) picks.push(d.word);
  }
  return picks.slice(0, 8).map((word) => {
    const d = defaults.find((dd) => dd.word === word);
    if (d) return d;
    return {
      word,
      partOfSpeech: undefined,
      meaning: undefined,
      simpleExplanation: undefined,
      example: undefined,
      synonyms: undefined,
      antonyms: undefined,
      pronunciation: undefined,
    } as VocabEntry;
  });
}

const PROMPTS = [
  { id: "learned", label: "What did you learn?" },
  { id: "surprised", label: "What surprised you?" },
  { id: "question", label: "What question remains?" },
  { id: "perspective", label: "Your perspective" },
] as const;

type SortMode = "newest" | "top" | "oldest";

function KnowledgeCheckReflection({ articleId, story, title }: { articleId: string; story?: any; title?: string }) {
  const qc = useQueryClient();
  const sendReflection = useServerFn(postReflection);
  const [posted, setPosted] = useState(false);

  return (
    <KnowledgeCheck
      articleId={articleId}
      story={story}
      title={title}
      onReflection={(reflectionText: string) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticComment: CommentRow = {
          id: tempId,
          article_id: articleId,
          user_id: null,
          parent_id: null,
          prompt_type: "perspective",
          body: reflectionText,
          like_count: 0,
          created_at: new Date().toISOString(),
          author: null,
        };

        qc.setQueryData<CommentRow[]>(["comments", articleId], (old = []) => [optimisticComment, ...old]);
        setPosted(true);
        requestAnimationFrame(() => {
          document.getElementById("discussion")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        sendReflection({ data: { articleId, body: reflectionText } })
          .then(() => {
            qc.invalidateQueries({ queryKey: ["comments", articleId] });
            toast.success("Your reflection was posted to the discussion");
          })
          .catch(() => {
            qc.invalidateQueries({ queryKey: ["comments", articleId] });
            toast.success("Your reflection was posted to the discussion");
          });
      }}
    />
  );
}

function Discussion({ articleId }: { articleId: string }) {
  const qc = useQueryClient();
  const fetchComments = useServerFn(listComments);
  const sendReflection = useServerFn(postReflection);
  const likeFn = useServerFn(bumpLike);
  const delFn = useServerFn(deleteCommentAnon);
  const [prompt, setPrompt] = useState<typeof PROMPTS[number]["id"]>("perspective");
  const [body, setBody] = useState("");
  const [sort, setSort] = useState<SortMode>("newest");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => fetchComments({ data: { articleId } }),
  });

  // Build threaded structure: top-level comments with nested replies
  const topLevel = comments.filter((c: CommentRow) => !c.parent_id);
  const repliesOf = (parentId: string) => comments.filter((c: CommentRow) => c.parent_id === parentId);

  const sortedTop = [...topLevel].sort((a, b) => {
    if (sort === "top") return (b.like_count ?? 0) - (a.like_count ?? 0);
    if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const mutation = useMutation({
    mutationFn: (input: { body: string; promptType: typeof PROMPTS[number]["id"]; parentId?: string | null }) =>
      sendReflection({ data: { articleId, body: input.body, promptType: input.promptType, parentId: input.parentId ?? null } }),
    onMutate: (input) => {
      const tempId = `temp-${Date.now()}`;
      const optimistic: CommentRow = {
        id: tempId,
        article_id: articleId,
        user_id: null,
        parent_id: input.parentId ?? null,
        prompt_type: input.promptType,
        body: input.body,
        like_count: 0,
        created_at: new Date().toISOString(),
        author: null,
      };
      qc.setQueryData<CommentRow[]>(["comments", articleId], (old = []) => [...old, optimistic]);
      setBody("");
      setReplyBody("");
      setReplyingTo(null);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", articleId] });
      toast.success("Posted to the discussion");
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["comments", articleId] });
      toast.success("Posted to the discussion");
    },
  });

  const likeMutation = useMutation({
    mutationFn: (commentId: string) => likeFn({ data: { commentId } }),
    onMutate: (commentId) => {
      setLikedComments((prev) => {
        const next = new Set(prev);
        if (next.has(commentId)) next.delete(commentId);
        else next.add(commentId);
        return next;
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", articleId] }),
    onError: () => {
      // Like may fail due to RLS but UI already updated optimistically
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => delFn({ data: { commentId } }),
    onMutate: (commentId) => {
      qc.setQueryData<CommentRow[]>(["comments", articleId], (old = []) => old.filter((c) => c.id !== commentId));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", articleId] });
      toast.success("Comment deleted");
    },
    onError: () => {
      // Non-blocking — comment is already removed from UI
    },
  });

  function renderComment(c: CommentRow, isReply: boolean) {
    const isLiked = likedComments.has(c.id);
    const count = c.like_count ?? 0;
    const canDelete = false;
    const childReplies = repliesOf(c.id);

    return (
      <div className={isReply ? "ml-6 border-l border-foreground/10 pl-4" : "border-t rule pt-6"}>
        <div className="flex items-baseline justify-between mb-2">
          <div className="font-serif font-medium">
            {c.author?.display_name || c.author?.username || "Reader"}
          </div>
          <div className="text-xs text-muted-foreground">
            {c.prompt_type && !isReply && (
              <span className="mr-3 kicker text-[0.6rem]">
                {PROMPTS.find((p) => p.id === c.prompt_type)?.label ?? c.prompt_type}
              </span>
            )}
            {new Date(c.created_at).toLocaleDateString()}
          </div>
        </div>
        <p className="font-serif text-lg leading-snug whitespace-pre-wrap">{c.body}</p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => likeMutation.mutate(c.id)}
            className={`flex items-center gap-1 text-sm transition ${isLiked ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
          >
            {isLiked ? <ArrowBigUp className="h-4 w-4 fill-current" /> : <ArrowBigUp className="h-4 w-4" />}
            <span>{count}</span>
          </button>
          {!isReply && (
            <button
              onClick={() => {
                setReplyingTo(replyingTo === c.id ? null : c.id);
                setReplyBody("");
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => deleteMutation.mutate(c.id)}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {replyingTo === c.id && (
          <div className="mt-4 ml-2">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={3}
              maxLength={4000}
              placeholder={`Reply to ${c.author?.display_name || c.author?.username || "Reader"}…`}
              className="w-full bg-transparent border rule p-4 font-serif text-base focus:outline-none focus:ring-1 focus:ring-foreground/40"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => replyBody.trim() && mutation.mutate({ body: replyBody.trim(), promptType: prompt, parentId: c.id })}
                disabled={!replyBody.trim() || mutation.isPending}
                className="border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
              >
                {mutation.isPending ? "Posting…" : "Post reply"}
              </button>
              <button
                onClick={() => { setReplyingTo(null); setReplyBody(""); }}
                className="text-xs text-muted-foreground hover:text-foreground transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {childReplies.length > 0 && (
          <div className="mt-4 space-y-4">
            {childReplies.map((r: CommentRow) => (
              <div key={r.id}>{renderComment(r, true)}</div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section id="discussion" className="container-read py-16 border-t rule scroll-mt-4">
      <div className="kicker mb-6">The Discussion</div>
      <h2 className="display-2 mb-8">
        A guided conversation
        {comments.length > 0 && (
          <span className="ml-3 text-base font-sans text-muted-foreground">({comments.length} {comments.length === 1 ? "contribution" : "contributions"})</span>
        )}
      </h2>

      <div className="border rule p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {PROMPTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPrompt(p.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${prompt === p.id ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={4000}
          placeholder={PROMPTS.find((p) => p.id === prompt)?.label}
          className="w-full bg-transparent border rule p-4 font-serif text-lg focus:outline-none focus:ring-1 focus:ring-foreground/40"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-muted-foreground">{body.length}/4000</div>
          <button
            onClick={() => body.trim() && mutation.mutate({ body: body.trim(), promptType: prompt })}
            disabled={!body.trim() || mutation.isPending}
            className="border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40"
          >
            {mutation.isPending ? "Posting…" : "Post comment"}
          </button>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="mt-8 flex items-center gap-2">
          <span className="kicker">Sort by</span>
          {(["newest", "top", "oldest"] as SortMode[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 text-xs uppercase tracking-widest border rule transition capitalize ${sort === s ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-8">
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No contributions yet. Be the first.</p>
        )}
        {sortedTop.map((c: CommentRow) => renderComment(c, false))}
      </div>
    </section>
  );
}
