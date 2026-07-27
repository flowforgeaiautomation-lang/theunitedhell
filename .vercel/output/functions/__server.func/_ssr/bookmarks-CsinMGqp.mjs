import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, o as useQueryClient, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as listMyBookmarks } from "./interactions.functions-DfukEapx.mjs";
import { i as unsaveWord, n as listSavedWords } from "./quiz.functions-TfNeA-Iz.mjs";
import { g as Trash2, s as Volume2 } from "../_libs/lucide-react.mjs";
import { t as ArticleCard } from "./article-card-vLHOrR7y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookmarks-CsinMGqp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookmarksPage() {
	const fn = useServerFn(listMyBookmarks);
	const wordsFn = useServerFn(listSavedWords);
	const unsaveFn = useServerFn(unsaveWord);
	const qc = useQueryClient();
	const [tab, setTab] = (0, import_react.useState)("articles");
	const bookmarksQ = useQuery({
		queryKey: ["my-bookmarks"],
		queryFn: () => fn()
	});
	const wordsQ = useQuery({
		queryKey: ["my-saved-words"],
		queryFn: () => wordsFn()
	});
	async function removeWord(word) {
		try {
			await unsaveFn({ data: { word } });
			toast.success("Removed from your vocabulary library");
			qc.invalidateQueries({ queryKey: ["my-saved-words"] });
			qc.invalidateQueries({ queryKey: ["saved-word", word] });
		} catch (e) {
			toast.error(e.message);
		}
	}
	function speak(word) {
		const utterance = new SpeechSynthesisUtterance(word);
		utterance.rate = .85;
		utterance.lang = "en-US";
		window.speechSynthesis.speak(utterance);
	}
	const wordCount = wordsQ.data?.length ?? 0;
	const articleCount = bookmarksQ.data?.length ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b rule pb-6 mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker",
						children: "Your collection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "display-1 mt-3",
						children: "My Library."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek mt-3",
						children: "Everything you've saved, in one place."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1 border-b rule mb-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("articles"),
					className: `px-6 py-3 text-sm uppercase tracking-widest font-medium border-b-2 transition -mb-px ${tab === "articles" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						"Saved Articles (",
						articleCount,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab("words"),
					className: `px-6 py-3 text-sm uppercase tracking-widest font-medium border-b-2 transition -mb-px ${tab === "words" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						"Vocabulary Library (",
						wordCount,
						")"
					]
				})]
			}),
			tab === "articles" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				bookmarksQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "Loading…"
				}),
				bookmarksQ.data && bookmarksQ.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "Nothing saved yet. Open any story and tap Save."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-12 md:grid-cols-2 lg:grid-cols-3",
					children: bookmarksQ.data?.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
						article: a,
						variant: "default"
					}, a.id))
				})
			] }),
			tab === "words" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				wordsQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "Loading…"
				}),
				wordsQ.data && wordsQ.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek",
					children: "No words saved yet. Open any story and tap the bookmark icon next to a word to save it here."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 max-w-3xl",
					children: wordsQ.data?.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-l-2 border-foreground/20 pl-5 transition-colors hover:border-foreground/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-2xl",
										children: w.word
									}),
									w.pronunciation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground italic",
										children: w.pronunciation
									}),
									w.part_of_speech && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-widest text-muted-foreground border rule px-2 py-0.5",
										children: w.part_of_speech
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => speak(w.word),
										className: "text-muted-foreground hover:text-foreground transition",
										"aria-label": "Pronounce word",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeWord(w.word),
										className: "text-muted-foreground hover:text-destructive transition",
										"aria-label": "Remove from library",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								]
							}),
							w.meaning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-base text-foreground/90 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Meaning:"
									}),
									" ",
									w.meaning
								]
							}),
							w.simple_explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-sm text-foreground/80 leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Easy meaning:"
									}),
									" ",
									w.simple_explanation
								]
							}),
							w.context_in_article && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-sm text-muted-foreground italic leading-relaxed border-l-2 border-foreground/10 pl-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold not-italic text-foreground/80",
										children: "In this article:"
									}),
									" ",
									w.context_in_article
								]
							}),
							w.example && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-sm text-muted-foreground italic leading-relaxed border-l-2 border-foreground/10 pl-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold not-italic text-foreground/80",
										children: "Example:"
									}),
									" ",
									w.example
								]
							}),
							w.word_origin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-sm text-muted-foreground leading-relaxed",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground/80",
										children: "Origin:"
									}),
									" ",
									w.word_origin
								]
							}),
							(w.synonyms?.length || w.antonyms?.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm",
								children: [w.synonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground/80",
										children: "Synonyms:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: w.synonyms.join(", ")
									})
								] }) : null, w.antonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground/80",
										children: "Antonyms:"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: w.antonyms.join(", ")
									})
								] }) : null]
							})
						]
					}, `${w.word}-${i}`))
				})
			] })
		]
	});
}
//#endregion
export { BookmarksPage as component };
