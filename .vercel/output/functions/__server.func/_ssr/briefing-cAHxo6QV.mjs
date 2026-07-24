import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { i as getBriefingToday } from "./articles.functions-CnYBcSi1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-cAHxo6QV.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
