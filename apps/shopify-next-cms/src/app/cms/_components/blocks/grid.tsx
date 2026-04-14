import type { ComponentConfig, Slot } from "@puckeditor/core";

export interface GridProps {
  numColumns: number;
  gap: number;
  items: Slot;
}

export const gridConfig: ComponentConfig<GridProps> = {
  fields: {
    numColumns: {
      type: "number",
      label: "Number of columns",
      min: 1,
      max: 12,
    },
    gap: {
      type: "number",
      label: "Gap",
      min: 0,
    },
    items: {
      type: "slot",
    },
  },
  defaultProps: {
    numColumns: 3,
    gap: 24,
    items: [],
  },
  render: ({ numColumns, gap, items: Items }) => (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Items
          className="grid"
          style={{
            gap,
            gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))`,
          }}
        />
      </div>
    </section>
  ),
};
