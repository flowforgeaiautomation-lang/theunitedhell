import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-C7DgGFmG.mjs";
import { i as enumType, n as arrayType, o as objectType, s as stringType, t as anyType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/translation.functions-BINK6kQJ.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var translation_functions_exports = /* @__PURE__ */ __exportAll({ translateVisibleText: () => translateVisibleText });
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
var translateVisibleText = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	target: enumType(supportedLanguages),
	texts: arrayType(stringType().min(1).max(800)).min(1).max(200)
}).parse(d)).handler(createSsrRpc("c01eca399d59b4553dd031dd3d6a4cd58ac43a433401ee498f07f5c3e9651449"));
createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	slug: stringType().min(1),
	target: stringType().min(2).max(10),
	title: stringType(),
	dek: stringType().optional(),
	body: stringType().optional(),
	story: anyType().optional()
}).parse(d)).handler(createSsrRpc("c00fbf3b13ddf77ae97e89cb0013cd89b7a54dd5cc4794ea0d269321e2c15a25"));
createServerFn({ method: "GET" }).handler(createSsrRpc("44f6ad400e42eb9a50c62b602b0468d16f23357e33a8d8cdcd830f72251c1c64"));
createServerFn({ method: "GET" }).handler(createSsrRpc("705dc1a7911851c4ac4fbd0a463018b587a94ef2a8d148bb70098f7aedb1a515"));
//#endregion
export { translation_functions_exports as n, translateVisibleText as t };
