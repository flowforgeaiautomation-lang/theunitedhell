import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, o as useQueryClient, s as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate, z as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bugw3wPl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CrFQu9_L.mjs";
import { a as objectType, i as numberType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as categoryLabel } from "./categories-BEROsZZ5.mjs";
import { t as supabase } from "./client-CcdZ4ilN.mjs";
import { i as getRelated, o as listComments, s as postReflection } from "./articles.functions-BffoZYxd.mjs";
import { n as articleQ, t as Route } from "./article._slug-DLB2lxex.mjs";
import { a as postComment, c as toggleLike, n as getMyInteractions, s as toggleBookmark, t as deleteComment } from "./interactions.functions-qdaIid8D.mjs";
import { n as fallbackCoverUrl, t as ArticleCard } from "./article-card-Cy55uR6v.mjs";
import { $ as Building2, C as Search, F as Info, J as CircleX, K as Earth, L as Heart, M as Lightbulb, O as MessageCircle, R as Hash, S as Share2, X as ChevronRight, Y as CircleCheck, Z as ChevronDown, b as Sparkles, c as Users, ct as ArrowBigUp, d as Trophy, f as TrendingUp, m as Trash2, nt as BookmarkCheck, o as Volume2, r as X, tt as Bookmark, w as RotateCcw } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article._slug-CO_jt2pD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
createServerFn({ method: "GET" }).inputValidator((d) => objectType({ articleId: stringType().uuid() }).parse(d)).handler(createSsrRpc("3f411a5a86e1b94831a0a4c65b6d7be325d72f6e16bfcaafd1eea5420eba2d40"));
var saveWord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	word: stringType().min(1).max(100),
	meaning: stringType().optional(),
	pronunciation: stringType().optional(),
	partOfSpeech: stringType().optional(),
	example: stringType().optional(),
	synonyms: arrayType(stringType()).optional(),
	antonyms: arrayType(stringType()).optional(),
	articleId: stringType().uuid().optional(),
	difficulty: enumType([
		"beginner",
		"intermediate",
		"advanced"
	]).default("intermediate")
}).parse(d)).handler(createSsrRpc("9f2f6ba40525e8198b118ea0792a6dd5b091e0e918ad20deaa2ec04e656768dc"));
var unsaveWord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ word: stringType().min(1).max(100) }).parse(d)).handler(createSsrRpc("98f0758b4436662ac49e7cd7349646eec144ced754078fceff93813f6eecbb8c"));
createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c9ea2b6c2c8c2926151fc15aabcb729a89c2bd8dcfb93cc940482adffed6c282"));
var checkSavedWord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ word: stringType().min(1).max(100) }).parse(d)).handler(createSsrRpc("baeae8ce0f95a331573919e9f2d39c15914c425568f97eaedbf2166a0ed9815b"));
var toggleCommentLike = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ commentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("3818bce773c3be4ba554055b02c3855cb1a43083d49b2ccec573ca368210b885"));
function ArticleActions({ articleId, title }) {
	const [liked, setLiked] = (0, import_react.useState)(false);
	const [bookmarked, setBookmarked] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	const like = useServerFn(toggleLike);
	const bm = useServerFn(toggleBookmark);
	const fetchInter = useServerFn(getMyInteractions);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(async ({ data }) => {
			if (!mounted) return;
			const sIn = !!data.session;
			setSignedIn(sIn);
			if (sIn) try {
				const r = await fetchInter({ data: { articleIds: [articleId] } });
				if (!mounted) return;
				setLiked(r.liked.includes(articleId));
				setBookmarked(r.bookmarked.includes(articleId));
			} catch {}
		});
		return () => {
			mounted = false;
		};
	}, [articleId, fetchInter]);
	async function needSignIn() {
		toast.message("Sign in to save and react", { action: {
			label: "Sign in",
			onClick: () => navigate({ to: "/auth" })
		} });
	}
	async function onLike() {
		if (!signedIn) return needSignIn();
		const prev = liked;
		setLiked(!prev);
		try {
			setLiked((await like({ data: { articleId } })).liked);
		} catch {
			setLiked(prev);
			toast.error("Could not save your reaction.");
		}
	}
	async function onBookmark() {
		if (!signedIn) return needSignIn();
		const prev = bookmarked;
		setBookmarked(!prev);
		try {
			setBookmarked((await bm({ data: { articleId } })).bookmarked);
		} catch {
			setBookmarked(prev);
			toast.error("Could not save bookmark.");
		}
	}
	async function onShare() {
		const url = typeof window !== "undefined" ? window.location.href : "";
		if (navigator.share) try {
			await navigator.share({
				title,
				url
			});
			return;
		} catch {}
		await navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onLike,
				"aria-label": "like",
				className: `group flex items-center gap-1.5 px-3 py-1.5 border rule text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition ${liked ? "bg-foreground text-background" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${liked ? "fill-current" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Like" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onBookmark,
				"aria-label": "bookmark",
				className: `group flex items-center gap-1.5 px-3 py-1.5 border rule text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition ${bookmarked ? "bg-foreground text-background" : ""}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onShare,
				"aria-label": "share",
				className: "group flex items-center gap-1.5 px-3 py-1.5 border rule text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Share" })]
			})
		]
	});
}
var searchWord = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ word: stringType().min(1).max(80) }).parse(d)).handler(createSsrRpc("86098e590df031882825a5ed7975a33d48a0e93afb0a3551b8333feb026daf94"));
var popularWords = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ limit: numberType().int().min(1).max(20).default(8) }).parse(d ?? {})).handler(createSsrRpc("ba67cbfced7aa6abaa5cc5f07ff4d46b5fe10cf3a828f677d33b5e8bfa8854a5"));
function WordSearch() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const runSearch = useServerFn(searchWord);
	const fetchPopular = useServerFn(popularWords);
	const debouncedTrim = debounced.trim();
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["word-search", debouncedTrim],
		queryFn: () => runSearch({ data: { word: debouncedTrim } }),
		enabled: debouncedTrim.length >= 2,
		staleTime: 1e3 * 60 * 30
	});
	const { data: popular = [] } = useQuery({
		queryKey: ["popular-words"],
		queryFn: () => fetchPopular({ data: {} }),
		staleTime: 1e3 * 60 * 10
	});
	const runFor = (word) => {
		setQuery(word);
		setDebounced(word);
		inputRef.current?.focus();
	};
	const clear = () => {
		setQuery("");
		setDebounced("");
		inputRef.current?.focus();
	};
	const found = data?.found ? data.entry : null;
	const showResult = debouncedTrim.length >= 2 && (isLoading || isFetching || data !== void 0);
	const notFound = data && !data.found;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Universal vocabulary search",
		className: "mt-10 border-t rule pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "kicker mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "h-4 w-4",
					"aria-hidden": true
				}), "Don't Get a Word?"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-6 leading-relaxed",
				children: "Search any word to instantly see its meaning, pronunciation, synonyms, examples, and more."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "tuh-word-search",
						className: "sr-only",
						children: "Search any word"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "tuh-word-search",
						ref: inputRef,
						type: "text",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter" && query.trim()) setDebounced(query.trim());
						},
						placeholder: "Search any word...",
						autoComplete: "off",
						spellCheck: false,
						className: "w-full rounded-full border rule bg-background py-3.5 pl-12 pr-12 text-base font-serif leading-snug shadow-sm transition focus:outline-none focus:ring-2 focus:ring-foreground/30"
					}),
					query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: clear,
						"aria-label": "Clear search",
						className: "absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			}),
			showResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: isLoading || isFetching ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border rule p-5 text-sm text-muted-foreground",
					children: "Searching the dictionary…"
				}) : found ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { entry: found }) : notFound ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border rule p-5 text-sm text-muted-foreground",
					children: "No dictionary entry was found for this word. Please check the spelling or try another word."
				}) : null
			}),
			popular.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
						className: "h-3.5 w-3.5",
						"aria-hidden": true
					}), " Popular Searches"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: popular.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => runFor(w),
						className: "rounded-full border rule px-3 py-1.5 text-sm transition hover:bg-foreground hover:text-background focus:outline-none focus:ring-2 focus:ring-foreground/30",
						children: w
					}, w))
				})]
			})
		]
	});
}
function ResultCard({ entry }) {
	const [open, setOpen] = (0, import_react.useState)(true);
	const speak = () => {
		if (typeof window === "undefined" || !entry.word) return;
		try {
			const u = new SpeechSynthesisUtterance(entry.word);
			u.rate = .9;
			window.speechSynthesis?.speak(u);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border rule bg-background shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			className: "flex w-full items-center justify-between gap-3 p-5 text-left transition hover:bg-foreground/[0.03] focus:outline-none focus:ring-2 focus:ring-foreground/30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-2xl",
						children: entry.word
					}),
					entry.pronunciation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm italic text-muted-foreground",
						children: entry.pronunciation
					}),
					entry.partOfSpeech && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "border rule px-2 py-0.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground",
						children: entry.partOfSpeech
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					role: "button",
					tabIndex: 0,
					onClick: (e) => {
						e.stopPropagation();
						speak();
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.stopPropagation();
							speak();
						}
					},
					className: "rounded-full p-2 text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30",
					"aria-label": `Pronounce ${entry.word}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
					className: `h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`,
					"aria-hidden": true
				})]
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 border-t rule p-5",
			children: [
				entry.meaning && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-base leading-relaxed text-foreground/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Meaning:"
						}),
						" ",
						entry.meaning
					]
				}),
				entry.simpleExplanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-foreground/70",
					children: entry.simpleExplanation
				}),
				entry.example && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-l-2 border-foreground/10 pl-3 text-sm italic leading-relaxed text-muted-foreground",
					children: entry.example
				}),
				(entry.synonyms?.length || entry.antonyms?.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-x-6 gap-y-2 text-sm",
					children: [entry.synonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground/80",
							children: "Synonyms:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: entry.synonyms.join(", ")
						})
					] }) : null, entry.antonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground/80",
							children: "Antonyms:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: entry.antonyms.join(", ")
						})
					] }) : null]
				})
			]
		})]
	});
}
function generateQuiz(story, title) {
	const questions = [];
	const summary = (story?.summary || "").trim();
	const mainStory = (story?.main_story || "").trim();
	const keyDevs = story?.key_developments || [];
	const fullText = `${summary} ${mainStory}`.trim();
	if (fullText.length < 50) return [];
	const sentences = fullText.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.split(" ").length >= 6);
	if (sentences.length < 2) return [];
	const correctAnswer = summary ? summary.split(".")[0].slice(0, 80) + (summary.length > 80 ? "…" : "") : title;
	questions.push({
		id: "q-1",
		question_type: "multiple_choice",
		question: "What is the main topic of this article?",
		options: [correctAnswer, ...[
			"A scientific discovery about marine biology",
			"A review of a new technology product",
			"A sports tournament recap and analysis"
		]].sort(() => Math.random() - .5),
		correct_answer: correctAnswer,
		explanation: `This article focuses on: ${title}`
	});
	const correctSentence = sentences[Math.floor(Math.random() * sentences.length)];
	questions.push({
		id: "q-2",
		question_type: "true_false",
		question: `True or False: "${correctSentence}"`,
		options: null,
		correct_answer: "true",
		explanation: "This statement appears directly in the article."
	});
	if (keyDevs.length >= 2) {
		const correctIdx = Math.floor(Math.random() * keyDevs.length);
		const correctDev = keyDevs[correctIdx];
		const wrongDevs = keyDevs.filter((_, i) => i !== correctIdx).slice(0, 3);
		const distractors = [
			"The article discusses a major sporting event result",
			"A new space exploration mission was announced",
			"Local weather patterns changed significantly"
		];
		while (wrongDevs.length < 3) wrongDevs.push(distractors[wrongDevs.length] || "None of the above");
		questions.push({
			id: "q-3",
			question_type: "multiple_choice",
			question: "Which of the following is a key development mentioned in the article?",
			options: [correctDev, ...wrongDevs].sort(() => Math.random() - .5),
			correct_answer: correctDev,
			explanation: "This is one of the key developments listed in the article."
		});
	}
	questions.push({
		id: "q-4",
		question_type: "reflection",
		question: `Reflect on this article. What perspective or insight did you gain about ${title}?`,
		options: null,
		correct_answer: null,
		explanation: null
	});
	return questions;
}
function KnowledgeCheck({ articleId, story, title, onReflection }) {
	const questions = (0, import_react.useMemo)(() => {
		if (!story) return [];
		return generateQuiz(story, title || "");
	}, [story, title]);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	if (questions.length === 0) return null;
	const score = questions.filter((q) => q.question_type !== "reflection" && answers[q.id] === q.correct_answer).length;
	const gradedCount = questions.filter((q) => q.question_type !== "reflection").length;
	const reflectionQuestion = questions.find((q) => q.question_type === "reflection");
	function reset() {
		setAnswers({});
		setSubmitted(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8 mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "kicker mb-6 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }), " Knowledge Check"]
			}),
			submitted && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 rounded-lg border rule bg-foreground/[0.02] p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-serif text-4xl mb-2",
						children: [
							score,
							" / ",
							gradedCount
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: score === gradedCount ? "Perfect score — you mastered this story." : score >= gradedCount * .7 ? "Well done — you understood the key points." : "Review the article and try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: reset,
						className: "mt-4 inline-flex items-center gap-2 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Try again"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-8",
				children: questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border rule p-6 rounded-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground tabular-nums text-sm",
								children: String(i + 1).padStart(2, "0")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-xl leading-snug",
								children: q.question
							})]
						}),
						q.question_type === "reflection" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: answers[q.id] ?? "",
							onChange: (e) => setAnswers((a) => ({
								...a,
								[q.id]: e.target.value
							})),
							rows: 3,
							placeholder: "Share your reflection…",
							className: "w-full bg-transparent border rule p-4 font-serif text-base focus:outline-none focus:ring-1 focus:ring-foreground/40"
						}) }) : q.question_type === "true_false" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-3",
							children: ["true", "false"].map((opt) => {
								const selected = answers[q.id] === opt;
								const isCorrect = submitted && opt === q.correct_answer;
								const isWrong = submitted && selected && opt !== q.correct_answer;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => !submitted && setAnswers((a) => ({
										...a,
										[q.id]: opt
									})),
									className: `flex-1 border rule px-4 py-3 font-serif text-lg capitalize transition ${isCorrect ? "bg-foreground text-background border-foreground" : isWrong ? "bg-destructive/10 border-destructive" : selected ? "bg-foreground/[0.05] border-foreground/40" : "hover:bg-foreground/[0.02]"}`,
									children: opt
								}, opt);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-2",
							children: q.options?.map((opt, j) => {
								const selected = answers[q.id] === opt;
								const isCorrect = submitted && opt === q.correct_answer;
								const isWrong = submitted && selected && opt !== q.correct_answer;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => !submitted && setAnswers((a) => ({
										...a,
										[q.id]: opt
									})),
									className: `flex items-center gap-3 border rule px-4 py-3 text-left transition ${isCorrect ? "bg-foreground text-background border-foreground" : isWrong ? "bg-destructive/10 border-destructive" : selected ? "bg-foreground/[0.05] border-foreground/40" : "hover:bg-foreground/[0.02]"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-sm text-muted-foreground w-6",
											children: String.fromCharCode(65 + j)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-serif text-base",
											children: opt
										}),
										isCorrect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 ml-auto" }),
										isWrong && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 ml-auto" })
									]
								}, j);
							})
						}),
						submitted && q.explanation && q.question_type !== "reflection" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-start gap-2 rounded-md bg-foreground/[0.03] p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/80 leading-relaxed",
								children: q.explanation
							})]
						})
					]
				}, q.id))
			}),
			!submitted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex flex-wrap items-center justify-center gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setSubmitted(true);
						const reflectionText = reflectionQuestion ? answers[reflectionQuestion.id]?.trim() : "";
						if (onReflection && reflectionText) onReflection(reflectionText);
					},
					disabled: Object.keys(answers).length < gradedCount && !answers[reflectionQuestion?.id ?? ""]?.trim(),
					className: "border border-foreground px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
					children: "Check answers"
				})
			})
		]
	});
}
function EnhancedVocabCard({ entry, articleId, index }) {
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	const saveFn = useServerFn(saveWord);
	const unsaveFn = useServerFn(unsaveWord);
	const checkFn = useServerFn(checkSavedWord);
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
	}, []);
	const { data: savedState } = useQuery({
		queryKey: ["saved-word", entry.word],
		queryFn: () => checkFn({ data: { word: entry.word } }),
		enabled: !!signedIn && !!entry.word
	});
	const saveMutation = useMutation({
		mutationFn: async (save) => save ? saveFn({ data: {
			word: entry.word,
			meaning: entry.meaning,
			pronunciation: entry.pronunciation,
			partOfSpeech: entry.partOfSpeech,
			example: entry.example,
			synonyms: entry.synonyms,
			antonyms: entry.antonyms,
			articleId
		} }) : unsaveFn({ data: { word: entry.word } }),
		onSuccess: (_, save) => {
			toast.success(save ? "Saved to your vocabulary library" : "Removed from library");
			qc.invalidateQueries({ queryKey: ["saved-word", entry.word] });
		},
		onError: (e) => toast.error(e.message)
	});
	function speak() {
		if (!entry.word) return;
		const utterance = new SpeechSynthesisUtterance(entry.word);
		utterance.rate = .85;
		utterance.lang = "en-US";
		window.speechSynthesis.speak(utterance);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-l-2 border-foreground/20 pl-5 transition-colors hover:border-foreground/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-2xl",
						children: entry.word
					}),
					entry.pronunciation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground italic",
						children: entry.pronunciation
					}),
					entry.partOfSpeech && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-widest text-muted-foreground border rule px-2 py-0.5",
						children: entry.partOfSpeech
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: speak,
						className: "text-muted-foreground hover:text-foreground transition",
						"aria-label": "Pronounce word",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							if (!signedIn) {
								toast.message("Sign in to save words to your vocabulary library");
								return;
							}
							saveMutation.mutate(!savedState?.saved);
						},
						className: "text-muted-foreground hover:text-foreground transition",
						"aria-label": savedState?.saved ? "Remove from library" : "Save to library",
						children: savedState?.saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4" })
					})
				]
			}),
			entry.meaning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-base text-foreground/90 leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: "Meaning:"
					}),
					" ",
					entry.meaning
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground italic leading-relaxed",
				children: "Tap the speaker icon to hear this word. Look it up using the search below."
			}),
			entry.simpleExplanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-foreground/70 leading-relaxed",
				children: entry.simpleExplanation
			}),
			entry.example && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground italic leading-relaxed border-l-2 border-foreground/10 pl-3",
				children: entry.example
			}),
			(entry.synonyms?.length || entry.antonyms?.length) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm",
				children: [entry.synonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground/80",
						children: "Synonyms:"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: entry.synonyms.join(", ")
					})
				] }) : null, entry.antonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground/80",
						children: "Antonyms:"
					}),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: entry.antonyms.join(", ")
					})
				] }) : null]
			})
		]
	});
}
function useScrollProgress() {
	const [progress, setProgress] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			const el = document.documentElement;
			const max = el.scrollHeight - el.clientHeight;
			setProgress(max > 0 ? Math.min(100, el.scrollTop / max * 100) : 0);
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return progress;
}
function ReadingProgress() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-foreground transition-[width] duration-150 ease-out",
			style: { width: `${useScrollProgress()}%` }
		})
	});
}
function ArticlePage() {
	const { slug } = Route.useParams();
	const { data: article, isError, refetch } = useQuery(articleQ(slug));
	const relatedQuery = useQuery({
		queryKey: [
			"related",
			article?.category ?? "",
			article?.slug ?? ""
		],
		queryFn: () => getRelated({ data: {
			category: article.category,
			excludeSlug: article.slug
		} }),
		enabled: !!article
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-read py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "kicker",
				children: "Connection issue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display-2 mt-3",
				children: "Couldn't load this story."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "dek mt-3",
				children: "A temporary error occurred. Please try again."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => refetch(),
				className: "mt-6 border border-foreground px-5 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
				children: "Try again"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				search: { category: void 0 },
				className: "mt-3 block kicker hover:opacity-60",
				children: "← Front page"
			})
		]
	});
	if (!article) return null;
	const story = article.story ?? {};
	const cover = article.cover_image_url || fallbackCoverUrl(article);
	const related = relatedQuery.data ?? [];
	const tags = article.tags || story.tags || [];
	const addedDate = article.created_at ? new Date(article.created_at).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadingProgress, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "container-read pt-10 md:pt-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: categoryLabel(article.category)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-5",
					children: article.title
				}),
				article.dek && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek mt-6 text-balance",
					children: article.dek
				}),
				addedDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 text-sm text-muted-foreground",
					children: addedDate
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleActions, {
						articleId: article.id,
						title: article.title
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
			className: "container-edit mt-10 group",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: cover,
				alt: article.title,
				className: "w-full max-h-[70vh] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]",
				loading: "eager",
				onError: (e) => {
					const img = e.currentTarget;
					if (img.src !== fallbackCoverUrl(article)) img.src = fallbackCoverUrl(article);
				}
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-read py-12 md:py-16",
			style: {
				fontSize: "var(--article-font-size, 17px)",
				lineHeight: "var(--article-line-height, 1.6)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "article-content grid gap-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBlock, {
							label: "Quick Summary",
							body: story.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBlock, {
							label: "Main Story",
							body: story.main_story
						}),
						story.background && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBlock, {
							label: "Background",
							body: story.background
						}),
						story.key_developments && story.key_developments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyDevelopmentsBlock, { items: story.key_developments }),
						story.quick_insights && story.quick_insights.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBlock, {
							label: "Quick Insights",
							items: story.quick_insights
						}),
						story.why_it_matters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
							label: "Why This Matters",
							body: story.why_it_matters,
							icon: "lightbulb"
						}),
						story.expert_analysis && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBlock, {
							label: "Expert Insights",
							body: story.expert_analysis
						}),
						story.timeline && story.timeline.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimelineBlock, { items: story.timeline }),
						story.key_numbers && story.key_numbers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyNumbersBlock, { items: story.key_numbers }),
						story.people && story.people.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeopleBlock, { people: story.people }),
						story.organizations && story.organizations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationsBlock, { orgs: story.organizations }),
						story.countries && story.countries.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountriesBlock, { countries: story.countries }),
						story.did_you_know && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DidYouKnowBlock, { fact: story.did_you_know }),
						story.historical_context && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBlock, {
							label: "Historical Context",
							body: story.historical_context
						}),
						story.future_outlook && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryBlock, {
							label: "Future Outlook",
							body: story.future_outlook
						}),
						story.reader_takeaways && story.reader_takeaways.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBlock, {
							label: "Reader Takeaways",
							items: story.reader_takeaways
						}),
						tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedTopics, { tags })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-10 mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-y rule py-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "kicker mb-6",
								children: "Vocabulary Builder"
							}),
							story.vocabulary && story.vocabulary.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6",
								children: story.vocabulary.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnhancedVocabCard, {
									entry: v,
									articleId: article.id,
									index: i
								}, `${v.word}-${i}`))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Vocabulary is being generated for this article. Please check back shortly."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordSearch, {})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowledgeCheckReflection, {
						articleId: article.id,
						story,
						title: article.title
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleActions, {
						articleId: article.id,
						title: article.title
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Discussion, { articleId: article.id }),
		related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-edit py-16 border-t rule",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-3 mb-8",
				children: "Keep reading"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-10 sm:grid-cols-2 lg:grid-cols-4",
				children: related.slice(0, 4).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleCard, {
					article: a,
					variant: "default"
				}, a.id))
			})]
		})
	] });
}
function StoryBlock({ label, body }) {
	if (!body) return null;
	const paragraphs = body.split(/\n{2,}|\r?\n/).map((p) => p.trim()).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "kicker mb-3",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5",
		children: paragraphs.map((paragraph, index) => {
			if (paragraph.startsWith("> ") || paragraph.startsWith("\"")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PullQuote, { text: paragraph.replace(/^>\s*/, "").replace(/^"|"$/g, "") }, index);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-xl md:text-2xl leading-snug",
				children: paragraph
			}, index);
		})
	})] });
}
function PullQuote({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
		className: "my-8 border-l-[3px] border-foreground pl-6 md:pl-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-serif text-2xl md:text-3xl leading-tight italic text-foreground/90",
			children: text
		})
	});
}
function InfoBox({ label, body, icon = "info" }) {
	if (!body) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-t rule pt-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border rule bg-foreground/[0.02] p-6 md:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "kicker mb-4 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(icon === "lightbulb" ? Lightbulb : icon === "sparkles" ? Sparkles : Info, { className: "h-4 w-4" }),
					" ",
					label
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: body.split(/\n{2,}|\r?\n/).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-lg md:text-xl leading-relaxed text-foreground/90",
					children: p.trim()
				}, i))
			})]
		})
	});
}
function KeyDevelopmentsBlock({ items }) {
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kicker mb-6",
			children: "Key Developments"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group flex gap-5 rounded-lg border rule p-5 md:p-6 transition-all duration-300 hover:bg-foreground/[0.02] hover:border-foreground/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-full border rule font-serif text-lg text-foreground/80 transition-colors group-hover:border-foreground group-hover:text-foreground",
						children: String(i + 1).padStart(2, "0")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-lg md:text-xl leading-snug pt-1.5",
					children: item
				})]
			}, i))
		})]
	});
}
function TimelineBlock({ items }) {
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kicker mb-6",
			children: "Timeline"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative pl-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[11px] top-2 bottom-2 w-px bg-foreground/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6",
				children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-foreground bg-background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-lg leading-snug",
						children: item
					})]
				}, i))
			})]
		})]
	});
}
function RelatedTopics({ tags }) {
	if (!tags?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kicker mb-4",
			children: "Related Topics"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/search",
				search: { q: tag },
				className: "group inline-flex items-center gap-1 rounded-full border rule px-4 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:border-foreground hover:text-foreground",
				children: [tag, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" })]
			}, tag))
		})]
	});
}
function ListBlock({ label, items }) {
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kicker mb-4",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 font-serif text-lg leading-snug",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground tabular-nums",
					children: String(i + 1).padStart(2, "0")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
			}, i))
		})]
	});
}
function KeyNumbersBlock({ items }) {
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kicker mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "h-4 w-4" }), " Key Numbers"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: items.map((kn, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule p-5 transition-colors hover:border-foreground/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-3xl mb-1",
						children: kn.value
					}),
					kn.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
						children: kn.label
					}),
					kn.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground/70 leading-relaxed",
						children: kn.explanation
					})
				]
			}, i))
		})]
	});
}
function PeopleBlock({ people }) {
	if (!people?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kicker mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " People Involved"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: people.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule p-5 transition-colors hover:border-foreground/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl mb-1",
						children: p.name
					}),
					p.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground mb-2",
						children: p.role
					}),
					p.contribution && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-foreground/80 leading-relaxed mb-1",
						children: p.contribution
					}),
					p.importance && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground leading-relaxed",
						children: p.importance
					})
				]
			}, i))
		})]
	});
}
function OrganizationsBlock({ orgs }) {
	if (!orgs?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kicker mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" }), " Organizations"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: orgs.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule p-5 transition-colors hover:border-foreground/30",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-xl mb-1",
					children: o.name
				}), o.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground/70 leading-relaxed",
					children: o.explanation
				})]
			}, i))
		})]
	});
}
function CountriesBlock({ countries }) {
	if (!countries?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "kicker mb-4 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, { className: "h-4 w-4" }), " Countries"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: countries.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule px-4 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-base",
					children: c.name
				}), c.role && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted-foreground ml-2",
					children: ["— ", c.role]
				})]
			}, i))
		})]
	});
}
function DidYouKnowBlock({ fact }) {
	if (!fact) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-t rule pt-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border rule bg-foreground/[0.02] p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "kicker mb-3 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Did You Know?"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-serif text-lg leading-relaxed",
				children: fact
			})]
		})
	});
}
var PROMPTS = [
	{
		id: "learned",
		label: "What did you learn?"
	},
	{
		id: "surprised",
		label: "What surprised you?"
	},
	{
		id: "question",
		label: "What question remains?"
	},
	{
		id: "perspective",
		label: "Your perspective"
	}
];
function KnowledgeCheckReflection({ articleId, story, title }) {
	const qc = useQueryClient();
	const send = useServerFn(postReflection);
	const [posted, setPosted] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowledgeCheck, {
		articleId,
		story,
		title,
		onReflection: (reflectionText) => {
			send({ data: {
				articleId,
				body: reflectionText,
				promptType: "perspective"
			} }).then(() => {
				qc.invalidateQueries({ queryKey: ["comments", articleId] });
				toast.success("Your reflection was posted to the discussion");
				setPosted(true);
				requestAnimationFrame(() => {
					document.getElementById("discussion")?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
				});
			}).catch((e) => toast.error(e.message));
		}
	});
}
function Discussion({ articleId }) {
	const router = useRouter();
	const qc = useQueryClient();
	const fetchComments = useServerFn(listComments);
	const send = useServerFn(postComment);
	const likeFn = useServerFn(toggleCommentLike);
	const delFn = useServerFn(deleteComment);
	const [signedIn, setSignedIn] = (0, import_react.useState)(null);
	const [currentUserId, setCurrentUserId] = (0, import_react.useState)(null);
	const [prompt, setPrompt] = (0, import_react.useState)("perspective");
	const [body, setBody] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [likedComments, setLikedComments] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [replyingTo, setReplyingTo] = (0, import_react.useState)(null);
	const [replyBody, setReplyBody] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSignedIn(!!data.session);
			setCurrentUserId(data.session?.user?.id ?? null);
		});
	}, []);
	const { data: comments = [] } = useQuery({
		queryKey: ["comments", articleId],
		queryFn: () => fetchComments({ data: { articleId } })
	});
	const topLevel = comments.filter((c) => !c.parent_id);
	const repliesOf = (parentId) => comments.filter((c) => c.parent_id === parentId);
	const sortedTop = [...topLevel].sort((a, b) => {
		if (sort === "top") return (b.like_count ?? 0) - (a.like_count ?? 0);
		if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});
	const mutation = useMutation({
		mutationFn: (input) => send({ data: {
			articleId,
			body: input.body,
			promptType: input.promptType,
			parentId: input.parentId ?? null
		} }),
		onSuccess: () => {
			setBody("");
			setReplyBody("");
			setReplyingTo(null);
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
			toast.success("Posted to the discussion");
		},
		onError: (e) => toast.error(e.message)
	});
	const likeMutation = useMutation({
		mutationFn: (commentId) => likeFn({ data: { commentId } }),
		onMutate: (commentId) => {
			setLikedComments((prev) => {
				const next = new Set(prev);
				if (next.has(commentId)) next.delete(commentId);
				else next.add(commentId);
				return next;
			});
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["comments", articleId] }),
		onError: () => toast.error("Could not update vote")
	});
	const deleteMutation = useMutation({
		mutationFn: (commentId) => delFn({ data: { commentId } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
			toast.success("Comment deleted");
		},
		onError: (e) => toast.error(e.message)
	});
	function renderComment(c, isReply) {
		const isLiked = likedComments.has(c.id);
		const count = (c.like_count ?? 0) + (isLiked ? 1 : 0);
		const canDelete = signedIn && currentUserId === c.user_id;
		const childReplies = repliesOf(c.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: isReply ? "ml-6 border-l border-foreground/10 pl-4" : "border-t rule pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between mb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif font-medium",
						children: c.author?.display_name || c.author?.username || "Reader"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs text-muted-foreground",
						children: [c.prompt_type && !isReply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-3 kicker text-[0.6rem]",
							children: PROMPTS.find((p) => p.id === c.prompt_type)?.label ?? c.prompt_type
						}), new Date(c.created_at).toLocaleDateString()]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-lg leading-snug whitespace-pre-wrap",
					children: c.body
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center gap-3",
					children: [
						signedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => likeMutation.mutate(c.id),
							className: `flex items-center gap-1 text-sm transition ${isLiked ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`,
							children: [isLiked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowBigUp, { className: "h-4 w-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowBigUp, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: count })]
						}),
						signedIn && !isReply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setReplyingTo(replyingTo === c.id ? null : c.id);
								setReplyBody("");
							},
							className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reply" })]
						}),
						canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => deleteMutation.mutate(c.id),
							disabled: deleteMutation.isPending,
							className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-red-600 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delete" })]
						})
					]
				}),
				replyingTo === c.id && signedIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: replyBody,
						onChange: (e) => setReplyBody(e.target.value),
						rows: 3,
						maxLength: 4e3,
						placeholder: `Reply to ${c.author?.display_name || c.author?.username || "Reader"}…`,
						className: "w-full bg-transparent border rule p-4 font-serif text-base focus:outline-none focus:ring-1 focus:ring-foreground/40"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => replyBody.trim() && mutation.mutate({
								body: replyBody.trim(),
								promptType: prompt,
								parentId: c.id
							}),
							disabled: !replyBody.trim() || mutation.isPending,
							className: "border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
							children: mutation.isPending ? "Posting…" : "Post reply"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setReplyingTo(null);
								setReplyBody("");
							},
							className: "text-xs text-muted-foreground hover:text-foreground transition",
							children: "Cancel"
						})]
					})]
				}),
				childReplies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: childReplies.map((r) => renderComment(r, true))
				})
			]
		}, c.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "discussion",
		className: "container-read py-16 border-t rule scroll-mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "kicker mb-6",
				children: "The Discussion"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "display-2 mb-8",
				children: ["A guided conversation", comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "ml-3 text-base font-sans text-muted-foreground",
					children: [
						"(",
						comments.length,
						" ",
						comments.length === 1 ? "contribution" : "contributions",
						")"
					]
				})]
			}),
			signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 mb-4",
						children: PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPrompt(p.id),
							className: `px-3 py-1.5 text-xs uppercase tracking-widest border rule transition ${prompt === p.id ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background"}`,
							children: p.label
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: body,
						onChange: (e) => setBody(e.target.value),
						rows: 4,
						maxLength: 4e3,
						placeholder: PROMPTS.find((p) => p.id === prompt)?.label,
						className: "w-full bg-transparent border rule p-4 font-serif text-lg focus:outline-none focus:ring-1 focus:ring-foreground/40"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [body.length, "/4000"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => body.trim() && mutation.mutate({
								body: body.trim(),
								promptType: prompt
							}),
							disabled: !body.trim() || mutation.isPending,
							className: "border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
							children: mutation.isPending ? "Posting…" : "Post comment"
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule p-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek not-italic font-sans text-sm",
					children: "Sign in to contribute to the discussion."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => router.navigate({ to: "/auth" }),
					className: "border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
					children: "Sign in"
				})]
			}),
			comments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "kicker",
					children: "Sort by"
				}), [
					"newest",
					"top",
					"oldest"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSort(s),
					className: `px-3 py-1 text-xs uppercase tracking-widest border rule transition capitalize ${sort === s ? "bg-foreground text-background" : "hover:bg-foreground/[0.05]"}`,
					children: s
				}, s))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 space-y-8",
				children: [comments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No contributions yet. Be the first."
				}), sortedTop.map((c) => renderComment(c, false))]
			})
		]
	});
}
//#endregion
export { ArticlePage as component };
