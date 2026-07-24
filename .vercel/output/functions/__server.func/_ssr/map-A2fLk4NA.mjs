import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as COUNTRIES } from "./categories-BEROsZZ5.mjs";
import { a as listArticles } from "./articles.functions-BffoZYxd.mjs";
import { t as ArticleCard } from "./article-card-Cy55uR6v.mjs";
import { t as statsQ } from "./map-BXBoWNfY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-A2fLk4NA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MapPage() {
	const { data: stats } = useSuspenseQuery(statsQ);
	const [active, setActive] = (0, import_react.useState)(void 0);
	const ordered = Object.entries(stats).sort((a, b) => b[1] - a[1]);
	const q = useQuery({
		queryKey: ["country-articles", active],
		queryFn: () => listArticles({ data: {
			country: active,
			limit: 12
		} }),
		enabled: !!active
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b rule pb-6 mb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "World Exploration"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-3",
					children: "The Atlas of Discovery."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek mt-3 max-w-2xl",
					children: "Click a country to read what's happening there — the science, the wildlife, the architecture, the people."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "lg:col-span-4 border-r rule pr-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker mb-4",
					children: "Countries in this edition"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y rule",
					children: ordered.map(([cc, n]) => {
						const meta = COUNTRIES[cc] ?? {
							name: cc,
							flag: "🏳"
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActive(cc),
							className: `w-full text-left py-3 flex items-center justify-between gap-3 hover:opacity-70 ${active === cc ? "font-semibold" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl",
									children: meta.flag
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif",
									children: meta.name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground tabular-nums",
								children: n
							})]
						}) }, cc);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lg:col-span-8",
				children: [!active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker",
						children: "Select a country"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek mt-4 max-w-md mx-auto",
						children: "Every story is filed by its origin. Pick anywhere on the list to read what we've found there."
					})]
				}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-6 border-b rule pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "kicker",
							children: "Stories from"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "display-2 mt-1",
							children: [
								COUNTRIES[active]?.flag,
								" ",
								COUNTRIES[active]?.name ?? active
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/discover",
							search: { category: void 0 },
							className: "kicker hover:opacity-60",
							children: "All sections →"
						})]
					}),
					q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek",
						children: "Loading…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-10 md:grid-cols-2",
						children: q.data?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
							article: a,
							variant: "default"
						}, a.id))
					})
				] })]
			})]
		})]
	});
}
//#endregion
export { MapPage as component };
