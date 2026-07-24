import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bugw3wPl.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-Da1n484Q.js
var generateArticles_createServerFn_handler = createServerRpc({
	id: "7858f42d6fefa52dcb026796ac7b78c7e076ac3a534028e635b7948f3da6ca83",
	name: "generateArticles",
	filename: "src/lib/ai.functions.ts"
}, (opts) => generateArticles.__executeServer(opts));
var generateArticles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	category: stringType().optional(),
	count: numberType().int().min(1).max(4).default(2)
}).parse(d)).handler(generateArticles_createServerFn_handler, async ({ data }) => {
	const { runIngestion } = await import("./ingestion.server-CMWMEmXI.mjs");
	return { inserted: (await runIngestion({
		maxItems: Math.max(6, data.count * 6),
		priorityCategory: data.category,
		mode: "manual"
	})).inserted };
});
var curateNow_createServerFn_handler = createServerRpc({
	id: "0ebedad069360d71db6247cd2d58f1e8c77399a0c27e1ab977dbeaceadf1f90e",
	name: "curateNow",
	filename: "src/lib/ai.functions.ts"
}, (opts) => curateNow.__executeServer(opts));
var curateNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	maxItems: numberType().int().min(1).max(120).default(36),
	category: stringType().optional()
}).parse(d ?? {})).handler(curateNow_createServerFn_handler, async ({ data }) => {
	const { runIngestion } = await import("./ingestion.server-CMWMEmXI.mjs");
	return await runIngestion({
		maxItems: data.maxItems,
		priorityCategory: data.category,
		mode: "manual"
	});
});
var curateNowPublic_createServerFn_handler = createServerRpc({
	id: "589fffc6fa735bcd9b364b87a2f2d54f37da73c875a78adf3a0f08bd5fd43181",
	name: "curateNowPublic",
	filename: "src/lib/ai.functions.ts"
}, (opts) => curateNowPublic.__executeServer(opts));
var curateNowPublic = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	maxItems: numberType().int().min(1).max(20).default(12),
	category: stringType().optional()
}).parse(d ?? {})).handler(curateNowPublic_createServerFn_handler, async ({ data }) => {
	const { runIngestion } = await import("./ingestion.server-CMWMEmXI.mjs");
	return await runIngestion({
		maxItems: data.maxItems,
		priorityCategory: data.category,
		mode: "cron"
	});
});
var reprocessArticles_createServerFn_handler = createServerRpc({
	id: "47d1cb86cc61954a90971be65a157f4b2abf74b0b237cebf7b150bfb94e007ac",
	name: "reprocessArticles",
	filename: "src/lib/ai.functions.ts"
}, (opts) => reprocessArticles.__executeServer(opts));
var reprocessArticles = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ limit: numberType().int().min(1).max(20).default(8) }).parse(d ?? {})).handler(reprocessArticles_createServerFn_handler, async ({ data }) => {
	const { reprocessBatch } = await import("./ingestion.server-CMWMEmXI.mjs");
	return await reprocessBatch({ limit: data.limit });
});
//#endregion
export { curateNowPublic_createServerFn_handler, curateNow_createServerFn_handler, generateArticles_createServerFn_handler, reprocessArticles_createServerFn_handler };
