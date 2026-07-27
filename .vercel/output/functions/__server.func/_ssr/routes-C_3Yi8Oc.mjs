import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { s as listArticles } from "./articles.functions-C8ZG7BU6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C_3Yi8Oc.js
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
