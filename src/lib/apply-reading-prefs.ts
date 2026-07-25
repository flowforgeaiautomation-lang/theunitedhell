import {
  type ReadingPreferences,
  FONT_SIZE_PX,
  FONT_FAMILY_STACK,
  FONT_WEIGHT_CSS,
  LINE_HEIGHT_CSS,
  PARAGRAPH_SPACING_CSS,
  READING_WIDTH_CSS,
  type Theme,
} from "@/lib/reading-prefs";

const THEME_CLASSES: Record<Theme, string> = {
  light: "tuh-theme-light",
  dark: "tuh-theme-dark",
  system: "tuh-theme-system",
  sepia: "tuh-theme-sepia",
  paper: "tuh-theme-paper",
  midnight: "tuh-theme-midnight",
  "high-contrast": "tuh-theme-high-contrast",
};

const ALL_THEME_CLASSES = Object.values(THEME_CLASSES);
const ALL_A11Y_CLASSES = [
  "tuh-high-contrast",
  "tuh-dyslexia-font",
  "tuh-reduce-motion",
  "tuh-reduce-animations",
  "tuh-touch-targets",
  "tuh-underline-links",
  "tuh-larger-icons",
  "tuh-focus-highlight",
  "tuh-color-blind",
  "tuh-eye-comfort",
  "tuh-focus-mode",
];

export function applyReadingPrefs(prefs: ReadingPreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // CSS variables for typography & layout
  root.style.setProperty("--article-font-size", FONT_SIZE_PX[prefs.fontSize]);
  root.style.setProperty("--article-font-family", FONT_FAMILY_STACK[prefs.dyslexiaFont ? "dyslexia" : prefs.fontFamily]);
  root.style.setProperty("--article-font-weight", String(FONT_WEIGHT_CSS[prefs.fontWeight]));
  root.style.setProperty("--article-line-height", LINE_HEIGHT_CSS[prefs.lineSpacing]);
  root.style.setProperty("--article-paragraph-spacing", PARAGRAPH_SPACING_CSS[prefs.paragraphSpacing]);
  root.style.setProperty("--article-max-width", READING_WIDTH_CSS[prefs.readingWidth]);
  root.style.setProperty("--article-text-align", prefs.textAlignment === "justify" ? "justify" : "left");
  root.style.setProperty("--article-indent", prefs.indentFirstParagraph ? "1.5em" : "0");

  // Theme
  ALL_THEME_CLASSES.forEach((c) => root.classList.remove(c));
  root.classList.add(THEME_CLASSES[prefs.theme]);

  // Accessibility classes
  ALL_A11Y_CLASSES.forEach((c) => root.classList.remove(c));
  if (prefs.highContrast) root.classList.add("tuh-high-contrast");
  if (prefs.dyslexiaFont) root.classList.add("tuh-dyslexia-font");
  if (prefs.reduceMotion) root.classList.add("tuh-reduce-motion");
  if (prefs.reduceAnimations) root.classList.add("tuh-reduce-animations");
  if (prefs.increaseTouchTargets) root.classList.add("tuh-touch-targets");
  if (prefs.underlineLinks) root.classList.add("tuh-underline-links");
  if (prefs.largerIcons) root.classList.add("tuh-larger-icons");
  if (prefs.focusHighlight) root.classList.add("tuh-focus-highlight");
  if (prefs.colorBlindFriendly) root.classList.add("tuh-color-blind");
  if (prefs.eyeComfortMode) root.classList.add("tuh-eye-comfort");
  if (prefs.focusMode) root.classList.add("tuh-focus-mode");
}
