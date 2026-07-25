import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { a as getBriefingToday } from "./articles.functions-DnfzX_NI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-BMRa0ULH.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
