import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";
import { ScrollToTop } from "@/components/ScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_LOGO, SITE_DESCRIPTION, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
// Translation is handled by the user's browser (Chrome/Edge "Translate page" in the ⋮ menu).

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="container-read text-center">
        <div className="kicker">Error 404</div>
        <h1 className="display-1 mt-3">This page is missing from the edition.</h1>
        <p className="dek mt-4">
          The story you're looking for may have moved or been retired. Return to today's front page.
        </p>
        <Link
          to="/"
          search={{ category: undefined }}
          className="mt-8 inline-block border border-foreground px-5 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition"
        >
          Front page
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="container-read text-center">
        <div className="kicker">Error</div>
        <h1 className="display-2 mt-3">Something went wrong</h1>
        <p className="dek mt-3">Please try refreshing the page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => reset()}
            className="border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-foreground/40 px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition"
          >
            Front page
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { name: "google-site-verification", content: "J7AZ3nQHhZDYiNmZs8E-WRFyL00uc8TiX59qq-XT_EY" },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: SITE_NAME },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: SITE_LOGO },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: SITE_LOGO },
    ],
    scripts: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3923814665808842",
        async: true,
        crossOrigin: "anonymous",
      },
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-K7HBFF1Z2L",
        async: true,
      },
      {
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-K7HBFF1Z2L');`,
      },
      {
        children: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "xhl9zzzpkb");`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(organizationJsonLd()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd()),
      },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://pagead2.googlesyndication.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function EzoicScriptLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as any).ezstandalone = (window as any).ezstandalone || { cmd: [] };
    const script = document.createElement("script");
    script.src = "https://www.ezojs.com/ezoic/sa.min.js";
    script.async = true;
    script.onload = () => {
      (window as any).ezstandalone?.cmd.push(function () {
        if ((window as any).ezstandalone) (window as any).ezstandalone.showAds();
      });
    };
    document.head.appendChild(script);
  }, []);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  // Sync document.title on client-side navigation (head meta is SSR-only)
  useEffect(() => {
    const matches = router.state.matches;
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      const route = match.route;
      if (route?.options?.head) {
        try {
          const head = route.options.head();
          if (head?.meta) {
            const titleMeta = head.meta.find((m: any) => m.title);
            if (titleMeta?.title) {
              document.title = titleMeta.title;
              break;
            }
          }
        } catch {}
      }
    }
  }, [router.state.location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <EzoicScriptLoader />
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1 page-enter">
          <Outlet />
        </main>
        <SiteFooter />
        <AccessibilitySettings />
        <ScrollToTop />
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-foreground)",
            color: "var(--color-background)",
            border: "none",
            borderRadius: "2px",
            fontFamily: "var(--font-sans)",
          },
        }}
      />
    </QueryClientProvider>
  );
}
