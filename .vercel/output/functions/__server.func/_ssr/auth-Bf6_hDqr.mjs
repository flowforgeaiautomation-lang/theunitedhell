import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as supabase } from "./client-d8MeWTAO.mjs";
import { G as EyeOff, W as Eye } from "../_libs/lucide-react.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-Bf6_hDqr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("sign-in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({
				to: "/",
				search: { category: void 0 }
			});
		});
	}, [navigate]);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "forgot") {
				const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
				if (error) throw error;
				toast.success("Password reset email sent.");
				setMode("sign-in");
				return;
			}
			if (mode === "sign-up") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: name }
					}
				});
				if (error) throw error;
				toast.success("Account created. If verification is required, check your email before signing in.");
				setMode("sign-in");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Signed in.");
				navigate({
					to: "/",
					search: { category: void 0 }
				});
			}
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	async function onGoogle() {
		setBusy(true);
		try {
			const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
			if (r.error) throw r.error instanceof Error ? r.error : new Error(String(r.error));
			if (!r.redirected) navigate({
				to: "/",
				search: { category: void 0 }
			});
		} catch (e) {
			toast.error(e.message);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-read py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center border-b rule pb-8 mb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "kicker",
						children: mode === "forgot" ? "Reset access" : mode === "sign-in" ? "Welcome back" : "Begin reading"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "display-1 mt-3",
						children: mode === "forgot" ? "Reset password." : mode === "sign-in" ? "Sign in." : "Create an account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dek mt-3 max-w-md mx-auto",
						children: mode === "forgot" ? "Enter your email and choose a new password from the secure link." : "Save stories, follow your interests, and join the discussion."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onGoogle,
				disabled: busy,
				className: "w-full border border-foreground py-3 mb-6 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
				children: "Continue with Google"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 border-t rule" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "kicker text-[0.65rem]",
						children: "Or with email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 border-t rule" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-4",
				children: [
					mode === "sign-up" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							value: name,
							onChange: (e) => setName(e.target.value),
							className: "w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 outline-none font-serif text-lg"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Email",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							className: "w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 outline-none font-serif text-lg"
						})
					}),
					mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								type: showPassword ? "text" : "password",
								minLength: 8,
								value: password,
								onChange: (e) => setPassword(e.target.value),
								className: "w-full bg-transparent border-b-2 border-foreground/30 focus:border-foreground py-2 pr-10 outline-none font-serif text-lg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": showPassword ? "Hide password" : "Show password",
								onClick: () => setShowPassword((value) => !value),
								className: "absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-70",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "w-full border border-foreground py-3 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
						children: busy ? "…" : mode === "forgot" ? "Send reset link" : mode === "sign-in" ? "Sign in" : "Create account"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center mt-6 text-sm",
				children: mode === "sign-in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("forgot"),
						className: "kicker hover:opacity-60",
						children: "Forgot password?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMode("sign-up"),
						className: "kicker hover:opacity-60",
						children: "New here? Create an account →"
					})]
				}) : mode === "forgot" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode("sign-in"),
					className: "kicker hover:opacity-60",
					children: "Back to sign in →"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMode("sign-in"),
					className: "kicker hover:opacity-60",
					children: "Already a reader? Sign in →"
				})
			})
		]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "kicker",
			children: label
		}), children]
	});
}
//#endregion
export { AuthPage as component };
