import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { a as getCountryStats } from "./articles.functions-CnYBcSi1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-DZMRSHWT.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
