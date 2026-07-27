import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bugw3wPl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-BIkGSVX4.mjs";
import { i as enumType, n as arrayType, o as objectType, s as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz.functions-TfNeA-Iz.js
createServerFn({ method: "GET" }).inputValidator((d) => objectType({ articleId: stringType().uuid() }).parse(d)).handler(createSsrRpc("3f411a5a86e1b94831a0a4c65b6d7be325d72f6e16bfcaafd1eea5420eba2d40"));
var saveWord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	word: stringType().min(1).max(100),
	meaning: stringType().optional(),
	pronunciation: stringType().optional(),
	partOfSpeech: stringType().optional(),
	example: stringType().optional(),
	synonyms: arrayType(stringType()).optional(),
	antonyms: arrayType(stringType()).optional(),
	simpleExplanation: stringType().optional(),
	contextInArticle: stringType().optional(),
	wordOrigin: stringType().optional(),
	articleId: stringType().uuid().optional(),
	difficulty: enumType([
		"beginner",
		"intermediate",
		"advanced"
	]).default("intermediate")
}).parse(d)).handler(createSsrRpc("9f2f6ba40525e8198b118ea0792a6dd5b091e0e918ad20deaa2ec04e656768dc"));
var unsaveWord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ word: stringType().min(1).max(100) }).parse(d)).handler(createSsrRpc("98f0758b4436662ac49e7cd7349646eec144ced754078fceff93813f6eecbb8c"));
var listSavedWords = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("c9ea2b6c2c8c2926151fc15aabcb729a89c2bd8dcfb93cc940482adffed6c282"));
var checkSavedWord = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ word: stringType().min(1).max(100) }).parse(d)).handler(createSsrRpc("baeae8ce0f95a331573919e9f2d39c15914c425568f97eaedbf2166a0ed9815b"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ commentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("3818bce773c3be4ba554055b02c3855cb1a43083d49b2ccec573ca368210b885"));
//#endregion
export { unsaveWord as i, listSavedWords as n, saveWord as r, checkSavedWord as t };
