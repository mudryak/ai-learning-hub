import { notFound } from "next/navigation";
import Link from "next/link";
import resources from "@/data/resources.json";
import type { Resource } from "@/types/resource";
import ReadToggle from "@/components/ReadToggle";
import StarRating from "@/components/StarRating";

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

const TAG_COLORS = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
] as const;

function tagColor(tag: string): string {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = (h * 31 + tag.charCodeAt(i)) & 0xffff;
  }
  return TAG_COLORS[h % TAG_COLORS.length];
}

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
              <BookIcon />
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                {resource.type} · {resource.category}
              </span>
              <ReadToggle resourceId={resource.id} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug mt-1">
              {resource.title}
            </h1>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              {resource.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1">
              {resource.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${tagColor(tag)}`}
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

          <footer className="flex flex-wrap items-center gap-3">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Open resource →
            </a>
            <StarRating resourceId={resource.id} />
            <span className="text-xs text-zinc-400">
              Added {new Date(resource.addedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </footer>
        </article>
      </div>
    </main>
  );
}
