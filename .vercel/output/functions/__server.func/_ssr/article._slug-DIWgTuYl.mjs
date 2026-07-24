import { n as queryOptions, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { F as notFound, m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as getArticleBySlug } from "./articles.functions-DAhbAunG.mjs";
import { a as SITE_URL, c as canonicalUrl, l as newsArticleJsonLd, n as SITE_LOGO, o as articleUrl, r as SITE_NAME, s as breadcrumbJsonLd } from "./seo-Bz6NKkDJ.mjs";
require_jsx_runtime();
var articleQ = (slug) => queryOptions({
	queryKey: ["article", slug],
	queryFn: () => getArticleBySlug({ data: { slug } }),
	retry: 3,
	retryDelay: 1e3,
	staleTime: 300 * 1e3,
	gcTime: 600 * 1e3
});
var $$splitNotFoundComponentImporter = () => import("./article._slug-CISl7Nw2.mjs");
var $$splitErrorComponentImporter = () => import("./article._slug-Be-q_pXx.mjs");
var $$splitComponentImporter = () => import("./article._slug-ComAY9QO.mjs");
function directSupabaseClient() {
	return createClient(process.env.SUPABASE_URL || "https://myrteqlcfwckgdokzzhg.supabase.co", process.env.SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cnRlcWxjZndja2dkb2t6emhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjE4OTgsImV4cCI6MjA5ODI5Nzg5OH0.lGAyAxmYrJAag1yONChoqV4-A1QQAkdWKxZp5IMJyII", { auth: {
		persistSession: false,
		autoRefreshToken: false,
		storage: void 0
	} });
}
var Route = createFileRoute("/article/$slug")({
	loader: async ({ context, params }) => {
		try {
			const a = await context.queryClient.ensureQueryData(articleQ(params.slug));
			if (!a) throw notFound();
			return { article: a };
		} catch (e) {
			if (e && typeof e === "object" && "status" in e && e.status === 404) throw e;
			try {
				const { data: row, error } = await directSupabaseClient().from("articles").select("*").eq("slug", params.slug).eq("is_published", true).maybeSingle();
				if (error) throw error;
				if (!row) throw notFound();
				return { article: row };
			} catch (e2) {
				if (e2 && typeof e2 === "object" && "status" in e2 && e2.status === 404) throw e2;
				console.error("[article loader] SSR fallback failed:", e2);
				return { article: null };
			}
		}
	},
	head: ({ loaderData }) => {
		const a = loaderData?.article;
		if (!a) return { meta: [{ title: "Story not found — The United Hell" }] };
		const url = articleUrl(a.slug);
		const img = a.cover_image_url || SITE_LOGO;
		return {
			meta: [
				{ title: `${a.title} — ${SITE_NAME}` },
				{
					name: "description",
					content: a.dek ?? a.title
				},
				{
					property: "og:site_name",
					content: SITE_NAME
				},
				{
					property: "og:title",
					content: a.title
				},
				{
					property: "og:description",
					content: a.dek ?? a.title
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: url
				},
				{
					property: "og:image",
					content: img
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: a.title
				},
				{
					name: "twitter:description",
					content: a.dek ?? a.title
				},
				{
					name: "twitter:image",
					content: img
				},
				{
					name: "article:published_time",
					content: a.published_at
				},
				{
					name: "article:section",
					content: a.category
				}
			],
			links: [{
				rel: "canonical",
				href: url
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify(newsArticleJsonLd(a))
			}, {
				type: "application/ld+json",
				children: JSON.stringify(breadcrumbJsonLd([
					{
						name: SITE_NAME,
						url: SITE_URL
					},
					{
						name: a.category,
						url: canonicalUrl(`/search?q=${encodeURIComponent(a.category)}`)
					},
					{
						name: a.title,
						url
					}
				]))
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { articleQ as n, Route as t };
