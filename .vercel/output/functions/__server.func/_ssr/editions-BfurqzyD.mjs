import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as canonicalUrl, r as SITE_NAME } from "./seo-Bz6NKkDJ.mjs";
import { n as BOOKS } from "./editions-data-CBkYZZRA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions-BfurqzyD.js
var $$splitComponentImporter = () => import("./editions-Gv3nfhNV.mjs");
var Route = createFileRoute("/editions")({
	validateSearch: (s) => ({ book: typeof s.book === "string" ? s.book : void 0 }),
	head: () => ({
		meta: [
			{ title: "Editions | Altair Veda" },
			{
				name: "description",
				content: "Discover every edition of the Powerful Mind Series by Altair Veda — a collection on intelligence, focus, discipline, strategic thinking, and leadership."
			},
			{
				property: "og:site_name",
				content: SITE_NAME
			},
			{
				property: "og:title",
				content: "Editions | Altair Veda"
			},
			{
				property: "og:description",
				content: "Discover every edition of the Powerful Mind Series by Altair Veda."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				property: "og:url",
				content: canonicalUrl("/editions")
			},
			{
				property: "og:image",
				content: BOOKS[0].coverImage
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "canonical",
			href: canonicalUrl("/editions")
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
