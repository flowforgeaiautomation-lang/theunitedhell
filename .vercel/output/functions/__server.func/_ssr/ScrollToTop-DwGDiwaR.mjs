import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { jt as ArrowUp } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ScrollToTop-DwGDiwaR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ScrollToTop() {
	const [visible, setVisible] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			setVisible(window.scrollY > 400);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	if (!visible) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => window.scrollTo({
			top: 0,
			behavior: "smooth"
		}),
		"aria-label": "Scroll to top",
		className: "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-foreground bg-background/80 backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-foreground hover:text-background animate-fade-in",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-5 w-5" })
	});
}
//#endregion
export { ScrollToTop as t };
