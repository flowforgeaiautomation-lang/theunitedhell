import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { a as listArticles } from "./articles.functions-BffoZYxd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DrGFRh8s.js
var homeQuery = (category, country) => queryOptions({
	queryKey: [
		"home",
		category ?? "all",
		country ?? "world"
	],
	queryFn: () => listArticles({ data: {
		limit: 24,
		offset: 0,
		category,
		country,
		todayOnly: true
	} }),
	staleTime: 3e4
});
//#endregion
export { homeQuery as t };
