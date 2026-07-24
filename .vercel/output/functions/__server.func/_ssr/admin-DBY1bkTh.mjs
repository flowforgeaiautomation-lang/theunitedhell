import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { r as reprocessArticles, t as curateNow } from "./ai.functions-DaRLW-Qr.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DBY1bkTh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const reprocess = useServerFn(reprocessArticles);
	const curate = useServerFn(curateNow);
	const [log, setLog] = (0, import_react.useState)([]);
	const [running, setRunning] = (0, import_react.useState)(false);
	const [remaining, setRemaining] = (0, import_react.useState)(null);
	const [totalUpdated, setTotalUpdated] = (0, import_react.useState)(0);
	const stopRef = (0, import_react.useRef)(false);
	function append(line) {
		setLog((l) => [line, ...l].slice(0, 200));
	}
	async function reprocessAll() {
		setRunning(true);
		stopRef.current = false;
		setTotalUpdated(0);
		append("Starting reprocess loop…");
		try {
			let iter = 0;
			while (!stopRef.current) {
				iter++;
				const r = await reprocess({ data: { limit: 8 } });
				setRemaining(r.remaining);
				setTotalUpdated((n) => n + r.updated);
				append(`Batch ${iter}: updated ${r.updated}, failed ${r.failed}, remaining ${r.remaining}`);
				if (r.remaining === 0 || r.attempted === 0) {
					append("Done — no more articles to reprocess.");
					break;
				}
				await new Promise((r) => setTimeout(r, 400));
			}
		} catch (e) {
			append("Error: " + e.message);
			toast.error(e.message);
		} finally {
			setRunning(false);
		}
	}
	async function runCurate() {
		setRunning(true);
		try {
			const r = await curate({ data: { maxItems: 60 } });
			append(`Curate: inserted ${r.inserted}, fetched ${r.fetched}, errors ${r.errors}`);
			toast.success(`Inserted ${r.inserted} new stories`);
		} catch (e) {
			toast.error(e.message);
		} finally {
			setRunning(false);
		}
	}
	(0, import_react.useEffect)(() => {
		reprocess({ data: { limit: 1 } }).then((r) => setRemaining(r.remaining)).catch(() => {});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-read py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "kicker",
				children: "Editorial ops"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "display-1 mt-2",
				children: "Admin."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "dek mt-3",
				children: "Reprocess existing articles through the new editorial engine, or trigger a live curate cycle."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border rule p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "kicker",
								children: "Reprocess all articles"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm mt-2",
								children: [
									"Remaining unprocessed: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: remaining ?? "—" }),
									". Updated this session: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: totalUpdated }),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: reprocessAll,
									disabled: running,
									className: "border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
									children: running ? "Running…" : "Reprocess all"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										stopRef.current = true;
									},
									disabled: !running,
									className: "border rule px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-40",
									children: "Stop"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border rule p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "kicker",
								children: "Curate now"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm mt-2",
								children: "Pull fresh news from every source and run through the new engine."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: runCurate,
								disabled: running,
								className: "mt-4 border border-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition disabled:opacity-40",
								children: running ? "Running…" : "Run curate cycle"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border rule p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "kicker",
							children: "Log"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "text-xs mt-3 whitespace-pre-wrap font-mono max-h-96 overflow-auto",
							children: log.join("\n") || "No activity yet."
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
