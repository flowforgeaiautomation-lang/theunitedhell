import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { a as listArticles } from "./articles.functions-D2OsHuPk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-C88Xg0e_.js
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
