import type { ReactNode } from "react";
import { Render } from "@puckeditor/core";
import { Header } from "@/components/header";
import { puckConfig } from "@cms/_lib/config";
import { isPublishedFragment } from "@cms/_lib/fragments";
import type { CmsPage } from "@/lib/shopify/types";

export function CmsPageChrome({
  children,
  headerFragment,
  footerFragment,
  headerHidden,
  footerHidden,
}: {
  children: ReactNode;
  headerFragment: CmsPage | null | undefined;
  footerFragment: CmsPage | null | undefined;
  headerHidden: boolean;
  footerHidden: boolean;
}) {
  return (
    <>
      {!headerHidden &&
        (isPublishedFragment(headerFragment) ? (
          <Render config={puckConfig} data={headerFragment.puckData} />
        ) : (
          <Header />
        ))}

      {children}

      {!footerHidden && isPublishedFragment(footerFragment) && (
        <Render config={puckConfig} data={footerFragment.puckData} />
      )}
    </>
  );
}
