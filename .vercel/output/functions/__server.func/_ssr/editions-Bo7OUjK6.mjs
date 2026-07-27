import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as Search, jt as ArrowRight, r as X, st as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as BOOKS, t as AUTHOR } from "./editions-data-CBkYZZRA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions-Bo7OUjK6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditionsPage() {
	const [selectedSlug, setSelectedSlug] = (0, import_react.useState)(BOOKS[0].slug);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const selectedBook = (0, import_react.useMemo)(() => BOOKS.find((b) => b.slug === selectedSlug) ?? BOOKS[0], [selectedSlug]);
	const filteredBooks = (0, import_react.useMemo)(() => {
		const sorted = [...BOOKS].sort((a, b) => a.seriesOrder - b.seriesOrder);
		if (!searchTerm.trim()) return sorted;
		const q = searchTerm.toLowerCase();
		return sorted.filter((b) => b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.keywords.some((k) => k.toLowerCase().includes(q)) || String(b.seriesOrder) === q);
	}, [searchTerm]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-background text-foreground min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 pt-12 pb-8 sm:pt-16 sm:pb-10 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-5xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground mb-3",
							children: "The Powerful Mind Series"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-3",
							children: "Editions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed",
							children: "A timeless collection of books by Altair Veda — created to inspire knowledge, curiosity, wisdom, and lifelong learning."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-8 sm:py-10 border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-5xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-[260px_1fr] gap-8 md:gap-12 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto md:mx-0 w-[180px] sm:w-[220px] md:w-full md:max-w-[260px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative aspect-[2/3] border border-border overflow-hidden bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: selectedBook.coverImage,
									alt: `${selectedBook.title} — book cover`,
									className: "w-full h-full object-contain animate-fade-in",
									loading: "eager"
								}, selectedBook.slug)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-fade-in",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground mb-2",
									children: [
										"Book ",
										String(selectedBook.seriesOrder).padStart(2, "0"),
										" · ",
										selectedBook.series
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2",
									children: selectedBook.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base text-muted-foreground font-serif italic mb-4",
									children: selectedBook.subtitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3",
									children: selectedBook.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground mb-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Published ", selectedBook.publicationDate.kindle] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: selectedBook.language })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: selectedBook.amazonLink,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-80 transition-opacity",
									children: ["Buy on Amazon ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
								})
							]
						}, selectedBook.slug)]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 pt-8 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-5xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: searchTerm,
								onChange: (e) => setSearchTerm(e.target.value),
								placeholder: "Search by title, topic, or book number...",
								className: "w-full bg-background border border-border pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none transition"
							}),
							searchTerm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchTerm(""),
								className: "absolute right-3 top-1/2 -translate-y-1/2",
								"aria-label": "Clear search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 text-muted-foreground hover:text-foreground" })
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-5xl mx-auto",
					children: filteredBooks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-muted-foreground py-12 text-sm",
						children: "No editions match your search."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border border-y border-border",
						children: filteredBooks.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookListRow, {
							book,
							index: i,
							isSelected: book.slug === selectedSlug,
							onSelect: () => setSelectedSlug(book.slug)
						}, book.slug))
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-4 py-12 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl mx-auto text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-block mb-5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/THEUH.LOGO.png",
								alt: "Altair Veda",
								className: "w-24 h-24 object-contain mx-auto",
								loading: "lazy"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl sm:text-3xl font-bold mb-3",
							children: AUTHOR.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto mb-5",
							children: AUTHOR.shortBio
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/information",
							className: "inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors",
							children: ["View Author ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})
					]
				})
			})
		]
	});
}
function BookListRow({ book, index, isSelected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group flex items-center gap-4 sm:gap-6 py-5 px-2 sm:px-4 transition-colors animate-fade-in cursor-pointer ${isSelected ? "bg-muted" : "hover:bg-muted/50"}`,
		style: { animationDelay: `${index * 50}ms` },
		onClick: onSelect,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 w-14 h-[84px] sm:w-16 sm:h-24 border border-border overflow-hidden bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: book.coverImage,
					alt: `${book.title} — book cover`,
					className: "w-full h-full object-contain",
					loading: "lazy"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground",
							children: String(book.seriesOrder).padStart(2, "0")
						}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[0.55rem] uppercase tracking-[0.15em] text-muted-foreground border border-border px-1.5 py-0.5",
							children: "Featured"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-base sm:text-lg font-bold leading-tight truncate",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1",
						children: book.subtitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block",
						children: book.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[0.65rem] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: book.publicationDate.kindle }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: book.language })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 hidden sm:block",
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: book.amazonLink,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background text-[0.65rem] font-semibold uppercase tracking-[0.12em] hover:opacity-80 transition-opacity",
					children: ["Buy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
				})
			})
		]
	});
}
//#endregion
export { EditionsPage as component };
