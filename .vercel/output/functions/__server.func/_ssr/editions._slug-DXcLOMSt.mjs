import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as canonicalUrl, r as SITE_NAME } from "./seo-Bz6NKkDJ.mjs";
import { i as getBookBySlug } from "./editions-data-C_WsOjH8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions._slug-DXcLOMSt.js
var $$splitNotFoundComponentImporter = () => import("./editions._slug-BaBW0NE4.mjs");
var $$splitComponentImporter = () => import("./editions._slug-7pxYcAjQ.mjs");
var Route = createFileRoute("/editions/$slug")({
	head: ({ params }) => {
		const book = getBookBySlug(params.slug);
		if (!book) return {
			meta: [],
			links: []
		};
		return {
			meta: [
				{ title: `${book.title} | Altair Veda` },
				{
					name: "description",
					content: book.description
				},
				{
					property: "og:site_name",
					content: SITE_NAME
				},
				{
					property: "og:title",
					content: `${book.title} — ${book.subtitle}`
				},
				{
					property: "og:description",
					content: book.description
				},
				{
					property: "og:type",
					content: "book"
				},
				{
					property: "og:url",
					content: canonicalUrl(`/editions/${book.slug}`)
				},
				{
					property: "og:image",
					content: book.coverImage
				},
				{
					name: "twitter:card",
					content: "summary_large_image"
				},
				{
					name: "twitter:title",
					content: `${book.title} | Altair Veda`
				},
				{
					name: "twitter:description",
					content: book.description
				}
			],
			links: [{
				rel: "canonical",
				href: canonicalUrl(`/editions/${book.slug}`)
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
