import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { r as getCountryStats } from "./articles.functions-DfYOMjFZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-B8KwCezB.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
