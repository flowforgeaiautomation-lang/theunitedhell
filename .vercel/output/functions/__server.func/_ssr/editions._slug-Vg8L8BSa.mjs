import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Globe, D as ShoppingBag, Et as BookOpen, O as Share2, X as Heart, _t as ChevronLeft, at as Eye, ft as Clock, gt as ChevronRight, it as FileText, u as User, wt as Bookmark, xt as Calendar, yt as Check } from "../_libs/lucide-react.mjs";
import { a as getRelatedBooks, i as getBookBySlug, n as BOOKS, t as AUTHOR } from "./editions-data-Y6lVczm9.mjs";
import { t as Route } from "./editions._slug-O_U2LRnZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions._slug-Vg8L8BSa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookDetailPage() {
	const { slug } = Route.useParams();
	const book = getBookBySlug(slug);
	const [isFavorite, setIsFavorite] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [scrollY, setScrollY] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem("edition-favorites");
			if (saved) setIsFavorite(new Set(JSON.parse(saved)).has(slug));
		} catch {}
	}, [slug]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	if (!book) return null;
	const related = getRelatedBooks(slug);
	const seriesIndex = book.seriesOrder - 1;
	const prevBook = seriesIndex > 0 ? BOOKS[seriesIndex - 1] : null;
	const nextBook = seriesIndex < BOOKS.length - 1 ? BOOKS[seriesIndex + 1] : null;
	function toggleFavorite() {
		try {
			const saved = localStorage.getItem("edition-favorites");
			const set = new Set(saved ? JSON.parse(saved) : []);
			if (set.has(slug)) set.delete(slug);
			else set.add(slug);
			localStorage.setItem("edition-favorites", JSON.stringify([...set]));
			setIsFavorite(set.has(slug));
		} catch {}
	}
	function copyLink() {
		navigator.clipboard?.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-[#090705] text-white min-h-screen relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 pointer-events-none z-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-[#090705] via-[#0F0906] to-[#140B07]" }), Array.from({ length: 40 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute rounded-full bg-[#FFF2D8]",
					style: {
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
						width: `${Math.random() * 1.5 + .5}px`,
						height: `${Math.random() * 1.5 + .5}px`,
						opacity: .3,
						animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 5}s infinite`
					}
				}, i))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 container-edit py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em] text-[#FFF2D8]/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							search: { category: void 0 },
							className: "hover:text-[#E6C17D]",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/editions",
							className: "hover:text-[#E6C17D]",
							children: "Editions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[#E6C17D]",
							children: book.title
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-6xl mx-auto grid md:grid-cols-[320px_1fr] gap-12 lg:gap-16 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative group mx-auto md:mx-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 bg-gradient-to-br from-[#F4B860]/15 to-[#C49752]/10 blur-2xl rounded-sm" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[2/3] max-w-[280px] mx-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: book.coverImage,
									alt: book.title,
									className: "w-full h-full object-cover rounded-sm border border-[#E6C17D]/25 shadow-2xl shadow-[#F4B860]/10 group-hover:scale-[1.02] transition-transform duration-700"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-sm bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-center gap-2 mt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: toggleFavorite,
										className: "w-10 h-10 flex items-center justify-center border border-[#E6C17D]/25 rounded-sm hover:bg-[#E6C17D]/10 transition",
										"aria-label": "Wishlist",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: copyLink,
										className: "w-10 h-10 flex items-center justify-center border border-[#E6C17D]/25 rounded-sm hover:bg-[#E6C17D]/10 transition",
										"aria-label": "Share",
										children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-[#E6C17D]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4 text-[#E6C17D]" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "w-10 h-10 flex items-center justify-center border border-[#E6C17D]/25 rounded-sm hover:bg-[#E6C17D]/10 transition",
										"aria-label": "Bookmark",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4 text-[#E6C17D]" })
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 px-3 py-1 border border-[#E6C17D]/30 rounded-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3 w-3 text-[#E6C17D]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]",
									children: [
										"Edition ",
										String(book.editionNumber).padStart(2, "0"),
										" · ",
										book.series
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#FFF2D8]",
								children: book.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg md:text-xl text-[#E6C17D]/80 font-serif italic",
								children: book.subtitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: AUTHOR.logo,
									alt: AUTHOR.name,
									className: "w-8 h-8 object-contain rounded-full border border-[#E6C17D]/20"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-[#FFF2D8]/70",
									children: ["by ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/editions",
										className: "text-[#E6C17D] hover:underline",
										children: AUTHOR.name
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[#FFF2D8]/60 leading-relaxed max-w-xl",
								children: book.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3 pt-4",
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
									className: "flex items-center gap-2.5 p-3 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.icon, { className: "h-4 w-4 text-[#E6C17D]/60 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[0.55rem] uppercase tracking-[0.15em] text-[#FFF2D8]/40",
										children: m.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-[#FFF2D8]/80",
										children: m.value
									})] })]
								}, m.label))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-3 pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: book.amazonLink,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_25px_rgba(230,193,125,0.35)] transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Buy on Amazon"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: book.books2ReadLink,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-2 px-7 py-3.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
										children: "Books2Read"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-2 px-7 py-3.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), " Read Sample"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 pt-2",
								children: book.formats.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-3 py-1 text-[0.6rem] uppercase tracking-widest border rounded-sm ${f.available ? "border-[#E6C17D]/30 text-[#E6C17D] bg-[#E6C17D]/5" : "border-[#FFF2D8]/10 text-[#FFF2D8]/30 line-through"}`,
									children: f.type
								}, f.type))
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-16 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "About the Book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base text-[#FFF2D8]/70 leading-relaxed whitespace-pre-line",
						children: book.fullDescription
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "What You'll Learn" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid sm:grid-cols-2 gap-3",
						children: book.whatYouWillLearn.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 text-sm text-[#FFF2D8]/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-[#E6C17D] shrink-0 mt-0.5" }), item]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "Key Topics" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: book.keyTopics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] border border-[#E6C17D]/20 text-[#E6C17D]/70 rounded-sm hover:border-[#E6C17D]/40 hover:text-[#E6C17D] transition",
							children: t
						}, t))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "Who Should Read This" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: book.targetAudience.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-3 text-sm text-[#FFF2D8]/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-[#E6C17D]/60 shrink-0 mt-0.5" }), a]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "Why Read This Book" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm md:text-base text-[#FFF2D8]/70 leading-relaxed",
						children: book.whyRead
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "Table of Contents" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-2",
						children: book.tableOfContents.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-baseline gap-4 border-b border-[#E6C17D]/10 pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-lg text-[#E6C17D]/50 tabular-nums w-8",
								children: String(i + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-[#FFF2D8]/70",
								children: ch
							})]
						}, i))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "Reading Level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[#FFF2D8]/70 leading-relaxed",
						children: book.readingLevel
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-16 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "The Powerful Mind Series" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#E6C17D]/40 via-[#E6C17D]/20 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: BOOKS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/editions/$slug",
								params: { slug: b.slug },
								className: `relative flex items-center gap-4 pl-8 pr-4 py-3 border rounded-sm transition-all duration-500 ${b.slug === slug ? "border-[#E6C17D]/40 bg-[#E6C17D]/5" : "border-[#E6C17D]/15 bg-[#0F0906]/30 hover:border-[#E6C17D]/30 hover:bg-[#0F0906]/60"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${b.slug === slug ? "bg-[#E6C17D] shadow-[0_0_10px_rgba(230,193,125,0.5)]" : "bg-[#E6C17D]/30"}` }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: b.coverImage,
										alt: b.title,
										className: "w-10 h-15 object-cover rounded-sm border border-[#E6C17D]/10",
										loading: "lazy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[0.55rem] uppercase tracking-[0.18em] text-[#E6C17D]/50",
											children: ["Book ", b.seriesOrder]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `font-serif text-sm font-bold truncate ${b.slug === slug ? "text-[#E6C17D]" : "text-[#FFF2D8]"}`,
											children: b.title
										})]
									}),
									b.slug === slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[0.55rem] uppercase tracking-widest text-[#E6C17D]",
										children: "Current"
									})
								]
							}, b.slug))
						})]
					})]
				})
			}),
			related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-16 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "Related Editions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-6",
						children: related.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/editions/$slug",
							params: { slug: b.slug },
							className: "group animate-fade-in-up",
							style: { animationDelay: `${i * 80}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: b.coverImage,
										alt: b.title,
										className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700",
										loading: "lazy"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-sm font-bold text-[#FFF2D8] mt-2 group-hover:text-[#E6C17D] transition-colors",
									children: b.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.65rem] text-[#FFF2D8]/40 line-clamp-1",
									children: b.subtitle
								})
							]
						}, b.slug))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-16 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionDivider, { label: "About the Author" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: AUTHOR.logo,
							alt: AUTHOR.name,
							className: "w-24 h-24 object-contain rounded-full border border-[#E6C17D]/25 mx-auto mb-6"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-3xl font-bold text-[#FFF2D8] mb-4",
							children: AUTHOR.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-[#FFF2D8]/60 leading-relaxed",
							children: AUTHOR.shortBio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 p-6 border border-[#E6C17D]/20 rounded-sm bg-[#0F0906]/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-serif text-lg italic text-[#E6C17D]/90",
								children: [
									"\"",
									AUTHOR.quote,
									"\""
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4 border-t border-[#E6C17D]/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto flex justify-between gap-4",
					children: [prevBook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/editions/$slug",
						params: { slug: prevBook.slug },
						className: "group flex items-center gap-3 p-4 border border-[#E6C17D]/15 rounded-sm hover:border-[#E6C17D]/40 transition flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5 text-[#E6C17D]/40 group-hover:text-[#E6C17D] transition" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[0.55rem] uppercase tracking-widest text-[#E6C17D]/50",
							children: "Previous"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-sm text-[#FFF2D8] group-hover:text-[#E6C17D] transition",
							children: prevBook.title
						})] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }), nextBook ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/editions/$slug",
						params: { slug: nextBook.slug },
						className: "group flex items-center gap-3 p-4 border border-[#E6C17D]/15 rounded-sm hover:border-[#E6C17D]/40 transition flex-1 text-right justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[0.55rem] uppercase tracking-widest text-[#E6C17D]/50",
							children: "Next"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-sm text-[#FFF2D8] group-hover:text-[#E6C17D] transition",
							children: nextBook.title
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5 text-[#E6C17D]/40 group-hover:text-[#E6C17D] transition" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" })]
				})
			})
		]
	});
}
function SectionDivider({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 mb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" })
		]
	});
}
//#endregion
export { BookDetailPage as component };
