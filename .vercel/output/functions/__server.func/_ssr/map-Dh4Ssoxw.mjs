import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { o as getCountryStats } from "./articles.functions-6Skgj8qv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-Dh4Ssoxw.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
