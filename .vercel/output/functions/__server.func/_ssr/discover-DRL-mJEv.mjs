import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as curateNowPublic, t as curateNow } from "./ai.functions-Bwdjz3uI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as categoryLabel, i as HOMEPAGE_CATEGORIES } from "./categories-BEROsZZ5.mjs";
import { t as supabase } from "./client-CcdZ4ilN.mjs";
import { a as listArticles } from "./articles.functions-DfYOMjFZ.mjs";
import { t as ArticleCard } from "./article-card-Cy55uR6v.mjs";
import { at as ArrowRight, k as LoaderCircle, t as lucide_react_exports, y as Sparkles } from "../_libs/lucide-react.mjs";
import { n as ScrollToTop, t as CategoryModal } from "./ScrollToTop-DRtZjwEu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-DRL-mJEv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getIconComponent(iconName) {
	return lucide_react_exports[iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")] || null;
}
var mainCategories = [{
	slug: "all",
	label: "All",
	icon: "grid"
}, ...HOMEPAGE_CATEGORIES.map((cat) => ({
	slug: cat.slug,
	label: cat.label,
	icon: cat.icon
}))];
function HomepageNav({ activeCategory, onCategoryChange, onExploreAllClick }) {
	const navigate = useNavigate();
	const handleCategoryClick = (slug) => {
		const categoryValue = slug === "all" ? void 0 : slug;
		if (onCategoryChange) {
			onCategoryChange(categoryValue);
			return;
		}
		navigate({
			to: "/discover",
			search: { category: categoryValue }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-8 border-b rule mb-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-edit",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 justify-center items-center",
				children: [mainCategories.map((cat) => {
					const isActive = activeCategory === (cat.slug === "all" ? void 0 : cat.slug);
					const Icon = getIconComponent(cat.icon);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleCategoryClick(cat.slug),
						className: `flex items-center gap-2 px-4 py-2 border rule transition-colors ${isActive ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`,
						children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), cat.label]
					}, cat.slug);
				}), onExploreAllClick ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onExploreAllClick,
					className: "flex items-center gap-2 px-4 py-2 border rule hover:bg-foreground hover:text-background transition",
					children: ["Explore All Fields", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/discover",
					search: { category: void 0 },
					className: "flex items-center gap-2 px-4 py-2 border rule hover:bg-foreground hover:text-background transition",
					children: ["Explore All Fields", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
				})]
			})
		})
	});
}
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
function DiscoverPage() {
	const search = useSearch({ from: "/discover" });
	const navigate = useNavigate();
	const [active, setActive] = (0, import_react.useState)(search.category);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [country, setCountry] = (0, import_react.useState)("WORLD");
	const ingestAuth = useServerFn(curateNow);
	const ingestPublic = useServerFn(curateNowPublic);
	const [articles, setArticles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const [hasMore, setHasMore] = (0, import_react.useState)(true);
	const offsetRef = (0, import_react.useRef)(0);
	const sentinelRef = (0, import_react.useRef)(null);
	const isFetchingRef = (0, import_react.useRef)(false);
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
	const fetchPage = (0, import_react.useCallback)(async (offset) => {
		return listArticles({ data: {
			limit: PAGE_SIZE,
			offset,
			category: active,
			country: country === "WORLD" ? void 0 : country
		} });
	}, [active, country]);
	const reset = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setArticles([]);
		setHasMore(true);
		offsetRef.current = 0;
		isFetchingRef.current = true;
		try {
			const data = await fetchPage(0);
			setArticles(data);
			offsetRef.current = data.length;
			if (data.length < PAGE_SIZE) setHasMore(false);
		} catch {
			setHasMore(false);
		} finally {
			setLoading(false);
			isFetchingRef.current = false;
		}
	}, [fetchPage]);
	const loadMore = (0, import_react.useCallback)(async () => {
		if (isFetchingRef.current || !hasMore) return;
		isFetchingRef.current = true;
		setLoadingMore(true);
		const offset = offsetRef.current;
		try {
			const newArticles = await fetchPage(offset);
			if (newArticles.length < PAGE_SIZE) setHasMore(false);
			if (newArticles.length > 0) {
				setArticles((prev) => {
					const existingIds = new Set(prev.map((a) => a.id));
					const unique = newArticles.filter((a) => !existingIds.has(a.id));
					return [...prev, ...unique];
				});
				offsetRef.current = offset + newArticles.length;
			} else setHasMore(false);
		} catch {
			setHasMore(false);
		} finally {
			setLoadingMore(false);
			isFetchingRef.current = false;
		}
	}, [fetchPage, hasMore]);
	(0, import_react.useEffect)(() => {
		reset();
	}, [reset]);
	(0, import_react.useEffect)(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) loadMore();
		}, { rootMargin: "800px" });
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [
		loadMore,
		loading,
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
				reset();
			} else toast.message("No new stories found right now — try again in a few minutes");
		} catch (e) {
			toast.error(e.message);
		} finally {
			setGenerating(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b rule pb-6 mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "The Discovery Engine"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-3",
					children: "Discover"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomepageNav, {
				activeCategory: active,
				onCategoryChange: (category) => {
					setActive(category);
					navigate({
						to: "/discover",
						search: { category }
					});
				},
				onExploreAllClick: () => setShowModal(true)
			}),
			country !== "WORLD" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-8 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setActive(void 0);
						navigate({
							to: "/discover",
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
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-3",
				children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-pulse",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[4/3] bg-foreground/10 mb-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-20 bg-foreground/10 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-full bg-foreground/10 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-2/3 bg-foreground/10" })
					]
				}, i))
			}),
			!loading && articles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-12 sm:grid-cols-2 lg:grid-cols-3",
				children: articles.map((article, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-fade-in",
					style: { animationDelay: `${Math.min(i % 6, 5) * 60}ms` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
						article,
						variant: "default"
					})
				}, article.id))
			}),
			!loading && articles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "Nothing here yet. Ask the AI to curate this category."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: topUp,
					className: "mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
					children: "Curate now"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sentinelRef,
				className: "h-1"
			}),
			loadingMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
			}),
			!hasMore && !loading && articles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "You've reached the end of the archive"
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
export { DiscoverPage as component };
