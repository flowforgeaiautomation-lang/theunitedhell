import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as curateNowPublic, t as curateNow } from "./ai.functions-V7YlHvK3.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as categoryLabel } from "./categories-CY0cJTXM.mjs";
import { t as supabase } from "./client-d8MeWTAO.mjs";
import { l as listArticles } from "./articles.functions-BLJcxY8k.mjs";
import { t as ArticleCard } from "./article-card-CT4vt32L.mjs";
import { b as Sparkles, j as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { n as ScrollToTop, t as CategoryModal } from "./ScrollToTop-WrcY-2-f.mjs";
import { t as homeQuery } from "./routes-BkB3zn-h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CZ3iqr6A.js
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
var PAGE_SIZE = 24;
var cardVariants = {
	hidden: {
		opacity: 0,
		y: 24
	},
	visible: (i) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: .4,
			delay: Math.min(i % 6, 5) * .06,
			ease: [
				.2,
				.7,
				.2,
				1
			]
		}
	})
};
function Home() {
	const search = useSearch({ from: "/" });
	const navigate = useNavigate();
	const [active, setActive] = (0, import_react.useState)(search.category);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [country, setCountry] = (0, import_react.useState)("WORLD");
	const ingestAuth = useServerFn(curateNow);
	const ingestPublic = useServerFn(curateNowPublic);
	const [articles, setArticles] = (0, import_react.useState)([]);
	const [hasMore, setHasMore] = (0, import_react.useState)(true);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const cursorRef = (0, import_react.useRef)(void 0);
	const sentinelRef = (0, import_react.useRef)(null);
	const isFetchingRef = (0, import_react.useRef)(false);
	const articlesQuery = useQuery(homeQuery(active, country === "WORLD" ? void 0 : country));
	(0, import_react.useEffect)(() => {
		const result = articlesQuery.data;
		if (!result) return;
		const items = result.items ?? (Array.isArray(result) ? result : []);
		if (items.length === 0) {
			setArticles([]);
			setHasMore(false);
			cursorRef.current = void 0;
			return;
		}
		const currentIds = new Set(articles.map((a) => a.id));
		const newIds = items.map((a) => a.id);
		if (!(newIds.length > 0 && newIds.every((id) => currentIds.has(id)))) {
			setArticles(items);
			cursorRef.current = result.nextCursor;
			setHasMore(result.hasMore ?? false);
		}
	}, [articlesQuery.data]);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
		const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
		return () => sub.subscription.unsubscribe();
	}, []);
	(0, import_react.useEffect)(() => {
		const readPrefs = () => setCountry(window.localStorage.getItem("tuh-country") || "WORLD");
		readPrefs();
		window.addEventListener("tuh-preferences", readPrefs);
		return () => window.removeEventListener("tuh-preferences", readPrefs);
	}, []);
	(0, import_react.useEffect)(() => {
		setActive(search.category);
	}, [search.category]);
	(0, import_react.useEffect)(() => {
		setArticles([]);
		setHasMore(true);
		cursorRef.current = void 0;
	}, [active, country]);
	const loadMore = (0, import_react.useCallback)(async () => {
		if (isFetchingRef.current || !hasMore) return;
		isFetchingRef.current = true;
		setLoadingMore(true);
		try {
			const result = await listArticles({ data: {
				limit: PAGE_SIZE,
				cursor: cursorRef.current,
				category: active,
				country: country === "WORLD" ? void 0 : country,
				todayOnly: true
			} });
			const newItems = result.items ?? [];
			const newHasMore = result.hasMore ?? false;
			if (newItems.length > 0) {
				setArticles((prev) => {
					const existingIds = new Set(prev.map((a) => a.id));
					const unique = newItems.filter((a) => !existingIds.has(a.id));
					return [...prev, ...unique];
				});
				cursorRef.current = result.nextCursor;
			}
			if (!newHasMore || newItems.length === 0) setHasMore(false);
		} catch {
			setHasMore(false);
		} finally {
			setLoadingMore(false);
			isFetchingRef.current = false;
		}
	}, [
		hasMore,
		active,
		country
	]);
	(0, import_react.useEffect)(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !loadingMore && hasMore) loadMore();
		}, { rootMargin: "800px" });
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [
		loadMore,
		loadingMore,
		hasMore
	]);
	async function topUp() {
		setGenerating(true);
		try {
			let result;
			if (signedIn) result = await ingestAuth({ data: {
				maxItems: 60,
				category: active
			} });
			else result = await ingestPublic({ data: {
				maxItems: 12,
				category: active
			} });
			if (result.inserted > 0) {
				toast.success(`${result.inserted} new stories added`);
				setArticles([]);
				setHasMore(true);
				cursorRef.current = void 0;
				articlesQuery.refetch();
			} else toast.message("No new stories found right now — try again in a few minutes");
		} catch (error) {
			toast.error("Could not curate stories: " + error.message);
		} finally {
			setGenerating(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-6 md:py-8",
		children: [
			country !== "WORLD" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setActive(void 0);
						navigate({
							to: "/",
							search: { category: void 0 }
						});
					},
					className: `border rule px-4 py-2 text-xs uppercase tracking-widest ${!active ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`,
					children: [COUNTRY_LABELS[country] ?? country, " news"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b rule pb-3 mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: active ? categoryLabel(active) : country === "WORLD" ? "Latest from all sections" : `Latest from ${COUNTRY_LABELS[country] ?? country}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: topUp,
					disabled: generating,
					className: "inline-flex items-center gap-2 border border-foreground px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
						" ",
						generating ? "Curating…" : "Curate more"
					]
				})]
			}),
			articles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-3",
				children: articles.map((article, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					custom: i,
					variants: cardVariants,
					initial: "hidden",
					animate: "visible",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
						article,
						variant: "default"
					})
				}, article.id))
			}),
			articles.length === 0 && !articlesQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "Nothing here yet — fetching live stories now."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: topUp,
					disabled: generating,
					className: "mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
					children: generating ? "Curating…" : "Curate now"
				})]
			}),
			articlesQuery.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-3",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pulse",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[4/3] w-full bg-foreground/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 h-4 w-1/3 bg-foreground/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-6 w-full bg-foreground/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-4 w-2/3 bg-foreground/10" })
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sentinelRef,
				className: "h-1"
			}),
			loadingMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}),
			!hasMore && articles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "You've reached the end of today's news"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/map",
					className: "kicker hover:opacity-60",
					children: "Or explore by country →"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryModal, {
				isOpen: showModal,
				onClose: () => setShowModal(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollToTop, {})
		]
	});
}
//#endregion
export { Home as component };
