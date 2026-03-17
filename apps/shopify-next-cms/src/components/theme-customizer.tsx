"use client";

import { useCallback, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Palette,
  RotateCcw,
  Sun,
  Moon,
  Type,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  useThemeCustomizer,
  type HslAdjustments,
} from "@/hooks/use-theme-customizer";
import type {
  ThemeColors,
  ThemeTypography,
  ThemeShadow,
} from "@/lib/theme-presets";

// --- Color Groups (tweakcn-style grouping) ---

const COLOR_GROUPS: {
  label: string;
  keys: { key: keyof ThemeColors; label: string }[];
  defaultOpen?: boolean;
}[] = [
  {
    label: "Primary",
    defaultOpen: true,
    keys: [
      { key: "primary", label: "Background" },
      { key: "primary-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Secondary",
    defaultOpen: true,
    keys: [
      { key: "secondary", label: "Background" },
      { key: "secondary-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Accent",
    keys: [
      { key: "accent", label: "Background" },
      { key: "accent-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Base",
    keys: [
      { key: "background", label: "Background" },
      { key: "foreground", label: "Foreground" },
    ],
  },
  {
    label: "Card",
    keys: [
      { key: "card", label: "Background" },
      { key: "card-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Popover",
    keys: [
      { key: "popover", label: "Background" },
      { key: "popover-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Muted",
    keys: [
      { key: "muted", label: "Background" },
      { key: "muted-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Destructive",
    keys: [
      { key: "destructive", label: "Background" },
      { key: "destructive-foreground", label: "Foreground" },
    ],
  },
  {
    label: "Border & Input",
    keys: [
      { key: "border", label: "Border" },
      { key: "input", label: "Input" },
      { key: "ring", label: "Ring" },
    ],
  },
  {
    label: "Chart",
    keys: [
      { key: "chart-1", label: "Chart 1" },
      { key: "chart-2", label: "Chart 2" },
      { key: "chart-3", label: "Chart 3" },
      { key: "chart-4", label: "Chart 4" },
      { key: "chart-5", label: "Chart 5" },
    ],
  },
  {
    label: "Sidebar",
    keys: [
      { key: "sidebar", label: "Background" },
      { key: "sidebar-foreground", label: "Foreground" },
      { key: "sidebar-primary", label: "Primary" },
      { key: "sidebar-primary-foreground", label: "Primary Foreground" },
      { key: "sidebar-accent", label: "Accent" },
      { key: "sidebar-accent-foreground", label: "Accent Foreground" },
      { key: "sidebar-border", label: "Border" },
      { key: "sidebar-ring", label: "Ring" },
    ],
  },
];

// --- Shared sub-components ---

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-1 py-1.5 text-sm font-medium hover:bg-muted/50">
        <span>{title}</span>
        <ChevronDown
          className={`size-4 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-1">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function ColorSwatch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="color"
        className="h-7 w-7 shrink-0 cursor-pointer rounded border p-0.5"
        value={oklchToHexApprox(value)}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="text-xs text-muted-foreground w-24 shrink-0">
        {label}
      </span>
      <Input
        className="h-7 flex-1 font-mono text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SliderWithInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            className="h-7 w-16 font-mono text-xs text-right"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          />
          <span className="text-xs text-muted-foreground w-6">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => {
          const val = Array.isArray(v) ? v[0] : v;
          if (val != null) onChange(val);
        }}
      />
    </div>
  );
}

function PresetButton({
  label,
  active,
  primaryColor,
  onClick,
}: {
  label: string;
  active: boolean;
  primaryColor: string;
  onClick: () => void;
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
  );
}

// --- Approximate oklch -> hex for color input (best-effort) ---
function oklchToHexApprox(value: string): string {
  if (value.startsWith("#")) return value;
  // Try to extract oklch values and approximate to hex via sRGB
  const match = value.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+%?)?\s*\)/,
  );
  if (!match) return "#888888";
  const L = parseFloat(match[1]!);
  const C = parseFloat(match[2]!);
  const h = parseFloat(match[3]!);

  // oklch -> oklab
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);

  // oklab -> linear sRGB (approximate)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Linear -> sRGB gamma
  const toSrgb = (x: number) => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  r = toSrgb(r);
  g = toSrgb(g);
  bl = toSrgb(bl);

  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

// --- Colors Tab ---

function ColorsTab({
  colors,
  mode,
  onColorChange,
}: {
  colors: ThemeColors;
  mode: "light" | "dark";
  onColorChange: (
    key: keyof ThemeColors,
    value: string,
    mode: "light" | "dark",
  ) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredGroups = COLOR_GROUPS.map((group) => ({
    ...group,
    keys: group.keys.filter(
      (k) =>
        !search ||
        k.key.toLowerCase().includes(search.toLowerCase()) ||
        k.label.toLowerCase().includes(search.toLowerCase()) ||
        group.label.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((g) => g.keys.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Search colors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-8 text-xs"
      />
      {filteredGroups.map((group) => (
        <CollapsibleSection
          key={group.label}
          title={group.label}
          defaultOpen={group.defaultOpen}
        >
          <div className="flex flex-col gap-2">
            {group.keys.map((k) => (
              <ColorSwatch
                key={k.key}
                label={k.label}
                value={colors[k.key]}
                onChange={(v) => onColorChange(k.key, v, mode)}
              />
            ))}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  );
}

// --- Typography Tab ---

const FONT_PRESETS = {
  sans: [
    {
      label: "System Default",
      value:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    },
    { label: "Inter", value: '"Inter", sans-serif' },
    { label: "Geist", value: '"Geist", sans-serif' },
    { label: "DM Sans", value: '"DM Sans", sans-serif' },
    { label: "Plus Jakarta Sans", value: '"Plus Jakarta Sans", sans-serif' },
    { label: "Manrope", value: '"Manrope", sans-serif' },
  ],
  serif: [
    {
      label: "System Default",
      value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
    { label: "Merriweather", value: '"Merriweather", serif' },
    { label: "Playfair Display", value: '"Playfair Display", serif' },
    { label: "Lora", value: '"Lora", serif' },
    { label: "Crimson Text", value: '"Crimson Text", serif' },
  ],
  mono: [
    {
      label: "System Default",
      value:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    { label: "JetBrains Mono", value: '"JetBrains Mono", monospace' },
    { label: "Fira Code", value: '"Fira Code", monospace' },
    { label: "Source Code Pro", value: '"Source Code Pro", monospace' },
    { label: "IBM Plex Mono", value: '"IBM Plex Mono", monospace' },
  ],
};

function FontSelect({
  label,
  value,
  presets,
  onChange,
}: {
  label: string;
  value: string;
  presets: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  const currentPreset = presets.find((p) => p.value === value);

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs">{label}</Label>
      <select
        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
        value={currentPreset ? value : "__custom__"}
        onChange={(e) => {
          if (e.target.value !== "__custom__") {
            onChange(e.target.value);
          }
        }}
      >
        {presets.map((p) => (
          <option key={p.label} value={p.value}>
            {p.label}
          </option>
        ))}
        {!currentPreset && <option value="__custom__">Custom</option>}
      </select>
      <Input
        className="h-7 font-mono text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Font family value..."
      />
    </div>
  );
}

function TypographyTab({
  typography,
  onTypographyChange,
}: {
  typography: ThemeTypography;
  onTypographyChange: (key: keyof ThemeTypography, value: string) => void;
}) {
  const letterSpacing = parseFloat(typography["letter-spacing"]) || 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
        <Type className="size-3.5 shrink-0" />
        <span>
          Custom fonts require embedding via{" "}
          <code className="font-mono">next/font</code> or a CDN link.
        </span>
      </div>

      <CollapsibleSection title="Font Family" defaultOpen>
        <div className="flex flex-col gap-4">
          <FontSelect
            label="Sans-Serif"
            value={typography["font-sans"]}
            presets={FONT_PRESETS.sans}
            onChange={(v) => onTypographyChange("font-sans", v)}
          />
          <FontSelect
            label="Serif"
            value={typography["font-serif"]}
            presets={FONT_PRESETS.serif}
            onChange={(v) => onTypographyChange("font-serif", v)}
          />
          <FontSelect
            label="Mono"
            value={typography["font-mono"]}
            presets={FONT_PRESETS.mono}
            onChange={(v) => onTypographyChange("font-mono", v)}
          />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Letter Spacing" defaultOpen>
        <SliderWithInput
          label="Tracking"
          value={letterSpacing}
          min={-0.1}
          max={0.2}
          step={0.005}
          unit="em"
          onChange={(v) => onTypographyChange("letter-spacing", `${v}em`)}
        />
      </CollapsibleSection>
    </div>
  );
}

// --- HSL Adjustment Presets ---

const HSL_PRESETS: {
  label: string;
  adjustments: HslAdjustments;
}[] = [
  {
    label: "+30\u00b0",
    adjustments: { hueShift: 30, saturationScale: 1, lightnessScale: 1 },
  },
  {
    label: "+60\u00b0",
    adjustments: { hueShift: 60, saturationScale: 1, lightnessScale: 1 },
  },
  {
    label: "+90\u00b0",
    adjustments: { hueShift: 90, saturationScale: 1, lightnessScale: 1 },
  },
  {
    label: "+120\u00b0",
    adjustments: { hueShift: 120, saturationScale: 1, lightnessScale: 1 },
  },
  {
    label: "+150\u00b0",
    adjustments: { hueShift: 150, saturationScale: 1, lightnessScale: 1 },
  },
  {
    label: "+180\u00b0",
    adjustments: { hueShift: 180, saturationScale: 1, lightnessScale: 1 },
  },
  {
    label: "Grayscale",
    adjustments: { hueShift: 0, saturationScale: 0, lightnessScale: 1 },
  },
  {
    label: "Muted",
    adjustments: { hueShift: 0, saturationScale: 0.5, lightnessScale: 1 },
  },
  {
    label: "Vibrant",
    adjustments: { hueShift: 0, saturationScale: 1.5, lightnessScale: 1 },
  },
  {
    label: "Dimmer",
    adjustments: { hueShift: 0, saturationScale: 1, lightnessScale: 0.8 },
  },
  {
    label: "Brighter",
    adjustments: { hueShift: 0, saturationScale: 1, lightnessScale: 1.2 },
  },
  {
    label: "Warm Muted",
    adjustments: { hueShift: 30, saturationScale: 0.6, lightnessScale: 1.1 },
  },
  {
    label: "Cool Vibrant",
    adjustments: { hueShift: -30, saturationScale: 1.4, lightnessScale: 0.95 },
  },
  {
    label: "Pastel",
    adjustments: { hueShift: 0, saturationScale: 0.4, lightnessScale: 1.3 },
  },
  {
    label: "Deep",
    adjustments: { hueShift: 0, saturationScale: 1.3, lightnessScale: 0.7 },
  },
];

// --- Other Tab ---

function OtherTab({
  radius,
  spacing,
  shadow,
  hslAdjustments,
  onRadiusChange,
  onSpacingChange,
  onShadowChange,
  onHslAdjustmentsChange,
  onHslReset,
}: {
  radius: number;
  spacing: number;
  shadow: ThemeShadow;
  hslAdjustments: HslAdjustments;
  onRadiusChange: (value: number) => void;
  onSpacingChange: (value: number) => void;
  onShadowChange: (key: keyof ThemeShadow, value: string) => void;
  onHslAdjustmentsChange: (adjustments: HslAdjustments) => void;
  onHslReset: () => void;
}) {
  const shadowOpacity = parseFloat(shadow["shadow-opacity"]) || 0;
  const shadowBlur = parseFloat(shadow["shadow-blur"]) || 0;
  const shadowSpread = parseFloat(shadow["shadow-spread"]) || 0;
  const shadowOffsetX = parseFloat(shadow["shadow-offset-x"]) || 0;
  const shadowOffsetY = parseFloat(shadow["shadow-offset-y"]) || 0;

  const isAdjusted =
    hslAdjustments.hueShift !== 0 ||
    hslAdjustments.saturationScale !== 1 ||
    hslAdjustments.lightnessScale !== 1;

  return (
    <div className="flex flex-col gap-4">
      <CollapsibleSection title="HSL Adjustments" defaultOpen>
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {HSL_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => onHslAdjustmentsChange(preset.adjustments)}
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted/50 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <SliderWithInput
            label="Hue"
            value={hslAdjustments.hueShift}
            min={-180}
            max={180}
            step={1}
            unit="deg"
            onChange={(v) =>
              onHslAdjustmentsChange({ ...hslAdjustments, hueShift: v })
            }
          />
          <SliderWithInput
            label="Saturation"
            value={hslAdjustments.saturationScale}
            min={0}
            max={2}
            step={0.05}
            unit="x"
            onChange={(v) =>
              onHslAdjustmentsChange({
                ...hslAdjustments,
                saturationScale: v,
              })
            }
          />
          <SliderWithInput
            label="Lightness"
            value={hslAdjustments.lightnessScale}
            min={0.2}
            max={2}
            step={0.05}
            unit="x"
            onChange={(v) =>
              onHslAdjustmentsChange({
                ...hslAdjustments,
                lightnessScale: v,
              })
            }
          />
          {isAdjusted && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onHslReset}
            >
              <RotateCcw className="mr-1 size-3" />
              Reset Adjustments
            </Button>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Radius" defaultOpen>
        <div className="flex flex-col gap-3">
          <SliderWithInput
            label="Radius"
            value={radius}
            min={0}
            max={2}
            step={0.025}
            unit="rem"
            onChange={onRadiusChange}
          />
          <div className="flex gap-2">
            {[0, 0.3, 0.5, 0.75, 1].map((r) => (
              <button
                key={r}
                className={`flex h-8 flex-1 items-center justify-center rounded-md border text-xs ${
                  radius === r ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => onRadiusChange(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Spacing">
        <SliderWithInput
          label="Spacing"
          value={spacing}
          min={0.1}
          max={0.5}
          step={0.025}
          unit="rem"
          onChange={onSpacingChange}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Shadow">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Input
              type="color"
              className="h-7 w-7 shrink-0 cursor-pointer rounded border p-0.5"
              value={oklchToHexApprox(shadow["shadow-color"])}
              onChange={(e) => onShadowChange("shadow-color", e.target.value)}
            />
            <span className="text-xs text-muted-foreground w-16 shrink-0">
              Color
            </span>
            <Input
              className="h-7 flex-1 font-mono text-xs"
              value={shadow["shadow-color"]}
              onChange={(e) => onShadowChange("shadow-color", e.target.value)}
            />
          </div>
          <SliderWithInput
            label="Opacity"
            value={shadowOpacity}
            min={0}
            max={1}
            step={0.05}
            unit=""
            onChange={(v) => onShadowChange("shadow-opacity", String(v))}
          />
          <SliderWithInput
            label="Blur"
            value={shadowBlur}
            min={0}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => onShadowChange("shadow-blur", `${v}px`)}
          />
          <SliderWithInput
            label="Spread"
            value={shadowSpread}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => onShadowChange("shadow-spread", `${v}px`)}
          />
          <SliderWithInput
            label="Offset X"
            value={shadowOffsetX}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => onShadowChange("shadow-offset-x", `${v}px`)}
          />
          <SliderWithInput
            label="Offset Y"
            value={shadowOffsetY}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(v) => onShadowChange("shadow-offset-y", `${v}px`)}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

// --- Main Component ---

export function ThemeCustomizer() {
  const { resolvedTheme, setTheme } = useTheme();
  const {
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
  } = useThemeCustomizer();

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const css = generateCSS();
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateCSS]);

  const currentMode = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="icon" />}>
        <Palette className="size-4" />
        <span className="sr-only">Customize theme</span>
      </SheetTrigger>
      <SheetContent
        className="w-105 p-0 sm:max-w-105"
        overlayClassName="bg-background/0 supports-backdrop-filter:backdrop-blur-none"
      >
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetDescription>
            Customize colors, typography, radius, shadows, and more.
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

            {/* Main Tabs: Colors / Typography / Other */}
            <Tabs defaultValue="colors">
              <TabsList className="w-full">
                <TabsTrigger value="colors" className="flex-1 gap-1">
                  <Palette className="size-3.5" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex-1 gap-1">
                  <Type className="size-3.5" />
                  Typography
                </TabsTrigger>
                <TabsTrigger value="other" className="flex-1 gap-1">
                  <SlidersHorizontal className="size-3.5" />
                  Other
                </TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="pt-3">
                <ColorsTab
                  colors={state[currentMode]}
                  mode={currentMode}
                  onColorChange={setColor}
                />
              </TabsContent>

              <TabsContent value="typography" className="pt-3">
                <TypographyTab
                  typography={state.typography}
                  onTypographyChange={setTypography}
                />
              </TabsContent>

              <TabsContent value="other" className="pt-3">
                <OtherTab
                  radius={state.radius}
                  spacing={state.spacing}
                  shadow={state.shadow}
                  hslAdjustments={state.hslAdjustments}
                  onRadiusChange={setRadius}
                  onSpacingChange={setSpacing}
                  onShadowChange={setShadow}
                  onHslAdjustmentsChange={applyHslAdjustments}
                  onHslReset={resetHslAdjustments}
                />
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={reset}
              >
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
  );
}
