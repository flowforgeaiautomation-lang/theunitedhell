import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { n as getBriefingToday } from "./articles.functions-vu6-QAgH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-Cgx32hYO.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
