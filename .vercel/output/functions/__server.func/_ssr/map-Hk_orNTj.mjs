import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { i as getCountryStats } from "./articles.functions-C8ZG7BU6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/map-Hk_orNTj.js
var statsQ = queryOptions({
	queryKey: ["country-stats"],
	queryFn: () => getCountryStats()
});
//#endregion
export { statsQ as t };
