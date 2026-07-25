import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as curateNowPublic, t as curateNow } from "./ai.functions-CM66LVnj.mjs";
import "../_libs/sonner.mjs";
import { a as categoryLabel, i as HOMEPAGE_CATEGORIES } from "./categories-BEROsZZ5.mjs";
import { t as supabase } from "./client-d8MeWTAO.mjs";
import { u as listArticles } from "./articles.functions-_GNHdrAL.mjs";
import { t as ArticleCard } from "./article-card-ZodrjeEE.mjs";
import { Dt as ArrowRight, H as LoaderCircle, t as lucide_react_exports } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { n as ScrollToTop, t as CategoryModal } from "./ScrollToTop-DRtZjwEu.mjs";
import { t as discoverQuery } from "./discover-26DEAiC0.mjs";
import { t as ArticleCardSkeletonGrid } from "./ArticleCardSkeleton-CFW4eCvQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-D4-T6mE4.js
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
function DiscoverPage() {
	const search = useSearch({ from: "/discover" });
	const navigate = useNavigate();
	const [active, setActive] = (0, import_react.useState)(search.category);
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	const [generating, setGenerating] = (0, import_react.useState)(false);
	const [country, setCountry] = (0, import_react.useState)("WORLD");
	useServerFn(curateNow);
	useServerFn(curateNowPublic);
	const [articles, setArticles] = (0, import_react.useState)([]);
	const [hasMore, setHasMore] = (0, import_react.useState)(true);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const cursorRef = (0, import_react.useRef)(void 0);
	const sentinelRef = (0, import_react.useRef)(null);
	const isFetchingRef = (0, import_react.useRef)(false);
	const filterKeyRef = (0, import_react.useRef)("");
	const countryParam = country === "WORLD" ? void 0 : country;
	const articlesQuery = useQuery(discoverQuery(active, countryParam));
	(0, import_react.useEffect)(() => {
		const result = articlesQuery.data;
		if (!result) return;
		setArticles(result.items ?? (Array.isArray(result) ? result : []));
		cursorRef.current = result.nextCursor;
		setHasMore(result.hasMore ?? false);
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
	const currentFilterKey = `${active ?? "all"}|${country}`;
	(0, import_react.useEffect)(() => {
		if (filterKeyRef.current !== currentFilterKey) {
			filterKeyRef.current = currentFilterKey;
			setArticles([]);
			setHasMore(true);
			cursorRef.current = void 0;
		}
	}, [currentFilterKey]);
	const loadMore = (0, import_react.useCallback)(async () => {
		if (isFetchingRef.current || !hasMore) return;
		isFetchingRef.current = true;
		setLoadingMore(true);
		try {
			const result = await listArticles({ data: {
				limit: PAGE_SIZE,
				cursor: cursorRef.current,
				category: active,
				country: countryParam
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
		countryParam
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
				initial: {
					opacity: 0,
					y: -12
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .5,
					ease: [
						.2,
						.7,
						.2,
						1
					]
				},
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/search",
					preload: "intent",
					className: "inline-flex items-center gap-2 border border-foreground px-3 py-1.5 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						xmlns: "http://www.w3.org/2000/svg",
						className: "h-3.5 w-3.5",
						viewBox: "0 0 24 24",
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "2",
						strokeLinecap: "round",
						strokeLinejoin: "round",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: "11",
							cy: "11",
							r: "8"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m21 21-4.35-4.35" })]
					}), "Search"]
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
			articles.length === 0 && !articlesQuery.isLoading && !articlesQuery.isError && articlesQuery.isFetched && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "No stories found in this category yet."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					preload: "intent",
					className: "mt-4 inline-block border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
					children: "Back to homepage"
				})]
			}),
			articlesQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "dek",
					children: ["We couldn't load stories right now. ", articlesQuery.error?.message]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => articlesQuery.refetch(),
					className: "mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
					children: "Try again"
				})]
			}),
			articlesQuery.isLoading && articles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCardSkeletonGrid, { count: 6 }),
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
