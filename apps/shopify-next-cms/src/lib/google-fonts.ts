export type FontCategory = "sans-serif" | "serif" | "monospace" | "display" | "handwriting"

export interface GoogleFontInfo {
  family: string
  category: FontCategory
}

const FONTS_API_URL =
  "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyAOES8EmKhuJEnsn9kS1XKBpxxp-TgN8Qc"

let cachedFonts: GoogleFontInfo[] | null = null
let fetchPromise: Promise<GoogleFontInfo[]> | null = null

export async function fetchGoogleFonts(): Promise<GoogleFontInfo[]> {
  if (cachedFonts) return cachedFonts

  if (fetchPromise) return fetchPromise

  fetchPromise = fetch(FONTS_API_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch fonts")
      return res.json()
    })
    .then((data: { items?: { family: string; category: string }[] }) => {
      const fonts: GoogleFontInfo[] = (data.items ?? []).map((item) => ({
        family: item.family,
        category: item.category as FontCategory,
      }))
      cachedFonts = fonts
      return fonts
    })
    .catch(() => {
      // Fallback to a curated list if the API fails
      cachedFonts = FALLBACK_FONTS
      return FALLBACK_FONTS
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

// Fallback curated list if the API fails
const FALLBACK_FONTS: GoogleFontInfo[] = [
  { family: "Inter", category: "sans-serif" },
  { family: "Roboto", category: "sans-serif" },
  { family: "Open Sans", category: "sans-serif" },
  { family: "Lato", category: "sans-serif" },
  { family: "Montserrat", category: "sans-serif" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Raleway", category: "sans-serif" },
  { family: "Nunito", category: "sans-serif" },
  { family: "DM Sans", category: "sans-serif" },
  { family: "Plus Jakarta Sans", category: "sans-serif" },
  { family: "Manrope", category: "sans-serif" },
  { family: "Geist", category: "sans-serif" },
  { family: "Work Sans", category: "sans-serif" },
  { family: "Outfit", category: "sans-serif" },
  { family: "Figtree", category: "sans-serif" },
  { family: "Sora", category: "sans-serif" },
  { family: "Space Grotesk", category: "sans-serif" },
  { family: "Albert Sans", category: "sans-serif" },
  { family: "Onest", category: "sans-serif" },
  { family: "Urbanist", category: "sans-serif" },
  { family: "Merriweather", category: "serif" },
  { family: "Playfair Display", category: "serif" },
  { family: "Lora", category: "serif" },
  { family: "Crimson Text", category: "serif" },
  { family: "Libre Baskerville", category: "serif" },
  { family: "Source Serif 4", category: "serif" },
  { family: "EB Garamond", category: "serif" },
  { family: "Cormorant Garamond", category: "serif" },
  { family: "Bitter", category: "serif" },
  { family: "Noto Serif", category: "serif" },
  { family: "JetBrains Mono", category: "monospace" },
  { family: "Fira Code", category: "monospace" },
  { family: "Source Code Pro", category: "monospace" },
  { family: "IBM Plex Mono", category: "monospace" },
  { family: "Roboto Mono", category: "monospace" },
  { family: "Space Mono", category: "monospace" },
  { family: "Inconsolata", category: "monospace" },
  { family: "Ubuntu Mono", category: "monospace" },
  { family: "Geist Mono", category: "monospace" },
]
