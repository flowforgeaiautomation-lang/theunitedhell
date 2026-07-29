import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { i as getCountryStats } from "./articles.functions-mUlf6cD6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-diZha0or.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
