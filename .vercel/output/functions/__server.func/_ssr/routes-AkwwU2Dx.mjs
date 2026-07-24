import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-AkwwU2Dx.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "container-edit py-20 text-center",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "dek",
		children: ["We couldn't load the front page. ", error.message]
	})
});
//#endregion
export { SplitErrorComponent as errorComponent };
