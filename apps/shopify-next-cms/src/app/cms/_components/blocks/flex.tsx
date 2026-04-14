import type { ComponentConfig, Slot } from "@puckeditor/core";

export interface FlexProps {
  justifyContent: "start" | "center" | "end";
  direction: "row" | "column";
  gap: number;
  wrap: "wrap" | "nowrap";
  items: Slot;
}

export const flexConfig: ComponentConfig<FlexProps> = {
  fields: {
    direction: {
      label: "Direction",
      type: "radio",
      options: [
        { label: "Row", value: "row" },
        { label: "Column", value: "column" },
      ],
    },
    justifyContent: {
      label: "Justify Content",
      type: "radio",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
    gap: {
      label: "Gap",
      type: "number",
      min: 0,
    },
    wrap: {
      label: "Wrap",
      type: "radio",
      options: [
        { label: "true", value: "wrap" },
        { label: "false", value: "nowrap" },
      ],
    },
    items: {
      type: "slot",
    },
  },
  defaultProps: {
    justifyContent: "start",
    direction: "row",
    gap: 24,
    wrap: "wrap",
    items: [],
  },
  render: ({ justifyContent, direction, gap, wrap, items: Items }) => (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Items
          className="flex"
          style={{
            justifyContent,
            flexDirection: direction,
            gap,
            flexWrap: wrap,
          }}
        />
      </div>
    </section>
  ),
};
