import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { orChat } from "./openrouter.server-qFv0nSp-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reading-ai.functions-DxC9m3wd.js
/**
* AI Explain on Selection — uses the existing AI gateway to explain any
* selected text in the context of the article. Returns plain text.
*/
var aiExplainText_createServerFn_handler = createServerRpc({
	id: "f84fb5e1dca0f07bdb04ffb7d28c889e44775014654caf5ca46469098977c04b",
	name: "aiExplainText",
	filename: "src/lib/reading-ai.functions.ts"
}, (opts) => aiExplainText.__executeServer(opts));
var aiExplainText = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	text: stringType().min(1).max(2e3),
	context: stringType().max(2e3).optional()
}).parse(d)).handler(aiExplainText_createServerFn_handler, async ({ data }) => {
	const system = `You are a helpful reading assistant for a news platform called "The United Hell". 
Explain the user's selected text clearly and concisely in 2-3 sentences. 
If the text is a word, define it. If it's a phrase or sentence, explain what it means in context.
Do not use markdown. Plain text only.`;
	const prompt = data.context ? `Article context: ${data.context.slice(0, 500)}\n\nExplain this text: "${data.text}"` : `Explain this text: "${data.text}"`;
	try {
		return { explanation: (await orChat({
			system,
			prompt,
			temperature: .3
		})).trim() };
	} catch (e) {
		return {
			explanation: "",
			error: e.message
		};
	}
});
var aiTranslateSelection_createServerFn_handler = createServerRpc({
	id: "152784e518e0f7134b537a769609dba69842bbac694cd422cb55b47cd9e775f4",
	name: "aiTranslateSelection",
	filename: "src/lib/reading-ai.functions.ts"
}, (opts) => aiTranslateSelection.__executeServer(opts));
var aiTranslateSelection = createServerFn({ method: "POST" }).inputValidator((d) => objectType({
	text: stringType().min(1).max(2e3),
	target: stringType().min(2).max(10)
}).parse(d)).handler(aiTranslateSelection_createServerFn_handler, async ({ data }) => {
	const { translateVisibleText } = await import("./translation.functions-rYkBJSd-.mjs").then((n) => n.n);
	return { translation: (await translateVisibleText({ data: {
		target: data.target,
		texts: [data.text]
	} }))[data.text] || data.text };
});
//#endregion
export { aiExplainText_createServerFn_handler, aiTranslateSelection_createServerFn_handler };
