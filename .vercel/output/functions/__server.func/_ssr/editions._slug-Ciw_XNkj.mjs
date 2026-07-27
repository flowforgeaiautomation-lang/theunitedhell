import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Et as BookOpen, Q as Globe, _t as ChevronLeft, ft as Clock, gt as ChevronRight, ot as ExternalLink, rt as FileText, u as User, xt as Calendar, yt as Check } from "../_libs/lucide-react.mjs";
import { i as getRelatedBooks, n as BOOKS, r as getBookBySlug, t as AUTHOR } from "./editions-data-DJWBoHm5.mjs";
import { t as Route } from "./editions._slug-uMUaNnnE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions._slug-Ciw_XNkj.js
var import_jsx_runtime = require_jsx_runtime();
function BookDetailPage() {
	const { slug } = Route.useParams();
	const book = getBookBySlug(slug);
	if (!book) return null;
	const related = getRelatedBooks(slug);
	const seriesIndex = book.seriesOrder - 1;
	const prevBook = seriesIndex > 0 ? BOOKS[seriesIndex - 1] : null;
	const nextBook = seriesIndex < BOOKS.length - 1 ? BOOKS[seriesIndex + 1] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-black text-white min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-white/10 px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "max-w-4xl mx-auto flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-white/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							search: { category: void 0 },
							className: "hover:text-white",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/editions",
							className: "hover:text-white",
							children: "Editions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-white/70",
							children: book.title
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-8 md:py-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto grid md:grid-cols-[200px_1fr] gap-6 md:gap-10 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto md:mx-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: book.coverImage,
							alt: book.title,
							className: "w-40 h-60 md:w-48 md:h-72 object-contain rounded-sm border border-white/15",
							loading: "eager"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
								className: "h-3 w-3 text-white/40",
								strokeWidth: 1.5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[0.6rem] uppercase tracking-[0.2em] text-white/40",
								children: [
									"Edition ",
									String(book.editionNumber).padStart(2, "0"),
									" · ",
									book.series
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-3xl md:text-4xl font-bold leading-tight mb-2",
							children: book.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-white/50 font-serif italic mb-4",
							children: book.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: AUTHOR.logo,
								alt: AUTHOR.name,
								className: "w-7 h-7 rounded-full border border-white/15 object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-white/60",
								children: ["by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/editions",
									className: "text-white hover:underline",
									children: AUTHOR.name
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/60 leading-relaxed max-w-lg mb-5",
							children: book.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 mb-5 max-w-md",
							children: [
								{
									icon: Clock,
									label: "Reading Time",
									value: book.readingTime
								},
								{
									icon: Globe,
									label: "Language",
									value: book.language
								},
								{
									icon: Calendar,
									label: "Published",
									value: book.publicationDate.kindle
								},
								{
									icon: FileText,
									label: "Pages",
									value: book.pages.kindle
								}
							].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 p-2.5 border border-white/10 rounded-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, {
									className: "h-3.5 w-3.5 text-white/40 shrink-0",
									strokeWidth: 1.5
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[0.5rem] uppercase tracking-[0.15em] text-white/30",
									children: m.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-white/70",
									children: m.value
								})] })]
							}, m.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: book.amazonLink,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-medium uppercase tracking-[0.15em] rounded-sm hover:bg-white/90 transition-all",
							children: ["Buy on Amazon ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 mt-4",
							children: book.formats.filter((f) => f.available).map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2.5 py-1 text-[0.55rem] uppercase tracking-widest border border-white/15 text-white/50 rounded-sm",
								children: f.type
							}, f.type))
						})
					] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "About the Book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-white/60 leading-relaxed whitespace-pre-line",
						children: book.fullDescription
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "What You'll Learn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid sm:grid-cols-2 gap-2",
						children: book.whatYouWillLearn.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm text-white/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "h-3.5 w-3.5 text-white/40 shrink-0 mt-0.5",
								strokeWidth: 1.5
							}), item]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "Key Topics" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: book.keyTopics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.12em] border border-white/15 text-white/50 rounded-sm hover:border-white/30 hover:text-white/70 transition",
							children: t
						}, t))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "Who Should Read This" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: book.targetAudience.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2 text-sm text-white/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
								className: "h-3.5 w-3.5 text-white/40 shrink-0 mt-0.5",
								strokeWidth: 1.5
							}), a]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "Why Read This Book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-white/60 leading-relaxed",
						children: book.whyRead
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "Table of Contents" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-1.5",
						children: book.tableOfContents.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline gap-3 border-b border-white/5 pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-base text-white/30 tabular-nums w-7",
								children: String(i + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-white/60",
								children: ch
							})]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "Reading Level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-white/60 leading-relaxed",
						children: book.readingLevel
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-8 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "The Powerful Mind Series" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: BOOKS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/editions/$slug",
							params: { slug: b.slug },
							className: `flex items-center gap-3 p-2.5 border rounded-sm transition ${b.slug === slug ? "border-white/25 bg-white/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: b.coverImage,
									alt: b.title,
									className: "w-8 h-12 object-contain rounded-sm border border-white/10",
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[0.5rem] uppercase tracking-widest text-white/40",
										children: ["Book ", b.seriesOrder]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `font-serif text-sm font-bold truncate ${b.slug === slug ? "text-white" : "text-white/70"}`,
										children: b.title
									})]
								}),
								b.slug === slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[0.5rem] uppercase tracking-widest text-white/50",
									children: "Current"
								})
							]
						}, b.slug))
					})]
				})
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-8 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, { label: "Related Editions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4",
						children: related.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/editions/$slug",
							params: { slug: b.slug },
							className: "group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: b.coverImage,
									alt: b.title,
									className: "w-full aspect-[2/3] object-contain rounded-sm border border-white/10 group-hover:border-white/25 transition",
									loading: "lazy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-xs font-bold mt-2 group-hover:text-white/90 transition text-white/70",
									children: b.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.6rem] text-white/30 truncate",
									children: b.subtitle
								})
							]
						}, b.slug))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-8 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: AUTHOR.logo,
							alt: AUTHOR.name,
							className: "w-16 h-16 rounded-full border border-white/15 object-cover mx-auto mb-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl font-bold mb-2",
							children: AUTHOR.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/50 leading-relaxed line-clamp-3 max-w-md mx-auto mb-3",
							children: AUTHOR.shortBio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/editions",
							className: "inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition",
							children: ["View Author ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-6 border-t border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto flex justify-between gap-3",
					children: [prevBook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/editions/$slug",
						params: { slug: prevBook.slug },
						className: "group flex items-center gap-2 p-3 border border-white/10 rounded-sm hover:border-white/20 transition flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4 text-white/40 group-hover:text-white transition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[0.5rem] uppercase tracking-widest text-white/30",
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-sm text-white/70 group-hover:text-white transition",
							children: prevBook.title
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }), nextBook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/editions/$slug",
						params: { slug: nextBook.slug },
						className: "group flex items-center gap-2 p-3 border border-white/10 rounded-sm hover:border-white/20 transition flex-1 text-right justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[0.5rem] uppercase tracking-widest text-white/30",
							children: "Next"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-sm text-white/70 group-hover:text-white transition",
							children: nextBook.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-white/40 group-hover:text-white transition" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" })]
				})
			})
		]
	});
}
function Divider({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[0.6rem] uppercase tracking-[0.25em] text-white/40",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-white/10" })]
	});
}
//#endregion
export { BookDetailPage as component };
