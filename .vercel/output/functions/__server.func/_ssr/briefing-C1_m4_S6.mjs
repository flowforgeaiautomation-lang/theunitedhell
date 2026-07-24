import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { n as getBriefingToday } from "./articles.functions-Cpc-KRJX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-C1_m4_S6.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
