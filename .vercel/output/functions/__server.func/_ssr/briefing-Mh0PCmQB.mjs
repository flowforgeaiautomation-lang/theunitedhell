import { r as useSuspenseQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as briefingQ } from "./briefing-MJAsKh5o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-Mh0PCmQB.js
var import_jsx_runtime = require_jsx_runtime();
function BriefingPage() {
	const { data: briefing } = useSuspenseQuery(briefingQ);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "text-center border-b rule pb-10 mb-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: briefing ? new Date(briefing.briefing_date).toLocaleDateString(void 0, { dateStyle: "full" }) : (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { dateStyle: "full" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-4",
					children: "Daily Briefing"
				}),
				briefing?.intro && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek mt-4 max-w-2xl mx-auto",
					children: briefing.intro
				})
			]
		}), !briefing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "dek text-center",
			children: "Today's briefing is being assembled."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Top Stories",
					items: briefing.sections.top_stories
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Discoveries",
					items: briefing.sections.discoveries
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Science",
					items: briefing.sections.science
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Success Stories",
					items: briefing.sections.success
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: "Emerging Technology",
					items: briefing.sections.tech
				}),
				briefing.sections.facts && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker mb-6 text-center",
					children: "Fascinating Facts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid gap-6 md:grid-cols-2 max-w-3xl mx-auto",
					children: briefing.sections.facts.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t rule pt-4 font-serif text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground tabular-nums mr-3",
							children: String(i + 1).padStart(2, "0")
						}), f]
					}, i))
				})] })
			]
		})]
	});
}
function Section({ title, items }) {
	if (!items || items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between border-b rule pb-3 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "display-3",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kicker",
			children: [items.length, " items"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-4",
		children: items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-5 border-b rule pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-serif text-3xl text-muted-foreground tabular-nums leading-none w-12",
				children: String(i + 1).padStart(2, "0")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/article/$slug",
				params: { slug: it.slug },
				className: "font-serif text-xl md:text-2xl hover:underline underline-offset-4",
				children: it.title
			})]
		}, it.slug))
	})] });
}
//#endregion
export { BriefingPage as component };
