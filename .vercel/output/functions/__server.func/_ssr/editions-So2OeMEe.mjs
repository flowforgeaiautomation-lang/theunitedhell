import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Search, At as ArrowRight, C as Sparkles, D as ShoppingBag, X as Heart, at as Eye, b as Star, gt as ChevronRight, jt as ArrowDown, r as X } from "../_libs/lucide-react.mjs";
import { n as BOOKS, r as COLLECTIONS, t as AUTHOR } from "./editions-data-Y6lVczm9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions-So2OeMEe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditionsPage() {
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [sortBy, setSortBy] = (0, import_react.useState)("latest");
	const [activeCollection, setActiveCollection] = (0, import_react.useState)(void 0);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [previewBook, setPreviewBook] = (0, import_react.useState)(null);
	const [favorites, setFavorites] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [scrollY, setScrollY] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrollY(window.scrollY);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
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
			case "publication":
				result.sort((a, b) => a.publicationDate.kindle.localeCompare(b.publicationDate.kindle));
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditionsBackground, { scrollY }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-20 z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 pointer-events-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#F4B860]/5 blur-[120px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[#C49752]/5 blur-[100px]" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative text-center max-w-4xl mx-auto",
						style: { transform: `translateY(${scrollY * .15}px)` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 px-4 py-1.5 border border-[#E6C17D]/30 rounded-full bg-[#E6C17D]/5 backdrop-blur-sm mb-8 animate-fade-in",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-[#E6C17D]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[0.7rem] uppercase tracking-[0.25em] text-[#E6C17D]",
									children: "The Powerful Mind Series"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.95] mb-6 animate-fade-in-up",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "bg-gradient-to-b from-[#FFF2D8] via-[#E6C17D] to-[#C49752] bg-clip-text text-transparent",
									children: "EDITIONS"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base sm:text-lg md:text-xl text-[#FFF2D8]/70 max-w-2xl mx-auto leading-relaxed mb-10 font-sans animate-fade-in-up animation-delay-200",
								children: "A timeless collection of books, journals, research, art, and ideas created to inspire knowledge, curiosity, creativity, wisdom, and lifelong learning."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#collection",
									className: "group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] font-medium text-sm uppercase tracking-[0.15em] rounded-sm hover:shadow-[0_0_30px_rgba(230,193,125,0.4)] transition-all duration-500",
									children: ["Explore Collection", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-4 w-4 group-hover:translate-y-0.5 transition-transform" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/editions/$slug",
									params: { slug: featuredBook.slug },
									className: "inline-flex items-center gap-2 px-8 py-3.5 border border-[#E6C17D]/40 text-[#E6C17D] font-medium text-sm uppercase tracking-[0.15em] rounded-sm hover:bg-[#E6C17D]/10 transition-all duration-500",
									children: "Latest Release"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-5 w-5 text-[#E6C17D]/50" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-20 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-6xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-12",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[#E6C17D]/40 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]",
								children: "Featured Edition"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-gradient-to-r from-transparent via-[#E6C17D]/40 to-transparent" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-2 gap-12 lg:gap-20 items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 bg-gradient-to-br from-[#F4B860]/10 to-[#C49752]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[2/3] max-w-sm mx-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-sm shadow-2xl shadow-[#F4B860]/10 group-hover:shadow-[#F4B860]/30 transition-shadow duration-700" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: featuredBook.coverImage,
										alt: featuredBook.title,
										className: "relative w-full h-full object-cover rounded-sm border border-[#E6C17D]/20 group-hover:scale-[1.02] transition-transform duration-700",
										loading: "lazy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-sm bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 border border-[#E6C17D]/30 rounded-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 text-[#E6C17D]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[0.65rem] uppercase tracking-[0.2em] text-[#E6C17D]",
										children: ["Edition ", String(featuredBook.editionNumber).padStart(2, "0")]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-4xl md:text-5xl font-bold leading-tight text-[#FFF2D8]",
									children: featuredBook.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg text-[#E6C17D]/80 font-serif italic",
									children: featuredBook.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#FFF2D8]/60 leading-relaxed line-clamp-4",
									children: featuredBook.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-3 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/editions/$slug",
											params: { slug: featuredBook.slug },
											className: "inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(230,193,125,0.3)] transition-all",
											children: ["Buy Now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3.5 w-3.5" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/editions/$slug",
											params: { slug: featuredBook.slug },
											className: "inline-flex items-center gap-2 px-6 py-3 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Preview"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setPreviewBook(featuredBook),
											className: "inline-flex items-center gap-2 px-6 py-3 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
											children: "Read Sample"
										})
									]
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "collection",
				className: "relative z-10 py-20 px-4 scroll-mt-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center mb-16",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]",
											children: "The Collection"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-4xl md:text-5xl font-bold text-[#FFF2D8]",
									children: "Every Edition"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[#FFF2D8]/50 mt-4 max-w-xl mx-auto",
									children: "Explore every masterpiece in the Powerful Mind Series."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col lg:flex-row gap-4 items-center justify-between mb-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full lg:max-w-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E6C17D]/40" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: searchTerm,
										onChange: (e) => setSearchTerm(e.target.value),
										placeholder: "Search editions...",
										className: "w-full bg-[#0F0906] border border-[#E6C17D]/20 pl-10 pr-4 py-2.5 text-sm text-[#FFF2D8] placeholder:text-[#FFF2D8]/30 rounded-sm focus:border-[#E6C17D]/50 focus:outline-none transition"
									}),
									searchTerm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSearchTerm(""),
										className: "absolute right-3 top-1/2 -translate-y-1/2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-[#E6C17D]/40 hover:text-[#E6C17D]" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: sortBy,
									onChange: (e) => setSortBy(e.target.value),
									className: "bg-[#0F0906] border border-[#E6C17D]/20 text-xs uppercase tracking-widest text-[#FFF2D8] px-3 py-2.5 rounded-sm focus:outline-none focus:border-[#E6C17D]/50",
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
											value: "publication",
											children: "Publication"
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
										className: `px-3 py-2.5 text-xs uppercase tracking-widest transition ${viewMode === v ? "bg-[#E6C17D] text-[#090705]" : "text-[#E6C17D] hover:bg-[#E6C17D]/10"}`,
										children: v
									}, v))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 mb-12 justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveCollection(void 0),
								className: `px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] border rounded-sm transition ${!activeCollection ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`,
								children: "All"
							}), COLLECTIONS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveCollection(c === activeCollection ? void 0 : c),
								className: `px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.18em] border rounded-sm transition ${activeCollection === c ? "bg-[#E6C17D] text-[#090705] border-[#E6C17D]" : "border-[#E6C17D]/20 text-[#E6C17D] hover:bg-[#E6C17D]/10"}`,
								children: c
							}, c))]
						}),
						filteredBooks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-center text-[#FFF2D8]/40 py-20",
							children: "No editions match your search."
						}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8",
							children: filteredBooks.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, {
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
							className: "space-y-4",
							children: filteredBooks.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookListRow, {
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
				className: "relative z-10 py-20 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]",
									children: "Inside the Series"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-4xl md:text-5xl font-bold text-[#FFF2D8]",
							children: "The Powerful Mind Series"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#E6C17D]/40 to-transparent -translate-x-1/2 hidden md:block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-12",
							children: BOOKS.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `relative flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block flex-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E6C17D] shadow-[0_0_15px_rgba(230,193,125,0.5)] hidden md:block z-10" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 group",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/editions/$slug",
											params: { slug: book.slug },
											className: "block",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-4 p-5 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50 backdrop-blur-sm hover:border-[#E6C17D]/40 hover:bg-[#0F0906] transition-all duration-500",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: book.coverImage,
														alt: book.title,
														className: "w-16 h-24 object-cover rounded-sm border border-[#E6C17D]/10",
														loading: "lazy"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex-1 min-w-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1",
																children: ["Book ", book.seriesOrder]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
																className: "font-serif text-lg font-bold text-[#FFF2D8] truncate group-hover:text-[#E6C17D] transition-colors",
																children: book.title
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-[#FFF2D8]/50 mt-1 line-clamp-2",
																children: book.subtitle
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-[#E6C17D]/40 group-hover:text-[#E6C17D] group-hover:translate-x-1 transition-all shrink-0 mt-1" })
												]
											})
										})
									})
								]
							}, book.slug))
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-20 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-4xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#E6C17D]/40" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[0.7rem] uppercase tracking-[0.3em] text-[#E6C17D]",
									children: "Meet the Author"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#E6C17D]/40" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative inline-block mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-6 bg-gradient-to-br from-[#F4B860]/10 to-[#C49752]/10 blur-2xl rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: AUTHOR.logo,
								alt: AUTHOR.name,
								className: "relative w-32 h-32 object-contain rounded-full border border-[#E6C17D]/30 mx-auto"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-4xl md:text-5xl font-bold text-[#FFF2D8] mb-6",
							children: AUTHOR.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base text-[#FFF2D8]/60 leading-relaxed max-w-2xl mx-auto mb-8",
							children: AUTHOR.shortBio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative max-w-3xl mx-auto p-8 border border-[#E6C17D]/20 rounded-sm bg-[#0F0906]/50 backdrop-blur-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-[#090705]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-[#E6C17D]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-serif text-lg md:text-xl italic text-[#E6C17D]/90 leading-relaxed",
								children: [
									"\"",
									AUTHOR.quote,
									"\""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap justify-center gap-2",
							children: AUTHOR.topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-3 py-1 text-[0.6rem] uppercase tracking-[0.15em] border border-[#E6C17D]/15 text-[#E6C17D]/60 rounded-sm",
								children: t
							}, t))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-10 py-24 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center pointer-events-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-[500px] h-[500px] rounded-full bg-[#F4B860]/5 blur-[120px]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "relative font-serif text-3xl md:text-5xl font-bold text-[#FFF2D8] mb-6 leading-tight",
							children: [
								"Begin Your Journey Toward",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"a More Powerful Mind"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "relative text-sm text-[#FFF2D8]/50 mb-10 max-w-xl mx-auto",
							children: "Every edition is an invitation to think more deeply, act more intentionally, and contribute something meaningful."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex flex-col sm:flex-row justify-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#collection",
								className: "inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_30px_rgba(230,193,125,0.4)] transition-all",
								children: ["Explore Editions ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/editions/$slug",
								params: { slug: featuredBook.slug },
								className: "inline-flex items-center gap-2 px-8 py-3.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
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
function EditionsBackground({ scrollY }) {
	const stars = (0, import_react.useMemo)(() => Array.from({ length: 80 }, () => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 2 + .5,
		delay: Math.random() * 5,
		duration: Math.random() * 3 + 2
	})), []);
	const particles = (0, import_react.useMemo)(() => Array.from({ length: 25 }, () => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 3 + 1,
		delay: Math.random() * 10,
		duration: Math.random() * 8 + 6
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
					opacity: .4,
					animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`
				}
			}, i)),
			particles.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full bg-[#F4B860]/30",
				style: {
					left: `${p.x}%`,
					top: `${p.y}%`,
					width: `${p.size}px`,
					height: `${p.size}px`,
					animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`
				}
			}, `p-${i}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#C49752]/3 blur-[150px]",
				style: { transform: `translate(-50%, ${scrollY * .1}px)` }
			})
		]
	});
}
function BookCard({ book, index, isFavorite, onFavorite, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative animate-fade-in-up",
		style: { animationDelay: `${index * 80}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-2 bg-gradient-to-br from-[#F4B860]/10 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 rounded-sm" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/editions/$slug",
				params: { slug: book.slug },
				className: "block relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: book.coverImage,
							alt: book.title,
							className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700",
							loading: "lazy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#E6C17D]/5 to-transparent pointer-events-none" })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						onFavorite();
					},
					className: "w-8 h-8 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all",
					"aria-label": "Add to favorites",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						onPreview();
					},
					className: "w-8 h-8 flex items-center justify-center rounded-full bg-[#090705]/80 backdrop-blur-sm border border-[#E6C17D]/20 hover:bg-[#E6C17D] hover:text-[#090705] transition-all",
					"aria-label": "Quick preview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-[#E6C17D]" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.55rem] uppercase tracking-[0.2em] text-[#E6C17D]/60",
						children: [
							"Edition ",
							String(book.editionNumber).padStart(2, "0"),
							" · ",
							book.series
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/editions/$slug",
						params: { slug: book.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-sm font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors leading-tight",
							children: book.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.7rem] text-[#FFF2D8]/40 line-clamp-1",
						children: book.subtitle
					})
				]
			})
		]
	});
}
function ShelfView({ books, favorites, onFavorite, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-12",
		children: books.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-center gap-2 lg:gap-4 flex-wrap animate-fade-in-up",
			style: { animationDelay: `${i * 80}ms` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/editions/$slug",
				params: { slug: book.slug },
				className: "group relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-2 bg-gradient-to-t from-[#F4B860]/10 to-transparent opacity-0 group-hover:opacity-100 blur-lg transition-opacity rounded-sm" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative w-28 md:w-36 lg:w-44 aspect-[2/3] overflow-hidden rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition-all duration-500 group-hover:-translate-y-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: book.coverImage,
							alt: book.title,
							className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700",
							loading: "lazy"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 bg-gradient-to-r from-[#C49752]/30 via-[#E6C17D]/30 to-[#C49752]/30 rounded-sm" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1",
						children: ["Book ", book.seriesOrder]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg font-bold text-[#FFF2D8]",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#FFF2D8]/50 mt-1",
						children: book.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onFavorite(book.slug),
							className: "w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3 w-3 ${favorites.has(book.slug) ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => onPreview(book),
							className: "w-7 h-7 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 text-[#E6C17D]" })
						})]
					})
				]
			})]
		}, book.slug))
	});
}
function BookListRow({ book, index, isFavorite, onFavorite, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex items-center gap-6 p-5 border border-[#E6C17D]/15 rounded-sm bg-[#0F0906]/50 backdrop-blur-sm hover:border-[#E6C17D]/40 hover:bg-[#0F0906] transition-all duration-500 animate-fade-in-up",
		style: { animationDelay: `${index * 60}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/editions/$slug",
				params: { slug: book.slug },
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: book.coverImage,
					alt: book.title,
					className: "w-16 h-24 md:w-20 md:h-30 object-cover rounded-sm border border-[#E6C17D]/15 group-hover:border-[#E6C17D]/40 transition",
					loading: "lazy"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-1",
						children: [
							"Edition ",
							String(book.editionNumber).padStart(2, "0"),
							" · ",
							book.readingTime
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/editions/$slug",
						params: { slug: book.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-lg md:text-xl font-bold text-[#FFF2D8] hover:text-[#E6C17D] transition-colors",
							children: book.title
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[#FFF2D8]/50 mt-1 line-clamp-1",
						children: book.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 mt-2 flex-wrap",
						children: book.genre.slice(0, 3).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.55rem] uppercase tracking-widest text-[#E6C17D]/50 border border-[#E6C17D]/15 px-2 py-0.5 rounded-sm",
							children: g
						}, g))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onFavorite,
					className: "w-8 h-8 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
					"aria-label": "Favorite",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${isFavorite ? "fill-[#E6C17D] text-[#E6C17D]" : "text-[#E6C17D]"}` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onPreview,
					className: "w-8 h-8 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
					"aria-label": "Preview",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-[#E6C17D]" })
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
			className: "relative max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#E6C17D]/25 rounded-sm bg-[#0F0906] p-6 md:p-10 animate-scale-in",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-[#E6C17D]/20 rounded-sm hover:bg-[#E6C17D]/10 transition",
				"aria-label": "Close",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-[#E6C17D]" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-[160px_1fr] gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: book.coverImage,
					alt: book.title,
					className: "w-full max-w-[160px] aspect-[2/3] object-cover rounded-sm border border-[#E6C17D]/20 mx-auto"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[0.6rem] uppercase tracking-[0.2em] text-[#E6C17D]/60 mb-2",
						children: ["Edition ", String(book.editionNumber).padStart(2, "0")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-2xl font-bold text-[#FFF2D8] mb-2",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[#E6C17D]/80 font-serif italic mb-4",
						children: book.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-[#FFF2D8]/60 leading-relaxed line-clamp-6 mb-6",
						children: book.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/editions/$slug",
							params: { slug: book.slug },
							className: "inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E6C17D] to-[#C49752] text-[#090705] text-xs font-medium uppercase tracking-widest rounded-sm hover:shadow-[0_0_20px_rgba(230,193,125,0.3)] transition-all",
							children: "View Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: book.amazonLink,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-2 px-5 py-2.5 border border-[#E6C17D]/40 text-[#E6C17D] text-xs font-medium uppercase tracking-widest rounded-sm hover:bg-[#E6C17D]/10 transition-all",
							children: "Buy Now"
						})]
					})
				] })]
			})]
		})]
	});
}
//#endregion
export { EditionsPage as component };
