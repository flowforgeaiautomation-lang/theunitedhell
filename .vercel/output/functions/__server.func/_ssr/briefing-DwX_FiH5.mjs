import { n as queryOptions } from "../_libs/react+tanstack__react-query.mjs";
import { n as getBriefingToday } from "./articles.functions-D2OsHuPk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/briefing-DwX_FiH5.js
var briefingQ = queryOptions({
	queryKey: ["briefing"],
	queryFn: () => getBriefingToday()
});
//#endregion
export { briefingQ as t };
