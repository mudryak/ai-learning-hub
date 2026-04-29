import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import type { Resource } from "@/types/resource";
import ResourceList from "@/components/ResourceList";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/UserMenu";
import SuggestButton from "@/components/SuggestButton";

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function mapResource(row: Record<string, unknown>): Resource {
  return {
    id: row.id as string,
    title: row.title as string,
    url: row.url as string,
    type: row.type as Resource["type"],
    category: row.category as Resource["category"],
    tags: row.tags as string[],
    description: row.description as string,
    takeaways: row.takeaways as string[],
    addedAt: row.added_at as string,
    badge: (row.badge as string | null) ?? null,
  };
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data }, { data: { user } }] = await Promise.all([
    supabase.from("resources").select("*").order("added_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const resources: Resource[] = (data ?? []).map(mapResource);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              <BookIcon />
              AI Shelf
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
              {resources.length} books
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SuggestButton />
            <UserMenu isAdmin={isAdmin(user?.email)} />
            <ThemeToggle />
          </div>
        </header>
        <ResourceList resources={resources} />
      </div>
    </main>
  );
}
