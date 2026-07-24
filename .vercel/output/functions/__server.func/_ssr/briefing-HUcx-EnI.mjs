import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { n as getBriefingToday } from "./articles.functions-DfYOMjFZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-HUcx-EnI.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
