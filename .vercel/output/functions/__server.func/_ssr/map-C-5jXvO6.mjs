import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { r as getCountryStats } from "./articles.functions-D2OsHuPk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-C-5jXvO6.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
