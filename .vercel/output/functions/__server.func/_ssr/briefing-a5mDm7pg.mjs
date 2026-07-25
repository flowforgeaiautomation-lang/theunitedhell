import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { o as getBriefingToday } from "./articles.functions-_GNHdrAL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-a5mDm7pg.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
