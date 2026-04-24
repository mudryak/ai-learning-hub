import { notFound } from "next/navigation";
import Link from "next/link";
import resources from "@/data/resources.json";
import type { Resource } from "@/types/resource";
import ReadToggle from "@/components/ReadToggle";

const allResources = resources as Resource[];

export function generateStaticParams() {
  return allResources.map((r) => ({ id: r.id }));
}

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = allResources.find((r) => r.id === id);

  if (!resource) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← Back to all resources
          </Link>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {resource.type} · {resource.category}
              </span>
              <ReadToggle resourceId={resource.id} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {resource.title}
            </h1>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              {resource.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {resource.takeaways.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Key takeaways
              </h2>
              <ul className="flex flex-col gap-2">
                {resource.takeaways.map((takeaway, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-zinc-300 dark:text-zinc-600">
                      →
                    </span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="flex items-center gap-3">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Open resource →
            </a>
            <span className="text-xs text-zinc-400">
              Added {new Date(resource.addedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </footer>
        </article>
      </div>
    </main>
  );
}
