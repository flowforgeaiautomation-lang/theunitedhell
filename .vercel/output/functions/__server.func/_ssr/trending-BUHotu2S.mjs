import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, n as queryOptions, r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as listArticles } from "./articles.functions-vu6-QAgH.mjs";
import { t as ArticleCard } from "./article-card-Cy55uR6v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trending-BUHotu2S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SORTS = [
	{
		id: "trending",
		label: "Trending"
	},
	{
		id: "most_read",
		label: "Most Read"
	},
	{
		id: "most_saved",
		label: "Most Saved"
	},
	{
		id: "recent",
		label: "Most Recent"
	}
];
function TrendingPage() {
	const [sort, setSort] = (0, import_react.useState)("trending");
	const q = useSuspenseQuery(queryOptions({
		queryKey: ["trending", sort],
		queryFn: () => listArticles({ data: {
			sort,
			limit: 36
		} })
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b rule pb-6 mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "What readers are reading"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-3",
					children: "Trending now."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 mb-10",
				children: SORTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSort(s.id),
					className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${sort === s.id ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`,
					children: s.label
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-12",
				children: q.data.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 md:grid-cols-12 items-center border-b rule pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-1 font-serif text-5xl text-muted-foreground tabular-nums",
						children: String(i + 1).padStart(2, "0")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-11",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
							article: a,
							variant: "wide"
						})
					})]
				}, a.id))
			})
		]
	});
}
//#endregion
export { TrendingPage as component };
