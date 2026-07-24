import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CDwznI24.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/articles.functions-vu6-QAgH.js
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
	todayOnly: booleanType().optional()
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
var listComments = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ articleId: stringType().uuid() }).parse(d)).handler(createSsrRpc("2a1eed519bd2990e9ab65df8ec1a8f99a98bcec6e7beb304b13bd1a4ed4cdfaa"));
//#endregion
export { listArticles as a, getRelated as i, getBriefingToday as n, listComments as o, getCountryStats as r, searchArticles as s, getArticleBySlug as t };
