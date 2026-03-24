export type FontCategory =
  | "sans-serif"
  | "serif"
  | "monospace"
  | "display"
  | "handwriting";

export interface GoogleFontInfo {
  family: string;
  category: FontCategory;
}

export const googleFontsQueryKey = ["google-fonts"] as const;

export async function fetchGoogleFonts(): Promise<GoogleFontInfo[]> {
  const response = await fetch("/api/fonts");

  if (!response.ok) {
    throw new Error("Failed to fetch fonts");
  }

  return (await response.json()) as GoogleFontInfo[];
}

// Track which fonts have been loaded to avoid duplicate <link> tags
const loadedFonts = new Set<string>();

export function loadGoogleFont(family: string): void {
  if (loadedFonts.has(family)) return;
  loadedFonts.add(family);

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

export function getFontFamilyValue(
  family: string,
  category: FontCategory,
): string {
  const fallback =
    category === "serif"
      ? "serif"
      : category === "monospace"
        ? "monospace"
        : "sans-serif";
  return `"${family}", ${fallback}`;
}

export function getCategoryForSlot(
  slot: "font-sans" | "font-serif" | "font-mono",
): FontCategory[] {
  switch (slot) {
    case "font-sans":
      return ["sans-serif", "display", "handwriting"];
    case "font-serif":
      return ["serif"];
    case "font-mono":
      return ["monospace"];
  }
}
