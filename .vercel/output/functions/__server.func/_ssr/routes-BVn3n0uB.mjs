import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BVn3n0uB.js
var import_jsx_runtime = require_jsx_runtime();
var SplitErrorComponent = ({ error }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container-edit py-20 text-center",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "dek",
		children: ["We couldn't load the front page. ", error.message]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => window.location.reload(),
		className: "mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
		children: "Refresh page"
	})]
});
//#endregion
export { SplitErrorComponent as errorComponent };
