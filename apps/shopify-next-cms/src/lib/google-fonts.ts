export type FontCategory = "sans-serif" | "serif" | "monospace" | "display" | "handwriting"

export interface GoogleFontInfo {
  family: string
  category: FontCategory
}

let cachedFonts: GoogleFontInfo[] | null = null
let fetchPromise: Promise<GoogleFontInfo[]> | null = null

export async function fetchGoogleFonts(): Promise<GoogleFontInfo[]> {
  if (cachedFonts) return cachedFonts

  if (fetchPromise) return fetchPromise

  fetchPromise = fetch("/api/fonts")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch fonts")
      return res.json() as Promise<GoogleFontInfo[]>
    })
    .then((fonts) => {
      cachedFonts = fonts
      return fonts
    })
    .catch(() => {
      cachedFonts = []
      return []
    })
    .finally(() => {
      fetchPromise = null
    })

  return fetchPromise
}

// Track which fonts have been loaded to avoid duplicate <link> tags
const loadedFonts = new Set<string>()

export function loadGoogleFont(family: string): void {
  if (loadedFonts.has(family)) return
  loadedFonts.add(family)

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@300;400;500;600;700&display=swap`
  document.head.appendChild(link)
}

export function getFontFamilyValue(family: string, category: FontCategory): string {
  const fallback =
    category === "serif"
      ? "serif"
      : category === "monospace"
        ? "monospace"
        : "sans-serif"
  return `"${family}", ${fallback}`
}

export function getCategoryForSlot(slot: "font-sans" | "font-serif" | "font-mono"): FontCategory[] {
  switch (slot) {
    case "font-sans":
      return ["sans-serif", "display", "handwriting"]
    case "font-serif":
      return ["serif"]
    case "font-mono":
      return ["monospace"]
  }
}
