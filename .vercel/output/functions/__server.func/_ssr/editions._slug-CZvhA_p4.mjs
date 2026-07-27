import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editions._slug-CZvhA_p4.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "max-w-2xl mx-auto py-20 text-center px-4",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-serif text-2xl mb-4",
		children: "Edition not found"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/editions",
		className: "text-white/60 hover:text-white underline underline-offset-4 text-sm",
		children: "Back to Editions"
	})]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
