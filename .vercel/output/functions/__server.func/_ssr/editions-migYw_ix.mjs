import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as ArrowRight, Et as BookOpen, k as Search, ot as ExternalLink, r as X } from "../_libs/lucide-react.mjs";
import { n as BOOKS, t as AUTHOR } from "./editions-data-CBkYZZRA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions-migYw_ix.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditionsPage() {
	const [selectedBook, setSelectedBook] = (0, import_react.useState)(BOOKS[0]);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const filteredBooks = (0, import_react.useMemo)(() => {
		if (!searchTerm.trim()) return BOOKS;
		const q = searchTerm.toLowerCase();
		return BOOKS.filter((b) => b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.keywords.some((k) => k.toLowerCase().includes(q)) || String(b.editionNumber).includes(q));
	}, [searchTerm]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-black text-white min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-white/10 px-4 py-10 md:py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
								className: "h-3.5 w-3.5 text-white/40",
								strokeWidth: 1.5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.65rem] uppercase tracking-[0.3em] text-white/40",
								children: "The Powerful Mind Series"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1] mb-2",
							children: "Editions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/50 max-w-md mx-auto leading-relaxed",
							children: "A timeless collection of books, journals, research, art, and ideas created to inspire knowledge, curiosity, and lifelong learning."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-white/10 px-4 py-6 md:py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-5xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-[180px_1fr] gap-6 md:gap-8 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative mx-auto md:mx-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-36 h-52 md:w-44 md:h-64 relative",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: selectedBook.coverImage,
									alt: selectedBook.title,
									className: "w-full h-full object-contain rounded-sm border border-white/15 animate-fade-in",
									loading: "eager"
								}, selectedBook.slug)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-fade-in",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[0.6rem] uppercase tracking-[0.25em] text-white/40 mb-2",
									children: [
										"Edition ",
										String(selectedBook.editionNumber).padStart(2, "0"),
										" · ",
										selectedBook.series
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl md:text-3xl font-bold leading-tight mb-1",
									children: selectedBook.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-white/50 font-serif italic mb-3",
									children: selectedBook.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-white/60 leading-relaxed line-clamp-3 mb-4",
									children: selectedBook.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-3 text-[0.65rem] text-white/40 mb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedBook.publicationDate.kindle }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/20",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedBook.language }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-white/20",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedBook.readingTime })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: selectedBook.amazonLink,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-medium uppercase tracking-[0.15em] rounded-sm hover:bg-white/90 transition-all",
									children: ["Buy on Amazon ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
								})
							]
						}, selectedBook.slug)]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-4 border-b border-white/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-5xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
								className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30",
								strokeWidth: 1.5
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "Search by title, keyword, or edition number...",
								className: "w-full bg-transparent border border-white/15 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 rounded-sm focus:border-white/40 focus:outline-none transition"
							}),
							searchTerm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchTerm(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2",
								"aria-label": "Clear search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-white/30 hover:text-white" })
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.6rem] uppercase tracking-[0.25em] text-white/40",
							children: "All Editions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[0.6rem] text-white/20",
							children: [
								"(",
								filteredBooks.length,
								")"
							]
						})]
					}), filteredBooks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-white/30 py-8 text-center",
						children: "No editions match your search."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1",
						children: filteredBooks.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookRow, {
							book,
							index: i,
							isSelected: selectedBook.slug === book.slug,
							onSelect: () => setSelectedBook(book)
						}, book.slug))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-t border-white/10 px-4 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: AUTHOR.logo,
							alt: AUTHOR.name,
							className: "w-16 h-16 rounded-full border border-white/15 object-cover mb-3"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-xl font-bold mb-1",
							children: AUTHOR.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-white/50 leading-relaxed line-clamp-3 max-w-md mb-3",
							children: AUTHOR.shortBio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/editions/$slug",
							params: { slug: BOOKS[0].slug },
							className: "inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-white/60 hover:text-white transition",
							children: ["View Author ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
						})
					]
				})
			})
		]
	});
}
function BookRow({ book, index, isSelected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick: onSelect,
		className: `group flex items-center gap-4 p-3 border rounded-sm cursor-pointer transition-all duration-300 animate-fade-in ${isSelected ? "border-white/30 bg-white/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"}`,
		style: { animationDelay: `${index * 40}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: book.coverImage,
				alt: book.title,
				className: "w-12 h-18 md:w-14 md:h-21 object-contain rounded-sm border border-white/10 shrink-0",
				loading: "lazy",
				style: { aspectRatio: "2/3" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.55rem] uppercase tracking-[0.2em] text-white/40 tabular-nums",
								children: String(book.editionNumber).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/15",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.55rem] text-white/30",
								children: book.publicationDate.kindle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white/15",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.55rem] text-white/30",
								children: book.language
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-sm md:text-base font-bold leading-tight truncate",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-white/40 truncate",
						children: book.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[0.7rem] text-white/30 line-clamp-1 mt-0.5 hidden sm:block",
						children: book.description
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: book.amazonLink,
				target: "_blank",
				rel: "noopener noreferrer",
				onClick: (e) => e.stopPropagation(),
				className: "inline-flex items-center gap-1.5 px-3 py-2 bg-white text-black text-[0.6rem] font-medium uppercase tracking-widest rounded-sm hover:bg-white/90 transition-all shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), " Buy"]
			})
		]
	});
}
//#endregion
export { EditionsPage as component };
