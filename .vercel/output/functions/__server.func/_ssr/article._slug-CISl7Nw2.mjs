import { s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/article._slug-CISl7Nw2.js
var import_jsx_runtime = require_jsx_runtime();
var SplitNotFoundComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "container-read py-24 text-center",
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "kicker",
			children: "Missing"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "display-1 mt-3",
			children: "This story isn't here."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			search: { category: void 0 },
			className: "mt-6 inline-block kicker hover:opacity-60",
			children: "← Front page"
		})
	]
});
//#endregion
export { SplitNotFoundComponent as notFoundComponent };
