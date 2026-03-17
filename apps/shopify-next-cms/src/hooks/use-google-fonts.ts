"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import {
  type FontCategory,
  type GoogleFontInfo,
  fetchGoogleFonts,
  getCategoryForSlot,
  loadGoogleFont,
  getFontFamilyValue,
} from "@/lib/google-fonts"
import { useState } from "react"

// Module-level cache for the font list
let fontsCache: GoogleFontInfo[] = []
let fontsFetched = false
let fontsFetching = false
const listeners = new Set<() => void>()

function subscribeFonts(cb: () => void) {
  listeners.add(cb)
  // Trigger fetch on first subscribe
  if (!fontsFetched && !fontsFetching) {
    fontsFetching = true
    fetchGoogleFonts().then((fonts) => {
      fontsCache = fonts
      fontsFetched = true
      fontsFetching = false
      listeners.forEach((l) => l())
    })
  }
  return () => {
    listeners.delete(cb)
  }
}

function getFontsSnapshot(): GoogleFontInfo[] {
  return fontsCache
}

function getServerSnapshot(): GoogleFontInfo[] {
  return []
}

export function useGoogleFonts(slot: "font-sans" | "font-serif" | "font-mono") {
  const allFonts = useSyncExternalStore(subscribeFonts, getFontsSnapshot, getServerSnapshot)
  const [search, setSearch] = useState("")

  const loading = !fontsFetched && fontsFetching
  const categories = useMemo(() => getCategoryForSlot(slot), [slot])

  const filteredFonts = useMemo(() => {
    const byCategory = allFonts.filter((f) =>
      categories.includes(f.category as FontCategory)
    )
    if (!search) return byCategory.slice(0, 50)
    const q = search.toLowerCase()
    return byCategory
      .filter((f) => f.family.toLowerCase().includes(q))
      .slice(0, 50)
  }, [allFonts, categories, search])

  const selectFont = useCallback(
    (font: GoogleFontInfo): string => {
      loadGoogleFont(font.family)
      return getFontFamilyValue(font.family, font.category)
    },
    []
  )

  return { fonts: filteredFonts, search, setSearch, loading, selectFont }
}
