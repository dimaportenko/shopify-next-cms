"use client"

import { useCallback, useState } from "react"
import { Check, Copy, Palette, RotateCcw, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useThemeCustomizer } from "@/hooks/use-theme-customizer"
import type { ThemeColors } from "@/lib/theme-presets"

const COLOR_GROUPS: { label: string; keys: (keyof ThemeColors)[] }[] = [
  {
    label: "Brand",
    keys: ["primary", "primary-foreground", "secondary", "secondary-foreground"],
  },
  {
    label: "Base",
    keys: ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"],
  },
  {
    label: "UI",
    keys: ["muted", "muted-foreground", "accent", "accent-foreground", "destructive"],
  },
  {
    label: "Borders",
    keys: ["border", "input", "ring"],
  },
]

function ColorSwatch({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs capitalize">{label.replace(/-/g, " ")}</Label>
      <Input
        className="h-7 w-40 font-mono text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function PresetButton({
  label,
  active,
  primaryColor,
  onClick,
}: {
  label: string
  active: boolean
  primaryColor: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
        active
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      <span
        className="size-4 rounded-full border"
        style={{ backgroundColor: primaryColor }}
      />
      <span>{label}</span>
      {active && <Check className="ml-auto size-3" />}
    </button>
  )
}

export function ThemeCustomizer() {
  const { resolvedTheme, setTheme } = useTheme()
  const {
    state,
    presets,
    applyPreset,
    setRadius,
    setColor,
    reset,
    generateCSS,
  } = useThemeCustomizer()

  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    const css = generateCSS()
    await navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generateCSS])

  const currentMode = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" />}>
        <Palette className="size-4" />
        <span className="sr-only">Customize theme</span>
      </SheetTrigger>
      <SheetContent className="w-[400px] p-0 sm:max-w-[400px]">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetDescription>
            Customize colors, radius, and more. Copy the CSS when done.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-10rem)] px-6">
          <div className="flex flex-col gap-6 pb-8">
            {/* Mode toggle */}
            <div className="flex flex-col gap-2">
              <Label>Mode</Label>
              <div className="flex gap-2">
                <Button
                  variant={currentMode === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="mr-1 size-3.5" />
                  Light
                </Button>
                <Button
                  variant={currentMode === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="mr-1 size-3.5" />
                  Dark
                </Button>
              </div>
            </div>

            <Separator />

            {/* Presets */}
            <div className="flex flex-col gap-2">
              <Label>Presets</Label>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    label={preset.label}
                    active={state.preset === preset.name}
                    primaryColor={preset.light.primary}
                    onClick={() => applyPreset(preset)}
                  />
                ))}
              </div>
            </div>

            <Separator />

            {/* Radius */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Radius</Label>
                <span className="text-muted-foreground text-xs font-mono">
                  {state.radius.toFixed(2)}rem
                </span>
              </div>
              <Slider
                value={[state.radius]}
                min={0}
                max={2}
                step={0.05}
                onValueChange={(value) => {
                  const v = Array.isArray(value) ? value[0] : value
                  if (v != null) setRadius(v)
                }}
              />
              <div className="flex gap-2">
                {[0, 0.3, 0.5, 0.75, 1].map((r) => (
                  <button
                    key={r}
                    className={`flex h-8 flex-1 items-center justify-center rounded-md border text-xs ${
                      state.radius === r
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setRadius(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <Tabs defaultValue="brand">
              <TabsList className="w-full">
                {COLOR_GROUPS.map((group) => (
                  <TabsTrigger key={group.label} value={group.label.toLowerCase()} className="flex-1">
                    {group.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {COLOR_GROUPS.map((group) => (
                <TabsContent
                  key={group.label}
                  value={group.label.toLowerCase()}
                  className="flex flex-col gap-3 pt-2"
                >
                  {group.keys.map((key) => (
                    <ColorSwatch
                      key={key}
                      label={key}
                      value={state[currentMode][key]}
                      onChange={(v) => setColor(key, v, currentMode)}
                    />
                  ))}
                </TabsContent>
              ))}
            </Tabs>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={reset}>
                <RotateCcw className="mr-1 size-3.5" />
                Reset
              </Button>
              <Button size="sm" className="flex-1" onClick={handleCopy}>
                {copied ? (
                  <Check className="mr-1 size-3.5" />
                ) : (
                  <Copy className="mr-1 size-3.5" />
                )}
                {copied ? "Copied!" : "Copy CSS"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
