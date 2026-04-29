import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/admin";
import ResourceBadgeCell from "@/components/ResourceBadgeCell";

export default async function AdminResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    redirect("/");
  }

  const adminClient = createAdminClient();
  const { data: resources } = await adminClient
    .from("resources")
    .select("id, title, category, badge")
    .order("added_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="mb-2 flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-zinc-700 dark:hover:text-zinc-200">← Home</Link>
          <Link href="/admin/suggestions" className="hover:text-zinc-700 dark:hover:text-zinc-200">Suggestions</Link>
          <span className="font-medium text-zinc-900 dark:text-zinc-50">Resources</span>
        </nav>

        <header className="mb-8 mt-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Resource badges</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Set or clear a badge for any resource. Badges appear on cards and detail pages.
          </p>
        </header>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left dark:border-zinc-800">
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Title</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400">Badge</th>
              </tr>
            </thead>
            <tbody>
              {(resources ?? []).map((r) => (
                <tr key={r.id} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800">
                  <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                    <Link href={`/${r.id}`} className="hover:underline">{r.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 hidden sm:table-cell">
                    {r.category}
                  </td>
                  <td className="px-4 py-3">
                    <ResourceBadgeCell
                      resourceId={r.id}
                      initialBadge={r.badge ?? null}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
