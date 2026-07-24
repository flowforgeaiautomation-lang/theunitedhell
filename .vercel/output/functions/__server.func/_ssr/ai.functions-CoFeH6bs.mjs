import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bugw3wPl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-CZdxbgFJ.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-CoFeH6bs.js
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	category: stringType().optional(),
	count: numberType().int().min(1).max(4).default(2)
}).parse(d)).handler(createSsrRpc("7858f42d6fefa52dcb026796ac7b78c7e076ac3a534028e635b7948f3da6ca83"));
var curateNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	maxItems: numberType().int().min(1).max(120).default(36),
	category: stringType().optional()
}).parse(d ?? {})).handler(createSsrRpc("0ebedad069360d71db6247cd2d58f1e8c77399a0c27e1ab977dbeaceadf1f90e"));
var curateNowPublic = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	maxItems: numberType().int().min(1).max(20).default(12),
	category: stringType().optional()
}).parse(d ?? {})).handler(createSsrRpc("589fffc6fa735bcd9b364b87a2f2d54f37da73c875a78adf3a0f08bd5fd43181"));
var reprocessArticles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ limit: numberType().int().min(1).max(20).default(8) }).parse(d ?? {})).handler(createSsrRpc("47d1cb86cc61954a90971be65a157f4b2abf74b0b237cebf7b150bfb94e007ac"));
//#endregion
export { curateNowPublic as n, reprocessArticles as r, curateNow as t };
