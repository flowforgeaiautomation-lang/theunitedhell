import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { r as getBriefingToday } from "./articles.functions-mUlf6cD6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-BPYadeT8.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
