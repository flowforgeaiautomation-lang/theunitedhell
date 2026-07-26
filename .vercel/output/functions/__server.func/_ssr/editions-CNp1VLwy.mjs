import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Search, At as ArrowRight, C as Sparkles, D as ShoppingBag, X as Heart, at as Eye, b as Star, jt as ArrowDown, r as X } from "../_libs/lucide-react.mjs";
import { n as BOOKS, r as COLLECTIONS, t as AUTHOR } from "./editions-data-WnTS0RgW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions-CNp1VLwy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditionsPage() {
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [sortBy, setSortBy] = (0, import_react.useState)("latest");
	const [activeCollection, setActiveCollection] = (0, import_react.useState)(void 0);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [previewBook, setPreviewBook] = (0, import_react.useState)(null);
	const [favorites, setFavorites] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		try {
			const saved = localStorage.getItem("edition-favorites");
			if (saved) setFavorites(new Set(JSON.parse(saved)));
		} catch {}
	}, []);
	function toggleFavorite(slug) {
		setFavorites((prev) => {
			const next = new Set(prev);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			try {
				localStorage.setItem("edition-favorites", JSON.stringify([...next]));
			} catch {}
			return next;
		});
	}
	const filteredBooks = (0, import_react.useMemo)(() => {
		let result = [...BOOKS];
		if (activeCollection) result = result.filter((b) => b.collections.includes(activeCollection));
		if (searchTerm.trim()) {
			const q = searchTerm.toLowerCase();
			result = result.filter((b) => b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q) || b.genre.some((g) => g.toLowerCase().includes(q)) || b.keywords.some((k) => k.toLowerCase().includes(q)));
		}
		switch (sortBy) {
			case "latest":
				result.sort((a, b) => b.editionNumber - a.editionNumber);
				break;
			case "popular":
				result.sort((a, b) => a.editionNumber - b.editionNumber);
				break;
			case "title":
				result.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "az":
				result.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "za":
				result.sort((a, b) => b.title.localeCompare(a.title));
				break;
		}
		return result;
	}, [
		activeCollection,
		searchTerm,
		sortBy
	]);
	const featuredBook = BOOKS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "editions-page bg-[#090705] text-white min-h-screen relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditionsBackground, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 pointer-events-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#F4B860]/5 blur-[120px]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative text-center max-w-3xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 border border-[#E6C17D]/30 rounded-full bg-[#E6C17D]/5 backdrop-blur-sm mb-5 animate-fade-in",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-[#E6C17D]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.65rem] uppercase tracking-[0.25em] text-[#E6C17D]",
								children: "The Powerful Mind Series"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-4 animate-fade-in-up",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gradient-to-b from-[#FFF2D8] via-[#E6C17D] to-[#C49752] bg-clip-text text-transparent",
								children: "EDITIONS"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm md:text-base text-[#FFF2D8]/70 max-w-xl mx-auto leading-relaxed mb-6 animate-fade-in-up animation-delay-200",
							children: "A timeless collection of books, journals, research, art, and ideas created to inspire knowledge, curiosity, creativity, wisdom, and lifelong learning."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-3 animate-fade-in-up animation-delay-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#collection",
								className: "group inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] font-medium text-xs uppercase tracking-[0.15em] rounded-sm hover:shadow-[0_0_25px_rgba(230,193,125,0.4)] transition-all duration-500",
								children: ["Explore Collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/editions/$slug",
								params: { slug: featuredBook.slug },
								className: "inline-flex items-center gap-2 px-6 py-2.5 border border-[#E6C17D]/40 text-[#E6C17D] font-medium text-xs uppercase tracking-[0.15em] rounded-sm hover:bg-[#E6C17D]/10 transition-all duration-500",
								children: "Latest Release"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-8 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-6xl mx-auto grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/editions/$slug",
								params: { slug: featuredBook.slug },
								className: "group relative shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-2 bg-gradient-to-br from-[#F4B860]/10 to-[#C49752]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: featuredBook.coverImage,
									alt: featuredBook.title,
									className: "relative w-24 h-36 md:w-28 md:h-42 object-cover rounded-sm border border-[#E6C17D]/20 group-hover:scale-[1.03] transition-transform duration-500",
									loading: "lazy"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 mb-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 text-[#E6C17D]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]",
											children: "Featured"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/editions/$slug",
										params: { slug: featuredBook.slug },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-serif text-xl md:text-2xl font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors leading-tight",
											children: featuredBook.title
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#E6C17D]/70 font-serif italic mt-1",
										children: featuredBook.subtitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#FFF2D8]/50 mt-2 line-clamp-2",
										children: featuredBook.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2 mt-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/editions/$slug",
											params: { slug: featuredBook.slug },
											className: "inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_15px_rgba(230,193,125,0.3)] transition-all",
											children: ["Buy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3 w-3" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setPreviewBook(featuredBook),
											className: "inline-flex items-center gap-1.5 px-4 py-2 border border-[#E6C17D]/40 text-[#E6C17D] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " Sample"]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block w-px h-40 bg-gradient-to-b from-transparent via-[#E6C17D]/30 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: AUTHOR.logo,
								alt: AUTHOR.name,
								className: "w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border border-[#E6C17D]/30 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1",
										children: "The Author"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-xl font-bold text-[#FFF2D8]",
										children: AUTHOR.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-[#FFF2D8]/50 mt-1 line-clamp-2",
										children: AUTHOR.shortBio
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-serif text-sm italic text-[#E6C17D]/80 mt-2 line-clamp-1",
										children: [
											"\"",
											AUTHOR.quote,
											"\""
										]
									})
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "collection",
				className: "relative z-10 py-8 px-4 scroll-mt-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-3 items-center justify-between mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:max-w-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#E6C17D]/40" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: searchTerm,
										onChange: (e) => setSearchTerm(e.target.value),
										placeholder: "Search editions...",
										className: "w-full bg-[#0F0906] border border-[#E6C17D]/20 pl-9 pr-4 py-2 text-sm text-[#FFF2D8] placeholder:text-[#FFF2D8]/30 rounded-sm focus:border-[#E6C17D]/50 focus:outline-none transition"
									}),
									searchTerm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSearchTerm(""),
										className: "absolute right-3 top-1/2 -translate-y-1/2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 text-[#E6C17D]/40 hover:text-[#E6C17D]" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sortBy,
									onChange: (e) => setSortBy(e.target.value),
									className: "bg-[#0F0906] border border-[#E6C17D]/20 text-[0.65rem] uppercase tracking-widest text-[#FFF2D8] px-3 py-2 rounded-sm focus:outline-none focus:border-[#E6C17D]/50",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "latest",
											children: "Latest"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "popular",
											children: "Popular"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "title",
											children: "Title"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "az",
											children: "A-Z"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "za",
											children: "Z-A"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex border border-[#E6C17D]/20 rounded-sm overflow-hidden",
									children: [
										"grid",
										"shelf",
										"list"
									].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setViewMode(v),
										className: `px-2.5 py-2 text-[0.6rem] uppercase tracking-widest transition ${viewMode === v ? "bg-[#E6C17D] text-[#090705]" : "text-[#E6C17D] hover:bg-[#E6C17D]/10"}`,
										children: v
									}, v))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5 mb-6 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveCollection(void 0),
								className: `px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] border rounded-sm transition ${!activeCollection ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`,
								children: "All"
							}), COLLECTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveCollection(c === activeCollection ? void 0 : c),
								className: `px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] border rounded-sm transition ${activeCollection === c ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`,
								children: c
							}, c))]
						}),
						filteredBooks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[#FFF2D8]/40 py-12",
							children: "No editions match your search."
						}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4",
							children: filteredBooks.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompactBookCard, {
								book,
								index: i,
								isFavorite: favorites.has(book.slug),
								onFavorite: () => toggleFavorite(book.slug),
								onPreview: () => setPreviewBook(book)
							}, book.slug))
						}) : viewMode === "shelf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShelfView, {
							books: filteredBooks,
							favorites,
							onFavorite: toggleFavorite,
							onPreview: setPreviewBook
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: filteredBooks.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompactListRow, {
								book,
								index: i,
								isFavorite: favorites.has(book.slug),
								onFavorite: () => toggleFavorite(book.slug),
								onPreview: () => setPreviewBook(book)
							}, book.slug))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-8 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.65rem] uppercase tracking-[0.3em] text-[#E6C17D]",
								children: "The Series"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative overflow-x-auto pb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center gap-2 min-w-max px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E6C17D]/30 to-transparent -translate-y-1/2" }), BOOKS.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/editions/$slug",
								params: { slug: book.slug },
								className: "group relative flex flex-col items-center gap-2 z-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-[#E6C17D]/30 bg-[#0F0906] flex items-center justify-center group-hover:border-[#E6C17D] group-hover:shadow-[0_0_15px_rgba(230,193,125,0.4)] transition-all duration-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif text-lg text-[#E6C17D]",
										children: book.seriesOrder
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[0.55rem] uppercase tracking-widest text-[#FFF2D8]/50 group-hover:text-[#E6C17D] transition-colors max-w-[80px] text-center leading-tight",
									children: book.title
								})]
							}, book.slug))]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "relative font-serif text-2xl md:text-3xl font-bold text-[#FFF2D8] mb-3 leading-tight",
							children: "Begin Your Journey Toward a More Powerful Mind"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "relative text-xs text-[#FFF2D8]/50 mb-5 max-w-md mx-auto",
							children: "Every edition is an invitation to think more deeply, act more intentionally, and contribute something meaningful."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-col sm:flex-row justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#collection",
								className: "inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_25px_rgba(230,193,125,0.4)] transition-all",
								children: ["Explore Editions ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/editions/$slug",
								params: { slug: featuredBook.slug },
								className: "inline-flex items-center gap-2 px-6 py-2.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
								children: "Read Sample"
							})]
						})
					]
				})
			}),
			previewBook && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewModal, {
				book: previewBook,
				onClose: () => setPreviewBook(null)
			})
		]
	});
}
function EditionsBackground() {
	const stars = (0, import_react.useMemo)(() => Array.from({ length: 50 }, () => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 1.5 + .5,
		delay: Math.random() * 5,
		duration: Math.random() * 3 + 2
	})), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 pointer-events-none z-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-[#090705] via-[#0F0906] to-[#140B07]" }),
			stars.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full bg-[#FFF2D8]",
				style: {
					left: `${s.x}%`,
					top: `${s.y}%`,
					width: `${s.size}px`,
					height: `${s.size}px`,
					opacity: .3,
					animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`
				}
			}, i)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#C49752]/3 blur-[150px]" })
		]
	});
}
function CompactBookCard({ book, index, isFavorite, onFavorite, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative animate-fade-in-up",
		style: { animationDelay: `${index * 60}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/editions/$slug",
				params: { slug: book.slug },
				className: "block relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: book.coverImage,
						alt: book.title,
						className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						onFavorite();
					},
					className: "w-6 h-6 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all",
					"aria-label": "Favorite",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3 w-3 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						onPreview();
					},
					className: "w-6 h-6 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all",
					"aria-label": "Preview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 text-[#E6C17D]" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.5rem] uppercase tracking-[0.18em] text-[#E6C17D]/60",
						children: ["Ed. ", String(book.editionNumber).padStart(2, "0")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/editions/$slug",
						params: { slug: book.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xs font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors leading-tight line-clamp-2",
							children: book.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.6rem] text-[#FFF2D8]/40 line-clamp-1 mt-0.5",
						children: book.subtitle
					})
				]
			})
		]
	});
}
function ShelfView({ books, favorites, onFavorite, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-end justify-center gap-3 lg:gap-5 flex-wrap",
		children: books.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2 animate-fade-in-up",
			style: { animationDelay: `${i * 60}ms` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/editions/$slug",
				params: { slug: book.slug },
				className: "group relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-1 bg-gradient-to-t from-[#F4B860]/10 to-transparent opacity-0 group-hover:opacity-100 blur-lg transition-opacity rounded-sm" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative w-24 md:w-28 aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500 group-hover:-translate-y-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: book.coverImage,
							alt: book.title,
							className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
							loading: "lazy"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1 bg-gradient-to-r from-[#C49752]/30 via-[#E6C17D]/30 to-[#C49752]/30 rounded-sm" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center max-w-[100px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.5rem] uppercase tracking-widest text-[#E6C17D]/50",
						children: ["Book ", book.seriesOrder]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xs font-bold text-[#FFF2D8] leading-tight line-clamp-2",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5 justify-center mt-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onFavorite(book.slug),
							className: "w-6 h-6 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-2.5 w-2.5 ${favorites.has(book.slug) ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onPreview(book),
							className: "w-6 h-6 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-2.5 w-2.5 text-[#E6C17D]" })
						})]
					})
				]
			})]
		}, book.slug))
	});
}
function CompactListRow({ book, index, isFavorite, onFavorite, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex items-center gap-3 p-3 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50 hover:border-[#E6C17D]/40 hover:bg-[#0F0906] transition-all duration-300 animate-fade-in-up",
		style: { animationDelay: `${index * 40}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/editions/$slug",
				params: { slug: book.slug },
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: book.coverImage,
					alt: book.title,
					className: "w-12 h-18 object-cover rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition",
					loading: "lazy"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.5rem] uppercase tracking-widest text-[#E6C17D]/60",
						children: [
							"Ed. ",
							String(book.editionNumber).padStart(2, "0"),
							" · ",
							book.readingTime
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/editions/$slug",
						params: { slug: book.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-sm font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors",
							children: book.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#FFF2D8]/40 line-clamp-1",
						children: book.subtitle
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onFavorite,
					className: "w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
					"aria-label": "Favorite",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3 w-3 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onPreview,
					className: "w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
					"aria-label": "Preview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 text-[#E6C17D]" })
				})]
			})
		]
	});
}
function PreviewModal({ book, onClose }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in",
		onClick: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[#090705]/90 backdrop-blur-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative max-w-lg w-full max-h-[80vh] overflow-y-auto border border-[#E6C17D]/25 rounded-sm bg-[#0F0906] p-6 animate-scale-in",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "absolute top-3 right-3 w-8 h-8 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
				"aria-label": "Close",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 text-[#E6C17D]" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[100px_1fr] gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: book.coverImage,
					alt: book.title,
					className: "w-full aspect-[2/3] object-cover rounded-sm border border-[#E6C17D]/20"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1",
						children: ["Edition ", String(book.editionNumber).padStart(2, "0")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl font-bold text-[#FFF2D8] mb-1",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#E6C17D]/80 font-serif italic mb-3",
						children: book.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#FFF2D8]/60 leading-relaxed line-clamp-5 mb-4",
						children: book.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/editions/$slug",
							params: { slug: book.slug },
							className: "inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_15px_rgba(230,193,125,0.3)] transition-all",
							children: "Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: book.amazonLink,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1.5 px-4 py-2 border border-[#E6C17D]/40 text-[#E6C17D] text-[0.65rem] font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
							children: "Buy"
						})]
					})
				] })]
			})]
		})]
	});
}
//#endregion
export { EditionsPage as component };
