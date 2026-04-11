import Link from "next/link";
import { listCmsPages } from "@/lib/shopify/queries/cms-pages";
import { DeletePageButton } from "@cms/_components/editor/delete-page-button";
import { CmsDashboardThemeToggle } from "@cms/_components/editor/cms-dashboard-theme-toggle";
import { editFragmentAction } from "@cms/_lib/actions";
import { FRAGMENT_DEFINITIONS } from "@cms/_lib/fragments";

export default async function CmsDashboard() {
  const allPages = await listCmsPages();
  const pages = allPages.filter((page) => page.pageType !== "fragment");
  const fragmentPages = allPages.filter((page) => page.pageType === "fragment");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Site Fragments</h2>
          <p className="text-sm text-muted-foreground">
            Shared blocks rendered on every page by default.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {FRAGMENT_DEFINITIONS.map((fragment) => {
            const existing = fragmentPages.find(
              (page) => page.slug === fragment.slug,
            );
            return (
              <div
                key={fragment.slug}
                className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{fragment.label}</h3>
                    {existing ? (
                      <span
                        className={
                          existing.status === "published"
                            ? "rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600"
                            : "rounded bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600"
                        }
                      >
                        {existing.status}
                      </span>
                    ) : (
                      <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        not created
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {fragment.description}
                  </p>
                </div>
                <form action={editFragmentAction}>
                  <input type="hidden" name="slug" value={fragment.slug} />
                  <button
                    type="submit"
                    className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    Edit
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </section>

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
