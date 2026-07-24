import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Bugw3wPl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Bvqu24EG.mjs";
import { a as objectType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interactions.functions-DlYS8n9S.js
var toggleLike = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ articleId: stringType().uuid() }).parse(d)).handler(createSsrRpc("137f5ea154602f1772ede27de11a2fdd69fb9f490c204538a330cc9b9bcbfbd0"));
var toggleBookmark = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ articleId: stringType().uuid() }).parse(d)).handler(createSsrRpc("0fb08557df523ca07940ebdc9dcc62c66ec0e1c55e0b942a191ee6b9047f5555"));
var getMyInteractions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ articleIds: arrayType(stringType().uuid()) }).parse(d)).handler(createSsrRpc("fa0cbd6ede72e168910c0d196ecad51e6c133cc3a263313efa796595d486ff30"));
var listMyBookmarks = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("454c7e9205d14eda45b03e6dca9b9a36ce2b79d72bf81f7575ea76cb3652c9a8"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
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
}).parse(d)).handler(createSsrRpc("4f9464f6c5e268b72439f7fb7e58e4ba9fbe7d312f9d0470e6b34862748d089d"));
var saveInterests = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ interests: arrayType(stringType().min(1)).max(30) }).parse(d)).handler(createSsrRpc("3e0c5a60d3635a478c9d9a79daa645b631bf49d62ab3455b8d1322618d25650e"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("99f139f7ab6563e54274bfeea44122dee80fcdc2c401e33dffe8dad33dbdf722"));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
	display_name: stringType().trim().min(1).max(80).optional(),
	username: stringType().trim().min(2).max(40).regex(/^[a-z0-9_]+$/i).optional(),
	bio: stringType().trim().max(400).optional()
}).parse(d)).handler(createSsrRpc("bb0a251087d079129b93b6aa6dc3949acdae68f8a2536522a2843c5b4406f228"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ commentId: stringType().uuid() }).parse(d)).handler(createSsrRpc("230a0aabcf513e3531644fb294f65ca89321a3009398c29b47cc30e1cdd40ddd"));
//#endregion
export { toggleBookmark as a, saveInterests as i, getMyProfile as n, toggleLike as o, listMyBookmarks as r, updateMyProfile as s, getMyInteractions as t };
