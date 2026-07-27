import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-OYEpY1FG.mjs";
import { a as numberType, i as enumType, o as objectType, r as booleanType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/articles.functions--NPxYrSO.js
var listArticles = createServerFn({ method: "GET" }).inputValidator((d) => objectType({
	category: stringType().optional(),
	country: stringType().optional(),
	limit: numberType().int().min(1).max(200).default(24),
	offset: numberType().int().min(0).default(0),
	sort: enumType([
		"recent",
		"trending",
		"most_read",
		"most_saved"
	]).default("recent"),
	todayOnly: booleanType().optional(),
	cursor: stringType().optional()
}).parse(d ?? {})).handler(createSsrRpc("36857d6a82c1e7e5b9e2536fed0747f3206ab853ebd40de19651ad9f63f78ef1"));
createServerFn({ method: "GET" }).handler(createSsrRpc("730a246a03a39b2b38975c4c452bcbc297431eae6e70ae2cd177961704d819e9"));
var getArticleBySlug = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ slug: stringType().min(1) }).parse(d)).handler(createSsrRpc("56247e6ee3d304c48058f8d110f119240330676c76ca2e2c888dd810ae82630f"));
var getRelated = createServerFn({ method: "GET" }).inputValidator((d) => objectType({
	category: stringType(),
	excludeSlug: stringType(),
	limit: numberType().default(4)
}).parse(d)).handler(createSsrRpc("e25c9403148eece084d4cf356a4709b1049a95b5ef6df69d9ef76b41cd4a6ba5"));
var searchArticles = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ q: stringType().min(1).max(120) }).parse(d)).handler(createSsrRpc("cea6f34fe41f972212f336f91b1a36061f64da913b46460ca71d0b4b065b11ca"));
var getCountryStats = createServerFn({ method: "GET" }).handler(createSsrRpc("7ced82e0a899846b32d3f906f31115970b70bff08639c2f6b723e8d23bc05476"));
var getBriefingToday = createServerFn({ method: "GET" }).handler(createSsrRpc("084030a4cd2e817213cd652ce6c8a6044670e0334199c696586ad9083e86d8a8"));
var postReflection = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	articleId: stringType().uuid(),
	body: stringType().trim().min(1).max(4e3),
	promptType: enumType([
		"learned",
		"surprised",
		"question",
		"perspective",
		"reply"
	]).optional(),
	parentId: stringType().uuid().nullable().optional()
}).parse(d)).handler(createSsrRpc("fd11f47ee7ab16c033617d9167295d244d0898504a4ef5cac3620d7fdec3c694"));
var bumpLike = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	commentId: stringType().uuid(),
	userId: stringType().uuid().nullable().optional()
}).parse(d)).handler(createSsrRpc("a99f29f836fc88007b0fd96eba0dc60d4b0cf77f8a87df2b41968f198dbd0ed3"));
var editComment = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	commentId: stringType().uuid(),
	body: stringType().trim().min(1).max(4e3)
}).parse(d)).handler(createSsrRpc("cf1cdac7157a80d3d8e660904338d2a8a48851b7be185d96121c78cb1ce93e17"));
var getLikedComments = createServerFn({ method: "GET" }).inputValidator((d) => objectType({
	articleId: stringType().uuid(),
	userId: stringType().uuid().nullable().optional()
}).parse(d)).handler(createSsrRpc("9fd012611d76e06ad7178d08790237fc82580098437e9480ae3b17fe3503def9"));
var deleteCommentAnon = createServerFn({ method: "POST" }).inputValidator((d) => objectType({ commentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("2e086ce7af653a07e731d4c87fcbedb957daba8b4363dceb296dc7528f30266b"));
createServerFn({ method: "GET" }).inputValidator((d) => objectType({
	slug: stringType().min(1),
	title: stringType(),
	category: stringType()
}).parse(d)).handler(createSsrRpc("7e967bd6e25512f886a6238ee62a59673646afe9217936f4e5edf813bb90f109"));
var listComments = createServerFn({ method: "GET" }).inputValidator((d) => objectType({
	articleId: stringType().uuid(),
	sort: enumType([
		"newest",
		"oldest",
		"top"
	]).optional()
}).parse(d)).handler(createSsrRpc("2a1eed519bd2990e9ab65df8ec1a8f99a98bcec6e7beb304b13bd1a4ed4cdfaa"));
//#endregion
export { getBriefingToday as a, getRelated as c, postReflection as d, searchArticles as f, getArticleBySlug as i, listArticles as l, deleteCommentAnon as n, getCountryStats as o, editComment as r, getLikedComments as s, bumpLike as t, listComments as u };
