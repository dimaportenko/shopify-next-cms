"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  type ThemeColors,
  type ThemeTypography,
  type ThemeShadow,
  type ThemePreset,
  COLOR_KEYS,
  DEFAULT_TYPOGRAPHY,
  DEFAULT_SHADOW,
  presets,
} from "@/lib/theme-presets"

const STORAGE_KEY = "theme-customizer"

const TYPOGRAPHY_KEYS: (keyof ThemeTypography)[] = [
  "font-sans",
  "font-serif",
  "font-mono",
  "letter-spacing",
]

const SHADOW_KEYS: (keyof ThemeShadow)[] = [
  "shadow-color",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
]

export interface HslAdjustments {
  hueShift: number
  saturationScale: number
  lightnessScale: number
}

export const DEFAULT_HSL_ADJUSTMENTS: HslAdjustments = {
  hueShift: 0,
  saturationScale: 1,
  lightnessScale: 1,
}

export interface ThemeState {
  preset: string
  radius: number
  spacing: number
  light: ThemeColors
  dark: ThemeColors
  typography: ThemeTypography
  shadow: ThemeShadow
  hslAdjustments: HslAdjustments
  colorCheckpoint: { light: ThemeColors; dark: ThemeColors } | null
}

function getDefaultState(): ThemeState {
  const neutral = presets[0]!
  return {
    preset: neutral.name,
    radius: 0.625,
    spacing: 0.25,
    light: { ...neutral.light },
    dark: { ...neutral.dark },
    typography: { ...DEFAULT_TYPOGRAPHY },
    shadow: { ...DEFAULT_SHADOW },
    hslAdjustments: { ...DEFAULT_HSL_ADJUSTMENTS },
    colorCheckpoint: null,
  }
}

// Parse oklch string into components
function parseOklch(value: string): { L: number; C: number; H: number; alpha?: string } | null {
  const match = value.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)/
  )
  if (!match) return null
  return {
    L: parseFloat(match[1]!),
    C: parseFloat(match[2]!),
    H: parseFloat(match[3]!),
    alpha: match[4],
  }
}

// Reconstruct oklch string from components
function toOklch(L: number, C: number, H: number, alpha?: string): string {
  const l = Math.max(0, Math.min(1, L))
  const c = Math.max(0, C)
  const h = ((H % 360) + 360) % 360
  const base = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`
  if (alpha) return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)} / ${alpha})`
  return base
}

// Apply HSL adjustments to a single color value
function adjustColor(value: string, adjustments: HslAdjustments): string {
  const parsed = parseOklch(value)
  if (!parsed) return value
  return toOklch(
    parsed.L * adjustments.lightnessScale,
    parsed.C * adjustments.saturationScale,
    parsed.H + adjustments.hueShift,
    parsed.alpha
  )
}

// Apply HSL adjustments to all colors
function adjustAllColors(colors: ThemeColors, adjustments: HslAdjustments): ThemeColors {
  const result = { ...colors }
  for (const key of COLOR_KEYS) {
    result[key] = adjustColor(colors[key], adjustments)
  }
  return result
}

function hasStoredState(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(STORAGE_KEY) !== null
}

function loadState(): ThemeState {
  if (typeof window === "undefined") return getDefaultState()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ThemeState>
      const defaults = getDefaultState()
      return {
        ...defaults,
        ...parsed,
        light: { ...defaults.light, ...parsed.light },
        dark: { ...defaults.dark, ...parsed.dark },
        typography: { ...defaults.typography, ...parsed.typography },
        shadow: { ...defaults.shadow, ...parsed.shadow },
        hslAdjustments: { ...defaults.hslAdjustments, ...parsed.hslAdjustments },
        colorCheckpoint: parsed.colorCheckpoint ?? null,
      }
    }
  } catch {
    // ignore
  }
  return getDefaultState()
}

function saveState(state: ThemeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

function applyToDocument(state: ThemeState, resolvedTheme: string | undefined) {
  const root = document.documentElement
  const mode = resolvedTheme === "dark" ? "dark" : "light"
  const colors = state[mode]

  for (const key of COLOR_KEYS) {
    root.style.setProperty(`--${key}`, colors[key])
  }
  root.style.setProperty("--radius", `${state.radius}rem`)
  root.style.setProperty("--spacing", `${state.spacing}rem`)

  // Font variables use --custom-font-* prefix to avoid collision with next/font's --font-* vars.
  // globals.css references these via: --font-sans: var(--custom-font-sans, var(--font-geist-sans, ...))
  const FONT_KEY_MAP: Record<string, string> = {
    "font-sans": "custom-font-sans",
    "font-serif": "custom-font-serif",
    "font-mono": "custom-font-mono",
  }
  for (const key of TYPOGRAPHY_KEYS) {
    const cssKey = FONT_KEY_MAP[key] ?? key
    const value = state.typography[key]
    const isDefault = value === DEFAULT_TYPOGRAPHY[key]
    if (isDefault && FONT_KEY_MAP[key]) {
      // Remove custom override so the CSS fallback (next/font) takes effect
      root.style.removeProperty(`--${cssKey}`)
    } else {
      root.style.setProperty(`--${cssKey}`, value)
    }
  }
  for (const key of SHADOW_KEYS) {
    root.style.setProperty(`--${key}`, state.shadow[key])
  }
}

function removeCustomStyles() {
  const root = document.documentElement
  for (const key of COLOR_KEYS) {
    root.style.removeProperty(`--${key}`)
  }
  root.style.removeProperty("--radius")
  root.style.removeProperty("--spacing")
  root.style.removeProperty("--letter-spacing")
  root.style.removeProperty("--custom-font-sans")
  root.style.removeProperty("--custom-font-serif")
  root.style.removeProperty("--custom-font-mono")
  for (const key of SHADOW_KEYS) {
    root.style.removeProperty(`--${key}`)
  }
}

export function useThemeCustomizer() {
  const { resolvedTheme } = useTheme()
  const initialState = useMemo(() => loadState(), [])
  const [state, setState] = useState<ThemeState>(initialState)
  const [isCustomized, setIsCustomized] = useState(() => hasStoredState())

  useEffect(() => {
    if (isCustomized) {
      applyToDocument(state, resolvedTheme)
      saveState(state)
    }
  }, [state, resolvedTheme, isCustomized])

  const applyPreset = useCallback((preset: ThemePreset) => {
    setIsCustomized(true)
    setState((prev) => ({
      ...prev,
      preset: preset.name,
      light: { ...preset.light },
      dark: { ...preset.dark },
    }))
  }, [])

  const setRadius = useCallback((radius: number) => {
    setIsCustomized(true)
    setState((prev) => ({ ...prev, radius }))
  }, [])

  const setSpacing = useCallback((spacing: number) => {
    setIsCustomized(true)
    setState((prev) => ({ ...prev, spacing }))
  }, [])

  const setColor = useCallback(
    (key: keyof ThemeColors, value: string, mode: "light" | "dark") => {
      setIsCustomized(true)
      setState((prev) => ({
        ...prev,
        preset: "custom",
        [mode]: { ...prev[mode], [key]: value },
      }))
    },
    []
  )

  const setTypography = useCallback(
    (key: keyof ThemeTypography, value: string) => {
      setIsCustomized(true)
      setState((prev) => ({
        ...prev,
        typography: { ...prev.typography, [key]: value },
      }))
    },
    []
  )

  const setShadow = useCallback(
    (key: keyof ThemeShadow, value: string) => {
      setIsCustomized(true)
      setState((prev) => ({
        ...prev,
        shadow: { ...prev.shadow, [key]: value },
      }))
    },
    []
  )

  const applyHslAdjustments = useCallback(
    (adjustments: HslAdjustments) => {
      setIsCustomized(true)
      setState((prev) => {
        // Save checkpoint on first adjustment
        const checkpoint = prev.colorCheckpoint ?? {
          light: { ...prev.light },
          dark: { ...prev.dark },
        }
        return {
          ...prev,
          preset: "custom",
          hslAdjustments: adjustments,
          colorCheckpoint: checkpoint,
          light: adjustAllColors(checkpoint.light, adjustments),
          dark: adjustAllColors(checkpoint.dark, adjustments),
        }
      })
    },
    []
  )

  const resetHslAdjustments = useCallback(() => {
    setState((prev) => {
      if (!prev.colorCheckpoint) return prev
      return {
        ...prev,
        hslAdjustments: { ...DEFAULT_HSL_ADJUSTMENTS },
        light: { ...prev.colorCheckpoint.light },
        dark: { ...prev.colorCheckpoint.dark },
        colorCheckpoint: null,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setIsCustomized(false)
    setState(getDefaultState())
    removeCustomStyles()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const generateCSS = useCallback(() => {
    const lines: string[] = []
    lines.push(":root {")
    for (const key of COLOR_KEYS) {
      lines.push(`  --${key}: ${state.light[key]};`)
    }
    lines.push(`  --radius: ${state.radius}rem;`)
    lines.push(`  --spacing: ${state.spacing}rem;`)
    for (const key of TYPOGRAPHY_KEYS) {
      lines.push(`  --${key}: ${state.typography[key]};`)
    }
    for (const key of SHADOW_KEYS) {
      lines.push(`  --${key}: ${state.shadow[key]};`)
    }
    lines.push("}")
    lines.push("")
    lines.push(".dark {")
    for (const key of COLOR_KEYS) {
      lines.push(`  --${key}: ${state.dark[key]};`)
    }
    lines.push("}")
    return lines.join("\n")
  }, [state])

  return {
    state,
    presets,
    applyPreset,
    setRadius,
    setSpacing,
    setColor,
    setTypography,
    setShadow,
    applyHslAdjustments,
    resetHslAdjustments,
    reset,
    generateCSS,
  }
}
