import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { i as enumType, n as arrayType, o as objectType, s as stringType, t as anyType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/translation.functions-DGAExFH0.js
var supportedLanguages = [
	"hi",
	"es",
	"fr",
	"de",
	"ar",
	"zh",
	"ja",
	"ru",
	"pt",
	"it",
	"ko",
	"tr",
	"nl",
	"pl",
	"sv",
	"id",
	"vi",
	"th",
	"uk",
	"he"
];
var languageNames = {
	hi: "Hindi",
	es: "Spanish",
	fr: "French",
	de: "German",
	ar: "Arabic",
	zh: "Chinese",
	ja: "Japanese",
	ru: "Russian",
	pt: "Portuguese",
	it: "Italian",
	ko: "Korean",
	tr: "Turkish",
	nl: "Dutch",
	pl: "Polish",
	sv: "Swedish",
	id: "Indonesian",
	vi: "Vietnamese",
	th: "Thai",
	uk: "Ukrainian",
	he: "Hebrew",
	en: "English"
};
var nativeNames = {
	hi: "हिन्दी",
	es: "Español",
	fr: "Français",
	de: "Deutsch",
	ar: "العربية",
	zh: "中文",
	ja: "日本語",
	ru: "Русский",
	pt: "Português",
	it: "Italiano",
	ko: "한국어",
	tr: "Türkçe",
	nl: "Nederlands",
	pl: "Polski",
	sv: "Svenska",
	id: "Bahasa Indonesia",
	vi: "Tiếng Việt",
	th: "ไทย",
	uk: "Українська",
	he: "עברית",
	en: "English"
};
var flags = {
	hi: "🇮🇳",
	es: "🇪🇸",
	fr: "🇫🇷",
	de: "🇩🇪",
	ar: "🇸🇦",
	zh: "🇨🇳",
	ja: "🇯🇵",
	ru: "🇷🇺",
	pt: "🇵🇹",
	it: "🇮🇹",
	ko: "🇰🇷",
	tr: "🇹🇷",
	nl: "🇳🇱",
	pl: "🇵🇱",
	sv: "🇸🇪",
	id: "🇮🇩",
	vi: "🇻🇳",
	th: "🇹🇭",
	uk: "🇺🇦",
	he: "🇮🇱",
	en: "🇬🇧"
};
function getLanguageInfo() {
	return supportedLanguages.map((code) => ({
		code,
		name: languageNames[code] || code,
		nativeName: nativeNames[code] || code,
		flag: flags[code] || ""
	}));
}
function serverClient() {
	return createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "", { auth: {
		persistSession: false,
		autoRefreshToken: false
	} });
}
async function libreTranslate(texts, source, target) {
	const url = process.env.LIBRETRANSLATE_URL;
	if (!url) return null;
	const apiKey = process.env.LIBRETRANSLATE_API_KEY;
	try {
		const results = [];
		for (const text of texts) {
			const body = {
				q: text,
				source: source === "auto" ? "auto" : source,
				target,
				format: "text"
			};
			if (apiKey) body.api_key = apiKey;
			const r = await fetch(`${url}/translate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body)
			});
			if (!r.ok) return null;
			const d = await r.json();
			results.push(d?.translatedText || text);
		}
		return results;
	} catch {
		return null;
	}
}
async function googleTranslate(texts, target) {
	const key = process.env.GOOGLE_TRANSLATE_API_KEY;
	if (!key) return null;
	try {
		const r = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				q: texts,
				target,
				format: "text",
				source: "en"
			})
		});
		if (!r.ok) return null;
		const arr = (await r.json())?.data?.translations;
		if (!Array.isArray(arr) || arr.length !== texts.length) return null;
		return arr.map((t) => t.translatedText);
	} catch {
		return null;
	}
}
async function deeplTranslate(texts, target) {
	const key = process.env.DEEPL_API_KEY;
	if (!key) return null;
	const upper = {
		zh: "ZH",
		hi: "EN",
		ar: "EN"
	}[target] ?? target.toUpperCase();
	if (["HI", "AR"].includes(upper)) return null;
	try {
		const form = new URLSearchParams();
		for (const t of texts) form.append("text", t);
		form.append("target_lang", upper);
		form.append("source_lang", "EN");
		const r = await fetch("https://api-free.deepl.com/v2/translate", {
			method: "POST",
			headers: {
				Authorization: `DeepL-Auth-Key ${key}`,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: form.toString()
		});
		if (!r.ok) return null;
		const arr = (await r.json())?.translations;
		if (!Array.isArray(arr) || arr.length !== texts.length) return null;
		return arr.map((t) => t.text);
	} catch {
		return null;
	}
}
async function aiTranslate(texts, target) {
	const { orChat } = await import("./openrouter.server-DBp1OwsK.mjs");
	const content = await orChat({
		json: true,
		temperature: .1,
		system: `You are a professional translator. Translate each English string into ${languageNames[target] ?? target}. Preserve names, numbers, URLs. Return STRICT JSON: {"translations":[ ... ]} with the same length and order.`,
		prompt: JSON.stringify({ texts })
	});
	let parsed;
	try {
		parsed = JSON.parse(content);
	} catch {
		const m = content.match(/\{[\s\S]*\}/);
		parsed = m ? JSON.parse(m[0]) : null;
	}
	const arr = Array.isArray(parsed?.translations) ? parsed.translations : Array.isArray(parsed) ? parsed : [];
	return texts.map((t, i) => arr[i] || t);
}
async function myMemoryTranslate(texts, target) {
	try {
		const results = [];
		for (const text of texts) {
			const truncated = text.slice(0, 500);
			const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(truncated)}&langpair=en|${target}`, { signal: AbortSignal.timeout(8e3) });
			if (!r.ok) return null;
			const translated = (await r.json())?.responseData?.translatedText;
			if (!translated) return null;
			results.push(translated);
		}
		return results;
	} catch {
		return null;
	}
}
async function doTranslate(texts, source, target) {
	return await libreTranslate(texts, source, target) ?? await googleTranslate(texts, target) ?? await deeplTranslate(texts, target) ?? await myMemoryTranslate(texts, target) ?? await aiTranslate(texts, target);
}
var translateVisibleText_createServerFn_handler = createServerRpc({
	id: "c01eca399d59b4553dd031dd3d6a4cd58ac43a433401ee498f07f5c3e9651449",
	name: "translateVisibleText",
	filename: "src/lib/translation.functions.ts"
}, (opts) => translateVisibleText.__executeServer(opts));
var translateVisibleText = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	target: enumType(supportedLanguages),
	texts: arrayType(stringType().min(1).max(800)).min(1).max(200)
}).parse(d)).handler(translateVisibleText_createServerFn_handler, async ({ data }) => {
	const unique = [...new Set(data.texts.map((t) => t.trim()).filter(Boolean))];
	const translations = await doTranslate(unique, "en", data.target);
	return Object.fromEntries(unique.map((text, i) => [text, translations[i] || text]));
});
var translateArticle_createServerFn_handler = createServerRpc({
	id: "c00fbf3b13ddf77ae97e89cb0013cd89b7a54dd5cc4794ea0d269321e2c15a25",
	name: "translateArticle",
	filename: "src/lib/translation.functions.ts"
}, (opts) => translateArticle.__executeServer(opts));
var translateArticle = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1),
	target: stringType().min(2).max(10),
	title: stringType(),
	dek: stringType().optional(),
	body: stringType().optional(),
	story: anyType().optional()
}).parse(d)).handler(translateArticle_createServerFn_handler, async ({ data }) => {
	const supabase = serverClient();
	const { data: cached } = await supabase.from("article_translations").select("*").eq("article_slug", data.slug).eq("language", data.target).eq("status", "completed").maybeSingle();
	if (cached) return {
		cached: true,
		title: cached.translated_title,
		dek: cached.translated_dek,
		body: cached.translated_body,
		story: cached.translated_story
	};
	const textsToTranslate = [
		data.title,
		data.dek,
		data.body
	].filter(Boolean);
	const storyTexts = [];
	if (data.story && typeof data.story === "object") {
		const story = data.story;
		for (const key of [
			"summary",
			"main_story",
			"bigger_picture",
			"did_you_know",
			"why_it_matters"
		]) if (story[key] && typeof story[key] === "string") storyTexts.push(story[key]);
		for (const key of [
			"reader_takeaways",
			"key_developments",
			"timeline",
			"tags"
		]) if (Array.isArray(story[key])) storyTexts.push(...story[key].filter((x) => typeof x === "string"));
	}
	const allTexts = [...textsToTranslate, ...storyTexts];
	if (allTexts.length === 0) return {
		cached: false,
		title: data.title,
		dek: data.dek,
		body: data.body,
		story: data.story
	};
	const translations = await doTranslate(allTexts, "en", data.target);
	let idx = 0;
	const translatedTitle = translations[idx++] || data.title;
	const translatedDek = data.dek ? translations[idx++] || data.dek : void 0;
	const translatedBody = data.body ? translations[idx++] || data.body : void 0;
	const translatedStoryTexts = translations.slice(idx);
	let storyIdx = 0;
	const translatedStory = data.story ? JSON.parse(JSON.stringify(data.story)) : void 0;
	if (translatedStory && typeof translatedStory === "object") {
		for (const key of [
			"summary",
			"main_story",
			"bigger_picture",
			"did_you_know",
			"why_it_matters"
		]) if (translatedStory[key] && typeof translatedStory[key] === "string") translatedStory[key] = translatedStoryTexts[storyIdx++] || translatedStory[key];
		for (const key of [
			"reader_takeaways",
			"key_developments",
			"timeline",
			"tags"
		]) if (Array.isArray(translatedStory[key])) translatedStory[key] = translatedStory[key].map((item) => typeof item === "string" ? translatedStoryTexts[storyIdx++] || item : item);
	}
	await supabase.from("article_translations").upsert({
		article_slug: data.slug,
		language: data.target,
		translated_title: translatedTitle,
		translated_dek: translatedDek || null,
		translated_body: translatedBody || null,
		translated_story: translatedStory || null,
		status: "completed",
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { onConflict: "article_slug,language" }).then(() => {});
	return {
		cached: false,
		title: translatedTitle,
		dek: translatedDek,
		body: translatedBody,
		story: translatedStory
	};
});
var getTranslationHealth_createServerFn_handler = createServerRpc({
	id: "44f6ad400e42eb9a50c62b602b0468d16f23357e33a8d8cdcd830f72251c1c64",
	name: "getTranslationHealth",
	filename: "src/lib/translation.functions.ts"
}, (opts) => getTranslationHealth.__executeServer(opts));
var getTranslationHealth = createServerFn({ method: "GET" }).handler(getTranslationHealth_createServerFn_handler, async () => {
	const url = process.env.LIBRETRANSLATE_URL;
	if (!url) return {
		status: "degraded",
		libretranslate: false,
		message: "LibreTranslate URL not configured. Using fallback providers (Google/DeepL/AI).",
		languages: getLanguageInfo()
	};
	try {
		const r = await fetch(`${url}/languages`, { signal: AbortSignal.timeout(5e3) });
		if (!r.ok) throw new Error(`HTTP ${r.status}`);
		const langs = await r.json();
		return {
			status: "healthy",
			libretranslate: true,
			url,
			languages: getLanguageInfo(),
			libretranslateLanguages: Array.isArray(langs) ? langs.length : 0
		};
	} catch (e) {
		return {
			status: "degraded",
			libretranslate: false,
			message: `LibreTranslate unreachable: ${e.message}. Using fallback providers.`,
			languages: getLanguageInfo()
		};
	}
});
var getTranslationStats_createServerFn_handler = createServerRpc({
	id: "705dc1a7911851c4ac4fbd0a463018b587a94ef2a8d148bb70098f7aedb1a515",
	name: "getTranslationStats",
	filename: "src/lib/translation.functions.ts"
}, (opts) => getTranslationStats.__executeServer(opts));
var getTranslationStats = createServerFn({ method: "GET" }).handler(getTranslationStats_createServerFn_handler, async () => {
	const supabase = serverClient();
	const { count: total } = await supabase.from("article_translations").select("*", {
		count: "exact",
		head: true
	});
	const { count: completed } = await supabase.from("article_translations").select("*", {
		count: "exact",
		head: true
	}).eq("status", "completed");
	const { count: failed } = await supabase.from("article_translations").select("*", {
		count: "exact",
		head: true
	}).eq("status", "failed");
	const { count: queued } = await supabase.from("translation_queue").select("*", {
		count: "exact",
		head: true
	}).eq("status", "queued");
	return {
		total: total || 0,
		completed: completed || 0,
		failed: failed || 0,
		queued: queued || 0
	};
});
//#endregion
export { getTranslationHealth_createServerFn_handler, getTranslationStats_createServerFn_handler, translateArticle_createServerFn_handler, translateVisibleText_createServerFn_handler };
