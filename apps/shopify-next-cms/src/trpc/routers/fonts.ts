import { publicProcedure, router } from "../init";
import type { GoogleFontInfo } from "@/lib/google-fonts";

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
  { family: "Work Sans", category: "sans-serif" },
  { family: "Outfit", category: "sans-serif" },
  { family: "Figtree", category: "sans-serif" },
  { family: "Sora", category: "sans-serif" },
  { family: "Space Grotesk", category: "sans-serif" },
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
];

export const fontsRouter = router({
  list: publicProcedure.query(async (): Promise<GoogleFontInfo[]> => {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    if (!apiKey) {
      return FALLBACK_FONTS;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`,
        { next: { revalidate: 86400 } },
      );
      if (!res.ok) throw new Error("Google Fonts API error");

      const data = (await res.json()) as {
        items?: GoogleFontInfo[];
      };
      return (data.items ?? []).map((item) => ({
        family: item.family,
        category: item.category,
      }));
    } catch {
      return FALLBACK_FONTS;
    }
  }),
});
