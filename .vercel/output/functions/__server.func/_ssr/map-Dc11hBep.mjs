import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { r as getCountryStats } from "./articles.functions-vu6-QAgH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-Dc11hBep.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
