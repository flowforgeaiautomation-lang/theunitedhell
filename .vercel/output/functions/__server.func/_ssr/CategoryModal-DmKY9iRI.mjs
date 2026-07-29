import { o as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CATEGORY_SECTIONS } from "./categories-CY0cJTXM.mjs";
import { $ as GraduationCap, At as Award, C as Sprout, I as Palette, K as Leaf, N as Rocket, Ot as BookOpen, St as ChartColumn, Tt as Briefcase, U as MapPin, X as History, Z as Heart, a as Waves, c as Utensils, dt as Crown, et as Globe, g as Trees, i as Wrench, it as Film, j as Search, kt as BookMarked, l as Users, lt as Earth, m as TrendingUp, n as Zap, p as Trophy, r as X, rt as FlaskConical, t as lucide_react_exports, tt as Gem, v as TramFront, w as Sparkles, wt as Building2, x as Star } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CategoryModal-DmKY9iRI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sectionIconMap = {
	"TRENDING & NEWS": TrendingUp,
	"WORLD & DISCOVERY": Globe,
	"POLITICS & GOVERNANCE": Building2,
	"MONEY & SUCCESS": TrendingUp,
	"TECHNOLOGY & AI": Zap,
	"SPACE & THE UNIVERSE": Sparkles,
	"SCIENCE": FlaskConical,
	"WILDLIFE & NATURE": Trees,
	"OCEANS": Waves,
	"HISTORY": History,
	"MYSTERIES": Search,
	"BOOKS & KNOWLEDGE": BookOpen,
	"CULTURE & ARTS": Palette,
	"ENTERTAINMENT": Film,
	"SPORTS": Trophy,
	"HEALTH": Heart,
	"HUMANITY": Users,
	"PHILOSOPHY & SPIRITUALITY": Sprout,
	"EDUCATION": GraduationCap,
	"CAREERS & OPPORTUNITIES": Briefcase,
	"ENERGY": Zap,
	"ENVIRONMENT": Leaf,
	"CITIES & MEGAPROJECTS": Building2,
	"TRANSPORTATION": TramFront,
	"LUXURY": Crown,
	"FUTURE OF HUMANITY": Rocket,
	"STORIES": BookMarked,
	"CURIOSITY": Star,
	"INDIA": MapPin,
	"SPECIAL COLLECTIONS": Award,
	"FOOD & CULINARY CULTURE": Utensils,
	"ENGINEERING & INVENTIONS": Wrench,
	"LEADERS & ICONS": Crown,
	"MYTHOLOGY & LEGENDS": Sparkles,
	"RARE & EXTRAORDINARY": Gem,
	"RANKINGS": Trophy,
	"DATA & VISUAL INTELLIGENCE": ChartColumn,
	"WORLD EXPLORER": Earth,
	"STORY EVOLUTION": History
};
function getIconComponent(iconName) {
	return lucide_react_exports[iconName.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("")] || null;
}
function CategoryModal({ isOpen, onClose }) {
	const navigate = useNavigate();
	const modalRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleKeyDown(e) {
			if (e.key === "Escape") onClose();
		}
		function handleClickOutside(e) {
			if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
		}
		if (isOpen) {
			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-stretch sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: modalRef,
			className: "bg-background border rule w-full h-[100dvh] sm:h-auto sm:max-w-7xl sm:max-h-[90vh] overflow-hidden rounded-none sm:rounded-lg shadow-2xl flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 bg-background border-b rule p-4 sm:p-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-xl sm:text-2xl",
					children: "Explore All Fields"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-2 hover:opacity-70 transition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-9 pb-28 sm:pb-6",
				children: CATEGORY_SECTIONS.map((section, sectionIndex) => {
					const SectionIcon = sectionIconMap[section.title];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "kicker mb-4 flex items-center gap-2",
						children: [SectionIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionIcon, { className: "h-4 w-4" }), section.title]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-3",
						children: section.categories.map((category) => {
							const IconComponent = getIconComponent(category.icon);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									onClose();
									navigate({
										to: "/discover",
										search: { category: category.slug }
									});
								},
								className: "min-w-0 px-3 sm:px-4 py-2 border rule hover:bg-foreground hover:text-background transition text-sm font-medium flex items-center gap-2 text-left",
								children: [IconComponent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-0 truncate",
									children: category.label
								})]
							}, category.slug);
						})
					})] }, sectionIndex);
				})
			})]
		})
	});
}
//#endregion
export { CategoryModal as t };
