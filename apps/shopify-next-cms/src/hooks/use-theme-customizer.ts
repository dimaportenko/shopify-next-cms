"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import {
  type ThemeColors,
  type ThemePreset,
  COLOR_KEYS,
  presets,
} from "@/lib/theme-presets"

const STORAGE_KEY = "theme-customizer"

interface ThemeState {
  preset: string
  radius: number
  light: ThemeColors
  dark: ThemeColors
}

function getDefaultState(): ThemeState {
  const neutral = presets[0]!
  return {
    preset: neutral.name,
    radius: 0.625,
    light: { ...neutral.light },
    dark: { ...neutral.dark },
  }
}

function loadState(): ThemeState {
  if (typeof window === "undefined") return getDefaultState()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored) as ThemeState
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
}

export function useThemeCustomizer() {
  const { resolvedTheme } = useTheme()
  const initialState = useMemo(() => loadState(), [])
  const [state, setState] = useState<ThemeState>(initialState)

  // Apply CSS variables whenever state or theme changes
  useEffect(() => {
    applyToDocument(state, resolvedTheme)
    saveState(state)
  }, [state, resolvedTheme])

  const applyPreset = useCallback((preset: ThemePreset) => {
    setState((prev) => ({
      ...prev,
      preset: preset.name,
      light: { ...preset.light },
      dark: { ...preset.dark },
    }))
  }, [])

  const setRadius = useCallback((radius: number) => {
    setState((prev) => ({ ...prev, radius }))
  }, [])

  const setColor = useCallback(
    (key: keyof ThemeColors, value: string, mode: "light" | "dark") => {
      setState((prev) => ({
        ...prev,
        preset: "custom",
        [mode]: { ...prev[mode], [key]: value },
      }))
    },
    []
  )

  const reset = useCallback(() => {
    const defaultState = getDefaultState()
    setState(defaultState)
  }, [])

  const generateCSS = useCallback(() => {
    const lines: string[] = []
    lines.push(":root {")
    for (const key of COLOR_KEYS) {
      lines.push(`  --${key}: ${state.light[key]};`)
    }
    lines.push(`  --radius: ${state.radius}rem;`)
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
    setColor,
    reset,
    generateCSS,
  }
}
