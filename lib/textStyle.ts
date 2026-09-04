// Shared per-field Color / Font / Size styling system for CMS text content
// (headings and paragraphs across the homepage and other pages). Mirrors the
// pattern already used for blog content blocks (see BlogForm.tsx /
// BlogDetailView.tsx) but adds Grey and White to the color set, and is
// shared between the admin dropdowns and the public components so the two
// can never drift out of sync.
//
// "default" (or a missing/unrecognized value) always means "no override" —
// the caller's own fallback class (the page's original hardcoded design)
// applies untouched.

export const COLOR_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "black", label: "Black" },
  { value: "teal", label: "Teal (#007190)" },
  { value: "grey", label: "Grey" },
  { value: "white", label: "White" },
];

export const FONT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "ivymode", label: "Ivymode" },
  { value: "michroma", label: "Michroma" },
];

// Each size dropdown shows its actual pixel value (the desktop/ceiling size —
// smaller breakpoints still scale down proportionally, same as the page's
// natural responsive sizing) so admins pick a concrete size, not a vague
// "Large". "Default" preserves the section's original responsive clamp().
export const HEADING_SIZE_OPTIONS = [
  { value: "default", label: "Default (Responsive)" },
  { value: "24", label: "24px" },
  { value: "28", label: "28px" },
  { value: "32", label: "32px" },
  { value: "36", label: "36px" },
  { value: "40", label: "40px" },
  { value: "44", label: "44px" },
  { value: "48", label: "48px" },
  { value: "52", label: "52px" },
  { value: "56", label: "56px" },
  { value: "60", label: "60px" },
  { value: "66", label: "66px" },
  { value: "72", label: "72px" },
  { value: "80", label: "80px" },
];

export const PARAGRAPH_SIZE_OPTIONS = [
  { value: "default", label: "Default (Responsive)" },
  { value: "12", label: "12px" },
  { value: "14", label: "14px" },
  { value: "16", label: "16px" },
  { value: "18", label: "18px" },
  { value: "20", label: "20px" },
  { value: "22", label: "22px" },
  { value: "24", label: "24px" },
  { value: "26", label: "26px" },
  { value: "28", label: "28px" },
  { value: "32", label: "32px" },
  { value: "36", label: "36px" },
];

const COLOR_CLASSES: Record<string, string> = {
  black: "text-black",
  teal: "text-[#007190]",
  grey: "text-[#8b8b8b]",
  white: "text-white",
};

const FONT_CLASSES: Record<string, string> = {
  ivymode: "font-ivymode",
  michroma: "font-michroma",
};

// Desktop-ceiling size, scaled down at smaller breakpoints — matches the
// weight/feel of each section's own clamp()-based default sizing.
const HEADING_SIZE_CLASSES: Record<string, string> = {
  "24": "text-[19px] sm:text-[22px] md:text-[24px]",
  "28": "text-[22px] sm:text-[25px] md:text-[28px]",
  "32": "text-[25px] sm:text-[29px] md:text-[32px]",
  "36": "text-[27px] sm:text-[32px] md:text-[36px]",
  "40": "text-[29px] sm:text-[35px] md:text-[40px]",
  "44": "text-[30px] sm:text-[38px] md:text-[44px]",
  "48": "text-[32px] sm:text-[41px] md:text-[48px]",
  "52": "text-[34px] sm:text-[44px] md:text-[52px]",
  "56": "text-[36px] sm:text-[47px] md:text-[56px]",
  "60": "text-[38px] sm:text-[50px] md:text-[60px]",
  "66": "text-[41px] sm:text-[54px] md:text-[66px]",
  "72": "text-[44px] sm:text-[59px] md:text-[72px]",
  "80": "text-[48px] sm:text-[65px] md:text-[80px]",
};

const PARAGRAPH_SIZE_CLASSES: Record<string, string> = {
  "12": "text-[clamp(10px,0.8vw,12px)]",
  "14": "text-[clamp(11px,0.95vw,14px)]",
  "16": "text-[clamp(12px,1.1vw,16px)]",
  "18": "text-[clamp(13px,1.2vw,18px)]",
  "20": "text-[clamp(14px,1.35vw,20px)]",
  "22": "text-[clamp(15px,1.5vw,22px)]",
  "24": "text-[clamp(16px,1.6vw,24px)]",
  "26": "text-[clamp(17px,1.8vw,26px)]",
  "28": "text-[clamp(18px,1.9vw,28px)]",
  "32": "text-[clamp(20px,2.2vw,32px)]",
  "36": "text-[clamp(22px,2.5vw,36px)]",
};

/** Tailwind text-color class for a stored color value, or `fallback` (the section's original class) when unset/"default". */
export function colorClass(value: string | null | undefined, fallback: string): string {
  if (!value || value === "default") return fallback;
  return COLOR_CLASSES[value] || fallback;
}

/** Tailwind font-family class for a stored font value, or `fallback` when unset/"default". */
export function fontClass(value: string | null | undefined, fallback: string): string {
  if (!value || value === "default") return fallback;
  return FONT_CLASSES[value] || fallback;
}

/** Responsive size class for a heading, or `fallback` (the section's original clamp()) when unset/"default". */
export function headingSizeClass(value: string | null | undefined, fallback: string): string {
  if (!value || value === "default") return fallback;
  return HEADING_SIZE_CLASSES[value] || fallback;
}

/** Responsive size class for a paragraph, or `fallback` (the section's original clamp()) when unset/"default". */
export function paragraphSizeClass(value: string | null | undefined, fallback: string): string {
  if (!value || value === "default") return fallback;
  return PARAGRAPH_SIZE_CLASSES[value] || fallback;
}
