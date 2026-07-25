import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CU_Te3Ci.mjs";
import { a as objectType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/translation.functions-C6_-lJzL.js
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
	"pt"
];
var translateVisibleText = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	target: enumType(supportedLanguages),
	texts: arrayType(stringType().min(1).max(800)).min(1).max(200)
}).parse(d)).handler(createSsrRpc("c01eca399d59b4553dd031dd3d6a4cd58ac43a433401ee498f07f5c3e9651449"));
//#endregion
export { translation_functions_exports as n, translateVisibleText as t };
