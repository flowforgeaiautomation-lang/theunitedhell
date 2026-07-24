import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { i as getBriefingToday } from "./articles.functions-Bi3MxIvE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-C7r6St61.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
