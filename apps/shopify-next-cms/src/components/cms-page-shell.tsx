import type { ReactNode } from "react";
import { CmsPageChrome } from "@/components/cms-page-chrome";
import { getCmsRootProps, isHidden } from "@cms/_lib/fragments";
import { getCmsFragment } from "@/lib/shopify/queries/cms-fragments";
import type { CmsPage } from "@/lib/shopify/types";

export async function CmsPageShell({
  page,
  children,
}: {
  page: CmsPage | null;
  children: ReactNode;
}) {
  const rootProps = getCmsRootProps(page);
  const headerHidden = isHidden(rootProps.hideHeader);
  const footerHidden = isHidden(rootProps.hideFooter);

  const [headerFragment, footerFragment] = await Promise.all([
    headerHidden ? null : getCmsFragment("header"),
    footerHidden ? null : getCmsFragment("footer"),
  ]);

  return (
    <CmsPageChrome
      headerFragment={headerFragment}
      footerFragment={footerFragment}
      headerHidden={headerHidden}
      footerHidden={footerHidden}
    >
      {children}
    </CmsPageChrome>
  );
}
