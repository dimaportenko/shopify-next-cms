import type { ComponentConfig } from "@puckeditor/core";

export interface SpacerProps {
  size: "sm" | "md" | "lg" | "xl";
}

function SpacerRender({ size }: SpacerProps) {
  const sizeClass =
    size === "sm"
      ? "h-8"
      : size === "lg"
        ? "h-24"
        : size === "xl"
          ? "h-40"
          : "h-16";

  return <div className={sizeClass} />;
}

export const spacerConfig: ComponentConfig<SpacerProps> = {
  fields: {
    size: {
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
  },
  defaultProps: {
    size: "md",
  },
  render: SpacerRender,
};
