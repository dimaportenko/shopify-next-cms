import Link from "next/link";
import { listCmsPages } from "@/lib/shopify/queries/cms-pages";
import { DeletePageButton } from "@cms/_components/editor/delete-page-button";
import { CmsDashboardThemeToggle } from "@cms/_components/editor/cms-dashboard-theme-toggle";

export default async function CmsDashboard() {
  const pages = await listCmsPages();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">CMS Pages</h1>
        <div className="flex items-center gap-3">
          <CmsDashboardThemeToggle />
          <Link
            href="/cms/new"
            className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            New Page
          </Link>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">
            No pages yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border bg-card text-card-foreground">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">{page.title}</h2>
                  <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {page.pageType}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  /{page.slug} &middot;{" "}
                  <span
                    className={
                      page.status === "published"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {page.status}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/cms/${page.pageType}/${page.slug}/edit`}
                  className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Edit
                </Link>
                {page.status === "published" && (
                  <Link
                    href={`/${page.slug}`}
                    className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    target="_blank"
                  >
                    View
                  </Link>
                )}
                <DeletePageButton pageId={page.id} pageTitle={page.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
