import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as categoryLabel } from "./categories-BEROsZZ5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article-card-Cy55uR6v.js
var import_jsx_runtime = require_jsx_runtime();
function fallbackCoverUrl(article) {
	const label = categoryLabel(article.category);
	const title = article.title.slice(0, 90);
	const accent = [
		"#8A2D2D",
		"#25635A",
		"#6E5B18",
		"#2F5E88",
		"#5B4E7A"
	][Array.from(`${article.slug}-${article.category}`).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5];
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" role="img" aria-label="${escapeSvg(title)}"><rect width="1600" height="1000" fill="#f6f1e7"/><rect x="72" y="72" width="1456" height="856" fill="#fbf8f0" stroke="#1f1b16" stroke-width="6"/><rect x="118" y="126" width="1364" height="72" fill="${accent}"/><text x="128" y="172" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#fbf8f0" letter-spacing="4">${escapeSvg(label.toUpperCase())}</text><line x1="128" y1="292" x2="1472" y2="292" stroke="#1f1b16" stroke-width="4"/><line x1="128" y1="706" x2="1472" y2="706" stroke="#1f1b16" stroke-width="4"/><text x="128" y="402" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="#1f1b16">${escapeSvg(title.slice(0, 32))}</text><text x="128" y="500" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="#1f1b16">${escapeSvg(title.slice(32, 64))}</text><text x="128" y="598" font-family="Georgia, 'Times New Roman', serif" font-size="76" fill="#1f1b16">${escapeSvg(title.slice(64, 90))}</text><text x="128" y="812" font-family="Arial, sans-serif" font-size="28" fill="#4f4a42" letter-spacing="5">THE UNITED HELL</text></svg>`;
	return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function escapeSvg(value) {
	return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
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
				className: "md:col-span-7 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: cover,
					alt: article.title,
					loading: "eager",
					width: 800,
					height: 500,
					className: "aspect-[16/10] w-full object-cover"
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
			className: "overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: cover,
				alt: article.title,
				loading: "lazy",
				width: 600,
				height: 450,
				className: "aspect-[4/3] w-full object-cover"
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
			className: "md:col-span-5 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: cover,
				alt: article.title,
				loading: "lazy",
				width: 600,
				height: 450,
				className: "aspect-[4/3] w-full object-cover"
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: cover,
			alt: article.title,
			loading: "lazy",
			width: 80,
			height: 80,
			className: "h-20 w-20 flex-none object-cover"
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
export { fallbackCoverUrl as n, ArticleCard as t };
