import type { ComponentConfig } from "@puckeditor/core";
import { Header } from "@/components/header";

export type HeaderBlockProps = Record<string, never>;

function HeaderBlockRender() {
  return <Header />;
}

export const headerBlockConfig: ComponentConfig<HeaderBlockProps> = {
  fields: {},
  defaultProps: {},
  render: HeaderBlockRender,
};
