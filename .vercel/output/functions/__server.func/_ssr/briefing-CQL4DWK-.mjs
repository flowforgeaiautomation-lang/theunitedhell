import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { o as getBriefingToday } from "./articles.functions-CLywbWRH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-CQL4DWK-.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
