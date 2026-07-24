import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/information-CpRcfz05.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		id: "about",
		title: "About The United Hell"
	},
	{
		id: "translation",
		title: "Translation & Languages"
	},
	{
		id: "editorial",
		title: "Editorial Principles"
	},
	{
		id: "sources",
		title: "Sources & Methodology"
	},
	{
		id: "ai",
		title: "AI Disclosure"
	},
	{
		id: "corrections",
		title: "Corrections Policy"
	},
	{
		id: "copyright",
		title: "Copyright Policy"
	},
	{
		id: "terms",
		title: "Terms of Service"
	},
	{
		id: "privacy",
		title: "Privacy Policy"
	},
	{
		id: "community",
		title: "Community Guidelines"
	},
	{
		id: "advertising",
		title: "Advertising & Sponsorships"
	},
	{
		id: "careers",
		title: "Careers"
	},
	{
		id: "contact",
		title: "Contact"
	},
	{
		id: "legal",
		title: "Legal Notice"
	}
];
function InformationPage() {
	const [openSections, setOpenSections] = (0, import_react.useState)(new Set(sections.map((s) => s.id)));
	const toggleSection = (id) => {
		const newOpen = new Set(openSections);
		if (newOpen.has(id)) newOpen.delete(id);
		else newOpen.add(id);
		setOpenSections(newOpen);
	};
	const scrollTo = (id) => {
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-edit py-10 md:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "text-center pb-16 border-b rule",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "kicker",
					children: "Information"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "display-1 mt-3",
					children: "Transparency. Editorial Standards. Policies. Trust."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dek mt-6 max-w-3xl mx-auto",
					children: "A guide to how The United Hell operates, creates content, protects users, and maintains editorial integrity."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col lg:flex-row gap-8 pt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden lg:block lg:w-64 flex-shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "space-y-2",
						children: sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => scrollTo(section.id),
							className: "block w-full text-left text-sm text-muted-foreground hover:text-foreground transition",
							children: section.title
						}, section.id))
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 max-w-3xl mx-auto lg:mx-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "about",
						title: "About The United Hell",
						isOpen: openSections.has("about"),
						onToggle: () => toggleSection("about"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "The United Hell is an independent discovery and knowledge platform dedicated to helping people understand the world through science, technology, history, nature, wildlife, culture, business, innovation, exploration, and human achievement."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Our mission is to transform information into understanding through clear, trustworthy, and accessible storytelling."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: ["Email: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "mailto:theunitedhell@gmail.com",
									className: "text-foreground underline hover:no-underline",
									children: "theunitedhell@gmail.com"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "translation",
						title: "Translation & Languages",
						isOpen: openSections.has("translation"),
						onToggle: () => toggleSection("translation"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "The United Hell uses your browser's built-in translation so every article works on every device — phone, tablet, or computer — without any extra setup, API keys, or sign-in."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "To read the site in your own language:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "font-serif text-lg leading-relaxed space-y-3 mb-6 list-decimal pl-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Open the browser menu — the three dots (⋮) in the top-right corner of Chrome, Edge, Brave, or Samsung Internet (in Safari, tap the ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "aA" }),
										" icon in the address bar)."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Tap ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Translate\"" }),
										" or ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\"Translate page…\"" }),
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Choose the language you want — Hindi, Spanish, Arabic, Chinese, French, German, Japanese, Portuguese, Russian, or any other supported language." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The entire page, including every article, will be translated instantly. Your choice is remembered for future visits." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "This approach is faster, more accurate, and works offline-first — there is no in-site translate button because your browser already does it better."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "editorial",
						title: "Editorial Principles",
						isOpen: openSections.has("editorial"),
						onToggle: () => toggleSection("editorial"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "font-serif text-lg leading-relaxed space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Accuracy before speed." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Knowledge before noise." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Context before opinion." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Curiosity before assumptions." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Quality before quantity." })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed mt-6",
							children: "We aim to present information that is useful, educational, inspiring, and meaningful."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "sources",
						title: "Sources & Methodology",
						isOpen: openSections.has("sources"),
						onToggle: () => toggleSection("sources"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Content may be collected from:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "font-serif text-lg leading-relaxed space-y-2 mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "News organizations" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Government agencies" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Research institutions" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Scientific publications" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Educational sources" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Public databases" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Space agencies" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Historical archives" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Verified public sources" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "All content is processed, summarized, organized, and reviewed through a combination of artificial intelligence and editorial systems."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "ai",
						title: "AI Disclosure",
						isOpen: openSections.has("ai"),
						onToggle: () => toggleSection("ai"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Artificial intelligence assists with:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "font-serif text-lg leading-relaxed space-y-2 mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Content discovery" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Summarization" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Classification" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tagging" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Recommendations" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Personalization" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Content organization" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "Human oversight and source verification remain important parts of our publishing process."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "corrections",
						title: "Corrections Policy",
						isOpen: openSections.has("corrections"),
						onToggle: () => toggleSection("corrections"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Accuracy matters."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "If an error is identified, corrections may be applied to published content."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mt-4",
								children: "Updated articles display revision information whenever applicable."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "copyright",
						title: "Copyright Policy",
						isOpen: openSections.has("copyright"),
						onToggle: () => toggleSection("copyright"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed",
							children: "All original content, designs, branding, visual assets, and editorial material are protected by applicable copyright laws."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed mt-4",
							children: "Unauthorized reproduction, redistribution, or commercial use may be prohibited without permission."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "terms",
						title: "Terms of Service",
						isOpen: openSections.has("terms"),
						onToggle: () => toggleSection("terms"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed mb-4",
							children: "By using this platform, users agree to use the service lawfully and responsibly."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed",
							children: "Users must not misuse the platform, interfere with operations, attempt unauthorized access, distribute harmful content, or violate applicable laws."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "privacy",
						title: "Privacy Policy",
						isOpen: openSections.has("privacy"),
						onToggle: () => toggleSection("privacy"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "We respect user privacy."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Information may be used to improve services, personalize experiences, maintain security, and operate the platform."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "We do not knowingly sell personal information."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "community",
						title: "Community Guidelines",
						isOpen: openSections.has("community"),
						onToggle: () => toggleSection("community"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Users should:"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "font-serif text-lg leading-relaxed space-y-2 mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Be respectful." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Avoid harassment." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Avoid hate speech." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Avoid misinformation." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Avoid spam." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Avoid illegal activity." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "Constructive discussion is encouraged."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "advertising",
						title: "Advertising & Sponsorships",
						isOpen: openSections.has("advertising"),
						onToggle: () => toggleSection("advertising"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed mb-4",
							children: "Sponsored content and advertisements will be clearly identified whenever applicable."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed",
							children: "Editorial independence remains separate from advertising relationships."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "careers",
						title: "Careers",
						isOpen: openSections.has("careers"),
						onToggle: () => toggleSection("careers"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed",
							children: "We welcome talented individuals passionate about knowledge, discovery, technology, design, research, and storytelling."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg leading-relaxed mt-4",
							children: "Future opportunities may be announced here."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "contact",
						title: "Contact",
						isOpen: openSections.has("contact"),
						onToggle: () => toggleSection("contact"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "General Inquiries"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Partnerships"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Advertising"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Corrections"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Press"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "Support"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 border-t rule pt-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "kicker mb-4",
										children: "Get in touch"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										placeholder: "Your email",
										className: "w-full bg-transparent border border-rule px-4 py-3 font-serif text-lg outline-none focus:border-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										placeholder: "Your message",
										rows: 6,
										className: "w-full bg-transparent border border-rule px-4 py-3 font-serif text-lg mt-4 outline-none focus:border-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "mt-6 border border-foreground px-6 py-3 text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition",
										children: "Send message"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						id: "legal",
						title: "Legal Notice",
						isOpen: openSections.has("legal"),
						onToggle: () => toggleSection("legal"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Information provided on this platform is intended for informational and educational purposes."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed mb-4",
								children: "Users should verify important decisions through official sources."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-lg leading-relaxed",
								children: "The United Hell makes reasonable efforts to maintain accuracy but cannot guarantee completeness or suitability for every use case."
							})
						]
					})
				]
			})]
		})]
	});
}
function Section({ id, title, children, isOpen, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "py-10 border-b rule",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: onToggle,
			className: "flex items-center justify-between cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "display-3",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "lg:hidden text-2xl",
				children: isOpen ? "−" : "+"
			})]
		}), isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children
		})]
	});
}
//#endregion
export { InformationPage as component };
