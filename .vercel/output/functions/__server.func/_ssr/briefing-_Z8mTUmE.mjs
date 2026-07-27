import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { r as getBriefingToday } from "./articles.functions-Cbu5EOsE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-_Z8mTUmE.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
