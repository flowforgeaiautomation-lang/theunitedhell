import { i as useQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { r as listMyBookmarks } from "./interactions.functions-CR9ZHLP9.mjs";
import { t as ArticleCard } from "./article-card-Cy55uR6v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookmarks-CYUodc5d.js
var import_jsx_runtime = require_jsx_runtime();
function BookmarksPage() {
	const fn = useServerFn(listMyBookmarks);
	const q = useQuery({
		queryKey: ["my-bookmarks"],
		queryFn: () => fn()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b rule pb-6 mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker",
						children: "Your collection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "display-1 mt-3",
						children: "My Library."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek mt-3",
						children: "Everything you've saved, in one place."
					})
				]
			}),
			q.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "dek",
				children: "Loading…"
			}),
			q.data && q.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "dek",
				children: "Nothing saved yet. Open any story and tap Save."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-12 md:grid-cols-2 lg:grid-cols-3",
				children: q.data?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
					article: a,
					variant: "default"
				}, a.id))
			})
		]
	});
}
//#endregion
export { BookmarksPage as component };
