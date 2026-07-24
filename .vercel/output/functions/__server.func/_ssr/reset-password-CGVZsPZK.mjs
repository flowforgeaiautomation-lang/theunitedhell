import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-d8MeWTAO.mjs";
import { U as Eye, W as EyeOff } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reset-password-CGVZsPZK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResetPasswordPage() {
	const navigate = useNavigate();
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [show, setShow] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(event) {
		event.preventDefault();
		if (password !== confirm) {
			toast.error("Passwords do not match.");
			return;
		}
		setBusy(true);
		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			toast.success("Password updated. You can sign in now.");
			navigate({ to: "/auth" });
		} catch (error) {
			toast.error(error.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-read py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center border-b rule pb-8 mb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "Account access"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-3",
					children: "Reset password."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek mt-3 max-w-md mx-auto",
					children: "Enter a new password for your account."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
					label: "New password",
					value: password,
					onChange: setPassword,
					show,
					setShow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordField, {
					label: "Confirm password",
					value: confirm,
					onChange: setConfirm,
					show,
					setShow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy || password.length < 8 || confirm.length < 8,
					className: "w-full border border-foreground py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
					children: busy ? "…" : "Update password"
				})
			]
		})]
	});
}
function PasswordField({ label, value, onChange, show, setShow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "kicker",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				required: true,
				type: show ? "text" : "password",
				minLength: 8,
				value,
				onChange: (event) => onChange(event.target.value),
				className: "w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 pr-10 outline-none font-serif text-lg"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": show ? "Hide password" : "Show password",
				onClick: () => setShow(!show),
				className: "absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-70",
				children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
			})]
		})]
	});
}
//#endregion
export { ResetPasswordPage as component };
