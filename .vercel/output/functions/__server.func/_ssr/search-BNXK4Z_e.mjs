import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as listArticles } from "./articles.functions-Bi3MxIvE.mjs";
import { c as canonicalUrl, n as SITE_LOGO, r as SITE_NAME } from "./seo-Bz6NKkDJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-BNXK4Z_e.js
var $$splitComponentImporter = () => import("./search-BvL-iyj1.mjs");
var Route = createFileRoute("/search")({
	validateSearch: (s) => ({ q: typeof s.q === "string" ? s.q : "" }),
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(queryOptions({
			queryKey: [
				"search",
				"",
				void 0,
				void 0,
				"recent"
			],
			queryFn: () => listArticles({ data: { limit: 36 } })
		}));
	},
	head: () => ({
		meta: [
			{ title: "Search — The United Hell" },
			{
				name: "description",
				content: "Search across topics, places, people, and discoveries."
			},
			{
				property: "og:site_name",
				content: SITE_NAME
			},
			{
				property: "og:title",
				content: "Search — The United Hell"
			},
			{
				property: "og:description",
				content: "Search across topics, places, people, and discoveries."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: canonicalUrl("/search")
			},
			{
				property: "og:image",
				content: SITE_LOGO
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Search — The United Hell"
			},
			{
				name: "twitter:description",
				content: "Search across topics, places, people, and discoveries."
			}
		],
		links: [{
			rel: "canonical",
			href: canonicalUrl("/search")
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
