import type { ComponentConfig } from "@puckeditor/core";
import type { Alignment } from "./shared";
import { ALIGNMENT_OPTIONS } from "./shared";

export interface TextBlockProps {
  content: string;
  alignment: Alignment;
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
      options: ALIGNMENT_OPTIONS as unknown as {
        label: string;
        value: string;
      }[],
    },
  },
  defaultProps: {
    content: "Enter your text here...",
    alignment: "left",
  },
  render: TextBlockRender,
};
