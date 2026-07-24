import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { n as getBriefingToday } from "./articles.functions-BffoZYxd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-DNjM--xm.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
