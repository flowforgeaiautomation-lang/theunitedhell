import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as categoryLabel } from "./categories-CY0cJTXM.mjs";
import { n as fallbackCoverUrl, t as SmartImage } from "./SmartImage-CSltlVaf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article-card-vLHOrR7y.js
var import_jsx_runtime = require_jsx_runtime();
function ArticleCard({ article, variant = "default" }) {
	if (variant === "hero") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCard, { article });
	if (variant === "compact") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompactCard, { article });
	if (variant === "wide") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WideCard, { article });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DefaultCard, { article });
}
function Meta({ article }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "kicker",
			children: categoryLabel(article.category)
		})
	});
}
function HeroCard({ article }) {
	const cover = article.cover_image_url || fallbackCoverUrl(article);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		preload: "intent",
		className: "group block hover-lift",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 md:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "md:col-span-7 relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartImage, {
					src: cover,
					alt: article.title,
					width: 800,
					height: 500,
					loading: "eager",
					aspectClass: "aspect-[16/10] w-full",
					className: "rounded-sm"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-5 flex flex-col justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, { article }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "display-1 mt-4",
						children: article.title
					}),
					article.dek && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek mt-4",
						children: article.dek
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-6 inline-block border-b border-foreground pb-0.5 text-sm font-medium w-fit",
						children: "Read the story"
					})
				]
			})]
		})
	});
}
function DefaultCard({ article }) {
	const cover = article.cover_image_url || fallbackCoverUrl(article);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		preload: "intent",
		className: "group flex flex-col hover-lift",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartImage, {
				src: cover,
				alt: article.title,
				width: 600,
				height: 450,
				loading: "eager",
				aspectClass: "w-full",
				className: "rounded-sm"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-col gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, { article }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "display-3 group-hover:underline decoration-1 underline-offset-4",
					children: article.title
				}),
				article.dek && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground line-clamp-2",
					children: article.dek
				})
			]
		})]
	});
}
function WideCard({ article }) {
	const cover = article.cover_image_url || fallbackCoverUrl(article);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		preload: "intent",
		className: "group grid gap-6 md:grid-cols-12 hover-lift border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:col-span-5 relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartImage, {
				src: cover,
				alt: article.title,
				width: 600,
				height: 450,
				loading: "eager",
				aspectClass: "w-full",
				className: "rounded-sm"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:col-span-7 flex flex-col justify-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, { article }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "display-2 mt-3",
					children: article.title
				}),
				article.dek && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek mt-3",
					children: article.dek
				})
			]
		})]
	});
}
function CompactCard({ article }) {
	const cover = article.cover_image_url || fallbackCoverUrl(article);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/article/$slug",
		params: { slug: article.slug },
		preload: "intent",
		className: "group flex gap-4 items-start border-t rule pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative h-20 w-20 flex-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartImage, {
				src: cover,
				alt: article.title,
				width: 80,
				height: 80,
				loading: "eager",
				className: "h-20 w-20 rounded-sm"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "kicker text-[0.65rem]",
				children: categoryLabel(article.category)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-serif font-medium text-base leading-snug mt-1 group-hover:underline decoration-1 underline-offset-2",
				children: article.title
			})]
		})]
	});
}
//#endregion
export { ArticleCard as t };
