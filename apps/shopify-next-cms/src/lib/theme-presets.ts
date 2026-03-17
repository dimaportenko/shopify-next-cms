export interface ThemeColors {
  background: string
  foreground: string
  card: string
  "card-foreground": string
  popover: string
  "popover-foreground": string
  primary: string
  "primary-foreground": string
  secondary: string
  "secondary-foreground": string
  muted: string
  "muted-foreground": string
  accent: string
  "accent-foreground": string
  destructive: string
  "destructive-foreground": string
  border: string
  input: string
  ring: string
  "chart-1": string
  "chart-2": string
  "chart-3": string
  "chart-4": string
  "chart-5": string
  sidebar: string
  "sidebar-foreground": string
  "sidebar-primary": string
  "sidebar-primary-foreground": string
  "sidebar-accent": string
  "sidebar-accent-foreground": string
  "sidebar-border": string
  "sidebar-ring": string
}

export interface ThemeTypography {
  "font-sans": string
  "font-serif": string
  "font-mono": string
  "letter-spacing": string
}

export interface ThemeShadow {
  "shadow-color": string
  "shadow-opacity": string
  "shadow-blur": string
  "shadow-spread": string
  "shadow-offset-x": string
  "shadow-offset-y": string
}

export interface ThemePreset {
  name: string
  label: string
  light: ThemeColors
  dark: ThemeColors
}

export const DEFAULT_FONT_SANS =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
export const DEFAULT_FONT_SERIF =
  'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
export const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

export const DEFAULT_TYPOGRAPHY: ThemeTypography = {
  "font-sans": DEFAULT_FONT_SANS,
  "font-serif": DEFAULT_FONT_SERIF,
  "font-mono": DEFAULT_FONT_MONO,
  "letter-spacing": "0em",
}

export const DEFAULT_SHADOW: ThemeShadow = {
  "shadow-color": "oklch(0 0 0)",
  "shadow-opacity": "0.1",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0px",
  "shadow-offset-y": "1px",
}

const COLOR_KEYS: (keyof ThemeColors)[] = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]

export { COLOR_KEYS }

const defaultLightColors: ThemeColors = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)",
  "secondary-foreground": "oklch(0.205 0 0)",
  muted: "oklch(0.97 0 0)",
  "muted-foreground": "oklch(0.556 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",
  destructive: "oklch(0.577 0.245 27.325)",
  "destructive-foreground": "oklch(1 0 0)",
  border: "oklch(0.922 0 0)",
  input: "oklch(0.922 0 0)",
  ring: "oklch(0.708 0 0)",
  "chart-1": "oklch(0.81 0.10 252)",
  "chart-2": "oklch(0.62 0.19 260)",
  "chart-3": "oklch(0.55 0.22 263)",
  "chart-4": "oklch(0.49 0.22 264)",
  "chart-5": "oklch(0.42 0.18 266)",
  sidebar: "oklch(0.985 0 0)",
  "sidebar-foreground": "oklch(0.145 0 0)",
  "sidebar-primary": "oklch(0.205 0 0)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.97 0 0)",
  "sidebar-accent-foreground": "oklch(0.205 0 0)",
  "sidebar-border": "oklch(0.922 0 0)",
  "sidebar-ring": "oklch(0.708 0 0)",
}

const defaultDarkColors: ThemeColors = {
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)",
  "card-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.269 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",
  primary: "oklch(0.922 0 0)",
  "primary-foreground": "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  "secondary-foreground": "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)",
  "muted-foreground": "oklch(0.708 0 0)",
  accent: "oklch(0.371 0 0)",
  "accent-foreground": "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)",
  "destructive-foreground": "oklch(0.985 0 0)",
  border: "oklch(0.275 0 0)",
  input: "oklch(0.325 0 0)",
  ring: "oklch(0.556 0 0)",
  "chart-1": "oklch(0.81 0.10 252)",
  "chart-2": "oklch(0.62 0.19 260)",
  "chart-3": "oklch(0.55 0.22 263)",
  "chart-4": "oklch(0.49 0.22 264)",
  "chart-5": "oklch(0.42 0.18 266)",
  sidebar: "oklch(0.205 0 0)",
  "sidebar-foreground": "oklch(0.985 0 0)",
  "sidebar-primary": "oklch(0.488 0.243 264.376)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.269 0 0)",
  "sidebar-accent-foreground": "oklch(0.985 0 0)",
  "sidebar-border": "oklch(0.275 0 0)",
  "sidebar-ring": "oklch(0.439 0 0)",
}

export const presets: ThemePreset[] = [
  {
    name: "neutral",
    label: "Neutral",
    light: { ...defaultLightColors },
    dark: { ...defaultDarkColors },
  },
  {
    name: "blue",
    label: "Blue",
    light: {
      ...defaultLightColors,
      primary: "oklch(0.546 0.245 262.881)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.965 0.019 262)",
      "secondary-foreground": "oklch(0.305 0.1 262)",
      muted: "oklch(0.965 0.019 262)",
      "muted-foreground": "oklch(0.556 0.01 262)",
      accent: "oklch(0.932 0.032 262)",
      "accent-foreground": "oklch(0.305 0.1 262)",
      border: "oklch(0.915 0.025 262)",
      input: "oklch(0.915 0.025 262)",
      ring: "oklch(0.546 0.245 262.881)",
      "sidebar-primary": "oklch(0.546 0.245 262.881)",
    },
    dark: {
      ...defaultDarkColors,
      background: "oklch(0.155 0.02 262)",
      card: "oklch(0.205 0.03 262)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0.03 262)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.623 0.214 259.815)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.269 0.04 262)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0.04 262)",
      "muted-foreground": "oklch(0.708 0.03 262)",
      accent: "oklch(0.269 0.04 262)",
      "accent-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.623 0.214 259.815)",
      "sidebar-primary": "oklch(0.623 0.214 259.815)",
    },
  },
  {
    name: "green",
    label: "Green",
    light: {
      ...defaultLightColors,
      primary: "oklch(0.532 0.157 150.069)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.962 0.022 150)",
      "secondary-foreground": "oklch(0.305 0.08 150)",
      muted: "oklch(0.962 0.022 150)",
      "muted-foreground": "oklch(0.556 0.01 150)",
      accent: "oklch(0.928 0.04 150)",
      "accent-foreground": "oklch(0.305 0.08 150)",
      border: "oklch(0.912 0.03 150)",
      input: "oklch(0.912 0.03 150)",
      ring: "oklch(0.532 0.157 150.069)",
      "sidebar-primary": "oklch(0.532 0.157 150.069)",
    },
    dark: {
      ...defaultDarkColors,
      background: "oklch(0.155 0.015 150)",
      card: "oklch(0.205 0.025 150)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0.025 150)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.627 0.194 149.214)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.269 0.035 150)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0.035 150)",
      "muted-foreground": "oklch(0.708 0.03 150)",
      accent: "oklch(0.269 0.035 150)",
      "accent-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.627 0.194 149.214)",
      "sidebar-primary": "oklch(0.627 0.194 149.214)",
    },
  },
  {
    name: "rose",
    label: "Rose",
    light: {
      ...defaultLightColors,
      primary: "oklch(0.585 0.22 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.965 0.02 0)",
      "secondary-foreground": "oklch(0.305 0.08 0)",
      muted: "oklch(0.965 0.02 0)",
      "muted-foreground": "oklch(0.556 0.01 0)",
      accent: "oklch(0.932 0.035 0)",
      "accent-foreground": "oklch(0.305 0.08 0)",
      border: "oklch(0.915 0.025 0)",
      input: "oklch(0.915 0.025 0)",
      ring: "oklch(0.585 0.22 0)",
      "sidebar-primary": "oklch(0.585 0.22 0)",
    },
    dark: {
      ...defaultDarkColors,
      background: "oklch(0.155 0.015 0)",
      card: "oklch(0.205 0.025 0)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0.025 0)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.685 0.22 0)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.269 0.035 0)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0.035 0)",
      "muted-foreground": "oklch(0.708 0.025 0)",
      accent: "oklch(0.269 0.035 0)",
      "accent-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.685 0.22 0)",
      "sidebar-primary": "oklch(0.685 0.22 0)",
    },
  },
  {
    name: "orange",
    label: "Orange",
    light: {
      ...defaultLightColors,
      primary: "oklch(0.705 0.191 47.604)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.965 0.022 47)",
      "secondary-foreground": "oklch(0.405 0.1 47)",
      muted: "oklch(0.965 0.022 47)",
      "muted-foreground": "oklch(0.556 0.01 47)",
      accent: "oklch(0.932 0.04 47)",
      "accent-foreground": "oklch(0.405 0.1 47)",
      border: "oklch(0.915 0.028 47)",
      input: "oklch(0.915 0.028 47)",
      ring: "oklch(0.705 0.191 47.604)",
      "sidebar-primary": "oklch(0.705 0.191 47.604)",
    },
    dark: {
      ...defaultDarkColors,
      background: "oklch(0.155 0.015 47)",
      card: "oklch(0.205 0.025 47)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0.025 47)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.705 0.191 47.604)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.269 0.035 47)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0.035 47)",
      "muted-foreground": "oklch(0.708 0.025 47)",
      accent: "oklch(0.269 0.035 47)",
      "accent-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.705 0.191 47.604)",
      "sidebar-primary": "oklch(0.705 0.191 47.604)",
    },
  },
  {
    name: "violet",
    label: "Violet",
    light: {
      ...defaultLightColors,
      primary: "oklch(0.541 0.281 293.009)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.962 0.022 293)",
      "secondary-foreground": "oklch(0.305 0.1 293)",
      muted: "oklch(0.962 0.022 293)",
      "muted-foreground": "oklch(0.556 0.01 293)",
      accent: "oklch(0.928 0.04 293)",
      "accent-foreground": "oklch(0.305 0.1 293)",
      border: "oklch(0.912 0.028 293)",
      input: "oklch(0.912 0.028 293)",
      ring: "oklch(0.541 0.281 293.009)",
      "sidebar-primary": "oklch(0.541 0.281 293.009)",
    },
    dark: {
      ...defaultDarkColors,
      background: "oklch(0.155 0.02 293)",
      card: "oklch(0.205 0.03 293)",
      "card-foreground": "oklch(0.985 0 0)",
      popover: "oklch(0.205 0.03 293)",
      "popover-foreground": "oklch(0.985 0 0)",
      primary: "oklch(0.641 0.241 293)",
      "primary-foreground": "oklch(0.985 0 0)",
      secondary: "oklch(0.269 0.04 293)",
      "secondary-foreground": "oklch(0.985 0 0)",
      muted: "oklch(0.269 0.04 293)",
      "muted-foreground": "oklch(0.708 0.03 293)",
      accent: "oklch(0.269 0.04 293)",
      "accent-foreground": "oklch(0.985 0 0)",
      ring: "oklch(0.641 0.241 293)",
      "sidebar-primary": "oklch(0.641 0.241 293)",
    },
  },
]
