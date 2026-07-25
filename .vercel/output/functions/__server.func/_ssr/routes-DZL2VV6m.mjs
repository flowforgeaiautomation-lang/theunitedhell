import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { u as listArticles } from "./articles.functions-CLywbWRH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DZL2VV6m.js
var homeQuery = (category, country) => queryOptions({
	queryKey: [
		"home",
		category ?? "all",
		country ?? "world"
	],
	queryFn: () => listArticles({ data: {
		limit: 24,
		category,
		country
	} }),
	staleTime: 3e4
});
//#endregion
export { homeQuery as t };
