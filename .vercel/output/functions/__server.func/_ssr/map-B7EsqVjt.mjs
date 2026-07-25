import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { o as getCountryStats } from "./articles.functions-DnfzX_NI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-B7EsqVjt.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
