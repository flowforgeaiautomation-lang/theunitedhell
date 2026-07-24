import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { a as getCountryStats } from "./articles.functions-Bi3MxIvE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-BVaRKLU2.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
