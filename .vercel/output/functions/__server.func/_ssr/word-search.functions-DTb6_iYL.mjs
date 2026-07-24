import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { n as lookupWord, t as getPopularWords } from "./dictionary.server-BOE7fQZZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/word-search.functions-DTb6_iYL.js
var searchWord_createServerFn_handler = createServerRpc({
	id: "86098e590df031882825a5ed7975a33d48a0e93afb0a3551b8333feb026daf94",
	name: "searchWord",
	filename: "src/lib/word-search.functions.ts"
}, (opts) => searchWord.__executeServer(opts));
var searchWord = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ word: stringType().min(1).max(80) }).parse(d)).handler(searchWord_createServerFn_handler, async ({ data }) => {
	const result = await lookupWord(data.word);
	if (!result) return {
		found: false,
		word: data.word
	};
	return {
		found: true,
		entry: result
	};
});
var popularWords_createServerFn_handler = createServerRpc({
	id: "ba67cbfced7aa6abaa5cc5f07ff4d46b5fe10cf3a828f677d33b5e8bfa8854a5",
	name: "popularWords",
	filename: "src/lib/word-search.functions.ts"
}, (opts) => popularWords.__executeServer(opts));
var popularWords = createServerFn({ method: "GET" }).inputValidator((d) => objectType({ limit: numberType().int().min(1).max(20).default(8) }).parse(d ?? {})).handler(popularWords_createServerFn_handler, async ({ data }) => {
	return await getPopularWords(data.limit);
});
//#endregion
export { popularWords_createServerFn_handler, searchWord_createServerFn_handler };
