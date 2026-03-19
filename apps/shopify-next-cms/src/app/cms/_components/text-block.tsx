import type { ComponentConfig } from "@puckeditor/core";

export interface TextBlockProps {
  content: string;
  alignment: "left" | "center" | "right";
}

function TextBlockRender({ content, alignment }: TextBlockProps) {
  const alignClass =
    alignment === "center"
      ? "text-center"
      : alignment === "right"
        ? "text-right"
        : "text-left";

  return (
    <section className="py-8 sm:py-12">
      <div className={`mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 ${alignClass}`}>
        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </section>
  );
}

export const textBlockConfig: ComponentConfig<TextBlockProps> = {
  fields: {
    content: { type: "textarea" },
    alignment: {
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
  },
  defaultProps: {
    content: "Enter your text here...",
    alignment: "left",
  },
  render: TextBlockRender,
};
