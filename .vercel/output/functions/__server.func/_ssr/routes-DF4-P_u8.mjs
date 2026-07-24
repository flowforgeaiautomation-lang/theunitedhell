import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { s as listArticles } from "./articles.functions-D7I7p4z5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DF4-P_u8.js
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
