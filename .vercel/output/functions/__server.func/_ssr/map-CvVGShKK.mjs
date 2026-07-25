import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { s as getCountryStats } from "./articles.functions-CLywbWRH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-CvVGShKK.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
