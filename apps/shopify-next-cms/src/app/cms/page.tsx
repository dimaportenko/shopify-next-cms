import Link from "next/link";
import { listCmsPages } from "@/lib/shopify/queries/cms-pages";
import { DeletePageButton } from "./_components/delete-page-button";

export default async function CmsDashboard() {
  const pages = await listCmsPages();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">CMS Pages</h1>
        <Link
          href="/cms/new"
          className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">
            No pages yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <h2 className="font-medium">{page.title}</h2>
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
                  href={`/cms/${page.slug}/edit`}
                  className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
                >
                  Edit
                </Link>
                {page.status === "published" && (
                  <Link
                    href={`/${page.slug}`}
                    className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
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
