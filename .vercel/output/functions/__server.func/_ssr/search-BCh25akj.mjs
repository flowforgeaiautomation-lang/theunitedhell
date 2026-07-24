import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, n as queryOptions, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { a as categoryLabel, t as CATEGORIES } from "./categories-BEROsZZ5.mjs";
import { a as listArticles, s as searchArticles } from "./articles.functions-Cpc-KRJX.mjs";
import { t as ArticleCard } from "./article-card-Cy55uR6v.mjs";
import { C as Search, r as X, x as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { t as Route } from "./search-0Y-1TuLL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-BCh25akj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COUNTRY_LABELS = {
	IN: "India",
	US: "United States",
	GB: "United Kingdom",
	CA: "Canada",
	AU: "Australia",
	CN: "China",
	JP: "Japan",
	BR: "Brazil",
	FR: "France",
	DE: "Germany",
	AE: "UAE",
	SG: "Singapore",
	ZA: "South Africa"
};
function SearchPage() {
	const initial = Route.useSearch().q ?? "";
	const [q, setQ] = (0, import_react.useState)(initial);
	const [submitted, setSubmitted] = (0, import_react.useState)(initial);
	const [category, setCategory] = (0, import_react.useState)(void 0);
	const [country, setCountry] = (0, import_react.useState)(void 0);
	const [sort, setSort] = (0, import_react.useState)("recent");
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setQ(initial);
		setSubmitted(initial);
	}, [initial]);
	const searchFn = useServerFn(searchArticles);
	const listFn = useServerFn(listArticles);
	const isSearching = !!submitted.trim();
	const query = useQuery(queryOptions({
		queryKey: [
			"search",
			submitted,
			category,
			country,
			sort
		],
		queryFn: () => {
			if (isSearching) return searchFn({ data: { q: submitted } });
			return listFn({ data: {
				limit: 36,
				category,
				country,
				sort
			} });
		}
	}));
	const results = query.data ?? [];
	const displayed = isSearching ? category ? results.filter((a) => a.category === category) : results : results;
	function reset() {
		setCategory(void 0);
		setCountry(void 0);
		setSort("recent");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-read py-10 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center border-b rule pb-10 mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "Search the archive"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-3",
					children: "Find a story."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					setSubmitted(q.trim());
				},
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Topics, people, places, technologies…",
					className: "w-full bg-transparent border-b-2 border-foreground pl-10 pr-4 py-4 text-xl font-serif focus:outline-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setShowFilters(!showFilters),
					className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-4 w-4" }), " Filters"]
				}), (category || country || sort !== "recent") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: reset,
					className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" }), " Clear filters"]
				})]
			}),
			showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border rule p-5 rounded-lg space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker mb-3",
						children: "Topic"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCategory(void 0),
							className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${!category ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`,
							children: "All"
						}), CATEGORIES.filter((c) => c.slug !== "all").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCategory(c.slug),
							className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${category === c.slug ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`,
							children: c.label
						}, c.slug))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker mb-3",
						children: "Country"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCountry(void 0),
							className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${!country ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`,
							children: "All"
						}), Object.entries(COUNTRY_LABELS).map(([code, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCountry(code),
							className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${country === code ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`,
							children: label
						}, code))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker mb-3",
						children: "Sort by"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							{
								id: "recent",
								label: "Most Recent"
							},
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
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSort(s.id),
							className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${sort === s.id ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`,
							children: s.label
						}, s.id))
					})] })
				]
			}),
			(submitted || category || country) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "kicker mb-6",
						children: [submitted ? `Results for "${submitted}"` : category ? categoryLabel(category) : "All stories", displayed.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-muted-foreground/60",
							children: [
								"(",
								displayed.length,
								")"
							]
						})]
					}),
					query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek",
						children: "Searching…"
					}),
					query.data && displayed.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek",
						children: "No matches. Try different keywords or filters."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-10 sm:grid-cols-2",
						children: displayed.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
							article: a,
							variant: "default"
						}, a.id))
					})
				]
			}),
			!submitted && !category && !country && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker mb-6",
						children: "Trending now"
					}),
					query.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek",
						children: "Loading…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-10 sm:grid-cols-2",
						children: displayed.slice(0, 6).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
							article: a,
							variant: "default"
						}, a.id))
					})
				]
			})
		]
	});
}
//#endregion
export { SearchPage as component };
