import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { s as listArticles } from "./articles.functions-Bi3MxIvE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-DCHVau-5.js
var discoverQuery = (category, country) => queryOptions({
	queryKey: [
		"discover",
		category ?? "all",
		country ?? "world"
	],
	queryFn: () => listArticles({ data: {
		limit: 24,
		offset: 0,
		category,
		country
	} }),
	staleTime: 3e4
});
//#endregion
export { discoverQuery as t };
