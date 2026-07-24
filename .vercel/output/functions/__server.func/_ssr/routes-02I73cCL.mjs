import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { l as listArticles } from "./articles.functions-BVWgywFM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-02I73cCL.js
var homeQuery = (category, country) => queryOptions({
	queryKey: [
		"home",
		category ?? "all",
		country ?? "world"
	],
	queryFn: () => listArticles({ data: {
		limit: 24,
		category,
		country,
		todayOnly: true
	} }),
	staleTime: 3e4
});
//#endregion
export { homeQuery as t };
