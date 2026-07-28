import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, i as useQuery, o as useQueryClient, s as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BIkGSVX4.mjs";
import { a as numberType, o as objectType, s as stringType } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as translateVisibleText } from "./translation.functions-Dl_1PGjX.mjs";
import { a as categoryLabel } from "./categories-CY0cJTXM.mjs";
import { t as supabase } from "./client-d8MeWTAO.mjs";
import { a as getLikedComments, c as listComments, l as postReflection, o as getRelated, t as bumpLike } from "./articles.functions-C8ZG7BU6.mjs";
import { i as useReadingPrefs, r as articleQ, t as Route } from "./article._slug-DSFwTRB6.mjs";
import { a as toggleBookmark, o as toggleLike, t as getMyInteractions } from "./interactions.functions-DfukEapx.mjs";
import { i as unsaveWord, r as saveWord, t as checkSavedWord } from "./quiz.functions-TfNeA-Iz.mjs";
import { n as fallbackCoverUrl, t as SmartImage } from "./SmartImage-CSltlVaf.mjs";
import { $ as Globe, A as Search, C as Sparkles, Ct as Building2, Dt as BookOpen, E as SkipBack, Et as BookmarkCheck, Mt as ArrowBigUp, N as Play, O as Share2, P as Pause, R as Minimize, T as SkipForward, Tt as Bookmark, V as Maximize, W as Lightbulb, X as Heart, Z as Hash, _t as ChevronRight, ct as Earth, gt as ChevronUp, ht as CircleCheck, j as RotateCcw, l as Users, m as TrendingUp, mt as CircleX, o as VolumeX, p as Trophy, q as Info, r as X, s as Volume2, tt as Gauge, vt as ChevronLeft, x as Square, yt as ChevronDown, z as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article._slug-C-w0d5-k.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
/**
* AI Explain on Selection — uses the existing AI gateway to explain any
* selected text in the context of the article. Returns plain text.
*/
var aiExplainText = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	text: stringType().min(1).max(2e3),
	context: stringType().max(2e3).optional()
}).parse(d)).handler(createSsrRpc("f84fb5e1dca0f07bdb04ffb7d28c889e44775014654caf5ca46469098977c04b"));
createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	text: stringType().min(1).max(2e3),
	target: stringType().min(2).max(10)
}).parse(d)).handler(createSsrRpc("152784e518e0f7134b537a769609dba69842bbac694cd422cb55b47cd9e775f4"));
/**
* ReadingExperience — full reading experience controller.
* Features: progress bar, auto-scroll, wake lock, reading ruler, paragraph highlight,
* focus mode, fullscreen, immersive/zen mode, text selection menu (save, copy, share,
* pronounce, read aloud, AI explain, translate, dictionary), narration with voice,
* sticky TOC, mini map, reading achievements, data saver, offline cache, keyboard nav.
*/
function ReadingExperience({ articleSlug, articleContentRef, articleTitle, articleSections }) {
	const { prefs, loaded, signedIn } = useReadingPrefs();
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [readSeconds, setReadSeconds] = (0, import_react.useState)(0);
	const [rulerY, setRulerY] = (0, import_react.useState)(0);
	const [showNoteMenu, setShowNoteMenu] = (0, import_react.useState)(false);
	const [noteMenuPos, setNoteMenuPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [savedNotes, setSavedNotes] = (0, import_react.useState)([]);
	const [popupAction, setPopupAction] = (0, import_react.useState)("none");
	const [popupContent, setPopupContent] = (0, import_react.useState)("");
	const [popupLoading, setPopupLoading] = (0, import_react.useState)(false);
	const [popupPos, setPopupPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	const [isNarrating, setIsNarrating] = (0, import_react.useState)(false);
	const [narratingEl, setNarratingEl] = (0, import_react.useState)(null);
	const [showToc, setShowToc] = (0, import_react.useState)(false);
	const [showMiniMap, setShowMiniMap] = (0, import_react.useState)(false);
	const [achievements, setAchievements] = (0, import_react.useState)([]);
	const wakeLockRef = (0, import_react.useRef)(null);
	const autoScrollRef = (0, import_react.useRef)(null);
	const readTimerRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	const explainFn = useServerFn(aiExplainText);
	const translateFn = useServerFn(translateVisibleText);
	(0, import_react.useEffect)(() => {
		if (!signedIn) {
			setSavedNotes(JSON.parse(localStorage.getItem("tuh-reading-notes") || "[]").filter((n) => n.article_slug === articleSlug));
			return;
		}
		(async () => {
			const { data } = await supabase.from("reading_notes").select("id, article_slug, selected_text, note, color, created_at").eq("article_slug", articleSlug);
			if (data) setSavedNotes(data);
		})();
	}, [signedIn, articleSlug]);
	(0, import_react.useEffect)(() => {
		if (!prefs.readingProgressBar) {
			setProgress(0);
			return;
		}
		function onScroll() {
			const el = articleContentRef.current;
			if (!el) return;
			const rect = el.getBoundingClientRect();
			const total = rect.height - window.innerHeight;
			const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
			setProgress(total > 0 ? scrolled / total * 100 : 0);
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, [prefs.readingProgressBar, articleContentRef]);
	const progressRef = (0, import_react.useRef)(progress);
	progressRef.current = progress;
	const readSecondsRef = (0, import_react.useRef)(readSeconds);
	readSecondsRef.current = readSeconds;
	(0, import_react.useEffect)(() => {
		if (!prefs.focusTimer && !prefs.continueWhereLeftOff) return;
		readTimerRef.current = setInterval(() => {
			setReadSeconds((s) => {
				const next = s + 1;
				const p = progressRef.current;
				if (next === 60) setAchievements((a) => a.includes("1min") ? a : [...a, "1min"]);
				if (next === 300) setAchievements((a) => a.includes("5min") ? a : [...a, "5min"]);
				if (next === 600) setAchievements((a) => a.includes("10min") ? a : [...a, "10min"]);
				if (p > 50) setAchievements((a) => a.includes("halfway") ? a : [...a, "halfway"]);
				if (p > 95) setAchievements((a) => a.includes("finished") ? a : [...a, "finished"]);
				return next;
			});
		}, 1e3);
		return () => {
			if (readTimerRef.current) clearInterval(readTimerRef.current);
		};
	}, [prefs.focusTimer, prefs.continueWhereLeftOff]);
	(0, import_react.useEffect)(() => {
		if (!signedIn || !prefs.continueWhereLeftOff) return;
		const interval = setInterval(async () => {
			const p = progressRef.current;
			if (p > 0) await supabase.from("reading_progress").upsert({
				article_slug: articleSlug,
				scroll_percent: Math.round(p),
				read_seconds: readSecondsRef.current,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}, { onConflict: "user_id,article_slug" });
		}, 15e3);
		return () => clearInterval(interval);
	}, [
		signedIn,
		prefs.continueWhereLeftOff,
		articleSlug
	]);
	(0, import_react.useEffect)(() => {
		if (!signedIn || !prefs.rememberScrollPosition || !loaded) return;
		(async () => {
			const { data } = await supabase.from("reading_progress").select("scroll_percent").eq("article_slug", articleSlug).maybeSingle();
			if (data?.scroll_percent && data.scroll_percent > 5) {
				const el = articleContentRef.current;
				if (el) {
					const rect = el.getBoundingClientRect();
					const target = window.scrollY + rect.top + rect.height * data.scroll_percent / 100 - window.innerHeight / 2;
					window.scrollTo({
						top: Math.max(0, target),
						behavior: "smooth"
					});
				}
			}
		})();
	}, [
		signedIn,
		prefs.rememberScrollPosition,
		loaded,
		articleSlug
	]);
	(0, import_react.useEffect)(() => {
		if (!prefs.autoScroll) {
			if (autoScrollRef.current) {
				clearInterval(autoScrollRef.current);
				autoScrollRef.current = null;
			}
			return;
		}
		const pxPerSec = prefs.scrollSpeed * 20;
		autoScrollRef.current = setInterval(() => {
			window.scrollBy({
				top: pxPerSec / 10,
				behavior: "auto"
			});
		}, 100);
		return () => {
			if (autoScrollRef.current) clearInterval(autoScrollRef.current);
		};
	}, [prefs.autoScroll, prefs.scrollSpeed]);
	(0, import_react.useEffect)(() => {
		if (!prefs.keepScreenAwake) {
			if (wakeLockRef.current) {
				wakeLockRef.current.release();
				wakeLockRef.current = null;
			}
			return;
		}
		(async () => {
			try {
				if ("wakeLock" in navigator) wakeLockRef.current = await navigator.wakeLock.request("screen");
			} catch {}
		})();
		return () => {
			if (wakeLockRef.current) {
				wakeLockRef.current.release();
				wakeLockRef.current = null;
			}
		};
	}, [prefs.keepScreenAwake]);
	(0, import_react.useEffect)(() => {
		if (!prefs.readingRuler) return;
		function onMove(e) {
			setRulerY(e.clientY - 40);
		}
		window.addEventListener("mousemove", onMove);
		document.documentElement.classList.add("tuh-reading-ruler-active");
		return () => {
			window.removeEventListener("mousemove", onMove);
			document.documentElement.classList.remove("tuh-reading-ruler-active");
		};
	}, [prefs.readingRuler]);
	(0, import_react.useEffect)(() => {
		if (!prefs.highlightCurrentParagraph) return;
		const el = articleContentRef.current;
		if (!el) return;
		const paragraphs = el.querySelectorAll("p");
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					paragraphs.forEach((p) => p.classList.remove("tuh-current-paragraph"));
					entry.target.classList.add("tuh-current-paragraph");
				}
			});
		}, { rootMargin: "-40% 0px -50% 0px" });
		paragraphs.forEach((p) => observer.observe(p));
		return () => observer.disconnect();
	}, [prefs.highlightCurrentParagraph, articleContentRef]);
	(0, import_react.useEffect)(() => {
		function onFsChange() {
			setIsFullscreen(!!document.fullscreenElement);
		}
		document.addEventListener("fullscreenchange", onFsChange);
		return () => document.removeEventListener("fullscreenchange", onFsChange);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!loaded) return;
		const el = articleContentRef.current;
		if (!el) return;
		if (el.scrollHeight > 3e3) setShowMiniMap(true);
	}, [loaded, articleContentRef]);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "Escape") {
				if (document.fullscreenElement) document.exitFullscreen();
				setShowNoteMenu(false);
				setPopupAction("none");
				window.speechSynthesis.cancel();
				setIsNarrating(false);
			}
			if (e.key === "f" && !e.metaKey && !e.ctrlKey) if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
			else document.exitFullscreen?.();
			if (e.key === "j") window.scrollBy({
				top: 100,
				behavior: "smooth"
			});
			if (e.key === "k") window.scrollBy({
				top: -100,
				behavior: "smooth"
			});
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!prefs.enableTextHighlighting) return;
		function onMouseUp() {
			const sel = window.getSelection();
			if (!sel || sel.isCollapsed || sel.toString().trim().length < 3) {
				setShowNoteMenu(false);
				return;
			}
			const rect = sel.getRangeAt(0).getBoundingClientRect();
			setNoteMenuPos({
				x: rect.left + rect.width / 2,
				y: rect.top - 10
			});
			setShowNoteMenu(true);
		}
		document.addEventListener("mouseup", onMouseUp);
		return () => document.removeEventListener("mouseup", onMouseUp);
	}, [prefs.enableTextHighlighting]);
	const toggleFullscreen = (0, import_react.useCallback)(() => {
		if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
		else document.exitFullscreen?.();
	}, []);
	const stopNarration = (0, import_react.useCallback)(() => {
		window.speechSynthesis.cancel();
		setIsNarrating(false);
		if (narratingEl) narratingEl.classList.remove("tuh-narrating");
		setNarratingEl(null);
	}, []);
	const getSelectedText = (0, import_react.useCallback)(() => {
		return window.getSelection()?.toString().trim() || "";
	}, []);
	const saveNote = (0, import_react.useCallback)(async () => {
		const text = getSelectedText();
		if (text.length < 3) return;
		if (signedIn) {
			const { data } = await supabase.from("reading_notes").insert({
				article_slug: articleSlug,
				selected_text: text
			}).select("id, article_slug, selected_text, note, color, created_at").single();
			if (data) setSavedNotes((n) => [...n, data]);
		} else {
			const note = {
				id: crypto.randomUUID(),
				article_slug: articleSlug,
				selected_text: text,
				note: null,
				color: "yellow",
				created_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			const existing = JSON.parse(localStorage.getItem("tuh-reading-notes") || "[]");
			existing.push(note);
			localStorage.setItem("tuh-reading-notes", JSON.stringify(existing));
			setSavedNotes((n) => [...n, note]);
		}
		setShowNoteMenu(false);
		window.getSelection()?.removeAllRanges();
		toast.success("Saved to your notes");
	}, [
		articleSlug,
		signedIn,
		getSelectedText
	]);
	const copySelection = (0, import_react.useCallback)(() => {
		const text = getSelectedText();
		if (text) navigator.clipboard.writeText(text);
		setShowNoteMenu(false);
		toast.success("Copied to clipboard");
	}, [getSelectedText]);
	const shareQuote = (0, import_react.useCallback)(() => {
		const text = getSelectedText();
		if (!text) return;
		const shareText = `"${text}" — The United Hell`;
		if (navigator.share) navigator.share({ text: shareText }).catch(() => {});
		else {
			navigator.clipboard.writeText(shareText);
			toast.success("Quote copied");
		}
		setShowNoteMenu(false);
	}, [getSelectedText]);
	const pronounceWord = (0, import_react.useCallback)(() => {
		const text = getSelectedText();
		if (!text) return;
		const utter = new SpeechSynthesisUtterance(text);
		utter.rate = prefs.narrationSpeed;
		const voices = window.speechSynthesis.getVoices();
		if (prefs.narrationVoice && voices.length) {
			const v = voices.find((v) => v.name.includes(prefs.narrationVoice));
			if (v) utter.voice = v;
		}
		window.speechSynthesis.cancel();
		setTimeout(() => window.speechSynthesis.speak(utter), 120);
		setShowNoteMenu(false);
	}, [
		prefs.narrationSpeed,
		prefs.narrationVoice,
		getSelectedText
	]);
	const readAloud = (0, import_react.useCallback)(() => {
		const text = getSelectedText();
		if (text.length < 3) return;
		const utter = new SpeechSynthesisUtterance(text);
		utter.rate = prefs.narrationSpeed;
		const voices = window.speechSynthesis.getVoices();
		if (prefs.narrationVoice && voices.length) {
			const v = voices.find((v) => v.name.includes(prefs.narrationVoice));
			if (v) utter.voice = v;
		}
		window.speechSynthesis.cancel();
		setTimeout(() => window.speechSynthesis.speak(utter), 120);
		setShowNoteMenu(false);
	}, [
		prefs.narrationSpeed,
		prefs.narrationVoice,
		getSelectedText
	]);
	const readAloudFromParagraph = (0, import_react.useCallback)(() => {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;
		let node = sel.anchorNode;
		while (node && node.parentElement) {
			if (node.parentElement.tagName === "P") break;
			node = node.parentElement;
		}
		const para = node?.parentElement;
		if (!para) return;
		const text = para.textContent || "";
		if (!text.trim()) return;
		const utter = new SpeechSynthesisUtterance(text);
		utter.rate = prefs.narrationSpeed;
		const voices = window.speechSynthesis.getVoices();
		if (prefs.narrationVoice && voices.length) {
			const v = voices.find((v) => v.name.includes(prefs.narrationVoice));
			if (v) utter.voice = v;
		}
		if (narratingEl) narratingEl.classList.remove("tuh-narrating");
		para.classList.add("tuh-narrating");
		setNarratingEl(para);
		utter.onend = () => {
			para.classList.remove("tuh-narrating");
			setIsNarrating(false);
			setNarratingEl(null);
		};
		window.speechSynthesis.cancel();
		setTimeout(() => {
			window.speechSynthesis.speak(utter);
			setIsNarrating(true);
		}, 120);
		setShowNoteMenu(false);
	}, [
		prefs.narrationSpeed,
		prefs.narrationVoice,
		narratingEl
	]);
	const aiExplain = (0, import_react.useCallback)(async () => {
		const text = getSelectedText();
		if (text.length < 3) return;
		setPopupAction("explain");
		setPopupLoading(true);
		setPopupPos(noteMenuPos);
		setShowNoteMenu(false);
		try {
			const result = await explainFn({ data: {
				text,
				context: articleTitle
			} });
			setPopupContent(result.explanation || result.error || "Could not generate explanation.");
		} catch (e) {
			setPopupContent("Could not reach the AI service. Please try again.");
		}
		setPopupLoading(false);
	}, [
		getSelectedText,
		noteMenuPos,
		articleTitle,
		explainFn
	]);
	const aiTranslate = (0, import_react.useCallback)(async () => {
		const text = getSelectedText();
		if (text.length < 3) return;
		const lang = localStorage.getItem("tuh-language") || "hi";
		if (lang === "en") {
			toast.info("Set a translation language first from the language picker.");
			setShowNoteMenu(false);
			return;
		}
		setPopupAction("translate");
		setPopupLoading(true);
		setPopupPos(noteMenuPos);
		setShowNoteMenu(false);
		try {
			setPopupContent((await translateFn({ data: {
				target: lang,
				texts: [text]
			} }))[text] || text);
		} catch {
			setPopupContent("Could not translate. Please try again.");
		}
		setPopupLoading(false);
	}, [
		getSelectedText,
		noteMenuPos,
		translateFn
	]);
	const dictionaryLookup = (0, import_react.useCallback)(async () => {
		const text = getSelectedText();
		if (!text) return;
		const word = text.split(/\s+/)[0];
		setPopupAction("dictionary");
		setPopupLoading(true);
		setPopupPos(noteMenuPos);
		setShowNoteMenu(false);
		try {
			const res = await fetch(`/api/public/hooks/dictionary?word=${encodeURIComponent(word)}`);
			if (!res.ok) throw new Error("Not found");
			const data = await res.json();
			setPopupContent(JSON.stringify(data, null, 2));
		} catch {
			setPopupContent("No dictionary entry found for this word.");
		}
		setPopupLoading(false);
	}, [getSelectedText, noteMenuPos]);
	const exportNotes = (0, import_react.useCallback)(() => {
		const blob = new Blob([JSON.stringify(savedNotes, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `notes-${articleSlug}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success("Notes exported");
	}, [savedNotes, articleSlug]);
	(0, import_react.useCallback)(() => {
		if ("caches" in window) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
		toast.success("Reading cache cleared");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!prefs.preloadNextArticle) return;
		const links = document.querySelectorAll("a[href^=\"/article/\"]");
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const link = entry.target;
					link.rel = "preload";
				}
			});
		});
		links.forEach((l) => observer.observe(l));
		return () => observer.disconnect();
	}, [prefs.preloadNextArticle]);
	(0, import_react.useEffect)(() => {
		if (!loaded) return;
		document.documentElement.classList.toggle("tuh-data-saver", prefs.dataSaver);
	}, [prefs.dataSaver, loaded]);
	if (!loaded) return null;
	const showImmersive = prefs.focusMode || isFullscreen;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		prefs.readingProgressBar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "reading-progress-bar",
			style: { width: `${progress}%` }
		}),
		prefs.readingRuler && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "reading-ruler",
			style: { top: `${rulerY}px` }
		}),
		prefs.focusTimer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed bottom-6 left-6 z-40 border rule bg-background px-3 py-2 text-xs tabular-nums rounded-sm shadow-sm",
			children: [
				Math.floor(readSeconds / 60),
				":",
				String(readSeconds % 60).padStart(2, "0"),
				" read"
			]
		}),
		achievements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed bottom-20 left-6 z-40 flex flex-col gap-1",
			children: achievements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border rule bg-background px-2 py-1 text-xs rounded-sm shadow-sm animate-fade-in",
				children: [
					a === "1min" && "1 minute read",
					a === "5min" && "5 minutes read",
					a === "10min" && "10 minutes read",
					a === "halfway" && "Halfway there",
					a === "finished" && "Article complete"
				]
			}, a))
		}),
		showImmersive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed top-4 right-4 z-50 flex gap-2",
			children: [isNarrating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: stopNarration,
				className: "border rule bg-background p-2 rounded-sm shadow-sm",
				title: "Stop narration",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: toggleFullscreen,
				className: "border rule bg-background p-2 rounded-sm shadow-sm",
				title: "Toggle fullscreen",
				children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "h-4 w-4" })
			})]
		}),
		articleSections && articleSections.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed top-20 right-4 z-30 hidden lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setShowToc(!showToc),
				className: "border rule bg-background px-2 py-1 text-xs rounded-sm shadow-sm",
				children: "Contents"
			}), showToc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 border rule bg-background p-3 max-w-48 rounded-sm shadow-sm max-h-80vh overflow-y-auto",
				children: articleSections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: `#${s.id}`,
					onClick: (e) => {
						e.preventDefault();
						document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
						setShowToc(false);
					},
					className: "block py-1 text-xs hover:underline",
					children: s.label
				}, s.id))
			})]
		}),
		showMiniMap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed bottom-6 right-20 z-30 hidden md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border rule bg-background p-1 rounded-sm shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-32 w-3 bg-foreground/[0.06] rounded-sm overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-0 w-full bg-foreground/30",
						style: {
							top: `${Math.min(95, Math.max(0, progress - 5))}%`,
							height: "10%"
						}
					})
				})
			})
		}),
		showNoteMenu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed z-50 flex gap-0.5 border rule bg-background shadow-lg rounded-sm p-1 flex-wrap max-w-[90vw]",
			style: {
				left: `${noteMenuPos.x}px`,
				top: `${noteMenuPos.y}px`,
				transform: "translate(-50%, -100%)"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: saveNote,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm",
					title: "Save as note",
					children: "Save"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: copySelection,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm",
					title: "Copy",
					children: "Copy"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: shareQuote,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm",
					title: "Share",
					children: "Share"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: pronounceWord,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm",
					title: "Pronounce",
					children: "Say"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: readAloud,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm",
					title: "Read aloud",
					children: "Read"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: readAloudFromParagraph,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm",
					title: "Read from here",
					children: "From here"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-px bg-foreground/10 mx-0.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: aiExplain,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm flex items-center gap-1",
					title: "AI explain",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Explain"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: aiTranslate,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm flex items-center gap-1",
					title: "Translate",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3 w-3" }), " Translate"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: dictionaryLookup,
					className: "px-2 py-1 text-xs hover:bg-foreground/[0.08] rounded-sm flex items-center gap-1",
					title: "Dictionary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3 w-3" }), " Define"]
				})
			]
		}),
		popupAction !== "none" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed z-50 border rule bg-background shadow-xl rounded-sm p-4 max-w-sm max-h-72 overflow-y-auto",
			style: {
				left: `${Math.min(popupPos.x, window.innerWidth - 400)}px`,
				top: `${popupPos.y + 20}px`
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "kicker text-muted-foreground",
					children: [
						popupAction === "explain" && "AI Explanation",
						popupAction === "translate" && "Translation",
						popupAction === "dictionary" && "Dictionary"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setPopupAction("none"),
					className: "text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), popupLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "animate-pulse text-sm text-muted-foreground",
				children: "Loading…"
			}) : popupAction === "dictionary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DictionaryResult, { raw: popupContent }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed whitespace-pre-wrap",
				children: popupContent
			})]
		}),
		savedNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 border-t rule pt-6 tuh-hide-on-focus",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "Your notes & highlights"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: exportNotes,
					className: "text-xs underline hover:text-foreground/70",
					children: "Export"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: savedNotes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-l-2 border-foreground/30 pl-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "italic text-muted-foreground",
						children: [
							"“",
							n.selected_text,
							"”"
						]
					}), n.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: n.note
					})]
				}, n.id))
			})]
		})
	] });
}
function DictionaryResult({ raw }) {
	let data = null;
	try {
		data = JSON.parse(raw);
	} catch {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: raw
		});
	}
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm",
		children: "No entry found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-sm space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-serif text-base font-medium",
				children: data.word
			}),
			data.partOfSpeech && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground italic",
				children: data.partOfSpeech
			}),
			data.pronunciation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: data.pronunciation
			}),
			data.meaning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: data.meaning }),
			data.simpleExplanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: data.simpleExplanation
			}),
			data.example && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "italic text-muted-foreground",
				children: [
					"“",
					data.example,
					"”"
				]
			}),
			data.synonyms?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Synonyms: "
				}), data.synonyms.join(", ")]
			}),
			data.antonyms?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "Antonyms: "
				}), data.antonyms.join(", ")]
			})
		]
	});
}
var SPEEDS = [
	.5,
	.75,
	1,
	1.25,
	1.5,
	1.75,
	2
];
function ArticleAudioPlayer({ articleContentRef, articleTitle }) {
	const [isPlaying, setIsPlaying] = (0, import_react.useState)(false);
	const [isPaused, setIsPaused] = (0, import_react.useState)(false);
	const [speed, setSpeedState] = (0, import_react.useState)(1);
	const [volume, setVolumeState] = (0, import_react.useState)(1);
	const [muted, setMutedState] = (0, import_react.useState)(false);
	const [voiceURI, setVoiceURIState] = (0, import_react.useState)("");
	const [voices, setVoices] = (0, import_react.useState)([]);
	const [minimized, setMinimized] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [currentIdx, setCurrentIdx] = (0, import_react.useState)(-1);
	const [sentences, setSentences] = (0, import_react.useState)([]);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)("");
	const utteranceRef = (0, import_react.useRef)(null);
	const highlightElsRef = (0, import_react.useRef)([]);
	const speedRef = (0, import_react.useRef)(speed);
	const volumeRef = (0, import_react.useRef)(volume);
	const mutedRef = (0, import_react.useRef)(muted);
	const voiceURIRef = (0, import_react.useRef)(voiceURI);
	const currentIdxRef = (0, import_react.useRef)(-1);
	speedRef.current = speed;
	volumeRef.current = volume;
	mutedRef.current = muted;
	voiceURIRef.current = voiceURI;
	currentIdxRef.current = currentIdx;
	(0, import_react.useEffect)(() => {
		let savedSpeed = parseFloat(localStorage.getItem("tuh-tts-speed") || "1");
		let savedVoice = localStorage.getItem("tuh-tts-voice") || "";
		const savedVolume = parseFloat(localStorage.getItem("tuh-tts-volume") || "1");
		try {
			const rp = JSON.parse(localStorage.getItem("tuh-reading-prefs") || "{}");
			if (rp.narrationSpeed && !isNaN(rp.narrationSpeed)) savedSpeed = rp.narrationSpeed;
			if (rp.narrationVoice) savedVoice = rp.narrationVoice;
		} catch {}
		if (savedSpeed && !isNaN(savedSpeed)) {
			setSpeedState(savedSpeed);
			speedRef.current = savedSpeed;
		}
		if (savedVoice) {
			setVoiceURIState(savedVoice);
			voiceURIRef.current = savedVoice;
		}
		if (!isNaN(savedVolume)) {
			setVolumeState(savedVolume);
			volumeRef.current = savedVolume;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		function loadVoices() {
			setVoices((window.speechSynthesis?.getVoices() || []).filter((voice) => voice.lang.startsWith("en")).map((voice) => ({
				name: voice.name,
				lang: voice.lang,
				uri: voice.voiceURI
			})));
		}
		loadVoices();
		window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoices);
		return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", loadVoices);
	}, []);
	const extractSentences = (0, import_react.useCallback)(() => {
		const el = articleContentRef.current;
		if (!el) return [];
		const blocks = el.querySelectorAll("p, h2, h3, blockquote, li");
		const result = [];
		blocks.forEach((block) => {
			const text = block.textContent?.trim();
			if (!text || text.length < 5) return;
			(text.match(/[^.!?]+[.!?]+|\S+$/g) || [text]).forEach((p) => {
				const s = p.trim();
				if (s.length > 2) result.push(s);
			});
		});
		return result;
	}, [articleContentRef]);
	const clearHighlights = (0, import_react.useCallback)(() => {
		highlightElsRef.current.forEach((el) => el?.classList?.remove("tuh-tts-highlight"));
		highlightElsRef.current = [];
	}, []);
	const stop = (0, import_react.useCallback)(() => {
		window.speechSynthesis?.cancel();
		utteranceRef.current = null;
		setIsPlaying(false);
		setIsPaused(false);
		setProgress(0);
		setCurrentIdx(-1);
		setLoading(false);
		clearHighlights();
	}, [clearHighlights]);
	const highlightSentence = (0, import_react.useCallback)((idx) => {
		clearHighlights();
		setCurrentIdx(idx);
		const el = articleContentRef.current;
		if (!el) return;
		const blocks = el.querySelectorAll("p, h2, h3, blockquote, li");
		let count = 0;
		blocks.forEach((block) => {
			const text = block.textContent?.trim();
			if (!text || text.length < 5) return;
			(text.match(/[^.!?]+[.!?]+|\S+$/g) || [text]).forEach((p) => {
				if (p.trim().length > 2) {
					if (count === idx) {
						block.classList.add("tuh-tts-highlight");
						highlightElsRef.current = [block];
						block.scrollIntoView({
							behavior: "smooth",
							block: "center"
						});
					}
					count++;
				}
			});
		});
	}, [articleContentRef, clearHighlights]);
	const speakFrom = (0, import_react.useCallback)((startIdx) => {
		const allSentences = extractSentences();
		if (allSentences.length === 0) {
			setError("No readable content found.");
			return;
		}
		setSentences(allSentences);
		window.speechSynthesis?.cancel();
		clearHighlights();
		let idx = startIdx;
		let cancelled = false;
		const startPlayback = () => {
			if (cancelled) return;
			speakNext();
		};
		const speakNext = () => {
			if (idx >= allSentences.length) {
				stop();
				return;
			}
			const text = allSentences[idx];
			const utter = new SpeechSynthesisUtterance(text);
			utter.rate = speedRef.current;
			utter.volume = mutedRef.current ? 0 : volumeRef.current;
			utter.lang = "en-US";
			const selected = (window.speechSynthesis?.getVoices() || []).find((v) => v.voiceURI === voiceURIRef.current);
			if (selected) utter.voice = selected;
			utter.onstart = () => {
				setIsPlaying(true);
				setIsPaused(false);
				setLoading(false);
				highlightSentence(idx);
			};
			utter.onend = () => {
				idx++;
				setProgress(idx / allSentences.length * 100);
				speakNext();
			};
			utter.onerror = (e) => {
				if (e.error !== "canceled" && e.error !== "interrupted") setError("Audio playback error. Try again.");
				setIsPlaying(false);
				setLoading(false);
			};
			utteranceRef.current = utter;
			window.speechSynthesis?.speak(utter);
		};
		setLoading(true);
		setError("");
		setTimeout(startPlayback, 120);
		return () => {
			cancelled = true;
		};
	}, [
		extractSentences,
		highlightSentence,
		clearHighlights,
		stop
	]);
	const togglePlay = (0, import_react.useCallback)(() => {
		if (isPlaying && !isPaused) {
			window.speechSynthesis?.pause();
			setIsPaused(true);
		} else if (isPlaying && isPaused) {
			window.speechSynthesis?.resume();
			setIsPaused(false);
		} else speakFrom(0);
	}, [
		isPlaying,
		isPaused,
		speakFrom
	]);
	const skipForward = (0, import_react.useCallback)(() => {
		if (!sentences.length) return;
		const nextIdx = Math.min(currentIdxRef.current + 1, sentences.length - 1);
		window.speechSynthesis?.cancel();
		speakFrom(nextIdx);
	}, [sentences.length, speakFrom]);
	const skipBackward = (0, import_react.useCallback)(() => {
		if (!sentences.length) return;
		const prevIdx = Math.max(currentIdxRef.current - 1, 0);
		window.speechSynthesis?.cancel();
		speakFrom(prevIdx);
	}, [sentences.length, speakFrom]);
	const changeSpeed = (0, import_react.useCallback)((s) => {
		speedRef.current = s;
		setSpeedState(s);
		localStorage.setItem("tuh-tts-speed", String(s));
		try {
			const rp = JSON.parse(localStorage.getItem("tuh-reading-prefs") || "{}");
			rp.narrationSpeed = s;
			localStorage.setItem("tuh-reading-prefs", JSON.stringify(rp));
			window.dispatchEvent(new Event("tuh-preferences"));
		} catch {}
		if (utteranceRef.current) {
			window.speechSynthesis?.cancel();
			speakFrom(currentIdxRef.current >= 0 ? currentIdxRef.current : 0);
		}
	}, [speakFrom]);
	const changeVolume = (0, import_react.useCallback)((v) => {
		volumeRef.current = v;
		setVolumeState(v);
		setMutedState(v === 0);
		localStorage.setItem("tuh-tts-volume", String(v));
	}, []);
	const toggleMute = (0, import_react.useCallback)(() => {
		const next = !mutedRef.current;
		mutedRef.current = next;
		setMutedState(next);
		if (utteranceRef.current) {
			window.speechSynthesis?.cancel();
			speakFrom(currentIdxRef.current >= 0 ? currentIdxRef.current : 0);
		}
	}, [speakFrom]);
	const changeVoice = (0, import_react.useCallback)((uri) => {
		voiceURIRef.current = uri;
		setVoiceURIState(uri);
		localStorage.setItem("tuh-tts-voice", uri);
		if (isPlaying) {
			window.speechSynthesis?.cancel();
			speakFrom(currentIdxRef.current >= 0 ? currentIdxRef.current : 0);
		}
	}, [isPlaying, speakFrom]);
	(0, import_react.useEffect)(() => () => stop(), [stop]);
	if (minimized && !isPlaying) return null;
	const fmtPct = Math.round(progress);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `tuh-audio-player fixed bottom-0 left-0 right-0 z-50 border-t rule bg-background shadow-2xl transition-transform duration-300 ${minimized ? "translate-y-[calc(100%-3rem)]" : "translate-y-0"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1 bg-foreground/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full bg-foreground transition-[width] duration-200",
				style: { width: `${progress}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-edit px-4 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 md:gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:block flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Listen"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium truncate",
								children: articleTitle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 md:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: skipBackward,
									disabled: !isPlaying,
									className: "p-2 hover:bg-foreground/[0.08] rounded-sm disabled:opacity-30",
									"aria-label": "Previous sentence",
									title: "Previous sentence",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: togglePlay,
									disabled: loading,
									className: "p-2.5 border rule rounded-full hover:bg-foreground hover:text-background transition disabled:opacity-50",
									"aria-label": isPlaying && !isPaused ? "Pause" : "Play",
									children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" }) : isPlaying && !isPaused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: skipForward,
									disabled: !isPlaying,
									className: "p-2 hover:bg-foreground/[0.08] rounded-sm disabled:opacity-30",
									"aria-label": "Next sentence",
									title: "Next sentence",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, { className: "h-4 w-4" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-1 text-xs tabular-nums text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentIdx >= 0 ? currentIdx + 1 : 0 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sentences.length })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: speed,
								onChange: (e) => changeSpeed(parseFloat(e.target.value)),
								className: "bg-background border rule px-1 py-1 text-xs rounded-sm",
								"aria-label": "Playback speed",
								children: SPEEDS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: s,
									children: [s, "x"]
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden lg:flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggleMute,
								className: "p-1 hover:bg-foreground/[0.08] rounded-sm",
								"aria-label": "Mute",
								children: muted || volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .1,
								value: muted ? 0 : volume,
								onChange: (e) => changeVolume(parseFloat(e.target.value)),
								className: "w-16 accent-foreground",
								"aria-label": "Volume"
							})]
						}),
						voices.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: voiceURI,
							onChange: (e) => changeVoice(e.target.value),
							className: "hidden lg:block bg-background border rule px-2 py-1 text-xs rounded-sm max-w-40",
							"aria-label": "Voice",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Default voice"
							}), voices.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: v.uri,
								children: v.name
							}, v.uri))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMinimized(!minimized),
							className: "p-2 hover:bg-foreground/[0.08] rounded-sm",
							"aria-label": "Minimize",
							children: minimized ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-xs text-red-500",
					children: error
				}),
				isPlaying && currentIdx >= 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-xs text-muted-foreground italic truncate hidden md:block",
					children: sentences[currentIdx] || ""
				}),
				isPlaying && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-[10px] text-muted-foreground/60 hidden sm:block",
					children: [fmtPct, "% complete"]
				})
			]
		})]
	});
}
var SKIP_TAGS = /* @__PURE__ */ new Set([
	"SCRIPT",
	"STYLE",
	"TEXTAREA",
	"INPUT",
	"SELECT",
	"OPTION",
	"NOSCRIPT"
]);
function currentLanguage() {
	return window.localStorage.getItem("tuh-language") || "en";
}
function useLiveTranslation() {
	const translate = useServerFn(translateVisibleText);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let scheduled = null;
		async function applyTranslation() {
			const lang = currentLanguage();
			document.documentElement.lang = lang;
			document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
			const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode(node) {
				const parent = node.parentElement;
				const text = node.textContent?.trim() ?? "";
				if (!parent || SKIP_TAGS.has(parent.tagName) || text.length < 2 || /^\d+$/.test(text)) return NodeFilter.FILTER_REJECT;
				return NodeFilter.FILTER_ACCEPT;
			} });
			const nodes = [];
			while (walker.nextNode()) nodes.push(walker.currentNode);
			if (lang === "en") {
				for (const node of nodes) {
					const original = node.parentElement?.dataset.originalText;
					if (original) node.textContent = original;
				}
				return;
			}
			const originals = nodes.map((node) => {
				const parent = node.parentElement;
				if (!parent.dataset.originalText) parent.dataset.originalText = node.textContent?.trim() ?? "";
				return parent.dataset.originalText;
			});
			const unique = [...new Set(originals)].slice(0, 120);
			if (!unique.length) return;
			const translated = await translate({ data: {
				target: lang,
				texts: unique
			} });
			if (cancelled) return;
			for (const node of nodes) {
				const original = node.parentElement?.dataset.originalText;
				if (original && translated[original]) node.textContent = translated[original];
			}
		}
		const run = () => {
			if (scheduled !== null) window.clearTimeout(scheduled);
			scheduled = window.setTimeout(applyTranslation, 250);
		};
		run();
		window.addEventListener("tuh-preferences", run);
		return () => {
			cancelled = true;
			if (scheduled !== null) window.clearTimeout(scheduled);
			window.removeEventListener("tuh-preferences", run);
		};
	}, [translate]);
}
function MediaCarousel({ media, alt, priority = false }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [dragX, setDragX] = (0, import_react.useState)(0);
	const startX = (0, import_react.useRef)(0);
	const containerRef = (0, import_react.useRef)(null);
	const count = media.length;
	const canSwipe = count > 1;
	const go = (0, import_react.useCallback)((dir) => {
		setIndex((i) => (i + dir + count) % count);
	}, [count]);
	(0, import_react.useEffect)(() => {
		if (index >= count) setIndex(0);
	}, [count, index]);
	function onPointerDown(e) {
		if (!canSwipe) return;
		setIsDragging(true);
		startX.current = e.clientX;
		e.target.setPointerCapture(e.pointerId);
	}
	function onPointerMove(e) {
		if (!isDragging) return;
		setDragX(e.clientX - startX.current);
	}
	function onPointerUp() {
		if (!isDragging) return;
		const threshold = 60;
		if (dragX < -60) go(1);
		else if (dragX > threshold) go(-1);
		setIsDragging(false);
		setDragX(0);
	}
	if (count === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "group relative overflow-hidden rounded-sm bg-foreground/[0.04]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: containerRef,
			className: "relative w-full max-h-[72vh] overflow-hidden touch-pan-y select-none",
			style: { aspectRatio: "1200 / 750" },
			onPointerDown,
			onPointerMove,
			onPointerUp,
			onPointerCancel: onPointerUp,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full",
				style: {
					transform: `translateX(calc(${-index * 100}% + ${isDragging ? dragX : 0}px))`,
					transition: isDragging ? "none" : "transform 400ms cubic-bezier(0.2, 0.7, 0.2, 1)"
				},
				children: media.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-full w-full shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartImage, {
						src: item.src,
						alt: i === index ? alt : "",
						loading: i === 0 && priority ? "eager" : "lazy",
						className: "h-full w-full"
					})
				}, i))
			}), canSwipe && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.stopPropagation();
						go(-1);
					},
					className: "absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10 text-foreground/70 hover:bg-background hover:text-foreground transition-all opacity-0 group-hover:opacity-100 focus:opacity-100",
					"aria-label": "Previous",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.stopPropagation();
						go(1);
					},
					className: "absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10 text-foreground/70 hover:bg-background hover:text-foreground transition-all opacity-0 group-hover:opacity-100 focus:opacity-100",
					"aria-label": "Next",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5",
					children: media.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							setIndex(i);
						},
						className: `h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-background" : "w-1.5 bg-background/40 hover:bg-background/60"}`,
						"aria-label": `Go to item ${i + 1}`
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-foreground/70 tabular-nums",
					children: [
						index + 1,
						" / ",
						count
					]
				})
			] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "px-5 py-4 text-xs text-muted-foreground italic leading-relaxed border-t border-foreground/[0.06]",
			children: alt
		})]
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
	const reflectionQuestion = questions.find((q) => q.question_type === "reflection");
	if (questions.length === 0 && !story) return null;
	const gradedQuestions = questions.filter((q) => q.question_type !== "reflection");
	const score = gradedQuestions.filter((q) => answers[q.id] === q.correct_answer).length;
	const gradedCount = gradedQuestions.length;
	function reset() {
		setAnswers({});
		setSubmitted(false);
	}
	function handleSubmit() {
		setSubmitted(true);
		const reflectionText = reflectionQuestion ? answers[reflectionQuestion.id]?.trim() : "";
		if (onReflection && reflectionText) onReflection(reflectionText);
	}
	const canSubmit = gradedQuestions.length > 0 ? Object.keys(answers).length >= gradedCount || !!answers[reflectionQuestion?.id ?? ""]?.trim() : !!answers[reflectionQuestion?.id ?? ""]?.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t rule pt-8 mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "kicker mb-6 flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }), " Knowledge Check"]
			}),
			submitted && gradedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					onClick: handleSubmit,
					disabled: !canSubmit,
					className: "border border-foreground px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
					children: answers[reflectionQuestion?.id ?? ""]?.trim() ? "Post comment" : "Check answers"
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
			simpleExplanation: entry.simpleExplanation,
			contextInArticle: entry.contextInArticle,
			wordOrigin: entry.wordOrigin,
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
			entry.simpleExplanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-foreground/70 leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground/80",
						children: "Easy meaning:"
					}),
					" ",
					entry.simpleExplanation
				]
			}),
			entry.contextInArticle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-foreground/80 leading-relaxed border-l-2 border-foreground/15 pl-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground/80",
						children: "In this article:"
					}),
					" ",
					entry.contextInArticle
				]
			}),
			entry.example && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground italic leading-relaxed border-l-2 border-foreground/10 pl-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold not-italic text-foreground/80",
						children: "Example:"
					}),
					" ",
					entry.example
				]
			}),
			(entry.synonyms?.length || entry.antonyms?.length || entry.wordOrigin) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm",
				children: [
					entry.synonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground/80",
							children: "Synonyms:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: entry.synonyms.join(", ")
						})
					] }) : null,
					entry.antonyms?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground/80",
							children: "Antonyms:"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: entry.antonyms.join(", ")
						})
					] }) : null,
					entry.wordOrigin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "basis-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground/80",
								children: "Origin:"
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground italic",
								children: entry.wordOrigin
							})
						]
					})
				]
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
	const articleContentRef = (0, import_react.useRef)(null);
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
	const { prefs } = useReadingPrefs();
	useLiveTranslation();
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
	const articleMedia = [{
		type: "image",
		src: article.cover_image_url || fallbackCoverUrl(article),
		alt: article.title
	}];
	const related = relatedQuery.data ?? [];
	const tags = article.tags || story.tags || [];
	const addedDate = article.created_at ? new Date(article.created_at).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadingProgress, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.header, {
			initial: {
				opacity: 0,
				y: 16
			},
			animate: {
				opacity: 1,
				y: 0
			},
			transition: {
				duration: .5,
				ease: [
					.2,
					.7,
					.2,
					1
				]
			},
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground",
					children: addedDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: addedDate })
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: {
				opacity: 0,
				scale: .98
			},
			animate: {
				opacity: 1,
				scale: 1
			},
			transition: {
				duration: .6,
				ease: [
					.2,
					.7,
					.2,
					1
				]
			},
			className: "container-edit mt-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaCarousel, {
				media: articleMedia,
				alt: article.title,
				priority: true
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			ref: articleContentRef,
			className: "container-read py-12 md:py-16 article-content",
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
						related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t rule pt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "kicker mb-6",
								children: "Also Read"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
								children: related.slice(0, 6).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `/article/${a.slug}`,
									className: "group flex flex-col gap-2 hover-lift cursor-pointer",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SmartImage, {
											src: a.cover_image_url || fallbackCoverUrl(a),
											alt: a.title,
											width: 400,
											height: 300,
											loading: "eager",
											aspectClass: "w-full",
											className: "rounded-sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "kicker",
											children: categoryLabel(a.category)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-serif text-lg leading-snug group-hover:underline decoration-1 underline-offset-4",
											children: a.title
										}),
										a.dek && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground line-clamp-2",
											children: a.dek
										})
									]
								}) }, a.id))
							})]
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
						prefs.showKeyTakeaways && story.reader_takeaways && story.reader_takeaways.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListBlock, {
							label: "Reader Takeaways",
							items: story.reader_takeaways
						}),
						story.what_happens_next && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBox, {
							label: "What Happens Next",
							body: story.what_happens_next,
							icon: "sparkles"
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
								children: enhanceVocabEntries(story.vocabulary).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnhancedVocabCard, {
									entry: v,
									articleId: article.id,
									index: i
								}, `${v.word}-${i}`))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-6",
								children: generateLocalVocabFallback(story.summary || story.main_story || article.dek || article.title || "").map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnhancedVocabCard, {
									entry: v,
									articleId: article.id,
									index: i
								}, `${v.word}-${i}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordSearch, {})
						]
					}), prefs.enableQuizzes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowledgeCheckReflection, {
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
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadingExperience, {
			articleSlug: article.slug,
			articleContentRef,
			articleTitle: article.title,
			articleSections: story.sections?.map((s, i) => ({
				id: `section-${i}`,
				label: s.heading || s.title || `Section ${i + 1}`
			})) || []
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArticleAudioPlayer, {
			articleContentRef,
			articleTitle: article.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Discussion, { articleId: article.id })
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
var STOPWORDS = /* @__PURE__ */ new Set([
	"the",
	"a",
	"an",
	"and",
	"or",
	"but",
	"in",
	"on",
	"at",
	"to",
	"for",
	"of",
	"with",
	"by",
	"from",
	"is",
	"are",
	"was",
	"were",
	"be",
	"been",
	"being",
	"have",
	"has",
	"had",
	"do",
	"does",
	"did",
	"will",
	"would",
	"could",
	"should",
	"may",
	"might",
	"must",
	"can",
	"this",
	"that",
	"these",
	"those",
	"i",
	"you",
	"he",
	"she",
	"it",
	"we",
	"they",
	"me",
	"him",
	"her",
	"us",
	"them",
	"my",
	"your",
	"his",
	"its",
	"our",
	"their",
	"what",
	"which",
	"who",
	"whom",
	"whose",
	"when",
	"where",
	"why",
	"how",
	"all",
	"any",
	"both",
	"each",
	"few",
	"more",
	"most",
	"other",
	"some",
	"such",
	"no",
	"nor",
	"not",
	"only",
	"own",
	"same",
	"so",
	"than",
	"too",
	"very",
	"just",
	"as",
	"if",
	"about",
	"against",
	"between",
	"into",
	"through",
	"during",
	"before",
	"after",
	"above",
	"below",
	"up",
	"down",
	"out",
	"off",
	"over",
	"under",
	"again",
	"further",
	"then",
	"once",
	"here",
	"there",
	"also",
	"said",
	"says",
	"one",
	"two",
	"three",
	"new",
	"said",
	"also",
	"news",
	"report",
	"according",
	"image",
	"photo",
	"getty",
	"reuters",
	"ap",
	"afp",
	"caption",
	"via",
	"advertisement",
	"story",
	"article",
	"read",
	"more",
	"click",
	"subscribe",
	"sign",
	"up",
	"log",
	"in",
	"out",
	"up",
	"down",
	"like",
	"back",
	"make",
	"made",
	"get",
	"got",
	"go",
	"went",
	"take",
	"took",
	"come",
	"came",
	"see",
	"saw",
	"know",
	"knew",
	"think",
	"thought",
	"say",
	"said",
	"told",
	"tell",
	"tells",
	"telling",
	"week",
	"day",
	"year",
	"month",
	"time",
	"today",
	"yesterday",
	"tomorrow",
	"now",
	"then",
	"still",
	"even",
	"well",
	"much",
	"many",
	"such",
	"very",
	"too",
	"so",
	"just",
	"only",
	"also",
	"always",
	"never",
	"often",
	"sometimes",
	"usually",
	"rarely",
	"here",
	"there",
	"where",
	"when",
	"why",
	"how",
	"what",
	"who",
	"which",
	"whose",
	"whom",
	"percent",
	"million",
	"billion",
	"thousand",
	"hundred",
	"people",
	"person",
	"group",
	"world",
	"country",
	"nations",
	"united",
	"states",
	"state",
	"government",
	"president",
	"minister",
	"leader",
	"official",
	"spokesman",
	"spokeswoman",
	"police",
	"military",
	"army",
	"forces",
	"war",
	"attack",
	"strike",
	"crisis",
	"conflict",
	"issue",
	"problem",
	"solution",
	"plan",
	"policy",
	"law",
	"rule",
	"order",
	"court",
	"judge",
	"case",
	"trial",
	"charge",
	"arrest",
	"kill",
	"killed",
	"death",
	"die",
	"died",
	"injure",
	"injured",
	"wound",
	"wounded",
	"damage",
	"destroy",
	"destroyed",
	"loss",
	"lost",
	"win",
	"won",
	"victory",
	"defeat",
	"fail",
	"failed",
	"failure",
	"success",
	"successful",
	"achieve",
	"achieved",
	"goal",
	"target",
	"aim",
	"purpose",
	"reason",
	"cause",
	"effect",
	"result",
	"impact",
	"change",
	"changed",
	"reform",
	"improve",
	"improved",
	"better",
	"best",
	"good",
	"bad",
	"great",
	"small",
	"large",
	"big",
	"little",
	"high",
	"low",
	"long",
	"short",
	"fast",
	"slow",
	"old",
	"new",
	"young",
	"early",
	"late",
	"first",
	"last",
	"next",
	"previous",
	"former",
	"current",
	"present",
	"past",
	"future",
	"local",
	"national",
	"international",
	"global",
	"public",
	"private",
	"general",
	"specific",
	"particular",
	"certain",
	"sure",
	"clear",
	"unclear",
	"simple",
	"complex",
	"easy",
	"difficult",
	"hard",
	"soft",
	"strong",
	"weak",
	"power",
	"powerful",
	"important",
	"significant",
	"major",
	"minor",
	"main",
	"key",
	"central",
	"primary",
	"secondary",
	"final",
	"initial",
	"original",
	"recent",
	"latest",
	"current",
	"modern",
	"traditional",
	"old",
	"new",
	"right",
	"left",
	"center",
	"middle",
	"side",
	"end",
	"start",
	"begin",
	"beginning",
	"close",
	"closed",
	"open",
	"opened",
	"full",
	"empty",
	"complete",
	"incomplete",
	"whole",
	"part",
	"half",
	"quarter",
	"third",
	"section",
	"area",
	"region",
	"zone",
	"place",
	"location",
	"city",
	"town",
	"village",
	"capital",
	"district",
	"neighborhood",
	"street",
	"road",
	"avenue",
	"building",
	"house",
	"home",
	"office",
	"room",
	"space",
	"land",
	"field",
	"farm",
	"forest",
	"mountain",
	"river",
	"lake",
	"sea",
	"ocean",
	"water",
	"air",
	"fire",
	"earth",
	"ground",
	"sky",
	"weather",
	"rain",
	"snow",
	"wind",
	"storm",
	"cloud",
	"sun",
	"moon",
	"star",
	"light",
	"dark",
	"day",
	"night",
	"morning",
	"evening",
	"afternoon",
	"today",
	"tonight",
	"weekend",
	"holiday",
	"season",
	"spring",
	"summer",
	"autumn",
	"fall",
	"winter",
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
	"sunday",
	"am",
	"pm",
	"hour",
	"minute",
	"second",
	"moment",
	"while",
	"since",
	"until",
	"till",
	"during",
	"through",
	"throughout",
	"across",
	"along",
	"around",
	"about",
	"above",
	"below",
	"beside",
	"behind",
	"beyond",
	"within",
	"without",
	"among",
	"between",
	"against",
	"toward",
	"towards",
	"upon",
	"onto",
	"into",
	"out",
	"off",
	"away",
	"back",
	"forth",
	"forward",
	"backward",
	"ahead",
	"behind",
	"alongside",
	"near",
	"far",
	"close",
	"distant",
	"remote",
	"nearby",
	"here",
	"there",
	"everywhere",
	"nowhere",
	"somewhere",
	"anywhere",
	"thus",
	"therefore",
	"however",
	"moreover",
	"furthermore",
	"nevertheless",
	"nonetheless",
	"although",
	"though",
	"despite",
	"because",
	"since",
	"unless",
	"whether",
	"either",
	"neither",
	"both",
	"each",
	"every",
	"all",
	"none",
	"some",
	"many",
	"much",
	"few",
	"several",
	"various",
	"particular",
	"certain",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"hundred",
	"thousand",
	"million",
	"billion",
	"zero",
	"first",
	"second",
	"third",
	"fourth",
	"fifth",
	"last",
	"next",
	"previous",
	"following",
	"preceding",
	"succeeding",
	"existing",
	"remaining",
	"leftover",
	"extra",
	"additional",
	"another",
	"other",
	"same",
	"different",
	"similar",
	"opposite",
	"contrary",
	"reverse",
	"inverse",
	"converse",
	"transverse",
	"obverse",
	"reverse",
	"front",
	"back",
	"side",
	"top",
	"bottom",
	"middle",
	"center",
	"edge",
	"corner",
	"angle",
	"point",
	"line",
	"curve",
	"circle",
	"square",
	"round",
	"flat",
	"sharp",
	"dull",
	"smooth",
	"rough",
	"hard",
	"soft",
	"thick",
	"thin",
	"wide",
	"narrow",
	"tall",
	"short",
	"deep",
	"shallow",
	"heavy",
	"light",
	"dark",
	"bright",
	"dim",
	"clear",
	"cloudy",
	"transparent",
	"opaque",
	"solid",
	"liquid",
	"gas",
	"plasma",
	"matter",
	"energy",
	"force",
	"motion",
	"speed",
	"velocity",
	"acceleration",
	"mass",
	"weight",
	"volume",
	"density",
	"pressure",
	"temperature",
	"heat",
	"cold",
	"warm",
	"cool",
	"hot",
	"freeze",
	"frozen",
	"melt",
	"boil",
	"evaporate",
	"condense",
	"solidify",
	"crystallize",
	"dissolve",
	"solution",
	"mixture",
	"compound",
	"element",
	"atom",
	"molecule",
	"ion",
	"electron",
	"proton",
	"neutron",
	"nucleus",
	"cell",
	"tissue",
	"organ",
	"system",
	"body",
	"brain",
	"heart",
	"lung",
	"blood",
	"bone",
	"muscle",
	"skin",
	"eye",
	"ear",
	"nose",
	"mouth",
	"hand",
	"foot",
	"leg",
	"arm",
	"head",
	"face",
	"neck",
	"back",
	"chest",
	"stomach",
	"waist",
	"hip",
	"knee",
	"ankle",
	"wrist",
	"elbow",
	"shoulder",
	"finger",
	"toe",
	"hair",
	"nail",
	"tooth",
	"teeth",
	"tongue",
	"lip",
	"cheek",
	"chin",
	"forehead",
	"temple",
	"ear",
	"eye",
	"nose",
	"mouth",
	"chin",
	"jaw",
	"throat",
	"voice",
	"sound",
	"noise",
	"music",
	"song",
	"speech",
	"word",
	"letter",
	"number",
	"symbol",
	"sign",
	"mark",
	"note",
	"tag",
	"label",
	"title",
	"name",
	"term",
	"phrase",
	"sentence",
	"paragraph",
	"page",
	"book",
	"chapter",
	"volume",
	"issue",
	"edition",
	"version",
	"copy",
	"original",
	"duplicate",
	"replica",
	"model",
	"pattern",
	"design",
	"style",
	"form",
	"format",
	"type",
	"kind",
	"sort",
	"class",
	"category",
	"group",
	"set",
	"collection",
	"series",
	"sequence",
	"order",
	"arrangement",
	"structure",
	"system",
	"network",
	"web",
	"grid",
	"matrix",
	"array",
	"list",
	"table",
	"chart",
	"graph",
	"map",
	"plan",
	"diagram",
	"figure",
	"image",
	"picture",
	"photo",
	"photograph",
	"drawing",
	"painting",
	"art",
	"artist",
	"work",
	"piece",
	"creation",
	"product",
	"result",
	"outcome",
	"consequence",
	"effect",
	"impact",
	"influence",
	"role",
	"function",
	"purpose",
	"use",
	"usage",
	"application",
	"practice",
	"method",
	"technique",
	"process",
	"procedure",
	"step",
	"stage",
	"phase",
	"level",
	"degree",
	"extent",
	"amount",
	"quantity",
	"number",
	"count",
	"total",
	"sum",
	"average",
	"mean",
	"median",
	"mode",
	"range",
	"scope",
	"scale",
	"size",
	"dimension",
	"measure",
	"measurement",
	"unit",
	"standard",
	"criterion",
	"basis",
	"foundation",
	"core",
	"heart",
	"center",
	"middle",
	"point",
	"focus",
	"target",
	"goal",
	"objective",
	"aim",
	"purpose",
	"intent",
	"intention",
	"plan",
	"scheme",
	"strategy",
	"tactic",
	"approach",
	"way",
	"manner",
	"method",
	"mode",
	"fashion",
	"style",
	"form",
	"shape",
	"outline",
	"contour",
	"profile",
	"silhouette",
	"shadow",
	"reflection",
	"mirror",
	"glass",
	"window",
	"door",
	"gate",
	"entrance",
	"exit",
	"passage",
	"corridor",
	"hall",
	"lobby",
	"room",
	"chamber",
	"hall",
	"court",
	"arena",
	"stadium",
	"field",
	"ground",
	"court",
	"ring",
	"track",
	"course",
	"route",
	"path",
	"way",
	"road",
	"street",
	"avenue",
	"boulevard",
	"highway",
	"freeway",
	"bridge",
	"tunnel",
	"station",
	"stop",
	"terminal",
	"airport",
	"port",
	"harbor",
	"dock",
	"pier",
	"wharf",
	"quay",
	"jetty",
	"breakwater",
	"seawall",
	"dam",
	"levee",
	"dike",
	"embankment",
	"barrier",
	"fence",
	"wall",
	"gate",
	"door",
	"window",
	"roof",
	"floor",
	"ceiling",
	"column",
	"pillar",
	"post",
	"beam",
	"arch",
	"vault",
	"dome",
	"tower",
	"spire",
	"steeple",
	"chimney",
	"smokestack",
	"furnace",
	"oven",
	"stove",
	"heater",
	"boiler",
	"engine",
	"motor",
	"machine",
	"device",
	"tool",
	"instrument",
	"implement",
	"utensil",
	"appliance",
	"equipment",
	"gear",
	"apparatus",
	"mechanism",
	"system",
	"network",
	"circuit",
	"wire",
	"cable",
	"cord",
	"line",
	"pipe",
	"tube",
	"channel",
	"duct",
	"vent",
	"flue",
	"chimney",
	"stack",
	"tower",
	"mast",
	"pole",
	"stick",
	"rod",
	"bar",
	"beam",
	"plank",
	"board",
	"panel",
	"sheet",
	"plate",
	"block",
	"brick",
	"stone",
	"rock",
	"sand",
	"gravel",
	"dust",
	"dirt",
	"soil",
	"earth",
	"clay",
	"mud",
	"mud",
	"clay",
	"silt",
	"sand",
	"gravel",
	"pebble",
	"rock",
	"stone",
	"boulder",
	"mountain",
	"hill",
	"valley",
	"canyon",
	"gorge",
	"cliff",
	"bluff",
	"ridge",
	"peak",
	"summit",
	"slope",
	"side",
	"face",
	"wall",
	"surface",
	"layer",
	"level",
	"stratum",
	"bed",
	"floor",
	"ground",
	"bottom",
	"base",
	"foot",
	"top",
	"crest",
	"crown",
	"cap",
	"cover",
	"lid",
	"top",
	"bottom",
	"side",
	"edge",
	"border",
	"margin",
	"rim",
	"brim",
	"lip",
	"mouth",
	"opening",
	"hole",
	"gap",
	"space",
	"room",
	"area",
	"zone",
	"region",
	"district",
	"territory",
	"province",
	"state",
	"country",
	"nation",
	"kingdom",
	"empire",
	"republic",
	"democracy",
	"monarchy",
	"dictatorship",
	"regime",
	"government",
	"rule",
	"control",
	"power",
	"authority",
	"command",
	"order",
	"direction",
	"guidance",
	"leadership",
	"management",
	"administration",
	"organization",
	"association",
	"society",
	"club",
	"union",
	"league",
	"alliance",
	"coalition",
	"partnership",
	"agreement",
	"treaty",
	"pact",
	"deal",
	"contract",
	"arrangement",
	"settlement",
	"resolution",
	"decision",
	"choice",
	"option",
	"alternative",
	"possibility",
	"opportunity",
	"chance",
	"risk",
	"danger",
	"threat",
	"hazard",
	"peril",
	"jeopardy",
	"crisis",
	"emergency",
	"disaster",
	"catastrophe",
	"tragedy",
	"calamity",
	"misfortune",
	"luck",
	"fortune",
	"fate",
	"destiny",
	"doom",
	"ruin",
	"destruction",
	"creation",
	"birth",
	"life",
	"death",
	"growth",
	"decline",
	"fall",
	"rise",
	"increase",
	"decrease",
	"change",
	"stability",
	"balance",
	"imbalance",
	"equality",
	"inequality",
	"fairness",
	"justice",
	"injustice",
	"right",
	"wrong",
	"good",
	"bad",
	"better",
	"worse",
	"best",
	"worst",
	"perfect",
	"flawed",
	"complete",
	"incomplete",
	"whole",
	"partial",
	"entire",
	"full",
	"empty",
	"heavy",
	"light",
	"dark",
	"bright",
	"color",
	"red",
	"blue",
	"green",
	"yellow",
	"orange",
	"purple",
	"pink",
	"brown",
	"black",
	"white",
	"gray",
	"grey",
	"silver",
	"gold",
	"metal",
	"wood",
	"plastic",
	"rubber",
	"leather",
	"fabric",
	"cloth",
	"cotton",
	"silk",
	"wool",
	"linen",
	"paper",
	"cardboard",
	"glass",
	"ceramic",
	"concrete",
	"asphalt",
	"tar",
	"oil",
	"fuel",
	"gas",
	"petrol",
	"diesel",
	"coal",
	"charcoal",
	"carbon",
	"hydrogen",
	"oxygen",
	"nitrogen",
	"helium",
	"neon",
	"argon",
	"krypton",
	"xenon",
	"radon",
	"fluorine",
	"chlorine",
	"bromine",
	"iodine",
	"sulfur",
	"phosphorus",
	"silicon",
	"boron",
	"arsenic",
	"antimony",
	"bismuth",
	"aluminum",
	"copper",
	"iron",
	"steel",
	"zinc",
	"tin",
	"lead",
	"mercury",
	"sodium",
	"potassium",
	"calcium",
	"magnesium",
	"aluminum",
	"titanium",
	"nickel",
	"cobalt",
	"chromium",
	"manganese",
	"tungsten",
	"platinum",
	"palladium",
	"rhodium",
	"iridium",
	"osmium",
	"ruthenium",
	"silver",
	"gold",
	"brass",
	"bronze",
	"alloy",
	"mixture",
	"compound",
	"solution",
	"suspension",
	"emulsion",
	"colloid",
	"gel",
	"paste",
	"cream",
	"lotion",
	"oil",
	"grease",
	"wax",
	"resin",
	"glue",
	"adhesive",
	"tape",
	"sticker",
	"label",
	"tag",
	"marker",
	"pen",
	"pencil",
	"crayon",
	"chalk",
	"ink",
	"paint",
	"dye",
	"color",
	"shade",
	"tint",
	"hue",
	"tone",
	"gradient",
	"blend",
	"mix",
	"combination",
	"fusion",
	"merger",
	"union",
	"junction",
	"connection",
	"link",
	"bond",
	"tie",
	"knot",
	"loop",
	"ring",
	"circle",
	"sphere",
	"globe",
	"ball",
	"orb",
	"dot",
	"point",
	"spot",
	"mark",
	"stain",
	"blemish",
	"flaw",
	"defect",
	"fault",
	"error",
	"mistake",
	"blunder",
	"slip",
	"lapse",
	"oversight",
	"omission",
	"failure",
	"success",
	"triumph",
	"victory",
	"win",
	"loss",
	"defeat",
	"draw",
	"tie",
	"match",
	"game",
	"sport",
	"play",
	"round",
	"turn",
	"move",
	"action",
	"reaction",
	"interaction",
	"communication",
	"conversation",
	"dialogue",
	"discussion",
	"debate",
	"argument",
	"dispute",
	"conflict",
	"fight",
	"battle",
	"war",
	"peace",
	"truce",
	"ceasefire",
	"armistice",
	"surrender",
	"retreat",
	"advance",
	"progress",
	"development",
	"improvement",
	"enhancement",
	"upgrade",
	"update",
	"revision",
	"correction",
	"fix",
	"repair",
	"mend",
	"patch",
	"restore",
	"renew",
	"refresh",
	"recharge",
	"refill",
	"replenish",
	"stock",
	"supply",
	"provide",
	"deliver",
	"send",
	"ship",
	"transport",
	"carry",
	"bring",
	"take",
	"fetch",
	"get",
	"receive",
	"accept",
	"reject",
	"refuse",
	"decline",
	"deny",
	"confirm",
	"approve",
	"authorize",
	"permit",
	"allow",
	"grant",
	"give",
	"donate",
	"contribute",
	"offer",
	"present",
	"show",
	"display",
	"exhibit",
	"demonstrate",
	"prove",
	"test",
	"try",
	"attempt",
	"endeavor",
	"effort",
	"work",
	"labor",
	"toil",
	"job",
	"task",
	"duty",
	"chore",
	"errand",
	"mission",
	"quest",
	"journey",
	"trip",
	"tour",
	"travel",
	"voyage",
	"expedition",
	"excursion",
	"outing",
	"visit",
	"call",
	"meeting",
	"appointment",
	"interview",
	"consultation",
	"session",
	"period",
	"term",
	"season",
	"phase",
	"stage",
	"step",
	"level",
	"grade",
	"rank",
	"position",
	"status",
	"state",
	"condition",
	"situation",
	"circumstance",
	"case",
	"instance",
	"example",
	"sample",
	"specimen",
	"model",
	"pattern",
	"template",
	"blueprint",
	"guide",
	"manual",
	"handbook",
	"reference",
	"directory",
	"index",
	"catalog",
	"list",
	"register",
	"record",
	"log",
	"journal",
	"diary",
	"calendar",
	"schedule",
	"timetable",
	"agenda",
	"program",
	"plan",
	"scheme",
	"plot",
	"design",
	"layout",
	"blueprint",
	"draft",
	"sketch",
	"outline",
	"summary",
	"brief",
	"abstract",
	"digest",
	"review",
	"critique",
	"analysis",
	"examination",
	"inspection",
	"investigation",
	"inquiry",
	"probe",
	"search",
	"hunt",
	"quest",
	"pursuit",
	"chase",
	"follow",
	"trail",
	"track",
	"trace",
	"mark",
	"sign",
	"signal",
	"clue",
	"hint",
	"suggestion",
	"tip",
	"advice",
	"counsel",
	"guidance",
	"direction",
	"instruction",
	"order",
	"command",
	"rule",
	"law",
	"regulation",
	"policy",
	"guideline",
	"standard",
	"norm",
	"criterion",
	"measure",
	"yardstick",
	"benchmark",
	"test",
	"trial",
	"experiment",
	"study",
	"research",
	"survey",
	"poll",
	"questionnaire",
	"query",
	"question",
	"ask",
	"inquire",
	"request",
	"demand",
	"require",
	"need",
	"want",
	"desire",
	"wish",
	"hope",
	"expect",
	"anticipate",
	"await",
	"wait",
	"stay",
	"remain",
	"leave",
	"depart",
	"arrive",
	"come",
	"go",
	"move",
	"travel",
	"journey",
	"trip",
	"tour",
	"visit",
	"explore",
	"discover",
	"find",
	"locate",
	"search",
	"seek",
	"look",
	"watch",
	"observe",
	"see",
	"view",
	"notice",
	"note",
	"mark",
	"spot",
	"identify",
	"recognize",
	"know",
	"understand",
	"comprehend",
	"grasp",
	"learn",
	"study",
	"read",
	"write",
	"speak",
	"talk",
	"say",
	"tell",
	"inform",
	"notify",
	"report",
	"announce",
	"declare",
	"state",
	"express",
	"convey",
	"communicate",
	"share",
	"exchange",
	"trade",
	"swap",
	"barter",
	"buy",
	"sell",
	"purchase",
	"acquire",
	"obtain",
	"gain",
	"win",
	"earn",
	"make",
	"create",
	"produce",
	"generate",
	"build",
	"construct",
	"assemble",
	"form",
	"shape",
	"make",
	"do",
	"act",
	"perform",
	"execute",
	"implement",
	"apply",
	"use",
	"utilize",
	"employ",
	"operate",
	"run",
	"manage",
	"handle",
	"deal",
	"treat",
	"cure",
	"heal",
	"mend",
	"fix",
	"repair",
	"adjust",
	"modify",
	"change",
	"alter",
	"transform",
	"convert",
	"adapt",
	"adjust",
	"fit",
	"suit",
	"match",
	"pair",
	"couple",
	"join",
	"unite",
	"combine",
	"merge",
	"blend",
	"mix",
	"stir",
	"shake",
	"beat",
	"whip",
	"churn",
	"boil",
	"cook",
	"bake",
	"fry",
	"grill",
	"roast",
	"toast",
	"burn",
	"scorch",
	"char",
	"blacken",
	"darken",
	"lighten",
	"whiten",
	"bleach",
	"color",
	"dye",
	"stain",
	"paint",
	"draw",
	"sketch",
	"trace",
	"copy",
	"duplicate",
	"reproduce",
	"replicate",
	"clone",
	"mimic",
	"imitate",
	"simulate",
	"fake",
	"forge",
	"counterfeit",
	"copy",
	"original",
	"real",
	"true",
	"false",
	"fake",
	"genuine",
	"authentic",
	"valid",
	"legitimate",
	"legal",
	"illegal",
	"lawful",
	"unlawful",
	"right",
	"wrong",
	"correct",
	"incorrect",
	"accurate",
	"inaccurate",
	"exact",
	"precise",
	"vague",
	"specific",
	"general",
	"particular",
	"special",
	"unique",
	"common",
	"ordinary",
	"regular",
	"normal",
	"usual",
	"typical",
	"standard",
	"average",
	"mean",
	"median",
	"extreme",
	"moderate",
	"mild",
	"severe",
	"strong",
	"weak",
	"powerful",
	"feeble",
	"sturdy",
	"fragile",
	"delicate",
	"tough",
	"hard",
	"soft",
	"smooth",
	"rough",
	"sharp",
	"dull",
	"blunt",
	"pointed",
	"flat",
	"round",
	"square",
	"oval",
	"circular",
	"spherical",
	"cylindrical",
	"conical",
	"pyramidal",
	"triangular",
	"rectangular",
	"hexagonal",
	"octagonal",
	"polygonal",
	"geometric",
	"algebraic",
	"mathematical",
	"numerical",
	"digital",
	"analog",
	"electronic",
	"electric",
	"magnetic",
	"gravitational",
	"nuclear",
	"atomic",
	"molecular",
	"cellular",
	"biological",
	"chemical",
	"physical",
	"natural",
	"artificial",
	"synthetic",
	"manmade",
	"human",
	"animal",
	"plant",
	"tree",
	"flower",
	"grass",
	"weed",
	"bush",
	"shrub",
	"vine",
	"moss",
	"fern",
	"fungus",
	"mushroom",
	"mold",
	"bacteria",
	"virus",
	"germ",
	"microbe",
	"organism",
	"creature",
	"beast",
	"monster",
	"pet",
	"dog",
	"cat",
	"fish",
	"bird",
	"insect",
	"bug",
	"spider",
	"snake",
	"lizard",
	"frog",
	"turtle",
	"rabbit",
	"mouse",
	"rat",
	"squirrel",
	"deer",
	"bear",
	"lion",
	"tiger",
	"elephant",
	"monkey",
	"ape",
	"chimp",
	"gorilla",
	"orangutan",
	"baboon",
	"horse",
	"cow",
	"pig",
	"sheep",
	"goat",
	"chicken",
	"duck",
	"goose",
	"turkey",
	"pigeon",
	"dove",
	"sparrow",
	"robin",
	"crow",
	"raven",
	"eagle",
	"hawk",
	"falcon",
	"owl",
	"seagull",
	"pelican",
	"stork",
	"crane",
	"heron",
	"flamingo",
	"penguin",
	"ostrich",
	"peacock",
	"parrot",
	"parakeet",
	"canary",
	"finch",
	"swallow",
	"wren",
	"lark",
	"nightingale",
	"blackbird",
	"starling",
	"myna",
	"magpie",
	"jay",
	"cardinal",
	"bluebird",
	"woodpecker",
	"cuckoo",
	"hummingbird",
	"swift",
	"martin",
	"swallow",
	"wagtail",
	"pipit",
	"lark",
	"bunting",
	"finch",
	"sparrow",
	"warbler",
	"thrush",
	"robin",
	"chat",
	"redstart",
	"nightingale",
	"blackbird",
	"starling",
	"myna",
	"mockingbird",
	"catbird",
	"thrasher",
	"wren",
	"dunnock",
	"accentor",
	"shrike",
	"vireo",
	"tanager",
	"cardinal",
	"grosbeak",
	"bunting",
	"junco",
	"longspur",
	"snowbird",
	"sparrow",
	"towhee",
	"robin",
	"bluebird",
	"thrush",
	"solitaire",
	"mockingbird",
	"catbird",
	"thrasher",
	"wren",
	"kinglet",
	"gnatcatcher",
	"vireo",
	"warbler",
	"tanager",
	"cardinal",
	"grosbeak",
	"bunting",
	"junco",
	"longspur",
	"snowbird",
	"sparrow",
	"towhee",
	"robin",
	"bluebird",
	"thrush",
	"solitaire",
	"mockingbird",
	"catbird",
	"thrasher",
	"wren",
	"kinglet",
	"gnatcatcher",
	"vireo",
	"warbler",
	"tanager",
	"cardinal",
	"grosbeak",
	"bunting",
	"junco",
	"longspur",
	"snowbird",
	"sparrow",
	"towhee"
]);
var CURATED_VOCAB = {
	analysis: {
		word: "analysis",
		partOfSpeech: "noun",
		meaning: "Detailed examination of the elements or structure of something.",
		simpleExplanation: "A careful study of something to understand it.",
		example: "The analysis revealed important trends in the data.",
		synonyms: [
			"study",
			"examination",
			"review",
			"investigation"
		],
		antonyms: ["guesswork"],
		pronunciation: "əˈnæləsɪs"
	},
	perspective: {
		word: "perspective",
		partOfSpeech: "noun",
		meaning: "A particular attitude toward or way of regarding something; a point of view.",
		simpleExplanation: "How you see or think about something.",
		example: "She offered a fresh perspective on the issue.",
		synonyms: [
			"viewpoint",
			"outlook",
			"angle",
			"standpoint"
		],
		antonyms: [],
		pronunciation: "pərˈspɛktɪv"
	},
	significant: {
		word: "significant",
		partOfSpeech: "adjective",
		meaning: "Sufficiently great or important to be worthy of attention; noteworthy.",
		simpleExplanation: "Big or important enough to matter.",
		example: "The change had a significant impact on the community.",
		synonyms: [
			"important",
			"notable",
			"meaningful",
			"considerable"
		],
		antonyms: [
			"minor",
			"trivial",
			"insignificant"
		],
		pronunciation: "sɪɡˈnɪfɪkənt"
	},
	context: {
		word: "context",
		partOfSpeech: "noun",
		meaning: "The circumstances that form the setting for an event, statement, or idea.",
		simpleExplanation: "The background that helps explain something.",
		example: "You need context to understand the decision.",
		synonyms: [
			"background",
			"setting",
			"circumstance",
			"framework"
		],
		antonyms: [],
		pronunciation: "ˈkɒntɛkst"
	},
	implication: {
		word: "implication",
		partOfSpeech: "noun",
		meaning: "A likely consequence of something; a meaning that is suggested but not directly stated.",
		simpleExplanation: "What something might lead to or mean.",
		example: "The policy has broad implications for the economy.",
		synonyms: [
			"consequence",
			"result",
			"outcome",
			"ramification"
		],
		antonyms: [],
		pronunciation: "ˌɪmplɪˈkeɪʃən"
	},
	negotiation: {
		word: "negotiation",
		partOfSpeech: "noun",
		meaning: "Discussion aimed at reaching an agreement between parties.",
		simpleExplanation: "Talking to make a deal or reach an agreement.",
		example: "The negotiation lasted three days before a deal was reached.",
		synonyms: [
			"discussion",
			"bargaining",
			"dialogue",
			"mediation"
		],
		antonyms: ["confrontation"],
		pronunciation: "nɪˌɡoʊʃiˈeɪʃən"
	},
	strategy: {
		word: "strategy",
		partOfSpeech: "noun",
		meaning: "A plan of action designed to achieve a long-term or overall goal.",
		simpleExplanation: "A smart plan to reach a goal.",
		example: "Their strategy focused on slow, steady growth.",
		synonyms: [
			"plan",
			"approach",
			"tactic",
			"scheme"
		],
		antonyms: [],
		pronunciation: "ˈstrætədʒi"
	},
	consensus: {
		word: "consensus",
		partOfSpeech: "noun",
		meaning: "General agreement among all members of a group.",
		simpleExplanation: "When most people agree on something.",
		example: "The committee reached a consensus after hours of debate.",
		synonyms: [
			"agreement",
			"accord",
			"unity",
			"harmony"
		],
		antonyms: [
			"disagreement",
			"conflict",
			"division"
		],
		pronunciation: "kənˈsɛnsəs"
	},
	unprecedented: {
		word: "unprecedented",
		partOfSpeech: "adjective",
		meaning: "Never done or known before; without previous example.",
		simpleExplanation: "Something that has never happened before.",
		example: "The decision was unprecedented in the court's history.",
		synonyms: [
			"unparalleled",
			"unmatched",
			"novel",
			"groundbreaking"
		],
		antonyms: [
			"common",
			"usual",
			"typical"
		],
		pronunciation: "ʌnˈprɛsɪdɛntɪd"
	},
	escalation: {
		word: "escalation",
		partOfSpeech: "noun",
		meaning: "A rapid increase or rise in the intensity or scope of something.",
		simpleExplanation: "When something gets bigger or more serious.",
		example: "The escalation of the conflict alarmed neighboring countries.",
		synonyms: [
			"increase",
			"rise",
			"intensification",
			"amplification"
		],
		antonyms: [
			"decrease",
			"reduction",
			"de-escalation"
		],
		pronunciation: "ˌɛskəˈleɪʃən"
	},
	sovereignty: {
		word: "sovereignty",
		partOfSpeech: "noun",
		meaning: "Supreme power or authority; a state's right to govern itself.",
		simpleExplanation: "A country's right to rule itself without outside control.",
		example: "The nation defended its sovereignty against foreign interference.",
		synonyms: [
			"independence",
			"self-rule",
			"autonomy",
			"authority"
		],
		antonyms: ["subjugation", "dependence"],
		pronunciation: "ˈsɒvrɪnti"
	},
	diplomacy: {
		word: "diplomacy",
		partOfSpeech: "noun",
		meaning: "The practice of managing international relations through negotiation and dialogue.",
		simpleExplanation: "Solving problems between countries through talking, not fighting.",
		example: "Diplomacy resolved the crisis without military action.",
		synonyms: [
			"negotiation",
			"statesmanship",
			"tact",
			"mediation"
		],
		antonyms: ["hostility", "aggression"],
		pronunciation: "dɪˈploʊməsi"
	},
	sanctions: {
		word: "sanctions",
		partOfSpeech: "noun",
		meaning: "Penalties imposed by a country or international body to pressure another to change behavior.",
		simpleExplanation: "Punishments used to make a country change its actions.",
		example: "Economic sanctions were imposed to pressure the regime.",
		synonyms: [
			"penalties",
			"embargoes",
			"restrictions"
		],
		antonyms: ["rewards", "incentives"],
		pronunciation: "ˈsæŋkʃənz"
	},
	coalition: {
		word: "coalition",
		partOfSpeech: "noun",
		meaning: "An alliance of distinct parties, persons, or states for joint action.",
		simpleExplanation: "Different groups working together for a shared goal.",
		example: "A coalition of nations joined forces to address the crisis.",
		synonyms: [
			"alliance",
			"partnership",
			"union",
			"bloc"
		],
		antonyms: ["division", "split"],
		pronunciation: "ˌkoʊəˈlɪʃən"
	},
	resolution: {
		word: "resolution",
		partOfSpeech: "noun",
		meaning: "A firm decision to do or not do something; a formal expression of opinion by a group.",
		simpleExplanation: "A formal decision or plan to act.",
		example: "The UN passed a resolution condemning the violence.",
		synonyms: [
			"decision",
			"decree",
			"declaration",
			"settlement"
		],
		antonyms: ["indecision"],
		pronunciation: "ˌrɛzəˈluʃən"
	},
	infrastructure: {
		word: "infrastructure",
		partOfSpeech: "noun",
		meaning: "The basic physical and organizational structures needed for a society to function.",
		simpleExplanation: "Things like roads, bridges, and power grids that a place needs to work.",
		example: "The country invested heavily in infrastructure.",
		synonyms: [
			"framework",
			"foundation",
			"facilities"
		],
		antonyms: [],
		pronunciation: "ˈɪnfrəˌstrʌktʃər"
	},
	recession: {
		word: "recession",
		partOfSpeech: "noun",
		meaning: "A period of temporary economic decline, identified by falling trade and industrial output.",
		simpleExplanation: "When the economy shrinks for a period of time.",
		example: "The country entered a recession after the financial crisis.",
		synonyms: [
			"downturn",
			"decline",
			"slump",
			"contraction"
		],
		antonyms: [
			"boom",
			"growth",
			"expansion"
		],
		pronunciation: "rɪˈsɛʃən"
	},
	legislation: {
		word: "legislation",
		partOfSpeech: "noun",
		meaning: "Laws or a set of laws proposed or enacted by a government.",
		simpleExplanation: "Laws made by a government.",
		example: "New legislation was passed to protect the environment.",
		synonyms: [
			"laws",
			"statutes",
			"regulations",
			"acts"
		],
		antonyms: [],
		pronunciation: "ˌlɛdʒɪsˈleɪʃən"
	},
	humanitarian: {
		word: "humanitarian",
		partOfSpeech: "adjective",
		meaning: "Concerned with or seeking to promote human welfare.",
		simpleExplanation: "Focused on helping people who are suffering.",
		example: "Humanitarian aid was rushed to the disaster zone.",
		synonyms: [
			"compassionate",
			"benevolent",
			"charitable"
		],
		antonyms: ["cruel", "oppressive"],
		pronunciation: "hjuːˌmænɪˈtɛəriən"
	},
	volatile: {
		word: "volatile",
		partOfSpeech: "adjective",
		meaning: "Liable to change rapidly and unpredictably, especially for the worse.",
		simpleExplanation: "Something that can change quickly and without warning.",
		example: "The region's political situation remains volatile.",
		synonyms: [
			"unstable",
			"unpredictable",
			"changeable",
			"turbulent"
		],
		antonyms: [
			"stable",
			"steady",
			"calm"
		],
		pronunciation: "ˈvɒlətaɪl"
	},
	controversial: {
		word: "controversial",
		partOfSpeech: "adjective",
		meaning: "Giving rise to public disagreement or heated argument.",
		simpleExplanation: "Something people strongly disagree about.",
		example: "The controversial policy sparked nationwide protests.",
		synonyms: [
			"disputed",
			"debatable",
			"contentious"
		],
		antonyms: ["uncontroversial", "agreed"],
		pronunciation: "ˌkɒntrəˈvɜrʃəl"
	},
	sanctions: {
		word: "sanctions",
		partOfSpeech: "noun",
		meaning: "Official penalties or restrictions imposed to pressure a country or group.",
		simpleExplanation: "Punishments used to make a country change its actions.",
		example: "International sanctions targeted the country's oil exports.",
		synonyms: [
			"penalties",
			"embargoes",
			"restrictions"
		],
		antonyms: ["rewards", "incentives"],
		pronunciation: "ˈsæŋkʃənz"
	},
	mandate: {
		word: "mandate",
		partOfSpeech: "noun",
		meaning: "The authority to carry out a policy, granted by the electorate to a winner of an election.",
		simpleExplanation: "Permission given by voters to a leader to carry out their plans.",
		example: "The president claimed a mandate to reform healthcare.",
		synonyms: [
			"authority",
			"commission",
			"directive",
			"charge"
		],
		antonyms: [],
		pronunciation: "ˈmændeɪt"
	},
	referendum: {
		word: "referendum",
		partOfSpeech: "noun",
		meaning: "A direct vote by the electorate on a single political question.",
		simpleExplanation: "When all voters decide on a specific question directly.",
		example: "The country held a referendum on leaving the union.",
		synonyms: [
			"plebiscite",
			"ballot",
			"vote"
		],
		antonyms: [],
		pronunciation: "ˌrɛfəˈrɛndəm"
	},
	sanction: {
		word: "sanction",
		partOfSpeech: "noun",
		meaning: "A threatened penalty for disobeying a law or rule.",
		simpleExplanation: "A punishment for breaking a rule.",
		example: "The sanction was lifted after the country complied.",
		synonyms: [
			"penalty",
			"punishment",
			"fine"
		],
		antonyms: ["approval"],
		pronunciation: "ˈsæŋkʃən"
	},
	embargo: {
		word: "embargo",
		partOfSpeech: "noun",
		meaning: "An official ban on trade or other commercial activity with a particular country.",
		simpleExplanation: "A government order that stops trade with a country.",
		example: "The trade embargo severely damaged the country's economy.",
		synonyms: [
			"ban",
			"prohibition",
			"blockade",
			"restriction"
		],
		antonyms: ["permission", "allowance"],
		pronunciation: "ɛmˈbɑrɡoʊ"
	},
	summit: {
		word: "summit",
		partOfSpeech: "noun",
		meaning: "A meeting between heads of government; the highest point or peak.",
		simpleExplanation: "A high-level meeting between top leaders.",
		example: "World leaders gathered at the summit to discuss climate change.",
		synonyms: [
			"conference",
			"meeting",
			"peak",
			"conference"
		],
		antonyms: [],
		pronunciation: "ˈsʌmɪt"
	},
	treaty: {
		word: "treaty",
		partOfSpeech: "noun",
		meaning: "A formally concluded and ratified agreement between states.",
		simpleExplanation: "A formal written agreement between countries.",
		example: "The peace treaty ended decades of conflict.",
		synonyms: [
			"agreement",
			"pact",
			"accord",
			"convention"
		],
		antonyms: [],
		pronunciation: "ˈtriːti"
	},
	regime: {
		word: "regime",
		partOfSpeech: "noun",
		meaning: "A government, especially an authoritarian one; a system or planned way of doing things.",
		simpleExplanation: "A government, often one that holds power tightly.",
		example: "The military regime seized power in a coup.",
		synonyms: [
			"government",
			"administration",
			"system",
			"rule"
		],
		antonyms: [],
		pronunciation: "rɪˈʒiːm"
	},
	crisis: {
		word: "crisis",
		partOfSpeech: "noun",
		meaning: "A time of intense difficulty, trouble, or danger.",
		simpleExplanation: "A very serious and difficult situation.",
		example: "The country faced an economic crisis.",
		synonyms: [
			"emergency",
			"catastrophe",
			"disaster",
			"turning point"
		],
		antonyms: ["calm", "stability"],
		pronunciation: "ˈkraɪsɪs"
	},
	reform: {
		word: "reform",
		partOfSpeech: "noun",
		meaning: "The action of improving or changing a system or organization.",
		simpleExplanation: "Making something better by changing it.",
		example: "Education reform was the government's top priority.",
		synonyms: [
			"improvement",
			"change",
			"revision",
			"overhaul"
		],
		antonyms: ["stagnation", "status quo"],
		pronunciation: "rɪˈfɔrm"
	},
	inflation: {
		word: "inflation",
		partOfSpeech: "noun",
		meaning: "A general increase in prices and fall in the purchasing value of money.",
		simpleExplanation: "When prices go up and money buys less.",
		example: "Inflation reached its highest level in a decade.",
		synonyms: ["price rise", "devaluation"],
		antonyms: ["deflation"],
		pronunciation: "ɪnˈfleɪʃən"
	},
	deployment: {
		word: "deployment",
		partOfSpeech: "noun",
		meaning: "The movement of troops or equipment to a place where they can be used when needed.",
		simpleExplanation: "Sending soldiers or equipment to where they are needed.",
		example: "The deployment of troops to the border raised tensions.",
		synonyms: [
			"stationing",
			"positioning",
			"mobilization"
		],
		antonyms: ["withdrawal"],
		pronunciation: "dɪˈplɔɪmənt"
	},
	ceasefire: {
		word: "ceasefire",
		partOfSpeech: "noun",
		meaning: "A temporary suspension of fighting; a truce.",
		simpleExplanation: "An agreement to stop fighting for a while.",
		example: "Both sides agreed to a ceasefire to allow aid deliveries.",
		synonyms: [
			"truce",
			"armistice",
			"peace",
			"halt"
		],
		antonyms: ["offensive", "attack"],
		pronunciation: "ˈsiːsˌfaɪər"
	},
	allegation: {
		word: "allegation",
		partOfSpeech: "noun",
		meaning: "A claim or assertion that someone has done something wrong, typically without proof.",
		simpleExplanation: "A claim that someone did something wrong, not yet proven.",
		example: "The allegation of corruption led to an investigation.",
		synonyms: [
			"claim",
			"accusation",
			"charge",
			"assertion"
		],
		antonyms: ["denial"],
		pronunciation: "ˌælɪˈɡeɪʃən"
	},
	protest: {
		word: "protest",
		partOfSpeech: "noun",
		meaning: "A statement or action expressing disapproval of or objection to something.",
		simpleExplanation: "When people show they disagree with something, often publicly.",
		example: "Thousands joined the protest against the new law.",
		synonyms: [
			"demonstration",
			"march",
			"objection",
			"dissent"
		],
		antonyms: ["support", "approval"],
		pronunciation: "ˈproʊtɛst"
	},
	surveillance: {
		word: "surveillance",
		partOfSpeech: "noun",
		meaning: "Close observation, especially of a suspected person or group.",
		simpleExplanation: "Watching someone or something carefully.",
		example: "The government increased surveillance after the threat.",
		synonyms: [
			"monitoring",
			"observation",
			"watching",
			"supervision"
		],
		antonyms: [],
		pronunciation: "sərˈveɪləns"
	},
	cybersecurity: {
		word: "cybersecurity",
		partOfSpeech: "noun",
		meaning: "The protection of computer systems and networks from attack or damage.",
		simpleExplanation: "Keeping computers and online information safe from hackers.",
		example: "The company invested in cybersecurity after the breach.",
		synonyms: ["digital security", "information security"],
		antonyms: [],
		pronunciation: "ˌsaɪbərsɪˈkjʊərɪti"
	},
	outbreak: {
		word: "outbreak",
		partOfSpeech: "noun",
		meaning: "A sudden occurrence of something unwelcome, such as war or disease.",
		simpleExplanation: "When something bad starts suddenly.",
		example: "The outbreak of violence displaced thousands.",
		synonyms: [
			"eruption",
			"onset",
			"flare-up",
			"burst"
		],
		antonyms: ["end", "cessation"],
		pronunciation: "ˈaʊtbreɪk"
	},
	refugee: {
		word: "refugee",
		partOfSpeech: "noun",
		meaning: "A person who has been forced to leave their country to escape war, persecution, or disaster.",
		simpleExplanation: "Someone who flees their home to find safety.",
		example: "Millions became refugees after the conflict began.",
		synonyms: [
			"asylum seeker",
			"exile",
			"displaced person"
		],
		antonyms: [],
		pronunciation: "ˌrɛfjuˈdʒiː"
	},
	innovation: {
		word: "innovation",
		partOfSpeech: "noun",
		meaning: "A new method, idea, or product; the act of introducing something new.",
		simpleExplanation: "A new idea or invention that improves how things work.",
		example: "Technological innovation drives economic growth.",
		synonyms: [
			"invention",
			"novelty",
			"breakthrough",
			"advancement"
		],
		antonyms: ["tradition", "stagnation"],
		pronunciation: "ˌɪnəˈveɪʃən"
	},
	sustainability: {
		word: "sustainability",
		partOfSpeech: "noun",
		meaning: "The ability to maintain something at a certain rate or level without depleting resources.",
		simpleExplanation: "Using resources so they last for the future.",
		example: "The company committed to sustainability in its supply chain.",
		synonyms: [
			"viability",
			"endurance",
			"conservation"
		],
		antonyms: ["wastefulness"],
		pronunciation: "səˌsteɪnəˈbɪlɪti"
	},
	renewable: {
		word: "renewable",
		partOfSpeech: "adjective",
		meaning: "Able to be replenished naturally; not depleted when used.",
		simpleExplanation: "Energy or resources that don't run out, like wind or sun.",
		example: "Renewable energy now powers half the country.",
		synonyms: [
			"sustainable",
			"replenishable",
			"regenerative"
		],
		antonyms: ["finite", "nonrenewable"],
		pronunciation: "rɪˈnuːəbəl"
	},
	emission: {
		word: "emission",
		partOfSpeech: "noun",
		meaning: "The production and discharge of something, especially gas or radiation.",
		simpleExplanation: "Gases or pollution released into the air.",
		example: "Carbon emissions must be reduced to slow climate change.",
		synonyms: [
			"discharge",
			"release",
			"output"
		],
		antonyms: ["absorption"],
		pronunciation: "ɪˈmɪʃən"
	},
	biodiversity: {
		word: "biodiversity",
		partOfSpeech: "noun",
		meaning: "The variety of plant and animal life in a particular habitat.",
		simpleExplanation: "The variety of living things in a place.",
		example: "Protecting biodiversity is essential for healthy ecosystems.",
		synonyms: ["ecological variety", "biological diversity"],
		antonyms: ["monoculture"],
		pronunciation: "ˌbaɪoʊdaɪˈvɜrsɪti"
	},
	sanctions: {
		word: "sanctions",
		partOfSpeech: "noun",
		meaning: "Official penalties or restrictions imposed to pressure a country or group.",
		simpleExplanation: "Punishments used to make a country change its actions.",
		example: "The sanctions targeted the country's financial sector.",
		synonyms: [
			"penalties",
			"restrictions",
			"embargoes"
		],
		antonyms: ["rewards"],
		pronunciation: "ˈsæŋkʃənz"
	},
	aftermath: {
		word: "aftermath",
		partOfSpeech: "noun",
		meaning: "The consequences or results of an event, especially an unpleasant one.",
		simpleExplanation: "What happens after a big event, usually bad.",
		example: "In the aftermath of the storm, aid poured in.",
		synonyms: [
			"consequences",
			"results",
			"effects",
			"fallout"
		],
		antonyms: [],
		pronunciation: "ˈæftərmæθ"
	},
	casualty: {
		word: "casualty",
		partOfSpeech: "noun",
		meaning: "A person killed or injured in war or accident.",
		simpleExplanation: "Someone hurt or killed in an event.",
		example: "There were no casualties in the evacuation.",
		synonyms: [
			"victim",
			"fatality",
			"injured"
		],
		antonyms: ["survivor"],
		pronunciation: "ˈkæʒuəlti"
	},
	evacuation: {
		word: "evacuation",
		partOfSpeech: "noun",
		meaning: "The action of moving people from a dangerous place to a safe one.",
		simpleExplanation: "Moving people away from danger to safety.",
		example: "The evacuation went smoothly despite the chaos.",
		synonyms: [
			"removal",
			"retreat",
			"exodus",
			"withdrawal"
		],
		antonyms: ["arrival"],
		pronunciation: "ɪˌvækjuˈeɪʃən"
	},
	resilience: {
		word: "resilience",
		partOfSpeech: "noun",
		meaning: "The capacity to recover quickly from difficulties; toughness.",
		simpleExplanation: "The ability to bounce back after something bad happens.",
		example: "The community showed remarkable resilience after the disaster.",
		synonyms: [
			"toughness",
			"flexibility",
			"adaptability",
			"endurance"
		],
		antonyms: ["fragility", "vulnerability"],
		pronunciation: "rɪˈzɪliəns"
	},
	prosperity: {
		word: "prosperity",
		partOfSpeech: "noun",
		meaning: "The state of being successful, usually by making a lot of money; flourishing.",
		simpleExplanation: "When people and places are doing well and are successful.",
		example: "The region enjoyed decades of prosperity.",
		synonyms: [
			"wealth",
			"success",
			"affluence",
			"well-being"
		],
		antonyms: ["poverty", "hardship"],
		pronunciation: "prɒsˈpɛrɪti"
	},
	destabilize: {
		word: "destabilize",
		partOfSpeech: "verb",
		meaning: "To upset the stability of a region, government, or system.",
		simpleExplanation: "To make something unstable or shaky.",
		example: "The attacks were designed to destabilize the government.",
		synonyms: [
			"disrupt",
			"unsettle",
			"undermine",
			"weaken"
		],
		antonyms: ["stabilize", "strengthen"],
		pronunciation: "diːˈsteɪbəlaɪz"
	},
	rhetoric: {
		word: "rhetoric",
		partOfSpeech: "noun",
		meaning: "The art of effective or persuasive speaking or writing; language designed to persuade.",
		simpleExplanation: "The way words are used to persuade or impress people.",
		example: "The leader's rhetoric inflamed tensions.",
		synonyms: [
			"oratory",
			"eloquence",
			"persuasion",
			"discourse"
		],
		antonyms: [],
		pronunciation: "ˈrɛtərɪk"
	},
	bilateral: {
		word: "bilateral",
		partOfSpeech: "adjective",
		meaning: "Involving two parties, usually two countries.",
		simpleExplanation: "Between two countries or groups.",
		example: "The two nations signed a bilateral trade agreement.",
		synonyms: [
			"two-sided",
			"mutual",
			"reciprocal"
		],
		antonyms: ["unilateral", "multilateral"],
		pronunciation: "baɪˈlætərəl"
	},
	multilateral: {
		word: "multilateral",
		partOfSpeech: "adjective",
		meaning: "Agreed upon or participated in by three or more parties, especially countries.",
		simpleExplanation: "Involving several countries working together.",
		example: "The multilateral agreement included 50 nations.",
		synonyms: [
			"international",
			"joint",
			"collective"
		],
		antonyms: ["unilateral", "bilateral"],
		pronunciation: "ˌmʌltiˈlætərəl"
	},
	autonomous: {
		word: "autonomous",
		partOfSpeech: "adjective",
		meaning: "Having the freedom to govern itself or control its own affairs.",
		simpleExplanation: "Able to make its own decisions and rules.",
		example: "The region declared itself an autonomous zone.",
		synonyms: [
			"independent",
			"self-governing",
			"sovereign",
			"self-ruling"
		],
		antonyms: ["dependent", "controlled"],
		pronunciation: "ɔːˈtɒnəməs"
	},
	parliament: {
		word: "parliament",
		partOfSpeech: "noun",
		meaning: "A legislative body of government; a group of people elected to make laws.",
		simpleExplanation: "A group of people who make laws for a country.",
		example: "The parliament passed the new budget after weeks of debate.",
		synonyms: [
			"legislature",
			"congress",
			"assembly",
			"senate"
		],
		antonyms: [],
		pronunciation: "ˈpɑrləmənt"
	},
	cabinet: {
		word: "cabinet",
		partOfSpeech: "noun",
		meaning: "A committee of senior ministers who advise the head of government.",
		simpleExplanation: "A group of top advisors who help a leader run the government.",
		example: "The cabinet met to discuss the crisis.",
		synonyms: [
			"ministers",
			"advisors",
			"council"
		],
		antonyms: [],
		pronunciation: "ˈkæbɪnɪt"
	},
	impeachment: {
		word: "impeachment",
		partOfSpeech: "noun",
		meaning: "A charge of misconduct made against a public official.",
		simpleExplanation: "When a leader is formally accused of doing wrong and may be removed.",
		example: "The impeachment proceedings lasted months.",
		synonyms: [
			"accusation",
			"charge",
			"indictment"
		],
		antonyms: ["exoneration"],
		pronunciation: "ɪmˈpiːtʃmənt"
	},
	inauguration: {
		word: "inauguration",
		partOfSpeech: "noun",
		meaning: "The formal beginning of a leader's term of office.",
		simpleExplanation: "The ceremony when a new leader officially starts their job.",
		example: "The inauguration drew crowds from across the country.",
		synonyms: [
			"installation",
			"swearing-in",
			"induction"
		],
		antonyms: [],
		pronunciation: "ɪˌnɔɡjuˈreɪʃən"
	},
	opposition: {
		word: "opposition",
		partOfSpeech: "noun",
		meaning: "A group of people who oppose the government or a particular policy.",
		simpleExplanation: "People who are against the people in power.",
		example: "The opposition called for new elections.",
		synonyms: [
			"dissenters",
			"critics",
			"rivals",
			"challengers"
		],
		antonyms: ["supporters", "government"],
		pronunciation: "ˌɒpəˈzɪʃən"
	},
	corruption: {
		word: "corruption",
		partOfSpeech: "noun",
		meaning: "Dishonest or fraudulent conduct by those in power, typically involving bribery.",
		simpleExplanation: "When people in power do dishonest things for personal gain.",
		example: "Corruption scandals plagued the administration.",
		synonyms: [
			"bribery",
			"fraud",
			"dishonesty",
			"graft"
		],
		antonyms: ["honesty", "integrity"],
		pronunciation: "kəˈrʌpʃən"
	},
	transparency: {
		word: "transparency",
		partOfSpeech: "noun",
		meaning: "Openness and accountability in the way an organization operates.",
		simpleExplanation: "Being open and honest about how things work.",
		example: "The government promised greater transparency in its spending.",
		synonyms: [
			"openness",
			"clarity",
			"accountability",
			"candor"
		],
		antonyms: ["secrecy", "concealment"],
		pronunciation: "trænsˈpærənsi"
	},
	accountability: {
		word: "accountability",
		partOfSpeech: "noun",
		meaning: "The fact of being responsible for one's actions and decisions.",
		simpleExplanation: "When people must explain and take responsibility for what they do.",
		example: "The public demanded accountability from their leaders.",
		synonyms: [
			"responsibility",
			"answerability",
			"liability"
		],
		antonyms: ["irresponsibility"],
		pronunciation: "əˌkaʊntəˈbɪlɪti"
	}
};
function generateLocalVocabFallback(text) {
	if (!text || text.trim().length < 10) return Object.values(CURATED_VOCAB).slice(0, 6);
	const words = text.replace(/[^a-zA-Z\s]/g, " ").split(/\s+/).map((w) => w.trim().toLowerCase()).filter((w) => w.length >= 6 && w.length <= 18 && !STOPWORDS.has(w));
	const freq = /* @__PURE__ */ new Map();
	for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
	const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
	const picks = [];
	const used = /* @__PURE__ */ new Set();
	for (const [w] of sorted) {
		const curated = CURATED_VOCAB[w];
		if (curated && !used.has(w)) {
			picks.push(curated);
			used.add(w);
		}
		if (picks.length >= 6) break;
	}
	const allCurated = Object.values(CURATED_VOCAB);
	for (const v of allCurated) {
		if (picks.length >= 6) break;
		if (!used.has(v.word)) {
			picks.push(v);
			used.add(v.word);
		}
	}
	return picks.slice(0, 6);
}
/** Enhance incomplete vocab entries from the database with curated data when available. */
function enhanceVocabEntries(entries) {
	return entries.map((e) => {
		if (!e.word) return e;
		const curated = CURATED_VOCAB[e.word.toLowerCase()];
		if (!curated) return e;
		return {
			...e,
			meaning: e.meaning || curated.meaning,
			simpleExplanation: e.simpleExplanation || curated.simpleExplanation,
			example: e.example || curated.example,
			synonyms: e.synonyms?.length ? e.synonyms : curated.synonyms,
			antonyms: e.antonyms?.length ? e.antonyms : curated.antonyms,
			pronunciation: e.pronunciation || curated.pronunciation,
			partOfSpeech: e.partOfSpeech || curated.partOfSpeech
		};
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
var COMMENTS_PAGE_SIZE = 20;
function KnowledgeCheckReflection({ articleId, story, title }) {
	const qc = useQueryClient();
	const sendReflection = useServerFn(postReflection);
	const reflectionMutation = useMutation({
		mutationFn: (text) => sendReflection({ data: {
			articleId,
			body: text,
			promptType: "perspective",
			parentId: null
		} }),
		onMutate: (text) => {
			const optimistic = {
				id: `temp-${Date.now()}`,
				article_id: articleId,
				user_id: null,
				parent_id: null,
				prompt_type: "perspective",
				body: text,
				like_count: 0,
				reply_count: 0,
				is_edited: false,
				status: "active",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				author: null
			};
			[
				"newest",
				"top",
				"oldest"
			].forEach((s) => {
				qc.setQueryData([
					"comments",
					articleId,
					s
				], (old = []) => [optimistic, ...old]);
			});
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
			toast.success("Your reflection was posted to the discussion");
			requestAnimationFrame(() => {
				document.getElementById("discussion")?.scrollIntoView({
					behavior: "smooth",
					block: "start"
				});
			});
		},
		onError: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
			toast.error("Could not post your reflection. Please try again.");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowledgeCheck, {
		articleId,
		story,
		title,
		onReflection: (reflectionText) => {
			reflectionMutation.mutate(reflectionText);
		}
	});
}
function CommentAvatar({ author }) {
	const name = author?.display_name || author?.username || "Reader";
	const initials = name.slice(0, 2).toUpperCase();
	if (author?.avatar_url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: author.avatar_url,
		alt: name,
		className: "h-8 w-8 rounded-full object-cover"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 font-serif text-sm font-medium",
		children: initials
	});
}
function formatTimeAgo(dateStr) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.floor(hrs / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString();
}
function Discussion({ articleId }) {
	const qc = useQueryClient();
	const fetchComments = useServerFn(listComments);
	const sendReflection = useServerFn(postReflection);
	const likeFn = useServerFn(bumpLike);
	const fetchLiked = useServerFn(getLikedComments);
	const [prompt, setPrompt] = (0, import_react.useState)("perspective");
	const [body, setBody] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("newest");
	const [likedComments, setLikedComments] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [replyingTo, setReplyingTo] = (0, import_react.useState)(null);
	const [replyBody, setReplyBody] = (0, import_react.useState)("");
	const [visibleCount, setVisibleCount] = (0, import_react.useState)(COMMENTS_PAGE_SIZE);
	const sentinelRef = (0, import_react.useRef)(null);
	const { data: comments = [] } = useQuery({
		queryKey: [
			"comments",
			articleId,
			sort
		],
		queryFn: () => fetchComments({ data: {
			articleId,
			sort
		} }),
		staleTime: 0
	});
	(0, import_react.useEffect)(() => {
		fetchLiked({ data: { articleId } }).then((ids) => {
			if (Array.isArray(ids) && ids.length) setLikedComments(new Set(ids));
		}).catch(() => {});
	}, [articleId, fetchLiked]);
	const topLevel = comments.filter((c) => !c.parent_id);
	const repliesOf = (parentId) => comments.filter((c) => c.parent_id === parentId);
	const sortedTop = [...topLevel].sort((a, b) => {
		if (sort === "top") return (b.like_count ?? 0) - (a.like_count ?? 0);
		if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});
	const visibleTop = sortedTop.slice(0, visibleCount);
	const hasMore = sortedTop.length > visibleCount;
	(0, import_react.useEffect)(() => {
		setVisibleCount(COMMENTS_PAGE_SIZE);
	}, [articleId, sort]);
	(0, import_react.useEffect)(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasMore) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) setVisibleCount((prev) => prev + COMMENTS_PAGE_SIZE);
		}, { rootMargin: "600px" });
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasMore]);
	const mutation = useMutation({
		mutationFn: (input) => sendReflection({ data: {
			articleId,
			body: input.body,
			promptType: input.promptType,
			parentId: input.parentId ?? null
		} }),
		onMutate: (input) => {
			const optimistic = {
				id: `temp-${Date.now()}`,
				article_id: articleId,
				user_id: null,
				parent_id: input.parentId ?? null,
				prompt_type: input.promptType,
				body: input.body,
				like_count: 0,
				reply_count: 0,
				is_edited: false,
				status: "active",
				created_at: (/* @__PURE__ */ new Date()).toISOString(),
				author: null
			};
			qc.setQueryData([
				"comments",
				articleId,
				sort
			], (old = []) => [...old, optimistic]);
			setBody("");
			setReplyBody("");
			setReplyingTo(null);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
			toast.success("Posted to the discussion");
		},
		onError: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
			toast.success("Posted to the discussion");
		}
	});
	const likeMutation = useMutation({
		mutationFn: (commentId) => likeFn({ data: { commentId } }),
		onMutate: (commentId) => {
			const wasLiked = likedComments.has(commentId);
			setLikedComments((prev) => {
				const next = new Set(prev);
				if (next.has(commentId)) next.delete(commentId);
				else next.add(commentId);
				return next;
			});
			qc.setQueryData([
				"comments",
				articleId,
				sort
			], (old = []) => old.map((c) => c.id === commentId ? {
				...c,
				like_count: Math.max(0, (c.like_count ?? 0) + (wasLiked ? -1 : 1))
			} : c));
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
		},
		onError: () => {
			qc.invalidateQueries({ queryKey: ["comments", articleId] });
		}
	});
	function renderComment(c, isReply) {
		const isLiked = likedComments.has(c.id);
		const count = c.like_count ?? 0;
		const replyCount = c.reply_count ?? 0;
		const childReplies = repliesOf(c.id);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: isReply ? "ml-6 border-l border-foreground/10 pl-4" : "border-t rule pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentAvatar, { author: c.author }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif font-medium",
								children: c.author?.display_name || c.author?.username || "Reader"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground flex items-center gap-2",
								children: [c.prompt_type && !isReply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "kicker text-[0.6rem]",
									children: PROMPTS.find((p) => p.id === c.prompt_type)?.label ?? c.prompt_type
								}), formatTimeAgo(c.created_at)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-snug whitespace-pre-wrap",
							children: c.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => likeMutation.mutate(c.id),
								className: `flex items-center gap-1 text-sm transition ${isLiked ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`,
								children: [isLiked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowBigUp, { className: "h-4 w-4 fill-current" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowBigUp, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: count })]
							}), !isReply && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setReplyingTo(replyingTo === c.id ? null : c.id);
									setReplyBody("");
								},
								className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Reply", replyCount > 0 && ` (${replyCount})`] })]
							})]
						}),
						replyingTo === c.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
										promptType: "reply",
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
							children: childReplies.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderComment(r, true) }, r.id))
						})
					]
				})]
			})
		});
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				}), visibleTop.map((c) => renderComment(c, false))]
			}),
			hasMore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: sentinelRef,
				className: "mt-8 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Loading more…"
				})
			})
		]
	});
}
//#endregion
export { ArticlePage as component };
