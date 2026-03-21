import type { ComponentConfig } from "@puckeditor/core";
import type { Alignment } from "./shared";
import { ALIGNMENT_OPTIONS } from "./shared";

export interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  alignment: Alignment;
}

function HeroRender({
  title,
  subtitle,
  ctaText,
  ctaLink,
  alignment,
}: HeroProps) {
  const alignClass =
    alignment === "center"
      ? "text-center items-center"
      : alignment === "right"
        ? "text-right items-end"
        : "text-left items-start";

  return (
    <section className="bg-muted/30 py-16 sm:py-24 lg:py-32">
      <div
        className={`mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8 ${alignClass}`}
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {subtitle}
          </p>
        )}
        {ctaText && (
          <a
            href={ctaLink || "#"}
            className="inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}

export const heroConfig: ComponentConfig<HeroProps> = {
  fields: {
    title: { type: "text" },
    subtitle: { type: "textarea" },
    ctaText: { type: "text" },
    ctaLink: { type: "text" },
    alignment: {
      type: "select",
      options: ALIGNMENT_OPTIONS as unknown as {
        label: string;
        value: string;
      }[],
    },
  },
  defaultProps: {
    title: "Welcome to our store",
    subtitle: "Discover amazing products curated just for you.",
    ctaText: "Shop Now",
    ctaLink: "/",
    alignment: "center",
  },
  render: HeroRender,
};
